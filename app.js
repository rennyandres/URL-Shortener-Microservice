// app.js

// IMPORTS --------------------------------------------------------------------
var express = require('express');
var app = express();
var db = require('./db');
var validUrl = require('valid-url');

// CONFIG ---------------------------------------------------------------------
app.set('view engine', 'ejs');
app.use(express.static(process.cwd() + '/public'));


// ROUTES ---------------------------------------------------------------------
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/:serialNum', function(req, res) {
    var myDomain = getMyDomain(req);
    
    db.retrive(myDomain, req.params.serialNum, function(err, doc) {
        if(err)      throw err;
        else if(doc) res.redirect(doc.original_url);
        else         res.send({
                "error" : 'We couldn\'t find your url'
        });
    })
});

app.get('/new/*', function(req, res) {
    var myDomain = getMyDomain(req);
    
    console.log(validUrl.isUri(req.params[0]));
    
    db.store(myDomain, req.params[0], function(err, doc) {
        res.send((err) ? err : doc);
    });
});

// HELPER FUNCTIONS -----------------------------------------------------------
function getMyDomain(req) {
    return 'https://' + req.get('host') + '/';
}


// LISTENING ------------------------------------------------------------------
app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Serving on port ' + process.env.PORT);
});

