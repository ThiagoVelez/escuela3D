# EduCol 3D - Plataforma Educativa y de Gestión Escolar

Sistema integral de gestión académica, campus virtual y red social escolar para instituciones educativas. Desarrollado con React 18, Vite, Tailwind CSS, Node.js y MySQL.

---

## Tabla de Contenido

- [Descripcion General](#descripcion-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Modulos y Caracteristicas](#modulos-y-caracteristicas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalacion y Configuracion](#instalacion-y-configuracion)
- [Scripts Disponibles](#scripts-disponibles)
- [Base de Datos](#base-de-datos)
- [Variables de Entorno](#variables-de-entorno)
- [Licencia](#licencia)

---

## Descripcion General

EduCol 3D ofrece un entorno unificado para la comunidad educativa (rectores, coordinadores, docentes y estudiantes), integrando:

- Gestion academica completa: calificaciones, asistencias, horarios y evaluaciones.
- Red social escolar interactiva: publicaciones, reels, comentarios y guardado de contenidos por usuario.
- Sistema de mensajeria y chat en tiempo real con conteo automatico de mensajes no leidos.
- Visualizadores 3D y laboratorios interactivos integrados.
- Persistencia dual: soporte para base de datos MySQL y almacenamiento local en disco para alta disponibilidad.

---

## Arquitectura del Sistema

- **Frontend:** Single Page Application (SPA) construida con React 18 y Vite, estilizada con Tailwind CSS y componentes vectoriales de Lucide React.
- **Backend:** Servidor REST API en Node.js con Express, dotado de controladores modulares, soporte CORS y persistencia automatica en disco.
- **Base de Datos:** MySQL 8.0+ relacional con integridad referencial completa y disparadores (`database/schema.sql`).
- **Renderizado Grafico:** Integracion ligera mediante Three.js y React Three Fiber con enfoque en rendimiento optimizado y bajo consumo de recursos.

---

## Modulos y Caracteristicas

### 1. Autenticacion y Roles de Usuario
- Acceso diferenciado por perfiles: Rector, Coordinador, Administrador, Docente y Estudiante.
- Perfil institucional editable con actualizacion de avatar y banner.

### 2. Panel de Control y Dashboard
- Vista personalizada segun el rol del usuario autenticado.
- Estadisticas clave, horarios activos, tareas pendientes y resumen de rendimiento.

### 3. Red Social Escolar y Comunidad
- Feed de publicaciones multimedia con soporte de texto e imagenes.
- Seccion de Reels y videos cortos con interacciones y comentarios en vivo.
- Aislamiento estricto de elementos guardados por usuario en frontend y backend.
- Persistencia de interacciones en disco para retencion de datos tras reinicio del servidor.

### 4. Chat y Mensajeria Escolar
- Canales de comunicacion directa entre estudiantes y profesores.
- Marcador y contador automatico de mensajes no leidos por conversacion.

### 5. Gestion Academica y Calificaciones
- Libro de calificaciones detallado por periodos y asignaturas.
- Control y reporte de asistencia con vistas gerenciales para Rectoría.
- Constructor y visualizador interactivo de horarios semanales.

### 6. Tareas, Evaluaciones y Buzon Docente
- Carga de tareas y evidencias por parte de los estudiantes.
- Buzon de recepcion y calificacion de tareas para docentes con retroalimentacion.
- Creacion y ejecucion de evaluaciones en linea.

### 7. Institucional y Convivencia
- Arbol jerarquico institucional interactivo.
- Consulta y gestion administrativa del Manual de Convivencia.
- Escudo e identidad visual de la institucion.

---

## Estructura del Proyecto

```text
escuela/
├── database/
│   └── schema.sql                  # Esquema relacional de base de datos MySQL
├── public/                         # Recursos estaticos e imagenes
├── server/
│   ├── db.js                       # Conexion a base de datos MySQL
│   └── index.js                    # Servidor Express REST API y persistencia
├── src/
│   ├── components/                 # Componentes reutilizables (Navbar, Sidebar, Modales)
│   ├── context/                    # Contexto global de autenticacion (AuthContext)
│   ├── data/                       # Datos simulados e iniciales (mockData)
│   ├── pages/                      # Paginas y vistas de la aplicacion
│   ├── services/                   # Clientes de consumo de API (api.js, coursesService.js)
│   ├── utils/                      # Utilidades de descarga y sanitizacion de texto
│   ├── App.jsx                     # Enrutador y contenedor principal
│   ├── index.css                   # Estilos globales y directivas de Tailwind CSS
│   └── main.jsx                    # Punto de entrada de la aplicacion React
├── .env.example                    # Ejemplo de variables de entorno
├── AGENTS.md                       # Reglas permanentes del proyecto
├── package.json                    # Dependencias y scripts del proyecto
├── tailwind.config.js              # Configuracion de Tailwind CSS
└── vite.config.js                  # Configuracion del empaquetador Vite
```

---

## Requisitos Previos

- **Node.js:** Version 18.0.0 o superior instalada.
- **npm:** Version 9.0.0 o superior.
- **MySQL / MariaDB:** Servidor MySQL 8.0+ (opcional para funcionamiento completo con base de datos relacional).

---

## Instalacion y Configuracion

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ThiagoVelez/escuela3D.git
   cd escuela3D
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno:
   Copiar el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

4. Ajustar los parametros en `.env` segun la configuracion local (credenciales MySQL, puerto, etc.).

---

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo del cliente con Vite.
- `npm run server`: Inicia el servidor backend de Express en Node.js.
- `npm start`: Inicia concurrentemente el servidor backend y el cliente Vite.
- `npm run build`: Genera la compilacion optimizada para produccion en la carpeta `dist`.
- `npm run preview`: Previsualiza localmente el build de produccion.

---

## Base de Datos

Para inicializar la base de datos relacional en MySQL:

1. Iniciar el servicio local de MySQL.
2. Ejecutar el script SQL ubicado en `database/schema.sql`:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Verificar la conexion mediante las variables en el archivo `.env`.

---

## Variables de Entorno

| Variable | Descripcion | Valor Predeterminado |
|---|---|---|
| `PORT` | Puerto de ejecucion del servidor backend | `5000` |
| `DB_HOST` | Host de conexion a MySQL | `127.0.0.1` |
| `DB_PORT` | Puerto de conexion a MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contrasena de MySQL | (vacio) |
| `DB_NAME` | Nombre de la base de datos | `educol3d_db` |
| `VITE_API_URL` | URL base de la API REST para el cliente | `http://localhost:5000/api` |

---

## Licencia

Distribuido bajo la Licencia MIT.
