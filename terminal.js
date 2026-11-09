/**
 * ============================================================================
 * WEB OS // TERMINAL APPLICATION ENGINE
 * ============================================================================
 */

window.WebTerminal = (function () {
    'use strict';

    const PORTFOLIO_SPECS = {
        name: "Developer Name",
        title: "Full-Stack Software Engineer",
        location: "Remote / Global",
        github: "https://github.com/developer-username",
        linkedin: "https://linkedin.com/in/developer-username",
        email: "developer@example.com",
        uptime: "99.99%",
        system: "Web OS v1.0 // Portfolio Edition",
        shell: "bash 5.2.21-release",
        memory: "512 MB / 8 GB (Allocated)",
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.innerText = text;
        return div.innerHTML;
    }

    function createTerminal(containerEl, sfx) {
        containerEl.innerHTML = `
            <div class="terminal-container">
                <div class="terminal-body" id="term-body-scroll">
                    <div id="term-output-stream"></div>
                    <div class="command-line">
                        <span class="prompt-user">developer</span><span class="prompt-at">@</span><span class="prompt-host">web-os</span><span class="prompt-path">:~</span><span class="prompt-symbol">$</span>
                        <input type="text" class="terminal-input" id="term-cmd-input" autocomplete="off" spellcheck="false" autofocus>
                    </div>
                </div>
            </div>
        `;

        const outputEl = containerEl.querySelector('#term-output-stream');
        const inputEl = containerEl.querySelector('#term-cmd-input');
        const scrollEl = containerEl.querySelector('#term-body-scroll');

        const cmdHistory = [];
        let historyIdx = -1;

        function scrollToBottom() {
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }

        function appendOutput(html) {
            const row = document.createElement('div');
            row.className = 'term-row';
            row.innerHTML = html;
            outputEl.appendChild(row);
            scrollToBottom();
        }

        function runCrawlerSimulation() {
            const logs = [
                { type: 'info', text: '[crawler.engine] INFO: Crawler runtime initialized (worker: node_crawler)' },
                { type: 'info', text: '[crawler.proxy] INFO: ProxyPool: 128 high-anonymity residential proxies active' },
                { type: 'info', text: '[crawler.engine] INFO: Target job opened: DistributedSpider' },
                { type: 'success', text: '[crawler.engine] DEBUG: Crawled (200) <GET https://api.example.com/catalog> (referer: None)' },
                { type: 'item', text: '[crawler.scraper] DEBUG: Scraped item: {"sku": "DEV-491", "price": "$1,450", "status": "IN_STOCK"}' },
                { type: 'success', text: '[crawler.engine] DEBUG: Crawled (200) <GET https://api.example.com/stream> (referer: api.example.com)' },
                { type: 'item', text: '[crawler.scraper] DEBUG: Extracted batch: {"records": 480, "throughput": "12,400 req/min"}' },
                { type: 'info', text: '[crawler.extensions] STATS: item_scraped_count: 8,420, response_received_count: 8,420' },
                { type: 'success', text: '[crawler.engine] INFO: Closing spider (finished) -> Pipeline exported to database with 0 dropped items.' }
            ];

            let index = 0;
            const wrap = document.createElement('div');
            wrap.className = 'crawler-terminal';
            wrap.innerHTML = '<div style="color:var(--accent); font-weight:700; margin-bottom:4px;">[TASK] DistributedSpider [LIVE EXECUTION STREAM]</div>';
            outputEl.appendChild(wrap);
            scrollToBottom();

            const timer = setInterval(() => {
                if (index >= logs.length) {
                    clearInterval(timer);
                    return;
                }
                const log = logs[index];
                const div = document.createElement('div');
                div.className = `crawler-log-${log.type}`;
                div.textContent = log.text;
                wrap.appendChild(div);
                scrollToBottom();
                if (sfx) sfx.playKeyClick();
                index++;
            }, 180);
        }

        function execute(cmdStr) {
            const trimmed = cmdStr.trim();
            if (!trimmed) return;

            if (sfx) sfx.playExec();

            appendOutput(`
                <div class="term-echo">
                    <span class="echo-prompt">developer@web-os:~$</span>
                    <span>${escapeHtml(trimmed)}</span>
                </div>
            `);

            cmdHistory.push(trimmed);
            historyIdx = cmdHistory.length;

            const parts = trimmed.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            switch (cmd) {
                case 'help':
                case 'commands':
                case '?':
                    appendOutput(`
                        <div style="color:var(--accent); font-weight:700; margin-bottom:4px;">AVAILABLE SYSTEM COMMANDS:</div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:6px; font-size:0.8rem;">
                            <div><strong style="color:var(--accent);">neofetch</strong> - System and engineer specifications</div>
                            <div><strong style="color:var(--accent);">crawler</strong> - Live distributed crawler simulation</div>
                            <div><strong style="color:var(--accent);">arch</strong> - Cloud edge architecture overview</div>
                            <div><strong style="color:var(--accent);">projects</strong> - Open Projects showcase</div>
                            <div><strong style="color:var(--accent);">skills</strong> - Open Skills matrix</div>
                            <div><strong style="color:var(--accent);">contact</strong> - Contact info and channels</div>
                            <div><strong style="color:var(--accent);">github</strong> - Open GitHub profile</div>
                            <div><strong style="color:var(--accent);">matrix</strong> - Toggle digital rain effect</div>
                            <div><strong style="color:var(--accent);">clear</strong> - Clear console output</div>
                        </div>
                    `);
                    break;

                case 'neofetch':
                case 'whoami':
                    appendOutput(`
                        <div style="display:flex; gap:16px; align-items:flex-start; padding:6px 0;">
                            <pre style="color:var(--accent); font-size:0.7rem; line-height:1.2;">
 _       __     __       ____  _____
| |     / /__  / /_     / __ \\/ ___/
| | /| / / _ \\/ __ \\   / / / /\\__ \\ 
| |/ |/ /  __/ /_/ /  / /_/ /___/ / 
|__/|__/\\___/_.___/   \\____//____/  
                            </pre>
                            <div style="font-size:0.8rem; display:flex; flex-direction:column; gap:3px;">
                                <div><span style="color:var(--accent); font-weight:700;">ENGINEER:</span> ${PORTFOLIO_SPECS.name}</div>
                                <div><span style="color:var(--accent); font-weight:700;">TITLE:</span> ${PORTFOLIO_SPECS.title}</div>
                                <div><span style="color:var(--accent); font-weight:700;">SYSTEM:</span> ${PORTFOLIO_SPECS.system}</div>
                                <div><span style="color:var(--accent); font-weight:700;">SHELL:</span> ${PORTFOLIO_SPECS.shell}</div>
                                <div><span style="color:var(--accent); font-weight:700;">UPTIME:</span> <span style="color:var(--accent-green);">${PORTFOLIO_SPECS.uptime}</span></div>
                                <div><span style="color:var(--accent); font-weight:700;">EMAIL:</span> <a href="mailto:${PORTFOLIO_SPECS.email}" style="color:var(--accent);">${PORTFOLIO_SPECS.email}</a></div>
                            </div>
                        </div>
                    `);
                    break;

                case 'crawler':
                case 'spider':
                    runCrawlerSimulation();
                    break;

                case 'arch':
                case 'architecture':
                case 'platform':
                    appendOutput(`
                        <div style="font-size:0.82rem; line-height:1.5;">
                            <div style="color:var(--accent); font-weight:700;">DISTRIBUTED CLOUD ARCHITECTURE</div>
                            Modern distributed web platform deployed across edge points of presence. Architecture leverages global CDN edge routing, serverless execution runtimes, responsive glassmorphism UI, and automated CI/CD pipelines.
                        </div>
                    `);
                    break;

                case 'projects':
                    if (window.HomyOS) window.HomyOS.openApp('projects');
                    appendOutput(`<div>Opening Projects application window...</div>`);
                    break;

                case 'skills':
                    if (window.HomyOS) window.HomyOS.openApp('skills');
                    appendOutput(`<div>Opening Skills application window...</div>`);
                    break;

                case 'contact':
                case 'hire':
                    appendOutput(`
                        <div style="font-size:0.82rem; display:flex; flex-direction:column; gap:4px;">
                            <div style="color:var(--accent-green); font-weight:700;">CONTACT AND CHANNELS:</div>
                            <div><strong>Email:</strong> <a href="mailto:${PORTFOLIO_SPECS.email}" style="color:var(--accent);">${PORTFOLIO_SPECS.email}</a></div>
                            <div><strong>LinkedIn:</strong> <a href="${PORTFOLIO_SPECS.linkedin}" target="_blank" style="color:var(--accent);">${PORTFOLIO_SPECS.linkedin}</a></div>
                            <div><strong>GitHub:</strong> <a href="${PORTFOLIO_SPECS.github}" target="_blank" style="color:var(--accent);">${PORTFOLIO_SPECS.github}</a></div>
                        </div>
                    `);
                    break;

                case 'github':
                    window.open(PORTFOLIO_SPECS.github, '_blank');
                    appendOutput(`<div>Opening GitHub profile: <a href="${PORTFOLIO_SPECS.github}" target="_blank" style="color:var(--accent);">${PORTFOLIO_SPECS.github}</a></div>`);
                    break;

                case 'matrix':
                    if (window.HomyOS) window.HomyOS.toggleMatrix();
                    appendOutput(`<div style="color:var(--accent-green);">[INFO] Matrix digital rain active. Press [ESC] or click to dismiss.</div>`);
                    break;

                case 'clear':
                case 'cls':
                    outputEl.innerHTML = '';
                    break;

                default:
                    appendOutput(`<div style="color:#ff5f56;">bash: command not found: <code>${escapeHtml(cmd)}</code>. Type <code>help</code> to view available commands.</div>`);
                    break;
            }
        }

        inputEl.addEventListener('keydown', (e) => {
            if (sfx) sfx.playKeyClick();

            if (e.key === 'Enter') {
                e.preventDefault();
                const val = inputEl.value;
                inputEl.value = '';
                execute(val);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (cmdHistory.length > 0 && historyIdx > 0) {
                    historyIdx--;
                    inputEl.value = cmdHistory[historyIdx];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIdx < cmdHistory.length - 1) {
                    historyIdx++;
                    inputEl.value = cmdHistory[historyIdx];
                } else {
                    historyIdx = cmdHistory.length;
                    inputEl.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const val = inputEl.value.trim().toLowerCase();
                const available = ['help', 'neofetch', 'crawler', 'arch', 'projects', 'skills', 'contact', 'github', 'matrix', 'clear'];
                const match = available.find(c => c.startsWith(val));
                if (match) inputEl.value = match;
            }
        });

        // Focus input on click
        containerEl.addEventListener('click', () => {
            inputEl.focus();
        });

        // Print initial banner
        appendOutput(`
            <div class="ascii-banner">
 _       __     __       ____  _____
| |     / /__  / /_     / __ \\/ ___/
| | /| / / _ \\/ __ \\   / / / /\\__ \\ 
| |/ |/ /  __/ /_/ /  / /_/ /___/ / 
|__/|__/\\___/_.___/   \\____//____/  
====================================
            </div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:8px;">
                Web OS Terminal [v1.0.0-PROD]<br>
                Type <span style="color:var(--accent); font-weight:700;">help</span> to see commands or <span style="color:var(--accent); font-weight:700;">crawler</span> to run automation simulation.
            </div>
        `);

        return {
            execute,
            focus: () => inputEl.focus()
        };
    }

    return {
        createTerminal
    };
})();

// Backward compatibility alias
window.HomyTerminal = window.WebTerminal;
