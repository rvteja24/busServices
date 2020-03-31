//Run this using the command "node mongoTicketsCollectionSetup.js" from command line while setting up the application on a new server with new mongoDb instance for the first time to populate the db with dummy data"
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
const client = new MongoClient(config.uri, config.options);

client.connect(err =>{
    if(err) throw err;
    console.log("connected!");
    //client.db("bus-tickets").collection('tickets').deleteMany();
    for(var i = 0; i < 40; i++){
        var doc = {seatNumber: i+1, passengerAge: "22", passengerGender: "F", passengerName: "Jane Doe", ticketStatus:"CLOSED", phoneNumber:"9988776655", emailId:"abc@test.com"};

        client.db(config.databaseName).collection(config.collectionName).insertOne( doc, function(err, result){
            if (err) throw err;
            console.log(result);
        });

    };

    var adminDoc = {userName: "admin1", password: "serviceAdmin1!", api_key: "L7g6TRuVjeQAlPJhLyEI" };

    // client.db(config.databaseName).collection(config.securityCollection).insertOne( adminDoc, function(err, result){
    //     if (err) throw err;
    //     console.log(result);
    // });
    //client.close();
});