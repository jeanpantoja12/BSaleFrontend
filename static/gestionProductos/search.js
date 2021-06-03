document.addEventListener('DOMContentLoaded',()=>{
    // Obtención de parámetros URL
    let url_string = window.location.href;
    let url = new URL(url_string);
    // Parámetro de palabra a buscar
    let search = url.searchParams.get("s");
    // Parámetro de página de la lista
    let page = url.searchParams.get("page");
    // Parámetro de orden de la lista
    let order = url.searchParams.get("order");
    // Parámetro de filtro de 'precio desde'
    let from = url.searchParams.get("from_s");
    // Parámetro de filtro de 'precio hasta'
    let to = url.searchParams.get("to_s");

    // Validación de parámetros URL importantes
    if(search){
        // Instancia de cabecera de parámetros
        let headers = '';
        if (order){
            // Asignación de estilos para botón de Ordenar (establecer Active)
            if (order === 'asc'){
                document.querySelector('#more-price').classList.remove('active');
                document.querySelector('#less-price').classList.add('active');
            }
            else if(order === 'desc'){
                document.querySelector('#more-price').classList.add('active');
                document.querySelector('#less-price').classList.remove('active');
            }
            // Llenado de cabecera con datos de orden
            headers += `&order=${order}`
        }
        if(from && to){
            // Llenado de cabecera con datos de 'precio desde' y 'precio hasta'
            headers += `&from_s=${from}&to_s=${to}`
        }
        else if(from){
            // Llenado de cabecera con datos de 'precio desde'
            headers += `&from_s=${from}`;
        }
        else if(to){
            // Llenado de cabecera con datos de 'precio hasta'
            headers += `&to_s=${to}`;
        }
        if(page){
            // Si hay paginación, llamar función de carga de datos con número de página
            load_data(search,page,headers);
        }
        else{
            // Si no hay paginación, cargar por defecto la primera página
            load_data(search,1,headers);
        }
        // Asignación de estilos CSS para filtros
        document.querySelector('#filter-container').style.display = 'none';
        // Asignación de texto para input de búsqueda
        wait_load("#search-form",()=>{
            // Focus en barra de búsqueda
            document.querySelector('#search-form').value = `${search}`;
        })
        // Asignación de URL para funciones de orden
        document.querySelector('#less-price').href = setGetParameter(window.location.href,'order','asc');
        document.querySelector('#more-price').href = setGetParameter(window.location.href,'order','desc');
    }
        
    else
        window.location.href = '/';
});

// Función de cambio de valores de parámetros URL
function setGetParameter(url,paramName, paramValue)
{
  var url = url;
  var hash = location.hash;
  url = url.replace(hash, '');
  if (url.indexOf("?") >= 0)
  {
    var params = url.substring(url.indexOf("?") + 1).split("&");
    var paramFound = false;
    params.forEach(function(param, index) {
      var p = param.split("=");
      if (p[0] == paramName) {
        params[index] = paramName + "=" + paramValue;
        paramFound = true;
      } 
    });
    if (!paramFound) params.push(paramName + "=" + paramValue);
    url = url.substring(0, url.indexOf("?")+1) + params.join("&");
  }
  else
    url += "?" + paramName + "=" + paramValue;
  return (url + hash);
}

// Función de borrado de parámetros URL
function removeParameter(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

// Función de carga y búsqueda de productos
function load_data(search,page,headers){
    // Asignación de título
    let title = search;
    document.querySelector('#title-search').innerHTML = title;
    // Animación de carga
    let loader = '<div class="loader"></div>';
    document.querySelector('#search-container').innerHTML = `<div class="col-md-2" style="margin:auto">${loader}</div>`;
    // Llamado a API de búsqueda de productos
    fetch(`https://bsaleacasoapi.herokuapp.com/search_api?s=${search}&page=${page}`+headers)
    .then(response => response.json())
    .then(responses => {
        // Limpieza de HTML de carga
        document.querySelector('#search-container').innerHTML = '';
        // Validación de cantidad de resultados
        if( responses.results.length>0){
            // Asignación de elementos paginación de la lista
            load_pagination(responses.num_pages,search,headers);
            // Asignación de elementos de << (Anterior) y >> (Siguiente) en la paginación
            pagination_items(page,responses.has_next,responses.has_prev,search,headers);
            // Carga de filtros de precio (Precio desde, Precio hasta y sugerencias)
            load_filters(responses.results,search);
            // Asignación de estilos CSS para contenedor de filtro
            document.querySelector('#filter-container').style.display = 'block';
            
            // Recorrido de datos
            responses.results.forEach(element => {

                // Creando elementos HTML para la lista de productos encontrados
                const container = document.createElement('div');
                const row = document.createElement('div');
                const img_container = document.createElement('div');
                const img = document.createElement('img');
                const details_container = document.createElement('div');
                const title_product = document.createElement('h3');
                const price_container = document.createElement('div');
                const price = document.createElement('h3');
                const price_real = document.createElement('p');
    
                // Añadiendo estilos CSS
                container.className = 'col-md-12 containers';
                row.className = 'row';
                img_container.className = 'col-md-4';
                img.className = 'img-product';
                details_container.className = 'col-md-8';
                title_product.className = 'title-product';
                price_container.className = 'col-md-12';
                price.className = 'price';
                price_real.className = 'discount';
    
                // Apilando los elementos en sus contenedores
                price_container.append(price);
                price_container.append(price_real);
                price_container.append(document.createElement('br'));
                details_container.append(title_product);
                details_container.append(document.createElement('br'));
                details_container.append(price_container);
                img_container.append(img);
                row.append(img_container);
                row.append(details_container);
                container.append(row);
                container.append(document.createElement('hr'));

                // Agregando datos del API
                // Validación de imagen vacía|null|undefined
                if (is_blank(element['img'])){  
                    img.src = 'https://i.ibb.co/5B5RbCz/Image-Not-Available.png';
                }
                else{
                    img.src = element['img'];
                }
                title_product.innerHTML = element['nombre'];
                price_real.innerHTML = `$.${element['precio']}`;

                // Cálculo de descuento en precio real
                let descuento = parseFloat(element['precio']) - parseFloat(element['desc']);
                price.innerHTML = `$. ${descuento}`;

                // Validación de existencia de descuentos y porcentajes
                if (element['desc'] === 0){
                    price_real.remove();
                }
                else{
                    let discount_percentage = calculate_discount(parseFloat(element['precio']),descuento);
                    const discount = document.createElement('h4');
                    discount.className = 'discount-sale';
                    price_container.append(discount);
                    discount.innerHTML = `${discount_percentage}% OFF`;
                }

                // Llenando los elementos en el contenedor principal
                document.querySelector('#search-container').append(container);
                document.querySelector('#search-container').append(document.createElement('br'));
            });
        }
        else{
            document.querySelector('#search-container').innerHTML = '<div class="col-md-12"><h3>No hay artículos para tu búsqueda.</h3></div>';
        }
        
    })
}

// Función de carga de elementos de paginación de acuerdo a la cantidad de datos
function load_pagination(num_pages,search,headers){
    // Creando elementos HTML para la página Previous
    const item = document.createElement('li');
    const reference = document.createElement('a');
    const icon = document.createElement('span');

    // Añadiendo estilos CSS y atributos importantes
    item.className = 'page-item';
    item.id = 'prev-page'
    reference.className = 'page-link';
    reference.ariaLabel = 'Previous';
    icon.ariaHidden = 'true';
    icon.innerHTML = '&laquo';
    // Apilando los elementos en sus contenedores
    reference.append(icon);
    item.append(reference);
    // Llenando elementos en el contenedor principal
    document.querySelector('.pagination').append(item);

    // Recorrido de páginas, creación de componentes y asignación de URL's
    for(let i=1;i<=num_pages;i++){
        // Creando elementos HTML para cada página
        const page = document.createElement('li');
        // Añadiendo estilos CSS y atributos importantes
        page.className = 'page-item';
        page.id = `pagination-page-${i}`
        // Asignación de URL de búsqueda
        page.innerHTML = `<a class='page-link' href='?s=${search}&page=${i}${headers}'>${i}</a>`
        // Apilando elemento en el contenedor principal
        document.querySelector('.pagination').append(page);
    }
    // Creando elementos HTML para la página Next
    const item2 = document.createElement('li');
    const reference2 = document.createElement('a');
    const icon2 = document.createElement('span');

    // Añadiendo estilos CSS y atributos importantes
    item2.className = 'page-item';
    item2.id = 'next-page'
    reference2.className = 'page-link';
    reference2.ariaLabel = 'Next';
    icon2.ariaHidden = 'true';
    icon2.innerHTML = '&raquo';
    // Apilando los elementos en sus contenedores
    reference2.append(icon2);
    item2.append(reference2);
    // Llenando elementos en el contenedor principal
    document.querySelector('.pagination').append(item2);
    
}

// Función de carga de atributos para las páginas Previous y Next
function pagination_items(page,has_next,has_prev,search,headers){
    // Validación (Si lista tiene página siguiente)
    if(!has_next){
        // Añadiendo estilos CSS para deshabilitar página
        document.querySelector('#next-page').className = 'page-item disabled'
    }
    else{
        // Asignación de URL con parámetros de la página siguiente
        document.querySelector('#next-page > a').href = `?s=${search}&page=${parseInt(page)+1}${headers}`
    }
    // Validación (Si lista tiene página previa)
    if(!has_prev){
        // Añadiendo estilos CSS para deshabilitar página
        document.querySelector('#prev-page').className = 'page-item disabled'
    }
    else{
        // Asignación de URL con parámetros de la página previa
        document.querySelector('#prev-page > a').href = `?s=${search}&page=${parseInt(page)-1}${headers}`
    }
    // Añadiendo estilos CSS para identificar el número de página y establecer Active
    document.querySelector(`#pagination-page-${page}`).className = 'page-item active';
}

// Función de carga de contenedor de filtros de precio para la búsqueda
function load_filters(obj){
    // Definición de precio máximo en la lista
    let highest = Math.max.apply(Math, obj.map(function(o) { return o.precio; }))
    // Definición de precio mínimo en la lista
    let lowest = Math.min.apply(Math, obj.map(function(o) { return o.precio; }))
    // Cálculo de precio medio
    let medium = (highest+lowest)/2;
    // Asignación de URL's para búsqueda con filtro
    let header_low = setGetParameter(window.location.href,'to_s',medium);
    let header_high = setGetParameter(window.location.href,'from_s',medium);
    header_high = setGetParameter(header_high,'to_s',highest);
    // Asignación de URL's en elementos HTML
    document.querySelector('#low-price-filter').innerHTML = `<a style="text-decoration: none;color: black;" href="${header_low}">Hasta $.${medium}</a>`;
    document.querySelector('#high-price-filter').innerHTML = `<a style="text-decoration: none;color: black;" href="${header_high}">Entre $.${medium} - $.${highest}</a>`;
    // Control de evento de click en botón de búsqueda de precios
    document.querySelector('#filter-btn').addEventListener('click', (e)=>{
        load_filter_search();
    })
}

// Función de redireccionamiento para búsqueda de productos por filtros de precio
function load_filter_search(){
    // Obtención de datos de inputs de precio mínimo y máximo
    let min = document.querySelector('#min-filter').value;
    let max = document.querySelector('#max-filter').value;
    // Asignación de variable para URL de filtro
    let url_filter = '';
    if (min && max){
        // Asignación de valores de ambos inputs en los parámetros URL
        url_filter = setGetParameter(window.location.href,'from_s',min);
        url_filter = setGetParameter(url_filter,'to_s',max);
    }
    else{
        if (min){
            // Asignación de valor mínimo los parámetros URL
            url_filter = removeParameter('to_s',window.location.href);
            url_filter = setGetParameter(url_filter,'from_s',min);
            
        }
        else{
            // Asignación de valor máximo en los parámetros URL
            url_filter = removeParameter('from_s',window.location.href);
            url_filter = setGetParameter(url_filter,'to_s',max);
        }
    }
    // Redireccionamiento de página
    window.location.href = url_filter;
}