const fs = require('fs').promises;
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const app = express();

const LOG_FILE_PATH = 'logfile.log';
const PORT = 3000;
const POLL_INTERVAL = 1000;
const MAX_LINES = 10;

let lastReadPosition = 0;
let buffer = [];

async function readContent(fd, startPosition) {
    const stats = await fs.stat(LOG_FILE_PATH);
    const fileSize = stats.size;
    const contentSize = fileSize - startPosition;
    if (contentSize <= 0) return '';

    const contentBuffer = Buffer.alloc(contentSize);
    await fd.read(contentBuffer, 0, contentSize, startPosition);
    return contentBuffer.toString('utf-8');
}

async function updateBuffer(newContent) {
    buffer = buffer.concat(newContent.split('\n'));
    if (buffer.length > MAX_LINES) {
        buffer = buffer.slice(-MAX_LINES);
    }
}

async function monitorFile(wss) {
    try {
        const stats = await fs.stat(LOG_FILE_PATH);
        lastReadPosition = stats.size;

        setInterval(async () => {
            try {
                const stats = await fs.stat(LOG_FILE_PATH);
                const fileSize = stats.size;

                if (fileSize > lastReadPosition) {
                    const fd = await fs.open(LOG_FILE_PATH, 'r');
                    const newContent = await readContent(fd, lastReadPosition);

                    if (newContent) {
                        await updateBuffer(newContent);
                        lastReadPosition = fileSize;
                    }
                    await fd.close();

                    const bufferContent = buffer.join('\n');
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(bufferContent);
                        }
                    });
                }
            } catch (error) {
                console.error('Error during file monitoring:', error);
            }
        }, POLL_INTERVAL);
    } catch (error) {
        console.error('Error setting up file monitoring:', error);
    }
}

app.get('/log', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', async (ws) => {
    try {
        const stats = await fs.stat(LOG_FILE_PATH);
        const fileContent = await fs.readFile(LOG_FILE_PATH, 'utf-8');
        buffer = fileContent.split('\n');

        if (buffer.length > MAX_LINES) {
            buffer = buffer.slice(-MAX_LINES);
        }
        
        lastReadPosition = fileContent.length;

        ws.send(buffer.join('\n'));
    } catch (error) {
        console.error('Error on WebSocket connection:', error);
    }
});

monitorFile(wss);

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});