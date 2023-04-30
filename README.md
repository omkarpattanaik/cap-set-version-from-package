# cap-set-version-from-package CLI

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

cap-set-version-from-package CLI is a simple utility for updating using your android build no. and version by using package.json while creating apk using Capacitor.

## Usage/Examples

### Pre Requires

You must have package.json file with update version. You must have android directory added to your capacitor project using

```bash
// to install capacitor Android dependency
npm install @capacitor/android

// to add Android directory
npx cap add android

// to clone your dist to android
npx cap sync

```

Once done. Now you are ready to use cap-set-version-from-package

### To Install

```bash
npm install -g https://github.com/omkarpattanaik/cap-set-version-from-package

//OR
npm install -g omkarpattanaik/cap-set-version-from-package#main

//OR
npm install -g omkarpattanaik/cap-set-version-from-package@v1.0.0
```

### To Use

To use this package just use the below command

```bash
cap-set-version-from-package
```

if you are using **npx** then no need to install directly use this

```bash
npx https://github.com/omkarpattanaik/cap-set-version-from-package
```

## Author

- [@omkarpattanaik](https://www.github.com/omkarpattanaik)
