const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/authorize');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { titulo, url, descripcion } = req.body;
    const nuevoLink= {
        titulo,
        url,
        descripcion,
        usuario_id: req.user.id
    };
    try {
        await pool.query('INSERT INTO links SET ?', [nuevoLink]);
        req.flash('exito', 'Se añadió el link.');
    } catch (e) {
        req.flash('mensaje', "Algo salió mal y no pudimos guardar tu link :(")
        console.log("ERROR DE BASE DE DATOS: " + e);
    }
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const links = await pool.query('SELECT * FROM links WHERE usuario_id = ?', [req.user.id]);
        res.render('links/list', {links});
    } catch (e) {
        req.flash('mensaje', "Algo salió mal y no pudimos obtener tus links :(")
        console.log("ERROR DE BASE DE DATOS: " + e);
        res.redirect('/');
    }
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    linkOwner = await pool.query('SELECT usuario_id FROM links WHERE ID = ?', [id]);
    if (linkOwner[0]){
        if (linkOwner[0].usuario_id === req.user.id){
            try{
                await pool.query('DELETE FROM links WHERE ID = ?', [id]);
                req.flash('exito', 'Se eliminó el link.');
            } catch (e) {
                req.flash('mensaje', "Algo salió mal y no pudimos eliminar este link :(")
                console.log("ERROR DE BASE DE DATOS: " + e);
            }
        } else {
            req.flash('mensaje', 'Ese link no te pertenece');
        }
    } else {
        req.flash('mensaje', 'No existe el link que deseas eliminar');
    }
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    linkOwner = await pool.query('SELECT usuario_id FROM links WHERE ID = ?', [id]);
    if (linkOwner[0]){
        if (linkOwner[0].usuario_id === req.user.id){
            try {
                const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
                return res.render('links/edit', {links: links[0]});
            } catch (e) {
                req.flash('mensaje', "Algo salió mal y no pudimos obtener este link :(")
                console.log("ERROR DE BASE DE DATOS: " + e);
            }
        } else {
            req.flash('mensaje', 'Ese link no te pertenece');
        }
    } else {
        req.flash('mensaje', 'No existe el link que deseas editar');
    }
    res.redirect('/links');
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, url } = req.body;
    linkOwner = await pool.query('SELECT usuario_id FROM links WHERE ID = ?', [id]);
    if (linkOwner[0]){
        if (linkOwner[0].usuario_id === req.user.id){
            const updatedLink = {
                titulo,
                descripcion,
                url
            }
            try {
                await pool.query('UPDATE links SET ? WHERE id = ?', [updatedLink, id]);
                req.flash('exito', 'Se editó el link.');
            } catch (e) {
                req.flash('mensaje', "Algo salió mal y no pudimos editar tu link :(")
                console.log("ERROR DE BASE DE DATOS: " + e);
            }
        } else {
            req.flash('mensaje', 'Ese link no te pertenece');
        }
    } else {
        req.flash('mensaje', 'No existe el link que deseas editar.');
    }
    res.redirect('/links');
});

module.exports = router;