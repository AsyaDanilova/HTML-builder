const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Welcome! Please enter text. Type "exit" to quit.');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Event listener for user input
rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        rl.close();
    } else {
        writeStream.write(`${input}\n`);
    }
});

// Event listener for when the readline interface is closed
rl.on('close', () => {
    console.log('Goodbye!');
    writeStream.end();
    process.exit(0);
});

// Handle process termination (e.g., Ctrl+C)
process.on('SIGINT', () => {
    console.log('\nGoodbye!');
    rl.close();
});


