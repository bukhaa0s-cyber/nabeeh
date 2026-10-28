# Nabeeh — Android (Google Play)

The Android app is the same web code wrapped with Capacitor (package `com.bukhari.nabeeh`), built by
`.github/workflows/android-release.yml` on GitHub's Linux runner. No Mac is needed.

## One-time setup

1. **Google Play Console** (play.google.com/console): create a developer account (one-time fee) and an app named "نبيه / Nabeeh".
2. **Upload key**: on any computer with Java, run
   `keytool -genkeypair -v -keystore upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nabeeh`
   and keep the file and passwords safe. Base64 it (`base64 -w0 upload.jks`) and store it as the secret
   `ANDROID_KEYSTORE_BASE64`, plus `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (= `nabeeh`), `ANDROID_KEY_PASSWORD`.
3. **In-app products** (Play Console → Monetize → Products):
   - One-time product, ID `nabeeh.full`, SAR 39.99.
   - Subscription, ID `nabeeh.monthly`, base plan at SAR 14.99 per month, auto-renewing.
   - Activate both.
4. **Service account** (optional, for auto-upload): Play Console → Setup → API access → create a service account
   with release permissions, download its JSON key, store as `PLAY_SERVICE_ACCOUNT_JSON`.
5. **Store listing, content rating, Data safety, target audience** (Play asks for these before release).
   Reuse the App Store wording. Data safety: no data collected, reminders are local, purchases handled by Google Play.
6. Google requires a closed test with at least 12 testers for 14 days before a *new personal* developer account
   can publish to production. Internal testing needs no such wait.

## Each release

1. Actions → **Android build** → Run workflow → enter the version name (e.g. `1.1.0`).
2. Download `nabeeh-aab-<run>` from the run, or let it upload to the internal track when the service account is set.
3. In Play Console, promote the build to production when ready.

## Things to verify on a real Android phone

- Purchase flow with a license tester account (Play Console → Setup → License testing).
- Restore purchases after reinstall.
- Daily reminder notification shows after the permission is granted (Android 13+ asks for notification permission).
- Arabic voice quality depends on the voices installed on the phone (Google Text-to-Speech → Arabic).
