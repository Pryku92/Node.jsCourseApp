const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://ApkaNode:72qif2EXvPbwWn1q@cluster0-3zw3b.mongodb.net/test?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected!');
            callback(client);
        })
        .catch(err => console.log(err));
};

module.exports = mongoConnect;