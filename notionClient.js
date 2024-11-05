require('dotenv').config(); // Load environment variables from .env
const { Client } = require('@notionhq/client');

// Initialize Notion client with the API key from .env
const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// Function to send a message (create a new page in the Notion database)
async function sendMessage(sender, recipient, message) {
  const currentTime = new Date().toISOString(); // current timestamp
  const messageId = Date.now(); // unique message ID
  try {
    // Create a new page in the database with properties for Sender, Recipient, Message, and Timestamp
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Message': {
          title: [{ text: { content: message } }]
        },
        'Sender': {
          rich_text: [{ text: { content: sender } }]
        },
        'Recipient': {
          rich_text: [{ text: { content: recipient } }]
        },
        'Timestamp': {
          date: {start: currentTime}
        },
        'Message ID': {
          number: messageId
        },
      },
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Function to read messages for a specific recipient
async function readMessages(recipient) {
  try {
    // Query the database to get pages where the 'Recipient' property matches the recipient's name
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Recipient',
        rich_text: { equals: recipient }
      },
    });

    // Check if there are any messages
    if (response.results.length === 0) {
        return { success: true, data: [], message: `No messages found for ${recipient}.` };
        }

    // Map the results to return an array of message objects with sender, message content, and timestamp
    const messages = response.results.map(page => ({
      id: page.id, // Notion Page ID
      messageId: page.properties['Message ID'].number,
      sender: page.properties['Sender'].rich_text[0]?.text.content,
      message: page.properties['Message'].title[0]?.text.content,
      timestamp: page.properties['Timestamp'].date?.start,
    }));
    return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Function to find the Notion Page ID based on a custom Message ID
async function findPageIdByMessageId(messageId) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Message ID',
          number: { equals: messageId }
        },
      });
  
      if (response.results.length === 0) {
        return { success: false, error: `No message found with Message ID: ${messageId}` };
      }
  
      // Return the Notion Page ID of the first result
      const pageId = response.results[0].id;
      return { success: true, pageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

// Function to delete messages for a specific message
async function deleteMessage(pageId) {
    try {
      await notion.pages.update({
        page_id: pageId,
        archived: true,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

// Export functions for use in the main CLI file
module.exports = {
  sendMessage,
  readMessages,
  deleteMessage,
  findPageIdByMessageId,
};

