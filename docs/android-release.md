# Android Release Build

This project can build signed release artifacts once a local upload keystore has been created.

The committed files provide the release wiring, but the private signing files stay local and must not be committed.

## Files That Stay Private

- `android/keystore.properties`
- `android/signing/32-visualisations-upload.jks`

Both are ignored by Git.

## One-Time Keystore Setup

Open PowerShell from the repo root and run:

```powershell
New-Item -ItemType Directory -Force -Path .\android\signing
& "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkeypair -v -keystore .\android\signing\32-visualisations-upload.jks -alias thirtytwo-upload -keyalg RSA -keysize 2048 -validity 10000
Copy-Item .\android\keystore.properties.example .\android\keystore.properties
notepad .\android\keystore.properties
```

When `keytool` asks questions:

- Keystore password: create a strong password and store it in LastPass.
- Re-enter password: same value.
- First and last name: `32 Visualisations`
- Organizational unit: `Independent`
- Organization: `32 Visualisations`
- City/locality: your choice.
- State/province: your choice.
- Country code: `GB` unless you want something else.
- Confirm: `yes`
- Key password: press Enter to use the same password, or create a second password and store that too.

Then edit `android/keystore.properties` so it contains:

```properties
storeFile=signing/32-visualisations-upload.jks
storePassword=your-keystore-password
keyAlias=thirtytwo-upload
keyPassword=your-key-password
```

If you pressed Enter to reuse the keystore password as the key password, use the same value for both password fields.

## Build Release Artifacts

After the local keystore setup is complete:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-android-release.ps1
```

Expected outputs:

- `android/app/build/outputs/apk/release/app-release.apk`
- `android/app/build/outputs/bundle/release/app-release.aab`

Use the `.aab` for Google Play. Use the signed `.apk` for direct install testing.

## LastPass Entry

Create a LastPass secure note named `32 Visualisations Android Upload Key` with:

- Keystore file: `android/signing/32-visualisations-upload.jks`
- Keystore password
- Key alias: `thirtytwo-upload`
- Key password
- Created date

Losing this information makes future direct APK updates painful and Google Play upload-key recovery irritating, so treat it as part of the project identity.
