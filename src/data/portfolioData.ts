export interface SkillItem {
  id: string;
  name: string;
  category: '3D & Frontend' | 'Backend & Systems' | 'Gaming & Tactics';
  focusLevel: number;
  tag: string;
  summary: string;
  tools: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: '3D & WebGL' | 'Esports Tech' | 'Full-Stack';
  year: string;
  role: string;
  summary: string;
  architecture: string;
  highlight: string;
  stack: string[];
  image: string;
  accent: 'purple' | 'blue';
  liveUrl: string;
}

export interface SensitivityPreset {
  id: string;
  name: string;
  playstyle: string;
  dpi: string;
  fireButtonSize: string;
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
}

export interface WeaponLoadout {
  id: string;
  name: string;
  role: string;
  rangeFocus: string;
  playStyle: string;
  signatureSkin: string;
  controlRating: number;
}

export interface HighlightEvent {
  timeSec: number;
  label: string;
  weapon: string;
  detail: string;
  type: 'knock' | 'wipe' | 'booyah';
}

export interface HighlightClip {
  id: string;
  title: string;
  map: string;
  mode: string;
  durationSec: number;
  image: string;
  summary: string;
  tags: string[];
  events: HighlightEvent[];
}

export const PORTFOLIO_IMAGES = {
  avatar: '/src/assets/images/karthik_avatar_1795509357797.jpg',
  nexusArena: '/src/assets/images/project_nexus_arena_1795509358241.jpg',
  ffTelemetry: '/src/assets/images/project_ff_telemetry_1795509359016.jpg',
  cloudIde: '/src/assets/images/project_cloud_ide_1795509359674.jpg',
  highlightArena: '/src/assets/images/ff_highlight_arena_1795509360475.jpg',
};

export const CORE_PILLARS = [
  {
    label: '3D Web Graphics',
    value: 'Three.js',
    detail: 'Interactive PBR & WebGL2 scenes',
  },
  {
    label: 'Frontend Craft',
    value: 'React + TS',
    detail: 'Responsive, high-contrast interfaces',
  },
  {
    label: 'Free Fire Role',
    value: 'Rusher · IGL',
    detail: 'Close-quarters entry & squad calls',
  },
  {
    label: 'Render Target',
    value: '60 FPS',
    detail: 'Smooth hardware-accelerated motion',
  },
];

export const SKILLS: SkillItem[] = [
  {
    id: 'threejs',
    name: 'Three.js & WebGL2 Scenes',
    category: '3D & Frontend',
    focusLevel: 92,
    tag: 'Primary Focus',
    summary:
      'Procedural 3D geometry, PBR material calibration with Studio IBL, custom canvas textures, and smooth frame-rate independent damping.',
    tools: ['Three.js', 'WebGL2', 'InstancedMesh', 'PMREM'],
  },
  {
    id: 'react-ts',
    name: 'React & TypeScript UI',
    category: '3D & Frontend',
    focusLevel: 95,
    tag: 'Core Stack',
    summary:
      'Component-driven architecture, type-safe state management, responsive mobile-first layouts with Tailwind CSS, and accessible interactive controls.',
    tools: ['React 19', 'TypeScript', 'Tailwind CSS', 'Motion'],
  },
  {
    id: 'canvas-motion',
    name: 'Interactive Canvas & Motion',
    category: '3D & Frontend',
    focusLevel: 88,
    tag: 'Visual Craft',
    summary:
      'Raycasting object inspection, smooth camera transitions, interactive timelines, and compositor-friendly micro-animations.',
    tools: ['HTML5 Canvas', 'Raycasting', 'CSS Keyframes'],
  },
  {
    id: 'node-express',
    name: 'Node.js & Express APIs',
    category: 'Backend & Systems',
    focusLevel: 86,
    tag: 'Backend Stack',
    summary:
      'RESTful API design, server-side routing, environment configuration, and clean data validation patterns for full-stack web apps.',
    tools: ['Node.js', 'Express', 'REST APIs', 'JSON'],
  },
  {
    id: 'tooling-build',
    name: 'Modern Build & Dev Tooling',
    category: 'Backend & Systems',
    focusLevel: 89,
    tag: 'Workflow',
    summary:
      'Fast Vite bundling, modular project structure, clean Git workflows, and responsive cross-device debugging.',
    tools: ['Vite', 'Git', 'TypeScript Compiler', 'Responsive QA'],
  },
  {
    id: 'ff-rusher',
    name: 'Close-Range Entry & Drag Aim',
    category: 'Gaming & Tactics',
    focusLevel: 94,
    tag: 'Free Fire',
    summary:
      'Fast 4-finger claw movement, crouch gloo-wall placement, and disciplined crosshair placement for SMG and shotgun duels.',
    tools: ['MP40', 'M1887', '4-Finger Claw', 'Fast Gloo'],
  },
  {
    id: 'ff-igl',
    name: 'Squad Comms & Zone Rotations',
    category: 'Gaming & Tactics',
    focusLevel: 90,
    tag: 'Tactical IGL',
    summary:
      'Coordinating drop splits, compound pushes, utility timing, and safe-zone edge holds in custom Clash Squad and Battle Royale lobbies.',
    tools: ['Bermuda', 'Purgatory', 'Observatory', 'Callouts'],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'nexus-arena',
    title: 'Nexus 3D Arena Visualizer',
    category: '3D & WebGL',
    year: '2026',
    role: '3D Graphics & UI Build',
    summary:
      'Interactive isometric WebGL spatial visualizer built to inspect level geometry, camera angles, and glowing vector grid layouts in real time.',
    architecture:
      'Combines Three.js InstancedMesh elements, procedural grid textures with anisotropic sharpness, and smooth damped OrbitControls.',
    highlight: 'Designed for crisp 60fps desktop and mobile WebGL interaction.',
    stack: ['Three.js', 'TypeScript', 'WebGL2', 'Tailwind CSS'],
    image: PORTFOLIO_IMAGES.nexusArena,
    accent: 'purple',
    liveUrl: '#home',
  },
  {
    id: 'booyah-pulse',
    title: 'BooyahPulse Map Planner',
    category: 'Esports Tech',
    year: '2026',
    role: 'Frontend & Canvas Concept',
    summary:
      'Tactical Battle Royale map and zone-rotation planner for visualizing drop locations, squad splits, and engagement lanes on Bermuda.',
    architecture:
      'Built with layered HTML5 Canvas overlays, crisp color-coded vector paths, and instant mode switching between BR and Clash Squad.',
    highlight: 'Helps squads map out clean rotation routes before custom rooms.',
    stack: ['React', 'HTML5 Canvas', 'TypeScript', 'Tailwind CSS'],
    image: PORTFOLIO_IMAGES.ffTelemetry,
    accent: 'blue',
    liveUrl: '#freefire',
  },
  {
    id: 'shader-forge',
    title: 'ShaderForge Visual Workspace',
    category: 'Full-Stack',
    year: '2025',
    role: 'Creator & UI Architect',
    summary:
      'Dark-mode visual node editor concept for experimenting with real-time GLSL lighting uniforms, neon materials, and procedural surfaces.',
    architecture:
      'Modular node-graph state architecture paired with live material previews and responsive split-pane controls.',
    highlight: 'Focused on distraction-free dark studio ergonomics and clear hierarchy.',
    stack: ['TypeScript', 'React', 'GLSL', 'Node.js'],
    image: PORTFOLIO_IMAGES.cloudIde,
    accent: 'purple',
    liveUrl: '#skills',
  },
  {
    id: 'scrim-hud',
    title: 'ApexScrim Custom Room HUD',
    category: 'Esports Tech',
    year: '2025',
    role: 'Frontend Systems Build',
    summary:
      'Streamlined Free Fire custom match scoreboard and replay timeline interface built with dark obsidian styling and neon blue/purple accents.',
    architecture:
      'Tabular-numeral score layouts, interactive timeline scrubbers, and responsive card grids tailored for mobile and desktop screens.',
    highlight: 'Built to keep match callouts, loadouts, and clip events clear at a glance.',
    stack: ['React 19', 'TypeScript', 'Motion', 'Tailwind CSS'],
    image: PORTFOLIO_IMAGES.highlightArena,
    accent: 'blue',
    liveUrl: '#highlights',
  },
];

export const FF_PROFILE = {
  ign: 'KB・SHADOW',
  uid: '2048917364',
  server: 'India (IND)',
  guild: 'VOID SYNDICATE',
  role: 'Primary Rusher · IGL',
  setup: '4-Finger Claw · Fast Gloo',
  modes: {
    br: {
      label: 'Battle Royale',
      focusRole: 'Entry Rusher & Zone Caller',
      preferredMap: 'Bermuda · Purgatory',
      dropZone: 'Clock Tower / Brasilia',
      primaryCombo: 'MP40 + Woodpecker',
      utilityFocus: 'Gloo Wall Bait & High-Ground',
      paceStyle: 'Aggressive Edge Rotation',
    },
    cs: {
      label: 'Clash Squad',
      focusRole: 'Frontline Duelist',
      preferredMap: 'Observatory · Mill',
      dropZone: 'Upper Ridge & Mid-Lane',
      primaryCombo: 'M1887 + Desert Eagle',
      utilityFocus: 'Flash Freeze & Fast Crouch Gloo',
      paceStyle: 'Fast Flank & Crossfire',
    },
  },
};

export const SENSITIVITY_PRESETS: SensitivityPreset[] = [
  {
    id: 'rush',
    name: 'Fast Rush',
    playstyle: 'Responsive close-quarters SMG + M1887 flicks',
    dpi: '620 DPI',
    fireButtonSize: '46%',
    general: 194,
    redDot: 178,
    scope2x: 162,
    scope4x: 148,
    sniperScope: 112,
    freeLook: 165,
  },
  {
    id: 'onetap',
    name: 'One-Tap Drag',
    playstyle: 'Desert Eagle & Woodpecker vertical drag control',
    dpi: '540 DPI',
    fireButtonSize: '42%',
    general: 186,
    redDot: 188,
    scope2x: 154,
    scope4x: 140,
    sniperScope: 105,
    freeLook: 150,
  },
  {
    id: 'sniper',
    name: 'AWM Quick-Switch',
    playstyle: 'Long-range compound cover & fast weapon swap',
    dpi: '580 DPI',
    fireButtonSize: '48%',
    general: 175,
    redDot: 168,
    scope2x: 158,
    scope4x: 152,
    sniperScope: 138,
    freeLook: 160,
  },
];

export const WEAPON_LOADOUT: WeaponLoadout[] = [
  {
    id: 'mp40',
    name: 'MP40',
    role: 'Primary Close Rush',
    rangeFocus: 'Close Quarters',
    playStyle: 'High fire-rate entry & strafe tracking',
    signatureSkin: 'Predatory Cobra',
    controlRating: 94,
  },
  {
    id: 'm1887',
    name: 'M1887',
    role: 'Gloo-Break Shotgun',
    rangeFocus: 'Point Blank',
    playStyle: 'Jump-shot flicks & crouch gloo follow-ups',
    signatureSkin: 'One Punch Man',
    controlRating: 92,
  },
  {
    id: 'woodpecker',
    name: 'Woodpecker',
    role: 'Marksman Rifle',
    rangeFocus: 'Mid to Long Range',
    playStyle: 'Single-tap ridge control & armor pierce',
    signatureSkin: 'Deity Warlord',
    controlRating: 90,
  },
  {
    id: 'awm',
    name: 'AWM',
    role: 'Precision Sniper',
    rangeFocus: 'Long Range',
    playStyle: 'Quick-switch double shots & zone denial',
    signatureSkin: 'Duke Swallowtail',
    controlRating: 88,
  },
];

export const HIGHLIGHT_CLIPS: HighlightClip[] = [
  {
    id: 'clocktower-clutch',
    title: 'Clock Tower Final Zone Breakdown',
    map: 'Bermuda Remastered',
    mode: 'Battle Royale Custom',
    durationSec: 42,
    image: PORTFOLIO_IMAGES.highlightArena,
    summary:
      'Tactical sequence demonstrating crouch gloo-wall spacing, high-ground ridge pressure, and close-quarters M1887 transitions.',
    tags: ['M1887', 'MP40', 'Zone Control'],
    events: [
      {
        timeSec: 6,
        label: 'Opening Ridge Tag',
        weapon: 'Woodpecker',
        detail: 'Long-range pressure from upper ridge to force opponent utility.',
        type: 'knock',
      },
      {
        timeSec: 17,
        label: '360° Gloo Reset',
        weapon: 'M1887',
        detail: 'Rapid crouch gloo placement to isolate close-range 1v1 angles.',
        type: 'knock',
      },
      {
        timeSec: 29,
        label: 'Close-Range Switch',
        weapon: 'MP40',
        detail: 'Fast weapon swap around cover to secure the flank angle.',
        type: 'wipe',
      },
      {
        timeSec: 39,
        label: 'Final Zone Finish',
        weapon: 'M1887',
        detail: 'Jump-shot angle check as the final safe zone closes.',
        type: 'booyah',
      },
    ],
  },
  {
    id: 'observatory-onetaps',
    title: 'Observatory Clash Squad Rotation',
    map: 'Observatory',
    mode: 'Clash Squad',
    durationSec: 34,
    image: PORTFOLIO_IMAGES.ffTelemetry,
    summary:
      'Fast upper-stairwell opening peek using Desert Eagle drag timing followed by synchronized mid-lane collapse.',
    tags: ['Desert Eagle', 'MP40', 'Flank Timing'],
    events: [
      {
        timeSec: 5,
        label: 'Stairwell Opening Peek',
        weapon: 'Desert Eagle',
        detail: 'Pre-aimed head-level angle on the upper ramp entry.',
        type: 'knock',
      },
      {
        timeSec: 14,
        label: 'Mid-Lane Crossfire',
        weapon: 'Desert Eagle',
        detail: 'Quick horizontal drag flick to catch rotating flanker.',
        type: 'knock',
      },
      {
        timeSec: 24,
        label: 'Cover Collapse',
        weapon: 'MP40',
        detail: 'Pushed broken-wall cover using flash freeze utility.',
        type: 'wipe',
      },
      {
        timeSec: 31,
        label: 'Round Secured',
        weapon: 'Desert Eagle',
        detail: 'Clean angle hold to close out the round.',
        type: 'booyah',
      },
    ],
  },
  {
    id: 'brasilia-sniper',
    title: 'Brasilia Bridge Quick-Switch Hold',
    map: 'Purgatory',
    mode: 'Custom Room',
    durationSec: 38,
    image: PORTFOLIO_IMAGES.nexusArena,
    summary:
      'Holding the northern bridge choke point with quick-switch AWM timing to cover squad rotations across open terrain.',
    tags: ['AWM', 'MP40', 'Bridge Hold'],
    events: [
      {
        timeSec: 7,
        label: 'Bridge Approach Tag',
        weapon: 'AWM',
        detail: 'Tracked crossing movement and opened with a quick-switch shot.',
        type: 'knock',
      },
      {
        timeSec: 19,
        label: 'Zipline Counter',
        weapon: 'AWM',
        detail: 'Watched zipline landing angle from elevated cover.',
        type: 'knock',
      },
      {
        timeSec: 28,
        label: 'Gloo Wall Pressure',
        weapon: 'AWM',
        detail: 'Forced defensive utility burn along the bridge railing.',
        type: 'wipe',
      },
      {
        timeSec: 36,
        label: 'Rotation Complete',
        weapon: 'MP40',
        detail: 'Switched to SMG for close-range bridge pillar clear.',
        type: 'booyah',
      },
    ],
  },
];
