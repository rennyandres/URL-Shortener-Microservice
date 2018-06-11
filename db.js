// db.js

// IMPORTS --------------------------------------------------------------------
var mongoose = require('mongoose');


// CONFIG ---------------------------------------------------------------------
mongoose.connect(process.env.DATABASE_URL);

mongoose.connection.once('open', function() {
  console.log('Connected to remote db');
}).on('error', function(err){
  throw err;
});

// SCHEMAS --------------------------------------------------------------------
var urlSchema = new mongoose.Schema({
    "original_url" : String,
    "short_url": String
});


// COLLECTIONS ----------------------------------------------------------------
var Url = mongoose.model('Url', urlSchema);


// EXPORTS --------------------------------------------------------------------
module.exports = {
    store : function(myDomain, originalUrl, callback) {
        var serialNum,
            urlToStore;
        
        Url.find({}, function(err, items) {
            //handle errors
            if(err) throw err;
            
            //get the serial
            serialNum = items.length;
            
            // store the url
            urlToStore = new Url({
                "original_url" : originalUrl,
                "short_url": myDomain + serialNum
            }).save(function(err, doc) {
                callback(err, doc);
            });
        });
    },
    
    retrive : function(myDomain, serialNum, callback) {
        Url.findOne({
            "short_url": myDomain + serialNum
        }, function(err, doc) {
            callback(err, doc);
        });
    }  
}