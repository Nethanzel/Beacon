const mongo = require('mongoose');
const user = require('../src/models/usersModel');


//Conecting to the MongoDB database {
    mongo.connect('', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Connection to database, done!'))
    .catch(err => console.log(err));
// }

const nUser =  new  user({
    username: "",
    password: "",
    permissions: 100,

});


nUser.save( function (err) {
    if (err) {
        console.log(err);

    } else {
        console.log('New user has been inserted!')
    }

});

setTimeout(() => {
    mongo.disconnect( (err) => {
        if (!err) {
            console.log('Connection to database was closed.')
        } else {
            console.log('There was a problem while closing the database connection.')
        }
    });
    
}, 3000);



