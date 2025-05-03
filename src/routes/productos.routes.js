const express = require('express');

const router = express.Router();

const CrudController = require('../controllers/crud.controller');

const crud = new CrudController();

const tabla = 'productos';

const idCampo = 'id_productos';

router.get('/', async (req, res) => {
    try {
        const producto = await crud.obtenerTodos(tabla);
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
})

router.get('/:id', async (req, res) => {
    try {
        const producto = await crud.obtenerUno(tabla, idCampo, req.params,id);

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const nuevoProducto = await crud.crear(tabla, req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.put('/:id', async (req, res) => {

    try {
        const productoActualizado = await crud.actualizar(tabla, idCampo, req.params.id, req.body);

        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await crud.eliminar(tabla, idCampo, req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
})

module.exports = router;