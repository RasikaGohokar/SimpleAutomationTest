// --- index.js ---

// 1. Import Dependencies
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 2. Initial Setup
const app = express();
const PORT = 8000; // Must match the API_URL port in the React app
const JWT_SECRET = 'your-super-secret-key-that-is-long-and-secure'; // In a real app, use an environment variable

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// 3. In-Memory Database (for demonstration purposes)
let users = [];
let items = [];
let userIdCounter = 1;
let itemIdCounter = 1;

// --- 4. Authentication Middleware ---
// This function will be used to protect our routes
const authMiddleware = (req, res, next) => {
    // Get token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ message: "Unauthorized: No token provided" }); // No token found
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" }); // Token is not valid
        }
        // If the token is valid, attach the user payload to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};


// --- 5. API Endpoints ---

// --- Authentication Routes ---

// POST /signup - Register a new user
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "Username already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and store the new user
    const newUser = { id: userIdCounter++, username, password: hashedPassword };
    users.push(newUser);
    console.log('Users:', users);

    // Generate a JWT for the new user
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
    
    // Return the token
    res.status(201).json({ token });
});


// POST /login - Authenticate a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // If credentials are correct, generate and return a JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// --- To-Do Item Routes (Protected) ---

// GET /items - Get all items for the authenticated user
app.get('/items', authMiddleware, (req, res) => {
    // Filter items that belong to the logged-in user
    const userItems = items.filter(item => item.userId === req.user.id);
    res.json(userItems);
});

// POST /items - Create a new item
app.post('/items', authMiddleware, (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: "Item text cannot be empty" });
    }
    const newItem = {
        id: itemIdCounter++,
        text,
        userId: req.user.id // Associate item with the authenticated user
    };
    items.push(newItem);
    console.log('Items:', items);
    res.status(201).json(newItem);
});

// PUT /items/:id - Update an existing item
app.put('/items/:id', authMiddleware, (req, res) => {
    const { text } = req.body;
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    // Check if item exists
    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item belongs to the user
    if (items[itemIndex].userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this item" });
    }

    // Update the item
    items[itemIndex].text = text;
    res.json(items[itemIndex]);
});

// DELETE /items/:id - Delete an item
app.delete('/items/:id', authMiddleware, (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    // Check if item exists
    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    // Check if the item belongs to the user
    if (items[itemIndex].userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this item" });
    }

    // Remove the item from the array
    items.splice(itemIndex, 1);
    res.status(200).json({ message: "Item deleted successfully" });
});


// --- 6. Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/*
--- How to Run This Backend ---

1.  **Save the code:** Save the code above into a file named `index.js`.

2.  **Create a `package.json` file:**
    In the same directory, run the command:
    `npm init -y`

3.  **Install dependencies:**
    Run the following command to install the necessary packages:
    `npm install express cors jsonwebtoken bcryptjs`

4.  **Start the server:**
    Run the command:
    `node index.js`

    You should see the message "Server is running on http://localhost:8000" in your terminal.
    Now the backend is ready to accept requests from the React frontend.
*/
