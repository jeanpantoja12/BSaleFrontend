document.addEventListener('DOMContentLoaded',()=>{
    // Carga de productos recientes
    load_recent();
});
// Función de carga de productos recientes
function load_recent(){
    // Animación de carga
    let loader = '<div class="loader"></div>';
    document.querySelector('#index-container').innerHTML = `<div class="col-md-2" style="margin:auto">${loader}</div>`;;
    // Llamado a API con fines demostrativos, llenado de datos para index
    fetch('https://bsaleacasoapi.herokuapp.com/search_api?page=1')
    .then(response => response.json())
    .then(responses =>{
        // Limpieza de HTML de carga
        document.querySelector('#index-container').innerHTML = '';
        // Recorrido de datos
        responses.results.forEach(element => {
            // Creando elementos HTML para la lista de productos
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
            container.append(document.createElement('br'));
            container.append(aref);

            // Llenando los elementos en el contenedor principal
            document.querySelector('#index-container').append(container);

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

            // Validación de descuentos y porcentajes
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
    })
}