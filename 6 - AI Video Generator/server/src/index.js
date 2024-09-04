import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import uniqid from 'uniqid'
import fs from 'fs'
import mongoose from 'mongoose'; // Import mongoose
import {GPTScript, RunEventType} from "@gptscript-ai/gptscript"

const app = express() // implement backend api
dotenv.config() // allow working with .env 
app.use(express.json()) // parse data to json
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:3000') })) // allow communication with server 
// // Connect to MongoDB
// mongoose.connect(`${(process.env.DB_CONNECTION || 'mongodb://localhost:27017')}/ `)
// .then(() => {console.log('Connected to MongoDB!');})
// .catch((error) => {console.error('Connection error', error);});

// initialise gptscript
const gpt = new GPTScript({
    APIKey: process.env.OPENAI_API_KEY,
    DefaultModel: 'gpt-4o-mini'
})


// test if api working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello 👋 from server ! ' });
});

// create story 
app.get('/api/create', async (req, res) => {
    const url = req.query.url
    console.log("Url:", url);

    const dir = uniqid()
    const path = './src/stories/' + dir
    fs.mkdirSync(path, {recursive: true})

    try {
        console.log("About to run gpt script");
        const run = await gpt.run('./src/generateStory.gpt', {
            input: `--url ${url} --${dir}`,
            disableCache: true,  
        })        
        console.log("Awaiting results");
        run.on(RunEventType.Event, (e) => {
            if (e.type === RunEventType.CallFinish && e.output) {
                console.log("Output:", e.output);
            }
        })

        const result = await run.text()
        return res.json(result)
    } catch (error) {
        console.log("Error:", error);
    }
});

//  run the server
const port = (process.env.PORT || 3001)
app.listen(port, () => {
    console.log(`💻 Server is running on port ${port} ...`);
});