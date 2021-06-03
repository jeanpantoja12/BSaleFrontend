document.addEventListener('DOMContentLoaded',()=>{
    // Llenar categorías en el navbar
    load_categories();
    // Esperar carga de navbar
    wait_load("#search-form",()=>{
        // Focus en barra de búsqueda
        document.querySelector('#search-form').focus();
    })
    // Esperar carga de navbar
    wait_load("#search-button",()=>{
        // Validación de botón de búsqueda (No buscar datos vacíos)
        const button = document.querySelector('#search-button');
        button.disabled = true
        document.querySelector('#search-form').onkeyup = () =>{
            if(document.querySelector('#search-form').value.length >0)
                button.disabled = false;
            else
                button.disabled = true;
        }
    })
    
});

// Función de espera de carga de componentes
function wait_load(id, callback){
    var timer = setInterval(function(){
        if(document.querySelector(id)){
            clearInterval(timer);
            callback();
        }
    }, 100);
}


// Función de carga de categorías
function load_categories(){
    // Llamado a API de lista de cateogrías
    fetch('https://bsaleacasoapi.herokuapp.com/categories_api')
    .then(response => response.json())
    .then(responses =>{
        // Recorrido de datos
        responses.categories.forEach(element => {
            // Creando elementos HTML para la lista de categorías
           const item = document.createElement('a');
           // Añadiendo estilos CSS
           item.className = 'dropdown-item';
           // Agregando datos del API
           item.href = `./category.html?c=${element['nombre']}`;
           // Ordenar título
           let item_title = element['nombre'];
           item_title = item_title.charAt(0).toUpperCase() + item_title.slice(1);
           item.innerHTML = item_title;
           // Llenando los elementos en el contenedor principal
           document.querySelector('#nav-categories').append(item);
        });
    })
}

// Función de cálculo de descuentos en los precios
function calculate_discount(num,discount){
    percent = (1-(discount/num))*100;
    percent = (Math.round(percent+"e+1") + "e-2");
    return + percent;
}

// Función de validación de cadenas en blanco, null o undefined
function is_blank(str) {
    return (!str || /^\s*$/.test(str));
}