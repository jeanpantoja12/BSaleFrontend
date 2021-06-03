document.addEventListener('DOMContentLoaded',()=>{
    // Obtención de parámetros URL
    let url_string = window.location.href;
    let url = new URL(url_string);
    // Parámetro de categoría
    let cat = url.searchParams.get("c");
    // Parámetro de orden de la lista
    let order = url.searchParams.get("order");
    // Validación de parámetro URL importante
    if(cat){
        // Instancia de cabecera de parámetros
        let headers = '';
        if(order){
            // Llenado de cabecera con datos de orden
            headers += `?order=${order}`;
            // Asignación de estilos para botón de Ordenar (establecer Active)
            if (order === 'asc'){
                document.querySelector('#more-price').classList.remove('active');
                document.querySelector('#less-price').classList.add('active');
            }
            else if(order === 'desc'){
                document.querySelector('#more-price').classList.add('active');
                document.querySelector('#less-price').classList.remove('active');
            }
        }
        // Llamar función de carga de datos por defecto en primera página 
        load_data(cat,1,headers)
        // Asignación de estilo CSS para filtros
        document.querySelector('#filter-container').style.display = 'none';
    }
        
    else
        window.location.href = '/';
});

// Función de carga de productos por categoría
function load_data(cat,num,headers){
    // Asignación de Título de la Categoría
    let title = cat
    title = title.charAt(0).toUpperCase() + title.slice(1);
    document.querySelector('#title-category').innerHTML = title;
    // Animación de carga
    let loader = '<div class="loader"></div>';
    document.querySelector('#loader-container').innerHTML = loader;
    
    // LLamado a API de búsqueda por categoría
    fetch(`https://bsaleacasoapi.herokuapp.com/categories_api/search/${cat}/${num}`+headers)
    .then(response => response.json())
    .then(responses =>{
        // Limpieza de contenedores HTML
        document.querySelector('#loader-container').innerHTML = '';
        // Validación de cantidad de resultados
        if(responses.results.length>0){
            
            // Asignación de estilos CSS para contenedor de filtro
            document.querySelector('#filter-container').style.display = 'block';
            // Asignación de URL para funciones de orden
            document.querySelector('#less-price').href = `?c=${cat}&order=asc`;
            document.querySelector('#more-price').href = `?c=${cat}&order=desc`;

            // Recorrido de datos
            responses.results.forEach(element => {

                // Creando elementos HTML para la lista de productos encontrados
                const container = document.createElement('div');
                const aref = document.createElement('a');
                const img = document.createElement('img');
                const title = document.createElement('p');
                const price_real = document.createElement('p');
                const price = document.createElement('p');
                const discount = document.createElement('p');

                // Añadiendo estilos CSS
                container.className = 'col-lg-3 col-md-4 shadow containers';
                container.style.marginBottom= '20px'
                aref.style.textDecoration= 'none';
                img.className = 'img-product-list';
                title.className = 'title-product-list';
                price.className = 'discount-list';
                price_real.className = 'discount-list';
                price.className = 'price-list';
                discount.className = 'discount-sale-list';

                // Apilando los elementos en sus contenedores
                aref.append(img);
                aref.append(title);
                aref.append(price_real);
                aref.append(price);
                
                // Llenando los elementos en el contenedor principal
                container.append(document.createElement('br'));
                container.append(aref);
                document.querySelector('#category-container').append(container);

                // Agregando datos del API
                // Validación de imagen vacía|null|undefined
                if (is_blank(element['img'])){  
                    img.src = 'https://i.ibb.co/5B5RbCz/Image-Not-Available.png';
                }
                else{
                    img.src = element['img'];
                }
                title.innerHTML = `${element['nombre']}`;
                price_real.innerHTML = `$. ${element['precio']}`;

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
                    aref.append(discount);
                    discount.innerHTML = `${discount_percentage}% OFF`;
                }

            });

            // Validación de paginación de datos (Si tiene siguiente página)
           if(responses['has_next'] === true){
               // Validación de botón de 'Cargar más'
                if(document.querySelector('#btnLoad')){
                    // Control de evento click en botón de 'Cargar más'
                    document.querySelector('#btnLoad').addEventListener('click',()=>{
                        // Asignar página siguiente para carga
                        let num_page = num+1;
                        load_data(cat,num_page,headers);
                    });
                    
                }
                else{
                    // Creando elementos HTML para botón 'cargar más'
                    const load_more = document.createElement('button');
                    // Añadiendo estilos CSS y atributos importantes
                    load_more.className = 'btn btn-light custom-buttom';
                    load_more.style.width = '100%';
                    load_more.id = 'btnLoad'
                    load_more.innerHTML = 'Cargar más';
                    // Llenado de elemento en contenedor de botón
                    document.querySelector('#button-container').append(load_more);
                    // Control de evento click en botón
                    load_more.addEventListener('click',()=>{
                        load_more.classList.remove('active');
                        // Asignar página siguiente para carga
                        let num_page = num+1;
                        load_data(cat,num_page,headers);
                    })
                }    
           }
           else{
               if(document.querySelector('#btnLoad')){
                   // Remover botón si ya no tiene más páginas
                   document.querySelector('#btnLoad').remove()
               }
           }
        }
        else{
            document.querySelector('#category-container').innerHTML = '<div class="col-md-12"><h3>No hay articulos en esta sección.</h3></div>';
        }        
    })
    .catch( e =>{
        document.querySelector('#category-container').innerHTML = '<div class="col-md-12"><h3>No hay articulos en esta sección.</h3></div>';
    });
    
}