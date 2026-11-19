# NV State Police, Capitol Police Field Guide

Nevada statute and plate field reference, packaged so GitHub can build an installable Android APK.

## Upload

1. Create an empty repository on GitHub.
2. Upload this folder. Do not upload `node_modules`.
3. Do not add GitHub's suggested Android CI workflow. This repo already has `.github/workflows/android.yml`. That suggested workflow looks for `gradlew` in the top folder and fails, because the real file is `android/gradlew`.
4. Open the **Actions** tab. The **Android CI** workflow runs on every push. Open the latest run.
5. Download the artifact named `nrs-field-reference`. It contains `app-debug.apk`.

Do not press Re-run on a failed run that used the old workflow. Commit the corrected `android.yml` first. GitHub only uses the workflow file from that new commit.

## Install on a phone

Copy the APK to the phone and open it. Android will ask you to allow install from this source. This is a sideload build, not a Play Store listing.

The APK includes the field cards and plate list. The NRS tab and the city map need a network connection.
