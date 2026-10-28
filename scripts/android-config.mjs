// Runs on the build machine after `npx cap add android`: sets the app version from the environment
// and, when signing secrets are present, adds a release signing config to android/app/build.gradle.
import {readFileSync, writeFileSync} from "node:fs";
const gradle = "android/app/build.gradle";
let g = readFileSync(gradle, "utf8");
const versionCode = process.env.VERSION_CODE || "1";
const versionName = process.env.VERSION_NAME || "1.0.0";
const before = g;
g = g.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
     .replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);
if (g === before && !/versionCode\s+\d+/.test(before)) throw new Error("versionCode not found in build.gradle");

const ks = process.env.ANDROID_KEYSTORE_PATH;
if (ks) {
  const signing = `    signingConfigs {
        release {
            storeFile file("${ks}")
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
`;
  if (!/\n\s*buildTypes\s*\{/.test(g)) throw new Error("buildTypes block not found");
  g = g.replace(/\n(\s*)buildTypes\s*\{\s*release\s*\{/, (m, ind) => `\n${signing}${ind}buildTypes {\n${ind}    release {\n${ind}        signingConfig signingConfigs.release`);
  console.log("release signing configured");
}
writeFileSync(gradle, g);
console.log(`Android configured: versionCode ${versionCode}, versionName ${versionName}`);
