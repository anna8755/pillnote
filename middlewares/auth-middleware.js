const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            // console.log("1")
            throw new (ApiError.UnathorizatedError());
        }
        
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            // console.log("2")
            throw new (ApiError.UnathorizatedError());
        }
        
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            console.log(accessToken);
            // console.log("3")
            throw new (ApiError.UnathorizatedError());
        }
        
        if (!userData.isActivated) {
            // console.log("4")
            throw new (ApiError.IsNotActivated());
        }

        req.user = userData;
        next();
    } catch (e) {
        // console.log("5")
        return next(ApiError.UnathorizatedError());
    }
}