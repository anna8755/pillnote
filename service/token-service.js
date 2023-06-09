const jwt = require("jsonwebtoken");
const tokenModel = require("../model/token-model");


class TokenService {
    getAccesToken(token) {
        if (!token) throw new (ApiError.BadRequest());
        const accessToken = token.split(' ')[1];
        if (!accessToken) throw new (ApiError.BadRequest());
        return accessToken;
    }

    generateTokens(payload) {
        const accessToken = jwt
            .sign(payload,
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '20m' });
        const refreshToken = jwt
            .sign(payload,
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '20d' });

        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ user: userId, refreshToken })
        return token;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            // console.log('valid!')
            // console.log(token)

            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    async removeTokenByUserId(userId) {
        const removeResult = await tokenModel.findOneAndDelete({ user: userId })
        return removeResult;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken });
        return tokenData;
    }

}

module.exports = new TokenService();