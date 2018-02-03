class SourceProvider {

    constructor(text){
       this._text = text;
    }

    /**
     * Implementation optional
     */
    genericMethod() {
        console.log('running from super class. Text: '+this._text);
    }

    /**
     * Implementation required
     */
     isOnline() {
        throw new Error('You have to implement the method isOnline!');
     }

    sendMessage(message, username, channel) {
       throw new Error('You have to implement the method sendMessage!');
    }

    sendEmail(message, email, mailto) {
      throw new Error('You have to implement the method sendEmail!');
    }

}
