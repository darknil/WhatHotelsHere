//BotModel.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const User = require('./user');
const BotView = require('../views/BotView');
const GoogleMaps = require('./GoogleMaps');
class BotModel{
    constructor(bot){
      this.bot = bot;
      this.botView = new BotView(bot);
      this.GoogleMaps = new GoogleMaps();
      this.users = {}
    }
    async createUser(id,first_name,last_name,username){
      const user = new User(id,first_name,last_name,username);
      if(!this.users[user.id]){ 
        this.users[user.id] = user;
        console.log(`пользователь ${user.id} добавлен в базу`);
      }

    }
    async updateUserLastActivity(chatId){
      const user = this.users[chatId];
      if(user){
        user.updateLastActivityDate();
      }
    }

    async processMessage(option,chatId,messageText) {
      const user = this.users[chatId];
      if(!user){
        return this.botView.sendExeption(chatId);
      }
      let photoReference;
      let photoURL;
      let photos;
      const contentPerPage = 4;
      switch (option) {
        case 'start':
          user.searchHistory = {};
          user.searchResult = [];
          user.currentObjects = 0;
          const  welcomeMessageArray = [
            'Welcome to our hotel search bot!\n',
            '🌍 Please specify the city where you want to find a hotel: ','[city]\n', 
            '⭐️ Specify the hotel rating(1-5): ', '[rating]\n',
            '🔎 After filling in all the fields, click the "Search" button to find suitable hotels.\n'
            ];
            user.changeUserState('awaitingCity');
            console.log(user);
          return welcomeMessageArray;
        case 'message':
            if(user){
              if(user.userState == 'awaitingCity'){

                user.changeKeyValue('city',messageText);
                user.changeUserState('awaitingRating');
                this.botView.askRating(user.id);
                console.log(user);
    
              }else if(user.userState == 'awaitingRating'){
                messageText = parseFloat(messageText);
                if (isNaN(messageText)) {
                  // Другие действия, если переменная не является числом
                  this.botView.askNumber(user.id);
                } else if (messageText >= 1 && messageText <= 5) {
                  // Действия при правильном числовом значении
                  user.changeKeyValue('rating', messageText);
                  user.changeUserState('awaitingConfirmation');
                  this.botView.askConfirmation(user.id,user);
                  console.log(user);
                } else {
                  // Другие действия, если число не находится в указанном диапазоне
                  this.botView.askNumber(user.id);
                }
              }else if(user.userState == 'viewing'){

              }else{
                this.botView.sendExeption(chatId,user.userState);
              }

            }

            break;
          case 'search':
            // Логика при нажатии кнопки Yes
            if(user.userState == 'awaitingConfirmation'){
              const city = user.searchHistory.city;
              const rating = user.searchHistory.rating;
              const coordinates = await this.GoogleMaps.getGeocode(city);
              user.searchResult = await this.GoogleMaps.searchHotels(coordinates,rating);  
              const hotelsArr =[user.searchResult[user.currentObjects],user.searchResult[user.currentObjects+1],user.searchResult[user.currentObjects+2],user.searchResult[user.currentObjects+3],];
              this.botView.displayHotels(chatId,hotelsArr,true,false);
              user.changeUserState('viewing');   
              console.log(user);
            }else{
              this.botView.sendExeption(chatId,user.userState);
            }
                         

            break
          case 'next':
            if(user.userState == 'viewing'){
              if(user.currentObjects + 4 > user.searchResult.length){

              }else{

              }
            }else{
              this.botView.sendExeption(chatId,user.userState);
            }
            break;
          case 'prev':
            if(user.userState == 'viewing'){

            }else{
              this.botView.sendExeption(chatId,user.userState);
            }
            break;
          case 'newSearch':

            break;
          case 'first':
            // проверить состояние пользователя
            if(user.userState == 'viewing'){
              console.log(user.searchResult[user.currentObjects]);
               photos = user.searchResult[user.currentObjects].photos;
              if(photos){
                photoReference = user.searchResult[user.currentObjects].photos[0].photo_reference; 
                photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.placesapi}`;
                await this.botView.sendPhoto(chatId,photoURL);
              }else{
                this.botView.noPhoto(chatId);
              }

            }else{
              return false;
            }
            // Отправлять фотографию при выборе отеля

            break;
          case 'second':
            if(user.userState == 'viewing'){
              
              photos = user.searchResult[user.currentObjects+1].photos;
              if(photos){
                photoReference = user.searchResult[user.currentObjects+1].photos[0].photo_reference;
                photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.placesapi}`;
                await this.botView.sendPhoto(chatId,photoURL);
              }else{
                this.botView.noPhoto(chatId);
              }

            }else{
              return false;
            }
            // Отправлять фотографию при выборе отеля

            break;
          case 'third':
            if(user.userState == 'viewing'){
              photos = user.searchResult[user.currentObjects+2].photos;
              if(photos){
                photoReference = user.searchResult[user.currentObjects+2].photos[0].photo_reference;
                photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.placesapi}`;
                await this.botView.sendPhoto(chatId,photoURL);
              }else{
                this.botView.noPhoto(chatId);
              }

            }else{
              return false;
            }
            // Отправлять фотографию при выборе отеля

            break;
          case 'fourth':
            if(user.userState == 'viewing'){
              
              photos = user.searchResult[user.currentObjects+3].photos;
              if(photos){
                photoReference = user.searchResult[user.currentObjects+3].photos[0].photo_reference;
                photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.placesapi}`;
                await this.botView.sendPhoto(chatId,photoURL);
              }else{
                this.botView.noPhoto(chatId);
              }

            }else{
              return false;
            }
            // Отправлять фотографию при выборе отеля

            break;
        default:
          break;
      }
      }
}

module.exports = BotModel;
//