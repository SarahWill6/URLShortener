# URLShortener

A simple URL shortening service built with Node.js and Express.

## Features
- Shorten long URLs with automatic ID generation
- Custom aliases for personalized short URLs
- Click tracking and statistics
- Clean and responsive web interface
- Local storage for recent URLs

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SarahWill6/URLShortener.git
cd URLShortener
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and go to `http://localhost:3000`

## Usage

1. Enter a long URL in the input field
2. Optionally add a custom alias
3. Click "Shorten URL" to generate a short link
4. Copy and share your shortened URL
5. View recent URLs in the history section

## API Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /:shortCode` - Redirect to original URL
- `GET /api/stats/:shortCode` - Get URL statistics

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```