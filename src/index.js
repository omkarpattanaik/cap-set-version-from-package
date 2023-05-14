#! /usr/bin/env node
import boxen from "boxen";
import gradient from "gradient-string";
import * as fs from "fs";
import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Default VAlues
var customAndroidDirPath = "./android";
var customJsonPath = "./package.json";
var versionKeyName = "version";
var buildGradlePath = "/app/build.gradle";
var customIOSPath = "./ios";
var iOSPlistPath = "/App/App/Info.plist";
var iOSProjectFilePath = "/App/App.xcodeproj/project.pbxproj";

const setCustomValuesfromCLI = async (argv) => {
  customAndroidDirPath = (await argv.androidPath) ?? customAndroidDirPath;
  customJsonPath = (await argv.jsonPath) ?? customJsonPath;
  versionKeyName = (await argv.versionKey) ?? versionKeyName;
  customIOSPath = (await argv.iosPath) ?? customIOSPath;
};

const setCustomOptionInHelp = async () => {
  const argValues = await yargs(hideBin(process.argv))
    .usage(
      `\nUsage::
cap-set-version-from-package <option>=value
\n #OR you can use below but it does not works on npx without installation\n
csvfp <option>=value`
    )
    .option("androidPath", {
      alias: "a",
      describe: "Custom Path of Android Directory. default: ./android ",
      type: "string",
    })
    .option("iosPath", {
      alias: "i",
      describe: "Custom Path of ios Directory. default: ./ios ",
      type: "string",
    })
    .option("jsonPath", {
      alias: "j",
      describe:
        "Custom Path of any package.json or custom Json file. default: ./package.json",
      type: "string",
    })
    .option("versionKey", {
      alias: "k",
      describe:
        "Custom key for version in package.json or custom Json file. default: version",
      type: "string",
    })
    .help(true).argv;
  return argValues;
};

const openPackageJson = async (packageJsonFilePath) => {
  return fs.readFileSync(packageJsonFilePath, "utf-8");
};

const checkIfPackageVersionExist = async (file) => {
  // await console.log( await file);
  if (!file.toString().match(/(version).*/g)) {
    throw new Error(`Could not find "version" in package.json file 
    Suggestion:
    - Add "version" key in your package.json file \n`);
  }
};

const getPackageVersion = async (file) => {
  return await JSON.parse(file)[versionKeyName];
};

const convertVersionToBuildNumber = async (version) => {
  return parseInt(await version.replaceAll(".", "0").replaceAll("-", "0"));
};

const getPackageData = async (customJsonDir) => {
  const customJsonFilePath = path.join(customJsonDir);
  let file = await openPackageJson(customJsonFilePath);
  await checkIfPackageVersionExist(file);
  let version = await getPackageVersion(file);
  return {
    version: version,
    buildNo: await convertVersionToBuildNumber(version),
  };
};

/****************** iOS *******************************/

const checkForIOSPlatform = async (iOSdir) => {
  const iosFolderPath = path.join(iOSdir);

  if (!fs.existsSync(iosFolderPath)) {
    throw "ios platform: folder " + iosFolderPath + " does not exist";
  }

  const infoPlistFilePath = path.join(iOSdir, iOSPlistPath);

  if (!fs.existsSync(infoPlistFilePath)) {
    throw new Error(`Invalid iOS platform: file ${infoPlistFilePath} does not exist Check the integrity of your ios folder 
      Suggestions:
      - Add again the ios platform to your project \n`);
  }
};

const isLegacyIOSProject = async (iOSdir) => {
  const infoPlistFilePath = path.join(iOSdir, iOSPlistPath);

  const file = fs.readFileSync(infoPlistFilePath);

  return !file.includes("$(MARKETING_VERSION)");
};

const setIOSVersionAndBuild = async (iOSdir, version, build) => {
  const projectFilePath = path.join(iOSdir, iOSProjectFilePath);

  let file = await openIOSProjectFile(projectFilePath);

  file = await setIOSVersion(file, version);
  file = await setIOSBuild(file, build);

  saveIOSProjectFile(projectFilePath, file);
};

const setIOSVersionAndBuildLegacy = async (iOSdir, version, build) => {
  const plistFilePath = path.join(iOSdir, iOSPlistPath);

  let file = await openInfoPlistFile(plistFilePath);

  const parsed = await plist.parse(file);

  await setIOSVersionLegacy(parsed, version);
  await setIOSBuildLegacy(parsed, build);

  file = await plist.build(parsed);

  await saveInfoPlistFile(plistFilePath, file);
};

const openIOSProjectFile = async (projectFilePath) => {
  try {
    return fs.readFileSync(projectFilePath, "utf-8");
  } catch (error) {
    throw new Error(
      `Invalid iOS project file: file ${projectFilePath} does not exist`
    );
  }
};

const saveIOSProjectFile = async (projectFilePath, file) => {
  fs.writeFileSync(projectFilePath, file, "utf-8");
};

const setIOSVersion = async (file, version) => {
  await checkIfVersionExist(file);
  return await file.replace(
    /(MARKETING_VERSION = ).*/g,
    `MARKETING_VERSION = ${version};`
  );
};

const checkIfVersionExist = async (file) => {
  if (await file.match(/(MARKETING_VERSION = ).*/g)) return;
  throw new Error(`Could not find "MARKETING_VERSION" in project.pbxproj file
    Suggestions: 
    - Check if "MARKETING_VERSION" is found inside file ios/App/App.xcodeproj/project.pbxproj file.
    - Update you iOS xCode project to auto manage the project version \n`);
};

const setIOSBuild = async (file, build) => {
  await checkIfBuildNumberExist(file);
  return await file.replace(
    /(CURRENT_PROJECT_VERSION = ).*/g,
    `CURRENT_PROJECT_VERSION = ${build};`
  );
};

const checkIfBuildNumberExist = async (file) => {
  if (await file.match(/(CURRENT_PROJECT_VERSION = ).*/g)) return;

  throw new Error(`Could not find "CURRENT_PROJECT_VERSION" in project.pbxproj file
    Suggestions: 
    - Check if "CURRENT_PROJECT_VERSION" is found inside file ios/App/App.xcodeproj/project.pbxproj file.
    - Update you iOS xCode project to auto manage the project version \n`);
};

const openInfoPlistFile = async (plistFilePath) => {
  return fs.readFileSync(plistFilePath, "utf-8");
};

const saveInfoPlistFile = async (plistFilePath, file) => {
  fs.writeFileSync(plistFilePath, file, "utf-8");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setIOSVersionLegacy = async (infoPlist, version) => {
  infoPlist.CFBundleShortVersionString = await version;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setIOSBuildLegacy = async (infoPlist, build) => {
  infoPlist.CFBundleVersion = await build.toString();
};

/********************** Android *******************************/

const openGradleBuildFile = async (gradleBuildFilePath) => {
  return fs.readFileSync(gradleBuildFilePath, "utf-8");
};

const saveGradleBuildFile = async (gradleBuildFilePath, file) => {
  fs.writeFileSync(gradleBuildFilePath, file.toString(), "utf-8");
};

const setAndroidVersion = async (file, version) => {
  await checkIfVersionNameExist(file);
  return await file.replace(/(versionName).*/g, `versionName "${version}"`);
};

const checkIfVersionNameExist = async (file) => {
  // await console.log( await file);
  if (!file.toString().match(/(versionName).*/g)) {
    throw new Error(
      `Could not find "versionName" in android/app/build.gradle file
        Suggestions:
        - Add "versionName" your build.gradle file \n`
    );
  }
};

const setAndroidBuild = async (file, build) => {
  checkIfVersionCodeExist(file);
  return await file
    .toString()
    .replace(/(versionCode).*/g, `versionCode ${build}`);
};

const checkIfVersionCodeExist = async (file) => {
  //await console.log( await file);
  if (!file.toString().match(/(versionCode).*/g)) {
    throw new Error(
      `Could not find "versionCode" in android/app/build.gradle file
        Suggestions:
        - Add "versionCode" to your build.gradle file \n`
    );
  }
};

const checkForAndroidPlatform = async (androidDir) => {
  const androidFolderPath = path.join(androidDir);

  if (!fs.existsSync(androidFolderPath))
    throw "Android platform: folder " + androidFolderPath + " does not exist";

  const gradleBuildFilePath = path.join(androidDir, buildGradlePath);

  if (!fs.existsSync(gradleBuildFilePath))
    throw new Error(
      `Invalid Android platform: file ${gradleBuildFilePath} does not exist`
    );
};

const checkPackageJsonAvailabilty = async (customJsonDir) => {
  const packageJsonFilePath = path.join(customJsonDir);

  if (!fs.existsSync(packageJsonFilePath))
    throw new Error(
      `Invalid Package : file ${packageJsonFilePath} does not exist`
    );
};

const setAndroidVersionAndBuild = async (androidDir, version, build) => {
  const gradleBuildFilePath = path.join(androidDir, buildGradlePath);

  let file = await openGradleBuildFile(gradleBuildFilePath);

  file = await setAndroidVersion(file, version);
  file = await setAndroidBuild(file, build);

  await saveGradleBuildFile(gradleBuildFilePath, file);
};

const processAll = async () => {
  // Displaying cap-set-version-from-package CLI
  console.log(gradient.pastel.multiline("cap-set-version-from-package"));

  let argv = await setCustomOptionInHelp();
  await setCustomValuesfromCLI(argv);


  try {
    let customJson;
    await checkPackageJsonAvailabilty(customJsonPath);
    customJson = await getPackageData(customJsonPath);
    console.log(`Found Package version i.e ${customJson.version} `);

    console.log(
      boxen(
        "Updating to : \n Version: " +
          customJson.version +
          "\n Build No.: " +
          customJson.buildNo,
        { padding: 1, margin: 1, borderStyle: "double", borderColor: "magenta" }
      )
    );

    try {
      await checkForAndroidPlatform(customAndroidDirPath);
      await setAndroidVersionAndBuild(
        customAndroidDirPath,
        customJson.version,
        customJson.buildNo
      );

      console.log(
        gradient.pastel.multiline(
          `Successfully Updated Version and build number in android path: ${customAndroidDirPath}  !!`
        )
      );
    } catch (err) {
      typeof err == "string"
        ? console.warn("WARNING: ", err)
        : console.error(err);
    } finally {
      gradient.pastel.multiline(`cya `);
    }

    try {
      await checkForIOSPlatform(customIOSPath);

      // In legacy xCode projects, the version information was stored inside info.plist file.
      // For modern projects, it is stored in project.pbxproj file.
      // The command will handle both legacy and modern projects.
      if (await isLegacyIOSProject(customIOSPath)) {
        console.warn(
          "Legacy iOS project detected, please update to the latest xCode"
        );
        await setIOSVersionAndBuildLegacy(
          customIOSPath,
          customJson.version,
          customJson.buildNo
        );
      } else {
        await setIOSVersionAndBuild(
          customIOSPath,
          customJson.version,
          customJson.buildNo
        );
      }

      console.log(
        gradient.pastel.multiline(
          `Successfully Updated Version and build number in ios path: ${customIOSPath} !!`
        )
      );
    } catch (err) {
      typeof err == "string"
        ? console.warn("WARNING: ", err)
        : console.error(err);
    } finally {
      gradient.pastel.multiline(`cya `);
    }
  } catch (err) {
    typeof err == "string"
      ? console.warn("WARNING: ", err)
      : console.error(err);
  }
};

// Call the greet function
processAll();
