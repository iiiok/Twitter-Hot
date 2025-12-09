# Twitter Hot Content Quick Add - Browser Extension

A Chrome/Firefox browser extension that allows you to quickly add tweets to your hot content collection while browsing Twitter/X.

## Features

- 🌟 **One-Click Add**: Click the "Add to Hot" button on any tweet
- 🔄 **Auto-Detection**: Automatically detects tweets as you scroll
- ✅ **Visual Feedback**: Success/error notifications
- ⚙️ **Configurable**: Set your own API endpoint
- 📱 **Responsive**: Works on desktop and mobile Twitter
- 🎨 **Native Look**: Matches Twitter's UI design

## Installation

### Chrome/Edge

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `browser-extension` folder
6. Done! The extension is now installed

### Firefox

1. Download or clone this repository
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the `browser-extension` folder and select `manifest.json`
5. Done! The extension is now installed (temporary)

## Setup

1. Click the extension icon in your browser toolbar
2. Enter your API endpoint (default: `https://twitterhot.vercel.app/api/update`)
3. Click "Save Settings"
4. Browse Twitter/X and start adding tweets!

## Usage

### Method 1: On-Page Button
1. Browse Twitter/X normally
2. Find a tweet you want to add
3. Click the "⭐ Add to Hot" button in the tweet's action bar
4. See the success notification!

### Method 2: Manual URL
1. Click the extension icon
2. Paste a tweet URL in the "Quick Add URL" field
3. Click "Add to Collection"

## API Endpoint

The extension sends POST requests to your API endpoint with the following format:

```json
{
  "date": "2025-12-06",
  "urls": ["https://x.com/username/status/123456789"]
}
```

Expected response:
```json
{
  "ok": true,
  "message": "成功保存 1 个链接（新增 1 个）",
  "totalUrls": 1,
  "newUrls": 1
}
```

## Configuration

### Change API Endpoint
1. Click the extension icon
2. Update the "API Endpoint" field
3. Click "Save Settings"
4. Twitter tabs will reload automatically

### Local Development
For local testing, set the API endpoint to:
```
http://localhost:3000/api/update
```

## Troubleshooting

### Buttons not appearing
- Refresh the Twitter page
- Check if the extension is enabled
- Open DevTools Console and look for errors

### "Failed to add" error
- Verify your API endpoint is correct
- Check if the API is accessible
- Ensure CORS is properly configured on your server

### Extension not loading
- Make sure you selected the correct folder
- Check that `manifest.json` exists
- Look for errors in `chrome://extensions/`

## File Structure

```
browser-extension/
├── manifest.json       # Extension configuration
├── content.js          # Main script (injected into Twitter)
├── content.css         # Button and notification styles
├── popup.html          # Settings popup UI
├── popup.js            # Settings popup logic
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Privacy

This extension:
- ✅ Only runs on twitter.com and x.com
- ✅ Only sends tweet URLs you explicitly click "Add" on
- ✅ Stores API endpoint locally in your browser
- ❌ Does NOT track your browsing
- ❌ Does NOT collect personal data
- ❌ Does NOT send data to third parties

## Development

### Making Changes
1. Edit the files in `browser-extension/`
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload Twitter page to see changes

### Debugging
- Open DevTools on Twitter page
- Check Console for content script logs
- Right-click extension icon → "Inspect popup" for popup debugging

## License

MIT License - Feel free to modify and use as you wish!

## Support

For issues or questions, please check:
1. This README
2. Browser DevTools Console for errors
3. API endpoint accessibility

---

**Version**: 1.0.0  
**Author**: Your Name  
**Last Updated**: 2025-12-06
