require('dotenv').config()
const colors = require('colors')
const express = require('express');
const mongo = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const history = require('connect-history-api-fallback');
const formidable = require('express-formidable');
const bodyParser = require('body-parser')

const app = express();

colors.setTheme({
    portLine: ['bgBlue','bold'],
    portTh: ['bgBlue','bold','yellow'],
    morganLog: ['bgMogenta','white']
})

//Importing routes {
const myRoutes = require('./src/routes/myRoutes');
require('./src/authentication/passport-local');
// }

//Conecting to the MongoDB database {
mongo.connect(process.env.DATABASELINKCONN, 
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Connection to database (BeaconDB from MongoDB Local), done!'.green))
    .catch(err => console.log(colors.red(err)));
// }

//Making settings {
app.set('port', process.env.PORT || 80);
//}

//Middlewares {
app.use(morgan('combined'));
app.use(formidable())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SERVER_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', myRoutes);

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/favicon.ico'));
});

app.use(history());
app.use("/", express.static(path.join(__dirname, 'src/public')));

//}

//The server goes on {
app.listen(app.get('port'), () => {
    console.log('Server on port '.portLine + colors.portTh(app.get('port')));
});

//}
