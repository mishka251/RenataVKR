const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

function getPatientByName(name) {
    return mongoClient.connect()
        .then((client) => {
            const db = client.db('db_test');
            const collection = db.collection('patients');
            const patient = collection.find({ name: name });
            return patient;
        })
        .then((patient)=>{
            return patient.toArray();
        });
}

module.exports = getPatientByName;
// mongoClient.connect(function (err, client) {
//
//     const db = client.db('usersdb');
//     const collection = db.collection('users');
//     let user = { name: 'Tom', age: 23 };
//     collection.insertOne(user, function (err, result) {
//
//         if (err) {
//             return console.log(err);
//         }
//         console.log(result.ops);
//         client.close();
//     });
// });