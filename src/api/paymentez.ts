import axios from "axios";
import { Transaction } from "../models/transaction";
import { Credentials } from "../models/paymentezCredentials";
import { generateToken } from "./helpers/generateToken";

const createAxiosInstance = (authToken: string, credentials: Credentials) => {
  console.log("//////////");
  console.log(credentials.URL);
  return axios.create({
    baseURL: credentials.URL?.toString(),
    headers: { "Auth-Token": authToken },
  });
};

export const getReferencePaymentez = async (
  transaction: Transaction,
  credentials: Credentials
) => {
  try {
    const { user } = transaction;
    console.log(transaction);
    const data = {
      locale: "es",
      order: {
        amount: Number(transaction.total?.toFixed(2)),
        description: transaction.payment_reference,
        vat: Number(transaction.tax), //Valor del vat
        dev_reference: transaction.id,
        installments_type: 0,
        tax_percentage: 12,
        taxable_amount: Number(transaction.subtotal?.toFixed(2)), //Valor subototal
      },
      user: {
        id: user,
        email: "panatta3004@gmail.com",
      },
    };

    const authToken = generateToken(credentials);
    const axiosInstance = createAxiosInstance(authToken, credentials);
    const resp = await axiosInstance.post("/transaction/init_reference", data);
    const { reference } = resp.data;
    return reference;
  } catch (error: any) {
    console.log(error.response);
    throw new Error("Pago fallido");
  }
};
