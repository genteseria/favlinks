const express = require('express');
const morgan = require('morgan');
const ehbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');

//Inicializaciones
const app = express();
require('./lib/passport');

//Configuraciones
app.set('port', process.env.FAVLINKS_PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', ehbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'faztmysqlnodesessino',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((req, res, next) => {
    app.locals.exito = req.flash('exito');
    app.locals.mensaje = req.flash('mensaje');
    app.locals.user = req.user;
    next();
});

//Rutas
app.use(require('./routes/'));
app.use(require('./routes/auth'));
app.use('/links', require('./routes/links'));


//Public
app.use(express.static(path.join(__dirname, 'public')));

//Inicio del servidor
app.listen(app.get('port'), () => {
    console.log("Servidor corriendo en el puerto ", app.get('port'));
});