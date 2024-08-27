import express from 'express'; // No curly braces for default import
import cors from 'cors';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js'; // Import the model

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello 👋 from server!' });
});

// add transaction
app.post('/api/transaction', async (req, res) => {
  try {
    console.log(req.body);
    const { name, price, datetime, description } = req.body;
    const transaction = await Transaction.create({ name, price, datetime, description });
    res.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Start server
app.listen(3001, () => {
  console.log('💻 Server is running on port 3001...');
});
