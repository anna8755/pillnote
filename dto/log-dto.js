module.exports = class LogDto {
    id;
    time;
    notes;
    medicine;
    constructor(logModel, reminderModel) {
        this.id = logModel._id;
        this.time = logModel.time;
        this.notes = logModel.notes;
        this.medicine = reminderModel.medicine;
    }
}