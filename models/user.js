const mongodb = require('mongodb');
const getDb = require('../utility/database').getDb;

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this)
            .then(() => console.log('USER CREATED'))
            .catch(err => console.log(err));
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({_id: new mongodb.ObjectId(userId)}); // alternative for find()/next()
    }
}

module.exports = User;