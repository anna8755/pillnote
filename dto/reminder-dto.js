module.exports = class ReminderDto {
    id;
    medicine;
    time;
    notes;
    viewed;
    constructor(model) {
        this.id = model._id;
        this.medicine = model.medicine;
        this.time = model.time;
        this.notes = model.notes;
        this.viewed = model.viewed;
    }
}