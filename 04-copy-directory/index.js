const fs = require('fs').promises;
const path = require('path');

async function copyDirectory(src, dest) {
  // Create the destination directory if it doesn't exist
  await fs.mkdir(dest, { recursive: true });

  // Read the contents of the source directory
  const entries = await fs.readdir(src, { withFileTypes: true });

  // Iterate over each entry in the source directory
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy directories
      await copyDirectory(srcPath, destPath);
    } else {
      // Copy files
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const src = path.join(__dirname, 'files');
  const dest = path.join(__dirname, 'files-copy');

  // Check if the source directory exists
  try {
    await fs.access(src);
  } catch (err) {
    console.error(`Source directory "${src}" does not exist.`);
    return;
  }

  // Copy the contents of the source directory to the destination directory
  await copyDirectory(src, dest);
  console.log(`Contents of "${src}" have been copied to "${dest}".`);
}

main().catch(err => {
  console.error(err);
});