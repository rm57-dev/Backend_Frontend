const API_URL = 'http://localhost:3000/api';
let personas = [];

const personaForm = document.getElementById('personaForm');
const tablaPersonasBody = document.getElementById('tablaPersonasBody');

const btnCancelar = document.getElementById('btnCancelar');
const iamgenInput = document.getElementById('imagen');
const previewImagen = document.getElementById('previewImagen');

document.addEventListener('DOMContentLoaded', cargarPersonas);
personaForm.addEventListener('submit', manejarSubmit);
btnCancelar.addEventListener('click', limpiarFormulario);
iamgenInput.addEventListener('change', manejarImagen);

async function cargarPersonas() {
    try {
        const response = await fetch(`${API_URL}/personas`);
        personas = await response.json();
        await mostrarPersonas();
    } catch (error) {
        console.error('Error al cargar personas: ', error);
    }
}

async function mostrarPersonas() {
    tablaPersonasBody.innerHTML = '';
    const template = document.getElementById('template');

    for (const persona of personas) {
        const clone = template.content.cloneNode(true);
        const tds = clone.querySelectorAll('td');
        let imagenHTML = 'Sin imagen';

        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${persona.id_persona}`);

            const data = await response.json();

            if (data.imagen) {
                imagenHTML = `<img src="data:image/jpeg;base64,${data.imagen}" style="max-width: 100px; max-height: 100px;">`;
            }
        } catch (error) {
            console.error('Error al cargar imagen: ', error);
        }

        tds[0].textContent = persona.id_persona;
        tds[1].textContent = persona.nombre;
        tds[2].textContent = persona.apellido;
        tds[3].textContent = persona.email;
        tds[4].innerHTML = imagenHTML;

        const btnEditar = clone.querySelector('btn-editar');
    }
}
