const API_URL = 'http://localhost:3000/api';
let personas = [];
let modoEdicion = false;

const form = document.querySelector('#personaForm');
const tablaBody = document.querySelector('#tablaPersonasBody');
const template = document.querySelector('#template');
const btnGuardar = document.querySelector('#btnGuardar');
const btnCancelar = document.querySelector('#btnCancelar');
const inputImagen = document.querySelector('#imagen');
const previewImagen = document.querySelector('#previewImagen');

const campos = {
    id: document.querySelector('#id_persona'),
    nombre: document.querySelector('#nombre'),
    apellido: document.querySelector('#apellido'),
    tipo_identificacion: document.querySelector('#tipo_identificacion'),
    nuip: document.querySelector('#nuip'),
    email: document.querySelector('#email'),
    clave: document.querySelector('#clave'),
    salario: document.querySelector('#salario'),
    activo: document.querySelector('#activo')
};

document.addEventListener('DOMContentLoaded', () => {
    cargarPersonas();
    form.addEventListener('submit', manejarSubmit);
    btnCancelar.addEventListener('click', resetearFormulario);
    inputImagen.addEventListener('change', manejarCambioImagen);
});

async function cargarPersonas() {
    try {
        const response = await fetch(`${API_URL}/personas`);
        personas = await response.json();
        mostrarPersonas();
    } catch (error) {
        console.error('Error al cargar personas:', error);
    }
}

async function mostrarPersonas() {
    tablaBody.innerHTML = '';
    personas.forEach(async persona => {
        const clone = template.content.cloneNode(true);
        const celdas = clone.querySelectorAll('td');
        celdas[0].textContent = persona.id_persona;
        celdas[1].textContent = persona.nombre;
        celdas[2].textContent = persona.apellido;
        celdas[3].textContent = persona.email;

        let imagenHTML = 'Sin imagen';
        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${persona.id_persona}`);
            const data = await response.json();
            if (data.imagen) {
                imagenHTML = `<img src="data:image/jpeg;base64,${data.imagen}" style="max-width: 100px; max-height: 100px;" />`;
            }
        } catch (error) {
            console.error('Error al cargar imagen:', error);
        }

        celdas[4].innerHTML = imagenHTML;

        const btnEditar = clone.querySelector('.btn-editar');
        const btnEliminar = clone.querySelector('.btn-eliminar');
        btnEditar.addEventListener('click', () => editarPersona(persona));
        btnEliminar.addEventListener('click', () => eliminarPersona(persona.id_persona));
        tablaBody.appendChild(clone);
    });
}

async function manejarSubmit(e) {
    e.preventDefault();

    const persona = {
        nombre: campos.nombre.value,
        apellido: campos.apellido.value,
        tipo_identificacion: campos.tipo_identificacion.value,
        nuip: campos.nuip.value,
        email: campos.email.value,
        clave: campos.clave.value,
        salario: parseFloat(campos.salario.value),
        activo: campos.activo.checked
    };

    try {
        if (modoEdicion) {
            persona.id_persona = campos.id.value;

            if (inputImagen.files[0]) {
                const imagenBase64 = await convertirImagenABase64(inputImagen.files[0]);
                await fetch(`${API_URL}/imagenes/subir/personas/id_persona/${persona.id_persona}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagen: imagenBase64 })
                });
            }

            await actualizarPersona(persona);
            cargarPersonas(); //añadido propio
            resetearFormulario(); //añadido propio
        } else {
            const response = await crearPersona(persona);

            if (response.id_persona) {
                throw new Error('El servidor no devolvio el ID de la persona creada');
            }
            if (inputImagen.files[0]) {
                const imagenBase64 = await convertirImagenABase64(inputImagen.files[0]);
                await fetch(`${API_URL}/imagenes/insertar/personas/id_persona/${response.id_persona}`, { //si algo lo cambias por id_persona
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagen: imagenBase64 })
                });
                cargarPersonas(); //añadido propio
            }
        }
    } catch (error) {
        console.error('Error al guardar persona:', error);
        alert('Error al guardar los datos: ' + error.message);
    }
}

async function crearPersona(persona) {
    const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });
    if (!response.ok) {
        throw new Error(`Error HTTTP: ${response.status}`);
    }

    const data = await response.json();
    if (!data.id_persona) {
        throw new Error('La respuesta del servidor no contiene el ID de la persona');
    }

    return data;
}

async function actualizarPersona(persona) {
    const response = await fetch(`${API_URL}/personas/${persona.id_persona}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });
    const data = await response.json();
    return data;
}

async function eliminarPersona(id) {
    if (confirm('¿Está seguro de que desea eliminar esta persona?')) {
        try {
            await fetch(`${API_URL}/imagenes/eliminar/personas/id_persona/${id}`, { method: 'DELETE' });
            await fetch(`${API_URL}/personas/${id}`, { method: 'DELETE' });
            cargarPersonas();
        } catch (error) {
            console.error('Error al eliminar persona:', error);
            alert('Error al eliminar la persona: ' + error.message);
        }
    }
}

async function editarPersona(persona) {
    modoEdicion = true;
    campos.id.value = persona.id_persona;
    campos.nombre.value = persona.nombre;
    campos.apellido.value = persona.apellido;
    campos.tipo_identificacion.value = persona.tipo_identificacion;
    campos.nuip.value = persona.nuip;
    campos.email.value = persona.email;
    campos.clave.value = persona.clave;
    campos.salario.value = persona.salario;
    campos.activo.checked = persona.activo;

    try {
        const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${persona.id_persona}`);
        const data = await response.json();

        if (data.imagen) {
            previewImagen.src = `data:image/jpeg;base64,${data.imagen}`;
            previewImagen.style.display = 'block';
        } else {
            previewImagen.style.display = 'none';
            previewImagen.src = '';
        }
    } catch (error) {
        console.error('Error al cargar imagen:', error);
        previewImagen.style.display = 'none';
        previewImagen.src = '';
    }
    btnGuardar.textContent = 'Actualizar';
}

function resetearFormulario() {
    modoEdicion = false;
    form.reset();
    previewImagen.style.display = 'none';
    previewImagen.src = '';
    btnGuardar.textContent = 'Guardar';
}

async function manejarCambioImagen(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImagen.src = e.target.result;
            previewImagen.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        previewImagen.style.display = 'none';
        previewImagen.src = '';
    }
}


async function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };

        reader.onerror = error => reject(error);
    });
}