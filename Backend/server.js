const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // For parsing application/json

// In-memory store for stocks (use a database in production)
let stocks = []; // Array to store stocks

// POST endpoint to add a new stock
app.post('/api/stocks', (req, res) => {
    const { symbol } = req.body; // Get the stock symbol from the request body

    if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required' });
    }

    // Check if the stock already exists
    if (stocks.find(stock => stock.symbol === symbol)) {
        return res.status(400).json({ error: 'Stock already added' });
    }

    // Add the stock to the list
    stocks.push({ symbol });

    // Return the updated list of stocks
    res.status(200).json({ stocks });
});

// GET endpoint to fetch all stocks
app.get('/api/stocks', (req, res) => {
    res.json(stocks); // Return the list of stocks
});

// DELETE endpoint to remove a stock
app.delete('/api/stocks/:symbol', (req, res) => {
    const { symbol } = req.params;

    // Check if the stock exists
    const stockExists = stocks.some(stock => stock.symbol === symbol);
    if (!stockExists) {
        return res.status(404).json({ error: 'Stock not found' });
    }

    // Remove stock by symbol
    stocks = stocks.filter(stock => stock.symbol !== symbol);

    // Return the updated list of stocks
    res.status(200).json({ stocks });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
