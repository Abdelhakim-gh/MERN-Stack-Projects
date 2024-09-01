import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import financialRoute from './routes/financialApi.js'; // Corrected import

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));

// Connect to MongoDB
mongoose.connect(`${process.env.DB_CONNECTION || 'mongodb://localhost:27017'}/FinanceTrackerApp`)
  .then(() => { console.log('Connected to MongoDB!'); })
  .catch((error) => { console.error('Connection error', error); });

// check if api is running 
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello 👋 from server ! ' });
});

// use financial api under the endpoint /api/financials
app.use("/api/financials", financialRoute);

// run the server 
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`💻 Server is running on port ${port}...`);
});
