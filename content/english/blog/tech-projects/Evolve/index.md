---
aliases:
  - "/blog/tech-project/evolve/"
title: "Evolve: two backends, one UI, and a sync engine that kept lying about it"
description: "A build-story on Evolve's private-mode CloudKit sync engine, revised so every claim is checkable against the mattioli.OS source."
slug: evolve
date: 2026-08-08
# DRAFT: the body contains [SIMONE: ...] markers where the repo documents WHAT was
# built but not WHY. Those are questions only Simone can answer. Answer them, delete
# the markers, then set draft: false. Do not publish with markers in place.
draft: true
tags: ["flutter", "cloudkit", "sqlite", "end-to-end-encryption", "sync", "postmortem"]
comments: false

links:
  - title: GitHub Repository
    description: Source code for the app
    website: https://github.com/simo-hue/Evolve
  - title: App Store
    description: Download the app
    website: https://apps.apple.com/app/evolve-habits-goal-tracker/id6770482363
  - title: Product Page
    description: Features and screenshots
    website: https://simo-hue.github.io/evolve/
---

## What is actually in the repo

Evolve lives in a monorepo, `mattioli.OS`: two Flutter clients — `mobile/` (iOS, iPadOS, Android) and `desktop/` (macOS, Windows, Linux) — a React web client, a Postgres schema with migrations, and four shared Dart packages. Mobile is 142 Dart files in `lib/` and 109 test files; desktop 149 and 105. CI covers both Flutter clients and the shared packages, not the web client, under `TZ: Europe/Rome`, set because a UTC runner, having no DST transition, would leave every DST-sensitive test inert.

[SIMONE: why Flutter for both clients rather than native?]

## Two backends behind one UI

The app has two data modes: `AppDataMode` is `supabase` or `private`, and 19 files under `mobile/lib` reference it. Private data lives in a SQLCipher-encrypted database, reached by every mode-aware provider only through a `PrivateDataStore` interface whose doc comment states its purpose: a fake swaps in, and a test proves private-mode CRUD never reaches the network.

[SIMONE: why a full parallel local store rather than an offline cache over the cloud one?]

Private mode has no account, and no server of mine holding the data. The plan's stated goal was convergence across the user's own Apple devices, via their personal iCloud, end-to-end encrypted. Android sync is a permanent no-op; desktop gates on `Platform.isMacOS`.

[SIMONE: was iCloud the only option, or did you weigh alternatives?]

## Record-per-row CloudKit, with the crypto in Dart

The design is in `mobile/ICLOUD_SYNC_PLAN.md`: one encrypted record per local row, in a custom zone of the user's private CloudKit database, under one record type. `recordName` is `"<table>:<uuid>"` — deterministic, so two devices address the same record without coordinating. Conflicts resolve last-write-wins on the row's own `updated_at`, not the server's `modificationDate`: a late-uploading offline edit still loses to a genuinely later one.

AES-256-GCM runs in Dart via pointycastle; per the crypto file's header, the Swift layer only ever sees ciphertext. The 256-bit key lives in the iCloud Keychain with `synchronizable: true`, separate from the device-local SQLCipher key. There is no up-front key check — the plan specified a `keycheck` record that was never built. What shipped is detection after the fact: a record sealed under a key this device does not hold is classified `undecryptable`, not merely `skipped`, and counted separately so the app can name a key problem instead of reporting a silent, permanently-empty sync.

Dirty tracking is SQLite triggers on the nine synced tables writing into `sync_state`, with tombstones on delete. Only the apply step clears `dirty` — the plan's invariant, and what stops a pulled record bouncing back. `SyncEngine` talks to an abstract `CloudKitBridge`, and 13 of the sync package's 36 test files drive it against a fake in-memory zone with real delta-fetch-token semantics.

## One bug wearing different clothes

`ICLOUD_SYNC_STATE.md` §0 names the pattern: everything that went wrong here was one bug wearing different clothes — the system reported success while failing.

The plainest was `last_full_sync_at`, stamped unconditionally after the push. A push in which every record was rejected returned normally, and the status headline fell through to its default, `statusIdle`: "Up to date". A widget test now drives that screen with 5,000 pending items and asserts "Up to date" appears nowhere. `SyncResult` carries `pushFailed`, `pushConflicted` and `pullIncomplete`; the stamp is written only `if (result.fullySynced)`.

`markError` is a bare `UPDATE ... WHERE record_name = ?`, and a record arriving from another device has no `sync_state` row yet, so the error write matched zero rows and vanished while the pull kept the change token. It is still a bare UPDATE: the fix was a second method for the pull path that upserts, because the row it must write about does not exist yet.

`localOnlyColumns` were stripped on push, but `applyUpsert` never subtracted them on apply — it does now. That guarantee held only because every current sender strips; `is_pro` is on it, so a pulled `is_pro = 1` is an in-app-purchase bypass.

The worst came earlier: `applyUpsert` used `ConflictAlgorithm.replace`, which in SQLite deletes before inserting. With foreign keys on and `ON DELETE CASCADE` everywhere, applying a pulled `profiles` record wiped the device's dataset, fired the delete triggers and pushed the tombstones: one profile edit could delete the account everywhere. It now runs foreign-keys-off with update-then-insert.

## The change token is the whole problem

CloudKit will not re-deliver a record your change token has passed, so every hard call in the engine is when to advance it. A transient apply failure holds the token. A record this build can never store is quarantined, so it cannot pin the token forever. Undecryptable records let it advance — the engine stores a fingerprint of the key it last synced with, so a key change clears those parks, drops the token and re-fetches the zone once; the same happens on schema growth.

## Extraction, and what I could not verify

When the Mac client arrived, I moved the sync core into `packages/evolve_sync/` — engine, crypto, local store, bridge contract, fakes — as a path dependency of both apps, on the recorded grounds that the wire format cannot drift between platforms. The key moved into a shared keychain access group, because iCloud Keychain syncs across devices, not across apps.

[SIMONE: the mobile plan lists seven synced tables where the code has nine — are the plans history or spec?]

Two things I have not verified. The Swift bridges typecheck against the real CloudKit framework with `swiftc -typecheck`, but there is no Xcode on my machine, so the retry path — `requestRateLimited`, `serviceUnavailable`, `zoneBusy`, `retryAfterSeconds`, three retries at most — has never run. `PrivateDbSchema.version` is 12 in the code while `ICLOUD_SYNC_STATE.md` §6 still says v11 and puts field builds at v6 or older; the chain test covers v6→v11, the v12 step is not in it, and none of it has run against a real encrypted database.

[SIMONE: no Xcode on the dev machine — deliberate, or just how it ended up?]

[SIMONE: HealthKit measurements in `goal_logs.value` sync rather than sitting in `localOnlyColumns` — an accepted risk against guideline 5.1.3(ii). Why?]
