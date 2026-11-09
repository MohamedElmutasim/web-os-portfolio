/**
 * ============================================================================
 * WEB OS // DESKTOP & MOBILE RESPONSIVE ENGINE
 * ============================================================================
 */

(function () {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. LUCIDE ICONS RENDER HELPER
    // ------------------------------------------------------------------------
    function renderIcons(container) {
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons({
                root: container || document,
                attrs: {
                    'stroke-width': 1.8,
                }
            });
        }
    }

    // ------------------------------------------------------------------------
    // 2. SOUND EFFECTS SYNTHESIZER (WEB AUDIO API)
    // ------------------------------------------------------------------------
    class SoundFX {
        constructor() {
            this.enabled = true;
            this.ctx = null;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playClick() {
            if (!this.enabled) return;
            try {
                this.init();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.02);

                gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.02);
            } catch (e) {}
        }

        playWindowOpen() {
            if (!this.enabled) return;
            try {
                this.init();
                const notes = [440, 660, 880];
                notes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const t = this.ctx.currentTime + idx * 0.03;
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, t);

                    gain.gain.setValueAtTime(0.05, t);
                    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(t);
                    osc.stop(t + 0.18);
                });
            } catch (e) {}
        }

        playWindowClose() {
            if (!this.enabled) return;
            try {
                this.init();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.08);

                gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.08);
            } catch (e) {}
        }
    }

    const sfx = new SoundFX();

    // ------------------------------------------------------------------------
    // 3. DESKTOP BACKGROUND CANVAS (PARTICLES & AMBIENT DEPTH)
    // ------------------------------------------------------------------------
    const dCanvas = document.getElementById('desktop-canvas');
    const dCtx = dCanvas.getContext('2d');
    let dWidth = (dCanvas.width = window.innerWidth);
    let dHeight = (dCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        dWidth = dCanvas.width = window.innerWidth;
        dHeight = dCanvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * dWidth,
            y: Math.random() * dHeight,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 1.8 + 1,
        });
    }

    function renderDesktopCanvas() {
        dCtx.clearRect(0, 0, dWidth, dHeight);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = dWidth;
            if (p.x > dWidth) p.x = 0;
            if (p.y < 0) p.y = dHeight;
            if (p.y > dHeight) p.y = 0;

            dCtx.beginPath();
            dCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            dCtx.fillStyle = 'rgba(0, 210, 255, 0.25)';
            dCtx.fill();
        }

        requestAnimationFrame(renderDesktopCanvas);
    }
    renderDesktopCanvas();

    // ------------------------------------------------------------------------
    // 4. MATRIX RAIN ENGINE
    // ------------------------------------------------------------------------
    const mCanvas = document.getElementById('matrix-canvas');
    const mCtx = mCanvas.getContext('2d');
    let mInterval = null;
    let mDrops = [];
    const mChars = '01ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ987654321';

    function startMatrix() {
        mCanvas.classList.remove('hidden');
        mCanvas.width = window.innerWidth;
        mCanvas.height = window.innerHeight;
        const columns = Math.floor(mCanvas.width / 16);
        mDrops = Array(columns).fill(1);

        clearInterval(mInterval);
        mInterval = setInterval(() => {
            mCtx.fillStyle = 'rgba(4, 8, 5, 0.1)';
            mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);

            mCtx.fillStyle = '#00ff66';
            mCtx.font = '15px monospace';

            for (let i = 0; i < mDrops.length; i++) {
                const char = mChars[Math.floor(Math.random() * mChars.length)];
                mCtx.fillText(char, i * 16, mDrops[i] * 16);

                if (mDrops[i] * 16 > mCanvas.height && Math.random() > 0.975) {
                    mDrops[i] = 0;
                }
                mDrops[i]++;
            }
        }, 33);
    }

    function stopMatrix() {
        if (!mCanvas.classList.contains('hidden')) {
            mCanvas.classList.add('hidden');
            clearInterval(mInterval);
            mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') stopMatrix();
    });
    mCanvas.addEventListener('click', stopMatrix);

    // ------------------------------------------------------------------------
    // 5. WINDOW MANAGER ENGINE (DESKTOP + NATIVE SMARTPHONE FULLSCREEN)
    // ------------------------------------------------------------------------
    const windowsLayer = document.getElementById('windows-layer');
    const taskbarApps = document.getElementById('taskbar-apps');
    let topZIndex = 100;
    const activeWindows = {};

    class OSWindow {
        constructor(config) {
            this.id = config.id;
            this.title = config.title;
            this.iconName = config.iconName;
            this.width = config.width || 640;
            this.height = config.height || 460;
            this.x = config.x || 140;
            this.y = config.y || 60;
            this.contentRenderer = config.contentRenderer;

            this.isMinimized = false;
            this.isMaximized = false;
            this.preMaxState = null;

            this.buildDOM();
            this.attachDrag();
            this.attachResize();
            this.createTaskbarTab();
            this.focus();

            sfx.playWindowOpen();
        }

        buildDOM() {
            this.el = document.createElement('div');
            this.el.className = 'window';
            this.el.id = `win-${this.id}`;
            this.el.style.width = `${this.width}px`;
            this.el.style.height = `${this.height}px`;
            this.el.style.left = `${this.x}px`;
            this.el.style.top = `${this.y}px`;
            this.el.style.zIndex = ++topZIndex;

            this.el.innerHTML = `
                <div class="window-header">
                    <!-- Mobile Back to Home Screen Button -->
                    <button class="mobile-back-btn" title="Back to Home Screen">
                        <i data-lucide="chevron-left" class="back-icon"></i>
                        <span>Home</span>
                    </button>

                    <!-- Desktop macOS Style Dots -->
                    <div class="window-dots">
                        <button class="win-dot dot-close" title="Close"><i data-lucide="x" class="dot-icon"></i></button>
                        <button class="win-dot dot-min" title="Minimize"><i data-lucide="minus" class="dot-icon"></i></button>
                        <button class="win-dot dot-max" title="Maximize"><i data-lucide="square" class="dot-icon"></i></button>
                    </div>

                    <!-- Window Title -->
                    <div class="window-title">
                        <i data-lucide="${this.iconName}" class="window-icon"></i>
                        <span class="window-title-text">${this.title}</span>
                    </div>

                    <!-- Mobile Header Close Button -->
                    <div class="window-actions">
                        <button class="mobile-header-close" title="Close App">
                            <i data-lucide="x" class="dot-icon"></i>
                        </button>
                    </div>
                </div>

                <!-- Window Content Body -->
                <div class="window-body" id="body-${this.id}"></div>

                <!-- Mobile Native Bottom Home Indicator -->
                <div class="mobile-app-home-indicator" title="Tap to return home">
                    <div class="home-indicator-pill"></div>
                </div>

                <!-- Desktop Resize Handle -->
                <div class="window-resize-handle"></div>
            `;

            windowsLayer.appendChild(this.el);
            this.bodyEl = this.el.querySelector(`#body-${this.id}`);

            // Render custom app view
            if (this.contentRenderer) {
                this.contentRenderer(this.bodyEl, this);
            }

            // Desktop Window Controls listeners
            this.el.querySelector('.dot-close').addEventListener('click', () => this.close());
            this.el.querySelector('.dot-min').addEventListener('click', () => this.minimize());
            this.el.querySelector('.dot-max').addEventListener('click', () => this.toggleMaximize());

            // Mobile Navigation listeners (Back button, close, and home indicator)
            this.el.querySelector('.mobile-back-btn').addEventListener('click', () => this.close());
            this.el.querySelector('.mobile-header-close').addEventListener('click', () => this.close());
            this.el.querySelector('.mobile-app-home-indicator').addEventListener('click', () => this.close());

            // Focus on click/touch
            this.el.addEventListener('mousedown', () => this.focus());
            this.el.addEventListener('touchstart', () => this.focus(), { passive: true });

            // Initialize Lucide icons on this window
            renderIcons(this.el);
        }

        createTaskbarTab() {
            // Taskbar is only used in desktop mode
            this.tab = document.createElement('button');
            this.tab.className = 'taskbar-app-tab active';
            this.tab.innerHTML = `<i data-lucide="${this.iconName}" class="tab-icon"></i><span>${this.title.split(' ')[0]}</span>`;
            taskbarApps.appendChild(this.tab);
            renderIcons(this.tab);

            this.tab.addEventListener('click', () => {
                sfx.playClick();
                if (this.isMinimized) {
                    this.restore();
                    this.focus();
                } else if (this.isFocused()) {
                    this.minimize();
                } else {
                    this.focus();
                }
            });
        }

        focus() {
            Object.values(activeWindows).forEach(w => {
                w.el.classList.remove('is-focused');
                if (w.tab) w.tab.classList.remove('active');
            });

            this.el.style.zIndex = ++topZIndex;
            this.el.classList.add('is-focused');
            if (this.tab) this.tab.classList.add('active');
        }

        isFocused() {
            return this.el.classList.contains('is-focused') && !this.isMinimized;
        }

        minimize() {
            this.isMinimized = true;
            this.el.classList.add('is-minimized');
            this.el.classList.remove('is-focused');
            if (this.tab) {
                this.tab.classList.remove('active');
                this.tab.classList.add('minimized');
            }
            sfx.playClick();
        }

        restore() {
            this.isMinimized = false;
            this.el.classList.remove('is-minimized');
            if (this.tab) {
                this.tab.classList.remove('minimized');
            }
        }

        toggleMaximize() {
            sfx.playClick();
            if (!this.isMaximized) {
                this.preMaxState = {
                    left: this.el.style.left,
                    top: this.el.style.top,
                    width: this.el.style.width,
                    height: this.el.style.height
                };
                this.el.classList.add('is-maximized');
                this.isMaximized = true;
            } else {
                this.el.classList.remove('is-maximized');
                if (this.preMaxState) {
                    this.el.style.left = this.preMaxState.left;
                    this.el.style.top = this.preMaxState.top;
                    this.el.style.width = this.preMaxState.width;
                    this.el.style.height = this.preMaxState.height;
                }
                this.isMaximized = false;
            }
        }

        close() {
            sfx.playWindowClose();

            // Mobile smooth slide-down exit
            if (window.innerWidth <= 768) {
                this.el.classList.add('mobile-closing');
                setTimeout(() => {
                    this.el.remove();
                    if (this.tab) this.tab.remove();
                    delete activeWindows[this.id];
                }, 220);
            } else {
                this.el.remove();
                if (this.tab) this.tab.remove();
                delete activeWindows[this.id];
            }
        }

        attachDrag() {
            // Disable dragging on mobile devices (native fullscreen mode)
            if (window.innerWidth <= 768) return;

            const header = this.el.querySelector('.window-header');
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            const onStart = (e) => {
                if (window.innerWidth <= 768 || this.isMaximized) return;
                if (e.target.closest('.win-dot') || e.target.closest('.mobile-back-btn') || e.target.closest('.mobile-header-close')) return;

                isDragging = true;
                this.el.classList.add('is-dragging');
                this.focus();

                startX = e.clientX;
                startY = e.clientY;
                initialLeft = this.el.offsetLeft;
                initialTop = this.el.offsetTop;

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onEnd);
            };

            const onMove = (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                let nextLeft = initialLeft + dx;
                let nextTop = initialTop + dy;

                const maxLeft = window.innerWidth - 60;
                const maxTop = window.innerHeight - 80;

                nextLeft = Math.max(-this.el.offsetWidth + 80, Math.min(maxLeft, nextLeft));
                nextTop = Math.max(0, Math.min(maxTop, nextTop));

                this.el.style.left = `${nextLeft}px`;
                this.el.style.top = `${nextTop}px`;
            };

            const onEnd = () => {
                isDragging = false;
                this.el.classList.remove('is-dragging');
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
            };

            header.addEventListener('mousedown', onStart);
        }

        attachResize() {
            // Disable resizing on mobile
            if (window.innerWidth <= 768) return;

            const handle = this.el.querySelector('.window-resize-handle');
            let isResizing = false;
            let startX, startY, initialW, initialH;

            const onStart = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.innerWidth <= 768 || this.isMaximized) return;

                isResizing = true;
                this.focus();

                startX = e.clientX;
                startY = e.clientY;
                initialW = this.el.offsetWidth;
                initialH = this.el.offsetHeight;

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onEnd);
            };

            const onMove = (e) => {
                if (!isResizing) return;
                const w = Math.max(300, initialW + (e.clientX - startX));
                const h = Math.max(200, initialH + (e.clientY - startY));

                this.el.style.width = `${w}px`;
                this.el.style.height = `${h}px`;
            };

            const onEnd = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
            };

            handle.addEventListener('mousedown', onStart);
        }
    }

    // ------------------------------------------------------------------------
    // 6. APPLICATION REGISTRY & VIEWS
    // ------------------------------------------------------------------------
    const APPS = {
        terminal: {
            title: "Terminal.app (bash)",
            iconName: "terminal",
            width: 700,
            height: 480,
            render: (container) => {
                if (window.HomyTerminal) {
                    window.HomyTerminal.createTerminal(container, sfx);
                }
            }
        },

        projects: {
            title: "Projects.app // Engineering Showcase",
            iconName: "folder-git-2",
            width: 780,
            height: 520,
            render: (container) => {
                container.innerHTML = `
                    <div class="projects-view">
                        <div class="section-hero">
                            <h2>Featured Projects & Distributed Architectures</h2>
                            <p>High-performance automation engines, serverless edge platforms, and creative design systems.</p>
                        </div>
                        <div class="projects-grid">
                            <!-- Project 1: Distributed Automation Engine -->
                            <div class="proj-card proj-highlight">
                                <span class="proj-badge">
                                    <i data-lucide="git-branch" class="badge-icon"></i>
                                    AUTOMATION & PIPELINES
                                </span>
                                <h3 class="proj-title">Project Alpha: Distributed Automation Engine</h3>
                                <p class="proj-desc">
                                    High-throughput distributed web crawling architecture utilizing headless browser workers, automated proxy rotation pools, and robust data pipeline extraction.
                                </p>
                                <div class="proj-meta">
                                    <i data-lucide="activity" class="meta-icon"></i>
                                    12,000 requests/min • 99.9% Pipeline Uptime
                                </div>
                                <div class="proj-tags">
                                    <span class="proj-tag">Python</span>
                                    <span class="proj-tag">Distributed Systems</span>
                                    <span class="proj-tag">Playwright</span>
                                    <span class="proj-tag">Docker</span>
                                    <span class="proj-tag">PostgreSQL</span>
                                </div>
                            </div>

                            <!-- Project 2: Cloud Edge Platform -->
                            <div class="proj-card proj-highlight">
                                <span class="proj-badge">
                                    <i data-lucide="globe" class="badge-icon"></i>
                                    FULL-STACK & EDGE
                                </span>
                                <h3 class="proj-title">Project Beta: Cloud Edge Platform</h3>
                                <p class="proj-desc">
                                    Modern distributed web platform deployed on global CDN infrastructure. Features sub-millisecond client state management, responsive glassmorphic UI, and serverless edge functions.
                                </p>
                                <div class="proj-meta">
                                    <i data-lucide="activity" class="meta-icon"></i>
                                    Sub-50ms Global TTFB • 100/100 Core Web Vitals
                                </div>
                                <div class="proj-tags">
                                    <span class="proj-tag">TypeScript</span>
                                    <span class="proj-tag">Edge Workers</span>
                                    <span class="proj-tag">TailwindCSS</span>
                                    <span class="proj-tag">HTML5 Canvas</span>
                                </div>
                            </div>

                            <!-- Project 3: Crypto Trading Engine -->
                            <div class="proj-card">
                                <span class="proj-badge">
                                    <i data-lucide="cpu" class="badge-icon"></i>
                                    WEB3 & FINTECH
                                </span>
                                <h3 class="proj-title">Algorithmic Crypto Trading Bot</h3>
                                <p class="proj-desc">
                                    Automated 24/7 cryptocurrency market-making and grid bot connecting Binance and Bybit order books via CCXT, featuring real-time WebSocket signals and automated risk hedging.
                                </p>
                                <div class="proj-meta">
                                    <i data-lucide="activity" class="meta-icon"></i>
                                    &lt;75ms Bot Latency • 24/7 Execution
                                </div>
                                <div class="proj-tags">
                                    <span class="proj-tag">Node.js</span>
                                    <span class="proj-tag">CCXT</span>
                                    <span class="proj-tag">WebSockets</span>
                                    <span class="proj-tag">EVM Web3</span>
                                </div>
                            </div>

                            <!-- Project 4: Design Systems -->
                            <div class="proj-card">
                                <span class="proj-badge">
                                    <i data-lucide="sparkles" class="badge-icon"></i>
                                    UI/UX & CREATIVE
                                </span>
                                <h3 class="proj-title">Design Systems & Mobile Prototypes</h3>
                                <p class="proj-desc">
                                    Modular Figma component libraries, responsive design tokens, interactive iOS/Android prototypes, and striking modern marketing campaigns.
                                </p>
                                <div class="proj-meta">
                                    <i data-lucide="activity" class="meta-icon"></i>
                                    25+ Design Systems • 300+ User Flows
                                </div>
                                <div class="proj-tags">
                                    <span class="proj-tag">Figma</span>
                                    <span class="proj-tag">UI/UX Systems</span>
                                    <span class="proj-tag">Micro-animations</span>
                                    <span class="proj-tag">Branding</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                renderIcons(container);
            }
        },

        skills: {
            title: "Skills.app // Technical Capabilities",
            iconName: "code-2",
            width: 720,
            height: 480,
            render: (container) => {
                container.innerHTML = `
                    <div class="skills-view">
                        <div class="section-hero">
                            <h2>Core Engineering Competencies</h2>
                            <p>Proficiencies and technology stacks tested across production environments.</p>
                        </div>
                        <div class="skills-deck">
                            <div class="skill-category-card">
                                <div class="cat-title">
                                    <i data-lucide="server" class="cat-icon"></i>
                                    Backend & Systems
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Node.js & Fastify / Express</span><strong>95%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 95%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Python Scripting & APIs</span><strong>92%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 92%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Cloudflare Workers (Serverless)</span><strong>90%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 90%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>PostgreSQL & SQLite Storage</span><strong>88%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 88%;"></div></div>
                                </div>
                            </div>

                            <div class="skill-category-card">
                                <div class="cat-title">
                                    <i data-lucide="git-branch" class="cat-icon"></i>
                                    Automation & Scraping
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Distributed Spider Architecture</span><strong>98%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 98%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Playwright / Puppeteer Browsers</span><strong>94%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 94%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Proxy Rotation & Anti-Bot Bypass</span><strong>92%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 92%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>ETL & Streaming Data Pipelines</span><strong>90%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 90%;"></div></div>
                                </div>
                            </div>

                            <div class="skill-category-card">
                                <div class="cat-title">
                                    <i data-lucide="terminal" class="cat-icon"></i>
                                    DevOps & Linux
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Debian / Ubuntu Server Ops</span><strong>94%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 94%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Docker Multi-Stage Containerization</span><strong>92%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 92%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Bash Shell Automation</span><strong>90%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 90%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>CI/CD & Cloudflare Deployments</span><strong>95%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 95%;"></div></div>
                                </div>
                            </div>

                            <div class="skill-category-card">
                                <div class="cat-title">
                                    <i data-lucide="sparkles" class="cat-icon"></i>
                                    UI/UX & Creative
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Figma Master Systems & Prototypes</span><strong>92%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 92%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Responsive Tailwind & CSS Grid</span><strong>96%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 96%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Dark Mode & Cyberpunk Aesthetics</span><strong>95%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 95%;"></div></div>
                                </div>
                                <div class="skill-bar-row">
                                    <div class="skill-info"><span>Design-to-Code Translation</span><strong>94%</strong></div>
                                    <div class="skill-meter"><div class="skill-progress" style="width: 94%;"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                renderIcons(container);
            }
        },

        contact: {
            title: "Contact.app // Professional Channels",
            iconName: "mail",
            width: 580,
            height: 460,
            render: (container) => {
                container.innerHTML = `
                    <div class="contact-view">
                        <div class="section-hero">
                            <h2>Get in Touch</h2>
                            <p>Available for automation architectures, backend consulting, and full-stack partnerships.</p>
                        </div>
                        <div class="contact-card-box">
                            <!-- Professional Email -->
                            <div class="contact-row">
                                <div class="contact-info">
                                    <i data-lucide="mail" class="contact-svg-icon"></i>
                                    <div>
                                        <div class="contact-label">PROFESSIONAL EMAIL</div>
                                        <div class="contact-value" id="copy-email-target">developer@example.com</div>
                                    </div>
                                </div>
                                <button class="btn-copy" id="btn-copy-email">
                                    <i data-lucide="copy" class="copy-icon"></i>
                                    <span>Copy</span>
                                </button>
                            </div>

                            <!-- LinkedIn -->
                            <div class="contact-row">
                                <div class="contact-info">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    <div>
                                        <div class="contact-label">LINKEDIN NETWORK</div>
                                        <div class="contact-value">developer-username</div>
                                    </div>
                                </div>
                                <a href="https://linkedin.com/in/developer-username" target="_blank" rel="noopener noreferrer" class="btn-link-action">
                                    <span>Connect</span>
                                    <i data-lucide="external-link" class="link-icon"></i>
                                </a>
                            </div>

                            <!-- GitHub -->
                            <div class="contact-row">
                                <div class="contact-info">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                    <div>
                                        <div class="contact-label">GITHUB REPOSITORIES</div>
                                        <div class="contact-value">developer-username</div>
                                    </div>
                                </div>
                                <a href="https://github.com/developer-username" target="_blank" rel="noopener noreferrer" class="btn-link-action">
                                    <span>Profile</span>
                                    <i data-lucide="external-link" class="link-icon"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Direct Mail Prompt -->
                        <div style="text-align: center; padding-top: 6px;">
                            <a href="mailto:developer@example.com" class="btn-send" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                                <i data-lucide="send" style="width:16px; height:16px;"></i>
                                <span>Send an Email Directly</span>
                            </a>
                        </div>
                    </div>
                `;
                renderIcons(container);

                const btnCopy = container.querySelector('#btn-copy-email');
                btnCopy.addEventListener('click', () => {
                    navigator.clipboard.writeText('developer@example.com').then(() => {
                        btnCopy.innerHTML = `<i data-lucide="check" class="copy-icon"></i><span>Copied!</span>`;
                        renderIcons(btnCopy);
                        sfx.playClick();
                        setTimeout(() => {
                            btnCopy.innerHTML = `<i data-lucide="copy" class="copy-icon"></i><span>Copy</span>`;
                            renderIcons(btnCopy);
                        }, 2000);
                    });
                });
            }
        }
    };

    function openApp(appId) {
        sfx.playClick();

        // On mobile: single-app focus mode (close other open windows for clean transition)
        if (window.innerWidth <= 768) {
            Object.values(activeWindows).forEach(w => {
                if (w.id !== appId) w.close();
            });
        }

        if (activeWindows[appId]) {
            const win = activeWindows[appId];
            if (win.isMinimized) win.restore();
            win.focus();
            return;
        }

        const appDef = APPS[appId];
        if (!appDef) return;

        const offset = Object.keys(activeWindows).length * 28;
        const screenW = window.innerWidth;
        const initialX = Math.max(20, Math.min(screenW - appDef.width - 20, 100 + offset));
        const initialY = Math.max(20, 50 + offset);

        const win = new OSWindow({
            id: appId,
            title: appDef.title,
            iconName: appDef.iconName,
            width: Math.min(appDef.width, screenW - 20),
            height: appDef.height,
            x: initialX,
            y: initialY,
            contentRenderer: appDef.render
        });

        activeWindows[appId] = win;
    }

    // ------------------------------------------------------------------------
    // 7. DESKTOP & MOBILE ICON SHORTCUTS
    // ------------------------------------------------------------------------
    document.querySelectorAll('.desktop-icon[data-app]').forEach(icon => {
        let clickTimer = null;

        icon.addEventListener('click', () => {
            sfx.playClick();
            icon.classList.add('selected');

            // On mobile screen: immediate single tap opens the app
            if (window.innerWidth <= 768) {
                openApp(icon.dataset.app);
                icon.classList.remove('selected');
            } else {
                // Desktop: double-click execution
                if (clickTimer == null) {
                    clickTimer = setTimeout(() => {
                        clickTimer = null;
                    }, 350);
                } else {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    openApp(icon.dataset.app);
                    icon.classList.remove('selected');
                }
            }
        });
    });

    // Mobile Dock Buttons
    document.querySelectorAll('.mobile-dock-btn[data-app]').forEach(btn => {
        btn.addEventListener('click', () => {
            sfx.playClick();
            openApp(btn.dataset.app);
        });
    });

    document.getElementById('desktop').addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-icon')) {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        }
    });

    // ------------------------------------------------------------------------
    // 8. START MENU LAUNCHER
    // ------------------------------------------------------------------------
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfx.playClick();
        startMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.start-app-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const appId = btn.dataset.app;
            if (appId) {
                openApp(appId);
                startMenu.classList.add('hidden');
            }
        });
    });

    document.getElementById('btn-matrix-rain').addEventListener('click', () => {
        startMatrix();
        startMenu.classList.add('hidden');
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        window.location.reload();
    });

    window.addEventListener('click', (e) => {
        if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
            startMenu.classList.add('hidden');
        }
        if (!e.target.closest('.tray-dropdown-wrap')) {
            document.getElementById('theme-menu').classList.add('hidden');
        }
    });

    // ------------------------------------------------------------------------
    // 9. SYSTEM TRAY: CLOCK, THEMES & AUDIO
    // ------------------------------------------------------------------------
    const clockTimeEl = document.getElementById('clock-time');
    const clockDateEl = document.getElementById('clock-date');
    const mobileClockEl = document.getElementById('mobile-clock');
    const mobileHeroTimeEl = document.getElementById('mobile-hero-time');
    const mobileHeroDateEl = document.getElementById('mobile-hero-date');

    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const shortTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        const longDateStr = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

        if (clockTimeEl) clockTimeEl.textContent = timeStr;
        if (clockDateEl) clockDateEl.textContent = dateStr;
        if (mobileClockEl) mobileClockEl.textContent = shortTimeStr.replace(/\s*[AP]M/i, '');
        if (mobileHeroTimeEl) mobileHeroTimeEl.textContent = shortTimeStr;
        if (mobileHeroDateEl) mobileHeroDateEl.textContent = longDateStr;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Audio Toggle
    const btnTraySound = document.getElementById('btn-tray-sound');
    const traySoundIcon = document.getElementById('tray-sound-icon');

    btnTraySound.addEventListener('click', () => {
        sfx.enabled = !sfx.enabled;
        traySoundIcon.setAttribute('data-lucide', sfx.enabled ? 'volume-2' : 'volume-x');
        renderIcons(btnTraySound);
    });

    // Theme Switcher
    const btnTrayTheme = document.getElementById('btn-tray-theme');
    const themeMenu = document.getElementById('theme-menu');

    btnTrayTheme.addEventListener('click', (e) => {
        e.stopPropagation();
        sfx.playClick();
        themeMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.theme-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            const t = opt.dataset.theme;
            document.body.className = t;
            themeMenu.classList.add('hidden');
            sfx.playClick();
            try {
                localStorage.setItem('homy_os_theme', t);
            } catch (e) {}
        });
    });

    try {
        const saved = localStorage.getItem('homy_os_theme');
        if (saved) document.body.className = saved;
    } catch (e) {}

    // ------------------------------------------------------------------------
    // 10. BOOT & INITIALIZE ICONS
    // ------------------------------------------------------------------------
    window.HomyOS = {
        openApp,
        toggleMatrix: startMatrix
    };

    // Initial Lucide Icons Render
    renderIcons();

})();
