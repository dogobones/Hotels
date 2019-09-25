const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const socketio = require('socket.io');
const app = express();

require('dotenv').config();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({

    defaultLayout: 'admin',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'

}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use('/', require(path.join(__dirname, 'routes', 'web')));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const server = app.listen(app.get('port'), () => {

  console.log(`Server on port ${app.get('port')}...`);

});

// Websockets
/*const io = socketio(server);

require(path.join(__dirname, '.', 'socket'))(io);*/
