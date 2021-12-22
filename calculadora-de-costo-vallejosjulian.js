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

//Asigno listeners a los botones
let botones=document.getElementsByClassName("botones")
for (const element of botones) {
    element.addEventListener("mousedown",(e)=>{ 
      if (e.button == 0) {
        switch (e.target.id) {
          case "botonAniadirIngrediente":
            aniadirIngrediente()
            break;
          default:
            borrarLista()
            break;
        }
      }
    }
    )
  }

//Asigno listeners a los inputs
let inputs=document.getElementsByClassName("inputs")
for (const element of inputs) {
  element.addEventListener("keyup",(e)=>{ 
    if (e.key == "Enter") {
      aniadirIngrediente()
      let inputNombre = document.getElementById("nombre");
      inputNombre.focus();
    }
  })
}

//Creo la tabla con los valores de arrayIngredientes
arrayIngredientes.forEach(element => {
let tableBody=document.getElementById("tableBody");
let tr = document.createElement("tr");
tr.className = "tableRow";
let tableInput = document.getElementById("tableInput");
for (const property in element) {
  let td=document.createElement("td");
  td.innerHTML = element[property];
  tr.appendChild(td);
}
tableBody.insertBefore(tr,tableInput);
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
    document.getElementById("nombre").value,
    document.getElementById("contenido").value,
    document.getElementById("precio").value,
    document.getElementById("cantidad").value);
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
      let tableBody=document.getElementById("tableBody");
      let tr = document.createElement("tr");
      tr.className = "tableRow";
      let tableInput = document.getElementById("tableInput");
      
      for (const element in ingrediente) {
        let td=document.createElement("td");
        td.innerHTML = ingrediente[element];
        tr.appendChild(td);
      }
      tableBody.insertBefore(tr,tableInput);
      localStorage.setItem(arrayIngredientes.length,JSON.stringify(ingrediente))
      arrayIngredientes.push(ingrediente);
      document.getElementById("nombre").value = "";
      document.getElementById("contenido").value = "";
      document.getElementById("precio").value = "";
      document.getElementById("cantidad").value = "";
      calcular();
    return 1
  }
  else{
    //Creo un parrafo que muestre error
    let pError = document.getElementById("p2");
    if (pError==null) {
      pError = document.createElement("p");
      pError.id = "p2"
      let contenedor=document.getElementById("contenedor");
      contenedor.appendChild(pError);
    }
    pError.innerHTML = "ERROR! Verifica que los datos que ingresas sean numeros";
    return -1
  }
}

//Funcion que genera un color aleatorio
function colorRandom() {
  let color = [];
  //Itero 16 veces para conseguir un valor de 0 a F hexadecimal y agrego el resultado al array
    for (let index = 0; index < 6; index++) {
      let letra = Math.floor(Math.random() * 16);
      if (letra >9) {
        switch (letra) {
          case 10: letra = "a"; break;
          case 11: letra = "b"; break;
          case 12: letra = "c"; break;
          case 13: letra = "d"; break;
          case 14: letra = "e"; break;
          default: letra = "f"; break;
        }
      }
      color.push(letra);
    }
    //Uno el array en un string y lo devuelvo
    color = color.join("");
    return color;
}

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
    //Cambio el color de fondo de la tabla
    let tabla = document.getElementById("tabla");
    tabla.style.backgroundColor = "#" + colorRandom() + "80";
    //Creo el parrafo que dice el resultado y lo muestro
    let p = document.getElementById("p");
    if (p==null) {
      p = document.createElement("p");
      p.id = "p"
      let contenedor=document.getElementById("contenedor");
      contenedor.appendChild(p);
    }
    p.innerHTML = "En total, nos costará: " + total + " pesos hacer esta receta.";
    //Si hay mensaje de error, lo elimina
    let pError = document.getElementById("p2");
    if (pError!=null) {
      pError.parentNode.removeChild(pError);
    }
  }
}

//Elimina todos los datos del array y del LocalStorage
function borrarLista(){
  //Vacio la tabla
  let rows = document.getElementsByClassName("tableRow")
  do {
    let len = rows.length
    if (len == 0) {
      break;
    }else{
      rows[0].parentNode.removeChild(rows[0]);
    }
  } while (true);
  //Elimino parrafos
  let p = document.getElementById("p");
  if (p!=null) {
    p.parentNode.removeChild(p);
  }
  let pError = document.getElementById("p2");
  if (pError!=null) {
    pError.parentNode.removeChild(pError);
  }
  //Cambio el color de la tabla a blano
  let tabla = document.getElementById("tabla");
  tabla.style.backgroundColor = "#ffffff";
  //Borro datos del array y del LocalStorage
  arrayIngredientes = [];
  let len = localStorage.length;
  for (let index = 0; index < len; index++) {
    localStorage.removeItem(index)
  }
}
