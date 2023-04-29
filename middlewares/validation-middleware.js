const { body } = require('express-validator');

class ValidationMiddleware {
    // Middleware function to validate the request body
    validateTime() {
        return [
            body('time')
                .toDate()
                .isAfter()
                .withMessage('Time must be a date in the future')
        ];
    }

    getAccessTokenFromReq(req){
        const token = req.headers.authorization;
        if (!token) throw new (ApiError.BadRequest());
        const accessToken = token.split(' ')[1];
        if (!accessToken) throw new (ApiError.BadRequest());

        return accessToken;
        // const userId = tokenService.validateAccessToken(accessToken).id;
    }
}

module.exports = new ValidationMiddleware();
