import HttpStatus from 'http-status-codes';

const successResponse = (req, res, result) => {
    res.status(HttpStatus.OK).json({ success: true, result });
};

const errorResponse = (req, res, status, error) => {
    let errorObj = {};
    let { body, params, query, path, url, originalUrl, headers, connection: { remoteAddress } } = req;

    if(typeof error === 'string') {
        errorObj = {
            message: error
        };
    } else {
        delete error.statusCode;
        errorObj = {
            message: error?.message || 'Something went wrong. Please try after some time.',
            stack: error?.stack
        };
    }
    
    res.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, error: errorObj });
};

const handleResponse = (req, res, error, result) => {
    
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    if (error) {
        errorResponse(req, res, error.statusCode, error);
    } else {
        successResponse(req, res, result);
    }
};

export { handleResponse, errorResponse, successResponse };