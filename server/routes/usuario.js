const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

const app = express();


app.get('/usuario', verificaToken, (req, res) => {

    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });*/
    //res.json('Get Usuario');

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // se salta los siguientes registros
        .limit(limite) //paginacion, se puede cambiar a mas registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Usuario.count({ estado: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                });
            });

        });
});

app.post('/usuario', [verificaToken, verificaAdminRol], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });


    /*
        if (body.nombre === undefined) {
            res.status(400).json({

                ok: false,
                mensaje: 'El nombre es necesario',
                err: ''
            });
        } else {
            res.json({
                persona: body
            });
        }*/
})

app.put('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;
    // let body = req.body;
    //Usuario.findById(id, (err, usuarioDB) = {
    //usuarioDB.save();
    //});

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {
    // res.json('Delete Usuario');
    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    // Usuario.findById(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        /* else {
                    usuarioBorrado.estado = false;
                    usuarioBorrado.save();
                };*/
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})

module.exports = app;