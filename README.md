# Gestlio

Gestlio is a React Native application built with Expo and TypeScript.

This repository contains the source code for the Gestlio mobile application for Android and iOS.

## Requirements

Before running the project, install the following:

* Node.js 20.x
* npm
* Git
* Expo CLI / Expo tooling
* Android Studio for Android development
* Xcode for iOS development on macOS
* EAS CLI for production builds

Check your installed versions:

```bash
node -v
npm -v
git --version
```

Recommended Node.js version:

```text
Node.js 20.x
```

## Clone the Project

Clone the repository:

```bash
git clone https://github.com/learnwithmotaleb/theo_mtbb_motaleb.git
```

Go to the project directory:

```bash
cd theo_mtbb_motaleb
```

## Install Dependencies

For a fresh clone, use:

```bash
npm ci
```

`npm ci` installs the dependency versions defined in `package-lock.json`, helping keep the development environment consistent across different computers.

If needed, you can also use:

```bash
npm install
```

## Check Expo Project

Run Expo Doctor:

```bash
npx expo-doctor
```

Fix any reported dependency or configuration issues before continuing.

## Start the App

Start the Expo development server:

```bash
npx expo start
```

To clear the Metro cache:

```bash
npx expo start -c
```

After starting Expo, you can run the application using:

* Android device
* Android emulator
* iOS simulator on macOS
* Development build
* Expo Go when supported

## Android

To run Android:

```bash
npx expo start
```

Then press:

```text
a
```

Or run:

```bash
npx expo run:android
```

Android Studio and the Android SDK must be configured correctly for native Android development.

## iOS

iOS development requires macOS and Xcode.

Run:

```bash
npx expo start
```

Then press:

```text
i
```

Or run:

```bash
npx expo run:ios
```

## Project Structure

Main project folders include:

```text
assets/
src/
scripts/
utils/
```

Important configuration files:

```text
app.json
eas.json
package.json
package-lock.json
tsconfig.json
eslint.config.js
```

Most application source code is located inside:

```text
src/
```

## Environment Variables

Environment files are not committed to GitHub.

Files such as the following are ignored:

```text
.env
.env.local
.env.development
.env.production
```

If the project requires environment variables, create the required `.env` file locally.

Do not commit API secrets, private keys, passwords, signing credentials, or production secrets to GitHub.

## Expo Configuration

The main Expo configuration is located in:

```text
app.json
```

Before creating a new release, verify:

* App version
* Android version code
* iOS build number
* Package name
* Bundle identifier
* App icon
* Splash screen
* Android permissions
* iOS permissions

## Android Version

Before uploading a new Android build to Google Play Console, increase the Android `versionCode`.

Example:

```json
{
  "expo": {
    "version": "1.0.5",
    "android": {
      "versionCode": 10
    }
  }
}
```

Every new Google Play release must use a version code higher than the previously uploaded version.

## Android Photo and Video Permissions

Gestlio should not request unnecessary broad media permissions such as:

```text
android.permission.READ_MEDIA_IMAGES
android.permission.READ_MEDIA_VIDEO
```

For user-selected images or videos, use the Android system photo picker whenever possible.

This helps keep the application compliant with Google Play's Photo and Video Permissions policy.

## EAS CLI

Install EAS CLI globally if it is not already installed:

```bash
npm install -g eas-cli
```

Login:

```bash
eas login
```

Check the logged-in account:

```bash
eas whoami
```

## Android Production Build

Create an Android production build:

```bash
eas build -p android --profile production
```

This generates an Android App Bundle:

```text
.aab
```

The `.aab` file can be uploaded to Google Play Console.

## iOS Production Build

Create an iOS production build:

```bash
eas build -p ios --profile production
```

Apple Developer access, certificates, provisioning profiles, and App Store Connect access may be required.

## Check Git Status

Before committing changes:

```bash
git status
```

Stage all changes:

```bash
git add .
```

Commit:

```bash
git commit -m "update project"
```

Push to the main branch:

```bash
git push origin main
```

## Pull Latest Changes

Before starting development on another computer, get the latest code:

```bash
git checkout main
git pull origin main
```

Then install the locked dependencies:

```bash
npm ci
```

Start the project:

```bash
npx expo start
```

## Fresh Setup on Another Computer

For a completely new computer, use:

```bash
git clone https://github.com/learnwithmotaleb/theo_mtbb_motaleb.git
cd theo_mtbb_motaleb
npm ci
npx expo-doctor
npx expo start
```

If environment variables are required, configure them before starting the application.

## Clean Expo Cache

If Metro or Expo behaves unexpectedly:

```bash
npx expo start -c
```

If dependencies need to be completely reinstalled:

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force node_modules
npm ci
npx expo start -c
```

### macOS / Linux

```bash
rm -rf node_modules
npm ci
npx expo start -c
```

## Native Folders

The generated native folders may not be stored in this repository:

```text
/android
/ios
```

If native projects need to be regenerated:

```bash
npx expo prebuild
```

Use this command carefully because it generates native Android and iOS project files based on the Expo configuration.

## Useful Commands

```bash
npm ci
npx expo-doctor
npx expo start
npx expo start -c
npx expo run:android
npx expo run:ios
eas whoami
eas build -p android --profile production
eas build -p ios --profile production
git status
git pull origin main
git push origin main
```

## Important Notes

* Do not commit `node_modules`.
* Do not commit `.env` files.
* Do not commit signing keys or private certificates.
* Keep `package-lock.json` committed.
* Increase Android `versionCode` before every Google Play release.
* Increase the iOS build number before every App Store/TestFlight release when required.
* Run `npm ci` after cloning the project on another computer.
* Run `npx expo-doctor` when moving the project to a new development environment.
* Keep the `main` branch updated with the latest stable project code.

## Repository

GitHub:

```text
https://github.com/learnwithmotaleb/theo_mtbb_motaleb
```

## App

**App Name:** Gestlio

**Framework:** React Native + Expo

**Language:** TypeScript

**Platforms:**

* Android
* iOS
