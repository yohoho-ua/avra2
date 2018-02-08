var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var WalletSchema = mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        trim: true 
    },
    public: { 
        type : String, 
        required: true, 
        unique: true,
        trim: true
    },
    private: {
         type : String, 
         required: true, 
         unique: true,
         trim: true
        },
    balance: {
        type: Number,
        trim: true
    }

}, {
    //timestamps: true,
    //versionKey: false
});


var Wallet = mongoose.model('Wallet', WalletSchema);
module.exports = Wallet;

