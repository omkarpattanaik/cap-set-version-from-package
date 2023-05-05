# cap-set-version-from-package CLI

![NPM](https://img.shields.io/npm/l/cap-set-version-from-package?style=flat-square)
![npm](https://img.shields.io/npm/v/cap-set-version-from-package?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/omkarpattanaik/cap-set-version-from-package?style=flat-square)
![Snyk Vulnerabilities for npm scoped package](https://img.shields.io/snyk/vulnerabilities/npm/cap-set-version-from-package?style=flat-square)

cap-set-version-from-package CLI is a simple utility for updating your android build no. and version by using package.json while creating Android App using Capacitor. Very Useful in github action for capacitor.

## Usage

### Pre Requires

You must have package.json file with update version. You must have android directory added to your capacitor project using

```bash
# to install capacitor Android dependency
npm install @capacitor/android

# to add Android directory
npx cap add android

# to clone your dist to android
npx cap sync

```

Once done. Now you are ready to use cap-set-version-from-package

### To Install

```bash
npm install cap-set-version-from-package
```

Install it in your capacitor/ionic project

### To Use

To use this package just use the below command

```bash
cap-set-version-from-package

# OR use short form
csvfp
```

If you are using **npx** then no need to install, directly use this

```bash
npx  cap-set-version-from-package
```

## Customise Your Versioning

### Using Custom Android Path

If Android folder is getting created in custom location.

**npm**

```bash
cap-set-version-from-package  --androidPath=../Project2/android

# OR use short form
csvfp  --androidPath=../Project2/android

```

**npx**

```bash
npx cap-set-version-from-package  --androidPath=../Project2/android
```

### Using Custom package.json / custom.json file Path

If Android folder is getting created in custom location.

**npm**

```bash
cap-set-version-from-package  --jsonPath=./Project2/custom.json

# OR use short form
csvfp  --jsonPath=./Project2/custom.json
```

**npx**

```bash
npx cap-set-version-from-package  --jsonPath=../Project2/package.json
```

### Find value of custom version key inside package.json or custom.json

If Android folder is getting created in custom location.

**npm**

```bash
cap-set-version-from-package  --versionKey=proj-version

# OR use short form
csvfp --versionKey=proj-version
```

**npx**

```bash
npx cap-set-version-from-package  --versionKey=versionName
```

## For developers and contibuters

To install package

```bash
npm install
```

To use locally in system

```bash
npm i -g
```

To remove it locally

```bash
npm rm -g
```

## Author

- [@omkarpattanaik](https://www.github.com/omkarpattanaik)

## Coming Soon

- Versioning IOS build
- Customization for IOS build versioning
