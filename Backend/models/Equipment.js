const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },

        type: {
            type: String,
            required: true
        },

        temperature: {
            type: Number,
            required: true
        },

        load: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Normal", "Warning", "Critical"],
            required: true
        },

        maintenanceDue: {
            type: Boolean,
            default: false
        },

        lastMaintenance: {
            type: String,
            default: "Not recorded"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Equipment", equipmentSchema);