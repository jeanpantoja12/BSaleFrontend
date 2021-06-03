# BSaleFrontend

## Descripción
Tienda online realizada en Django Framework (API Backend) y Javascript (Vanilla) con consumo de datos brindados por la empresa BSale.

 ## Organización
Para el frontend del proyecto, se toman diferentes carpetas organizadas:

- Static
    - category.js : Contiene todos los métodos utilizados para la vista de categorías, llamadas al API Category Seach, manejo de parámetros y orden de productos.
    - index.js: Contiene todos los métodos utilizados para la vista de categorías, llamadas al API Search con fines demostrativos.
    - general.js: Contiene todos los métodos utilizados por el layout de la página, llamadas al API Categories y asignación de métodos globales como el de calcular descuentos.
    - search.js: Contiene todos los métodos utilizados para la vista de búsquedas, llamadas al API Seach, manejo de parámetros, manejo de paginación, manejo de filtros y de orden.
    - layout.js : Contiene la carga de vistas de navbar y footer mediante jquery.
    - styles.css : Contiene todos los estilos utilizados para la creación de la aplicación y elementos de animación.
- HTML's
    - category.html: Contiene todos los elementos HTML para mostrar la página de cada categoría usando Bootstrap 4, Fontawesome Icons y hojas CSS.
    - index.html: Contiene todos los elementos HTML para mostrar la página del index usando Bootstrap 4, Fontawesome Icons y hojas CSS.
    - search.html: Contiene todos los elementos HTML para mostrar la página de cada búsqueda usando Bootstrap 4, Fontawesome Icons y hojas CSS.
    - nav.html: Contiene todos los elementos HTML para mostrar la sección navbar del proyecto.
    - footer.html: Contiene todos los elementos HTML para mostrar la sección footer del proyecto.