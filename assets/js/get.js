// Prevenir recarga de la página en el envío del formulario
function buscarPelicula(event) {
    event.preventDefault(); // Evitar que se recargue la página al hacer la búsqueda
}

// URL de la API base
const apiURL = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

// Función para hacer la solicitud GET y manejar la respuesta al cargar la página
function obtenerCartelera() {
    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            mostrarCartelera(data); // Mostrar los datos obtenidos
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Ejecutar la solicitud cuando la página se cargue por primera vez
document.addEventListener('DOMContentLoaded', obtenerCartelera);

// Función para buscar una película según el título ingresado
function buscar() {
    const busqueda = document.getElementById('Titulo').value;
    const link = `https://movie.azurewebsites.net/api/cartelera?title=${busqueda}&ubication=`;
    fetch(link).then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    }).then(data => {
       mostrarCartelera(data);
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Función para mostrar la cartelera en el DOM
function mostrarCartelera(data) {
    const cartelera = document.getElementById('cartelera');
    cartelera.innerHTML = ''; // Limpiar el contenido previo
    data.forEach(item => {
        cartelera.innerHTML += `
        <div class="card col-sm-4 m-2" style="width: 18rem">
            <img class="card-img-top mt-2" src="${item.Poster}" alt="Card image cap"/>
            <div class="card-body">
                <h5 class="card-title subtitulo text-center">${item.Title}</h5>
                <p class="card-text text-">${item.description}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Tipo: ${item.Type}</li>
                <li class="list-group-item">Año: ${item.Year}</li>
                <li class="list-group-item">Status: ${item.Estado == 1 ? 'En cartelera' : 'Fuera de cartelera'}</li>
            </ul>
        </div>`;
    });
}
