"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferencePaymentez = void 0;
const axios_1 = __importDefault(require("axios"));
const generateToken_1 = require("./helpers/generateToken");
const createAxiosInstance = (authToken, credentials) => {
    var _a;
    console.log("//////////");
    console.log(credentials.URL);
    return axios_1.default.create({
        baseURL: (_a = credentials.URL) === null || _a === void 0 ? void 0 : _a.toString(),
        headers: { "Auth-Token": authToken },
    });
};
const getReferencePaymentez = async (transaction, credentials) => {
    var _a, _b;
    try {
        const { user } = transaction;
        console.log(transaction);
        const data = {
            locale: "es",
            order: {
                amount: Number((_a = transaction.total) === null || _a === void 0 ? void 0 : _a.toFixed(2)),
                description: transaction.payment_reference,
                vat: Number(transaction.tax),
                dev_reference: transaction.id,
                installments_type: 0,
                tax_percentage: 12,
                taxable_amount: Number((_b = transaction.subtotal) === null || _b === void 0 ? void 0 : _b.toFixed(2)), //Valor subototal
            },
            user: {
                id: user,
                email: "panatta3004@gmail.com",
            },
        };
        const authToken = (0, generateToken_1.generateToken)(credentials);
        const axiosInstance = createAxiosInstance(authToken, credentials);
        const resp = await axiosInstance.post("/transaction/init_reference", data);
        const { reference } = resp.data;
        return reference;
    }
    catch (error) {
        console.log(error.response);
        throw new Error("Pago fallido");
    }
};
exports.getReferencePaymentez = getReferencePaymentez;
