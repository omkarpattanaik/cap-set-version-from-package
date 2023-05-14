<img src="header.svg"  width="100%" alt="Click to see the source">


![NPM](https://img.shields.io/npm/l/cap-set-version-from-package?style=flat-square)
![npm](https://img.shields.io/npm/v/cap-set-version-from-package?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/omkarpattanaik/cap-set-version-from-package?style=flat-square)
![Snyk Vulnerabilities for npm scoped package](https://img.shields.io/snyk/vulnerabilities/npm/cap-set-version-from-package?style=flat-square)

cap-set-version-from-package CLI is a simple utility for updating your Android or iOS build no. and version by using package.json while creating Android or iOS App using Capacitor. Very Useful in Github action for capacitor.

## Usage

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

### Pre Requires

You must have package.json file with update version. You may have android or ios directory added to your capacitor project using:

```bash
# to install capacitor Android dependency
npm install @capacitor/android @capacitor/android

# to add Android directory
npx cap add android

# to add ios directory
npx cap add ios

# to clone your dist to android
npx cap sync

```
Incase if any directory is missing, still it will work on existing directory with a WARNING. 
Once done. Now you are ready to use cap-set-version-from-package



## Customise Your Versioning

### Using Custom Android Path

If Android folder is getting created or available in custom location.

**npm**

```bash
cap-set-version-from-package  --androidPath=../Project2/android

# OR use short form
csvfp  -a=../Project2/android

```

**npx**

```bash
npx cap-set-version-from-package  -a=../Project2/android
```

### Using Custom ios Path

If ios folder is getting created or available in custom location.

**npm**

```bash
cap-set-version-from-package  --iosPath=../Project2/ios

# OR use short form
csvfp  -i=../Project2/android

```

**npx**

```bash
npx cap-set-version-from-package  -i=../Project2/ios
```

### Using Custom package.json / custom.json file Path

If package.json is available in custom location or you want use some custom json file.

**npm**

```bash
cap-set-version-from-package  --jsonPath=./Project2/custom.json

# OR use short form
csvfp  -j=./Project2/custom.json
```

**npx**

```bash
npx cap-set-version-from-package  --jsonPath=../Project2/package.json
```

### Find value of custom version key inside package.json or custom.json

If custom json file contain custom key which contains version.

**npm**

```bash
cap-set-version-from-package  --versionKey=proj-version

# OR use short form
csvfp -k=proj-version
```

**npx**

```bash
npx cap-set-version-from-package -j=./Project2/custom.json -k=versionName
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

## New Feature

- Versioning iOS build. 
- Customization for iOS build versioning. 

## Coming Soon

- Picking paths from capacitor.config.json.
