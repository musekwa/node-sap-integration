import dotenv from "dotenv";
dotenv.config();

export const sapConfig = {
    baseURL: process.env.SAP_BASE_URL,
    companyDB: process.env.SAP_COMPANY_DB,
    username: process.env.SAP_USER,
    password: process.env.SAP_PASSWORD,
    sessionTimeout: parseInt(process.env.SAP_SESSION_TIMEOUT) || 30,
    // SSL settings - set to true in production with valid SSL certificate
    rejectUnauthorized: process.env.NODE_ENV === "production"
};
