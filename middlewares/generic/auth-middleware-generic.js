const ApiError = require("../../exceptions/api-error");
const tokenService = require("../../service/token-service");

module.exports = (token) => {
    
    if (!token) {
        throw new (ApiError.UnathorizatedError());
    }
    
    const accessToken = token.split(' ')[1];
    if (!accessToken) {
        // console.log("2")
        throw new (ApiError.UnathorizatedError());
    }
    
    const userData = tokenService.validateAccessToken(accessToken);
    
    console.log(userData)

    if (!userData) {
        // console.log(accessToken);
        // console.log("3")
        throw new (ApiError.UnathorizatedError());
    }
    
    if (!userData.isActivated) {
        // console.log("4")
        throw new (ApiError.IsNotActivated());
    }
    // console.log('в мидлваре авторизации')

    // console.log('is ok!')

    return userData;
}