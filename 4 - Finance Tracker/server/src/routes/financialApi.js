import express from "express";
import FinancialModel from "../models/financial.js"; // Corrected import

const router = express.Router();

// Test if API is working
router.get("/test", (req, res) => {
    res.json({ message: "API is working" });
});

// Getting all financial records of a user
router.get("/getAllByUserId/:id", async (req, res) => {
    const { id } = req.params; // Fixed destructuring issue
    try {
        const records = await FinancialModel.find({ userId: id }).sort({date: -1});
        if (records.length === 0) {
            return res.status(404).json({ message: "No records found or no user with this ID" });
        }
        res.status(200).json(records); // Use json() for consistency
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Adding a new financial record
router.post("/", async (req, res) => {
    try {
        const newRecord = req.body;
        console.log("Received record:", newRecord);
        
        const savedRecord = await FinancialModel.create(newRecord);
        
        if (!savedRecord) {
            console.log("Failed to insert record");
            return res.status(400).json({ message: "Failed to insert record" });
        }

        console.log("Saved record:", savedRecord);
        res.status(201).json(savedRecord); // 201 Created is appropriate for successful creation
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Updating a financial record
router.put("/:id", async (req, res) => {
    const { id } = req.params; // Fixed destructuring issue
    try {
        const record = req.body;
        const updatedRecord = await FinancialModel.findByIdAndUpdate(id, record, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Deleting a financial record
router.delete("/:id", async (req, res) => {
    const { id } = req.params; // No need to destructure twice
    try {
        const deletedRecord = await FinancialModel.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(deletedRecord);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
