const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // SAP B1 formatted error
    if (err.status && err.message) {
        return res.status(err.status).json({
            success: false,
            error: {
                message: err.message,
                code: err.code,
                status: err.status,
            }
        });
    }
  
  
    // Generic error
    res.status(500).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            code: 'INTERNAL_SERVER_ERROR',
            status: 500,
        }
    });
}

export default errorHandler;

