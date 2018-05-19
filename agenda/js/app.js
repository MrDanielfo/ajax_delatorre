var agregarContacto = document.getElementById('agregar')
var formulario = document.getElementById('formulario_crear_usuario')
var action = formulario.getAttribute('action')
var xhr = new XMLHttpRequest()
var divCrear = document.getElementById('crear_contacto')
var tablaRegistrados = document.getElementById('registrados')
var checkboxes = document.getElementsByClassName('borrar_contacto')
var btn_borrar = document.getElementById('btn_borrar')
var tableBody = document.getElementsByTagName('tbody')
var divExistentes = document.getElementsByClassName('existentes')
// código para buscador
var inputBuscador = document.getElementById('buscador')
var totalRegistros = document.getElementById('total')
// checkbox para seleccionar todos
var checkTodos = document.getElementById('borrar_todos')


function registroExitoso (nombre) {
  var divMensaje = document.createElement('DIV')
  divMensaje.setAttribute('id', 'mensaje')

  // agregar texto

  var texto = document.createTextNode('Creado: ' + nombre)
  divMensaje.appendChild(texto)

  divCrear.insertBefore(divMensaje, divCrear.childNodes[4])

  // agregar la clase mostrar

  divMensaje.classList.add('mostrar')

  // ocultar
  setTimeout(function(){
      divMensaje.classList.add('ocultar')
      setTimeout(function(){
        var divPadreMensaje = divMensaje.parentNode;
        divPadreMensaje.removeChild(divMensaje);
      }, 500)
  }, 3000)

}

// construyendo template

function construirTemplate (nombre, telefono, registroId) {
  var tdNombre = document.createElement('TD')
  var textoNombre = document.createTextNode(nombre)
  var parrafoNombre = document.createElement('P')
  parrafoNombre.appendChild(textoNombre)
  tdNombre.appendChild(parrafoNombre)

  var inputNombre = document.createElement('INPUT')
  inputNombre.type = 'text'
  inputNombre.name = 'contacto_' + registroId
  inputNombre.value = nombre
  inputNombre.classList.add('nombre_contacto')

  tdNombre.appendChild(inputNombre)

  // crear teléfono de crear_contacto

  var tdTelefono = document.createElement('TD')
  var textoTelefono = document.createTextNode(telefono)
  var parrafoTelefono = document.createElement('P')
  parrafoTelefono.appendChild(textoTelefono)
  tdTelefono.appendChild(parrafoTelefono)

  var inputTelefono = document.createElement('INPUT')
  inputTelefono.type = 'text'
  inputTelefono.name = 'telefono_' + registroId
  inputTelefono.value = telefono
  inputTelefono.classList.add('telefono_contacto')

  tdTelefono.appendChild(inputTelefono)

  var nodoBtn = document.createElement('A')
  var textoEnlace = document.createTextNode('Editar')
  nodoBtn.appendChild(textoEnlace)
  nodoBtn.href = '#'
  nodoBtn.classList.add('editarBtn')

  var btnGuardar = document.createElement('A')
  var guardarEnlace = document.createTextNode('Guardar')
  btnGuardar.appendChild(guardarEnlace)
  btnGuardar.href = '#'
  btnGuardar.classList.add('guardarBtn')

  var nodoTdEditar = document.createElement('TD')
  nodoTdEditar.appendChild(nodoBtn)
  nodoTdEditar.appendChild(btnGuardar)

  var checkBorrar = document.createElement('INPUT')
  checkBorrar.type = 'checkbox'
  checkBorrar.name = registroId
  checkBorrar.classList.add('borrar_contacto')

  var tdCheckbox = document.createElement('TD')
  tdCheckbox.classList.add('borrar')
  tdCheckbox.appendChild(checkBorrar)

  // agregar input con nombre

  var trContacto = document.createElement('TR')
  trContacto.appendChild(tdNombre)
  trContacto.appendChild(tdTelefono)
  trContacto.appendChild(nodoTdEditar)
  trContacto.appendChild(tdCheckbox)
  trContacto.setAttribute('id', registroId)

  tablaRegistrados.childNodes[3].append(trContacto)
  actualizarNumero()
  recorrerBotonesEditar()
  recorrerBotonesGuardar(registroId)
}

function crearUsuario () {

  var form_datos = new FormData(formulario)
  for ([key, value] of form_datos.entries()) {
    console.log(key + " : " + value)
  }

  xhr.open('POST', action, true)

  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resultado = xhr.responseText

      var json = JSON.parse(resultado)
      if (json.respuesta === true) {
        registroExitoso(json.nombre)
        construirTemplate(json.nombre, json.numero, json.id)
        var totalActualizado = parseInt(totalRegistros.textContent) + 1
        totalRegistros.innerHTML = totalActualizado
      }
    }
  }
  xhr.send(form_datos)
}


function eliminarHTML (idsBorrados) {
  console.log(idsBorrados)
  for (i = 0; i < idsBorrados.length; i++) {
    var elementoBorrar = document.getElementById(idsBorrados[i])
    tableBody[0].removeChild(elementoBorrar)
  }
}

function mostrarEliminado() {
  var divEliminado = document.createElement('DIV')
  divEliminado.setAttribute('id', 'borrado')

  var texto = document.createTextNode('Eliminado de lista de contactos')
  divEliminado.appendChild(texto)

  divExistentes[0].insertBefore(divEliminado, divExistentes[0].childNodes[0])

  divEliminado.classList.add('mostrar')

  setTimeout(function(){
    divEliminado.classList.add('ocultar')
    setTimeout(function () {
      var divPadreMensaje = divEliminado.parentNode;
      divPadreMensaje.removeChild(divEliminado);
    }, 500)
  }, 3000)

}

function contactosEliminar (contactos) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'borrar.php?id=' + contactos, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resultadoBorrar = xhr.responseText
      var json = JSON.parse(resultadoBorrar)
      if (json.respuesta === false) {
        alert('selecciona un elemento')
      } else {
        console.log('Resultado: ' + resultadoBorrar)
        eliminarHTML(contactos)
        mostrarEliminado()
        var totalBorrado = parseInt(totalRegistros.textContent) - json.borrados
        totalRegistros.innerHTML = totalBorrado
      }
    }
  }
  xhr.send()
}

function checkboxSeleccionado () {
  var contactos = []

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true ){
      contactos.push(checkboxes[i].name)
    }
  }
  contactosEliminar(contactos)
}

for (var i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('change', function () {
    if (this.checked) {
      this.parentNode.parentNode.classList.add('activo')
    } else {
      this.parentNode.parentNode.classList.remove('activo')
    }
  })
}

agregarContacto.addEventListener('click', function (e) {
  e.preventDefault()
  crearUsuario()
})

btn_borrar.addEventListener('click', function () {
  checkboxSeleccionado()
 })

 // código para buscador

 function actualizarNumero () {
   var registros = tableBody[0].getElementsByTagName('tr')

   var cantidad = 0
   var ocultos = 0

   for (var i = 0; i < registros.length; i++) {
    var elementos = registros[i]
    if(elementos.style.display == 'table-row') {
      cantidad++
      totalRegistros.innerHTML = cantidad
    } else {
      if(elementos.style.display === 'none') {
        ocultos++
        if(ocultos === registros.length) {
          ocultos -= registros.length
          totalRegistros.innerHTML = ocultos
        }
      }
    }
  }
 }

function ocultarRegistros (nombreBuscar) {
  var registros = tableBody[0].getElementsByTagName('tr')

  var expression = new RegExp(nombreBuscar, 'i')
  for (var i = 0; i < registros.length; i++) {
    registros[i].classList.add('ocultar')
    registros[i].style.display = 'none'

    if (registros[i].childNodes[1].textContent.replace(/\s/g, '').search(expression) !== -1 || nombre === '' ) {
      registros[i].classList.add('mostrar')
      registros[i].classList.remove('ocultar')
      registros[i].style.display = 'table-row'
    }
  }

  actualizarNumero()

}

inputBuscador.addEventListener('input', function () {
  ocultarRegistros(this.value)
})

// checkbox seleccionar checkTodos
checkTodos.addEventListener('click', function () {
  if (this.checked) {
    var todosRegistros = tableBody[0].getElementsByTagName('tr')
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true
      todosRegistros[i].classList.add('activo')
    }
  } else {
    var todosRegistros = tableBody[0].getElementsByTagName('tr')
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false
      todosRegistros[i].classList.remove('activo')
    }
  }
})

/* editar registros */

function deshabilitarEdicion () {
  var registrosTr = document.querySelectorAll('#registrados tbody tr')
  for (var i = 0; i < registrosTr.length; i++) {
    registrosTr[i].classList.add('desactivado')
  }
}

function habilitarEdicion () {
  var registrosTr = document.querySelectorAll('#registrados tbody tr')
  for (var i = 0; i < registrosTr.length; i++) {
    registrosTr[i].classList.remove('desactivado')
  }
}

/* recorrer botones de guardar */
function recorrerBotonesGuardar (id) {
  var btn_guardar = tableBody[0].querySelectorAll('.guardarBtn')
  for (var i = 0; i < btn_guardar.length; i++) {
    btn_guardar[i].addEventListener('click', function (event) {
      actualizarRegistro(id)
    })
  }
}


function recorrerBotonesEditar () {
  var btnEditar = tableBody[0].querySelectorAll('.editarBtn')
  for (var i = 0; i < btnEditar.length; i++) {
    btnEditar[i].addEventListener('click', function (event) {
      event.preventDefault()
      deshabilitarEdicion()
      var registroActivo = this.parentNode.parentNode
      registroActivo.classList.add('modo-edicion')
      registroActivo.classList.remove('desactivado')
      // actualiza un solo registro
      actualizarRegistro(registroActivo.id)
    })
  }
}


function actualizarRegistro (idRegistro) {

  var btnGuardar = document.getElementById(idRegistro).getElementsByClassName('guardarBtn')

  btnGuardar[0].addEventListener('click', function (e) {
    e.preventDefault()
    var inputNombreNuevo = document.getElementById(idRegistro).getElementsByClassName('nombre_contacto')
    var nombreNuevo = inputNombreNuevo[0].value

    var inputTelefonoNuevo = document.getElementById(idRegistro).getElementsByClassName('telefono_contacto')
    var telefonoNuevo = inputTelefonoNuevo[0].value

    var contacto = {
      nombre: nombreNuevo,
      telefono: telefonoNuevo,
      id: idRegistro
    }
    actualizarAjax(contacto)
  })
}

function actualizarAjax (datosContacto) {

  var jsonContacto = JSON.stringify(datosContacto)
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'actualizar.php?datos=' + jsonContacto, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resultado = xhr.responseText
      var resultadojson = JSON.parse(resultado)
      if (resultadojson.respuesta === true) {
        var registroActivo = document.getElementById(datosContacto.id)
        registroActivo.getElementsByTagName('td')[0].getElementsByTagName('p')[0].innerHTML = resultadojson.nombre
        registroActivo.getElementsByTagName('td')[1].getElementsByTagName('p')[0].innerHTML = resultadojson.telefono

        registroActivo.classList.remove('modo-edicion')
        habilitarEdicion()
      } else {
        console.log('hubo un error')
      }
    }
  }
  xhr.send()
}


document.addEventListener('DOMContentLoaded', function (event) {
  recorrerBotonesEditar()
})
