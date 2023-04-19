import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";
import axios from "axios";
import { Credentials } from "../../models/paymentezCredentials";
import { getReferencePaymentez } from "../paymentez";
import fse from "fs-extra";
import { Liquid } from "liquidjs";
import path from "path";

const liquidEngine = new Liquid({
  root: [
    path.resolve("./extensions", "templates"),
    path.resolve(__dirname, "templates"),
  ],
  extname: ".liquid",
});
export const process_payment = async (req: Request, res: Response) => {
  const { id, user, payment_type, value, platform } = req.query;
  console.log("llegaaaa");
  console.log(req.query);
  try {
    //Primero traer la informacion del servicio o producto. getProduct(id);

    //traer informacion del usuario getUser(user);
    let transactionKey: number;
    let transactionDetailK: number; //Preguntar si vamos a manejar las transacciones con una cabecera y un detalle para almacenar transacciones
    let transactionType: string;
    let transactionMessage: string;
    let transactionValue: number;
    let transaction: Transaction;
    let credentials: Credentials;
    //Preguntar si maneja diferentes tipos de transacciones.
    switch (payment_type) {
      case "pago_servicio":
        transactionType = "cancelled";
        transactionMessage = `Pago de servicio: ${"Pago de agua"}`;
        transactionValue = Number(value);
        break;
      case "transferencia":
        transactionType = "cancelled";
        transactionMessage = `Transferancia a  ${"Juan"}}`;
        transactionValue = Number(value);
        break;
      case "pago_seguro":
        transactionType = "cancelled";
        transactionMessage = `Pago del seguro social: ${"Fecha de cuota"}`;
        transactionValue = Number(value!);
        break;
      default:
        return res.send("Tipo de pago no válido");
    }
    const taxPercentage = 0.12;
    const subtotal = Number(value) / 1.12;
    const tax = parseFloat((subtotal * taxPercentage).toFixed(2));
    const total = value;

    const baseUrl = "http://localhost:3000";
    const ENV_MODE = "stg";
    const data: Transaction = {
      user: "12s8282",
      total: Number(total),
      payment_reference: transactionMessage,
      tax: tax,
      id: 1,
      tax_percentage: taxPercentage,
      subtotal: Number(subtotal.toFixed(2)),
    };
    credentials = {
      API_KEY_DEV: "Kn9v6ICvoRXQozQG2rK92WtjG6l08a",
      API_LOGIN_DEV: "NUVEISTG-EC-SERVER",
      ENV_MODE: "stg",
      URL: "https://ccapi-stg.paymentez.com/v2",
    };

    const reference = await getReferencePaymentez(data, credentials);
    console.log(reference);
    const templateData = {
      baseUrl,
      reference,
      platform,
      ENV_MODE,
    };
    const paymentezModal = await renderTemplate("paymentez", templateData);
    res.set("Content-Security-Policy", "");
    return res.send({ paymentezModal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing payment" });
  }
};
const templateCache: Record<string, string> = {};

async function renderTemplate(
  template: string,
  variables: Record<string, any>
): Promise<string> {
  // Obtiene la ruta del archivo principal de la aplicación
  const mainPath = require.main
    ? path.dirname(require.main.filename)
    : __dirname;

  // Ajusta la ruta de la plantilla para que apunte a la carpeta de la plantilla en la raíz del proyecto
  const rootTemplatePath = path.resolve(mainPath, "..", template + ".liquid");

  // Verifica si la plantilla existe
  if ((await fse.pathExists(rootTemplatePath)) === false) {
    console.log("No encuentra el template");
  }

  // Revisa si la plantilla ya está en la caché y, de lo contrario, lee el archivo
  let templateString = templateCache[template];
  if (!templateString) {
    templateString = await fse.readFile(rootTemplatePath, "utf8");
    templateCache[template] = templateString;
  }

  // Renderiza la plantilla y devuelve el HTML resultante
  const html = await liquidEngine.parseAndRender(templateString, variables);
  return html;
}
