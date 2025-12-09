// 临时测试脚本 - 直接在 Twitter 控制台运行
// 这个脚本可以帮助测试菜单注入功能是否正常工作

(function () {
    console.log('🔥 Hot Content Test Script Started');

    // 测试：找到所有推文
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    console.log('✅ Found', tweets.length, 'tweets');

    if (tweets.length === 0) {
        console.log('❌ No tweets found! Make sure you are on Twitter timeline.');
        return;
    }

    // 测试：找到第一条推文的更多按钮
    const firstTweet = tweets[0];
    const moreButton = firstTweet.querySelector('[data-testid="caret"]');

    if (!moreButton) {
        console.log('❌ No more button found in first tweet');
        return;
    }

    console.log('✅ Found more button:', moreButton);

    // 添加点击监听
    moreButton.addEventListener('click', () => {
        console.log('🎯 More button clicked!');

        setTimeout(() => {
            const menu = document.querySelector('[role="menu"]');
            if (!menu) {
                console.log('❌ Menu not found');
                return;
            }

            console.log('✅ Menu found:', menu);

            const dropdown = menu.querySelector('[data-testid="Dropdown"]');
            if (!dropdown) {
                console.log('❌ Dropdown container not found');
                return;
            }

            console.log('✅ Dropdown container found:', dropdown);
            console.log('✅ Menu items count:', dropdown.querySelectorAll('[role="menuitem"]').length);

            // 创建测试菜单项
            const testItem = document.createElement('div');
            testItem.className = 'css-175oi2r r-1loqt21 r-18u37iz r-1mmae3n r-3pj75a r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';
            testItem.setAttribute('role', 'menuitem');
            testItem.style.backgroundColor = 'rgba(29, 155, 240, 0.2)';
            testItem.innerHTML = `
                <div class="css-175oi2r r-16y2uox r-1wbh5a2">
                    <div dir="ltr" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q" style="color: rgb(29, 155, 240);">
                        <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">
                            🔥 TEST MENU ITEM
                        </span>
                    </div>
                </div>
            `;

            testItem.addEventListener('click', () => {
                alert('Test menu item clicked!');
            });

            const firstMenuItem = dropdown.querySelector('[role="menuitem"]');
            if (firstMenuItem) {
                dropdown.insertBefore(testItem, firstMenuItem);
                console.log('✅ Test menu item inserted!');
            }
        }, 150);
    });

    console.log('✅ Listener attached. Now click the ⋯ button on the first tweet!');
})();
