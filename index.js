const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moneytracker'/*, { useNewUrlParser: true, useUnifiedTopology: true }*/);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String,
});

// Define the Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/add', async (req, res) => {
    const { description, amount, type } = req.body;

    // Create a new transaction
    const newTransaction = new Transaction({
        description,
        amount,
        type,
    });

    // Save the transaction to the database
    await newTransaction.save();

    res.redirect('/');
});

app.get('/transactions', async (req, res) => {
    // Retrieve all transactions from the database
    const transactions = await Transaction.find();

    res.json(transactions);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
