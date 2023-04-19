"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.process_payment = void 0;
const paymentez_1 = require("../paymentez");
const fs_extra_1 = __importDefault(require("fs-extra"));
const liquidjs_1 = require("liquidjs");
const path_1 = __importDefault(require("path"));
const liquidEngine = new liquidjs_1.Liquid({
    root: [
        path_1.default.resolve("./extensions", "templates"),
        path_1.default.resolve(__dirname, "templates"),
    ],
    extname: ".liquid",
});
const process_payment = async (req, res) => {
    const { id, user, payment_type, value, platform } = req.query;
    console.log("llegaaaa");
    console.log(req.query);
    try {
        //Primero traer la informacion del servicio o producto. getProduct(id);
        //traer informacion del usuario getUser(user);
        let transactionKey;
        let transactionDetailK; //Preguntar si vamos a manejar las transacciones con una cabecera y un detalle para almacenar transacciones
        let transactionType;
        let transactionMessage;
        let transactionValue;
        let transaction;
        let credentials;
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
                transactionValue = Number(value);
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
        const data = {
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
        const reference = await (0, paymentez_1.getReferencePaymentez)(data, credentials);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing payment" });
    }
};
exports.process_payment = process_payment;
const templateCache = {};
async function renderTemplate(template, variables) {
    // Obtiene la ruta del archivo principal de la aplicación
    const mainPath = require.main
        ? path_1.default.dirname(require.main.filename)
        : __dirname;
    // Ajusta la ruta de la plantilla para que apunte a la carpeta de la plantilla en la raíz del proyecto
    const rootTemplatePath = path_1.default.resolve(mainPath, "..", template + ".liquid");
    // Verifica si la plantilla existe
    if ((await fs_extra_1.default.pathExists(rootTemplatePath)) === false) {
        console.log("No encuentra el template");
    }
    // Revisa si la plantilla ya está en la caché y, de lo contrario, lee el archivo
    let templateString = templateCache[template];
    if (!templateString) {
        templateString = await fs_extra_1.default.readFile(rootTemplatePath, "utf8");
        templateCache[template] = templateString;
    }
    // Renderiza la plantilla y devuelve el HTML resultante
    const html = await liquidEngine.parseAndRender(templateString, variables);
    return html;
}
