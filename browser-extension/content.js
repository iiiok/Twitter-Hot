// Twitter Hot Content Quick Add - Content Script
// Injects "Add to Hot" buttons on Twitter/X pages

(function () {
    'use strict';

    // Configuration
    let API_ENDPOINT = 'https://twitterhot.vercel.app/api/update';
    const BUTTON_ID_PREFIX = 'hot-content-btn-';
    const addedTweets = new Set(); // Track already added tweets

    // Load API endpoint from storage
    chrome.storage.sync.get(['apiEndpoint'], (result) => {
        if (result.apiEndpoint) {
            API_ENDPOINT = result.apiEndpoint;
        }
    });

    // Extract tweet ID from URL or element
    function getTweetId(element) {
        // Try to find the link to the tweet
        const link = element.querySelector('a[href*="/status/"]');
        if (!link) return null;

        const match = link.href.match(/\/status\/(\d+)/);
        return match ? match[1] : null;
    }

    // Get tweet URL from tweet ID
    function getTweetUrl(tweetId, username) {
        // Use x.com as the canonical URL
        return `https://x.com/${username}/status/${tweetId}`;
    }

    // Extract username from tweet element
    function getUsername(element) {
        const usernameLink = element.querySelector('a[href^="/"][href*="/status/"]');
        if (!usernameLink) return null;

        const match = usernameLink.href.match(/\.com\/([^/]+)\//);
        return match ? match[1] : null;
    }

    // Add tweet to hot content via API
    async function addToHotContent(tweetUrl, button, tweetId) {
        if (addedTweets.has(tweetId)) {
            showNotification('Already added to collection', 'info');
            return;
        }

        // Disable button and show loading state
        button.disabled = true;
        button.classList.add('loading');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span>Adding...</span>';

        try {
            // Get current date in local timezone (YYYY-MM-DD format)
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const today = `${year}-${month}-${day}`;

            console.log('[Hot Content] Adding tweet:', {
                date: today,
                localTime: now.toLocaleString(),
                url: tweetUrl
            });

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: today,
                    urls: [tweetUrl]
                })
            });

            console.log('[Hot Content] API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Hot Content] API Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('[Hot Content] API Success:', data);

            // Mark as added
            addedTweets.add(tweetId);
            button.classList.remove('loading');
            button.classList.add('added');
            button.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <span>Added!</span>
      `;

            showNotification('✓ Added to hot content!', 'success');

            // Keep the "Added" state
            setTimeout(() => {
                button.disabled = true;
            }, 100);

        } catch (error) {
            console.error('Error adding to hot content:', error);
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = originalHTML;
            showNotification('✗ Failed to add. Please try again.', 'error');
        }
    }

    // Show notification toast
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.hot-content-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `hot-content-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Inject menu item into Twitter's dropdown menu
    function injectMenuOption(tweetElement) {
        const tweetId = getTweetId(tweetElement);
        if (!tweetId) {
            console.log('[Hot Content] No tweet ID found');
            return;
        }

        const username = getUsername(tweetElement);
        if (!username) {
            console.log('[Hot Content] No username found for tweet', tweetId);
            return;
        }

        const tweetUrl = getTweetUrl(tweetId, username);

        // Find the "more" button (three dots)
        const moreButton = tweetElement.querySelector('[data-testid="caret"]');
        if (!moreButton) {
            console.log('[Hot Content] No more button found for tweet', tweetId);
            return;
        }

        // Mark this tweet as processed
        if (moreButton.hasAttribute('data-hot-content-processed')) return;
        moreButton.setAttribute('data-hot-content-processed', 'true');

        console.log('[Hot Content] Attached listener to tweet', tweetId);

        // Listen for menu opening
        moreButton.addEventListener('click', () => {
            console.log('[Hot Content] More button clicked for tweet', tweetId);
            // Wait for menu to appear
            setTimeout(() => {
                injectIntoMenu(tweetId, tweetUrl);
            }, 100);
        });
    }

    // Inject our option into the opened menu
    function injectIntoMenu(tweetId, tweetUrl) {
        console.log('[Hot Content] Attempting to inject menu for tweet', tweetId);

        // Find the dropdown menu
        const menu = document.querySelector('[role="menu"]');
        if (!menu) {
            console.log('[Hot Content] No menu found!');
            return;
        }

        console.log('[Hot Content] Menu found:', menu);

        // Check if our option already exists
        if (menu.querySelector('.hot-content-menu-item')) {
            console.log('[Hot Content] Menu item already exists');
            return;
        }

        // Find the dropdown container
        const dropdown = menu.querySelector('[data-testid="Dropdown"]');
        if (!dropdown) {
            console.log('[Hot Content] No dropdown container found!');
            return;
        }

        console.log('[Hot Content] Dropdown container found, injecting menu item...');

        // Create our menu item
        const menuItem = document.createElement('div');
        menuItem.className = 'hot-content-menu-item css-175oi2r r-1loqt21 r-18u37iz r-1mmae3n r-3pj75a r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';
        menuItem.setAttribute('role', 'menuitem');
        menuItem.setAttribute('tabindex', '0');

        const isAdded = addedTweets.has(tweetId);

        menuItem.innerHTML = `
            <div class="css-175oi2r r-1777fci r-faml9v">
                <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-1q142lx">
                    <g><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></g>
                </svg>
            </div>
            <div class="css-175oi2r r-16y2uox r-1wbh5a2">
                <div dir="ltr" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q" style="color: rgb(231, 233, 234);">
                    <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">
                        ${isAdded ? '✓ Added to Hot Content' : 'Add to Hot Content'}
                    </span>
                </div>
            </div>
        `;

        // Add click handler
        menuItem.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Close the menu by clicking outside
            document.body.click();

            await addToHotContent(tweetUrl, menuItem, tweetId);
        });

        // Add hover effect
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.backgroundColor = 'rgba(231, 233, 234, 0.1)';
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = '';
        });

        // Insert at the top of the dropdown
        const firstItem = dropdown.querySelector('[role="menuitem"]');
        if (firstItem) {
            dropdown.insertBefore(menuItem, firstItem);
            console.log('[Hot Content] Menu item inserted successfully!');
        } else {
            dropdown.appendChild(menuItem);
            console.log('[Hot Content] Menu item appended to dropdown');
        }
    }

    // Process all tweets on the page
    function processAllTweets() {
        // Twitter/X uses article elements for tweets
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        tweets.forEach(tweet => {
            injectMenuOption(tweet);
        });
    }

    // Observe DOM changes to catch dynamically loaded tweets
    const observer = new MutationObserver((mutations) => {
        processAllTweets();
    });

    // Start observing when DOM is ready
    function init() {
        processAllTweets();

        // Observe the main timeline for new tweets
        const timeline = document.querySelector('main');
        if (timeline) {
            observer.observe(timeline, {
                childList: true,
                subtree: true
            });
        }
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-process on navigation (Twitter is a SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(processAllTweets, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();
