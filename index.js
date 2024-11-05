const inquirer = require('inquirer');
const { sendMessage, readMessages } = require('./notionClient');

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  }

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
    const { sortOrder } = await inquirer.prompt({
      name: 'sortOrder',
      type: 'list',
      message: 'How would you like to sort the messages?',
      choices: [
        {name: 'Newest first', value: 'newest'},
        {name: 'Oldest first', value: 'oldest'}
      ],
    });
    const result = await readMessages(recipient);
        if (result.success) {      
            if (result.data.length === 0) {
                console.log(result.message); // "No messages found" message
        } else {
            // Sort messages based on user selection
            const sortedMessages = result.data.sort((a,b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return sortOrder === 'newest' ? dateB - dateA: dateA - dateB;
            });
            // Display messages in sorted order
            console.log(`${result.data.length} messages for ${recipient}:`);
            sortedMessages.forEach((msg, index) => {
                console.log(`\nMessage ${index + 1}:\nFrom: ${msg.sender}\nAt: ${formatTimestamp(msg.timestamp)}\nMessage: ${msg.message}`);
            });
        }
    } else {
      console.error('Failed to retrieve messages:', result.error);
    }
  }
}

main();
