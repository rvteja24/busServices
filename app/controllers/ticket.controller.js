const MongoClient = require('mongodb').MongoClient;
const config = require('../../config/config');
const client = new MongoClient(config.uri, config.options);
const emailValidator = require('email-validator');
const phoneNumberValidator = require('validate-phone-number-node-js');
const log = require('log-to-file');

//get the status of the ticket (OPEN/CLOSED) based on the ticket number
exports.getStatus = (req, res) => {
    try {
        var apiKey = req.headers["api-key"];
        client.connect(function (err, db) {
            if (err) {
                throw err;
            }
            let dbo = db.db(config.databaseName);
            dbo.collection(config.securityCollection).findOne({ api_key: apiKey }, function (err, result) {
                if (result != null) {
                    if (req.query.seatNumber != null && req.query.seatNumber.length > 0 && Number.isInteger(JSON.parse(req.query.seatNumber))) {
                        client.connect(function (err, db) {
                            if (err) throw err;
                            //console.log("connected!");
                            var dbo = db.db(config.databaseName);
                            var seatNumberValue = JSON.parse(req.query.seatNumber);
                            dbo.collection(config.collectionName).findOne({ seatNumber: seatNumberValue }, function (err, result) {
                                if (err) throw err;
                                if (result != null) {
                                    res.send({ "ticketStatus": result.ticketStatus });
                                }
                                else {
                                    res.status(404);
                                    res.send({ "errorMessage": "No ticket found with the given parameters", "statusCode": 404 });
                                }
                                db.close
                            });
                        });
                    }
                    else {
                        res.status(400);
                        res.send({ "errorMessage": "Please check the request format", "statusCode": 400 });
                    }
                }
                else {
                    res.status(401);
                    res.send({ "errorMessage": "Unauthorized request", "statusCode": 401 });
                }
            })
        })
    }
    catch{
        console.log("error while getting ticket status");
        log(req + "\n" + "error while getting ticket status");
        res.status(500);
        res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
    }
}

//get all the closed tickets
exports.getAllClosedTickets = (req, res) => {
    try {
        var apiKey = req.headers["api-key"];
        client.connect(function (err, db) {
            if (err) {
                throw err;
            }
            let dbo = db.db(config.databaseName);
            dbo.collection(config.securityCollection).findOne({ api_key: apiKey }, function (err, result) {
                if (result != null) {
                    client.connect(function (err, db) {
                        if (err) throw err;
                        //console.log("connected!");
                        var dbo = db.db(config.databaseName);
                        dbo.collection(config.collectionName).find({ ticketStatus: "CLOSED" }).toArray().then(result => {
                            if (err) throw err;
                            if (result.length > 0) {
                                //console.log(result)
                                delete result._id;
                                res.send(result);
                            }
                            else {
                                res.send({ "message": "No closed tickets found" });
                            }
                            db.close
                        });
                    });
                }
                else {
                    res.status(401);
                    res.send({ "errorMessage": "Unauthorized request", "statusCode": 401 });
                }
            })
        })
    }
    catch{
        console.log("error while getting all closed tickets");
        log(req + "\n" + "error while getting all closed tickets");
        res.status(500);
        res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
    }
}

//get all the open tickets
exports.getAllOpenTickets = (req, res) => {
    try {
        var apiKey = req.headers["api-key"];
        client.connect(function (err, db) {
            if (err) {
                throw err;
            }
            let dbo = db.db(config.databaseName);
            dbo.collection(config.securityCollection).findOne({ api_key: apiKey }, function (err, result) {
                if (result != null) {
                    client.connect(function (err, db) {
                        if (err) throw err;
                        //console.log("connected!");
                        var dbo = db.db(config.databaseName);
                        dbo.collection(config.collectionName).find({ ticketStatus: "OPEN" }).toArray().then(result => {
                            if (err) throw err;
                            if (result.length > 0) {
                                //console.log(result)
                                delete result._id;
                                res.send(result);
                            }
                            else {
                                res.send({ "message": "No open tickets found" });
                            }
                            db.close
                        });
                    });
                }
                else {
                    res.status(401);
                    res.send({ "errorMessage": "Unauthorized request", "statusCode": 401 });
                }
            })
        })
    }
    catch{
        console.log("error while getting all open tickets");
        log(req + "\n" + "error while getting all open tickets");
        res.status(500);
        res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
    }
}

//get the ticket info based on the seat number
exports.getTicketinfo = (req, res) => {
    try {
        var apiKey = req.headers["api-key"];
        client.connect(function (err, db) {
            if (err) {
                throw err;
            }
            let dbo = db.db(config.databaseName);
            dbo.collection(config.securityCollection).findOne({ api_key: apiKey }, function (err, result) {
                if (result != null) {
                    if (req.query.seatNumber != null && req.query.seatNumber.length > 0 && Number.isInteger(JSON.parse(req.query.seatNumber))) {
                        client.connect(function (err, db) {
                            if (err) throw err;
                            //console.log("connected!");
                            var dbo = db.db(config.databaseName);
                            var seatNumberValue = JSON.parse(req.query.seatNumber);
                            dbo.collection(config.collectionName).findOne({ seatNumber: seatNumberValue }, function (err, result) {
                                if (err) throw err;
                                if (result != null) {
                                    delete result._id;
                                    res.send(result);
                                }
                                else {
                                    res.status(404);
                                    res.send({ "errorMessage": "No ticket found with the given parameters", "statusCode": 404 });
                                }
                                db.close
                            });
                        });
                    }
                    else {
                        res.status(400);
                        res.send({ "errorMessage": "Please check the request format", "statusCode": 400 });
                    }
                }
                else {
                    res.status(401);
                    res.send({ "errorMessage": "Unauthorized request", "statusCode": 401 });
                }
            })
        })
    }
    catch{
        console.log("error while getting ticket info");
        log(req + "\n" + "error while getting ticket info");
        res.status(500);
        res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
    }
}

//open up all the tickets and clear the existing values
exports.openAllTickets = (req, res) => {
    try {
        var body = req.body;
        var uname = body.username;
        var pwd = body.password;
        var apiKey = req.headers["api-key"];
        client.connect(function (err, db) {
            if (err) {
                throw err;
            }
            let dbo = db.db(config.databaseName);
            dbo.collection(config.securityCollection).findOne({ userName: uname }, function (err, result) {
                if (result != null && result.password == pwd && result.api_key == apiKey) {
                    dbo.collection(config.collectionName).countDocuments().then(num => {
                        for (var i = 0; i < num; i++) {
                            var replacementTicket = {
                                seatNumber: i + 1,
                                passengerAge: 0,
                                passengerGender: "",
                                passengerName: "",
                                emailId: "",
                                phoneNumber: "",
                                ticketStatus: "OPEN"

                            }
                            dbo.collection(config.collectionName).findOneAndReplace({ seatNumber: i + 1 }, replacementTicket, function (err, result) {
                                if (err) {
                                    res.status(500);
                                    res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
                                    throw err;
                                }
                                db.close
                            });
                        }
                        res.send({ "message": "Successfully opened all the tickets" });
                    })

                }
                else {
                    res.status(401);
                    res.send({ "errorMessage": "You are not authorized to perform this operation", "statusCode": 401 });
                }

            });
        });
    }
    catch{
        console.log("error while opening all tickets");
        log(req + "\n" + "error while opening all tickets");
        res.status(500);
        res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
    }
}

//Update ticket details
exports.updateTicketInfo = (req, res) => {
    try {
        var apiKey = req.headers["api-key"];
        client.connect(function (err, db) {
            if (err) {
                throw err;
            }
            let dbo = db.db(config.databaseName);
            dbo.collection(config.securityCollection).findOne({ api_key: apiKey }, function (err, result) {
                if (result != null) {
                    if (req.body != null && req.body.seatNumber != null) {
                        if (req.body.ticketStatus != null && (req.body.ticketStatus.toUpperCase() != "CLOSED" || req.body.ticketStatus.toUpperCase() != "OPEN")) {
                            res.status(400);
                            res.send({ "errorMessage": "Please check the ticket status format, if the attribute is present it should be CLOSED/OPEN", "statusCode": 400 });
                        }
                        else if (req.body.seatNumber <= 0 || req.body.seatNumber > 40) {
                            res.status(400);
                            res.send({ "errorMessage": "Please check the seat number", "statusCode": 400 });
                        }
                        else if (req.body.emailId != null && !emailValidator.validate(req.body.emailId)) {
                            res.status(400);
                            res.send({ "errorMessage": "Please check the emailId format", "statusCode": 400 });
                        }
                        else if (req.body.phoneNumber != null && !phoneNumberValidator.validate(req.body.phoneNumber)) {
                            res.status(400);
                            res.send({ "errorMessage": "Please check the phone number format", "statusCode": 400 });
                        }
                        else {
                            client.connect(function (err, db) {
                                if (err) throw err;
                                //console.log("connected!");
                                var dbo = db.db(config.databaseName);
                                var seatNumberValue = req.body.seatNumber;
                                var replacementTicket = req.body;
                                if (replacementTicket.ticketStatus != null) {
                                    replacementTicket.ticketStatus = replacementTicket.ticketStatus.toUpperCase();
                                }
                                dbo.collection(config.collectionName).findOneAndUpdate({ seatNumber: seatNumberValue }, { $set: replacementTicket }, { new: true }, function (err, result) {
                                    if (err) {
                                        res.status(500);
                                        res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
                                        throw err

                                    }
                                    else if (result == null) {
                                        res.status(404);
                                        res.send({ "errorMessage": "No ticket found with the given parameters", "statusCode": 404 });
                                    }
                                    else {
                                        res.send({ "message": "Ticket updated successfully" });
                                    }

                                    db.close
                                });
                            });
                        }
                    }
                    else {
                        res.status(400);
                        res.send({ "errorMessage": "Please check the request body and try again. seatNumber field is mandatory for updating ticket information", "statusCode": 400 });
                    }
                }
                else {
                    res.status(401);
                    res.send({ "errorMessage": "Unauthorized request", "statusCode": 401 });
                }
            });
        })
    }

    catch{
        console.log("error while updating ticket info");
        log(req + "\n" + "error while updating ticket info");
        res.status(500);
        res.send({ "errorMessage": "Internal server error", "statusCode": 500 });
    }

}

