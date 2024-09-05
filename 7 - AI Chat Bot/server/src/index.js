import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'; 
import ImageKit from 'imagekit';

const app = express() // implement backend api
dotenv.config() // allow working with .env 
app.use(express.json()) // parse data to json
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:3000') })) // allow communication with server 
// Connect to MongoDB
// mongoose.connect(`${(process.env.DB_CONNECTION || 'mongodb://localhost:27017')}/ `)
// .then(() => {console.log('Connected to MongoDB!');})
// .catch((error) => {console.error('Connection error', error);});

// imagekit config
const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KITE_ENDPOINT,
    publicKey: process.env.IMAGE_KITE_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KITE_PRIVATE_KEY
});
  
// allow cross-origin requests
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
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

// run the server
const port = (process.env.PORT || 3001)
app.listen(port, () => {
    console.log(`💻 Server is running on port ${port} ...`);
});