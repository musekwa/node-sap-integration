import axios from "axios";
import https from "https";
import { sapConfig } from "../config/sap.config.js";

class SAPB1Service {
    constructor() {
        this.baseURL = sapConfig.baseURL;
        this.companyDB = sapConfig.companyDB;
        this.username = sapConfig.username;
        this.password = sapConfig.password;
        this.sessionId = null;
        this.sessionTimeout = null;
        this.lastActivity = null;

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json"
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: sapConfig.rejectUnauthorized
            })
        });

        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    await this.login();
                    originalRequest.headers.Cookie = `B1SESSION=${this.sessionId}`;
                    return this.client(originalRequest);
                }
                return Promise.reject(error);
            });
    }

    // Check if session is still valid
    isValidSession() {
        if (!this.sessionId || !this.lastActivity) {
            return false;
        }
        const now = Date.now();
        const elapsed = (now - this.lastActivity) / 1000 / 60; // minutes
        return elapsed < (this.sessionTimeout - 5); // allow 5 minutes leeway
    }


    // Login to SAP B1
    async login() {
        try {
            const response = await this.client.post("/login", {
                companyDB: this.companyDB,
                username: this.username,
                password: this.password
            });

            this.sessionId = response.data.sessionId;
            this.sessionTimeout = response.data.sessionTimeout;
            this.lastActivity = Date.now();
            console.log(`SAP B1 Sessiion established. Login successful ${this.sessionId}`);
            return this.sessionId;
        } catch (error) {
            console.error("SAP B1 Login failed:", error.message);
            throw this.formatError(error);
        }
    }


    // Logout from SAP B1
    async logout() {
        if (!this.sessionId) {
            console.warn("SAP B1 Session not established. No need to logout");
            return;
        }
        try {
            await this.client.post("/logout", {}, {
                headers: {
                    Cookie: `B1SESSION=${this.sessionId}`
                }
            });
            console.log("SAP B1 Session terminated. Logout successful");
        } catch (error) {
            console.error("SAP B1 Logout failed:", error.message);
        }
        finally {
            this.sessionId = null;
            this.lastActivity = null;
        }
    }

    // Ensure active session
    async ensureSession() {
        if (!this.isValidSession()) {
            await this.login();
        }
        else {
            console.log("SAP B1 Session is valid. No need to login");
            this.lastActivity = Date.now();
        }
    }

    // Generic request method
    async request(method, endpoint, data = null, params = null){
        await this.ensureSession();
        try {
            const config = {
                method,
                url: endpoint,
                data,
                params,
                headers: {
                    Cookie: `B1SESSION=${this.sessionId}`
                }
            }
            if (data) config.data = data;
            if (params) config.params = params;

            const response = await this.client(config);
            return response.data;
        } catch (error) {
            console.error(`SAP B1 ${method} request failed:`, error.message);
            throw this.formatError(error);
        }
    }

    // HTTP methods
    async get(endpoint, params = null){
        return this.request("GET", endpoint, null, params);
    }
    async post(endpoint, data){
        return this.request("POST", endpoint, data);
    }
    async patch(endpoint, data){
        return this.request("PATCH", endpoint, data);
    }
    async delete(endpoint){
        return this.request("DELETE", endpoint);
    }


    // Build OData parameters
    buildODataParams(options = {}){
        const params = {};
        if (options.select){
            params.$select = Array.isArray(options.select) ? options.select.join(",") : options.select;
        }
            
        if (options.expand){
            params.$expand = Array.isArray(options.expand) ? options.expand.join(",") : options.expand;
        }
        if (options.top){
            params.$top = options.top;
        }
        if (options.skip){
            params.$skip = options.skip;
        }
        if (options.filter){
            params.$filter = options.filter;
        }
        if (options.orderby){
            params.$orderby = options.orderby;
        }
        return params;
    }

    // Format error
    formatError(error){
        if (error.response){
            const sapError = error.response.data?.error?.value || error.response.data?.error || error.response.statusText;
            return {
                status: error.response.status,
                message: sapError,
                code: error.response.data?.error?.code,
            }
        }
        
        if (error.request){
            return {
                status: 503,
                message: "Cannot connect to SAP B1 server",
                code: "NETWORK_ERROR"
            }
        }

        return {
            status: 500,
            message: error.message || "An unexpected error occurred",
            code: "INTERNAL_SERVER_ERROR"
        }
    }


    // Business Partners
    async getBusinessPartners(options = {}){
        // await this.ensureSession();
       const params = this.buildODataParams(options);
       return this.get("/BusinessPartners", params);
    }

    async getBusinessPartner(cardCode){
        // await this.ensureSession();
        return this.get(`/BusinessPartners(${cardCode})`);
    }
    async createBusinessPartner(data){
        // await this.ensureSession();
        return this.post("/BusinessPartners", data);
    }
    async updateBusinessPartner(cardCode, data){
        // await this.ensureSession();
        return this.patch(`/BusinessPartners(${cardCode})`, data);
    }
    async deleteBusinessPartner(cardCode){
        // await this.ensureSession();
        return this.delete(`/BusinessPartners(${cardCode})`);
    }

    // Items
    async getItems(options = {}){
        // await this.ensureSession();
        const params = this.buildODataParams(options);
        return this.get("/Items", params);
    }
    async getItem(itemCode){
        // await this.ensureSession();
        return this.get(`/Items(${itemCode})`);
    }
    async createItem(data){
        // await this.ensureSession();
        return this.post("/Items", data);
    }
    async updateItem(itemCode, data){
        // await this.ensureSession();
        return this.patch(`/Items(${itemCode})`, data);
    }
    async deleteItem(itemCode){
        // await this.ensureSession();
        return this.delete(`/Items(${itemCode})`);
    }

    // Sales Orders
    async getOrders(options = {}){
        // await this.ensureSession();
        const params = this.buildODataParams(options);
        return this.get("/Orders", params);
    }
    async getOrder(docEntry){
        // await this.ensureSession();
        return this.get(`/Orders(${docEntry})`);
    }
    async createOrder(data){
        // await this.ensureSession();
        return this.post("/Orders", data);
    }
    async updateOrder(docEntry, data){
        // await this.ensureSession();
        return this.patch(`/Orders(${docEntry})`, data);
    }
    async cancelOrder(docEntry){
        // await this.ensureSession();
        return this.post(`/Orders(${docEntry})/Cancel`, {});
    }


    // Sales Invoices
    async getInvoices(options = {}){
        // await this.ensureSession();
        const params = this.buildODataParams(options);
        return this.get("/Invoices", params);
    }
    async getInvoice(docEntry){
        // await this.ensureSession();
        return this.get(`/Invoices(${docEntry})`);
    }
    async createInvoice(data){
        // await this.ensureSession();
        return this.post("/Invoices", data);
    }

    // Purchase Orders
    async getPurchaseOrders(options = {}){
        // await this.ensureSession();
        const params = this.buildODataParams(options);
        return this.get("/PurchaseOrders", params);
    }
    async getPurchaseOrder(docEntry){
        // await this.ensureSession();
        return this.get(`/PurchaseOrders(${docEntry})`);
    }

    // Inventory 
    async getInventoryEntries(options = {}){
        // await this.ensureSession();
        const params = this.buildODataParams(options);
        return this.get("/InventoryEntries", params);
    }
    async createInventoryEntry(data){
        // await this.ensureSession();
        return this.post("/InventoryEntries", data);
    }

    // Stock
    async getStockWarehouse(itemCode){
        // await this.ensureSession();
        return this.get(`/Items('${itemCode}')/ItemWarehouseInfoCollection`);
    }
}

// Singleton instance
const sapB1Service = new SAPB1Service();
export default sapB1Service;
