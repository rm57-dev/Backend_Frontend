const db = require('../config/db');

class ImagenesController {

    async subirImagen(tabla, campoId, id, imagenBase64) {
        try {
            const [registro] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, campoId, id]);

            if (registro.length === 0) {
                return { error: "No se encontro el registro con el ID proporcionado." };
            }

            const bufferImagen = Buffer.from(imagenBase64, 'base64');

            const query = `UPDATE ?? SET imagen = ? WHERE ?? = ?`;
            const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

            if (result.affectedRows > 0) {
                return { message: 'Imagen actualizada correctamente' };
            } else {
                return { error: 'Error al actualizar la imagen.' };
            }
        } catch (error) {
            console.log('Error al subir la imagen: ', error);
            throw error;
        }
    }

    async obtenerImagen(tabla, campoId, id) {
        try {
            const [rows] = await db.query('SELECT imagen FROM ?? WHERE ?? = ?', [tabla, campoId, id]);

            if (rows.length === 0) {
                return { error: 'Registro no encontrado' };
            }

            if (!rows[0].imagen) {
                return { error: 'No hay imagen asociada a este registro' }
            }

            const imagenBase64 = rows[0].imagen.toString('base64');

            return { imagen: imagenBase64 };
        } catch (error) {
            console.error('Error al obtener la imagen', error);
            throw error;
        }
    }


    async eliminarImagen(tabla, campoId, id) {
        try {
            const [registro] = await db.query('SELECT * FROM ?? WHERE ?? = ?', [ tabla, campoId, id ])

            if (registro.length === 0) {
                return { error: 'No se encontro el registro con el ID proporcionado.' };
            }

            const query = 'UPDATE ?? SET imagen = NULL WHERE ?? = ?';
            const [result] = await db.query(query, [tabla, campoId, id]);

            if (result.affectedRows > 0) {
                return { message: 'Imagen eliminada correctamente.' };
            } else {
                return { error: 'Error al eliminar la imagen.' };
            }
        } catch (error) {
            console.error('Error al eliminar la iamgen: ', error);
            throw error;
        }
    }


    async insertarImagen(tabla, campoId, id, imagenBase64) {
        try {
            const [registro] = await db.query('SELECT * FROM ?? WHERE ?? = ?', [tabla, campoId, id]);

            if (registro.length === 0) {
                return { error: 'No se encontro el registro con el ID proporcionado. ' }
            }

            const bufferImagen = Buffer.from(imagenBase64, 'base64');

            const [imagenExistente] = await db.query('SELECT imagen FROM ?? WHERE ?? = ?', [tabla, campoId, id])

            if (imagenExistente[0]?.imagen) {
                const query = 'UPDATE ?? SET imagen = ? WHERE ?? = ?';
                const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

                if (result.affectedRows > 0) {
                    return { message: 'Imagen actualizada correctamente. ' };
                } else {
                    return { error: 'Error al actualizar la imagen. ' };
                }
            } else {
                const query = 'UPDATE ?? SET imagen = ? WHERE ?? = ?';
                const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

                if (result.affectedRows > 0) {
                    return { message: 'Imagen insertada correctamente. ' }
                } else {
                    return { error: 'Error al insertar la imagen. ' }
                }
            }
        } catch (error) {
            console.error('Error al insertar la imagen: ', error);
            throw error;
        }
    }

    async procesarImagen(tabla, campoId, id, imagenBase64 = null) {

        if (imagenBase64) {
            return await this.subirImagen(tabla, campoId, id, imagenBase64);
        } else {
            return await this.obtenerImagen(tabla, campoId, id);
        }
    }
}

module.exports = new ImagenesController();