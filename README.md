# Quin69 VOD Archive 🎮

A modern website for browsing and watching Quin69's Twitch VODs with chat replay.

![React](https://img.shields.io/badge/React-19.0.0-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-6.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> **✨ Latest Update (Oct 2025)**: Code improvements make the site faster and easier to maintain!

## ✨ Features

- **📺 Browse Videos**: Search through thousands of VODs easily
- **🔍 Smart Filters**: Find videos by date, title, or game
- **💬 Chat Replay**: Relive the chat experience while watching
- **🎯 Quick Navigation**: Jump to different games/sections in long streams
- **📱 Works Everywhere**: Looks great on phones, tablets, and computers
- **⚡ Fast Loading**: Quick and smooth performance
- **🎨 Beautiful Design**: Modern interface with smooth animations
- **♿ Easy to Use**: Keyboard shortcuts and screen reader friendly

## 🚀 For Developers

### Getting Started

**What you need:**
- Node.js (version 14 or newer)
- npm (comes with Node.js)

**Setup:**
1. Download the code
2. Open terminal in the project folder
3. Run `npm install` (installs required packages)
4. Set up your `.env` file (see below)
5. Run `npm start` (opens the site)

**Common Commands:**
```bash
npm start          # Run the site locally
npm run build      # Create production version
npm test           # Run tests
```

## ⚙️ Configuration

You'll need to create a `.env` file with these settings:

```env
REACT_APP_CHANNEL=Quin69                    # Channel name
REACT_APP_TWITCH_ID=your_twitch_id          # Twitch channel ID
REACT_APP_VODS_API_BASE=https://your-api    # Where to get video data
REACT_APP_GITHUB=https://github.com/...     # Your GitHub repo
REACT_APP_START_DATE=2020-01-01             # Archive start date
REACT_APP_DEFAULT_DELAY=43200               # Chat delay (12 hours)
```

**Note**: The chat replay connects to your API to show chat messages. If no chat data is available, it will show an empty chat panel.

## 🏗️ How It's Built

This site is built with modern web technologies to ensure it's fast, reliable, and easy to maintain:

- **React** - The main framework
- **Material-UI** - Makes it look beautiful
- **Video.js** - Plays the videos smoothly
- **Smart Loading** - Only loads what you need, when you need it

**Why it's fast:**
- Pages load quickly with smart caching
- Search results appear as you type
- Videos start playing without delay
- Works smoothly even on slower connections

## 🎯 Recent Updates

### October 2025 ✨

✅ Updated to latest standards - Site runs faster  
✅ Improved code quality - Easier to fix bugs and add features  
✅ Better performance - Pages load quicker  
✅ Cleaner codebase - Ready for future improvements  

**Bottom line**: The site now runs smoother and is easier to improve! 🚀

**Made with ❤️ for the Quin69 community**