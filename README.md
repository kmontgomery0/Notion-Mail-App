# Notion Mail App
A basic Command-Line Interface (CLI) application that allows users to send and receive messages through the Notion API. Messages are stored in a Notion database, where the app reads and writes data directly.

**Description of the program:**
- _Send Messages:_ Users can send messages to specified recipients, which are stored in the Notion database.
- _Receive Messages:_ Users can retrieve messages sent to them by querying the Notion database.
- The app connects to a Notion database using the Notion API and securely reads from and writes to it based on user input from the CLI. All interactions are handled server-side, so private information remains secure.

**Additional Improvements:**
- Add timestamps to each of the messages that indicate when the message was sent.
- Add functionality to delete messages.

**How to install and run the program:**
- Set Up: Clone the repository and install dependencies.
- Configure: Add your Notion API token and database ID in the .env file.

  ````NOTION_KEY=your_notion_api_token
  ````NOTION_DATABASE_ID=your_notion_database_id
- Run: Use the CLI to send and receive messages.  ````npm run````

**Source References:**
- e.g. StackOverflow post about Node CLI applications, API docs, any open-source libraries).

**Future Improvements:**
- Add a testing suite that tests the program’s correctness.
- Allow users to search messages by sender or specific keywords for easier navigation.
- Mark messages as Read/Unread to help users distinguish between new and previously read messages.
- Allow users to schedule messages to be sent at a future date.
- Allow users to send messages with basic formatting (e.g., bold, italics).
- Improve user experience with a more intuitive CLI design, or provide a web-based or Notion-based dashboard to view and manage messages visually.

**Product or technical choices (and why?):**
- h
