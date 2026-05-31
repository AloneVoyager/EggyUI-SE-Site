// ==================== DOM 元素 ====================
const mainContainer = document.getElementById('mainContainer');
const titleBar = document.getElementById('titleBar');
const closeBtn = document.getElementById('closeBtn');
const bgm = document.getElementById('bgm');
const musicToggle = document.getElementById('musicToggle');
const volumeSlider = document.getElementById('volumeSlider');
const iconPlay = document.querySelector('.icon-play');
const iconPause = document.querySelector('.icon-pause');

// ==================== 窗口拖动功能 ====================
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

titleBar.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

// 触摸设备拖动支持
titleBar.addEventListener('touchstart', startDragTouch, { passive: false });
document.addEventListener('touchmove', dragTouch, { passive: false });
document.addEventListener('touchend', stopDrag);

function startDrag(e) {
    if (e.target === closeBtn || closeBtn.contains(e.target)) {
        return;
    }
    
    isDragging = true;
    const rect = mainContainer.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
}

function startDragTouch(e) {
    if (e.target === closeBtn || closeBtn.contains(e.target)) {
        return;
    }

    if (e.touches.length !== 1) {
        return;
    }
    
    isDragging = true;
    const touch = e.touches[0];
    const rect = mainContainer.getBoundingClientRect();
    dragOffset.x = touch.clientX - rect.left;
    dragOffset.y = touch.clientY - rect.top;
}

function drag(e) {
    if (!isDragging) {
        return;
    }
    
    e.preventDefault();
    
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    // 边界限制
    const maxX = window.innerWidth - mainContainer.offsetWidth;
    const maxY = window.innerHeight - mainContainer.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    mainContainer.style.position = 'fixed';
    mainContainer.style.left = newX + 'px';
    mainContainer.style.top = newY + 'px';
}

function dragTouch(e) {
    if (!isDragging) {
        return;
    }

    if (e.touches.length !== 1) {
        return;
    }
    
    e.preventDefault();
    
    const touch = e.touches[0];
    let newX = touch.clientX - dragOffset.x;
    let newY = touch.clientY - dragOffset.y;
    
    // 边界限制
    const maxX = window.innerWidth - mainContainer.offsetWidth;
    const maxY = window.innerHeight - mainContainer.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    mainContainer.style.position = 'fixed';
    mainContainer.style.left = newX + 'px';
    mainContainer.style.top = newY + 'px';
}

function stopDrag() {
    if (isDragging) {
        isDragging = false;
        titleBar.style.cursor = 'move';
    }
}

// ==================== 关闭容器 ====================
closeBtn.addEventListener('click', () => {
    // 添加关闭动画
    mainContainer.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    mainContainer.style.transform = 'scale(0.95)';
    mainContainer.style.opacity = '0';
    
    setTimeout(() => {
        // 关闭标签页
        window.close();
        
        // 备用方案：如果无法关闭，则隐藏容器
        setTimeout(() => {
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Segoe UI,sans-serif;color:#666;">EggyUI-SE 已关闭</div>';
        }, 100);
    }, 300);
});

// ==================== 背景音乐控制 ====================
let isPlaying = false;

// 音量控制
bgm.volume = volumeSlider.value / 100;
volumeSlider.addEventListener('input', (e) => {
    bgm.volume = e.target.value / 100;
});

// 触摸设备：点击音乐播放器切换音量控制显示
const musicPlayer = document.getElementById('musicPlayer');
musicPlayer.addEventListener('click', (e) => {
    if (e.target === musicToggle || musicToggle.contains(e.target)) return;
    musicPlayer.classList.toggle('volume-visible');
});

// 播放/暂停切换
musicToggle.addEventListener('click', async () => {
    // 触摸设备上播放时显示音量控制
    if ('ontouchstart' in window) {
        musicPlayer.classList.add('volume-visible');
    }
    
    try {
        if (!isPlaying) {
            await bgm.play();
            isPlaying = true;
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
            musicToggle.classList.add('playing');
        } else {
            bgm.pause();
            isPlaying = false;
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
            musicToggle.classList.remove('playing');
        }
    } catch (error) {
        console.log('音频播放需要用户交互:', error);
        // 显示提示
        showMusicHint();
    }
});

// 音乐提示
function showMusicHint() {
    const hint = document.createElement('div');
    hint.className = 'music-hint';
    hint.textContent = '点击播放背景音乐 🎵';
    hint.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 24px;
        background: rgba(255, 255, 255, 0.95);
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: fadeInUp 0.3s ease;
    `;
    
    document.body.appendChild(hint);
    
    setTimeout(() => {
        hint.style.animation = 'fadeOutDown 0.3s ease forwards';
        setTimeout(() => hint.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOutDown {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
    }
`;
document.head.appendChild(style);

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
    // Esc 关闭
    if (e.key === 'Escape') {
        closeBtn.click();
    }
    
    // 空格键 播放/暂停音乐
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        musicToggle.click();
    }
});

// ==================== 响应式布局切换 ====================
const mediaQuery = window.matchMedia('(max-width: 768px)');

function handleResponsiveChange(e) {
    if (e.matches) {
        // 切换到移动端：强制全屏
        mainContainer.style.position = 'fixed';
        mainContainer.style.top = '0';
        mainContainer.style.left = '0';
        mainContainer.style.width = '100%';
        mainContainer.style.height = '100vh';
        mainContainer.style.borderRadius = '0';
        mainContainer.style.resize = 'none';
    } else {
        // 切换到桌面端：重置为窗口模式
        mainContainer.style.position = '';
        mainContainer.style.top = '';
        mainContainer.style.left = '';
        mainContainer.style.width = '';
        mainContainer.style.height = '';
        mainContainer.style.borderRadius = '';
        mainContainer.style.resize = '';
    }
}

mediaQuery.addEventListener('change', handleResponsiveChange);
// 初始化时执行一次
handleResponsiveChange(mediaQuery);

// ==================== 触摸设备优化 ====================
if ('ontouchstart' in window) {
    document.querySelectorAll('.pill-button, .component-item, .card').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// ==================== 防止拖拽时选中文本 ====================
titleBar.addEventListener('selectstart', (e) => {
    if (isDragging) e.preventDefault();
});

console.log('%cEggyUI-SE', 'color: #0F6DE6; font-size: 24px; font-weight: bold;');
console.log('%c不修改系统核心文件，延续蛋仔视觉美学', 'color: #666; font-size: 14px;');