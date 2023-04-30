#! /usr/bin/env node
import figlet from "figlet";
//import inquirer from "inquirer";
import gradient from "gradient-string";
import * as fs from "fs";
import * as path from "path";
import { version } from "os";

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
  return await JSON.parse(file).version;
};

const convertVersionToBuildNumber = async (version) => {
  return await parseInt(await version.replaceAll('.', '0').replaceAll('-', '0'));
};

const getPackageData = async (dir) => {
  const packageJsonFilePath = await path.join(dir, "package.json");
  let file = await openPackageJson(packageJsonFilePath);
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

const checkForAndroidPlatform = async (dir) => {
  const androidFolderPath = await path.join(dir, "android");

  if (await !fs.existsSync(androidFolderPath))
    throw new Error(
      `Invalid Android platform: folder ${androidFolderPath} does not exist`
    );

  const gradleBuildFilePath = path.join(dir, "android/app/build.gradle");

  if (await !fs.existsSync(gradleBuildFilePath))
    throw new Error(
      `Invalid Android platform: file ${gradleBuildFilePath} does not exist`
    );

  const packageJsonFilePath = path.join(dir, "package.json");

  if (await !fs.existsSync(packageJsonFilePath))
    throw new Error(
      `Invalid Package : file ${gradleBuildFilePath} does not exist`
    );
};

const setAndroidVersionAndBuild = async (dir, version, build) => {
  const gradleBuildFilePath = await path.join(dir, "android/app/build.gradle");

  let file = await openGradleBuildFile(gradleBuildFilePath);

  file = await setAndroidVersion(file, version);
  file = await setAndroidBuild(file, build);

  await saveGradleBuildFile(gradleBuildFilePath, file);
};

const greet = async () => {
  // Displaying cap-set-version-from-package CLI
  console.log(gradient.pastel.multiline("cap-set-version-from-package"));

  // Wait for 1sec
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    await checkForAndroidPlatform("./");
    let packageJson = await getPackageData("./");
    console.log(
      await gradient.pastel.multiline(
        `Got Package version i.e ${packageJson.version} !!`
      )
    );
    await setAndroidVersionAndBuild(
      "./",
      packageJson.version,
      packageJson.buildNo
    );
    await figlet("Updated to : \n Version: " + packageJson.version+"\n Build No.: "+packageJson.buildNo, (err, data) => {
      console.log(gradient.pastel.multiline(data));
    });
    console.log(
      await gradient.pastel.multiline(
        `Successfully Updated Version and build number in build.gradle !!`
      )
    );
  } catch (err) {
    console.error(err);
  } finally {
    await gradient.pastel.multiline(`cya `);
  }
};

// Call the greet function
greet();
