const ApiError = require("../exceptions/api-error");
const authMiddlewareGeneric = require("./generic/auth-middleware-generic");

module.exports = (socket, next) => {
    try {
        const token = socket.handshake.headers.authorization;
        userData = authMiddlewareGeneric(token);
        
        socket.user = userData;
        next();
    } catch (e) {
        // console.log('4')
        // socket.disconnect();
        return next(ApiError.UnathorizatedError());
    }
}
