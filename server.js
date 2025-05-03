const express = require('express');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage (for demo purposes)
const urlDatabase = {};
const urlStats = {};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Shorten URL endpoint
app.post('/api/shorten', (req, res) => {
    const { originalUrl, customAlias } = req.body;
    
    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL format
    try {
        new URL(originalUrl);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    let shortCode = customAlias || shortid.generate();
    
    // Check if custom alias already exists
    if (customAlias && urlDatabase[customAlias]) {
        return res.status(409).json({ error: 'Custom alias already exists' });
    }
    
    urlDatabase[shortCode] = {
        originalUrl,
        shortCode,
        createdAt: new Date(),
        clicks: 0
    };
    
    urlStats[shortCode] = { clicks: 0 };
    
    const shortUrl = `${BASE_URL}/${shortCode}`;
    
    res.json({
        originalUrl,
        shortUrl,
        shortCode
    });
});

// Redirect short URL
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const urlData = urlDatabase[shortCode];
    
    if (!urlData) {
        return res.status(404).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1>404 - URL Not Found</h1>
                    <p>The shortened URL you're looking for doesn't exist.</p>
                    <a href="/" style="color: #667eea; text-decoration: none;">← Go back to URL Shortener</a>
                </body>
            </html>
        `);
    }
    
    // Increment click count
    urlData.clicks++;
    urlStats[shortCode].clicks++;
    
    res.redirect(urlData.originalUrl);
});

// Get URL stats
app.get('/api/stats/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const urlData = urlDatabase[shortCode];
    
    if (!urlData) {
        return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json({
        originalUrl: urlData.originalUrl,
        shortCode: urlData.shortCode,
        clicks: urlData.clicks,
        createdAt: urlData.createdAt
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});