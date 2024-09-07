function changeview() {
  const tittle = document.getElementById("tittle").value;
  let poster = document.getElementById("poster").value;
  const description = document.getElementById("description").value;
  let type = document.getElementById("type").value;
  const year = document.getElementById("year").value;
  let status = document.getElementById("status").value;
  switch (type) {
    case "1":
      type = "Thriller";
      break;
    case "2":
      type = "Familiar";
      break;
    case "3":
      type = "Infantil";
      break;
    case "4":
      type = "Terror";
      break;
    case "5":
      type = "Comedia";
      break;
    case "6":
      type = "Accion";
      break;
  }

  switch (status) {
    case "1":
      status = "En cartelera";
      break;
    case "2":
      status = "Fuera de cartelera";
      break;
  }
  if (poster == "") {
    poster =
      "https://answers-afd.microsoft.com/static/images/image-not-found.jpg";
  }
  document.getElementById("cartelera").innerHTML = `<img class="card-img-top"
                  src="${poster}"
                  alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title subtitulo text-center">${tittle}</h5>
                  <p class="card-text text-">${description}</p>
                </div>
                <ul class="list-group list-group-flush">
                            <li class="list-group-item">Tipo: ${type}</li>
                            <li class="list-group-item">Año: ${year}</li>
                            <li class="list-group-item">Status: ${status}</li>
                          </ul>`;
}

function post() {
    // Obtener los valores de los campos del formulario
    const tittle = document.getElementById("tittle").value;
    let poster = document.getElementById("poster").value;
    const description = document.getElementById("description").value;
    let type = document.getElementById("type").value;
    const year = document.getElementById("year").value;
    let status = document.getElementById("status").value;
  
    // Evaluar si los campos están vacíos
    if (
      tittle == "" ||
      poster == "" ||
      description == "" ||
      type == "" ||
      year == "" ||
      status == ""
    ) {
      // Generar una alerta si los campos están vacíos usando un modal de Bootstrap
      document.getElementById("alert").innerHTML =` 
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error!</strong> Todos los campos son obligatorios.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;
      return; // Salir de la función si hay campos vacíos
    } else {
      switch (type) {
        case "1":
          type = "Thriller";
          break;
        case "2":
          type = "Familiar";
          break;
        case "3":
          type = "Infantil";
          break;
        case "4":
          type = "Terror";
          break;
        case "5":
          type = "Comedia";
          break;
        case "6":
          type = "Accion";
          break;
      }
  
      switch (status) {
        case "1":
          status = true;
          break;
        case "2":
          status = false;
          break;
      }
      //genera el id con un numero random
      let id = Math.floor(Math.random() * 1000);
      //genera el objeto con los datos del formulario
      let data = {
        imdbID: id,
        Title: tittle,
        Year: year,
        Type: type,
        Poster: poster,
        description: description,
        Ubication: "Guatemala",
        Estado: status,
      };
      //hace el post a la api
      fetch("https://movie.azurewebsites.net/api/cartelera", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud");
          }
          return response.json();
        })
        .then((data) => {
            document.getElementById("alert").innerHTML =` 
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Éxito!</strong> La película ha sido registrada.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        })
        .catch((error) => {
          document.getElementById("alert").innerHTML =`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> ${error}.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        });    
    }
  }
  
