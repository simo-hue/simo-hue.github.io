---
aliases:
  - "/blog/tech-project/ping-pong-counter/"
title: "Building Ping Pong Counter across iPhone, Watch and the Home Screen"
description: "A build note on Ping Pong Counter, the native Swift scoreboard I ship for iPhone, Apple Watch and the Home Screen: what the three targets actually share, and the serve-rotation bug the default format hid in singles."
slug: ping-pong-counter
date: 2026-08-08
# DRAFT: the body contains [SIMONE: ...] markers where the repo documents WHAT was
# built but not WHY. Those are questions only Simone can answer. Answer them, delete
# the markers, then set draft: false. Do not publish with markers in place.
draft: true
tags: ["swift", "swiftui", "ios", "watchos", "widgetkit", "activitykit", "xcode"]
comments: false

links:
  - title: GitHub Repository
    description: Source code for the app
    website: https://github.com/simo-hue/Ping-Pong-Counter
  - title: App Store
    description: Download the app
    website: https://apps.apple.com/app/ping-pong-counter/id6771022440
  - title: Product Page
    description: Features and screenshots
    website: https://simo-hue.github.io/Ping-Pong-Counter/
---

## Three targets, and what actually crosses between them

Ping Pong Counter is one Xcode project I ship with three targets — the iPhone app, `PingPongWatch Watch App` and `PingPongWidgetExtension` — across 38 Swift files and about 8,500 lines. The interesting part is not a scoring model shared by all three. [SIMONE: did you set out expecting a shared model here?]

In `project.pbxproj` the widget's Sources phase lists two explicit files, `ScoreActionIntent.swift` and `PingPongAttributes.swift`, on top of its own folder, which Xcode pulls in wholesale through `PBXFileSystemSynchronizedRootGroup`, Xcode 16's synchronised-folder mechanism. The watch target's Sources phase is literally `files = ()`: four files in its own folder, nothing else.

Two files shared with the widget, none with the watch. Everything else crosses as state, between processes. [SIMONE: why did the watch re-implement a cut-down rules engine instead of sharing the model files?]

## The watch guesses, the widget reads

`WatchConnector.swift` keeps its own score and a 30-entry snapshot stack for undo. A tap increments locally, runs a simplified `updateLocalServer()` — still the single division the phone gave up, `total / interval` with the interval collapsed to 1 at deuce — then sends `increment` and the player onward. The phone answers with full state through `updateApplicationContext`, and `sendMessage` when reachable; the watch overwrites its guess with whatever arrives, clamping on receipt. In doubles it guesses the serving half the same way — the four-seat cycle alternates teams like singles — but not who at the table: the rotation lives in `DoublesLineup`, which the watch never compiles, so the phone sends `servingName` and `receivingName` outright.

The widget cannot even ask. `PingPongHomeWidget.swift` carries `WidgetSharedStore`, a deliberate duplicate of `SharedStore`, because an extension cannot link the app's code. Both probe the App Group with `FileManager.containerURL(forSecurityApplicationGroupIdentifier:)`, not `UserDefaults(suiteName:)`, which hands back a usable object for any `group.*` name, entitled or not. Without the container it shows its empty state, not wrong data.

## Frozen attributes broke a button

`ActivityAttributes` are fixed at `Activity.request()`; only `ContentState` changes afterwards. Player names live in the attributes, and the Lock Screen passes `context.attributes.p1Name` into `LiveActivityScoringRow`, which captions the `.pointPlayer1` button with it. `swapSides()` swaps `p1Name` and `p2Name`, so after a change of ends the Lock Screen kept the old names against the new scores, and the button captioned for one player scored for the other. `LiveActivityManager` now restarts the activity when the names change — debounced by 1,200 ms, because the name field writes through on every keystroke — and requests the replacement before ending the old one, since `Activity.request` needs the foreground and can fail.

The buttons reach the engine through `ScoreActionRouter`, a `weak static var` the view model assigns in its own `init`, so the widget can name the intent without linking the view model. It is also why `PingPongApp.init()` builds `ScoreViewModel.shared` eagerly: the system can launch the app in the background to run an intent without building the UI.

## A rounding bug the default format hid in singles

`DoublesLineup.serveTurns` used to be `totalPoints / interval`. Deuce shortens each remaining turn to one point rather than restarting the sequence, so at 10-10 the twenty points already played were re-divided by 1 and the turn count jumped from 10 to 20.

At the default two-point rotation the overcount is `target - 1`. At 11 and 21 — the two presets — that is even, and two-way singles alternation survives it by accident. At an even target the overcount is odd and singles was wrong too; the settings stepper runs 1 to 99, so they are reachable. On a four-seat cycle nothing saves it: from 10-10 in the default format the app named the partner instead of the server.

I made the count piecewise; singles and doubles now reach it through the same `DoublesLineup.serveTurns`. A rally-by-rally simulation in the model checks covers targets 1 to 30 at the two-serve interval, plus the six where a five-serve turn divides the deuce total evenly. Outside those pairs the rules stop defining the answer.

## Merging history without losing matches

In `SyncMerge.swift` I replaced last-writer-wins over the whole array, which silently destroyed a match when two devices each played one offline. Records carry stable UUIDs, so the merge is a union by id minus tombstones, tie-broken on the id: two devices holding the same data produce byte-identical output. Tombstones are sorted for the same reason — `Set` iteration order is randomised per process, and unsorted output made each device read the other's write as a change and push back, forever. An absent remote copy now deletes nothing, because iOS posts `AccountChange` for a sign-out as well as a switch. [SIMONE: why the iCloud key-value store rather than CloudKit?]

## Checking the work without Xcode

I check the work with three shell scripts, three support Swift files and no Xcode. `run-model-checks.sh` compiles eight real model files, `DoublesLineup` and `SyncMerge` among them, against a scripted stand-in for the view-model parts that cannot build outside iOS. It prints 99 passing checks. `run-view-typecheck.sh` leans on the Command Line Tools macOS SDK shipping both SwiftUI and Charts, so nine view files type-check rather than merely parse — though two are not screens: the `AppTheme` palette, and `DoublesRosterStrip`, which lives outside `ContentView` to be checkable. The full `xcodebuild` happens on a Mac mini. [SIMONE: why no Xcode on the day-to-day machine?]

## Native, and one loose end

Every load-bearing piece here is first-party — ActivityKit, WidgetKit, WatchConnectivity, App Intents, Swift Charts — and the project file has no Swift Package references. [SIMONE: why native SwiftUI here, when Evolve is Flutter?]

`Localized.swift` is a runtime switch on `Locale.current.language.languageCode`, almost every string an inline ternary. [SIMONE: why hand-rolled ternaries rather than a strings catalogue?] The project declares `developmentRegion = en` and `knownRegions = (en, Base)`, `PingPong/Info.plist` is an empty dict, and the repo holds no `.lproj`, `.strings` or `.xcstrings` — so nothing in the project declares a second localisation, whatever the ternaries do at runtime. [SIMONE: have you seen the Italian strings on an Italian device since shipping?]
