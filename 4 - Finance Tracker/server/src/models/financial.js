import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { Schema } = mongoose; // Destructure Schema from mongoose

// Define the schema
const FinancialSchema = new Schema({
	userId: { 
		type: String, 
		required: true 
	},
	date: { 
		type: Date, 
		required: true 
	},
	description: {
		type: String,
		required: true
	},
	amount: { 
		type: Number, 
		required: true 
	},
	category: {
		type: String,
		required: true
	},
	payementMethod: {
		type: String,
		required: true
	}
}, { timestamps: true });

// Create the model
const FinancialModel = mongoose.model('Financials', FinancialSchema); // Collection name will be 'transactions'

export default FinancialModel;