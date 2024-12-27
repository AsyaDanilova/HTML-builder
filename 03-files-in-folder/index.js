const fs = require('fs');
const path = require('path');

// Path to the secret-folder
const secretFolderPath = path.join(__dirname, 'secret-folder');

// Function to read and process directory contents
function readDirectory(directoryPath) {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error('Unable to read directory:', err);
            return;
        }

        // Iterate over each item in the directory
        items.forEach(item => {
            const itemPath = path.join(directoryPath, item.name);

            if (item.isFile()) {
                // Retrieve data for file
                fs.stat(itemPath, (err, stats) => {
                    if (err) {
                        console.error('Unable to retrieve stats for file:', err);
                        return;
                    }

                    // Extract file extension and name without extension
                    const fileExtension = path.extname(item.name).slice(1);
                    const fileName = path.basename(item.name, path.extname(item.name));
                    const fileSize = stats.size / 1024; // Convert size to kilobytes

                    // Display file data in the format: <file name>-<file extension>-<file size>
                    console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
                });
            } else if (item.isDirectory()) {
                // Read files in sub-directory
                readDirectory(itemPath);
            }
        });
    });
}

// Start processing from the secret-folder
readDirectory(secretFolderPath);