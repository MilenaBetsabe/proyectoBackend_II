import { Router } from "express";
import User from "../models/user.model.js";
import { hash, isValidPassword } from "../utils/hash.js";
import { createToken } from "../utils/tokenConfig.js";
import passportAuth from "../middlewares/passport.auth.js";
import authorization from "../middlewares/authorization.middleware.js";

const sessionsRouter = Router(); 

//Ruta de registro
sessionsRouter.post("/register", async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;

    if (!first_name || !last_name || !age || !email || !password) {
        return res.status(400).send("Campos faltantes");
    }
    
    if (!isNaN(first_name)) {
        return res.status(400).send("El nombre de usuario es incorrecto");
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("El correo electrónico es incorrecto");
    }

    if (password.length <= 6) {
        return res.status(400).send("La contraseña debe tener más de 6 caracteres");
    }
    
    const userFound = await User.findOne({ email });
    if (userFound) {
        return res.status(401).send("El usuario ya existe");
    }

    const newUser = { first_name, last_name, age, email, password: hash(password) };
    const result = await User.create(newUser);
    
    res.status(201).send(result);
});

//Ruta de login
sessionsRouter.post("/login", async (req, res) => {

    const { email, password } = req.body;   
    if (!email || !password) {
        return res.status(400).send("Campos faltantes");
    }
    const user = await User.findOne({ email });
    if (!user || !isValidPassword(password, user.password)) {
        return res.status(401).send({status: "error", error: "Usuario no encontrado o credenciales incorrectas"});
    }

    const token = createToken({
        id: user._id,
        email: user.email,
        role: user.role
    });

    res.cookie("cookie", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        samesite: "None",
        secure: true,
        httpOnly: true
    }).send({status: "ok", message: "Usuario logueado correctamente"});
    
});

//Ruta que retornan las vistas
sessionsRouter.get("/login", (req, res) => {
    res.render("login"); 
});

sessionsRouter.get("/register", (req, res) => {
    res.render("register");  
});

//Ruta de devolucion de datos de usuario
sessionsRouter.get("/current", passportAuth("jwt"), authorization("admin"), (req, res) => {
    if (!req.user) {
        return res.status(401).send({ error: "No autorizado" });
    }
    console.log("Usuario autenticado:", req.user);
    res.send({ Usuario: "autenticado", payload: req.user });

});

export default sessionsRouter;