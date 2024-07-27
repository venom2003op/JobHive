class ErrorHandler extends Error{
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    if(err.name==="CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(404, message);
    }

    if (err.name === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(404, message);
    }

    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid. Try again`;
      err = new ErrorHandler(404, message);
    }

    if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is expired. Try again`;
      err = new ErrorHandler(404, message);
    }

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      err = new ErrorHandler(404, message);
    }
    if(err.name==="Password does not match"){
        const message = `Password does not match`;
        err = new ErrorHandler(422, message);
    }

    return res.status(err.statusCode).json({
        message: err.message,
    });
};

export default ErrorHandler;