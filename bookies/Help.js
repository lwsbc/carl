import { InlineKeyboard } from 'grammy';
import { applyFont, registerModule } from '../bookieutils/helpeutils/fonthelp.js';
import { info, error } from '../bookieutils/logger.js';
import { db } from '../bookieutils/db.js'; // Import db for persistence

export const name = 'Help';
export const version = '1.2.2'; // Version bumped for new commands
registerModule(name);

// Define help texts for each module
const HELP_MODULES = {
  'ActiveMembers': {
    summary: 'Tracks and displays active members in groups.',
    commands: [
      '/active - Get the live weekly leaderboard in a group.',
      '/lastactive - Get last week\'s champions in a group.',
      'Private Chat: /active - Select a timeframe to view active users in your default group (admins only).'
    ],
    details: 'The Active Members module keeps track of message counts for users in groups. It provides daily, weekly, monthly, and yearly leaderboards. Admins can view detailed activity via private chat commands. Data resets automatically at the end of each period.'
  },
  'Antimention': {
    summary: 'Deletes messages containing bot mentions.',
    commands: [
      'No direct commands for users.',
    ],
    details: 'This module automatically deletes messages that contain mentions of "bot" (e.g., @somebot) or links ending in "bot" (e.me/somebot) in groups and supergroups. This helps in keeping the chat clean from unwanted bot advertisements or spam.'
  },
  'Anticontact': {
    summary: 'Deletes messages containing contact information (emails/phone numbers) and can mute repeat offenders.',
    commands: [
      'No direct commands for users.',
    ],
    details: 'The Anticontact module scans messages for email addresses and Kenyan phone numbers. If detected, the message is deleted. Users who repeatedly send contact information may be temporarily muted to prevent spam and protect privacy.'
  },
  'Antilink': {
    summary: 'Deletes messages containing links and warns/mutes users.',
    commands: [
      'No direct commands for users.',
    ],
    details: 'This module automatically deletes messages containing URLs, text links, or text mentions. On the first offense, a warning is issued. Subsequent offenses within a 24-hour window will result in the user being muted for a configurable duration. This helps maintain a link-free environment.'
  },
  'Antipoll': {
    summary: 'Manages and restricts poll creation in groups.',
    commands: [
      '/pollon - Enable poll protection in the current group (admin only).',
      '/polloff - Disable poll protection in the current group (admin only).',
      'Private Chat: /pollon or /polloff - Manage poll protection for the default group (admins only).'
    ],
    details: 'The Antipoll module allows administrators to control whether users can send polls in a group. When enabled, any poll sent by a non-admin user will be automatically deleted, and a warning will be issued. This can be useful for maintaining focus in a chat or preventing spam.'
  },
  'Antispoiler': {
    summary: 'Deletes messages containing spoiler tags.',
    commands: [
      '/spoileron - Enable spoiler protection in the current group (admin only).',
      '/spoileroff - Disable spoiler protection in the current group (admin only).',
      'Private Chat: /spoileron or /spoileroff - Manage spoiler protection for the default group (admins only).'
    ],
    details: 'This module automatically deletes messages that use Telegram\'s spoiler formatting (hidden text). When enabled, any message containing spoiler text sent by a non-admin will be removed, and a warning will be sent. This ensures that sensitive information or plot details are not accidentally revealed in the group.'
  },
  'AntiBot': {
    summary: 'Automatically mutes new bot members joining a group.',
    commands: [
      'No direct commands for users.',
    ],
    details: 'The AntiBot module automatically detects and mutes new bot accounts that join a group, preventing them from sending messages. This helps to keep your group free from unwanted bot spam or malicious bots. Admins are exempt from this check.'
  },
  'AntiCustomEmoji': {
    summary: 'Deletes messages containing custom emojis.',
    commands: [
      'No direct commands for users.',
    ],
    details: 'This module automatically deletes messages that contain custom Telegram emojis. This can be useful for maintaining a specific aesthetic in a group or preventing the use of potentially distracting or inappropriate custom emojis.'
  },
  'AntiExternalReply': {
    summary: 'Deletes messages that are external replies (replies to messages from other chats).',
    commands: [
      'No direct commands for users.',
    ],
    details: 'This module automatically deletes messages that are replies to messages originating from outside the current chat. This helps to keep conversations focused and prevents the introduction of irrelevant context from other chats.'
  },
  'Blocker': {
    summary: 'Blocks specific phrases or words in group chats.',
    commands: [
      '/lock <phrase1,phrase2,...> - Add phrases to the blocklist (admin only).',
      '/unlock <phrase1,phrase2,...> - Remove phrases from the blocklist (admin only).',
      '/listlock - List all currently locked phrases (admin only).'
    ],
    details: 'The Blocker module allows administrators to define a list of phrases or words that are automatically deleted when used in group chats. This is useful for preventing spam, profanity, or off-topic discussions. Phrases can be added, removed, and listed.'
  },
  'Clean Module': {
    summary: 'Deletes commands sent by users in groups.',
    commands: [
      '/clean on - Enable command cleaning in the current group (admin only).',
      '/clean off - Disable command cleaning in the current group (admin only).'
    ],
    details: 'The Clean Module automatically deletes messages that start with a "/" (commands) sent by non-admin users in groups. This helps keep the chat history clean and focused, preventing clutter from command usage. Admins can toggle this feature on or off for their groups.'
  },
  'Connection': {
    summary: 'Manages connections to different Telegram chats for cross-module functionality.',
    commands: [
      '/connection <name> <chat_id> - Save a new connection (admin only).',
      '/delconnection <name> - Delete an existing connection (admin only).',
      '/listconnection - List all saved connections (admin only).',
      '/setdefault <name> - Set a default connection for private commands (admin only).',
      '/getdefault - Get the currently set default connection (admin only).'
    ],
    details: 'The Connection module allows administrators to link friendly names to specific chat IDs. This is crucial for modules that need to operate across different groups or from private chats to a designated group. It enables centralized management of group settings and actions.'
  },
  'Filter': {
    summary: 'Manages custom text filters, responses, and inline buttons for Telegram chats.',
    commands: [
      '/filter - Show the filter admin panel (admin only).',
      '/filter <name1,name2>\\n!Response1\\n!Response2\\nbutton 1:1\\n?ButtonName(https://url.com) - Create/update a filter (admin only).',
      '/delfilter <name1,name2> - Delete filters (admin only).',
      '/listfilter - List all filters (admin only).',
      '/delresponse <exact text> - Delete a specific response (admin only).',
      '/delfbutton <button name> - Delete a specific button (admin only).',
      '/lisfbuttons - List all buttons (admin only).',
      '/cancel - Cancel a pending filter action (admin only).'
    ],
    details: 'The Filter module allows administrators to set up custom text filters that trigger specific responses, including text and inline URL buttons. Filters can have multiple responses, which are cycled through. It supports aliases, complex button layouts, and provides detailed management commands.'
  },
  'Font Manager': {
    summary: 'Allows administrators to customize the font style used by different bot modules.',
    commands: [
      '/setfont - Opens an interactive menu to select a module and its font style (admin only).'
    ],
    details: 'The Font Manager provides a way to personalize the bot\'s messages. Administrators can choose from a variety of predefined font styles and apply them to individual modules, ensuring consistent and branded communication across the bot\'s features.'
  },
  'Getfilter': {
    summary: 'Retrieves and reconstructs the definition of existing filters from the database.',
    commands: [
      '/getfilter <filtername> - Get the full definition of a specified filter (admin only).'
    ],
    details: 'This module is a utility for administrators to inspect existing filters. It fetches the complete configuration of a filter, including its names, responses, and button definitions, and presents it in a format that can be easily re-used or understood for debugging and management.'
  },
  'Health': {
    summary: 'Provides a detailed health report of the bot and its host system.',
    commands: [
      '/health - Get a comprehensive report on memory, CPU, uptime, and disk usage (admin only, private chat).'
    ],
    details: 'The Health module is an administrative tool to monitor the bot\'s performance and resource consumption. It provides real-time data on system memory, process memory, CPU load, system and process uptime, and disk usage. This helps in diagnosing performance issues and ensuring the bot runs smoothly.'
  },
  'MyID': { // New module entry
    summary: 'Retrieves the Telegram ID of a user or the current chat.',
    commands: [
      '/myid - Get your own Telegram user ID.',
      '/myid <reply_to_message> - Get the Telegram user ID of the user whose message you replied to.',
      '/myid <@username> - Get the Telegram user ID of a specified username.'
    ],
    details: 'The MyID module allows any user to easily find their own Telegram user ID, or the ID of another user by replying to their message or mentioning their username. This can be useful for various bot interactions or for identifying users uniquely.'
  },
  'GroupID': { // New module entry
    summary: 'Retrieves the Telegram ID of the current group chat.',
    commands: [
      '/groupid - Get the Telegram ID of the current group chat (admin only).'
    ],
    details: 'The GroupID module provides administrators with a quick way to retrieve the unique Telegram ID of the group they are currently in. This ID is often required for configuring other bot modules or for external integrations.'
  },
  'PromoteDemote': {
    summary: 'Allows administrators to promote or demote users in groups.',
    commands: [
      '/promote <user_id|@username|reply_to_message> - Promote a user to a basic administrator (can invite users) (admin only).',
      '/demote <user_id|@username|reply_to_message> - Demote a user, removing their administrative rights (admin only).'
    ],
    details: 'The PromoteDemote module simplifies managing user permissions. Administrators can quickly grant or revoke basic administrative privileges (specifically, the ability to invite users) to other members within the group, either by user ID, username, or by replying to their message.'
  },
  'Scheduler': {
    summary: 'Manages and sends scheduled messages with advanced options.',
    commands: [
      '/sched - Access the main scheduler admin panel (admin only, private chat).'
    ],
    details: 'The Scheduler module provides a robust system for sending automated messages at specific times. Administrators can add, edit, enable/disable, and delete time slots. Messages can include text, native formatting, inline URL buttons with custom layouts, and various frequencies (daily, weekly, every N days). It ensures messages are sent precisely and handles bot removal from chats gracefully.'
  },
  'Service Clean': {
    summary: 'Automatically deletes Telegram service messages in groups.',
    commands: [
      '/cls - Trigger a manual clean check (admin only).'
    ],
    details: 'The Service Clean module keeps your group chat tidy by automatically deleting various Telegram service messages, such as "X joined the group," "Y left the group," "chat photo changed," etc. This helps in maintaining a cleaner and more focused chat history. It also supports batch deletion of these messages.'
  },
  'Welcome': {
    summary: 'Sends customizable welcome messages to new chat members.',
    commands: [
      '/wlc - Access the welcome module admin panel (admin only, private chat).'
    ],
    details: 'The Welcome module allows administrators to configure personalized welcome messages for new members joining their groups. These messages can include mentions, group names, custom text, and inline URL buttons. It also supports message timeouts for automatic deletion and provides a wizard-based setup flow for easy configuration.'
  },
};

const CALLBACK_PREFIX = 'help::';
const BUTTONS_PER_PAGE = 9; // 3x3 grid
const IDLE_TIMEOUT_MS = 60 * 1000; // 1 minute

// Store menu message IDs and their timers for each user
// Map: userId -> { messageId, chatId, timerId, lastActivityTimestamp }
const userMenuState = new Map();
let botApi = null; // To store the bot API instance for deleting messages

/**
 * Initializes the database table for help menu persistence.
 */
async function initDatabase() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS help_menus (
      user_id INTEGER PRIMARY KEY,
      chat_id INTEGER NOT NULL,
      message_id INTEGER NOT NULL,
      last_activity_timestamp INTEGER NOT NULL
    );
  `);
}

/**
 * Saves the current state of a user's help menu to the database.
 * @param {number} userId
 * @param {number} chatId
 * @param {number} messageId
 * @param {number} lastActivityTimestamp
 */
async function saveUserMenuState(userId, chatId, messageId, lastActivityTimestamp) {
  try {
    await db.run(
      `INSERT OR REPLACE INTO help_menus (user_id, chat_id, message_id, last_activity_timestamp)
       VALUES (?, ?, ?, ?)`,
      userId, chatId, messageId, lastActivityTimestamp
    );
  } catch (e) {
    error(`Failed to save help menu state for user ${userId}: ${e.message}`);
  }
}

/**
 * Deletes a user's help menu state from the database.
 * @param {number} userId
 */
async function deleteUserMenuState(userId) {
  try {
    await db.run(`DELETE FROM help_menus WHERE user_id = ?`, userId);
  } catch (e) {
    error(`Failed to delete help menu state for user ${userId}: ${e.message}`);
  }
}

/**
 * Clears an existing menu timer, saves state to DB, and sets a new one.
 * @param {number} userId
 * @param {number} chatId
 * @param {number} messageId
 */
async function setMenuTimeout(userId, chatId, messageId) {
  const existingState = userMenuState.get(userId);
  if (existingState?.timerId) {
    clearTimeout(existingState.timerId);
  }

  const now = Date.now();
  await saveUserMenuState(userId, chatId, messageId, now); // Save to DB

  const timerId = setTimeout(async () => {
    const state = userMenuState.get(userId);
    if (state && state.messageId === messageId) { // Ensure it's the same message
      try {
        await botApi.deleteMessage(state.chatId, state.messageId);
        info(`Help menu for user ${userId} in chat ${chatId} deleted due to idle timeout.`);
      } catch (e) {
        if (!e.description?.includes('message to delete not found')) {
          error(`Failed to delete idle help menu for user ${userId}: ${e.message}`);
        }
      } finally {
        userMenuState.delete(userId); // Clear from in-memory map
        await deleteUserMenuState(userId); // Delete from DB as well
      }
    }
  }, IDLE_TIMEOUT_MS);

  userMenuState.set(userId, { messageId, chatId, timerId, lastActivityTimestamp: now }); // Update in-memory map
}

/**
 * Generates the main help menu with a list of modules, paginated.
 * @param {import("grammy").Context} ctx - The context object.
 * @param {number} page - The current page number (1-indexed).
 * @returns {Promise<{text: string, keyboard: InlineKeyboard}>} The message text and inline keyboard.
 */
async function generateMainMenu(ctx, page = 1) {
  const moduleNames = Object.keys(HELP_MODULES).sort();
  const totalModules = moduleNames.length;
  const totalPages = Math.ceil(totalModules / BUTTONS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1)); // Ensure page is at least 1

  const start = (currentPage - 1) * BUTTONS_PER_PAGE;
  const paginatedModules = moduleNames.slice(start, start + BUTTONS_PER_PAGE);

  // Apply font to the static text parts
  const text = await applyFont(name, '📚 *Welcome to the Help Module!* 📚\n\n') +
               await applyFont(name, 'Select a module below to learn more about its commands and functionality:');
  
  const keyboard = new InlineKeyboard();

  let rowButtons = [];
  for (const moduleName of paginatedModules) {
    // Apply font only to the module name text, not the callback data
    rowButtons.push({ text: await applyFont(name, moduleName), callback_data: `${CALLBACK_PREFIX}show::${moduleName}` });
    if (rowButtons.length === 3) { // 3 buttons per row
      keyboard.row(...rowButtons);
      rowButtons = [];
    }
  }
  if (rowButtons.length > 0) { // Add any remaining buttons
    keyboard.row(...rowButtons);
  }

  // Pagination controls
  const paginationRow = [];
  if (currentPage > 1) {
    paginationRow.push(InlineKeyboard.text('⬅️ Prev', `${CALLBACK_PREFIX}main::${currentPage - 1}`));
  }
  paginationRow.push(InlineKeyboard.text(`${currentPage}/${totalPages}`, `${CALLBACK_PREFIX}noop`));
  if (currentPage < totalPages) {
    paginationRow.push(InlineKeyboard.text('Next ➡️', `${CALLBACK_PREFIX}main::${currentPage + 1}`));
  }
  if (paginationRow.length > 0) {
    keyboard.row(...paginationRow);
  }

  // Delete menu button
  keyboard.row(InlineKeyboard.text(await applyFont(name, '🗑️ Delete Menu'), `${CALLBACK_PREFIX}delete_menu`));

  return { text, keyboard };
}

/**
 * Generates detailed help for a specific module.
 * @param {import("grammy").Context} ctx - The context object.
 * @param {string} moduleName - The name of the module to get help for.
 * @returns {Promise<{text: string, keyboard: InlineKeyboard}>} The message text and inline keyboard.
 */
async function generateModuleHelp(ctx, moduleName) {
  const moduleInfo = HELP_MODULES[moduleName];
  if (!moduleInfo) {
    const text = await applyFont(name, `❌ Help not found for module: *${moduleName}*`);
    const keyboard = new InlineKeyboard().text(await applyFont(name, '🔙 Back to Main Menu'), `${CALLBACK_PREFIX}main`);
    return { text, keyboard };
  }

  let helpText = await applyFont(name, `📖 *${moduleName} Module Help* 📖\n\n`);
  helpText += await applyFont(name, `*Summary:* ${moduleInfo.summary}\n\n`);

  if (moduleInfo.commands && moduleInfo.commands.length > 0) {
    helpText += await applyFont(name, '*Commands:*\n');
    for (const cmd of moduleInfo.commands) { // Use for...of to allow await
      const parts = cmd.split(' - ');
      if (parts.length > 1) {
        const commandPart = parts[0];
        const descriptionPart = parts.slice(1).join(' - ');

        if (commandPart.startsWith('Private Chat:')) {
            // Entire line is a complex usage example, put it all in one code block
            helpText += `• \`\`\`${await applyFont(name, cmd)}\`\`\`\n`;
        } else {
            // Simple command: command outside, description inside triple backticks
            helpText += `• \`${commandPart}\` - \`\`\`${await applyFont(name, descriptionPart)}\`\`\`\n`;
        }
      } else {
        // If it's just a command with no description, put it in a single backtick code block
        helpText += `• \`${await applyFont(name, cmd)}\`\n`; 
      }
    }
    helpText += '\n';
  } else {
    helpText += await applyFont(name, 'No specific commands for this module.\n\n');
  }

  // Reformat details to ensure proper line breaks without explicit \n
  const detailsFormatted = moduleInfo.details.split('\n').map(line => line.trim()).filter(Boolean).join('\n');
  helpText += await applyFont(name, '*Details:*\n') + await applyFont(name, detailsFormatted);

  const keyboard = new InlineKeyboard().text(await applyFont(name, '🔙 Back to Main Menu'), `${CALLBACK_PREFIX}main`);
  return { text: helpText, keyboard };
}

/**
 * Handles incoming messages.
 * @param {import("grammy").Context} ctx - The context object.
 * @returns {boolean} True if the message was handled by this module, false otherwise.
 */
export async function onMessage(ctx) {
  const text = ctx.message?.text?.trim();
  if (!text) return false; // Return false if no text to handle

  const parts = text.split(' ');
  const command = parts[0].toLowerCase(); // Convert to lowercase for case-insensitivity

  // Handle .menu command (case-insensitive, PM only)
  if (command === '.menu') {
    if (ctx.chat.type !== 'private') {
      // Inform the user that the command is PM-only
      await ctx.reply(await applyFont(name, 'This command only works in private chat.'));
      return true; // Handled the command, even if not in PM
    }

    const { text: replyText, keyboard } = await generateMainMenu(ctx, 1); // Start at page 1
    const sentMessage = await ctx.reply(replyText, { parse_mode: 'Markdown', reply_markup: keyboard });
    await setMenuTimeout(ctx.from.id, ctx.chat.id, sentMessage.message_id);
    return true; // Indicate that this message was handled
  }

  // Keep specific module help commands (e.g., /activemembershelp) as they were
  if (command.endsWith('help') && command !== '/help') { // Still checking for /help if it was explicitly requested
    const moduleName = command.replace('/', '').replace('help', '');
    // Find the actual module name from HELP_MODULES (case-insensitive search)
    const foundModuleName = Object.keys(HELP_MODULES).find(
      key => key.toLowerCase() === moduleName.toLowerCase()
    );

    if (foundModuleName) {
      const { text: replyText, keyboard } = await generateModuleHelp(ctx, foundModuleName);
      const sentMessage = await ctx.reply(replyText, { parse_mode: 'Markdown', reply_markup: keyboard });
      await setMenuTimeout(ctx.from.id, ctx.chat.id, sentMessage.message_id);
      return true; // Indicate that this message was handled
    } else {
      await ctx.reply(await applyFont(name, `❌ Help not found for module: *${moduleName}*`));
      return true; // Indicate that this message was handled (even if help wasn't found)
    }
  }

  return false; // Message not handled by this module
}

/**
 * Handles incoming callback queries (button clicks).
 * @param {import("grammy").Context} ctx - The context object.
 */
export async function onCallbackQuery(ctx) {
  if (!botApi) botApi = ctx.api; // Ensure botApi is set

  const d = ctx.callbackQuery?.data;
  const userId = ctx.from.id;
  const chatId = ctx.chat.id;
  const messageId = ctx.callbackQuery.message.message_id;

  // If the callback data doesn't start with our prefix, it's not for this module.
  if (!d?.startsWith(CALLBACK_PREFIX)) {
    return;
  }
  
  // Reset the idle timer on any interaction with the menu
  await setMenuTimeout(userId, chatId, messageId);

  await ctx.answerCallbackQuery(); // Acknowledge the callback query without alert

  const parts = d.split('::');
  const action = parts[1];

  try {
    if (action === 'main') {
      const page = parseInt(parts[2] || '1', 10); // Get page from callback data
      const response = await generateMainMenu(ctx, page);
      await ctx.editMessageText(response.text, {
        parse_mode: 'Markdown',
        reply_markup: response.keyboard
      });
    } else if (action === 'show') {
      const moduleName = parts[2];
      const response = await generateModuleHelp(ctx, moduleName);
      await ctx.editMessageText(response.text, {
        parse_mode: 'Markdown',
        reply_markup: response.keyboard
      });
    } else if (action === 'delete_menu') {
      // Delete the message containing the menu
      try {
        await ctx.deleteMessage();
        userMenuState.delete(userId); // Clear in-memory state
        await deleteUserMenuState(userId); // Clear from DB
        info(`Help menu for user ${userId} in chat ${chatId} deleted by user request.`);
      } catch (e) {
        error(`Failed to delete help menu on user request for user ${userId}: ${e.message}`);
        await ctx.reply(await applyFont(name, '❌ Failed to delete the menu.'));
      }
    } else if (action === 'noop') {
      // Do nothing, just acknowledge the callback for pagination button
    }
  } catch (e) {
    // Specifically ignore 'message is not modified' error (error code 400)
    if (e.description?.includes('message is not modified')) {
      info(`Help module: Message not modified, ignoring error.`);
    } else {
      error(`Help module callback error: ${e.message}`, e);
      await ctx.reply(await applyFont(name, 'An error occurred while processing your request.'));
    }
  }
}

/**
 * Initializes the module. Loads persistent menu states and sets up timers.
 * @param {import("grammy").Bot} bot - The bot instance.
 */
export async function initialize(bot) {
  botApi = bot.api; // Store bot API instance for later use
  await initDatabase(); // Ensure the database table exists

  // Load existing menu states from DB on startup
  const savedStates = await db.all(`SELECT user_id, chat_id, message_id, last_activity_timestamp FROM help_menus`);
  const now = Date.now();

  for (const row of savedStates) {
    const { user_id, chat_id, message_id, last_activity_timestamp } = row;
    const elapsedTime = now - last_activity_timestamp;

    if (elapsedTime >= IDLE_TIMEOUT_MS) {
      // Menu has already expired, attempt to delete immediately
      try {
        await botApi.deleteMessage(chat_id, message_id);
        info(`Help menu for user ${user_id} in chat ${chat_id} deleted on startup (already idle).`);
      } catch (e) {
        if (!e.description?.includes('message to delete not found')) {
          error(`Failed to delete expired help menu for user ${user_id} on startup: ${e.message}`);
        }
      } finally {
        await deleteUserMenuState(user_id); // Remove from DB
      }
    } else {
      // Menu is still active, set a new timer
      const remainingTime = IDLE_TIMEOUT_MS - elapsedTime;
      const timerId = setTimeout(async () => {
        const state = userMenuState.get(user_id);
        if (state && state.messageId === message_id) { // Check if still the same message
          try {
            await botApi.deleteMessage(state.chatId, state.messageId);
            info(`Help menu for user ${user_id} in chat ${chat_id} deleted due to idle timeout after restart.`);
          } catch (e) {
            if (!e.description?.includes('message to delete not found')) {
              error(`Failed to delete idle help menu for user ${user_id} after restart: ${e.message}`);
            }
          } finally {
            userMenuState.delete(user_id);
            await deleteUserMenuState(user_id);
          }
        }
      }, remainingTime);
      userMenuState.set(user_id, { messageId: message_id, chatId: chat_id, timerId, lastActivityTimestamp: last_activity_timestamp });
    }
  }

  info(await applyFont(name, 'Help module initialized.'));
}

/**
 * Handles module shutdown. Clears active timers.
 */
export async function onShutdown() {
  info(await applyFont(name, 'Help module shutting down. Clearing timers.'));
  for (const [userId, state] of userMenuState.entries()) {
    if (state.timerId) {
      clearTimeout(state.timerId);
    }
  }
  userMenuState.clear();
  // No need to explicitly save to DB here, as it's saved on every activity.
}
