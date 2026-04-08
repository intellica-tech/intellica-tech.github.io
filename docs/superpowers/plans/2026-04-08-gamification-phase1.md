# Gamification Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three gamification features to intellica.net — Easter Egg Terminal (global), Animated Data Flow Storytelling (Data Platforms page), and Product Fit Recommender (Products page).

**Architecture:** Each feature is a self-contained Astro component in `src/components/gamification/`. Components use scoped `<style>` blocks and inline `<script>` tags — zero external dependencies, zero backend. They integrate into existing pages via simple imports and `<ComponentName />` tags.

**Tech Stack:** Astro 5.x, vanilla JavaScript, CSS animations, SVG. No external libraries.

---

## File Structure

```
src/components/gamification/
  EasterEggTerminal.astro   — Global terminal overlay (Task 1)
  DataFlowStory.astro       — Scroll-driven pipeline animation (Task 2)
  ProductFitWizard.astro    — Product recommendation wizard (Task 3)
```

**Modified files:**
- `src/layouts/Layout.astro` — Import and render EasterEggTerminal (Task 1)
- `src/pages/data-platforms.astro` — Import and render DataFlowStory (Task 2)
- `src/pages/products.astro` — Import and render ProductFitWizard (Task 3)

---

## Task 1: Easter Egg Terminal

**Files:**
- Create: `src/components/gamification/EasterEggTerminal.astro`
- Modify: `src/layouts/Layout.astro:131-137`

### Step 1.1: Create the EasterEggTerminal component

- [ ] Create `src/components/gamification/EasterEggTerminal.astro` with the full terminal implementation:

```astro
---
// Easter Egg Terminal — activated via Konami code or Ctrl+Shift+T
// A retro terminal overlay with commands about Intellica
---

<div id="egg-terminal" class="egg-terminal" aria-hidden="true">
  <div class="egg-terminal__header">
    <span class="egg-terminal__title">intellica@data:~$</span>
    <button class="egg-terminal__close" aria-label="Close terminal">&times;</button>
  </div>
  <div class="egg-terminal__body" id="egg-terminal-output">
    <div class="egg-terminal__line egg-terminal__line--system">
      Welcome to Intellica Terminal v1.0
    </div>
    <div class="egg-terminal__line egg-terminal__line--system">
      Type <span class="egg-terminal__cmd">help</span> to see available commands.
    </div>
  </div>
  <div class="egg-terminal__input-row">
    <span class="egg-terminal__prompt">visitor@intellica:~$&nbsp;</span>
    <input
      type="text"
      id="egg-terminal-input"
      class="egg-terminal__input"
      autocomplete="off"
      spellcheck="false"
      aria-label="Terminal input"
    />
  </div>
</div>

<style>
  .egg-terminal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 420px;
    background: #0a0e14;
    border-top: 2px solid var(--clr-primary, #00C896);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    font-family: 'Courier New', Courier, monospace;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 -10px 60px rgba(0, 200, 150, 0.15);
  }

  .egg-terminal.open {
    transform: translateY(0);
  }

  /* CRT scanline effect */
  .egg-terminal::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08) 0px,
      rgba(0, 0, 0, 0.08) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
    z-index: 1;
  }

  .egg-terminal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: rgba(0, 200, 150, 0.08);
    border-bottom: 1px solid rgba(0, 200, 150, 0.15);
    flex-shrink: 0;
  }

  .egg-terminal__title {
    color: var(--clr-primary, #00C896);
    font-size: 0.85rem;
    font-weight: 700;
  }

  .egg-terminal__close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    font-family: inherit;
  }

  .egg-terminal__close:hover {
    color: #ff5f56;
  }

  .egg-terminal__body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 200, 150, 0.3) transparent;
  }

  .egg-terminal__line {
    margin-bottom: 6px;
    font-size: 0.88rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.85);
    white-space: pre-wrap;
  }

  .egg-terminal__line--system {
    color: rgba(0, 200, 150, 0.7);
  }

  .egg-terminal__line--command {
    color: var(--clr-primary, #00C896);
    font-weight: 700;
  }

  .egg-terminal__line--error {
    color: #ff5f56;
  }

  .egg-terminal__cmd {
    color: var(--clr-primary, #00C896);
    font-weight: 700;
  }

  .egg-terminal__input-row {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-top: 1px solid rgba(0, 200, 150, 0.1);
    flex-shrink: 0;
  }

  .egg-terminal__prompt {
    color: var(--clr-primary, #00C896);
    font-size: 0.88rem;
    white-space: nowrap;
    font-weight: 700;
  }

  .egg-terminal__input {
    flex: 1;
    background: none;
    border: none;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.88rem;
    outline: none;
    caret-color: var(--clr-primary, #00C896);
  }

  @media (max-width: 768px) {
    .egg-terminal {
      height: 320px;
    }
  }
</style>

<script>
  const COMMANDS = {
    help: [
      'Available commands:',
      '  about        — Learn about Intellica',
      '  ls products  — List our product portfolio',
      '  cat <name>   — Product details (ifdm, itdm, hrdm, icc, retouch, retable, orqenta, talkto, blueoctopus, var)',
      '  ls team      — Team stats',
      '  ping ai      — Check AI status',
      '  whoami       — Who are you?',
      '  clear        — Clear terminal',
      '  exit         — Close terminal',
    ].join('\n'),

    about: [
      'Intellica — Unleashing Value From Data',
      String.fromCharCode(9473).repeat(37),
      'Founded: 2006 | HQ: Istanbul, Turkey',
      'Offices: UAE, Saudi Arabia, Pakistan, UK, US, Albania',
      'Team: 450+ data & AI professionals',
      '',
      'We design and deliver enterprise data platforms,',
      'analytics solutions, and production-grade AI systems.',
    ].join('\n'),

    'ls products': [
      'drwxr-xr-x  IFDM/          Finance Data Model',
      'drwxr-xr-x  ITDM/          Telecom Data Model',
      'drwxr-xr-x  HRDM/          HR Data Model',
      'drwxr-xr-x  ICC/           Consistency Checker',
      'drwxr-xr-x  ReTouch/       Data Entry Management',
      'drwxr-xr-x  Retable/       No-Code Platform',
      'drwxr-xr-x  Orqenta/       Workflow Orchestration',
      'drwxr-xr-x  TalkTo/        NL-to-SQL AI',
      'drwxr-xr-x  BlueOctopus/   Event Intelligence',
      'drwxr-xr-x  VAR/           Voice AI Recognition',
    ].join('\n'),

    'ls team': [
      'Intellica Team Stats',
      String.fromCharCode(9473).repeat(20),
      'employees    450+',
      'experience   11+ years',
      'graduates    240+ (Academy alumni)',
      'offices      7 countries',
      'products     10 enterprise solutions',
    ].join('\n'),

    'ping ai': [
      'PING ai.intellica.net (10.0.42.1) 56 bytes of data.',
      '64 bytes from ai-cluster-01: time=0.42ms — GenAI Online',
      '64 bytes from ai-cluster-02: time=0.38ms — NL2SQL Online',
      '64 bytes from ai-cluster-03: time=0.51ms — Voice AI Online',
      '64 bytes from ai-cluster-04: time=0.33ms — Event Intelligence Online',
      '',
      '— All AI systems operational. Models are thinking.',
    ].join('\n'),

    whoami: 'A curious visitor who found our secret terminal. We like you already.',

    'cat ifdm':       'IFDM — Intellica Finance Data Model\nInternational standard DWH model for banking.\nRegulatory reporting, risk, CRM — pre-built.',
    'cat itdm':       'ITDM — Intellica Telecom Data Model\nDWH model for telecom operators.\nNetwork, billing, CRM dimensioning.',
    'cat hrdm':       'HRDM — Human Resources Data Model\nOptimized for HR analytics.\nWorkforce, payroll, talent management.',
    'cat icc':        'ICC — Intelligent Consistency Checker\nData reconciliation & quality control.\nAutomated alerts on data drift.',
    'cat retouch':    'ReTouch — Reference Data & Entry Management\nValidate & import external data.\nApproval workflows + audit trails.',
    'cat retable':    'Retable — No-Code Data Application Platform\nBuild apps without code.\nCollaborative, cloud-based.',
    'cat orqenta':    'Orqenta — Workflow Orchestration\nJob scheduling for regulated environments.\nComplex pipeline orchestration.',
    'cat talkto':     'Talk To — Natural Language Data Interaction\nAsk your data questions in plain English.\nAI-powered SQL generation + visualization.',
    'cat blueoctopus':'Blue Octopus — AI Event Intelligence\nReal-time critical event detection.\nAI-powered analytics & monitoring.',
    'cat var':        'VAR — Voice AI Recognition\nVoice signature creation & speaker matching.\nSecurity & compliance use cases.',
  };

  function initEggTerminal() {
    const terminal = document.getElementById('egg-terminal');
    const output = document.getElementById('egg-terminal-output');
    const input = document.getElementById('egg-terminal-input');
    const closeBtn = terminal.querySelector('.egg-terminal__close');
    let isOpen = false;

    // Konami code detection
    const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
    let konamiIndex = 0;

    function openTerminal() {
      isOpen = true;
      terminal.classList.add('open');
      terminal.setAttribute('aria-hidden', 'false');
      input.focus();
    }

    function closeTerminal() {
      isOpen = false;
      terminal.classList.remove('open');
      terminal.setAttribute('aria-hidden', 'true');
    }

    function addLine(text, cls) {
      const lines = text.split('\n');
      for (const line of lines) {
        const div = document.createElement('div');
        div.className = 'egg-terminal__line' + (cls ? ' egg-terminal__line--' + cls : '');
        div.textContent = line;
        output.appendChild(div);
      }
      output.scrollTop = output.scrollHeight;
    }

    function typewriterLine(text, cls) {
      const lines = text.split('\n');
      let lineIdx = 0;
      let charIdx = 0;
      let currentDiv = null;

      function typeNext() {
        if (lineIdx >= lines.length) return;

        if (!currentDiv) {
          currentDiv = document.createElement('div');
          currentDiv.className = 'egg-terminal__line' + (cls ? ' egg-terminal__line--' + cls : '');
          output.appendChild(currentDiv);
        }

        if (charIdx < lines[lineIdx].length) {
          currentDiv.textContent += lines[lineIdx][charIdx];
          charIdx++;
          output.scrollTop = output.scrollHeight;
          setTimeout(typeNext, 8 + Math.random() * 12);
        } else {
          lineIdx++;
          charIdx = 0;
          currentDiv = null;
          if (lineIdx < lines.length) {
            setTimeout(typeNext, 30);
          }
        }
      }
      typeNext();
    }

    function handleCommand(cmd) {
      const trimmed = cmd.trim().toLowerCase();
      addLine('visitor@intellica:~$ ' + cmd, 'command');

      if (trimmed === 'clear') {
        output.textContent = '';
        return;
      }

      if (trimmed === 'exit') {
        closeTerminal();
        return;
      }

      if (trimmed === '') return;

      // Check for cat <product> pattern
      const catMatch = trimmed.match(/^cat\s+(.+)$/);
      const lookupKey = catMatch ? 'cat ' + catMatch[1] : trimmed;

      const response = COMMANDS[lookupKey];
      if (response) {
        typewriterLine(response);
      } else {
        addLine("Command not found: " + trimmed + ". Type 'help' for available commands.", 'error');
      }
    }

    // Key listeners
    document.addEventListener('keydown', function(e) {
      // Konami code
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          if (!isOpen) openTerminal();
        }
      } else {
        konamiIndex = 0;
      }

      // Ctrl+Shift+T shortcut
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyT') {
        e.preventDefault();
        if (isOpen) closeTerminal(); else openTerminal();
      }

      // Escape to close
      if (e.code === 'Escape' && isOpen) {
        closeTerminal();
      }
    });

    // Input handling
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        handleCommand(input.value);
        input.value = '';
      }
    });

    // Close button
    closeBtn.addEventListener('click', closeTerminal);
  }

  initEggTerminal();
</script>
```

- [ ] **Step 1.2: Verify the file was created**

Run: `ls -la src/components/gamification/EasterEggTerminal.astro`
Expected: File exists

### Step 1.3: Integrate into Layout.astro

- [ ] In `src/layouts/Layout.astro`, add the import at the top (after CookieConsent import, line 6):

```astro
import EasterEggTerminal from '../components/gamification/EasterEggTerminal.astro';
```

- [ ] In `src/layouts/Layout.astro`, add the component render after CookieConsent (after line 137):

```astro
  <EasterEggTerminal />
```

### Step 1.4: Build and verify

- [ ] Run: `cd /home/cevheri/projects/intellica/intellica-tech.github.io && npm run build`
- [ ] Expected: Build succeeds with no errors
- [ ] Run: `npm run dev` and verify in browser: press Ctrl+Shift+T — terminal appears, type `help` — commands listed, type `exit` — closes

### Step 1.5: Commit

- [ ] Run:
```bash
git add src/components/gamification/EasterEggTerminal.astro
git add src/layouts/Layout.astro
git commit -m "feat: add Easter Egg Terminal gamification component

Global hidden terminal activated via Konami code or Ctrl+Shift+T.
Commands: about, ls products, cat <product>, ls team, ping ai, whoami.
Retro CRT effect with typewriter output animation.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Animated Data Flow Storytelling

**Files:**
- Create: `src/components/gamification/DataFlowStory.astro`
- Modify: `src/pages/data-platforms.astro:97-98` (insert new section before "WHY" section)

### Step 2.1: Create the DataFlowStory component

- [ ] Create `src/components/gamification/DataFlowStory.astro`:

```astro
---
// Scroll-driven data flow animation showing the ETL pipeline journey
// Each stage activates as the user scrolls, with flowing particles

const stages = [
  {
    id: 'extract',
    label: 'EXTRACT',
    title: 'Collect from 50+ Sources',
    desc: 'Databases, APIs, files, streaming — all unified.',
    icon: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="36" cy="12" r="8"/><circle cx="12" cy="36" r="8"/><circle cx="36" cy="36" r="8"/></svg>',
  },
  {
    id: 'transform',
    label: 'TRANSFORM',
    title: 'Apply Business Rules',
    desc: 'Filter, join, aggregate, enrich — enterprise-grade processing.',
    icon: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h40v8H24L14 32H4V8z"/><path d="M24 16l10 16h10V16H24z"/></svg>',
  },
  {
    id: 'load',
    label: 'LOAD',
    title: 'Land in Your Data Warehouse',
    desc: 'Structured, governed, and ready for consumption.',
    icon: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="24" cy="12" rx="18" ry="6"/><path d="M6 12v12c0 3.3 8 6 18 6s18-2.7 18-6V12"/><path d="M6 24c0 3.3 8 6 18 6s18-2.7 18-6"/></svg>',
  },
  {
    id: 'analyze',
    label: 'ANALYZE',
    title: 'Generate Insights & AI',
    desc: 'Dashboards, reports, ML models — value from data.',
    icon: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 40V24l8-8 8 12 8-20 8 8v24H4z"/><circle cx="36" cy="16" r="4"/></svg>',
  },
];
---

<section class="dfs" id="data-flow-story">
  <div class="container">
    <div class="text-center anim-fade-up">
      <div class="section-label" style="margin-inline:auto;">HOW IT WORKS</div>
      <h2 class="section-title">Your Data <span class="grad-text">Journey</span></h2>
      <p class="section-sub" style="color: rgba(255,255,255,0.7);">
        See how raw data transforms into business value — scroll to follow the flow.
      </p>
    </div>

    <div class="dfs__pipeline">
      {/* Connector line */}
      <div class="dfs__connector">
        <div class="dfs__connector-fill" id="dfs-connector-fill"></div>
      </div>

      {/* Stages */}
      {stages.map((stage, i) => (
        <div class="dfs__stage" id={'dfs-stage-' + stage.id} data-stage-index={i}>
          <div class="dfs__node">
            <div class="dfs__icon" set:html={stage.icon} />
            <div class="dfs__particles" aria-hidden="true">
              <span class="dfs__particle"></span>
              <span class="dfs__particle"></span>
              <span class="dfs__particle"></span>
              <span class="dfs__particle"></span>
              <span class="dfs__particle"></span>
            </div>
          </div>
          <div class="dfs__info">
            <div class="dfs__label">{stage.label}</div>
            <h3 class="dfs__title">{stage.title}</h3>
            <p class="dfs__desc">{stage.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div class="dfs__cta anim-fade-up" style="text-align:center; margin-top:60px;">
      <a href="/contact" class="btn btn-primary btn-pill btn-lg">Build Your Pipeline With Us</a>
    </div>
  </div>
</section>

<style>
  .dfs {
    padding: 80px 0;
    background: radial-gradient(ellipse at 50% 0%, #0f1f3a 0%, #030B16 70%);
    position: relative;
    overflow: hidden;
  }

  .dfs__pipeline {
    position: relative;
    max-width: 800px;
    margin: 60px auto 0;
    padding-left: 60px;
  }

  /* Vertical connector line */
  .dfs__connector {
    position: absolute;
    left: 23px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
  }

  .dfs__connector-fill {
    width: 100%;
    height: 0%;
    background: var(--grad-brand, linear-gradient(180deg, #00C896, #009FE3));
    border-radius: 3px;
    transition: height 0.3s ease-out;
  }

  /* Stage */
  .dfs__stage {
    display: flex;
    align-items: flex-start;
    gap: 32px;
    padding: 40px 0;
    position: relative;
    opacity: 0.2;
    transform: translateX(-20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .dfs__stage.active {
    opacity: 1;
    transform: translateX(0);
  }

  /* Node (icon circle) */
  .dfs__node {
    position: relative;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    margin-left: -60px;
  }

  .dfs__icon {
    width: 48px;
    height: 48px;
    background: #0a0e14;
    border: 2px solid rgba(0, 200, 150, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    position: relative;
    z-index: 2;
    transition: border-color 0.4s, box-shadow 0.4s;
  }

  .dfs__icon :global(svg) {
    width: 100%;
    height: 100%;
    stroke: rgba(255, 255, 255, 0.4);
    transition: stroke 0.4s;
  }

  .dfs__stage.active .dfs__icon {
    border-color: var(--clr-primary, #00C896);
    box-shadow: 0 0 20px rgba(0, 200, 150, 0.3);
  }

  .dfs__stage.active .dfs__icon :global(svg) {
    stroke: var(--clr-primary, #00C896);
  }

  /* Particles */
  .dfs__particles {
    position: absolute;
    inset: -8px;
    z-index: 1;
  }

  .dfs__particle {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--clr-primary, #00C896);
    opacity: 0;
  }

  .dfs__stage.active .dfs__particle {
    animation: dfs-particle 2s ease-in-out infinite;
  }

  .dfs__stage.active .dfs__particle:nth-child(1) { top: 0; left: 50%; animation-delay: 0s; }
  .dfs__stage.active .dfs__particle:nth-child(2) { top: 50%; right: 0; animation-delay: 0.4s; }
  .dfs__stage.active .dfs__particle:nth-child(3) { bottom: 0; left: 50%; animation-delay: 0.8s; }
  .dfs__stage.active .dfs__particle:nth-child(4) { top: 50%; left: 0; animation-delay: 1.2s; }
  .dfs__stage.active .dfs__particle:nth-child(5) { top: 25%; right: 10%; animation-delay: 1.6s; }

  @keyframes dfs-particle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 0.8; transform: scale(1.5); }
  }

  /* Info */
  .dfs__label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--clr-primary, #00C896);
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .dfs__title {
    font-size: 1.35rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 8px;
  }

  .dfs__desc {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
    max-width: 500px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .dfs { padding: 48px 0; }
    .dfs__pipeline { padding-left: 48px; }
    .dfs__node { margin-left: -48px; width: 40px; height: 40px; }
    .dfs__icon { width: 40px; height: 40px; padding: 8px; }
    .dfs__connector { left: 19px; }
    .dfs__stage { gap: 20px; padding: 28px 0; }
    .dfs__title { font-size: 1.15rem; }
    .dfs__desc { font-size: 0.88rem; }
  }
</style>

<script>
  function initDataFlowStory() {
    const stages = document.querySelectorAll('.dfs__stage');
    const connectorFill = document.getElementById('dfs-connector-fill');
    if (!stages.length || !connectorFill) return;

    const totalStages = stages.length;

    const observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            updateConnector();
          }
        });
      },
      { threshold: 0.4, rootMargin: '0px 0px -100px 0px' }
    );

    stages.forEach(function(stage) { observer.observe(stage); });

    function updateConnector() {
      const activeCount = document.querySelectorAll('.dfs__stage.active').length;
      const pct = (activeCount / totalStages) * 100;
      connectorFill.style.height = pct + '%';
    }
  }

  initDataFlowStory();
</script>
```

- [ ] **Step 2.2: Verify the file was created**

Run: `ls -la src/components/gamification/DataFlowStory.astro`
Expected: File exists

### Step 2.3: Integrate into data-platforms.astro

- [ ] In `src/pages/data-platforms.astro`, add the import at the top (inside the frontmatter `---` block):

```astro
import DataFlowStory from '../components/gamification/DataFlowStory.astro';
```

- [ ] In `src/pages/data-platforms.astro`, insert the component between the strategic overview section (ends around line 97 with `</section>`) and the "WHY" section (starts at line 99 with `<!-- ===== WHY ===== -->`):

```astro
  <DataFlowStory />
```

### Step 2.4: Build and verify

- [ ] Run: `npm run build`
- [ ] Expected: Build succeeds with no errors
- [ ] Run: `npm run dev` and navigate to `/data-platforms` — scroll down to see each stage animate in with particles and connector fill

### Step 2.5: Commit

- [ ] Run:
```bash
git add src/components/gamification/DataFlowStory.astro
git add src/pages/data-platforms.astro
git commit -m "feat: add scroll-driven data flow storytelling to Data Platforms

Four-stage animated pipeline (Extract -> Transform -> Load -> Analyze)
with IntersectionObserver triggers, particle effects, and progressive
connector fill. Pure CSS animations, zero dependencies.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Product Fit Recommender

**Files:**
- Create: `src/components/gamification/ProductFitWizard.astro`
- Modify: `src/pages/products.astro:94-96` (insert before the Data Models section)

### Step 3.1: Create the ProductFitWizard component

- [ ] Create `src/components/gamification/ProductFitWizard.astro`:

```astro
---
// Product Fit Recommender — 3-step wizard that recommends
// the best Intellica products based on user's industry, challenge, and priority.

const products = [
  { id: 'ifdm', name: 'IFDM', tagline: 'Finance Data Model', href: '/products/ifdm', tags: ['finance', 'data-quality', 'compliance', 'cost-reduction'] },
  { id: 'itdm', name: 'ITDM', tagline: 'Telecom Data Model', href: '/products/itdm', tags: ['telecom', 'data-quality', 'speed', 'cost-reduction'] },
  { id: 'hrdm', name: 'HRDM', tagline: 'HR Data Model', href: '/products/hrdm', tags: ['hr', 'data-quality', 'speed', 'cost-reduction'] },
  { id: 'icc', name: 'ICC', tagline: 'Consistency Checker', href: '/products/icc', tags: ['finance', 'telecom', 'hr', 'other', 'data-quality', 'compliance', 'cost-reduction'] },
  { id: 'retouch', name: 'ReTouch', tagline: 'Data Entry Management', href: '/products/retouch', tags: ['finance', 'telecom', 'hr', 'other', 'data-quality', 'manual-processes', 'compliance'] },
  { id: 'retable', name: 'Retable', tagline: 'No-Code Platform', href: '/products/retable', tags: ['finance', 'telecom', 'hr', 'other', 'manual-processes', 'speed', 'innovation'] },
  { id: 'orqenta', name: 'Orqenta', tagline: 'Workflow Orchestration', href: '/products/orqenta', tags: ['finance', 'telecom', 'other', 'manual-processes', 'speed', 'cost-reduction'] },
  { id: 'talkto', name: 'Talk To', tagline: 'NL-to-SQL AI', href: '/products/talk-to-your-data', tags: ['finance', 'telecom', 'hr', 'other', 'reporting-gaps', 'speed', 'innovation'] },
  { id: 'blueoctopus', name: 'Blue Octopus', tagline: 'Event Intelligence', href: '/products/blue-octopus', tags: ['finance', 'telecom', 'other', 'ai-readiness', 'compliance', 'innovation'] },
  { id: 'var', name: 'VAR', tagline: 'Voice AI Recognition', href: '/products/var', tags: ['finance', 'telecom', 'ai-readiness', 'compliance', 'innovation'] },
];

const steps = [
  {
    question: 'What is your industry?',
    options: [
      { label: 'Finance & Banking', value: 'finance', icon: 'bank' },
      { label: 'Telecom', value: 'telecom', icon: 'signal' },
      { label: 'Human Resources', value: 'hr', icon: 'people' },
      { label: 'Other', value: 'other', icon: 'building' },
    ],
  },
  {
    question: 'What is your biggest data challenge?',
    options: [
      { label: 'Data Quality & Consistency', value: 'data-quality', icon: 'search' },
      { label: 'Reporting Gaps', value: 'reporting-gaps', icon: 'chart' },
      { label: 'Manual Processes', value: 'manual-processes', icon: 'gear' },
      { label: 'AI Readiness', value: 'ai-readiness', icon: 'robot' },
    ],
  },
  {
    question: 'What is your top priority?',
    options: [
      { label: 'Cost Reduction', value: 'cost-reduction', icon: 'money' },
      { label: 'Speed & Efficiency', value: 'speed', icon: 'bolt' },
      { label: 'Compliance & Governance', value: 'compliance', icon: 'shield' },
      { label: 'Innovation', value: 'innovation', icon: 'rocket' },
    ],
  },
];

const iconMap: Record<string, string> = {
  bank:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>',
  signal:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V12M22 20V8"/></svg>',
  people:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10M8 6h.01M16 6h.01M8 10h.01M16 10h.01"/></svg>',
  search:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
  chart:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  gear:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  robot:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/></svg>',
  money:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  bolt:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  shield:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  rocket:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
};
---

<section class="pfw section section--light" id="product-fit-wizard">
  <div class="container">
    <div class="text-center anim-fade-up">
      <div class="section-label" style="margin-inline:auto;">PRODUCT FINDER</div>
      <h2 class="section-title" style="color:var(--clr-light-text);">
        Find Your <span class="grad-text">Ideal Solution</span>
      </h2>
      <p class="section-sub">Answer 3 quick questions and we will recommend the best products for you.</p>
    </div>

    <div class="pfw__card anim-fade-up" id="pfw-card">
      {/* Progress bar */}
      <div class="pfw__progress">
        <div class="pfw__progress-fill" id="pfw-progress-fill" style="width:0%"></div>
      </div>

      {/* Steps */}
      <div class="pfw__steps" id="pfw-steps">
        {steps.map((step, si) => (
          <div class="pfw__step" data-step={si} style={si > 0 ? 'display:none' : ''}>
            <h3 class="pfw__question">{step.question}</h3>
            <div class="pfw__options">
              {step.options.map((opt) => (
                <button
                  class="pfw__option"
                  data-step-index={si}
                  data-value={opt.value}
                  type="button"
                >
                  <span class="pfw__option-icon" set:html={iconMap[opt.icon]} />
                  <span class="pfw__option-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Result (hidden initially) */}
      <div class="pfw__result" id="pfw-result" style="display:none">
        <h3 class="pfw__result-title">Recommended For You</h3>
        <div class="pfw__result-list" id="pfw-result-list"></div>
        <div class="pfw__result-actions">
          <a href="/contact" class="btn btn-primary btn-pill">Get a Personalized Demo</a>
          <button class="pfw__restart" id="pfw-restart" type="button">Start Over</button>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .pfw__card {
    max-width: 680px;
    margin: 48px auto 0;
    background: #fff;
    border: 1px solid #E2E8F0;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;
  }

  .pfw__progress {
    height: 4px;
    background: #E2E8F0;
    border-radius: 4px;
    margin-bottom: 40px;
    overflow: hidden;
  }

  .pfw__progress-fill {
    height: 100%;
    background: var(--grad-brand, linear-gradient(135deg, #00C896, #009FE3));
    border-radius: 4px;
    transition: width 0.4s ease;
  }

  .pfw__question {
    font-size: 1.35rem;
    font-weight: 800;
    color: #1E293B;
    margin-bottom: 28px;
    text-align: center;
  }

  .pfw__options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .pfw__option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    background: #F8FAFC;
    border: 2px solid #E2E8F0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: left;
    font-family: inherit;
  }

  .pfw__option:hover {
    border-color: var(--clr-primary, #00C896);
    background: rgba(0, 200, 150, 0.04);
    transform: translateY(-2px);
  }

  .pfw__option-icon {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    color: var(--clr-primary, #00C896);
  }

  .pfw__option-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .pfw__option-label {
    font-size: 1rem;
    font-weight: 600;
    color: #1E293B;
  }

  /* Step transition */
  .pfw__step {
    animation: pfw-slide-in 0.35s ease;
  }

  @keyframes pfw-slide-in {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* Result */
  .pfw__result {
    animation: pfw-slide-in 0.4s ease;
  }

  .pfw__result-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: #1E293B;
    text-align: center;
    margin-bottom: 28px;
  }

  .pfw__result-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  .pfw__result-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .pfw__restart {
    background: none;
    border: none;
    color: #64748B;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    font-family: inherit;
  }

  .pfw__restart:hover {
    color: #1E293B;
  }

  @media (max-width: 768px) {
    .pfw__card { padding: 24px; }
    .pfw__options { grid-template-columns: 1fr; }
    .pfw__question { font-size: 1.15rem; }
  }
</style>

<script define:vars={{ products, steps }}>
  function initProductFitWizard() {
    var stepsContainer = document.getElementById('pfw-steps');
    var resultContainer = document.getElementById('pfw-result');
    var resultList = document.getElementById('pfw-result-list');
    var progressFill = document.getElementById('pfw-progress-fill');
    var restartBtn = document.getElementById('pfw-restart');
    if (!stepsContainer || !resultContainer || !resultList || !progressFill || !restartBtn) return;

    var totalSteps = steps.length;
    var currentStep = 0;
    var answers = [];

    // Attach click handlers to all option buttons
    document.querySelectorAll('.pfw__option').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var stepIndex = parseInt(btn.getAttribute('data-step-index'));
        var value = btn.getAttribute('data-value');
        handleAnswer(stepIndex, value);
      });
    });

    function handleAnswer(stepIndex, value) {
      answers[stepIndex] = value;
      currentStep = stepIndex + 1;

      if (currentStep < totalSteps) {
        showStep(currentStep);
        updateProgress();
      } else {
        showResult();
      }
    }

    function showStep(index) {
      var allSteps = stepsContainer.querySelectorAll('.pfw__step');
      allSteps.forEach(function(s, i) {
        s.style.display = i === index ? '' : 'none';
        if (i === index) {
          // Re-trigger animation
          s.style.animation = 'none';
          s.offsetHeight; // force reflow
          s.style.animation = '';
        }
      });
    }

    function updateProgress() {
      var pct = (currentStep / totalSteps) * 100;
      progressFill.style.width = pct + '%';
    }

    function showResult() {
      progressFill.style.width = '100%';
      stepsContainer.style.display = 'none';
      resultContainer.style.display = '';

      // Score products
      var scored = products.map(function(p) {
        var score = 0;
        answers.forEach(function(ans) {
          if (p.tags.indexOf(ans) !== -1) score++;
        });
        return { id: p.id, name: p.name, tagline: p.tagline, href: p.href, score: score };
      });

      // Sort by score desc, take top 3
      scored.sort(function(a, b) { return b.score - a.score; });
      var top3 = scored.slice(0, 3);
      var maxScore = totalSteps;

      // Build result items safely using DOM methods
      resultList.textContent = '';
      top3.forEach(function(p) {
        var matchPct = Math.round((p.score / maxScore) * 100);

        var item = document.createElement('a');
        item.href = p.href;
        item.className = 'pfw__result-item';
        item.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;text-decoration:none;transition:all 0.25s ease;';

        var info = document.createElement('div');
        var nameEl = document.createElement('span');
        nameEl.style.cssText = 'font-size:1.1rem;font-weight:750;color:#1E293B;display:block;';
        nameEl.textContent = p.name;
        var taglineEl = document.createElement('span');
        taglineEl.style.cssText = 'font-size:0.85rem;color:#64748B;';
        taglineEl.textContent = p.tagline;
        info.appendChild(nameEl);
        info.appendChild(taglineEl);

        var matchEl = document.createElement('span');
        matchEl.style.cssText = 'font-size:0.9rem;font-weight:700;color:var(--clr-primary, #00C896);white-space:nowrap;';
        matchEl.textContent = matchPct + '% match';

        item.appendChild(info);
        item.appendChild(matchEl);
        resultList.appendChild(item);
      });
    }

    restartBtn.addEventListener('click', function() {
      currentStep = 0;
      answers.length = 0;
      progressFill.style.width = '0%';
      stepsContainer.style.display = '';
      resultContainer.style.display = 'none';
      showStep(0);
    });
  }

  initProductFitWizard();
</script>
```

- [ ] **Step 3.2: Verify the file was created**

Run: `ls -la src/components/gamification/ProductFitWizard.astro`
Expected: File exists

### Step 3.3: Integrate into products.astro

- [ ] In `src/pages/products.astro`, add the import inside the frontmatter `---` block:

```astro
import ProductFitWizard from '../components/gamification/ProductFitWizard.astro';
```

- [ ] In `src/pages/products.astro`, insert the component after the closing `</style>` tag (line 94) and before the Data Models section `<!-- Data Models -->` (line 96):

```astro
  <ProductFitWizard />
```

### Step 3.4: Build and verify

- [ ] Run: `npm run build`
- [ ] Expected: Build succeeds with no errors
- [ ] Run: `npm run dev` and navigate to `/products` — click through 3 wizard steps, verify top 3 products shown with match percentages, "Start Over" resets

### Step 3.5: Commit

- [ ] Run:
```bash
git add src/components/gamification/ProductFitWizard.astro
git add src/pages/products.astro
git commit -m "feat: add Product Fit Recommender wizard to Products page

3-step interactive wizard: industry -> challenge -> priority.
Recommends top 3 products with match percentage based on tag scoring.
CTA leads to contact page for personalized demo.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Final: Phase 1 Complete Verification

After all 3 tasks are implemented and individually committed:

- [ ] Run: `npm run build`
- [ ] Expected: Full build succeeds
- [ ] Verify all three features work:
  1. Ctrl+Shift+T — Easter Egg Terminal opens on any page
  2. `/data-platforms` — Scroll reveals data flow stages
  3. `/products` — Wizard recommends products
