let config = {};    
    if(process.env.NODE_ENV == "test"){
        config =    {
        uri : 'mongodb://127.0.0.1:27017',
        options: { useNewUrlParser: true, useUnifiedTopology: true, },
        databaseName:'bus-tickets',
        collectionName:'tickets-test',
        securityCollection: 'security'
        }
    }
    else{
        config =    {
            uri : 'mongodb://127.0.0.1:27017',
            options: { useNewUrlParser: true, useUnifiedTopology: true, },
            databaseName:'bus-tickets',
            collectionName:'tickets',
            securityCollection: 'security'
            }
    }
module.exports = config;

