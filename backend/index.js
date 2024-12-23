const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // Import CORS
const config = require("./config/config.js");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();


// Allow requests from both localhost and the network IP
const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.0.107:3000'], // Add your network device's IP address here if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Enable cookies if needed
  };
  
  app.use(cors(corsOptions)); // Apply the CORS middleware

// Middleware to parse JSON requests
app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);

// Task routes
app.use("/api/tasks", taskRoutes);



// Basic route for testing

app.get('/',(req, res)=>{
    res.send("Task Manager API is running ...");
} );

// connect to MongoDB
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true, // Parses connection string
    useUnifiedTopology: true, // Enables the new Server Discover and Monitoring engine
    serverSelectionTimeoutMS: 10000, // Wait up to 10 seconds for server selection
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit process if connection fails
    });

// Start the server
const PORT = config.PORT || 5000;
const HOST = '0.0.0.0'; // Makes the server accessible on the local network
app.listen(PORT, HOST, () => {
    console.log(`Server running on port ${PORT}`);
});