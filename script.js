let respuesta =   indexedDB.open("real", 1);

respuesta.onsuccess = (e)=>{
    console.log("la respuesta llego");
}

respuesta.onupgradeneeded = (e) =>{
    const db = e.target.result;
    db.createObjectStore("usuario",{autoIncrement : true});
    db.createObjectStore("chat",{autoIncrement : true});
    console.log("se  creo correctamente");
}

function agregarObjeto(objeto){
    const db = respuesta.result;
    const transaccion = db.transaction("chat", "readwrite");
    const objetoStore = transaccion.objectStore("chat");
    objetoStore.add(objeto);
    transaccion.addEventListener("complete",()=>{
        console.log("chat agregado correctamnente");
    })    
}

function leerObjeto(){
    const db = respuesta.result;
    const transaccion = db.transaction("chat", "readonly");
    const objetoStore = transaccion.objectStore("chat");
    const cursor = transaccion.openCursor();
    if (cursor.result){
        console.log(cursor.result.value);
        cursor.continue();
    }else{
        console.log("todo leido");
    }
}

function eliminarObejeto(key){
    const db = respuesta.result;
    const transaccion = db.transaction("chat", "readonly");
    const objetoStore = transaccion.objectStore("chat");
    objetoStore.delete(key);
    transaccion.addEventListener("complete",()=>{
        console.log("eliminado correctamente");
    })  
}


const btnAcceso = document.querySelector(".acceder");
const caja = document.querySelector(".blur");
let nombre="";
btnAcceso.addEventListener("click",()=>{
    nombre = prompt("¿Cual es tu nombre mi king?");
    if (nombre !== null && nombre !== ""){
            caja.classList.remove("inactivo");
            btnAcceso.classList.remove("acceder");
            btnAcceso.classList.add("cerrar");
            btnAcceso.value = "Cerrar sesion"
            h4.textContent = `${nombre}`;
            validar(nombre);
            leerSms(nombre);
        }
});

const h4 = document.querySelector(".user");
const texto = document.querySelector(".texto");
const enviar = document.querySelector(".envio");

enviar.addEventListener("click",()=>{
    if (texto.value !== ""){
        agregarChat(texto.value.trim(),nombre);
        texto.value = "";
        leerSms(nombre);   
    } 
});

const agregarUsuario = (usuario)=>{
    const db = respuesta.result;
    const transaccion = db.transaction("usuario", "readwrite");
    const objetoStore = transaccion.objectStore("usuario");
    objetoStore.add(usuario);
    transaccion.addEventListener("complete",()=>{
        console.log("el usuario se agrego correctamente");
    })  
}

const validar = (usuario)=>{
    const db = respuesta.result;
    const transaccion = db.transaction("usuario", "readonly");
    const objetoStore = transaccion.objectStore("usuario");
    const cursor = objetoStore.openCursor();
    const usuarios = [];
    cursor.addEventListener("success",()=>{
        if (cursor.result){
            usuarios.push(cursor.result.value.user);
            cursor.result.continue();
        }else{
            if (usuarios.includes(usuario)!== false){
                console.log("el usuario ya existe");
            }else{
                agregarUsuario({user:`${usuario}`});
            }
        }
    });
}

const agregarChat = (m, name)=>{
    mensaje = {sms:`${m}`,nombre:`${name}`};
    const db = respuesta.result;
    const transaccion = db.transaction("chat", "readwrite");
    const objetoStore = transaccion.objectStore("chat");
    objetoStore.add(mensaje);
    transaccion.addEventListener("complete",()=>{
        console.log("mensaje agregado a la base de datos");
    });
}

const leerSms=(name)=>{
    const db = respuesta.result;
    const transaccion = db.transaction("chat", "readonly");
    const objetoStore = transaccion.objectStore("chat");
    const cursor = objetoStore.openCursor();
    const zona = document.querySelector(".sms");
    zona.innerHTML="";
    cursor.addEventListener("success",()=>{
        if (cursor.result){
            if (cursor.result.value.nombre === name){
                console.log("mensajes del usuario actual");
                zona.innerHTML += `<h5 class="mensaje enviado">${cursor.result.value.sms}</h5`
                //<h5 class="mensaje enviado">hola como estas?</h5>
                //<h5 class="mensaje recibido">muy bien y tu?</h5>
            }else{
                console.log("mensajes del usuario externo");
                zona.innerHTML += `<h5 class="mensaje recibido">${cursor.result.value.sms}</h5`
                console.log(cursor.result.value.sms);
            }
            cursor.result.continue();
        }else{
            console.log("leido");
            console.log(zona);
        }
    });
};
