'use strict';
document.getElementById("mensajeNoResultado").style.visibility= 'hidden';
document.getElementById("mensajeNoResultado").style.height=0;
/*
●	Como usuario, quiero ingresar a un sistema que me permita ver y buscar imágenes animadas tipo GIF.
●	Como usuario quiero que lo primero que vea al ingresar a la aplicación sean los gifs más populares (trending)
●	Como usuario, quiero ingresar en un input de texto HTML una cadena para buscar imágenes relacionadas a ella. 
    Las imágenes encontradas serán mostradas de la misma forma, en el mismo sector que las más populares.
●	Como usuario, quiero que se me avise en caso de que mi búsqueda no arrojase resultados.
●	Como usuario, quiero que se guarde mi historial de mis últimas tres búsquedas en caso de querer acceder nuevamente. 
    Esto debe persistir a los cierres del navegador, y al hacer click en una de ellas, volver a realizar la búsqueda.
●	Como usuario, quiero que al llegar al final de la página, esta carge más gifs (infinite scrolling) 
*/


const urlApiGifGiphy = "http://api.giphy.com/v1/gifs";
const api_key = "PhAQqzR01k3g63aEiXLAbxg9Tn44oGta";
let consul = 0;
let busquedaAct = ""; //la busqueda
let endpoint = "trending";//search o trending
let limit = "50";//0-50
let offset = "0";//0-4999
let rating = "r";//g, pg, pg-13, r
let lang = "es"; //es, en
let showResultsHTML = '';
inicioLoad(busquedaAct,consul);

function inicioLoad(busquedaAct,consul){
    console.log("***********inicioLoad");
    if (consul==0){
        endpoint = "trending";
        offset = "0";
        launchLogicUrl(endpoint,api_key,busquedaAct,limit,offset,rating,lang); // llama la busqueda y le pasa el valor a buscar
    }else if (consul==1){
        endpoint = "search";
        offset = "0";
        launchLogicUrl(endpoint,api_key,busquedaAct,limit,offset,rating,lang);
    }else if (consul==2){
        let value = parseInt(offset);
        offset = value + 50;
        console.log("valores, endpoint:",endpoint," busquedaAct:",busquedaAct," offset:",offset)
        launchLogicUrl(endpoint,api_key,busquedaAct,limit,offset,rating,lang);

    }
    
}


//Moldes tipo seguimiento url
//https://api.giphy.com/v1/gifs/search?api_key=PhAQqzR01k3g63aEiXLAbxg9Tn44oGta&q=cats&limit=25&offset=0&rating=g&lang=es

//https://api.giphy.com/v1/gifs/trending?api_key=PhAQqzR01k3g63aEiXLAbxg9Tn44oGta&limit=25&rating=g

function launchLogicUrl(endpoint,key,busquedaAct,limit,offset,rating,lang){
    console.log("***********launchLogicUrl");
    let pathEnd = "";// se limpia el pathend
    
    const path = `${urlApiGifGiphy}/${endpoint}?api_key=${key}`;

    if (endpoint === "trending"){
        pathEnd = `${path}&limit=${limit}&rating=${rating}`;
    } else if (endpoint === "search"){
        pathEnd = `${path}&q=${busquedaAct}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${lang}`;
        //pathEnd = `${path}&q=${busquedaAct}`;
    }
    console.log("URL:",pathEnd);
    applyMethodShow(pathEnd);
}


function applyMethodShow(pathEnd){
    console.log("***********applyMethodShow");
        fetch(pathEnd).then(function(res) {
            return res.json();
        }).then(function(json){
            console.log(json);///Eliminar
            console.log("Se cargaron json:",json.data.length);
            
            if(json.data.length==0){
                levantaMensajeNoResultadosObtain();
            }
            const gifsResult = document.getElementById("muestraBusquedaT");
            if (offset==0){
                showResultsHTML = '';
                
            }
            json.data.forEach(function(obj){
                console.log(obj.images.fixed_width.url);
                const urlEach = obj.images.fixed_width.url;
                const gifTitle = obj.title;
                showResultsHTML += `<img class="claseImg" alt="${gifTitle}" title="${gifTitle}" src="${urlEach}">`
            })
            gifsResult.innerHTML = showResultsHTML;
        }).catch(function(err){
            console.log("Ojo dió error! :",err.message); 
        })
}


function levantaMensajeNoResultadosObtain(){
    console.log("***********levantaMensajeNoResultadosObtain");
    document.getElementById("mensajeNoResultado").style.visibility= 'visible';
    document.getElementById("mensajeNoResultado").style.height="50px";
    
    function espera(x) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(x);
          }, 6000);
        });
      }
      async function f2() {
        var x = await espera(10);
        document.getElementById("mensajeNoResultado").style.height=0;
        document.getElementById("mensajeNoResultado").style.visibility= 'hidden';
        consul=0;
        inicioLoad(busquedaAct,consul);
    }
      f2();
}


/*****Inicializar variables*****/

let count = 0;
let busquedaX = [];

///Limpiar localStorage y inicializar count de busquedaX

function clearLocalStorage(){ 
    console.log("***********clearLocalStorage");
    localStorage.clear();
    consul = 0;
    inicioLoad(busquedaAct,consul);
    console.log("<-Boton Clear->");
    busquedaX=[];
    count=0;
    console.log("Valor de count:",count);
    console.log("Valor de busquedaX:",busquedaX);
    console.log("Valor de localStorage:",JSON.parse(localStorage.getItem("busq")));
    console.log(">-Boton Clear-<");
    hiddenShowClearBotton();
    cargaTituloBusquedasRecientes();
};

/// Ocultar o mostrar boton de limpiar

function hiddenShowClearBotton(){
    console.log("***********hiddenShowClearBotton");
    console.log("localStorage - Status:",JSON.parse(localStorage.getItem("busq"))!=null);
    let status = !(JSON.parse(localStorage.getItem("busq"))==null);
    if (status==false){
        document.getElementById("status").style.visibility= 'hidden';
        console.log("boton oculto");
    }else if(status==true){
        document.getElementById("status").style.visibility= 'visible';
        console.log("boton visible");
    }
}

//////*****Obtener busquedas del localStorage para recientes*****

//En la primera carga -- si localStorage tiene algo lo carga
cargarVarLocalStorage();
function cargarVarLocalStorage(){
    console.log("***********cargarVarLocalStorage");
    if (localStorage.length!=0){
        if (JSON.parse(localStorage.getItem("busq")).length > 0) {
            console.log(JSON.parse(localStorage.getItem("busq")).length);
            count = JSON.parse(localStorage.getItem("busq")).length;
            busquedaX = JSON.parse(localStorage.getItem("busq"));
            console.log("init value localStorage: ",busquedaX);
            
            for (let index = 0; index < count; index++) {
                crearListaNueva(index+1,busquedaX);
            }
            

        } else {
            count = 0;
            console.log(JSON.parse(localStorage.getItem("busq")).length);
        };
    }
    hiddenShowClearBotton();
};

//Cargar busquedas en el localStorage y ordenarlas
function cargaBusquedasRecientes(){ 
    console.log("***********cargaBusquedasRecientes");
    if (count==3){
        let contenedor = busquedaX [0];
        busquedaX [0] = busquedaX [1];
        busquedaX [1] = busquedaX [2];
        busquedaX [2] = contenedor;
        count = 2;
    } 
        busquedaX [count] = document.getElementById("inputBusqueda").value;
        localStorage.setItem("busq",JSON.stringify(busquedaX));
            console.log("Valor nuevo busquedaX:",busquedaX," : ",count);
            console.log("Valor nuevo localStorage:",JSON.parse(localStorage.getItem("busq"))," : ",count);
        count+=1;
            console.log("Valor nuevo de count:",count);
        crearListaNueva(count,busquedaX);
}





//Muestra Sección de cargar Título listado 3 busquedas recientes
function cargaTituloBusquedasRecientes(){
    console.log("***********cargaTituloBusquedasRecientes");
    let revisaSiHayBusqReciente = document.querySelectorAll("li");
    const recientesTitle = document.getElementById("recientesTitulo");
    if (JSON.parse(localStorage.getItem("busq")) == null){ 
        recientesTitle.innerHTML = ``;
        document.getElementById("recientes").innerHTML = ``;
    }else if (revisaSiHayBusqReciente.length>0){
        const titulo_busqueda = "BÚSQUEDAS RECIENTES :";
        recientesTitle.innerHTML = `
            <h2>${titulo_busqueda}</h2>
        `;
        hiddenShowClearBotton();
    }
}



//Sección de busqueda
const inputBusqueda = document.querySelector("#inputBusqueda");
const listaRecientes = document.getElementById("recientes");
const formulario = document.getElementsByTagName("form")[0];


formulario.addEventListener("submit", function(eventInputValue){
    eventInputValue.preventDefault();
console.log("***********addEventListener-submit");

    compruebaValorInput();    

});

function compruebaValorInput(){
    console.log("***********compruebaValorInput");
    filtro();
}

//filtro lo que se carga primero luego de hacer submit
function filtro(){
    console.log("***********filtro");
    if (inputBusqueda.value!=""){
        busquedaAct = inputBusqueda.value;
        consul = 1;
        countScrollReach = 0;
        inicioLoad(busquedaAct,consul);
        cargaBusquedasRecientes();
        removeLastchildBusqueda();
        eventoClickListaRecientes();
        let busquedaY = document.getElementById("inputBusqueda"); 
        busquedaY.value = ""; //limpia el input
    }
}

//Crear lista nueva
function crearListaNueva(count, busquedaX){
    console.log("***********crearListaNueva");
    document.getElementById("recientes").innerHTML += `
        <li>${busquedaX[count-1]}</li>
        `;
        cargaTituloBusquedasRecientes();
        console.log("crearListaNueva***********agregado+1");
};

//Event vigila el click en las tres palabras de las busquedas recientes
function eventoClickListaRecientes() {
    console.log("***********eventoClickListaRecientes");
    const newListBusqReciente = document.querySelectorAll("li");

    newListBusqReciente.forEach(function (element){
        element.addEventListener("click", function(){
            busquedaAct = element.textContent;
            consul = 1;
            inicioLoad(busquedaAct,consul);
            console.log("0","Click", element.textContent)
        })
    })
}


function removeLastchildBusqueda(){
    console.log("***********removeLastchildBusqueda");
    let totalListBusqReciente = document.querySelectorAll("li");
    let busqReciente_ppal = document.getElementById("recientes");

    if (totalListBusqReciente.length>3){
        totalListBusqReciente[0].innerHTML=totalListBusqReciente[1].innerHTML;
        totalListBusqReciente[1].innerHTML=totalListBusqReciente[2].innerHTML;
        totalListBusqReciente[2].innerHTML=totalListBusqReciente[3].innerHTML;
        busqReciente_ppal.removeChild(busqReciente_ppal.lastChild);
        busqReciente_ppal.removeChild(busqReciente_ppal.lastChild); //solo asi me elimino la ultima, duplicando la linea
        console.log("removeLastchildBusqueda***********removed-1");
    }
    
}

//eventoClickListaRecientes();

/*Punto 6 *******************************************************************************************************************
    ●	Como usuario, quiero que al llegar al final de la página, esta carge más gifs (infinite scrolling)
*/

//Event del scrolling infinito
function eventoInfiniteScroll() {
    console.log("***********eventoInfiniteScroll");
    function espera(x) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(x);
          }, 500);
        });
      }
      async function f1() {
        var x = await espera(10);

        inicioLoad(busquedaAct,2);
      
    }
      f1();
};

let countScrollReach = 0;
window.addEventListener("scroll",() =>{
    console.log("***********addEventListener-scroll");
    //console.log("Suma Y :",window.scrollY+window.innerHeight);
    //console.log("Total meta Y:",document.documentElement.scrollHeight);
    if(window.scrollY+window.innerHeight+0.5 >= document.documentElement.scrollHeight){
        countScrollReach += 1;
        console.log("**********SCROLL ALCANZADO*******",countScrollReach);
       if (endpoint=="search"){
        eventoInfiniteScroll();
       }else{
        //window.alert("Estimado Usuario recuerda que el endpoint ~/Trending no tiene Infiny Scroll");

        let respuesta = confirm("Estimado Usuario recuerda que el endpoint ~/Trending no tiene Infiny Scroll, ¿Deseas que se haga una busqueda por 'Trending'?, esto permitirá el infinite-scroll de Trending");
        if (respuesta==true){
            endpoint = "search";
            busquedaAct = "Trending";
            eventoInfiniteScroll();
        }
       }

    }


});



/*(Ojo el trending no tiene scroll infinito)*/

//@JedGBC