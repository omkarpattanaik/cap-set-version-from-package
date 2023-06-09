const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

describe("Starting Functional Test cases...", () => {
  let root = null;
  let csvfp = "node "+path.join( "/src/index.js")
  beforeAll(() => {
    root = shell.pwd().stdout;
    csvfp = "node "+path.join(root, "/src/index.js")
    shell.echo("root: ", root);
    shell.echo("csvfp index path: ", root);
    shell.echo("**** Application Testing Starts ****");
    // console.log(shell.ls("./").stdout);
    // shell.exec("npm i -g", { silent: true });
    shell.mkdir("test-env");
    shell.cd("test-env");
  });
  test("should throw error i.e 'Invalid Package : file' if package.json is not found", async () => {
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stderr.includes("Invalid Package : file")
    ).toBeTruthy();
  });
  test("should throw Warning  i.e 'Invalid Android platform: file' if android dir is not found", async () => {
    shell.cp("-Rf", "../test_sample/sample_app", "sample_app");
    shell.cd("sample_app");
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stderr.includes(
          "WARNING:  Android platform: folder android does not exist"
        )
    ).toBeTruthy();
  });
  test("should throw Warning  i.e 'ios does not exist' if ios dir is not found", async () => {
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stderr.includes("WARNING:  ios platform: folder ios does not exist")
    ).toBeTruthy();
  });
  test("should Update Version of Platform Android", async () => {
    shell.exec("npm install", { silent: true });
    shell.exec("npm run build", { silent: true });
    shell.exec("npx cap add android", { silent: true });
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stdout.includes(
          "Successfully Updated Version and build number in android path:"
        )
    ).toBeTruthy();
  });
  test("should Update Version of Platform iOS", async () => {
    shell.exec("npm run build", { silent: true });
    shell.exec("npx cap add ios", { silent: true });
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stdout.includes(
          "Successfully Updated Version and build number in ios path:"
        )
    ).toBeTruthy();
  });
  test("should throw error as versionName was not found in build.gradle in Platform Android", async () => {
    shell.sed("-i", "versionName", "ver-name", "./android/app/build.gradle");
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stderr.includes(
          'Could not find "versionName" in android/app/build.gradle file'
        )
    ).toBeTruthy();
  });
  test("should throw error as build.gradle does not exist in Platform Android", async () => {
    shell.rm("./android/app/build.gradle");
    const gradleBuildFilePath = path.join("./android", "/app/build.gradle");
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stderr.includes(
          `Invalid Android platform: file ${gradleBuildFilePath} does not exist`
        )
    ).toBeTruthy();
  });
  test("should throw error as MARKETING_VERSION was not found in /project.pbxproj in Platform iOS", async () => {
    fs.rmSync("./android", { recursive: true }, () =>
      console.log("android dir removed...")
    );
    shell.sed(
      "-i",
      "MARKETING_VERSION",
      "ver-name",
      "./ios/App/App.xcodeproj/project.pbxproj"
    );
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stderr.includes(
          `Could not find "MARKETING_VERSION" in project.pbxproj file`
        )
    ).toBeTruthy();
  });
  test("should throw error as project.pbxproj does not exist in Platform iOS", async () => {
    const iOSProjectFilePath = path.join(
      "ios",
      "/App/App.xcodeproj/project.pbxproj"
    );
    shell.rm(iOSProjectFilePath);
    //console.log("Removing; ",shell.exec(csvfp).stderr);
    expect(
      shell
        .exec(csvfp, { silent: true })
        .stderr.includes(
          `Invalid iOS project file: file ${iOSProjectFilePath} does not exist`
        )
    ).toBeTruthy();
  });

  afterAll(() => {
    // Clears the test-env dir after tseting is done
    //shell.exec("npm rm -g", { silent: true });
    shell.cd(root);
    shell.echo("root now: " + shell.pwd());
    fs.rmSync("./test-env", { recursive: true }, () =>
      console.log("test-env removed...")
    );
    shell.echo("**** Application Testing Ends ****");
  });
});
