require('dotenv').config();

const {Client}  = require("@googlemaps/google-maps-services-js");

class GoogleMapsApi{
  constructor(){
    this.client = new Client();
  }
  async getGeocode(address) {
    try {
      
  
      const params = {
        address: address,
        key: process.env.placesapi
      };
  
      const response = await this.client.geocode({ params });
      const results = response.data.results;
  
      if (results.length > 0) {
        const location = results[0].geometry.location;
        const coordinates = {
          lat: location.lat,
          lng: location.lng
        };
        return coordinates; 
      } else {
        throw new Error('Координаты не найдены.');
      }
    } catch (error) {
      console.error('Ошибка при получении координат:', error.message);
      throw error;
    }
  }
  async searchHotels(coordinates, rating) {
    try {
      const params = {
        location: `${coordinates.lat},${coordinates.lng}`,
        radius: 1500,
        type: 'lodging',
        fields: 'name,geometry,rating', // Включаем поле для рейтинга отелей
        key: process.env.placesapi
      };
  
      const response = await this.client.placesNearby({ params });
      const results = response.data.results;
  
      // Если есть переменная rating, фильтруем результаты по рейтингу
      if (rating) {
        return results.filter(hotel => hotel.rating >= rating);
      }
  
      return results;
    } catch (error) {
      console.error(error);
    }
  }
}


module.exports = GoogleMapsApi;