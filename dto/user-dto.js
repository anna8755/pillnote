module.exports = class UserDto {
    email;
    id;
    isActivated;
    fullname;
    photoLink;
    constructor(model) {
        this.fullname = model.fullname;
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.photoLink = model.photoLink
    }
}