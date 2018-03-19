var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var EmailSchema = new Schema({
    sender: {
        type: String,
        unique: false,
    
    },
    receiver: {
        type: String,
        unique: false,
        
    },
    subjects: {
        type: String,
        unique: false,
      
    },
    email: {
        type: String,
        unique: false,
       
    },
    status:String,
    createdDate : { type: Date, default: Date.now },
    
    
});

EmailSchema.pre('save', function (next) {
    var email = this;
    
                next();
            });

;

module.exports = mongoose.model('Email', EmailSchema);