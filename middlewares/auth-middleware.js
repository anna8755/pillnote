const ApiError = require("../exceptions/api-error");
const authMiddlewareGeneric = require("./generic/auth-middleware-generic");

module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        const userData = authMiddlewareGeneric(authorizationHeader);

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnathorizatedError());
    }
}