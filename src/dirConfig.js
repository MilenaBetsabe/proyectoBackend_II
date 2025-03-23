// dirname: Es una función del módulo path que devuelve el directorio padre de una ruta dada.
import { dirname } from "path";
// fileURLToPath: Es una función del módulo url que convierte una URL en una ruta de archivo.
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export default __dirname;

