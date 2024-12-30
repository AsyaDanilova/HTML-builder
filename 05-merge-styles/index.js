const fs = require('fs').promises;
const path = require('path');

async function mergeStyles(srcDir, destFile) {
    try {
        // Create the destination directory if it does not exist
        await fs.mkdir(path.dirname(destFile), { recursive: true });

        // Read the content of the source directory
        const files = await fs.readdir(srcDir, { withFileTypes: true });

        let styles = [];

        for (const file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const filePath = path.join(srcDir, file.name);
                const style = await fs.readFile(filePath, 'utf-8');
                styles.push(style);
            }
        }

        const bundleContent = styles.join('\n');
        await fs.writeFile(destFile, bundleContent);

        console.log(`Styles have been merged into ${destFile}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

const srcDir = path.join(__dirname, 'styles');
const destFile = path.join(__dirname, 'project-dist', 'bundle.css');

mergeStyles(srcDir, destFile);