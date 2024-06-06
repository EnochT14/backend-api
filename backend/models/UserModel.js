"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    uid: String,
    email: String,
    displayName: String,
    roles: (Array),
    createdAt: String,
});
module.exports = mongoose_1.default.model("User", UserSchema);
