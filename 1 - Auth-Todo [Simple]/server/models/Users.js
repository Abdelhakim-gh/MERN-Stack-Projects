import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { Schema } = mongoose; // Destructure Schema from mongoose

// Connect to MongoDB
mongoose.connect(`${(process.env.CONNECTION_URL || 'mongodb://localhost:27017')}/testingdb`, {
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((error) => {
  console.error('Connection error', error);
});

// Define the schema
const UsersSchema = new Schema({
    email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Email validation
    },
    password: { 
      type: String, 
      required: true 
    },
    created_at: { 
      type: Date, 
      default: Date.now,  // Automatically set the date when a new document is created
      required: true 
    },
  });

// Create the model
const UsersModel = mongoose.model('Users', UsersSchema); 

export default UsersModel;