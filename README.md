# API de Gestión de Restaurantes

Esta API permite gestionar Clientes, Restaurantes y Órdenes mediante operaciones CRUD. La API está construida con **NestJS** y utiliza **PostgreSQL** como base de datos. 

## Modelos Principales

### Client
- **Name**: Nombre del cliente.
- **Email**: Correo electrónico del cliente.
- **Phone**: Teléfono del cliente.
- **Age**: Edad del cliente.

### Restaurant
- **Name**: Nombre del restaurante.
- **Address**: Dirección del restaurante.
- **Capacity**: Capacidad de personas que el restaurante puede alojar.
- **Clients**: Lista de clientes asociados al restaurante.

### Order
- **Description**: Descripción de la orden.
- **Client**: Cliente asociado a la orden.
- **Restaurant**: Restaurante donde se realiza la orden.

## Configuración y Ejecución

### Paso 1: Configura las Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```plaintext
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=12345678
DB_DATABASE=restaurantdb
DB_SYNC=true
PORT=8080
```

## Paso 2: Ejecuta Docker Compose

### Para iniciar la API, PostgreSQL y pgAdmin, ejecuta el siguiente comando en la terminal:

```
docker-compose -f [docker-compose.yml](./docker-compose.yml) up --build
```
Este comando utiliza el archivo docker-compose.yml para construir y ejecutar los contenedores necesarios para la API y la base de datos.

### Servicios Expuestos

- **API**: http://localhost:${PORT}
- **pgAdmin**: http://localhost:8081

Endpoints Principales
La API expone los siguientes endpoints para gestionar Clientes, Restaurantes y Órdenes:

### Clientes
POST /clients: Crear un nuevo cliente.
GET /clients: Obtener la lista de clientes.
GET /clients/:id: Obtener un cliente por ID.
PATCH /clients/:id: Actualizar un cliente por ID.
DELETE /clients/:id: Eliminar un cliente por ID.

### Restaurantes
POST /restaurants: Crear un nuevo restaurante.
GET /restaurants: Obtener la lista de restaurantes.
GET /restaurants/:id: Obtener un restaurante por ID.
PATCH /restaurants/:id: Actualizar un restaurante por ID.
DELETE /restaurants/:id: Eliminar un restaurante por ID.

### Órdenes
POST /orders: Crear una nueva orden.
GET /orders: Obtener la lista de órdenes.