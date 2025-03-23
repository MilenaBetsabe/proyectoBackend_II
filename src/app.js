//* Importación de módulos necesarios
import mongoose from 'mongoose'; // Para interactuar con MongoDB
import express from 'express'; // Framework para crear el servidor
import userRouter from './routes/usersParams.router.js'; // Rutas de usuarios
import sessionsRouter from './routes/sessions.router.js'; // Rutas de sesiones
import dotenv from 'dotenv'; // Para manejar variables de entorno
import __dirname from "./dirConfig.js"; // Directorio raíz del proyecto
import handlebars from 'express-handlebars'; // Motor de plantillas Handlebars
import passport from 'passport'; // Autenticación
import { initializePassport } from './config/passport.config.js'; // Configuración de Passport
import cookieParser from 'cookie-parser'; // Para manejar cookies

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 8080;

//inicializamos el motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middlewares para procesar solicitudes
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios
app.use(cookieParser()); // Para manejar cookies

// Configuración de Passport para autenticación
initializePassport();
app.use(passport.initialize());

// Conexión a MongoDB
const URIMongoDB = process.env.URIMONGO; // URI de conexión a MongoDB desde variables de entorno

mongoose.connect(URIMongoDB)
    .then(() => console.log("✅ Successful connection to MongoDB"))
    .catch((error) => { 
        console.error("❌ Error connecting to MongoDB: ", error); 
        process.exit(1); // Detener la aplicación si hay un error de conexión
    });

// Ruta principal para renderizar la vista de login
app.get("/", (req, res) => {
    res.render("login") // Renderizar la vista "login.handlebars"
});

// Rutas de la API
app.use("/api/sessions", sessionsRouter); // Rutas relacionadas con sesiones

const userRouterInstance = new userRouter(); // Instancia del router de usuarios

app.use("/api/users", userRouterInstance.returnRouter()); // Rutas relacionadas con usuarios

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

