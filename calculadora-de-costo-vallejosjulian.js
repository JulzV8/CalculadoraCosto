let arrayIngredientes = [];

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

function aniadirIngrediente(){
  let ingrediente = new Ingrediente(
    document.getElementById("nombre").value,
    document.getElementById("contenido").value,
    document.getElementById("precio").value,
    document.getElementById("cantidad").value);
  let datosValidos = true;

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

  if (datosValidos) {
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
    arrayIngredientes.push(ingrediente);
    document.getElementById("nombre").value = "";
    document.getElementById("contenido").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
  }
}

function validarNumero(texto){
  let numero = parseFloat(texto)
  if(numero > 0)
  {
    return numero;
  }
  else
  {
    alert("Error. Numero inválido.");
    return -1;
  }
}

function calcular ()
{
  let total = 0;
  arrayIngredientes.forEach(element => {
    total += element.reglaDe3Simple();
  });
  if (total != 0) {
    let color = [];
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
    color = color.join("");
    console.log(color);
    let tabla = document.getElementById("tabla");
    tabla.style.backgroundColor = "#" + color + "80";
    let p = document.getElementById("p");
    if (!p) {
      let p = document.createElement("p");
      p.innerHTML= "En total, nos costará: " + total + " pesos hacer esta receta.";
      p.id = "p"
      let contenedor=document.getElementById("contenedor");
      contenedor.appendChild(p);
    }
    else{
      p.innerHTML = "En total, nos costará: " + total + " pesos hacer esta receta.";
    }
  }
  console.log(arrayIngredientes);
}

function borrarLista()
{
  let rows = document.getElementsByClassName("tableRow")
  do {
    let len = rows.length
    if (len == 0) {
      break;
    }else{
      rows[0].parentNode.removeChild(rows[0]);
    }
  } while (true);
  let p = document.getElementById("p");
  p.parentNode.removeChild(p);
  let tabla = document.getElementById("tabla");
  tabla.style.backgroundColor = "#ffffff";
  arrayIngredientes = [];
  console.log(arrayIngredientes);
}