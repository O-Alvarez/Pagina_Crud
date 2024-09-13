function buscarPelicula() {
  const buscqueda = document.getElementById("busqueda").value;
  if (buscqueda == "") {
    buscarTodo();
  } else {
    buscarPorTitulo(buscqueda);
  }
}

function buscarPorTitulo(titulo) {
  const api = `https://movie.azurewebsites.net/api/cartelera?title=${titulo}&ubication=`;
  fetch(api)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      mostrarPeliculas(data); // Se pasa 'data' a la función
    })
    .catch((error) => {
      console.error("Hubo un error al generar la petición:", error);

      // Mostrar el modal con el mensaje de error
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = `Error: ${error.message}`;

      const errorModal = new bootstrap.Modal(
        document.getElementById("errorModal")
      );
      errorModal.show();
    });
}

function buscarTodo() {
  const api = "https://movie.azurewebsites.net/api/cartelera?title=&ubication=";
  fetch(api)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      data.shift();
      mostrarPeliculas(data); // Se pasa 'data' a la función
    })
    .catch((error) => {
      console.error("Hubo un error al generar la petición:", error);

      // Mostrar el modal con el mensaje de error
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = `Error: ${error.message}`;

      const errorModal = new bootstrap.Modal(
        document.getElementById("errorModal")
      );
      errorModal.show();
    });
}

function mostrarPeliculas(data) {
  let cartelera = document.getElementById("cartelera");
  cartelera.innerHTML = ""; // Limpiar contenido previo

  data.forEach((element) => {
    // Limitar la descripción a un máximo de 30 palabras
    const maxWords = 10;
    const words = element.description.split(" ");
    let shortDescription;

    if (words.length > maxWords) {
      // Si hay más de 30 palabras, cortar y agregar "..."
      shortDescription = words.slice(0, maxWords).join(" ") + "...";
    } else {
      // Si hay menos de 30 palabras, rellenar con espacios invisibles
      const missingWords = maxWords - words.length;
      const invisibleSpaces = "&nbsp;".repeat(missingWords * 3); // Añadir espacio proporcional
      shortDescription = words.join(" ") + invisibleSpaces;
    }

    const peliculaCard = `
      <div class="card card-pelicula m-2" style="width: 18rem;">
        <img src="${element.Poster
      }" class="card-img-top" alt="Poster de la película">
        <div class="card-body body-card-pelicula">
          <h5 class="card-title">${element.Title}</h5>
          <p class="card-text">${shortDescription}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Género: ${element.Type}</li>
          <li class="list-group-item">Estado: ${element.Estado == 1 ? "En cartelera" : "Fuera de cartelera"
      } </li>
          <li class="list-group-item">ID: ${element.imdbID}</li>
        </ul>
        <div class="card-body row">
          <button type="button" class="btn btn-danger col-5 m-2 eliminar-btn" data-imdbid="${element.imdbID
      }">Eliminar</button>
          <button type="button" class="btn btn-warning col-5 m-2 editar-btn" data-imdbid="${element.imdbID
      }" data-title="${element.Title}" data-description="${element.description
      }" data-type="${element.Type}" data-estado="${element.Estado}"
      data-poster="${element.Poster}"
    >Editar</button>
        </div>
      </div>`;

    // Agregar la tarjeta a la cartelera
    cartelera.innerHTML += peliculaCard;
  });

  document.querySelectorAll(".editar-btn").forEach((button) => {
    button.addEventListener("click", function () {
      // Obtener los datos de la película desde los atributos data del botón
      const imdbID = this.getAttribute("data-imdbid");
      const title = this.getAttribute("data-title");
      const description = this.getAttribute("data-description");
      const type = this.getAttribute("data-type");
      const estado = this.getAttribute("data-estado");
      const poster = this.getAttribute("data-poster");

      // actualiza los datos del edicion
      document.getElementById("editTitle").value = title;
      document.getElementById("editDescription").value = description;
      document.getElementById("editPoster").value = poster;
      // actualiza el poster edicion
      updateEditPoster();

      //mostrar el modal edicion con los datos
      document
        .getElementById("modal_editar")
        .setAttribute("data-imdbid", imdbID);
      let modal = new bootstrap.Modal(document.getElementById("modal_editar"));
      modal.show();
    });
  });

  // boton para eliminar
  document.querySelectorAll(".eliminar-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const imdbID = this.getAttribute("data-imdbid");
      const linkdelete = `https://movie.azurewebsites.net/api/cartelera?imdbID=${imdbID}`;
      fetch(linkdelete, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          buscarTodo();
          const errorModal = new bootstrap.Modal(
            document.getElementById("modal_eliminar")
          );
          errorModal.show();
        })
        .catch((error) => {
          console.error("Hubo un error al generar la petición:", error);

          // Mostrar el modal con el mensaje de error
          const errorMessage = document.getElementById("errorMessage");
          errorMessage.textContent = `Error: ${error.message}`;

          const errorModal = new bootstrap.Modal(
            document.getElementById("errorModal")
          );
          errorModal.show();
        });
    });
  });
}

function updateEditPoster() {
  const titulo = document.getElementById("editTitle").value;
  const poster = document.getElementById("editPoster").value;
  const descripcion = document.getElementById("editDescription").value;

  document.getElementById("editcard").innerHTML = `
    <div class="card" style="width: 18rem">
                  <img src="${poster}" class="card-img-top" id="editImg" alt="..." />
                  <div class="card-body">
                    <h5 class="card-title">${titulo}</h5>
                    <p class="card-text">
                      ${descripcion}
                    </p>
                  </div>
                </div>
    `;
}

function addNewMovie() {
  const title = document.getElementById("newTitle").value;
  const description = document.getElementById("newDescription").value;
  const poster = document.getElementById("newPoster").value;

  if (poster == "") {
    poster = "imgs/cargar.png";
  }

  ID = Math.random().toString(36).substr(2, 9);

  const newMovie = {
    imdbID: ID,
    Title: title,
    Year: "2021",
    Type: "Action",
    Poster: poster,
    description: description,
    Estado: 1,
    Ubication: "Cinepolis"
  };

  fetch("https://movie.azurewebsites.net/api/cartelera", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMovie),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      buscarTodo();
      document.getElementById("cancelarAdicion").click();
      setTimeout(() => {
        const errorModal = new bootstrap.Modal(
          document.getElementById("modal_agregarexitoso")
        );
        errorModal.show();
      }, 300);

    })
    .catch((error) => {
      console.error("Hubo un error al generar la petición:", error);

      // Mostrar el modal con el mensaje de error
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = `Error: ${error.message}`;

      const errorModal = new bootstrap.Modal(
        document.getElementById("errorModal")
      );
      errorModal.show();
    });


}


function updateCardNewMovie() {
  const title = document.getElementById("newTitle").value;
  const description = document.getElementById("newDescription").value;
  const poster = document.getElementById("newPoster").value;

  if (poster == "") {
    poster = "imgs/cargar.png";
  }


  let card = document.getElementById("cardNewMovie");
  card.innerHTML = `
    <div class="card" style="width: 18rem">
    <img src="${poster}" class="card-img-top" alt="..." />
    <div class="card-body">
           <h5 class="card-title">${title}</h5>
            <p class="card-text">
                ${description}
         </p>
    </div>
    </div>
    `;
}

function actualizarPelicula() {
  const titulo = document.getElementById("editTitle").value
  const descripcion = document.getElementById("editDescription")
  const linkposter = document.getElementById("editPoster")
  const id = document.getElementById("modal_editar").getAttribute("data-imdbid")
  const linkupdate = `https://movie.azurewebsites.net/api/cartelera?imdbID=${id}`;
  if (linkposter == "") {
    linkposter = "imgs/cargar.png";
  }

  const updateMovie = {
    imdbID: id,
    Title: titulo,
    Year: "2021",
    Type: "Action",
    Poster: linkposter,
    description: descripcion,
    Estado: 1,
    Ubication: "Cinepolis"
  }; 

  fetch (linkupdate,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateMovie),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    buscarTodo();
    setTimeout(() => {
      const errorModal = new bootstrap.Modal(
        document.getElementById("modal_agregarexitoso")
      );
      errorModal.show();
    }, 300);

  })
  .catch((error) => {
    console.error("Hubo un error al generar la petición:", error);

    // Mostrar el modal con el mensaje de error
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = `Error: ${error.message}`;

    const errorModal = new bootstrap.Modal(
      document.getElementById("errorModal")
    );
    errorModal.show();
  });
}


function resetearagregar() {
  document.getElementById("newTitle").value = " ";
  document.getElementById("newDescription").value = " ";
  document.getElementById("newPoster").value = " ";

  let card = document.getElementById("cardNewMovie");
  card.innerHTML = `
    <div class="card" style="width: 18rem">
        <img src="imgs/cargar.png" class="card-img-top" alt="..." />
         <div class="card-body">
             <h5 class="card-title">Titulo de la pelicula</h5>
             <p class="card-text">
                jemplo de descripcion de la pelicula
             </p>
         </div>
     </div>
    `;
}