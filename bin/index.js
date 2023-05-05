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

const setCustomValuesfromCLI = async (argv) => {
  customAndroidDirPath = (await argv.androidPath) ?? customAndroidDirPath;
  customJsonPath = (await argv.jsonPath) ?? customJsonPath;
  versionKeyName = (await argv.versionKey) ?? versionKeyName;
};

const setCustomOptionInHelp = async () => {
  const argValues = await yargs(await hideBin(process.argv))
    .usage(
      `\nUsage:
cap-set-version-from-package <option>=value`
    )
    .option("androidPath", {
      alias: "a",
      describe: "Custom Path of Android Directory. default: ./android ",
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
  return await fs.readFileSync(packageJsonFilePath, "utf-8");
};

const checkIfPackageVersionExist = async (file) => {
  // await console.log( await file);
  if (await !file.toString().match(/(version).*/g)) {
    throw new Error(`Could not find "version" in package.json file`, {
      code: "ERR_ANDROID",
      suggestions: ['Add "version" your package.json file'],
    });
  }
};

const getPackageVersion = async (file) => {
  return await JSON.parse(file)[versionKeyName];
};

const convertVersionToBuildNumber = async (version) => {
  return await parseInt(
    await version.replaceAll(".", "0").replaceAll("-", "0")
  );
};

const getPackageData = async (customJsonDir) => {
  const customJsonFilePath = await path.join(customJsonDir);
  let file = await openPackageJson(customJsonFilePath);
  await checkIfPackageVersionExist(file);
  let version = await getPackageVersion(file);
  return {
    version: version,
    buildNo: await convertVersionToBuildNumber(version),
  };
};

const openGradleBuildFile = async (gradleBuildFilePath) => {
  return await fs.readFileSync(gradleBuildFilePath, "utf-8");
};

const saveGradleBuildFile = async (gradleBuildFilePath, file) => {
  await fs.writeFileSync(gradleBuildFilePath, file.toString(), "utf-8");
};

const setAndroidVersion = async (file, version) => {
  await checkIfVersionNameExist(file);
  return await file.replace(/(versionName).*/g, `versionName "${version}"`);
};

const checkIfVersionNameExist = async (file) => {
  // await console.log( await file);
  if (await !file.toString().match(/(versionName).*/g)) {
    throw new Error(
      `Could not find "versionName" in android/app/build.grade file`,
      {
        code: "ERR_ANDROID",
        suggestions: ['Add "versionName" your build.gradle file'],
      }
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
  if (await !file.toString().match(/(versionCode).*/g)) {
    throw new Error(
      `Could not find "versionCode" in android/app/build.grade file`,
      {
        code: "ERR_ANDROID",
        suggestions: ['Add "versionCode" to your build.gradle file'],
      }
    );
  }
};

const checkForAndroidPlatform = async (androidDir) => {
  const androidFolderPath = await path.join(androidDir);

  if (await !fs.existsSync(androidFolderPath))
    throw new Error(
      `Invalid Android platform: folder ${androidFolderPath} does not exist`
    );

  const gradleBuildFilePath = path.join(androidDir, "/app/build.gradle");

  if (await !fs.existsSync(gradleBuildFilePath))
    throw new Error(
      `Invalid Android platform: file ${gradleBuildFilePath} does not exist`
    );
};

const checkPackageJsonAvailabilty = async (customJsonDir) => {
  const packageJsonFilePath = path.join(customJsonDir);

  if (await !fs.existsSync(packageJsonFilePath))
    throw new Error(
      `Invalid Package : file ${packageJsonFilePath} does not exist`
    );
};

const setAndroidVersionAndBuild = async (androidDir, version, build) => {
  const gradleBuildFilePath = await path.join(androidDir, "/app/build.gradle");

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

  // Wait for 1sec
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    await checkPackageJsonAvailabilty(customJsonPath);
    await checkForAndroidPlatform(customAndroidDirPath);
    let customJson = await getPackageData(customJsonPath);
    console.log(`Got Package version i.e ${customJson.version} !!`);

    console.log(
      await boxen(
        "Updating to : \n Version: " +
          customJson.version +
          "\n Build No.: " +
          customJson.buildNo,
        { padding: 1, margin: 1, borderStyle: "double", borderColor: "magenta" }
      )
    );
    await setAndroidVersionAndBuild(
      customAndroidDirPath,
      customJson.version,
      customJson.buildNo
    );

    console.log(
      await gradient.pastel.multiline(
        `Successfully Updated Version and build number in android path: ${customAndroidDirPath}  !!`
      )
    );
  } catch (err) {
    console.error(err);
  } finally {
    await gradient.pastel.multiline(`cya `);
  }
};

// Call the greet function
processAll();
