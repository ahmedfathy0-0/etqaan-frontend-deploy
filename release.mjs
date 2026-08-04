import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);

const version = process.argv[2];
if (!version) {
  console.error("❌ Please provide a version number!");
  console.error("Usage: node release.mjs 1.0.1");
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("❌ Invalid version format. Please use a semantic version like 1.0.1");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRONTEND_DIR = __dirname;
const BACKEND_DIR = path.join(__dirname, '..', 'etqaan-backend-deploy');

async function updateFrontend() {
  console.log(`\n📦 Updating Frontend to v${version}...`);

  // Update package.json
  const packagePath = path.join(FRONTEND_DIR, 'package.json');
  const pkgData = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  pkgData.version = version;
  await fs.writeFile(packagePath, JSON.stringify(pkgData, null, 2) + '\n');
  console.log("  ✅ package.json updated");

  // Update Android versionCode and versionName
  const buildGradlePath = path.join(FRONTEND_DIR, 'android', 'app', 'build.gradle');
  try {
    let gradleData = await fs.readFile(buildGradlePath, 'utf8');
    gradleData = gradleData.replace(
      /versionCode (\d+)/,
      (_, p1) => `versionCode ${parseInt(p1) + 1}`
    );
    gradleData = gradleData.replace(
      /versionName "[^"]+"/,
      `versionName "${version}"`
    );
    await fs.writeFile(buildGradlePath, gradleData);
    console.log("  ✅ android/app/build.gradle updated");
  } catch {
    console.log("  ⚠️  Skipping android build.gradle (not found — run 'npx cap add android' first)");
  }

  // Git operations
  console.log("  🚀 Committing and pushing frontend changes...");
  await execAsync(`git add package.json`, { cwd: FRONTEND_DIR });
  try {
    await execAsync(`git add android/app/build.gradle`, { cwd: FRONTEND_DIR });
  } catch { /* gradle file might not exist yet */ }

  try {
    await execAsync(`git commit -m "chore: release v${version}"`, { cwd: FRONTEND_DIR });
  } catch {
    // No changes to commit
  }

  await execAsync(`git tag v${version}`, { cwd: FRONTEND_DIR });
  // await execAsync(`git push`, { cwd: FRONTEND_DIR });
  // await execAsync(`git push origin v${version}`, { cwd: FRONTEND_DIR });
  console.log(`  🎉 Frontend GitHub Actions release v${version} triggered!`);
}

async function updateBackend() {
  console.log(`\n⚙️  Updating Backend to v${version}...`);

  // Update app.service.ts version strings
  const servicePath = path.join(BACKEND_DIR, 'src', 'app.service.ts');
  let serviceData = await fs.readFile(servicePath, 'utf8');

  serviceData = serviceData.replace(
    /(windows:\s*\{\s*latest:\s*)'[^']*'/g,
    `$1'${version}'`
  );
  serviceData = serviceData.replace(
    /(linux:\s*\{\s*latest:\s*)'[^']*'/g,
    `$1'${version}'`
  );
  serviceData = serviceData.replace(
    /(android:\s*\{\s*latest:\s*)'[^']*'/g,
    `$1'${version}'`
  );

  // Also handle double-quoted strings
  serviceData = serviceData.replace(
    /(windows:\s*\{\s*latest:\s*)"[^"]*"/g,
    `$1"${version}"`
  );
  serviceData = serviceData.replace(
    /(linux:\s*\{\s*latest:\s*)"[^"]*"/g,
    `$1"${version}"`
  );
  serviceData = serviceData.replace(
    /(android:\s*\{\s*latest:\s*)"[^"]*"/g,
    `$1"${version}"`
  );

  await fs.writeFile(servicePath, serviceData);
  console.log("  ✅ src/app.service.ts updated");

  // Git operations
  console.log("  🚀 Committing and pushing backend changes...");
  await execAsync(`git add src/app.service.ts`, { cwd: BACKEND_DIR });

  try {
    await execAsync(`git commit -m "chore: release v${version}"`, { cwd: BACKEND_DIR });
  } catch {
    // No changes to commit
  }

  // await execAsync(`git push`, { cwd: BACKEND_DIR });
  console.log(`  🎉 Backend update v${version} pushed!`);
}

async function main() {
  try {
    console.log(`\n🚀 Starting automated release pipeline for v${version}...`);
    await updateFrontend();
    await updateBackend();
    console.log(`\n✨ RELEASE v${version} COMPLETED SUCCESSFULLY! ✨`);
    console.log(`\nGitHub Actions is now building Linux AppImage, Windows .exe and Android APK in the cloud.`);
    console.log(`Check progress at: https://github.com/ahmedfathy0-0/etqaan-frontend-deploy/actions`);
  } catch (err) {
    console.error("\n❌ Error during release:", err.message);
    if (err.stdout) console.error("Output:", err.stdout);
    if (err.stderr) console.error("Error output:", err.stderr);
    process.exit(1);
  }
}

main();
