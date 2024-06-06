"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var phoneSchema = new mongoose_1.default.Schema({
    name: String,
    number: String,
    uid: String,
});
phoneSchema.set("toJSON", {
    transform: function (doc, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
module.exports = mongoose_1.default.model("Phone", phoneSchema);
