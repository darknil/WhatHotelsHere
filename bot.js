// bot.js
require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const BotController = require('./controllers/BotController')
const botToken = process.env.TELEGRAM_API

// Создание экземпляра бота и указание токена
const bot = new TelegramBot(botToken, { polling: true })

// Создаем экземпляры модели
const botController = new BotController(bot)

const commands = [
  { command: 'start', description: 'Start the bot' }
]
bot.setMyCommands(commands)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const messageText = msg.text
  // Передача сообщения контроллеру для обработки

  botController.handleMessage(chatId, messageText, msg)
})
console.log('Bot is running...')
