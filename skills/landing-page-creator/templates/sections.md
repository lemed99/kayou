# Landing Page Section Templates

Quick reference for landing page sections.

## Section Order

1. Hero
2. Features
3. Component Showcase
4. Live Demo
5. Statistics
6. Quick Start
7. Testimonials (optional)
8. Footer

## Hero Section

**Purpose:** Eye-catching introduction with CTA

**Elements:**
- Gradient background with animated blobs
- Large headline with gradient text
- Subtitle explaining value proposition
- Primary CTA button (Get Started)
- Secondary CTA button (GitHub)
- Install command with copy button
- Quick stats (components, downloads, stars)

**Code skeleton:**
```tsx
<section class="hero">
  <div class="background" />
  <div class="content">
    <h1>Library Name</h1>
    <p>Value proposition</p>
    <div class="ctas">
      <Button>Get Started</Button>
      <Button>GitHub</Button>
    </div>
    <code>npm install library</code>
    <div class="stats">...</div>
  </div>
</section>
```

## Features Section

**Purpose:** Key benefits in grid format

**Elements:**
- Section title
- 6-8 feature cards
- Icon, title, description per card

**Common features:**
1. Type-Safe (TypeScript)
2. Accessible (WCAG compliant)
3. Performant (SolidJS reactivity)
4. Customizable (Theming)
5. Well Documented
6. Enterprise Ready

**Code skeleton:**
```tsx
<section class="features">
  <h2>Built for Modern Development</h2>
  <div class="grid">
    <For each={features}>
      {(f) => <FeatureCard icon={f.icon} title={f.title} />}
    </For>
  </div>
</section>
```

## Component Showcase

**Purpose:** Interactive component browser

**Elements:**
- Search input
- Category filters
- Component cards with live preview
- Code snippets

**Code skeleton:**
```tsx
<section class="showcase">
  <h2>Explore Components</h2>
  <Input placeholder="Search..." />
  <div class="filters">
    <For each={categories}>
      {(c) => <Badge onClick={() => setCategory(c)}>{c}</Badge>}
    </For>
  </div>
  <div class="grid">
    <For each={filteredComponents()}>
      {(comp) => <ComponentCard component={comp} />}
    </For>
  </div>
</section>
```

## Live Demo

**Purpose:** Interactive code playground

**Elements:**
- Code editor (Monaco or textarea)
- Live preview panel
- Run button
- Error display

**Code skeleton:**
```tsx
<section class="live-demo">
  <h2>Try It Live</h2>
  <div class="split">
    <div class="editor">
      <textarea value={code()} onInput={setCode} />
      <Button onClick={runCode}>Run</Button>
    </div>
    <div class="preview">
      {output()}
    </div>
  </div>
</section>
```

## Statistics Section

**Purpose:** Social proof with numbers

**Elements:**
- Download count
- GitHub stars
- Component count
- Contributors (optional)

**Code skeleton:**
```tsx
<section class="stats">
  <div class="stat">
    <span class="number">50+</span>
    <span class="label">Components</span>
  </div>
  <div class="stat">
    <span class="number">10k+</span>
    <span class="label">Downloads</span>
  </div>
</section>
```

## Quick Start

**Purpose:** Fast onboarding guide

**Elements:**
- Installation commands
- Basic usage example
- Next steps links

**Code skeleton:**
```tsx
<section class="quick-start">
  <h2>Get Started in 30 Seconds</h2>
  <div class="steps">
    <div class="step">
      <h3>1. Install</h3>
      <code>npm install library</code>
    </div>
    <div class="step">
      <h3>2. Import</h3>
      <code>import {"{"} Button {"}"}</code>
    </div>
    <div class="step">
      <h3>3. Use</h3>
      <code>{"<Button>Click</Button>"}</code>
    </div>
  </div>
</section>
```

## Footer

**Purpose:** Links and legal

**Elements:**
- Navigation links
- Social links
- Copyright
- License info

**Columns:**
- Documentation
- Community
- Resources
- Legal

## Design Tokens

### Colors (Tailwind)
```
Primary: blue-600
Secondary: purple-600
Text: gray-900 (dark: white)
Muted: gray-600 (dark: gray-400)
Background: white (dark: gray-900)
```

### Spacing
```
Section padding: py-24
Container max: max-w-7xl
Grid gap: gap-8
```

### Animation
```css
/* Blob animation */
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Transitions */
transition: all 300ms ease;
```
