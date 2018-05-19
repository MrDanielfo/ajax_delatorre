// pasos para la creación de un request

var btnCargar = document.getElementById('cargar');

function cargarContenido() {

  var xhr = new XMLHttpRequest();


   xhr.open("GET", "servidor.php", true);


   xhr.onreadystatechange = function() {

      if(xhr.readyState == 4 && xhr.status == 200) {
          //console.log("Se cargo correctamente");
          var json = JSON.parse(xhr.responseText);
          console.log(json);
          var contenido = document.getElementById('contenido');
          contenido.innerHTML = json.backend;
      }
   };

   xhr.send();
}

btnCargar.addEventListener('click', cargarContenido);
