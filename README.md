# Notion Mail App
A basic Command-Line Interface (CLI) application that allows users to send and receive messages through the Notion API. Messages are stored in a Notion database, where the app reads and writes data directly.

**Description of the program:**
- _Send Messages:_ Users can send messages to specified recipients, which are stored in the Notion database.
- _Receive Messages:_ Users can retrieve messages sent to them by querying the Notion database.
- The app connects to a Notion database using the Notion API and securely reads from and writes to it based on user input from the CLI. All interactions are handled server-side, so private information remains secure.

**Additional Improvements:**
- Added timestamps to each of the messages that indicate when the message was sent.
- Added functionality to read messages sorted from newest to oldest or oldest to newest.
- Added functionality to delete message.
- Added ability to mark messages as Read/Unread to help users distinguish between new and previously read messages.

**How to install and run the program:**
- Set Up: Clone the repository and install dependencies.
  - Ensure the Inquirer dependency version: ````npm install inquirer@8.2.5````
- Configure: Add your Notion API token and database ID in the .env file.

  ````NOTION_KEY=your_notion_api_token````
  ````NOTION_DATABASE_ID=your_notion_database_id````
- Run: Use the CLI to send and receive messages.  ````npm start````

**Source References:**
- https://developers.notion.com/docs
- https://github.com/makenotion/notion-sdk-js
- https://www.npmjs.com/package/inquirer
- https://nodejs.org/docs/latest/api/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- https://medium.com/@voltx180/a-beginners-guide-for-creating-command-line-programs-in-node-js-42d1ebfe9c08 

**Future Improvements:**
- Add a testing suite that tests the program’s correctness.
  - Functional tests for message creation, retrieval, status, deletion (account for missing/existing fields, duplicates, accessing already read/deleted messages)
  - Tests for error handling (like invalid message ID, API timeouts)
  - Tests for CLI inputs and user actions
  - Performance and load tests
- Allow users to search messages by sender or specific keywords for easier navigation.
- Allow users to schedule messages to be sent at a future date.
- Allow users to send messages with basic formatting (e.g., bold, italics).
- Improve user experience with a more intuitive CLI design, or provide a web-based or Notion-based dashboard to view and manage messages visually.

**Product or technical choices (and why?):**
- **Inquirer.js Library for CLI:** Used the Inquirer.js library to build an interactive command-line interface, providing a user-friendly experience without requiring a frontend. This library allows users to easily select options, enter message details, and navigate through the application.
- **Structured Error Handling and Logging:** Implemented structured error handling with detailed logging to quickly identify issues and address them efficiently during app development and debugging. This approach ensures smooth operation and easier troubleshooting.
- **Date Formatting for Readability:** Added a date formatting function to display timestamps in a more user-friendly format, because ISO string timestamps can be hard to read for end-users. Formatting dates into a more familiar structure improves readability and enhances the user experience when viewing message details in the CLI.
- **Message Sorting Functionality:** Implemented sorting functionality to display messages either from newest to oldest or vice versa. This enhances user experience by allowing them to view messages in a preferred chronological order, giving users flexibilty and better control over the mail app.
- **Unread/Read Status Tracking:** Introduced a Status property in the Notion database to track whether a message is "Read" or "Unread." This provides a simple way to manage the state of each message and integrates well with Notion's interface, allowing users to manually update the status if needed.
