const MongoClient = require('mongodb').MongoClient;
const config = require('../../config/config');
const client = new MongoClient(config.uri, config.options);

//get the status of the ticket (OPEN/CLOSED) based on the ticket number
exports.getStatus = (req,res) => {
    console.log(req.query.seatNumber);
    client.connect(function(err,db) {
        if(err) throw err;
        console.log("connected!");
        var dbo = db.db(config.databaseName);
        //need to add filter based on mobile number
        var seatNumberValue = JSON.parse(req.query.seatNumber);
        dbo.collection(config.collectionName).findOne({seatNumber: seatNumberValue}, function(err, result){
            if (err) throw err;
            if(result != null){
                res.send(result.ticketStatus);
            }
            else{
                res.send("No ticket found with the given parameters");
            }
            db.close
        });
    });    
}

//get all the closed tickets
exports.getAllClosedTickets = (req,res) => {
    client.connect(function(err,db) {
        if(err) throw err;
        console.log("connected!");
        var dbo = db.db(config.databaseName);
        dbo.collection(config.collectionName).find({ticketStatus: "CLOSED"}).toArray().then( result => {
            if (err) throw err;
            if(result.length > 0){
                console.log(result)
                res.send(result);
            }
            else{
                res.send("No closed tickets found");
            }
            db.close
        });
    });    
}

//get all the open tickets
exports.getAllOpenTickets = (req,res) => {
    client.connect(function(err,db) {
        if(err) throw err;
        console.log("connected!");
        var dbo = db.db(config.databaseName);
        dbo.collection(config.collectionName).find({ticketStatus: "OPEN"}).toArray().then( result => {
            if (err) throw err;
            if(result.length > 0){
                console.log(result)
                res.send(result);
            }
            else{
                res.send("No open tickets found");
            }
            db.close
        });
    });    
}

//get the ticket info based on the seat number
exports.getTicketinfo = (req,res) => {
    console.log(req.query.seatNumber);
    client.connect(function(err,db) {
        if(err) throw err;
        console.log("connected!");
        var dbo = db.db(config.databaseName);
        //need to add filter based on mobile number
        var seatNumberValue = JSON.parse(req.query.seatNumber);
        dbo.collection(config.collectionName).findOne({seatNumber: seatNumberValue}, function(err, result){
            if (err) throw err;
            if(result != null){
                res.send(result);
            }
            else{
                res.send("No ticket found with the given parameters");
            }
            db.close
        });
    });    
}

//open up all the tickets and clear the existing values
exports.openAllTickets = (req,res) => {
    console.log(req.query.seatNumber);
    client.connect(function(err,db) {
        if(err) throw err;
        console.log("connected!");
        var dbo = db.db(config.databaseName); 
        dbo.collection(config.collectionName).countDocuments().then(num => {
            for(var i = 0; i<num; i++){
                var replacementTicket = {
                    seatNumber: i+1,
                    passengerAge: 0,
                    passengerGender: "",
                    passengerName: "",
                    emailId: "",
                    phoneNumber: "",
                    ticketStatus: "OPEN"

                }
                dbo.collection(config.collectionName).findOneAndReplace({seatNumber: i+1},replacementTicket, function(err, result){
                    if (err) throw err;
                    db.close
                });
            }
            res.send("Successfully opened all the tickets");
        })       

        
    });    
}