import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { Schema } = mongoose; // Destructure Schema from mongoose

// Define the schema
const UsersSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
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