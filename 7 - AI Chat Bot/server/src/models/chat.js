import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChatSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    history: [
        {
            role: {
                type: String,
                enum: ['user', 'model'], // Corrected enum syntax
                required: true
            },
            parts: [
                {
                    text: {
                        type: String,
                        required: true
                    }
                }
            ],
            image: {
                type: String
            }
        }
    ]
}, { timestamps: true });

const ChatsModel = mongoose.models.Chats || mongoose.model('Chats', ChatSchema);

export default ChatsModel;
