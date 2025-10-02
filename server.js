import dotenv from "dotenv";
import app from "./src/app.js";
import sapB1Service from "./src/services/sapB1.service.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing SAP session...');
    await sapB1Service.logout();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, closing SAP session...');
    await sapB1Service.logout();
    process.exit(0);
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
