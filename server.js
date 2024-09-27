const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const uri = "mongodb+srv://latieyz96:hair1234@cluster0.ds9zr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// middleware
app.use(express.json());

// schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// create model
const User = mongoose.model('User', userSchema);

// connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('connected to mongoDB Atlas');
})
.catch((err) => {
    console.error('failed to connect to mongoDB Atlas:', err);
});

app.get('/', (req, res) => {
    res.send('Welcome client');
});

app.get('/Information', (req, res) => {
    res.send('Information page');
});

app.post('/users', async (req, res) => {
    try { 
        const newUser = new User({
            name: req.body.name,
            age: req.body.age,
        });
        await newUser.save();
        res.json({
            message: 'Data saved successfully',
            Data: newUser
        });
    } catch (err) { 
        res.status(500).json({ 
            message: 'failed to save data',
            error: err.message
        });
    }
});


app.get('/users/:id', async (req, res) => {
    try { 
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({messge: 'user not found'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'failed to retrive user',
            error: error.message
        })
      }
    });

    app.get('/users', async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) { 
            res.status(500).json({ 
                message: 'failed to retrive users',
                error: err.message
            });
        }
    });

    app.delete('/deleteUsers/:id', async (req, res) => {
        const userId = req.params.id;
    
        // Validate MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
    
        try {
            // Find the user by ID and delete it
            const user = await User.findByIdAndDelete(userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({
                message: 'User deleted successfully',
                data: user
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Failed to delete user',
                error: error.message
            });
        }
    });
    
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
