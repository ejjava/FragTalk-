document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const authorEl = document.getElementById('author');
    const dateEl = document.getElementById('date');
    const contentEl = document.getElementById('content');
    const messageCard = document.getElementById('message-card');
    const messageHeader = document.getElementById('message-header');
    const randomBtn = document.getElementById('random-btn');
    const introModal = document.getElementById('intro-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const audioPlayer = document.getElementById('audio-player');
    const audioElement = document.getElementById('audio-element');
    const audioDuration = document.getElementById('audio-duration');
    const audioTime = document.getElementById('audio-time');
    const imageContainer = document.getElementById('image-container');
    const messageImage = document.getElementById('message-image');
    
    let messages = [];
    let currentIndex = -1;

    // 加载留言数据
   async function loadMessages() {
    try {
        // 添加时间戳参数防止缓存
        const timestamp = new Date().getTime();
        const response = await fetch(`https://ejjava.rth1.xyz/messages.json?t=${timestamp}`);
        messages = await response.json();
        showRandomMessage();
    } catch (error) {
        console.error('加载留言数据失败:', error);
        contentEl.innerHTML = '<p>加载留言失败，请刷新页面重试。</p>';
    }
}

    // 格式化时间 (秒 -> MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 更新媒体播放器
    function updateMediaPlayer(message) {
        // 更新图片
        if (message.image) {
            messageImage.src = message.image;
            messageImage.alt = message.content || '留言配图';
            imageContainer.classList.add('active');
        } else {
            imageContainer.classList.remove('active');
        }
        
        // 更新音频
        if (message.audio) {
            audioElement.src = message.audio;
            audioPlayer.classList.add('active');
            
            // 重置时间显示
            audioDuration.textContent = '--:--';
            audioTime.textContent = '00:00';
            
            // 当元数据加载后更新时长
            audioElement.addEventListener('loadedmetadata', function() {
                audioDuration.textContent = formatTime(audioElement.duration);
            });
            
            // 更新时间显示
            audioElement.addEventListener('timeupdate', function() {
                audioTime.textContent = formatTime(audioElement.currentTime);
            });
        } else {
            audioPlayer.classList.remove('active');
        }
        
        // 显示/隐藏头部信息
        if (message.author || message.date) {
            messageHeader.style.display = 'flex';
        } else {
            messageHeader.style.display = 'none';
        }
    }

    // 显示随机留言
    function showRandomMessage() {
        if (messages.length === 0) return;
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * messages.length);
        } while (newIndex === currentIndex && messages.length > 1);
        
        currentIndex = newIndex;
        const message = messages[currentIndex];
        
        messageCard.classList.add('exit');
        
        setTimeout(() => {
            // 更新文本内容
            if (message.content) {
                contentEl.innerHTML = `<p>${message.content}</p>`;
            } else {
                contentEl.innerHTML = '';
            }
            
            // 更新作者和日期
            authorEl.textContent = message.author || '';
            dateEl.textContent = message.date || '';
            
            // 更新媒体内容
            updateMediaPlayer(message);
            
            messageCard.classList.remove('exit', 'active');
            void messageCard.offsetWidth;
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

    // 初始化树叶效果
    const leafSystem = new LeafSystem();
    leafSystem.init();
});