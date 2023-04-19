import { Credentials } from "../../models/paymentezCredentials";

const { createHash } = require("crypto");
export const generateToken = (credentials: Credentials) => {
  const API_LOGIN_DEV = credentials.API_LOGIN_DEV;
  const API_KEY_DEV = credentials.API_KEY_DEV;

  // Generar la marca de tiempo Unix en segundos
  const unixTimestamp = Math.floor(new Date().getTime() / 1000);

  // Crear la cadena única del token
  const uniqTokenString = `${API_KEY_DEV}${unixTimestamp}`;

  // Crear el hash del token usando SHA-256
  const uniqTokenHash = createHash("sha256")
    .update(uniqTokenString)
    .digest("hex");

  // Crear el token de autenticación combinando el nombre de usuario, la marca de tiempo y el hash del token
  const authToken = Buffer.from(
    `${API_LOGIN_DEV};${unixTimestamp};${uniqTokenHash}`
  ).toString("base64");

  return authToken;
};
