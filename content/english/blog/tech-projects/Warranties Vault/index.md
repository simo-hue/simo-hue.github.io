---
aliases:
  - "/blog/tech-project/warranties-vault/"
title: "Warranties Vault: a spec, a script-generated project, and a hand-written ZIP"
description: "A build account of Warranties Vault, an offline-first iOS receipt and warranty tracker, written at file and symbol level against the repository."
slug: warranties-vault
date: 2026-08-08
# DRAFT: the body contains [SIMONE: ...] markers where the repo documents WHAT was
# built but not WHY. Those are questions only Simone can answer. Answer them, delete
# the markers, then set draft: false. Do not publish with markers in place.
draft: true
tags: ["iOS", "SwiftUI", "SwiftData", "offline-first", "build log"]
comments: false

links:
  - title: GitHub Repository
    description: Source code for the app
    website: https://github.com/simo-hue/Mobl
  - title: App Store
    description: Download the app
    website: https://apps.apple.com/app/warranties-vault/id6771369236
---

## A spec written for an agent

The repository carries `specifiche_global.md`: 5,726 words of Italian, marked "Versione documento: 2.0". Section 1, "Principi non negoziabili", numbers four: privacy-first, offline-first, global-first, premium and simple. Section 24 lists twenty acceptance criteria. Section 25 lists anti-requirements: no Firebase, no analytics or ad SDKs, no server, no subscriptions, no "hardcoded 24-month warranty as universal legal truth". The header names the reader it was written for: "Codex / agente di sviluppo iOS".

[SIMONE: the spec and the first commit share a date, and that commit landed 100 files at once — did the spec really precede the Swift, and why write it in Italian to an agent?]

It is specific enough to check against the result. Section 11.3 lists eight services and ends with "Evitare view enormi con logica business"; seven of them sit in `Services/` under exactly those names, and the one it hedged — `LocalizationPreviewService`, "se utile nei test" — I never built. Section 8.8's suggested offsets, 30/7/0 days for warranties and 3/1 for returns, are the literal arrays in `PurchaseFormView.addDefaultNotificationRules`.

## Shape of the build

34 Swift files under `ReceiptWarrantyVault/`, three more in tests. SwiftUI over SwiftData, deployment target iOS 17.0, `TARGETED_DEVICE_FAMILY = 1`, portrait only. No Swift packages: the `.pbxproj` has zero `XCRemoteSwiftPackageReference` entries, and no Swift file mentions `URLSession`, `CloudKit` or `StoreKit`. `DOCUMENTATION.md` records StoreKit's absence as deliberate: v1 is paid upfront.

I generated the Xcode project from `tools/create_project.rb`, 92 lines that use the `xcodeproj` gem to glob the sources, attach the asset catalog and string catalogue, and write build settings. The committed file is not purely that script's output: it carries the team ID `8528AN28A3` in six places the script never writes — four `DEVELOPMENT_TEAM` settings and two `DevelopmentTeam` attributes — so Xcode has been over the top of it.

[SIMONE: why generate the pbxproj from a Ruby script rather than manage the project in Xcode?]

## Metadata in the database, bytes on disk

The persistence split is the main decision. SwiftData holds five `@Model` types, four of them hanging off `PurchaseItem` through `@Relationship(deleteRule: .cascade)` collections, and none of the five stores image or PDF data. The bytes go to `Application Support/ReceiptWarrantyVault/Attachments/<purchaseID>/<attachmentID>.<ext>`; `AttachmentRecord` keeps a filename, the original name, a MIME type and a size.

Every stored file gets renamed to a fresh UUID. §13.2: "nomi file generati internamente, non direttamente nomi originali non sanitizzati". The original name never becomes a path component — only its extension carries over, via `sourceURL.pathExtension`. `applyProtection` sets `.completeUntilFirstUserAuthentication` and derives `isExcludedFromBackup` from `includeDocumentsInDeviceBackup`, which I defaulted to true. §13.3 says "Default da decidere".

[SIMONE: why `completeUntilFirstUserAuthentication` rather than `.complete`, and why default the backup toggle on when the spec left it undecided?]

Capture funnels into one write path. `DocumentScannerView` wraps `VNDocumentCameraViewController`; scanned pages get JPEG-encoded at quality 0.88 and land in `temporaryDirectory` as `PendingAttachment` values. Files and Photos import produce the same struct. `storeFile` is called from one place in the app, `PurchaseFormView.importPendingAttachments` during `performSave`, so an abandoned form leaves nothing in the vault. The Photos path sniffs the bytes with `CGImageSourceGetType`, falling back to the picker's suggested types only if that fails.

## Deadlines are derived, never stored

No `@Model` type stores a deadline status. `WarrantyCalculator` is a plain struct, and `status(for:today:soonThresholdDays:)` compares `startOfDay` values, so a deadline later today is never "expired". It takes its `Calendar` by injection and its threshold by parameter; `DeadlinesView` passes 7 for return windows and 30 for warranties, then filters one list into four sections.

That shape is what the tests use: all three in `WarrantyCalculatorTests` are calendar tests. 29 February 2024 plus twelve months lands on 28 February 2025; adding 30 return days yields 30 days; a due date at 01:00 tomorrow, read at 18:00 today, comes back `.expiringSoon`.

[SIMONE: was the injectable `Calendar` there from the start, or did it arrive when you needed the leap-year test?]

## Notifications that can be cancelled

`NotificationRuleRecord` stores a deterministic identifier — `"warranty-<uuid>-<days>"`, `"return-<uuid>-<days>"` — so cancelling is `removePendingNotificationRequests` over the purchase's own rules, with no bookkeeping table. `scheduleNotifications` cancels before it schedules, and skips any fire date not later than `.now`. `requestAuthorizationIfNeeded` prompts only when the status is `notDetermined`; `denied` throws rather than silently no-oping.

Worth flagging: rules are created only inside `performSave`, and only when `notificationsEnabled` is true. The Settings toggle asks for permission on enable and cancels on disable, but never schedules — purchases saved while reminders were off stay silent until they are edited and saved again.

[SIMONE: was the no-backfill behaviour a deliberate v1 cut, or just not reached yet?]

## Writing a ZIP by hand

Backup export produces `metadata.json` with ISO-8601 dates and sorted keys, a `README.txt` saying the archive was created locally, and an `attachments/` tree. I wrote the container myself: `ZipArchiveWriter` is 106 lines emitting local file headers (`0x04034b50`), a central directory and an EOCD record, compression method zero and both size fields equal, plus a bitwise CRC32 loop.

[SIMONE: why hand-write the ZIP container instead of using a library or an archive API?]

The single-purchase PDF is similarly manual: `UIGraphicsPDFRenderer`, an `ensureSpace` helper that starts a new page, and an explicit `UIColor.white` fill with black text, which the log records as the blank-PDF fix. Both are tested against real output: the backup test asserts the archive bytes contain `attachments/<uuid>/<file>` and the payload; the PDF test reopens the file with `PDFDocument(url:)` and finds "MacBook Pro" and the serial "ABC123".

## The rest of the log

I got the Face ID lifecycle wrong first: `AppRootView` now clears `isUnlocked` on `.background` only and `unlockIfNeeded` guards on `isAuthenticating`, so the vault no longer locks, in the log's words, "every time the app becomes active during Face ID presentation". And the product name was never purely metadata: the rename commit moved through `Info.plist`, `InfoPlist.strings`, three catalogue values, and `BackupExportService`, which bakes the name into export filenames.

Git is not the record: five commits between 15:44 and 16:12 one afternoon, the first 100 files and 13,327 insertions. `DOCUMENTATION.md` is the actual build log.
