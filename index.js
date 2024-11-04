// require('dotenv').config(); // Load environment variables
// const inquirer = require('inquirer');
// const { Client } = require('@notionhq/client');

// // Initialize Notion client with your API token
// const notion = new Client({ auth: process.env.NOTION_KEY });
// const databaseId = process.env.NOTION_DATABASE_ID;

// // Function to send a message
// async function sendMessage(sender, recipient, message) {
//   try {
//     await notion.pages.create({
//       parent: { database_id: databaseId },
//       properties: {
//         'Sender': { title: [{ text: { content: sender } }] },
//         'Recipient': { rich_text: [{ text: { content: recipient } }] },
//         'Message': { rich_text: [{ text: { content: message } }] },
//         'Timestamp': { date: { start: new Date().toISOString() } },
//       },
//     });
//     console.log('Message sent!');
//   } catch (error) {
//     console.error('Failed to send message:', error);
//   }
// }

// // Function to read messages for a specific recipient
// async function readMessages(recipient) {
//   try {
//     const response = await notion.databases.query({
//       database_id: databaseId,
//       filter: { property: 'Recipient', rich_text: { equals: recipient } },
//     });
//     const messages = response.results.map((page) => ({
//       sender: page.properties['Sender'].title[0]?.text.content,
//       message: page.properties['Message'].rich_text[0]?.text.content,
//       timestamp: page.properties['Timestamp'].date?.start,
//     }));
//     console.log(`Messages (${messages.length}):`);
//     messages.forEach((msg, index) => {
//       console.log(`\nMessage ${index + 1}:\nFrom: ${msg.sender}\nAt: ${msg.timestamp}\n${msg.message}`);
//     });
//   } catch (error) {
//     console.error('Failed to read messages:', error);
//   }
// }

// // Main CLI flow
// async function main() {
//   console.log("Welcome to NotionMail!");
//   const { action } = await inquirer.prompt({
//     name: 'action',
//     type: 'list',
//     message: 'Please select an option:',
//     choices: [
//       { name: 'send: Send mail to a user.', value: 'send' },
//       { name: 'read: Check a user\'s mail.', value: 'read' }
//     ],
//   });

//   if (action === 'send') {
//     const { sender, recipient, message } = await inquirer.prompt([
//       { name: 'sender', message: 'Sender:', type: 'input' },
//       { name: 'recipient', message: 'Recipient:', type: 'input' },
//       { name: 'message', message: 'Message:', type: 'input' },
//     ]);
//     await sendMessage(sender, recipient, message);
//   } else if (action === 'read') {
//     const { recipient } = await inquirer.prompt({ name: 'recipient', message: 'User:', type: 'input' });
//     await readMessages(recipient);
//   }
// }

// main();

const inquirer = require('inquirer');
const { sendMessage, readMessages } = require('./notionClient');

async function main() {
  console.log("Welcome to Notion Mail!");

  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Please select an option:',
    choices: [
      { name: "Send: Send mail to a user", value: 'send' },
      { name: "Read: Check a user's mail", value: 'read' }
    ],
  });

  if (action === 'send') {
    const { sender, recipient, message } = await inquirer.prompt([
      { name: 'sender', message: 'Sender:', type: 'input', validate: input => input ? true : 'Sender cannot be empty.'},
      { name: 'recipient', message: 'Recipient:', type: 'input', validate: input => input ? true : 'Recipient cannot be empty.'},
      { name: 'message', message: 'Message:', type: 'input', validate: input => input ? true : 'Message cannot be empty.'},
    ]);
    const result = await sendMessage(sender, recipient, message);
    if (result.success) {
      console.log('Message sent successfully!');
    } else {
      console.error('Failed to send message:', result.error);
    }
  } else if (action === 'read') {
    const { recipient } = await inquirer.prompt({
      name: 'recipient',
      message: 'Recipient to check messages for:',
      type: 'input',
      validate: input => input ? true : 'Recipient cannot be empty.'
    });
    const result = await readMessages(recipient);
        if (result.success) {      
            if (result.data.length === 0) {
                console.log(result.message); // "No messages found" message
        } else {
            console.log(`${result.data.length} messages for ${recipient}:`);
            result.data.forEach((msg, index) => {
            console.log(`\nMessage ${index + 1}:\nFrom: ${msg.sender}`);
            });
        }
    } else {
      console.error('Failed to retrieve messages:', result.error);
    }
  }
}

main();
