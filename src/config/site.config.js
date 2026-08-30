/* ═══════════════════════════════════════════════════════════════
   ⚙️  YOUR SITE — EDIT THIS FILE, NOTHING ELSE
   ═══════════════════════════════════════════════════════════════

   Everything on your site comes from this one file.
   Change the text here and the site updates. You do not need to
   open any other file to launch.

   Sections in this file:
     1. IDENTITY      — your name, tagline, quote
     2. SCREENS       — the 9 screens, their art and colours
     3. CONTENT       — what appears on each screen
     4. LOADOUT       — the Tab wheel
     5. ADVANCED      — progression tuning (optional)

   ═══════════════════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────────────────
   1. IDENTITY
   ─────────────────────────────────────────────────────────────── */

export const SITE = {
  // Appears as the big title on the main menu. Two lines.
  titleLine1: 'STRATON',
  titleLine2: 'TESHA',

  // The script word underneath
  subtitle: 'Developer',

  // Browser tab + search results
  metaTitle: 'Straton Florentin Tesha | Software Developer & Systems Builder',
  metaDescription: 'Straton Florentin Tesha is a software developer and systems builder from Tanzania creating digital products across logistics, healthcare, AI, finance, automation, and business technology.',

  // Bottom-right handwritten quote. Two lines + attribution.
  quoteLine1: 'I build digital systems',
  quoteLine2: 'for real-world problems.',
  quoteAuthor: 'Straton Florentin Tesha',

  // Bottom-left strip
  tagline: ['Software Developer', 'Systems Builder', 'Technology Entrepreneur'],

  // Letter shown in the HUD avatar box, top-right
  avatarLetter: 'S',

  // Starting money and the total it counts up to on load
  moneyTarget: 1250000
};


/* ───────────────────────────────────────────────────────────────
   2. SCREENS

   Each screen needs:
     id        — must match a file in src/components/screens/
     label     — what shows in the menu
     frame     — your image in /public/frames/
     objective — the mission text, bottom-left. <br> for line break
     map       — [x%, y%] where the minimap dot sits
     accent    — main colour for this screen
     accent2   — secondary colour
     fallback  — 3 gradient colours used if the image is missing
     counts    — true if visiting it should light a star

   💡 The accent colours are what make this template feel expensive.
      Pick them FROM your image. Eyedropper a bright colour and a
      warm highlight. The whole interface recolours to match.

   NOTE: these accent/fallback values are the template's original,
   pre-tuned day-cycle palette (magic hour → morning → storm →
   midday → blue hour → deep night → midday → night → sunrise).
   They already match the day-cycle art direction in PROMPTS.md.
   Once you generate your final 9 images, eyedropper the real
   colours from them and update both this file AND the matching
   [data-screen="..."] line in src/styles/global.css (see Step 4
   of SETUP.md).
   ─────────────────────────────────────────────────────────────── */

export const SCREENS = [
  {
    id: 'hero',
    label: 'Start',
    frame: '/frames/01-hero.avif',
    objective: 'Explore the work of<br>Straton Tesha',
    map: [22, 70],
    accent: '#ff2d9b',
    accent2: '#ffb238',
    fallback: ['#3d1259', '#d61f6e', '#f97316'],
    // tuned from the real hero artwork — face/upper body sits upper-right
    mobilePosition: '68% 18%',
    counts: false
  },
  {
    id: 'about',
    label: 'About',
    frame: '/frames/02-about.avif',
    objective: 'Learn what<br>I build and why',
    map: [30, 62],
    accent: '#ea8633', // sampled from real artwork
    accent2: '#4fb6c9',
    fallback: ['#8fc7d9', '#f2d7a8', '#ffe9c4'],
    mobilePosition: '69% 18%', // tuned — character sits upper-right
    counts: true
  },
  {
    id: 'skills',
    label: 'Skills',
    frame: '/frames/03-skills.avif',
    objective: 'Review the stack<br>I build with',
    map: [46, 26],
    accent: '#7fb2d9', // already matched the real artwork's storm-blue palette
    accent2: '#ffb238',
    fallback: ['#101823', '#2b3d52', '#5b7183'],
    mobilePosition: '76% 26%', // tuned — character sits right, mid-height
    counts: true
  },
  {
    id: 'projects',
    label: 'Projects',
    frame: '/frames/04-projects.avif',
    objective: 'Inspect the<br>systems I have built',
    map: [58, 40],
    accent: '#0b72c5', // sampled from real artwork — a clean blue, not teal
    accent2: '#a8d4f0', // pale sky highlight, sampled from the same scene
    fallback: ['#1fb6e8', '#5fe0d8', '#f7e6c8'],
    mobilePosition: '74% 28%', // tuned — character sits right, mid-height
    counts: true
  },
  {
    id: 'experience',
    label: 'Experience',
    frame: '/frames/05-experience.avif',
    objective: 'Trace how I<br>build through practice',
    map: [72, 54],
    accent: '#f38728', // sampled from real artwork — warm sunset orange, not purple
    accent2: '#ffa83c',
    fallback: ['#1a1246', '#4b3d8f', '#c86a4a'],
    mobilePosition: '73% 28%', // tuned — character sits right, mid-height
    counts: true
  },
  {
    id: 'achievements',
    label: 'Achievements',
    frame: '/frames/06-achievements.avif',
    objective: 'Collect what<br>has shipped so far',
    map: [66, 78],
    accent: '#8b5cf6', // sampled from real artwork — deep violet, not magenta-pink
    accent2: '#24e0e0',
    fallback: ['#2a0b3d', '#a01f7a', '#ff3d7a'],
    mobilePosition: '74% 20%', // tuned — character sits upper-right
    counts: true
  },
  {
    id: 'services',
    label: 'Services',
    frame: '/frames/07-services.avif',
    objective: 'See what I<br>can build for you',
    map: [38, 84],
    accent: '#5865c9', // sampled from real artwork — deep indigo-blue night
    accent2: '#d97a8c', // muted rose/coral highlight, sampled from the same scene
    fallback: ['#22a8e8', '#8fd8f0', '#f0dcc4'],
    mobilePosition: '70% 35%', // tuned — character sits right, seated mid-frame
    counts: true
  },
  {
    id: 'contact',
    label: 'Contact',
    frame: '/frames/08-contact.avif',
    objective: 'Open a line<br>of contact',
    map: [82, 34],
    accent: '#ea7f30', // sampled from real artwork — warm sunset orange, not blue
    accent2: '#7c6fc9', // cool violet highlight from the upper sky, sampled
    fallback: ['#05060f', '#141a2e', '#2e2438'],
    mobilePosition: '55% 26%', // tuned — character sits closer to center than others
    counts: true
  },
  {
    id: 'outro',
    label: 'Exit',
    frame: '/frames/09-outro.avif',
    objective: 'Keep building<br>real things',
    map: [88, 88],
    accent: '#d9634e', // sampled from real artwork — warm terracotta dusk
    accent2: '#8a6bb0', // soft violet highlight from the sky, sampled
    fallback: ['#8f9fd8', '#f2b8c6', '#ffd9a8'],
    mobilePosition: '70% 22%', // tuned — character stands right, upper-frame
    counts: false
  }
];


/* ───────────────────────────────────────────────────────────────
   3. CONTENT — what appears on each screen
   ─────────────────────────────────────────────────────────────── */

export const ABOUT = {
  title: 'About',
  subtitle: 'Systems',

  intro: `I'm a software developer and systems builder from Tanzania. I turn
          real-world problems — in logistics, healthcare, finance, and
          organizations — into practical digital systems.`,

  // Icon options: ◆ ◉ ✦ ▲ ● ◇ ★ ⚡ ✈ ◷
  cards: [
    { icon: '◆', label: 'Projects', value: '08+ Built' },
    { icon: '◉', label: 'Domains',  value: '06+ Industries' },
    { icon: '✦', label: 'Stack',    value: 'Full-Stack' }
  ],

  button: { text: 'View Journey', goesTo: 'experience' }
};


export const SKILLS = {
  title: 'Skills',
  subtitle: 'I Build',

  // Keep to 7 or fewer so they fit without scrolling
  list: [
    { name: 'Full-Stack Development',   value: 92 },
    { name: 'Business Systems & ERP',   value: 94 },
    { name: 'React / Next.js / TS',     value: 90 },
    { name: 'PostgreSQL / Supabase',    value: 88 },
    { name: 'AI Integration',           value: 84 },
    { name: 'UI / UX Engineering',      value: 86 },
    { name: 'API & Backend Systems',    value: 88 },
    { name: 'Automation',               value: 84 }
  ]
};


export const PROJECTS = {
  title: 'Projects',
  subtitle: "I've Built",

  // The two strongest case studies — shown large, with tech stack
  featured: [
    {
      icon: '◆',
      name: 'Calvary Connect',
      category: 'Logistics ERP',
      description: 'A connected business management platform for logistics operations — fleet, drivers, trips, fuel, finance, maintenance, communication, and reporting.',
      tech: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL'],
      github: 'https://github.com/stratonflorentin-dot/Calvary-connect'
    },
    {
      icon: '✦',
      name: 'NiaCare Health',
      category: 'HealthTech + AI',
      description: 'A Tanzania-focused digital healthcare platform combining patient identity, appointments, medical records, billing, prescriptions, telehealth, and AI-assisted triage.',
      tech: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'AI', 'Vercel'],
      github: 'https://github.com/arcticchaincoldlogisticsandsto-coder/Niacare-health'
    }
  ],

  // The rest — shown compact, same weight as each other
  more: [
    {
      icon: '▲',
      name: 'Winners Church Web',
      category: 'Organization Platform',
      description: 'A digital platform built around church communication, organization, content, and community workflows.',
      github: 'https://github.com/elonixtz-dotcom/winners-church-web'
    },
    {
      icon: '●',
      name: 'myShopCare',
      category: 'Retail Technology',
      description: 'A digital business management project focused on retail and shop operations.',
      github: 'https://github.com/calvaryadmin466-sudo/myShopCare'
    },
    {
      icon: '◇',
      name: 'MoneyWise',
      category: 'FinTech',
      description: 'A financial management application focused on organizing and understanding financial activity.',
      github: 'https://github.com/calvaryadmin466-sudo/moneywise'
    },
    {
      icon: '⚡',
      name: 'AEGIS',
      category: 'AI / Advanced Systems',
      description: 'An AI and advanced-systems project exploring intelligent automation.',
      github: 'https://github.com/stratonflorentin-dot/AEGIS'
    },
    {
      icon: '◈',
      name: 'My-AUTO',
      category: 'Automotive Technology',
      description: 'A software project applying technology to automotive workflows.',
      github: 'https://github.com/desktopteshier-beep/my-AUTO'
    },
    {
      icon: '◷',
      name: 'Instagram Transcriber',
      category: 'Automation / AI Utility',
      description: 'An AI-powered automation tool for transcribing Instagram video content.',
      github: 'https://github.com/stratonflorentin-dot/-instagram-transcriber-v'
    }
  ],

  button: { text: 'Continue', goesTo: 'experience' }
};


export const EXPERIENCE = {
  title: 'Experience',
  subtitle: 'In Practice',

  // These are areas of practice, not a dated employment history.
  timeline: [
    {
      period: 'PRACTICE',
      role: 'Software & Systems Development',
      description: 'Designing and developing full-stack applications across logistics, healthcare, finance, retail, and organizational technology.'
    },
    {
      period: 'LOGISTICS',
      role: 'Logistics Technology',
      description: 'Applying software to real operational challenges involving fleet management, fuel, trips, expenses, maintenance, and business reporting.'
    },
    {
      period: 'AI + AUTOMATION',
      role: 'AI & Automation',
      description: 'Exploring practical ways to integrate artificial intelligence into software products and business workflows.'
    },
    {
      period: 'BUSINESS',
      role: 'Business Technology',
      description: 'Building software around real operational workflows and business requirements.'
    }
  ]
};


export const ACHIEVEMENTS = {
  title: 'Achievements',
  subtitle: "I've Built",

  list: [
    { icon: '◆', name: 'Calvary Connect',        description: 'Logistics ERP platform.' },
    { icon: '✦', name: 'NiaCare Health',          description: 'Digital healthcare platform with AI-assisted triage.' },
    { icon: '▲', name: 'Multi-Domain Development', description: 'Projects across logistics, healthcare, finance, retail, automotive, and organizational technology.' },
    { icon: '●', name: 'Full-Stack Systems',      description: 'Applications involving frontend, backend, databases, authentication, APIs, and deployment.' },
    { icon: '⚡', name: 'AI Integration',          description: 'Practical experimentation with AI inside real software workflows.' },
    { icon: '◷', name: 'Business Automation',     description: 'Turning manual workflows into structured digital systems.' }
  ],

  button: { text: 'View Services', goesTo: 'services' }
};


export const SERVICES = {
  titleLine1: 'I Build For',
  titleLine2: 'Real Problems',
  subtitle: 'Services',

  intro: `I build custom software, business systems, and AI-integrated
          products for real operational problems — from dashboards to
          full digital transformation.`,

  list: [
    { name: 'Custom Software' },
    { name: 'Business Systems' },
    { name: 'AI Integration' },
    { name: 'Digital Transformation' },
    { name: 'Dashboards & Analytics' },
    { name: 'Product Development' }
  ],

  stats: [
    { number: '08+', label: 'Projects' },
    { number: '06+', label: 'Domains' },
    { number: 'Full', label: 'Stack' }
  ],

  button: { text: 'Work With Me', goesTo: 'contact' }
};


export const CONTACT = {
  title: 'Contact',
  subtitle: "Let's Build",

  // url makes the row clickable. Leave '' for plain text.
  links: [
    { icon: 'GH', label: 'GitHub',    value: '@stratonflorentin-dot', url: 'https://github.com/stratonflorentin-dot' },
    { icon: 'WA', label: 'WhatsApp',  value: '+255 775 690 768', url: 'https://wa.me/255775690768' },
    { icon: '◎',  label: 'Instagram', value: '@teshier6', url: 'https://www.instagram.com/teshier6' },
    { icon: '✉',  label: 'Email',     value: 'stratonflorentin@gmail.com', url: 'mailto:stratonflorentin@gmail.com' },
    { icon: 'in', label: 'LinkedIn',  value: 'Add in site.config.js', url: '' }
  ],

  button: { text: 'Continue', goesTo: 'outro' }
};


export const OUTRO = {
  kicker: 'Thank You For Visiting',
  titleLine1: 'Keep',
  titleLine2: 'Building',
  closing: 'Technology is most valuable when it solves a real problem.',
  subtitle: 'Straton Tesha',
  button: { text: '⌂ Back to Home', goesTo: 'hero' }
};


/* ───────────────────────────────────────────────────────────────
   4. LOADOUT WHEEL — opens with Tab

   8 items works best. 6 or 10 also fine. The wheel spaces them
   automatically.
   ─────────────────────────────────────────────────────────────── */

export const LOADOUT = {
  hubTitle: 'Loadout',
  hubSubtitle: 'Tech Stack',

  items: [
    { name: 'Next.js',     role: 'Framework' },
    { name: 'React',       role: 'UI' },
    { name: 'TypeScript',  role: 'Language' },
    { name: 'Supabase',    role: 'Backend' },
    { name: 'PostgreSQL',  role: 'Database' },
    { name: 'Node.js',     role: 'Runtime' },
    { name: 'AI / Groq',   role: 'AI Layer' },
    { name: 'Vercel',      role: 'Deploy' }
  ]
};


/* ───────────────────────────────────────────────────────────────
   5. ADVANCED — optional tuning
   ─────────────────────────────────────────────────────────────── */

export const SETTINGS = {
  // Show the ✓ ticks and star progression? Set false for a plain menu.
  progressionEnabled: true,

  // How many stars in the HUD (max 6)
  totalStars: 6,

  // Money added per new section visited
  moneyPerSection: 150000,
  moneyBonusPerSection: 25000,

  // Remember progress between visits
  saveProgress: true,

  // Show the keyboard hint bar at the bottom
  showKeyHints: true,

  // Seconds before the loading splash clears
  splashDuration: 2.2
};


/* ── derived, do not edit ── */
export const TOTAL_SECTIONS = SCREENS.filter((s) => s.counts).length;
