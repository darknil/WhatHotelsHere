class User{
    constructor(id,first_name,last_name,language = "default"){
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.language = language;
        this.registrationDate = new Date();
        this.lastActivityDate = null;
        this.userState = 'default';
        this.searchHistory = {};
        this.searchResult = [];
        this.currentObjects = 0;
        this.searchCount = 0;
    }
    
    setName(name) {
        this.name = name;
    }

    setLanguage(language) {
        this.language = language
    }

    updateLastActivityDate() {
        this.lastActivityDate = new Date();
    }
    
    hasKey(key) {
        return key in this.searchHistory;
    }
    
    valueOfKey(keyName) {
        return this.searchHistory[keyName];
    }
    
    changeKeyValue(key, value) {
        this.searchHistory[key] = value;
    }
    changeUserState(state){
        this.userState = state;
    }
}
module.exports = User;