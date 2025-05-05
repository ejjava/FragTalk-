class LeafSystem {
    constructor() {
        this.leaves = [];
        this.leafCount = 15;
        this.gyroEnabled = false;
        this.beta = 0;
        this.gamma = 0;
        this.animationId = null;
        this.lastTime = 0;
    }

    init() {
        this.createContainer();
        this.createLeaves();
        this.setupEventListeners();
        this.startAnimation();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'leaf-container';
        document.body.appendChild(this.container);

        const style = document.createElement('style');
        style.textContent = `
            #leaf-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            }
            .leaf {
                position: absolute;
                width: 30px;
                height: 30px;
                background-image: url('树叶.svg');
                background-size: contain;
                background-repeat: no-repeat;
                opacity: 0.5;
                will-change: transform;
                transition: transform 0.5s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    createLeaves() {
        for (let i = 0; i < this.leafCount; i++) {
            const leaf = this.createLeaf();
            this.container.appendChild(leaf);
            this.leaves.push({
                element: leaf,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotation: Math.random() * 360,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: Math.random() * 0.3 + 0.1,
                rotationSpeed: (Math.random() - 0.5) * 2
            });
        }
    }

    createLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        const size = 20 + Math.random() * 20;
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        leaf.style.opacity = 0.3 + Math.random() * 0.4;
        return leaf;
    }

    setupEventListeners() {
        // 陀螺仪支持检测
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                this.gyroEnabled = true;
                this.beta = e.beta;  // 前后倾斜 -180到180
                this.gamma = e.gamma; // 左右倾斜 -90到90
            });
        } else {
            console.log('设备不支持陀螺仪');
        }

        // 窗口大小变化时重新定位树叶
        window.addEventListener('resize', () => {
            this.leaves.forEach(leaf => {
                leaf.x = Math.min(leaf.x, window.innerWidth - 30);
                leaf.y = Math.min(leaf.y, window.innerHeight - 30);
            });
        });
    }

    startAnimation() {
        const animate = (time) => {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            
            this.leaves.forEach(leaf => {
                // 默认动画
                leaf.x += leaf.speedX;
                leaf.y += leaf.speedY;
                leaf.rotation += leaf.rotationSpeed;
                
                // 边界检查
                if (leaf.x < -30) leaf.x = window.innerWidth;
                if (leaf.x > window.innerWidth) leaf.x = -30;
                if (leaf.y > window.innerHeight) {
                    leaf.y = -30;
                    leaf.x = Math.random() * window.innerWidth;
                }
                
                // 陀螺仪影响
                if (this.gyroEnabled) {
                    const gyroFactor = 2; // 陀螺仪影响系数
                    leaf.x += this.gamma * 0.1 * gyroFactor;
                    leaf.y += this.beta * 0.05 * gyroFactor;
                }
                
                // 应用变换
                leaf.element.style.transform = `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation}deg)`;
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}