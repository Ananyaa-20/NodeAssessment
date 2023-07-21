const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/url_shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
});

const Url = mongoose.model('Url', UrlSchema);

app.use(express.json());
app.post('/api/shorten', async (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }
  
    const existingUrl = await Url.findOne({ longUrl });
    if (existingUrl) {
      return res.json({ shortUrl: existingUrl.shortUrl });
    }
  
    const shortUrl = shortid.generate();
    const url = new Url({ longUrl, shortUrl });
    await url.save();
  
    return res.json({ shortUrl });
  });
  
  // Redirect to original URL
  app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
  
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  
    if (url.expiresAt && url.expiresAt <= Date.now()) {
      return res.status(404).json({ error: 'Short URL has expired' });
    }
  
    return res.redirect(url.longUrl);
  });
  
  // Run the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  //Api-Link : http://localhost:3000/api/shorten
  