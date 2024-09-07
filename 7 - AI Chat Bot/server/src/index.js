import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'; 
import ImageKit from 'imagekit';
import ChatsModel from './models/chat.js'
import UserChatsModel from './models/userChats.js'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import 'dotenv/config' // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY

const app = express() // implement backend api
dotenv.config() // allow working with .env 
app.use(express.json()) // parse data to json
app.use(cors({ 
    origin: (process.env.CLIENT_URL || 'http://localhost:3000'),
    credentials: true
})) // allow communication with server 
// Connect to MongoDB
mongoose.connect(`${(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/AIChat')}`)
.then(() => {console.log('Connected to MongoDB!');})
.catch((error) => {console.error('Connection error', error);});

// imagekit config
const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KITE_ENDPOINT,
    publicKey: process.env.IMAGE_KITE_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KITE_PRIVATE_KEY
});
  
// allow cross-origin requests
// app.use(function(req, res, next) {
// res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Headers", 
//     "Origin, X-Requested-With, Content-Type, Accept");
// next();
// });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", (process.env.CLIENT_URL || 'http://localhost:3000'));
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// test if api is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello 👋 from server ! ' });
});

// uplaod images
app.get('/api/upload', async (req, res) => {
    var result = await imagekit.getAuthenticationParameters();
    res.send(result);
})

// test authentication, you can use authentication information in the server 
app.get(
    '/api/test/auth', 
    ClerkExpressRequireAuth({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        secretKey: process.env.CLERK_SECRET_KEY,
    }), 
    (req, res) => {
        res.json({ message: 'Hello 👋 you are authenticated !', auth: req.auth });   
    }
);

// if user not authenticated will not have acess
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
})

// create chats
app.post(
    "/api/chats", 
    ClerkExpressRequireAuth({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        secretKey: process.env.CLERK_SECRET_KEY,
    }), 
    async (req, res) => {
        const userId = req.auth.userId;

        const { text } = req.body;
        try {
            // Create new chat
            const newChat = new ChatsModel({
                userId: userId,
                history: [{
                    role: 'user',
                    parts: [{ text }]
                }]
            });

            const savedChat = await newChat.save();

            // Check if user chats exist
            let userChats = await UserChatsModel.findOne({ userId: userId });
            if (userChats) {
                // Add new chat to user chats
                await UserChatsModel.updateOne(
                    { userId: userId },
                    {
                        $push: {
                            chats: {
                                chat_id: savedChat._id,
                                title: text.substring(0, 40),
                            }
                        }
                    }
                );
            } else {
                // Create new user chats
                const newUserChat = new UserChatsModel({
                    userId: userId,
                    chats: [{
                        chat_id: savedChat._id,
                        title: text.substring(0, 40),
                    }]
                });

                await newUserChat.save();
            }

            res.status(200).send(newChat._id);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, unable to create chat' });
        }
    }
);
  
// user chats 
app.get(
    "/api/chats", 
    ClerkExpressRequireAuth({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        secretKey: process.env.CLERK_SECRET_KEY,
    }), 
    async (req, res) => {
        const userId = req.auth.userId;
        try {
            const userChats = await UserChatsModel.findOne({ userId: userId });
            res.status(200).send(userChats.chats);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, unable to get user chats' });
        }
    }
);

// user chat
app.get(
    "/api/chats/:chatId", 
    ClerkExpressRequireAuth({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        secretKey: process.env.CLERK_SECRET_KEY,
    }), 
    async (req, res) => {
        const userId = req.auth.userId;
        const { chatId } = req.params;        
        try {
            const chat = await ChatsModel.findOne({ _id: chatId, userId: userId });            
            if (!chat) {
                console.log('No chat found for this user and chatId');
                return res.status(404).json({ error: 'Chat not found' });
            }
            res.status(200).send(chat);
        } catch (error) {
            console.error('Error retrieving chat:', error);
            res.status(500).json({ error: 'Server error, unable to get user chat' });
        }
    }
);

// update user chat
app.put(
    "/api/chats/:chatId", 
    ClerkExpressRequireAuth({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
    }), 
    async (req, res) => {
      const userId = req.auth.userId;
      const { chatId } = req.params;
      const { question, answer } = req.body;
  
      try {
        // Check if the chat exists for the user
        const chat = await ChatsModel.findOne({ _id: chatId, userId: userId });
        if (!chat) {
          console.log('No chat found for this user and chatId');
          return res.status(404).json({ error: 'Chat not found' });
        }
  
        // Build the new items to be added to the history
        const newItems = [];
  
        // Add the user's message if a question is provided
        if (question) {
          newItems.push({
            role: 'user',
            parts: [{ text: question }],
          });
        }
  
        // Add the model's response
        newItems.push({
          role: 'model',
          parts: [{ text: answer }],
        });
  
        // Update the chat document by pushing the new items to the history array
        await ChatsModel.updateOne(
          { _id: chatId, userId: userId },
          {
            $push: {
              history: {
                $each: newItems,
              },
            },
          }
        );
  
        // Optionally, retrieve the updated chat to send back to the client
        const updatedChat = await ChatsModel.findOne({ _id: chatId, userId: userId });
  
        res.status(200).send(updatedChat);
      } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).json({ error: 'Server error, unable to update user chat' });
      }
    }
  );
  

// run the server
const port = (process.env.PORT || 3001)
app.listen(port, () => {
    console.log(`💻 Server is running on port ${port} ...`);
});