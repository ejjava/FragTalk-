document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const authorEl = document.getElementById('author');
    const dateEl = document.getElementById('date');
    const contentEl = document.getElementById('content');
    const messageCard = document.getElementById('message-card');
    const randomBtn = document.getElementById('random-btn');
    const introModal = document.getElementById('intro-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    let messages = [];
    let currentIndex = -1;

    // 加载留言数据
    async function loadMessages() {
        try {
            const response = await fetch('https://ejjava.rth1.xyz/messages.json');
            messages = await response.json();
            showRandomMessage();
        } catch (error) {
            console.error('加载留言数据失败:', error);
            contentEl.innerHTML = '<p>加载留言失败，请刷新页面重试。</p>';
        }
    }

    // 显示随机留言
    function showRandomMessage() {
        if (messages.length === 0) return;
        
        // 确保不重复显示同一条留言
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * messages.length);
        } while (newIndex === currentIndex && messages.length > 1);
        
        currentIndex = newIndex;
        const message = messages[currentIndex];
        
        // 添加卡片退出动画
        messageCard.classList.add('exit');
        
        setTimeout(() => {
            // 更新内容
            authorEl.textContent = message.author;
            dateEl.textContent = message.date;
            contentEl.innerHTML = `<p>${message.content}</p>`;
            
            // 移除所有动画类
            messageCard.classList.remove('exit', 'active');
            
            // 强制重绘
            void messageCard.offsetWidth;
            
            // 添加卡片进入动画
            messageCard.classList.add('active');
        }, 300);
    }

    // 初始化加载数据
    loadMessages();

    // 随机按钮点击事件
    randomBtn.addEventListener('click', showRandomMessage);

    // 显示介绍弹窗
    function showIntroModal() {
        introModal.classList.add('active');
    }

    // 关闭弹窗
    function closeIntroModal() {
        introModal.classList.remove('active');
    }

    // 页面加载后显示介绍弹窗
    setTimeout(showIntroModal, 1000);

    // 关闭按钮点击事件
    closeModalBtn.addEventListener('click', closeIntroModal);

    // 点击模态框外部关闭
    introModal.addEventListener('click', function(e) {
        if (e.target === introModal) {
            closeIntroModal();
        }
    });

    // 按ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && introModal.classList.contains('active')) {
            closeIntroModal();
        }
    });
});