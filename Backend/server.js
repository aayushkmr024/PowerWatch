const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Equipment = require("./models/Equipment");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// ==========================
// MONGODB CONNECTION
// ==========================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:");
        console.error(error);
    });


// ==========================
// HOME ROUTE
// ==========================

app.get("/", (req, res) => {

    res.json({
        message: "PowerWatch Backend is running"
    });

});


// ==========================
// GET ALL EQUIPMENT
// ==========================

app.get("/api/equipment", async (req, res) => {

    console.log("GET /api/equipment called");

    try {

        console.log("About to query MongoDB...");

        const equipment = await Equipment.find();

        console.log("MongoDB query successful");

        console.log("Equipment:", equipment);

        res.status(200).json(equipment);

    } catch (error) {

        console.error("GET EQUIPMENT ERROR:");

        console.error(error);

        res.status(500).json({

            message: "Failed to fetch equipment",

            error: error.message

        });

    }

});


// ==========================
// ADD EQUIPMENT
// ==========================

app.post("/api/equipment", async (req, res) => {

    console.log("POST /api/equipment called");

    try {

        const newEquipment =
            await Equipment.create(req.body);

        console.log("Equipment created:");

        console.log(newEquipment);

        res.status(201).json(newEquipment);

    } catch (error) {

        console.error("POST EQUIPMENT ERROR:");

        console.error(error);

        res.status(400).json({

            message: "Failed to create equipment",

            error: error.message

        });

    }

});


// ==========================
// UPDATE EQUIPMENT
// ==========================

app.put("/api/equipment/:id", async (req, res) => {

    console.log(
        "PUT /api/equipment/" + req.params.id
    );

    try {

        const updatedEquipment =
            await Equipment.findOneAndUpdate(

                {
                    id: req.params.id
                },

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!updatedEquipment) {

            return res.status(404).json({

                message: "Equipment not found"

            });

        }

        console.log("Equipment updated:");

        console.log(updatedEquipment);

        res.status(200).json(updatedEquipment);

    } catch (error) {

        console.error("PUT EQUIPMENT ERROR:");

        console.error(error);

        res.status(500).json({

            message: "Failed to update equipment",

            error: error.message

        });

    }

});


// ==========================
// DELETE EQUIPMENT
// ==========================

app.delete("/api/equipment/:id", async (req, res) => {

    console.log(
        "DELETE /api/equipment/" + req.params.id
    );

    try {

        const deletedEquipment =
            await Equipment.findOneAndDelete({

                id: req.params.id

            });

        if (!deletedEquipment) {

            return res.status(404).json({

                message: "Equipment not found"

            });

        }

        console.log("Equipment deleted:");

        console.log(deletedEquipment);

        res.status(200).json({

            message:
                "Equipment deleted successfully",

            equipment:
                deletedEquipment

        });

    } catch (error) {

        console.error("DELETE EQUIPMENT ERROR:");

        console.error(error);

        res.status(500).json({

            message: "Failed to delete equipment",

            error: error.message

        });

    }

});


// ==========================
// START SERVER
// ==========================

app.listen(PORT, () => {

    console.log(
        `PowerWatch server running on port ${PORT}`
    );

});