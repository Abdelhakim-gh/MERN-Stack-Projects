import mongoose from 'mongoose';

const { Schema } = mongoose;

const userChatsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    chats: [
        {
            chat_id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const UserChatsModel = mongoose.models.UserChats || mongoose.model('UserChats', userChatsSchema);

export default UserChatsModel;
