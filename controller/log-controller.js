const ApiError = require("../exceptions/api-error");
const logService = require("../service/log-service");

class LogController {
    async addLog(req, res, next) {
        try {
            const token = req.headers.authorization;
            const { reminderId, time, notes } = req.body;
            const logData = await logService.addLog(token, reminderId, time, notes)
            return res.json(logData);
        } catch (e) {
            next(e);
        }
    }
    async getLogsByReminderId(req, res, next) {
        try {
            const token = req.headers.authorization;
            const reminderId = req.params.reminderId;

            const logs = await logService.getLogsByReminderId(token, reminderId);
            return res.json(logs);
        } catch (e) {
            next(e);
        }
    }
    async deleteLog(req, res, next) {
        try {
            const id = req.params.id;
            const token = req.headers.authorization;

            const result = await logService.deleteLog(token, id);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async updateLog(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }
}

module.exports = new LogController();