import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const secretKey = process.env.SECRET_KEY;

// Crear un token
export const createToken = (payload) => {
     try {
          return jwt.sign(payload, secretKey, { expiresIn: '24h' });
     } catch (error) {
          console.error("Error creating token:", error);
          throw new Error("Failed to create token");
     }
};

// Verificar un token
export const verifyToken = (token) => {
     try {
          return jwt.verify(token, secretKey);
     } catch (error) {
          console.error("Error verifying token:", error);
          throw new Error("Invalid or expired token");
     }
};

// Decodificar un token
export const decodeToken = (token) => {
     try {
          return jwt.decode(token, { complete: true });
     } catch (error) {
          console.error("Error decoding token:", error);
          throw new Error("Failed to decode token");
     }
};