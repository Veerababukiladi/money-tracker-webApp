const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.lqkhhhz.mongodb.net/money-tracker-app`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/add', async (req, res) => {
    const { description, amount, type } = req.body;

    const newTransaction = new Transaction({
        description,
        amount,
        type,
    });

    await newTransaction.save();

    res.redirect('/');
});

app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find();

    res.json(transactions);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
