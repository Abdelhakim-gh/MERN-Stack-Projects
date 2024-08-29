import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';
import { Timestamp } from 'bson';

dotenv.config(); // Load environment variables

const { Schema } = mongoose; // Destructure Schema from mongoose

// Define the schema
const PostSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    summary: { 
      type: String, 
    },
    content: { 
      type: String, 
    },
    cover: { 
      type: String, 
    },
    author: {
      type: Schema.Types.ObjectId, ref:'Users'
    }
}, { timestamps: true });

// Create the model
const PostsModel = mongoose.model('Posts', PostSchema); 

export default PostsModel;