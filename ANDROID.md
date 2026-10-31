# Nabeeh — Android (Google Play)

The Android app is the same web code wrapped with Capacitor 7 (package `com.bukhari.nabeeh`), built by
`.github/workflows/android-release.yml` on GitHub's Linux runner. No Mac or Android Studio is needed.
Like the iPhone app it is **free with one interstitial ad** (AdMob, child-directed, non-personalised) and one
**non-consumable purchase, `nabeeh.full` "Remove ads"**. There is no subscription.

## What is automated

`Actions → Android build → Run workflow` (inputs: version name, Play track, release status):

1. Builds `www/`, creates the Android project, icons and splash, then `scripts/android-config.mjs`:
   - versionCode = the run number, versionName = the input;
   - compileSdk / targetSdk **36** (Google Play requires API 36 for new apps and updates after 31 Aug 2026,
     [developer.android.com/google/play/requirements/target-sdk](https://developer.android.com/google/play/requirements/target-sdk));
   - AdMob app id in `AndroidManifest.xml` (`com.google.android.gms.ads.APPLICATION_ID`), taken from the secret
     `ADMOB_ANDROID_APP_ID`, else `ads.android.appId` in `js/config.js`, else Google's test id
     `ca-app-pub-3940256099942544~3347511713` (the log says which one was used);
   - permissions: `POST_NOTIFICATIONS` (Android 13+ reminder prompt) kept; `SCHEDULE_EXACT_ALARM`,
     `USE_EXACT_ALARM`, `AD_ID` and the Privacy Sandbox ad permissions **removed** (`tools:node="remove"`), see below;
   - a white status-bar icon for the reminder, portrait orientation, edge-to-edge margins handled by Capacitor.
2. `bundleRelease` (.aab) + `assembleDebug` (installable test .apk), then checks the merged manifest.
3. Signs the bundle **only if** the four keystore secrets exist. Without them the .aab is unsigned, the artifact
   is named `…-UNSIGNED`, and the last step ("Require a signed bundle") fails on purpose. Untick
   `require_signed` to get a green run for test builds.
4. Uploads the signed .aab to Play if `PLAY_SERVICE_ACCOUNT_JSON` is set (default track `internal`, status `draft`).

Ad unit and purchase code already handle Android: `js/ads.js` picks `NB_CONFIG.ads[platform]` from `js/config.js`,
and `js/iap.js` registers `nabeeh.full` with `Platform.GOOGLE_PLAY` on Android.

### Why these permissions

- **No exact alarms.** A daily practice reminder does not need minute precision, and exact alarms are a restricted
  permission on Play (alarm-clock / calendar apps). Without it the local-notifications plugin falls back to a normal
  alarm, which can arrive a few minutes late.
- **No AD_ID.** Play's policy: apps that solely target children must never transmit the advertising id, and should
  make sure no library declares the AD_ID permission; without it Android returns zeros
  ([support.google.com/googleplay/android-developer/answer/11043825](https://support.google.com/googleplay/android-developer/answer/11043825)).
  The app already asks AdMob for child-directed, under-age-of-consent, non-personalised ads (`js/ads.js`).

## What the owner must do (once)

1. **Play Console account** ([play.google.com/console](https://play.google.com/console)), one-time fee. For a
   personal account created after 13 Nov 2023 Google requires a **closed test with at least 12 testers opted in
   for 14 continuous days** before you can apply for production
   ([support.google.com/googleplay/android-developer/answer/14151465](https://support.google.com/googleplay/android-developer/answer/14151465)).
   Start the closed test early (family, colleagues); internal testing has no wait.
2. **Create the app**: name "نبيه — تدريب الموهوبين" / "Nabeeh Prep", default language Arabic, App, Free.
   Texts are drafted in `store/play-listing.md`.
3. **Upload key** (any computer with Java):
   `keytool -genkeypair -v -keystore upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nabeeh`
   Keep the file and passwords safe (losing it means a key reset request to Google). Add repository secrets:
   `ANDROID_KEYSTORE_BASE64` (`base64 -w0 upload.jks`), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`nabeeh`),
   `ANDROID_KEY_PASSWORD`. Enrol in **Play App Signing** (default) when you upload the first bundle.
4. **AdMob**: in AdMob add an Android app for `com.bukhari.nabeeh` and one **Interstitial** ad unit. `js/config.js`
   already holds Android ids (`ca-app-pub-4879999601752842~5566825829` and `/4629595783`) — confirm they are the
   Android app and unit in your AdMob account; if not, change `ads.android` there (or set the secret
   `ADMOB_ANDROID_APP_ID` for the app id). In AdMob → App settings, tag the app as **child-directed**
   and set the max ad content rating to G. Link the AdMob app to the Play listing once it is live.
5. **In-app product** (Monetize → Products → In-app products; needs a merchant/payments profile):
   ID **`nabeeh.full`**, name "إزالة الإعلانات / Remove ads", one-time, **SAR 24.99** (same as iOS), Active.
   Add yourself under Setup → **License testing** to buy for free while testing.
6. **First upload by hand**: run the workflow, download the signed `app-release.aab` from the run's artifacts and
   upload it to Internal testing in Play Console (Google's API cannot create the first release).
7. **Service account** (optional, for automatic uploads afterwards): Setup → API access → link a Google Cloud
   project, create a service account, grant it release rights for this app, store its JSON key as
   `PLAY_SERVICE_ACCOUNT_JSON`. Use status `draft` until the app has been published once.
8. **App content** (Policy → App content):
   - **Target audience and content**: choose the age groups that match who uses it, likely **6–8, 9–12 and 13–15**
     (grades 3–10). Any child age group puts the app under the **Families policy**: ads must come from a
     Families-certified SDK (AdMob is) with child-directed settings, ads must be appropriate for children,
     and purchases/links out sit behind the parent check (already in the app). Parents are the buyers.
   - **Ads**: Yes, the app contains ads.
   - **Data safety**: follow Google's AdMob guidance
     ([developers.google.com/admob/android/privacy/play-data-disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure)).
     The app itself sends nothing (progress stays on the device, no account, reminders are local), but the
     Google Mobile Ads SDK collects and shares, for advertising, analytics and fraud prevention: **IP address /
     approximate location**, **app interactions** (ad views/taps), **diagnostics**, and **device or other IDs**
     (app set ID; the advertising ID is zeroed because AD_ID is removed). Data is encrypted in transit.
     Deletion: users can delete all on-device data in Settings. Purchases are processed by Google Play.
     Declare what the SDK collects; do **not** answer "no data collected".
   - **Content rating** (IARC questionnaire): category Education/Reference; no violence, no user-generated
     content, no chat, no location sharing, digital purchases = yes, ads = yes. Expected: Everyone / PEGI 3 / 3+.
   - **Privacy policy URL**: the hosted `privacy.html`. Also: news app = no, government app = no,
     COVID = no, financial features = none.
9. **Store listing**: texts in `store/play-listing.md`, 512×512 icon, 1024×500 feature graphic, at least
   2 phone screenshots per language. Category: Education.

## Each release

1. Actions → **Android build** → Run workflow → version name (e.g. `1.2.1`).
2. Signed .aab goes to the chosen track automatically (with the service account) or download it from the run.
3. Promote in Play Console when ready.

## Check on a real Android phone

- Ad appears after every second finished activity and after a mock test, never during a test.
- "Remove ads" purchase with a license-tester account, and restore after reinstall.
- Reminder: Android 13+ shows the notification permission prompt; the reminder appears around the chosen time.
- Status bar and navigation bar do not cover the header or bottom buttons (Android 15+ edge-to-edge).
- Arabic voice depends on the phone's installed voices (Google Text-to-Speech → Arabic).
