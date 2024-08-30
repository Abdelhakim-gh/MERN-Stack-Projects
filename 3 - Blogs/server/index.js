import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import UsersModel from './models/Users.js'
import PostsModel from './models/Posts.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url';

const app = express() // implement backend api
dotenv.config() // allow working with .env 
app.use(express.json()) // parse data to json
app.use(cors({ 
    credentials: true, 
    origin: (process.env.CLIENT_URL || 'http://localhost:3000') 
})) // allow communication with server 
app.use(cookieParser()) // allow reading cookies
const secretkey = (process.env.JWT_TOKEN || 'secret56555878461')
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
const upload = multer({ dest: './server/uploads' }) // upload file to server
// For JSON payloads
app.use(express.json({ limit: '50mb' }));
// For form-data payloads (file uploads)
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Connect to MongoDB
mongoose.connect(`${(process.env.DB_CONNECTION || 'mongodb://localhost:27017')}/Blogs`, {
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((error) => {
  console.error('Connection error', error);
});

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// test if api is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello 👋 from server ! ' });
});

// post resgister 
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body
    console.log({ username, email, password })
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new UsersModel({ username, email, password: hashedPassword });
        const savedUser = await user.save();
        console.log(savedUser)
        res.json({ savedUser })
    } catch(error) {
        res.status(400).json(error.message);
    }
});

// post login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await UsersModel.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            // json web token
            jwt.sign({id: user._id, username}, secretkey, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token).json({
                   id: user._id,
                   username
                })
            })
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch(error) {
        res.status(400).json(error.message);
    }
});

// get user information {id & username} when logged in from cookie data
app.get('/api/profile', (req, res) => {
    const { token } = req.cookies
    // if (!token) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }
    jwt.verify(token, secretkey, {}, (err, info) => {
        if (err) throw err 
        res.json(info)
    })
});


// logout user 
app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json('Logged out')
});

// create blog / post
app.post('/api/blog', upload.single('file'), async (req, res) => {

    console.log(req.body); // Will log the title, summary, and content
    console.log(req.file); // Will log the file details

    // Extract the extension from the original filename
    const originalExtension = path.extname(req.file.originalname);
    // Construct the new file name with the extension
    const newFilePath = path.join(req.file.destination, req.file.filename + originalExtension);

    try {
        // Rename the file on the server
        fs.renameSync(req.file.path, newFilePath);
        const { token } = req.cookies
        jwt.verify(token, secretkey, {}, async (err, info) => {
            if (err) throw err 
            const post = await PostsModel.create({
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                cover: newFilePath,
                author: info.id
            })
            res.json({post});
        })
    } catch (error) {
        console.error(error.message);
        // res.status(500).json({ error: 'File renaming failed' });
    }
});

// get blogs
app.get('/api/blogs', async (req, res) => {
    // retrive all blogs also the author data from user table using populate()
    const posts = await PostsModel.find().populate('author', ['username']).sort({createdAt: -1}).limit(20);
    res.json(posts);
});

// get blog by id
app.get('/api/blog/:id', async (req, res) => {
    const { id } = req.params
    const post = await PostsModel.findById(id).populate('author', ['username']);
    res.json(post);
});

// update blog / post
app.put('/api/blog/edit/:id', upload.single('file'), async (req, res) => {
    
    let newFilePath = null;
    // Check if a file is uploaded and rename it
    if (req.file) {
        try {
            console.log("File uploaded:", req.file);
            // Extract the extension from the original filename
            const originalExtension = path.extname(req.file.originalname);
            // Construct the new file name with the extension
            newFilePath = path.join(req.file.destination, req.file.filename + originalExtension);
            // Rename the file on the server
            fs.renameSync(req.file.path, newFilePath);
            console.log("File renamed to:", newFilePath);
        } catch (error) {
            console.error('File renaming error:', error); // Log the entire error object
            return res.status(500).json({ error: 'File renaming failed' });
        }
    }

    // Get the author of the post
    const { token } = req.cookies;
    jwt.verify(token, secretkey, {}, async (err, info) => {
        if (err) {
            console.error("JWT verification error:", err); // Log JWT verification errors
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params; // Extract the id from the URL parameters
        const { title, summary, content } = req.body;

        try {
            console.log("Finding post with ID:", id);
            const post = await PostsModel.findById(id);
            if (!post) {
                console.error("Post not found for ID:", id); // Log when post isn't found
                return res.status(404).json({ error: 'Post not found' });
            }

            console.log("Post found:", post);
            console.log("User Info:", info);

            // Check if the user is the author of the post
            if (post.author.toString() !== info.id.toString()) {
                console.error("User not authorized:", info.id); // Log unauthorized access
                return res.status(403).json({ error: 'Not authorized' });
            }

            // Proceed with updating the post
            const updatedPost = await post.updateOne({
                title,
                summary,
                content,
                cover: newFilePath ? newFilePath : post.cover
            });

            console.log("Post updated successfully:", updatedPost);
            res.json(updatedPost);
        } catch (error) {
            console.error('Database update error:', error); // Log the entire error object
            res.status(500).json({ error: 'Database update failed' });
        }
    });
});

// delete blog / post 
app.delete('/api/blog/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secretkey, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }
        const post = await PostsModel.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        if (post.author.toString() !== info.id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }
        await post.deleteOne();
        res.json({ success: true, message: 'Post deleted successfully' });
    })
})    

// get user profile
app.get('/api/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;

    // Check if the token is present in cookies
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, secretkey, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }

        try {
            // Check if the user in the token matches the requested profile
            if (info.id === id) {
                const user = await UsersModel.findById(id);
                if (!user) {
                    return res.status(404).json({ success: false, error: 'User not found' });
                }
                // Send the user information if found
                res.json({ success: true, data: user });
            } else {
                console.error("User not authorized:", info.id); // Log unauthorized access
                return res.status(403).json({ success: false, error: 'Not authorized' });
            }
        } catch (error) {
            console.error('Server error:', error.message);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });
});

// update user profile
app.put('/api/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    const { username, email, password } = req.body;

    try {
      // Verify the JWT token
      jwt.verify(token, secretkey, {}, async (err, info) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if the user is the same as the one in the token
        if (info.id === id) {
          const user = await UsersModel.findOne({ _id: id });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Update the user's profile
          user.username = username || user.username;
          user.email = email || user.email;

          // Hash the password if it's being updated
          if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
          }

          await user.save();
          res.json({ success: true, message: 'Profile updated successfully', user });
        } else {
          console.error("User not authorized:", info.id); // Log unauthorized access
          return res.status(403).json({ error: 'Not authorized' });
        }
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('💻 Server is running on port 3001 ...');
});