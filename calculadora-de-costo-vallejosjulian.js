// Declaro constructor objeto Ingrediente
class Ingrediente{
  constructor(nombre,contenido,precio,cantidad){
    this.nombre=nombre;
    this.contenido=contenido;
    this.precio=precio;
    this.cantidad=cantidad;
  }
  reglaDe3Simple(){
  let costo = (this.precio * this.cantidad)/this.contenido;
  return costo
  }
}

//Declaro array de ingredientes global
let arrayIngredientes = [];

//Le cargo informacion, si existe
if (localStorage.length > 0) {
  for (let index = 0; index < localStorage.length; index++) {
    let aux = JSON.parse(localStorage.getItem(index))
    arrayIngredientes.push(new Ingrediente (aux.nombre,aux.contenido,aux.precio,aux.cantidad))
  }
}

//Llamo a calcular para que se muestre la informacion en pantalla
calcular();








$(() => {



  $("#botonWikipedia").click(()=>{

    let wikipediaAajaxTitle = $.ajax({
      url:"http://es.wikipedia.org/w/api.php",
      type:"GET",
      data:{
        action:"query",
        rnnamespace:"0",
        format:"json",
        list:"random",
        origin:"*"
      },
      success:function (data) {
        let title=data.query.random[0].title;
        let espacios=/ /gi;
        title = title.replace(espacios,"_")
        console.log(title);
        let p = $("#linkWikipedia");
        if (p.length!=0) {
          p.remove();
        }
        $("#contenedor").prepend(`<div class="m-2"><a id="linkWikipedia" href="https://es.wikipedia.org/wiki/${title}">https://es.wikipedia.org/wiki/${title}</a></div>`);
      }
    })
  })
  //Asigno listeners a los botones
  $("#divTexto").fadeIn(()=>{
  $("#divTabla").fadeIn();})
  let botones=$(".botones")
  for (const element of botones) {
      element.addEventListener("mousedown",(e)=>{ 
        switch (element.id) {
            case "botonAniadirIngrediente":
              aniadirIngrediente()
              break;
            default:
              borrarLista()
              break;
          }
        }
      )
    }
    //Asigno listeners a los inputs
    let inputs=$(".inputs")
    inputs.keyup((e)=>{ 
      if (e.key == "Enter") {
        aniadirIngrediente()
        let inputNombre = $("#nombre");
        inputNombre.focus();
      }
    })
    //Creo la tabla con los valores de arrayIngredientes
    arrayIngredientes.forEach(element => {
    let tableBody=$("#tableBody");
    tableBody.append(`<tr>
      <td class="table">${element.nombre}</td>
      <td class="table">${element.contenido}</td>
      <td class="table">${element.precio}</td>
      <td class="table">${element.cantidad}</td>
      </tr>`);
    });

});

//Funcion para validar que un string contenga valor numerico
function validarNumero(texto){
  let numero = parseFloat(texto)
  if(numero > 0)
    return numero;
  else
    return -1;
}

//Funcion que crea un nuevo objeto ingrediente, tomando los valores de los inputs,
//y luego lo añade tanto al arrayIngredientes como al localStorage
function aniadirIngrediente(){
  let ingrediente = new Ingrediente(
    $("#nombre")[0].value,
    $("#contenido")[0].value,
    $("#precio")[0].value,
    $("#cantidad")[0].value);
  let datosValidos = true;
  //Valido campos numericos
  for (const element in ingrediente) {
    if (element == "nombre") {
      continue;      
    }
    else{
      let numero = validarNumero(ingrediente[element]);
      if ( numero != -1) {
        ingrediente[element] = numero;
      }else{
        datosValidos= false;
        break;
      }
    }
  }
  //Si los valores son correctos, se continua. Caso contrario termina la funcion y da error
  if (datosValidos) {
    //Creo una nueva fila para la tabla y la añado
    let tableBody=$("#tableBody");
    tableBody.append(`<tr class="tr" style="display: none;">
      <td class="table">${ingrediente.nombre}</td>
      <td class="table">${ingrediente.contenido}</td>
      <td class="table">${ingrediente.precio}</td>
      <td class="table">${ingrediente.cantidad}</td>
      </tr>`);
    localStorage.setItem(arrayIngredientes.length,JSON.stringify(ingrediente))
    arrayIngredientes.push(ingrediente);
    $("#nombre")[0].value = "";
    $("#contenido")[0].value = "";
    $("#precio")[0].value = "";
    $("#cantidad")[0].value = "";
    $(".tr").fadeIn();
    calcular();
    return 1
  }
  else{
    //Creo un parrafo que muestre error
    let pError =$("#mensajeError");
    if (pError.length==0) {
      $("#contenedor").append(`<p id="mensajeError">ERROR! Verifica que los datos que ingresas sean numeros</p>`);
    }
    return -1
  }
}

//Funcion que genera un color aleatorio
// function colorRandom() {
//   let color = [];
//   //Itero 16 veces para conseguir un valor de 0 a F hexadecimal y agrego el resultado al array
//     for (let index = 0; index < 6; index++) {
//       let letra = Math.floor(Math.random() * 16);
//       if (letra >9) {
//         switch (letra) {
//           case 10: letra = "a"; break;
//           case 11: letra = "b"; break;
//           case 12: letra = "c"; break;
//           case 13: letra = "d"; break;
//           case 14: letra = "e"; break;
//           default: letra = "f"; break;
//         }
//       }
//       color.push(letra);
//     }
//     //Uno el array en un string y lo devuelvo
//     color = color.join("");
//     return color;
// }

//Funcion calcular
function calcular (){
  //Llamo a la funcion reglaDe3Simple y guardo el resultado en un acumulador
  let total = 0;
  arrayIngredientes.forEach(element => {
    total += element.reglaDe3Simple();
  });
  //Si el total es 0 termina la funcion
  if (total != 0) {
    total = Math.round(total * 100) / 100;
    // //Cambio el color de fondo de la tabla
    // $("#tabla").css("background-color","#" + colorRandom() + "80");
    //Creo el parrafo que dice el resultado y lo muestro
    let p = $("#mensajeResultado");
    if (p.length==0) {
      $("#contenedor").append(`<p id="mensajeResultado">En total, nos costará: ` + total + ` pesos hacer esta receta.</p>`);
    }
    else{
      p.remove();
      $("#contenedor").append(`<p id="mensajeResultado">En total, nos costará: ` + total + ` pesos hacer esta receta.</p>`);
    }
    //Si hay mensaje de error, lo elimina
    let pError = $("#mensajeError");
    if (pError.length!=0) {
      pError.remove();
    }
  }
}

//Elimina todos los datos del array y del LocalStorage
function borrarLista(){
  //Vacio la tabla
  $("#tableBody").empty();
  //Elimino parrafos
  let mensajeError = $("#mensajeError")
  if (mensajeError.length != 0) {
    mensajeError.remove();
  }
  let mensajeResultado = $("#mensajeResultado");
  if (mensajeResultado.length != 0) {
    mensajeResultado.remove();
  }
  //Cambio el color de la tabla a blanco
  $("#tabla").css("background-color","white");
  //Borro datos del array y del LocalStorage
  arrayIngredientes = [];
  let len = localStorage.length;
  for (let index = 0; index < len; index++) {
    localStorage.removeItem(index)
  }
}

