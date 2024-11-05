const inquirer = require('inquirer');
const { sendMessage, readMessages, deleteMessage, findPageIdByMessageId, markAsRead } = require('./notionClient');

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
      { name: "Read: Check a user's mail", value: 'read' },
      { name: "Mark as Read: Mark specific messages as read", value: 'mark_as_read' },
      { name: "Delete: Delete a specific message", value: 'delete' }
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
                console.log(`\nMessage ${index + 1} (${msg.status}):\nFrom: ${msg.sender}\nAt: ${formatTimestamp(msg.timestamp)}\nMessage: ${msg.message}`);
            });
        }
    } else {
      console.error('Failed to retrieve messages:', result.error);
    }
  } else if (action === 'mark_as_read') {
    const { recipient } = await inquirer.prompt({
        name: 'recipient',
        message: 'Recipient to mark messages as read:',
        type: 'input',
        validate: input => input ? true : 'Recipient cannot be empty.'
    });

    // Fetch messages for the specified recipient
    const result = await readMessages(recipient);
    if (result.success && result.data.length > 0) {
        // Prompt the user to select a message to mark as read
        const { messageId } = await inquirer.prompt({
            name: 'messageId',
            type: 'list',
            message: 'Select a message to mark as read:',
            choices: result.data
                .filter(msg => msg.status === 'Unread') // Only show unread messages
                .map((msg, index) => ({
                    name: `Message ${index + 1} from ${msg.sender} on ${formatTimestamp(msg.timestamp)}: ${msg.message}`,
                    value: msg.messageId
                })),
        });

        // Find the Notion Page ID using the selected Message ID
        const findResult = await findPageIdByMessageId(messageId);
        if (findResult.success) {
            // Mark the message as read using the Notion page ID
            const markResult = await markAsRead(findResult.pageId);
            if (markResult.success) {
                console.log('Message marked as read successfully!');
            } else {
                console.error('Failed to mark message as read:', markResult.error);
            }
        } else {
            console.error(findResult.error);
        }
    } else {
        console.log(result.message || 'No unread messages found to mark as read.');
    }
} else if (action === 'delete') {
    const { recipient } = await inquirer.prompt({
        name: 'recipient',
        message: 'Recipient to delete messages for:',
        type: 'input',
        validate: input => input ? true : 'Recipient cannot be empty.'
      });
  
    // Fetch messages for the specified recipient
    const result = await readMessages(recipient);
    if (result.success && result.data.length > 0) {
        // Prompt the user to select a message to delete
        const { messageId } = await inquirer.prompt({
          name: 'messageId',
          type: 'list',
          message: 'Select a message to delete:',
          choices: result.data.map((msg, index) => ({
            name: `Message ${index + 1} from ${msg.sender} on ${formatTimestamp(msg.timestamp)}: ${msg.message}`,
            value: msg.messageId
          })),
        });

        // Find the Notion Page ID using the selected Message ID
        const findResult = await findPageIdByMessageId(messageId);
        if (findResult.success) {
            // Delete the message using the Notion page ID
            const deleteResult = await deleteMessage(findResult.pageId);
            if (deleteResult.success) {
                console.log('Message deleted successfully!');
            } else {
                console.error('Failed to delete message:', deleteResult.error);
            }
        } else {
            console.error(findResult.error);
        }
      } else {
        console.log(result.message || 'No messages found to delete.');
      }
    }
  }

main();
