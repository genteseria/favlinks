const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},  async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE username = ? OR email = ?', [username, username]);
    if(rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.verificarPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('exito', 'Te damos la bienvenida nuevamente.'));
        } else {
            done(null, false, req.flash('mensaje', "Contraseña incorrecta."));
        }
    } else {
        return done(null, false, req.flash('mensaje', "El usuario o email ingresado no se encuentra registrado."))
    }
}
));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { email, nombrecompleto } = req.body;
    const nuevoUsuario = {
        username,
        password,
        email,
        nombrecompleto
    };
    const usuariosExistentes = await pool.query('SELECT * FROM usuarios WHERE username = ? OR email = ?', [username, email]);
    if (usuariosExistentes.length === 0){
        nuevoUsuario.password = await helpers.hashearPassword(password);
        try{
            const resultado = await pool.query('INSERT INTO usuarios SET ?',[nuevoUsuario]);
            nuevoUsuario.id = resultado.insertId;
            return done(null, nuevoUsuario);
        } catch (e) {
            req.flash('mensaje', "Hmmm. No pudimos completar tu registro. Inténtalo nuevamente.");
            console.log("ERROR DE BASE DE DATOS: " + e);
        }
    } else {
        req.flash('mensaje', "Ya existe una cuenta con ese usuario o e-mail");
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, rows[0]);
});