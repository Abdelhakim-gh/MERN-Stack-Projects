import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { Schema } = mongoose; // Destructure Schema from mongoose

// Connect to MongoDB
mongoose.connect(`${process.env.CONNECTION_URL}/MoneyTrackerApp`, {
  // Remove deprecated options
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((error) => {
  console.error('Connection error', error);
});

// Define the schema
const TransactionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  datetime: { type: String, required: true },
});

// Create the model
const Transaction = mongoose.model('Transactions', TransactionSchema); // Collection name will be 'transactions'

export default Transaction;