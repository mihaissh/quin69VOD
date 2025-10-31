# Quin69 VOD Archive

Browse and watch Quin69's Twitch VODs with chat replay.

![React](https://img.shields.io/badge/React-19.0.0-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-6.2.0-blue)

## Features

- Browse and search VODs by date, title, or game
- Live chat replay synchronized with video
- Chapter navigation for long streams
- Responsive design (mobile/desktop)
- Fast performance with lazy loading

## Quick Start

**Requirements:**
- Node.js 14+

**Installation:**
```bash
npm install
npm start
```

## Configuration

Create a `.env` file:

```env
REACT_APP_CHANNEL=Quin69
REACT_APP_TWITCH_ID=your_twitch_id
REACT_APP_VODS_API_BASE=https://your-api-url
REACT_APP_GITHUB=https://github.com/your-repo
REACT_APP_START_DATE=2020-01-01
REACT_APP_DEFAULT_DELAY=43200
```

## Tech Stack

- React 19 + Material-UI
- Video.js for playback
- Code-split routes for performance

## Commands

```bash
npm start       # Development server
npm run build   # Production build
npm test        # Run tests
```
