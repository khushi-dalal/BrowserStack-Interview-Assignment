Here's a detailed `README.md` for your project:

---

# Real-Time Log Monitoring with WebSocket

This project provides a real-time log file monitoring solution using Node.js, Express, and WebSocket. It streams live updates from a log file to a web client, similar to the `tail -f` command in UNIX, sending only the new content to the client without retransmitting the entire file.

## Features

- **Real-Time Monitoring:** Updates are pushed to the client as soon as they are written to the log file.
- **Efficient Handling:** Only new content is transmitted, reducing bandwidth and processing overhead.
- **Supports Large Files:** Efficiently handles large log files by tracking changes and sending only the latest updates.
- **Multi-Client Support:** Multiple clients can connect simultaneously and receive real-time updates.
- **No Third-Party Tail Libraries:** Implements custom logic to read and stream log file content.

## How It Works

- The server reads the log file and tracks changes based on file size and last read position.
- When the log file is modified, the server reads only the new content, updates an internal buffer, and transmits the updates to all connected WebSocket clients.
- The client initially receives the entire log file and subsequent changes in real-time.

## Prerequisites

- Node.js (v14 or later)
- NPM (Node Package Manager)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/log-monitoring-websocket.git
   cd log-monitoring-websocket
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Create a Log File:**

   Create a `logfile.log` file in the root directory of the project.

4. **Run the Server:**

   ```bash
   node server.js
   ```

5. **Access the Web Client:**

   Open your web browser and go to `http://localhost:3000/log` to see the log file being monitored in real-time.

## Usage

- **Start Logging:** Write or append data to the `logfile.log` file to see real-time updates on the web client.
- **Monitor Changes:** The web client will display the log file's content and update dynamically as new data is written to the file.

## Customization

- **Log File Path:** Modify the `LOG_FILE_PATH` constant in `server.js` to monitor a different log file.
- **Polling Interval:** Adjust the `POLL_INTERVAL` constant in `server.js` to change how frequently the server checks for file changes.
- **Maximum Lines:** Set the `MAX_LINES` constant in `server.js` to change the number of lines stored in the buffer.

## Example

You can simulate log file updates by manually editing the `logfile.log` file, or by running a script that writes to the file.

```bash
echo "New log entry" >> logfile.log
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Replace the placeholder `https://github.com/yourusername/log-monitoring-websocket.git` with your actual GitHub repository URL.
