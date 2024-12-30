const fs = require('fs').promises;
const path = require('path');

async function createProjectDist() {
  const projectDist = path.join(__dirname, 'project-dist');
  await fs.mkdir(projectDist, { recursive: true });
  return projectDist;
}

async function compileHTML(templatePath, componentsDir, outputPath) {
  let template = await fs.readFile(templatePath, 'utf-8');

  const componentFiles = await fs.readdir(componentsDir, { withFileTypes: true });

  for (const file of componentFiles) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const componentName = path.basename(file.name, '.html');
      const componentContent = await fs.readFile(path.join(componentsDir, file.name), 'utf-8');
      const regex = new RegExp(`{{${componentName}}}`, 'g');
      template = template.replace(regex, componentContent);
    }
  }

  await fs.writeFile(outputPath, template);
}

async function compileStyles(stylesDir, outputFile) {
  const files = await fs.readdir(stylesDir, { withFileTypes: true });
  let styles = '';

  for (const file of files) {
    const filePath = path.join(stylesDir, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
      const style = await fs.readFile(filePath, 'utf-8');
      styles += `${style}\n`;
    }
  }

  await fs.writeFile(outputFile, styles);
}

async function copyAssets(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  const projectDist = await createProjectDist();
  const templatePath = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsSrcDir = path.join(__dirname, 'assets');
  const assetsDestDir = path.join(projectDist, 'assets');

  await compileHTML(templatePath, componentsDir, path.join(projectDist, 'index.html'));
  await compileStyles(stylesDir, path.join(projectDist, 'style.css'));
  await copyAssets(assetsSrcDir, assetsDestDir);

  console.log('Build completed successfully!');
}

buildPage().catch(error => {
  console.error('Error during build:', error);
});