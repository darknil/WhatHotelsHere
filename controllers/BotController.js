//BotController.js
const TelegramBot = require('node-telegram-bot-api');
const BotModel = require('../models/BotModel');
const BotView = require('../views/BotView');

class BotController{
    constructor(bot){
        this.bot = bot;
        this.botModel = new BotModel(bot);
        this.botView = new BotView(bot);
    }
    async handleMessage(chatId,messageText,msg){
       
        let replyMessage;
        const userId = chatId;
        const firstName = msg.from.first_name || '';
        const lastName = msg.from.last_name || '';
        const username = msg.from.username || '';
        switch (messageText) {
            case '/start':
                await this.botModel.createUser(userId, firstName, lastName, username);
                replyMessage = await this.botModel.processMessage('start',userId);
                await this.botView.sendWelcomeMessage(chatId, replyMessage);
                this.botModel.updateUserLastActivity(userId);
                break;
            case 'Yes':
                this.botModel.updateUserLastActivity(userId);
                // запрос к модели на поиск в гугле
                replyMessage = this.botModel.processMessage('search',userId,messageText);
                
                break;
            case 'No':
                this.botModel.updateUserLastActivity(userId);
                replyMessage = this.botModel.processMessage('start',userId);
                this.botView.sendWelcomeMessage(chatId, replyMessage);
                
                break;
            case '1':
                this.botModel.updateUserLastActivity(userId);
                    // Отправить пользователю фотографию первого отеля и больше информации
                replyMessage = await this.botModel.processMessage('first',userId);
                if(!replyMessage){
                    this.botModel.processMessage('message',userId,messageText);
                }
                break;
            case '2':
                this.botModel.updateUserLastActivity(userId);
                    // Отправить пользователю фотографию второго отеля и больше информации
                replyMessage = await this.botModel.processMessage('second',userId);
                if(!replyMessage){
                    this.botModel.processMessage('message',userId,messageText);
                }
                break;
            case '3':
                this.botModel.updateUserLastActivity(userId);
                    // Отправить пользователю фотографию третьего отеля и больше информации
                replyMessage = await this.botModel.processMessage('third',userId);
                if(!replyMessage){
                    this.botModel.processMessage('message',userId,messageText);
                }
                break;
            case '4':
                this.botModel.updateUserLastActivity(userId);
                // Отправить пользователю фотографию четвертого отеля и больше информации
                replyMessage = await this.botModel.processMessage('fourth',userId);
                if(!replyMessage){
                    this.botModel.processMessage('message',userId,messageText);
                }
                break;
            case '<<':
                this.botModel.updateUserLastActivity(userId);
                replyMessage = this.botModel.processMessage('prev',userId);
                break;
            case '🔍':
                this.botModel.updateUserLastActivity(userId);
                replyMessage =await this.botModel.processMessage('start',userId);
                this.botView.sendWelcomeMessage(chatId, replyMessage);
                
                break;
            case '>>':
                this.botModel.updateUserLastActivity(userId);
                replyMessage = this.botModel.processMessage('next',userId);
                break;
            default:
                this.botModel.updateUserLastActivity(userId);
                this.botModel.processMessage('message',userId,messageText);
                
                break;
        }

    }

}
module.exports = BotController;
//