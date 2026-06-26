const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const Quiz = require('../models/Quiz');
const Project = require('../models/Project');
const Mission = require('../models/Mission');
const Achievement = require('../models/Achievement');
const InventoryItem = require('../models/InventoryItem');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lyracode';

const courses = [
  {
    slug: 'html',
    name: 'HTML',
    description: 'Aprende a estructurar tus páginas web utilizando etiquetas, elementos multimedia y formularios.',
    icon: 'GRASS_BLOCK.png',
    banner: 'forest_banner',
    color: '#e28743',
    difficulty: 'Principiante',
    order: 1
  },
  {
    slug: 'css',
    name: 'CSS',
    description: 'Estiliza tus páginas web con colores, layouts, animaciones y diseño responsivo.',
    icon: 'BLUE_ICE.png',
    banner: 'ice_banner',
    color: '#67e8f9',
    difficulty: 'Principiante',
    order: 2
  },
  {
    slug: 'js',
    name: 'JavaScript',
    description: 'Dale vida a tus proyectos con interactividad, lógica de programación y manipulación del DOM.',
    icon: 'CAMPFIRE.png',
    banner: 'redstone_banner',
    color: '#dc2626',
    difficulty: 'Intermedio',
    order: 3
  },
  {
    slug: 'react',
    name: 'React',
    description: 'Construye interfaces de usuario interactivas basadas en componentes reutilizables.',
    icon: 'DIAMOND_BLOCK.png',
    banner: 'diamond_banner',
    color: '#57c8ff',
    difficulty: 'Intermedio',
    order: 4
  },
  {
    slug: 'node',
    name: 'Node.js',
    description: 'Crea servidores backend rápidos y escalables usando JavaScript en el servidor.',
    icon: 'SLIME_BLOCK.png',
    banner: 'slime_banner',
    color: '#22c55e',
    difficulty: 'Avanzado',
    order: 5
  },
  {
    slug: 'mongodb',
    name: 'MongoDB',
    description: 'Almacena tus datos en una base de datos NoSQL moderna utilizando colecciones.',
    icon: 'EMERALD.png',
    banner: 'emerald_banner',
    color: '#10b981',
    difficulty: 'Avanzado',
    order: 6
  },
  {
    slug: 'express',
    name: 'Express.js',
    description: 'Construye APIs REST y maneja rutas del servidor eficientemente.',
    icon: 'STONE.png',
    banner: 'stone_banner',
    color: '#f59e0b',
    difficulty: 'Avanzado',
    order: 7
  },
  {
    slug: 'api',
    name: 'API REST',
    description: 'Diseña y consume servicios web robustos siguiendo la arquitectura REST.',
    icon: 'CRAFTING_TABLE.png',
    banner: 'api_banner',
    color: '#8b5cf6',
    difficulty: 'Avanzado',
    order: 8
  },
  {
    slug: 'proyecto',
    name: 'Proyecto Final',
    description: 'Pon a prueba todos tus conocimientos y construye una aplicación web full-stack completa.',
    icon: 'END_PORTAL_FRAME.png',
    banner: 'end_banner',
    color: '#ec4899',
    difficulty: 'Avanzado',
    order: 9
  }
];

const lessons = [
  // --- HTML Course ---
  {
    courseSlug: 'html',
    lessonNumber: 1,
    title: '1. Introducción a HTML',
    description: 'Aprende qué es HTML y cómo se usa para crear páginas web.',
    content: '<p>HTML (HyperText Markup Language) es el lenguaje de marcado estándar para crear páginas web. Describe la estructura de una página web semánticamente y le indica al navegador cómo mostrar el contenido.</p><p>En Minecraft, HTML es como los bloques de cimientos: define dónde van las paredes, las puertas y los techos antes de decorarlos con CSS.</p>',
    conceptToLearn: 'Estructura general y propósito del lenguaje HTML.',
    exampleCode: '<!-- Esto es un comentario en HTML -->\n<h1>Hola, LyraCoder!</h1>\n<p>Esta es mi primera página web.</p>',
    tip: 'HTML no es un lenguaje de programación, es un lenguaje de marcado de hipertexto.',
    imageKey: 'steve_reading',
    rewardXp: 50
  },
  {
    courseSlug: 'html',
    lessonNumber: 2,
    title: '2. Estructura básica',
    description: 'Aprende los elementos fundamentales de un documento HTML.',
    content: '<p>Todo documento HTML válido debe tener una estructura específica que incluye el tipo de documento, la etiqueta html, el encabezado head (para metadatos) y el cuerpo body (para el contenido visible).</p>',
    conceptToLearn: 'Uso de <!DOCTYPE html>, <html>, <head>, <title>, y <body>.',
    exampleCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Mi Aventura</title>\n</head>\n<body>\n  <h1>Bienvenido al mundo</h1>\n</body>\n</html>',
    tip: 'Todo el contenido visible de tu página web debe ir dentro de la etiqueta <body>.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'html',
    lessonNumber: 3,
    title: '3. Etiquetas de texto',
    description: 'Conoce los encabezados y párrafos para organizar la información.',
    content: '<p>Los encabezados (h1 a h6) se utilizan para definir títulos e importancia jerárquica del contenido. Los párrafos (p) se usan para bloques de texto regulares.</p>',
    conceptToLearn: 'Jerarquía de títulos (<h1> a <h6>) y párrafos (<p>).',
    exampleCode: '<h1>Título Principal</h1>\n<h2>Subtítulo de sección</h2>\n<p>Este es un texto explicativo sobre mi mina de diamantes.</p>',
    tip: 'Usa una sola etiqueta <h1> por página para mejorar el SEO.',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- CSS Course ---
  {
    courseSlug: 'css',
    lessonNumber: 1,
    title: '1. Introducción a CSS',
    description: 'Aprende qué es CSS y cómo se utiliza para dar estilo a tus bloques web.',
    content: '<p>CSS (Cascading Style Sheets) es el lenguaje de diseño gráfico para definir y crear la presentación de un documento estructurado escrito en HTML.</p><p>En Minecraft, CSS es como los tintes de colores y bloques decorativos (lana teñida, terracota vidriada) que embellecen las paredes aburridas de piedra.</p>',
    conceptToLearn: 'Conceptos básicos de presentación y estilo en la web.',
    exampleCode: 'body {\n  background-color: #050a12;\n  color: #ffffff;\n}',
    tip: 'CSS separa el contenido (HTML) de la presentación visual.',
    imageKey: 'sign',
    rewardXp: 50
  },
  {
    courseSlug: 'css',
    lessonNumber: 2,
    title: '2. Selectores y Colores',
    description: 'Aprende a apuntar a elementos específicos de tu código y pintarlos.',
    content: '<p>Los selectores CSS se usan para buscar o seleccionar los elementos HTML a los que quieres aplicar estilo. Los colores se pueden definir por nombres, hexadecimales o formato RGB.</p>',
    conceptToLearn: 'Uso de selectores de clase (.), ID (#) y el elemento body.',
    exampleCode: '.caja-tesoro {\n  color: #ffd700;\n  border: 1px solid #1b2d3d;\n}',
    tip: 'Las clases se seleccionan con un punto (.) y los IDs con un signo de número (#).',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'css',
    lessonNumber: 3,
    title: '3. El Modelo de Caja',
    description: 'Aprende sobre márgenes, bordes, rellenos y el tamaño de tus bloques.',
    content: '<p>En CSS, cada elemento se representa como una caja rectangular. El modelo de caja (Box Model) describe el espacio que ocupa un elemento con cuatro capas: contenido, padding (relleno interno), border (borde) y margin (margen externo).</p><p>Es como colocar un bloque de construcción: el bloque tiene su tamaño físico (contenido), el grosor de sus paredes (borde), el espacio de seguridad a su alrededor (margen) y el espacio interior para guardar cosas (relleno).</p>',
    conceptToLearn: 'Comportamiento y capas del CSS Box Model.',
    exampleCode: '.cofre {\n  width: 200px;\n  padding: 10px;\n  border: 4px solid #8b5a2b;\n  margin: 20px;\n}',
    tip: 'Usa box-sizing: border-box para incluir el padding y el borde en el ancho total del elemento.',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- JavaScript Course ---
  {
    courseSlug: 'js',
    lessonNumber: 1,
    title: '1. Variables y Constantes',
    description: 'Aprende a almacenar información del inventario en memoria.',
    content: '<p>Las variables en programación son espacios de almacenamiento que nos permiten retener información reutilizable. En JavaScript declaramos variables utilizando let y const.</p><p>Es como un cofre de almacenamiento: let crea un cofre cuyo contenido puedes cambiar, y const crea un cofre sellado de redstone inalterable.</p>',
    conceptToLearn: 'Uso de let, const y tipos de datos primitivos en JS.',
    exampleCode: 'let mineral = "diamante";\nconst cantidad = 64;',
    tip: 'Utiliza siempre const a menos que sepas que el valor de la variable cambiará.',
    imageKey: 'steve_reading',
    rewardXp: 50
  },
  {
    courseSlug: 'js',
    lessonNumber: 2,
    title: '2. Estructuras Condicionales',
    description: 'Aprende a tomar decisiones lógicas en tu código.',
    content: '<p>Las estructuras condicionales (if/else) evalúan si una condición es verdadera o falsa antes de ejecutar un bloque de código específico.</p><p>Imagina que es como un repetidor de redstone: si el circuito tiene señal, activa el pistón; de lo contrario, permanece inactivo.</p>',
    conceptToLearn: 'Controlar el flujo de ejecución usando if, else if, else.',
    exampleCode: 'if (tengoPicoDiamante) {\n  picarObsidiana();\n} else {\n  picarPiedra();\n}',
    tip: 'Usa operadores de comparación como === y !== para asegurar la exactitud de los valores.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'js',
    lessonNumber: 3,
    title: '3. Funciones de Crafteo',
    description: 'Aprende a declarar y ejecutar funciones para automatizar tareas repetitivas.',
    content: '<p>Una función es un bloque de código diseñado para realizar una tarea específica. Se ejecuta cuando "algo" la invoca o la llama.</p><p>Es como una mesa de crafteo automatizada: le pasas los ingredientes (parámetros), procesa la receta interna y te devuelve el producto terminado (valor de retorno).</p>',
    conceptToLearn: 'Declaración de funciones, parámetros y la palabra clave return.',
    exampleCode: 'function craftearPico(madera, piedra) {\n  return "Pico de Piedra";\n}',
    tip: 'Las funciones de flecha (=>) son una alternativa moderna y corta para escribir funciones en JS.',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- React Course ---
  {
    courseSlug: 'react',
    lessonNumber: 1,
    title: '1. Componentes Reutilizables',
    description: 'Aprende a estructurar tus interfaces con componentes.',
    content: '<p>React se basa en Componentes. Un componente es una parte independiente y reutilizable de la interfaz de usuario.</p><p>En Minecraft, un componente es como un plano de crafteo para una valla o puerta: crafteas el componente una vez y lo colocas múltiples veces en tu castillo.</p>',
    conceptToLearn: 'Declaración de componentes funcionales y sintaxis JSX.',
    exampleCode: 'function Mina() {\n  return <div>Mina de Oro</div>;\n}',
    tip: 'JSX permite escribir código HTML directamente dentro de JavaScript en React.',
    imageKey: 'sign',
    rewardXp: 50
  },
  {
    courseSlug: 'react',
    lessonNumber: 2,
    title: '2. Props y Configuración',
    description: 'Aprende a pasar parámetros a tus componentes.',
    content: '<p>Las Props (propiedades) permiten enviar datos de un componente padre a un componente hijo para personalizar su comportamiento y apariencia.</p>',
    conceptToLearn: 'Pasar y leer props en componentes de React.',
    exampleCode: '<BloqueMineral tipo="diamante" cantidad={64} />',
    tip: 'Las props son de solo lectura; los componentes hijos no deben modificarlas directamente.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'react',
    lessonNumber: 3,
    title: '3. Estado y useState',
    description: 'Aprende a manejar datos dinámicos que cambian con la interacción del usuario.',
    content: '<p>El estado (State) en React representa los datos dinámicos de un componente. Cuando el estado cambia, React vuelve a renderizar el componente de forma automática para actualizar la pantalla.</p><p>Imagina que es el contador de corazones de tu personaje: cuando recibes daño, el estado de salud disminuye y la interfaz se actualiza al instante mostrando menos corazones.</p>',
    conceptToLearn: 'Uso del hook useState para declarar y actualizar estados.',
    exampleCode: 'const [vida, setVida] = useState(10);',
    tip: 'Nunca modifiques el estado directamente; siempre utiliza la función actualizadora de useState.',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- Node.js Course ---
  {
    courseSlug: 'node',
    lessonNumber: 1,
    title: '1. Introducción a Node.js',
    description: 'Aprende a ejecutar JavaScript directamente en el servidor.',
    content: '<p>Node.js es un entorno de ejecución para JavaScript construido con el motor de Chrome. Permite crear servidores backend rápidos, escalables e interactivos.</p><p>Es el motor lógico que ejecuta y coordina las reglas de un servidor multijugador en segundo plano.</p>',
    conceptToLearn: 'El bucle de eventos y la ejecución de Node en la consola.',
    exampleCode: 'console.log("Inicializando Servidor...");',
    tip: 'Node permite usar JavaScript para controlar bases de datos y archivos locales.',
    imageKey: 'steve_reading',
    rewardXp: 50
  },
  {
    courseSlug: 'node',
    lessonNumber: 2,
    title: '2. Gestión de paquetes con NPM',
    description: 'Aprende a importar librerías y mods externos en tu proyecto backend.',
    content: '<p>NPM (Node Package Manager) es el registro de software más grande del mundo. Permite instalar dependencias creadas por la comunidad para expandir tu servidor.</p>',
    conceptToLearn: 'Uso de package.json, npm install y dependencias.',
    exampleCode: 'npm install express mongoose dotenv',
    tip: 'package.json almacena la lista de dependencias y versiones de tu proyecto.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'node',
    lessonNumber: 3,
    title: '3. Módulo File System (fs)',
    description: 'Aprende a leer y escribir archivos en el sistema local desde tu servidor.',
    content: '<p>El módulo fs (File System) de Node.js proporciona una API para interactuar con el sistema de archivos del sistema operativo.</p><p>Es como escribir tus aventuras en un Libro Pluma (Book and Quill) dentro del juego y guardarlo en un cofre físico en el disco duro.</p>',
    conceptToLearn: 'Uso de fs.readFile y fs.writeFile para persistencia básica.',
    exampleCode: 'const fs = require("fs");\nfs.writeFileSync("coordenadas.txt", "X: 100, Y: 64, Z: -250");',
    tip: 'Prefiere las versiones asíncronas de los métodos de fs para evitar bloquear el bucle de eventos del servidor.',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- MongoDB Course ---
  {
    courseSlug: 'mongodb',
    lessonNumber: 1,
    title: '1. Documentos y Colecciones',
    description: 'Aprende las bases de una base de datos NoSQL basada en documentos.',
    content: '<p>MongoDB almacena la información como documentos de tipo BSON (similares a objetos JSON), los cuales son agrupados en Colecciones.</p><p>Imagina que es un baúl gigante: cada item del inventario es un documento JSON del inventario detallado con sus propiedades únicas.</p>',
    conceptToLearn: 'Estructurar datos en formato JSON/BSON.',
    exampleCode: '{\n  "mineral": "diamante",\n  "cantidad": 64,\n  "encantado": true\n}',
    tip: 'NoSQL ofrece esquemas dinámicos, lo que permite almacenar documentos con diferentes campos en la misma colección.',
    imageKey: 'sign',
    rewardXp: 50
  },
  {
    courseSlug: 'mongodb',
    lessonNumber: 2,
    title: '2. Consultas CRUD básicas',
    description: 'Aprende a buscar, insertar, actualizar y eliminar datos.',
    content: '<p>CRUD es el acrónimo de Crear, Leer, Actualizar y Borrar. Representa las cuatro operaciones fundamentales de cualquier base de datos.</p>',
    conceptToLearn: 'Uso de find, insertOne, updateOne y deleteOne.',
    exampleCode: 'db.inventario.find({ mineral: "diamante" });',
    tip: 'Las consultas son eficientes cuando se definen índices sobre los campos de búsqueda frecuentes.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'mongodb',
    lessonNumber: 3,
    title: '3. Modelado con Mongoose',
    description: 'Aprende a conectar MongoDB con Node.js y definir esquemas rígidos de datos.',
    content: '<p>Mongoose es una biblioteca de modelado de objetos (ODM) para MongoDB y Node.js. Proporciona una solución basada en esquemas para modelar los datos de tu aplicación.</p><p>Es como una plantilla de encantamientos: define exactamente qué propiedades y tipos de datos (número, texto, booleano) puede tener cada objeto de tu inventario.</p>',
    conceptToLearn: 'Crear esquemas (Schema) y modelos con Mongoose.',
    exampleCode: 'const bloqueSchema = new mongoose.Schema({\n  tipo: String,\n  dureza: Number\n});',
    tip: 'Los esquemas permiten definir reglas de validación básicas para asegurar la integridad de la base de datos.',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- Express.js Course ---
  {
    courseSlug: 'express',
    lessonNumber: 1,
    title: '1. Ruteo básico en Express',
    description: 'Aprende a crear endpoints HTTP para tus aplicaciones.',
    content: '<p>Express.js es un framework minimalista y flexible para Node.js que proporciona un conjunto robusto de características para aplicaciones web y móviles.</p><p>Es el sistema de vías de tren de redstone que dirige a cada vagoneta (solicitud HTTP) hacia su estación correspondiente.</p>',
    conceptToLearn: 'Declarar rutas con GET, POST y enviar respuestas JSON.',
    exampleCode: 'const app = express();',
    tip: 'Express simplifica la configuración de servidores HTTP nativos de Node.',
    imageKey: 'steve_reading',
    rewardXp: 50
  },
  {
    courseSlug: 'express',
    lessonNumber: 2,
    title: '2. Middlewares',
    description: 'Aprende a inspeccionar y transformar solicitudes en el servidor.',
    content: '<p>Los middlewares son funciones que tienen acceso al objeto de solicitud (req), al objeto de respuesta (res) y a la siguiente función de middleware en el ciclo de solicitud-respuesta.</p>',
    conceptToLearn: 'Flujo de ejecución de middlewares y validación de sesiones.',
    exampleCode: 'app.use(express.json()); // middleware de parseo',
    tip: 'Los middlewares son útiles para registrar bitácoras (logging) y verificar autorizaciones.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'express',
    lessonNumber: 3,
    title: '3. Parámetros de Ruta (Params)',
    description: 'Aprende a capturar valores variables en la URL de tu endpoint.',
    content: '<p>Los parámetros de ruta son segmentos de la URL que se utilizan para capturar valores dinámicos. En Express se definen precedidos por dos puntos (:).</p><p>Es como buscar un cofre específico por su ID único en la red de transportes: /cofre/:id capturará el identificador del cofre que deseas abrir.</p>',
    conceptToLearn: 'Uso de req.params para recuperar identificadores de la URL.',
    exampleCode: 'app.get("/cofre/:id", (req, res) => {\n  const cofreId = req.params.id;\n  res.send(`Abriendo cofre ${cofreId}`);\n});',
    tip: 'Todos los parámetros capturados en req.params se reciben en formato de texto (string).',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- API REST Course ---
  {
    courseSlug: 'api',
    lessonNumber: 1,
    title: '1. Métodos y Verbos HTTP',
    description: 'Aprende a hacer llamadas RESTful desde el navegador.',
    content: '<p>REST (Representational State Transfer) es un estilo de arquitectura de software para sistemas hipermedia distribuidos como la World Wide Web.</p><p>Es el sistema de correo de la aldea: GET lee cartas, POST envía paquetes nuevos, PUT actualiza la carga del caballo, y DELETE destruye cartas viejas.</p>',
    conceptToLearn: 'Uso correcto de GET, POST, PUT, DELETE y llamadas fetch.',
    exampleCode: 'fetch("/api/inventario")',
    tip: 'Las APIs REST deben usar URLs descriptivas y orientadas a recursos en plural.',
    imageKey: 'sign',
    rewardXp: 50
  },
  {
    courseSlug: 'api',
    lessonNumber: 2,
    title: '2. Códigos de Estado HTTP',
    description: 'Aprende a interpretar las respuestas de un servidor.',
    content: '<p>Los códigos de estado de respuesta HTTP indican si una solicitud HTTP específica se ha completado con éxito. Se agrupan en cinco clases: informativos, éxito, redirección, error del cliente y del servidor.</p>',
    conceptToLearn: 'Entender códigos comunes como 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found y 500 Server Error.',
    exampleCode: 'res.status(404).json({ msg: "Mineral no encontrado en la mina" });',
    tip: 'El código 200 significa éxito y el 404 indica que el recurso solicitado no existe.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'api',
    lessonNumber: 3,
    title: '3. Buenas Prácticas y CORS',
    description: 'Aprende a estructurar tus endpoints y permitir peticiones desde dominios externos.',
    content: '<p>CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad del navegador que restringe las peticiones HTTP originadas desde un dominio diferente.</p><p>Es como el portal de tu castillo: por defecto está cerrado para extraños, pero puedes configurar CORS para permitir que visitantes de aldeas amigas (dominios autorizados) crucen la frontera.</p>',
    conceptToLearn: 'Concepto de CORS, configuración en servidores y convenciones de rutas API.',
    exampleCode: 'const cors = require("cors");\napp.use(cors()); // Permite peticiones de cualquier origen',
    tip: 'En entornos de producción, configura CORS detalladamente permitiendo únicamente los dominios de confianza.',
    imageKey: 'sign',
    rewardXp: 50
  },

  // --- Proyecto Final Course ---
  {
    courseSlug: 'proyecto',
    lessonNumber: 1,
    title: '1. Integración de Componentes',
    description: 'Une todos tus conocimientos para construir tu fortaleza fullstack.',
    content: '<p>La integración final consiste en comunicar tu frontend de React con el backend de Node/Express y persistir los datos de manera segura en tu base de datos MongoDB.</p><p>Es el momento de encender el portal del End uniendo todos los ojos de Ender en su marco correspondiente.</p>',
    conceptToLearn: 'Acceder a variables de entorno en el puerto mediante process.env.',
    exampleCode: 'const puerto = process.env.PORT;',
    tip: 'Utiliza variables de entorno para manejar las direcciones y credenciales de tus servidores.',
    imageKey: 'steve_reading',
    rewardXp: 50
  },
  {
    courseSlug: 'proyecto',
    lessonNumber: 2,
    title: '2. Despliegue de tu Servidor',
    description: 'Aprende a compartir tu aplicación con todo el mundo.',
    content: '<p>El despliegue (deployment) es el proceso de publicar tu aplicación en un servidor en la nube para que sea accesible públicamente en internet.</p>',
    conceptToLearn: 'Conceptos de hosting web, bases de datos en la nube y configuración DNS.',
    exampleCode: 'npm run build',
    tip: 'Asegúrate de remover logs confidenciales y claves API antes de desplegar tu código a producción.',
    imageKey: 'enchanting_table',
    rewardXp: 50
  },
  {
    courseSlug: 'proyecto',
    lessonNumber: 3,
    title: '3. Seguridad y Tokens JWT',
    description: 'Aprende a proteger tus rutas mediante tokens de autenticación firmados.',
    content: '<p>JSON Web Token (JWT) es un estándar abierto para transmitir de forma segura información entre partes como un objeto JSON. Se utiliza para la autenticación de usuarios.</p><p>Es como un Pase de Entrada firmado por el rey: cuando inicias sesión con éxito, recibes este pase cifrado y debes presentarlo en cada puerta protegida para poder pasar.</p>',
    conceptToLearn: 'Generación, firma y verificación de tokens JWT.',
    exampleCode: 'const jwt = require("jsonwebtoken");\nconst token = jwt.sign({ userId: 123 }, "mi_secreto_redstone");',
    tip: 'Nunca guardes información confidencial como contraseñas dentro de la carga útil (payload) de un JWT.',
    imageKey: 'sign',
    rewardXp: 50
  }
];

const exercises = [
  // --- HTML Exercises ---
  {
    courseSlug: 'html',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Tu primer título',
    instructions: 'Escribe una etiqueta `<h1>` que contenga el texto "Hola, LyraCode" para crear el título principal de tu aventura.',
    initialCode: '<!-- Escribe tu código aquí -->\n',
    validationRules: [
      {
        selector: 'h1',
        containsText: 'Hola, LyraCode',
        errorMsg: 'Debes incluir una etiqueta <h1> con el texto exacto "Hola, LyraCode"'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- CSS Exercises ---
  {
    courseSlug: 'css',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Pintando el fondo',
    instructions: 'Escribe una regla CSS para aplicar un color de fondo `#050a12` y color de texto `#ffffff` en la etiqueta `body`.',
    initialCode: '/* Escribe tu regla CSS aquí */\n',
    validationRules: [
      {
        regexMatch: 'body\\s*\\{[^\\}]*background-color\\s*:\\s*#050a12',
        errorMsg: 'Debes configurar background-color: #050a12 en tu regla de body.'
      },
      {
        regexMatch: 'body\\s*\\{[^\\}]*color\\s*:\\s*#ffffff',
        errorMsg: 'Debes configurar color: #ffffff en tu regla de body.'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- JavaScript Exercises ---
  {
    courseSlug: 'js',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Declarando variables',
    instructions: 'Declara una variable llamada `let mineral = "diamante";` y una constante llamada `const cantidad = 64;`.',
    initialCode: '// Declara tus variables aquí\n',
    validationRules: [
      {
        regexMatch: 'let\\s+mineral\\s*=\\s*["\']diamante["\']',
        errorMsg: 'Debes declarar la variable mineral utilizando let y asignarle "diamante".'
      },
      {
        regexMatch: 'const\\s+cantidad\\s*=\\s*64',
        errorMsg: 'Debes declarar la constante cantidad utilizando const y asignarle 64.'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- React Exercises ---
  {
    courseSlug: 'react',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Tu primer componente',
    instructions: 'Crea un componente funcional en React llamado `Mina` que retorne un div con el texto "Mina de Oro".',
    initialCode: 'function Mina() {\n  // Retorna el JSX solicitado aquí\n}',
    validationRules: [
      {
        regexMatch: 'return\\s*\\(\\s*<div\\s*>Mina de Oro</div>\\s*\\)|return\\s*<div\\s*>Mina de Oro</div>',
        errorMsg: 'El componente Mina debe retornar <div>Mina de Oro</div>.'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- Node.js Exercises ---
  {
    courseSlug: 'node',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Hola Node',
    instructions: 'Utiliza `console.log` para imprimir en consola la frase "Inicializando Servidor...".',
    initialCode: '// Escribe tu log aquí\n',
    validationRules: [
      {
        regexMatch: 'console\\.log\\(\\s*["\']Inicializando Servidor\\.\\.\\.["\']\\s*\\)',
        errorMsg: 'Debes llamar console.log con el argumento "Inicializando Servidor...".'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- MongoDB Exercises ---
  {
    courseSlug: 'mongodb',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Consultar Diamantes',
    instructions: 'Escribe una consulta de MongoDB utilizando `find` para buscar todos los documentos de la colección donde el campo `mineral` sea `"diamante"`.',
    initialCode: 'db.inventario.find({ /* Tu filtro aquí */ });',
    validationRules: [
      {
        regexMatch: 'db\\.inventario\\.find\\(\\s*\\{\\s*mineral\\s*:\\s*["\']diamante["\']\\s*\\}\\s*\\)',
        errorMsg: 'Debes buscar los documentos con { mineral: "diamante" }.'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- Express.js Exercises ---
  {
    courseSlug: 'express',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Servidor Básico',
    instructions: 'Crea una aplicación de Express declarando una constante llamada `app` y asignándole la ejecución de la función `express()`.',
    initialCode: 'const express = require("express");\n// Declara tu variable app aquí\n',
    validationRules: [
      {
        regexMatch: 'const\\s+app\\s*=\\s*express\\(\\)',
        errorMsg: 'Debes declarar const app = express();'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- API REST Exercises ---
  {
    courseSlug: 'api',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Llamar API',
    instructions: 'Utiliza la función `fetch` global para hacer una llamada HTTP de red por defecto a la dirección `"/api/inventario"`.',
    initialCode: '// Escribe tu fetch aquí\n',
    validationRules: [
      {
        regexMatch: 'fetch\\(\\s*["\']/api/inventario["\']\\s*\\)',
        errorMsg: 'Debes ejecutar fetch con la ruta "/api/inventario".'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  },

  // --- Proyecto Final Exercises ---
  {
    courseSlug: 'proyecto',
    lessonNumber: 1,
    exerciseNumber: 1,
    title: 'Variables de Entorno',
    instructions: 'Accede a la variable de entorno de Node llamada `PORT` usando `process.env` y guárdala en una constante llamada `puerto`.',
    initialCode: '// Declara tu constante aquí\n',
    validationRules: [
      {
        regexMatch: 'const\\s+puerto\\s*=\\s*process\\.env\\.PORT',
        errorMsg: 'Debes guardar process.env.PORT en una constante puerto.'
      }
    ],
    rewardXp: 100,
    rewardCoins: 15
  }
];

const quizzes = [
  // HTML Quiz
  {
    courseSlug: 'html',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: Introducción a HTML',
    questions: [
      {
        questionText: '¿Qué significa la sigla HTML?',
        type: 'multiple',
        options: [
          'HyperText Markup Language',
          'HighText Machine Learning',
          'Hyper Transfer Markup Language',
          'How To Make Links'
        ],
        correctAnswer: 'HyperText Markup Language',
        explanation: 'HTML significa HyperText Markup Language. Es el lenguaje de marcado estándar para definir la estructura de las páginas web.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },

  // CSS Quiz
  {
    courseSlug: 'css',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: Estilo y CSS',
    questions: [
      {
        questionText: '¿Cómo se selecciona un elemento con la clase "carta" en CSS?',
        type: 'multiple',
        options: ['.carta', '#carta', 'carta', '*carta'],
        correctAnswer: '.carta',
        explanation: 'Las clases se apuntan utilizando un punto antes del identificador.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },

  // JS Quiz
  {
    courseSlug: 'js',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: JavaScript Lógico',
    questions: [
      {
        questionText: '¿Qué palabra reservada declara una variable que no puede reasignarse?',
        type: 'multiple',
        options: ['const', 'let', 'var', 'def'],
        correctAnswer: 'const',
        explanation: 'Las constantes declaradas con const crean una referencia de solo lectura.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },

  // React Quiz
  {
    courseSlug: 'react',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: React UI',
    questions: [
      {
        questionText: '¿Qué extensión sintáctica permite mezclar JS con etiquetas tipo HTML?',
        type: 'multiple',
        options: ['JSX', 'HTML+', 'ReactScript', 'XMLS'],
        correctAnswer: 'JSX',
        explanation: 'JSX es JavaScript XML.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },
  // Node Quiz
  {
    courseSlug: 'node',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: Servidor Node',
    questions: [
      {
        questionText: '¿Qué herramienta administra e instala dependencias externas en Node?',
        type: 'multiple',
        options: ['NPM', 'NodeAdmin', 'Git', 'Pip'],
        correctAnswer: 'NPM',
        explanation: 'NPM es el gestor de paquetes por defecto para la plataforma JavaScript Node.js.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },

  // MongoDB Quiz
  {
    courseSlug: 'mongodb',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: MongoDB NoSQL',
    questions: [
      {
        questionText: '¿Cómo se agrupan los documentos en una base de datos MongoDB?',
        type: 'multiple',
        options: ['Colecciones', 'Tablas', 'Filas', 'Esquemas'],
        correctAnswer: 'Colecciones',
        explanation: 'MongoDB agrupa sus documentos dinámicos en colecciones lógicas.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },

  // Express Quiz
  {
    courseSlug: 'express',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: Ruteo Express',
    questions: [
      {
        questionText: '¿Qué método declara rutas de lectura de recursos en Express?',
        type: 'multiple',
        options: ['app.get', 'app.post', 'app.put', 'app.delete'],
        correctAnswer: 'app.get',
        explanation: 'El método GET del protocolo HTTP se vincula en Express con app.get para lecturas.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },

  // API Quiz
  {
    courseSlug: 'api',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: RESTful API',
    questions: [
      {
        questionText: '¿Qué código de estado HTTP representa un recurso no encontrado?',
        type: 'multiple',
        options: ['404', '200', '500', '401'],
        correctAnswer: '404',
        explanation: '404 Not Found indica que el recurso solicitado no existe en el servidor.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  },

  // Proyecto Quiz
  {
    courseSlug: 'proyecto',
    lessonNumber: 1,
    quizNumber: 1,
    title: 'Quiz: Fullstack final',
    questions: [
      {
        questionText: '¿Cómo se debe conectar el frontend con el backend?',
        type: 'multiple',
        options: ['Mediante peticiones HTTP (API/REST)', 'Mediante consultas directas SQL', 'Por conexión de hardware', 'No se deben conectar'],
        correctAnswer: 'Mediante peticiones HTTP (API/REST)',
        explanation: 'La arquitectura desacoplada se comunica por medio de llamadas a endpoints HTTP.'
      }
    ],
    rewardXp: 150,
    rewardCoins: 20
  }
];

const projects = [
  {
    courseSlug: 'html',
    title: 'Mi primera página web',
    description: 'Crea una página completa aplicando todo lo aprendido en este curso. Debe incluir títulos, párrafos, un enlace a Google y una lista de tus pasatiempos.',
    requirements: [
      {
        id: 'req_title',
        description: 'Debe contener un título <h1> principal.',
        selector: 'h1'
      },
      {
        id: 'req_p',
        description: 'Debe tener un párrafo descriptivo sobre ti.',
        selector: 'p'
      },
      {
        id: 'req_link',
        description: 'Debe contener un enlace <a> que dirija a Google.',
        selector: 'a',
        attribute: 'href',
        attributeValue: 'https://www.google.com'
      }
    ],
    templateCode: '<!DOCTYPE html>\\n<html>\\n<head>\\n  <title>Mi Página Personal</title>\\n</head>\\n<body>\\n  <!-- Tu código aquí -->\\n  \\n</body>\\n</html>',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // CSS Project
  {
    courseSlug: 'css',
    title: 'Decorar tu Fortaleza',
    description: 'Configura estilos CSS para pintar paredes, añadir márgenes a los baúles y estilizar el título de tu fortaleza.',
    requirements: [
      {
        id: 'req_body',
        description: 'Debe tener estilos configurados para el elemento body.',
        selector: 'body'
      }
    ],
    templateCode: '/* Agrega estilos a tu fortaleza */\\n',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // JS Project
  {
    courseSlug: 'js',
    title: 'Calculadora de Fundición',
    description: 'Escribe un script de JavaScript que tome las unidades de carbón y calcule el número de lingotes de hierro fundidos.',
    requirements: [
      {
        id: 'req_calc',
        description: 'Debe declarar una función de cálculo.',
        regexMatch: 'function'
      }
    ],
    templateCode: '// Escribe tu script aquí\\n',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // React Project
  {
    courseSlug: 'react',
    title: 'Inventario de Cofres',
    description: 'Construye un dashboard interactivo en React para gestionar la cantidad de cofres y su contenido.',
    requirements: [
      {
        id: 'req_react',
        description: 'Debe contener un componente con props.',
        regexMatch: 'props'
      }
    ],
    templateCode: '// Escribe tu componente React aquí\\n',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // Node Project
  {
    courseSlug: 'node',
    title: 'Logger de Coordenadas',
    description: 'Crea una herramienta en Node.js que escriba las coordenadas de tu base secreta en un archivo local de texto.',
    requirements: [
      {
        id: 'req_node',
        description: 'Debe requerir el módulo fs.',
        regexMatch: 'require\\\\s*\\\\(\\\\s*["\']fs["\']\\\\s*\\\\)'
      }
    ],
    templateCode: '// Escribe tu código Node aquí\\n',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // MongoDB Project
  {
    courseSlug: 'mongodb',
    title: 'Bóveda de Minerales',
    description: 'Configura un esquema de base de datos MongoDB para gestionar la extracción e inventario de esmeraldas de los aldeanos.',
    requirements: [
      {
        id: 'req_schema',
        description: 'Debe definir los campos de la base de datos.',
        regexMatch: 'mineral'
      }
    ],
    templateCode: '// Escribe tu esquema o consulta de base de datos aquí\\n',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // Express Project
  {
    courseSlug: 'express',
    title: 'Servidor API Express',
    description: 'Crea una API en Express que exponga las coordenadas, items y misiones disponibles de la aldea.',
    requirements: [
      {
        id: 'req_server',
        description: 'Debe escuchar peticiones en un puerto determinado.',
        regexMatch: 'listen'
      }
    ],
    templateCode: '// Crea tu servidor API Express aquí\\n',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // API Project
  {
    courseSlug: 'api',
    title: 'REST API de Crafteo',
    description: 'Crea endpoints estructurados REST con métodos GET y POST para fabricar y leer items de crafteo.',
    requirements: [
      {
        id: 'req_rest',
        description: 'Debe retornar un json con el código 200.',
        regexMatch: 'res\\\\.json|res\\\\.status'
      }
    ],
    templateCode: '// Diseña los endpoints de tu API aquí\\n',
    rewardXp: 500,
    rewardCoins: 100,
    rewardGems: 10
  },

  // Proyecto Final Project
  {
    courseSlug: 'proyecto',
    title: 'Libro de Recetas Fullstack',
    description: 'Construye y conecta tu React frontend con tu Express backend y base de datos MongoDB. Despliega la aplicación para que todos la disfruten.',
    requirements: [
      {
        id: 'req_full',
        description: 'Debe integrar todas las capas de desarrollo.',
        regexMatch: 'app|express|react|db'
      }
    ],
    templateCode: '// Proyecto Fullstack Integrado final\\n',
    rewardXp: 1000,
    rewardCoins: 300,
    rewardGems: 30
  }
];

const achievements = [
  {
    title: 'Primeros pasos',
    description: 'Alcanza el Nivel 2 en tu aventura de programación.',
    icon: 'wooden_sword',
    conditionType: 'level',
    conditionValue: 2,
    xpReward: 200,
    gemReward: 5
  },
  {
    title: 'Cazador de diamantes',
    description: 'Acumula un total de 1,000 monedas de oro.',
    icon: 'diamond',
    conditionType: 'coins',
    conditionValue: 1000,
    xpReward: 500,
    gemReward: 10
  },
  {
    title: 'Héroe de la aldea',
    description: 'Alcanza el Nivel 5 en la plataforma.',
    icon: 'emerald',
    conditionType: 'level',
    conditionValue: 5,
    xpReward: 400,
    gemReward: 15
  }
];

const shopItems = [
  {
    name: 'Skin Alex',
    description: 'Vístete como Alex para tu aventura en LyraCode.',
    icon: 'alex',
    type: 'skin',
    priceCoins: 150,
    priceGems: 0,
    rarity: 'comun'
  },
  {
    name: 'Skin Zombie',
    description: 'Conviértete en un mob hostil y asusta a los creepers.',
    icon: 'zombie',
    type: 'skin',
    priceCoins: 300,
    priceGems: 5,
    rarity: 'raro'
  },
  {
    name: 'Skin Enderman',
    description: 'Conviértete en el misterioso habitante del End.',
    icon: 'enderman',
    type: 'skin',
    priceCoins: 600,
    priceGems: 15,
    rarity: 'legendario'
  },
  {
    name: 'Lobo Compañero',
    description: 'Un lobo domesticado que te acompaña en todas las rutas de desarrollo.',
    icon: 'wolf',
    type: 'pet',
    priceCoins: 200,
    priceGems: 0,
    rarity: 'comun'
  },
  {
    name: 'Pequeño Slime',
    description: 'Un Slime verde y saltarín para decorar tu dashboard.',
    icon: 'slime_pet',
    type: 'pet',
    priceCoins: 400,
    priceGems: 10,
    rarity: 'raro'
  },
  {
    name: 'Cofre de Hierro',
    description: 'Abre este cofre para recibir premios y recursos aleatorios.',
    icon: 'iron_chest',
    type: 'chest',
    priceCoins: 100,
    priceGems: 0,
    rarity: 'comun'
  },
  {
    name: 'Cofre de Diamantes',
    description: 'El cofre más valioso con gemas y recompensas épicas.',
    icon: 'diamond_chest',
    type: 'chest',
    priceCoins: 500,
    priceGems: 20,
    rarity: 'epico'
  }
];

const missions = [
  {
    title: 'Completa 3 lecciones',
    description: 'Estudia y completa 3 lecciones de cualquier lenguaje.',
    type: 'daily',
    targetType: 'lessons',
    targetValue: 3,
    xpReward: 150,
    coinReward: 50
  },
  {
    title: 'Resuelve 5 ejercicios',
    description: 'Completa con éxito 5 ejercicios prácticos en el editor.',
    type: 'daily',
    targetType: 'exercises',
    targetValue: 5,
    xpReward: 200,
    coinReward: 80
  },
  {
    title: 'Aprobar 2 quizzes',
    description: 'Demuestra lo aprendido aprobando 2 cuestionarios teóricos.',
    type: 'weekly',
    targetType: 'quizzes',
    targetValue: 2,
    xpReward: 300,
    coinReward: 150,
    gemReward: 2
  },
  {
    title: 'Crear tu primer proyecto final',
    description: 'Completa un curso y envía su proyecto final calificado.',
    type: 'course',
    targetType: 'projects',
    targetValue: 1,
    xpReward: 500,
    coinReward: 300,
    gemReward: 5
  }
];

async function seedDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Conectado a la base de datos para la siembra de datos...');

    // Clean existing records
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Exercise.deleteMany({});
    await Quiz.deleteMany({});
    await Project.deleteMany({});
    await Mission.deleteMany({});
    await Achievement.deleteMany({});
    await InventoryItem.deleteMany({});
    await User.deleteMany({});

    console.log('Datos antiguos eliminados con éxito.');

    // Seed Courses
    await Course.insertMany(courses);
    console.log('Cursos sembrados con éxito.');

    // Seed Lessons
    await Lesson.insertMany(lessons);
    console.log('Lecciones sembradas con éxito.');

    // Seed Exercises
    await Exercise.insertMany(exercises);
    console.log('Ejercicios sembrados con éxito.');

    // Seed Quizzes
    await Quiz.insertMany(quizzes);
    console.log('Quizzes sembrados con éxito.');

    // Seed Projects
    await Project.insertMany(projects);
    console.log('Proyectos sembrados con éxito.');

    // Seed Achievements
    await Achievement.insertMany(achievements);
    console.log('Logros sembrados con éxito.');

    // Seed Shop Items
    await InventoryItem.insertMany(shopItems);
    console.log('Artículos de la tienda sembrados con éxito.');

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('LyraPass123!', salt);
    await User.create({
      username: 'lyracoder',
      email: 'lyra@lyracode.com',
      password: hashedPassword,
      xp: 200,
      level: 2,
      coins: 300,
      gems: 15,
      streak: 1,
      avatar: 'steve',
      inventory: [],
      achievements: []
    });
    console.log('Usuario de prueba sembrado con éxito.');

    // Seed Missions
    await Mission.insertMany(missions);
    console.log('Misiones sembradas con éxito.');

    console.log('¡Siembra de datos completada con éxito!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error durante la siembra de la base de datos:', err);
    process.exit(1);
  }
}

seedDB();
