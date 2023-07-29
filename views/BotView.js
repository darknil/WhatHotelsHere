//BotView.js
const TelegramBot = require('node-telegram-bot-api');

class BotView {
  constructor(bot) {
    this.bot = bot
  }


  // Остальные методы представления
  async sendWelcomeMessage(chatId, message) {
    if(message){
      await this.bot.sendMessage(chatId, message.join(''));
      await this.bot.sendMessage(chatId, 'city?');
    }else{
      this.bot.sendMessage(chatId,'No such option');
    }

  }
  async askRating(chatId){
    await this.bot.sendMessage(chatId,'rating?')
  }
  async askNumber(chatId){
    await this.bot.sendMessage(chatId,'Please write the rating as a number from 1 to 5');
  }
  async askConfirmation(userId,user) {
    const city = user.valueOfKey('city');
    const rating = user.valueOfKey('rating');
    await this.bot.sendMessage(userId,`city: ${city}, rating: ${rating}`);
    const options = {
      reply_markup: {
        keyboard: [
          [{ text: "Yes" }, { text: "No" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    };

    this.bot.sendMessage(userId, "correct?", options);
  }
  async displayHotels(chatId,curentContent,isLeft,isRight){
    let keyboard = {
      reply_markup: {
        keyboard: [[],[]],
        resize_keyboard: true,
      },
    };
   
    if(isLeft){

    }else{
      keyboard.reply_markup.keyboard[1].push({ text: '<<' });
    }
    if(isRight){

    }else{
      keyboard.reply_markup.keyboard[1].push({ text: '>>' });
    }
    for (let i = 0; i < curentContent.length; i++) {
      keyboard.reply_markup.keyboard[0].push({ text: `${i+1}` });
      if(i == curentContent.length-1){
        await this.bot.sendMessage(chatId,`the name: ${curentContent[i].name}\nRating: ${curentContent[i].rating}`,keyboard);
      }else{
        await this.bot.sendMessage(chatId,`the name: ${curentContent[i].name}\nRating: ${curentContent[i].rating} `);
      }
      
      
    }
  }


  sendExeption(chatId,userstate){
    console.log(`user state: ${userstate}`)
    this.bot.sendMessage(chatId,'No such option');
  }

  async sendPhoto(chatId,photoURL){
    
    await this.bot.sendPhoto(chatId, photoURL);
  }

  async noPhoto(chatId){
    await this.bot.sendMessage(chatId,'no photo');
  }
  
}
  
module.exports = BotView;
//