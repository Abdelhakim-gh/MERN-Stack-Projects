import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import UsersModel from './models/Users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { use } from 'bcrypt/promises.js'

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173'),
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({ message: 'Hello 👋 from server!' })
})

const secret = 'secret123'
app.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new UsersModel({ email, password: hashedPassword });
        const savedUser = await user.save();
        console.log(savedUser);
        jwt.sign({id: savedUser._id, email: savedUser.email}, secret, (err, token) => {
            if (err) {
                console.error("Error signing token:", err);
                res.status(500).json({ message: "Error signing token" });
            } else {
                res.cookie('token', token).send().json({ 
                    message: "User registered successfully!", id: savedUser._id, email: savedUser.email  
                });
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
})

app.get('/user', (req, res) => {
    const payload = jwt.verify(req.cookies.token, secret)
    UsersModel.findById(payload.id).then(userInfo => {
        res.json({id: userInfo._id, email: userInfo.email});
    });

})

app.listen(process.env.PORT || 3000, () => {
    console.log('💻 Server started on port 3000...')
})
