/**
 * Every word of copy on the page, kept in one place so the editorial voice
 * stays consistent and no filler text can creep in.
 */

export const EVENT = {
  name: 'Kritical Hacks',
  full: 'KriticalHacks 2026',
  organizers: 'ASSET MERKLE × IGDTUW',
  organizerLine: 'AssetMerkle × IGDTUW',
  sponsor: 'TinyFish',
  format: '24HR HACKATHON',
  prizePool: 'PRIZE POOL WORTH 175K+',
} as const;

/**
 * The four corners of the hero. The top-right slot carries the TinyFish
 * wordmark rather than a slogan, so only three of the four are text.
 */
export const SLOGANS = {
  topLeft: 'ASSETMERKLE IGDTUW',
  bottomLeft: '24HR HACKATHON',
  bottomRight: "LET'S BUILD TOGETHER",
} as const;

/** TinyFish wordmark, shipped as a vector in `public/`. */
export const SPONSOR_LOGO = {
  src: 'TF_Horizontal.svg',
  alt: 'TinyFish',
  url: 'https://www.tinyfish.ai/',
} as const;

/**
 * The hackathon name, split either side of the hanging 2026. Same treatment as
 * the corner slogans — same face, same scale, same edge padding.
 */
export const EVENT_NAME_SPLIT = {
  left: 'Kritical',
  right: 'Hacks',
} as const;

export const INTRO = {
  quote:
    '"Tired of hackathons that eat up your time, drain your energy, and leave you with nothing but another participation certificate? ' +
    'We backed you. A flagship national-level hackathon is here."',
} as const;

export const CALLS_TO_ACTION = [
  {
    label: 'REGISTER',
    href: 'https://unstop.com/p/kriticalhacks-assetmerkle-igdtuw-1760989',
    /** Black plate, to sit against the red field the way the site's ink does. */
    background: 'var(--black)',
  },
  {
    label: 'JOIN WHATSAPP',
    href: 'https://chat.whatsapp.com/EcJvKzI2bhfDJaWkpHPT2m',
    /** The site's own propaganda red, not a brighter one. */
    background: 'var(--red-deep)',
  },
] as const;

export const MASTHEAD = {
  paper: 'THE TIMES — KRITICAL HACKS EDITION',
  /** The dateline. Carries the dates the event actually runs on. */
  issue: '31 OCT — 1 NOV 2026 · ASSETMERKLE × IGDTUW',
  edition: 'NATIONAL LEVEL BUILD EDITION — ALL PROJECTS MUST USE TINYFISH',
  headline: 'PRIZE POOL WORTH 175K+',
  kicker: '24 HOUR HACKATHON',
  byline: 'REGISTRATIONS OPEN — ASSETMERKLE × IGDTUW PRESENTS KRITICAL HACKS',
  footer: 'Curated and made with love — From US <3',
  caption:
    'OPEN CALL — ASSETMERKLE × IGDTUW. EVERY SUBMISSION WILL BE VERIFIED BY THE MINISTRY.',
} as const;

/**
 * The single line that states when the hackathon is on and that the door is
 * still open. Sits with the registration plates, so the two things a visitor
 * needs — the dates and the way in — are in one place.
 */
export const REGISTRATION_NOTE =
  'REGISTRATIONS OPEN · 31 OCT — 1 NOV 2026 · REGISTERS AT UNSTOP';

export interface InfoBlock {
  /** The printed line. */
  readonly main: string;
  /** The line the Ministry would rather nobody read. */
  readonly truth: string | null;
}

/** The black bar glyph the censored lines are printed with. */
const BAR = '█';

/**
 * The bulletin alternates printed lines with blacked-out ones. Every other line
 * is censored; hovering a bar wipes it away and exposes what it was hiding.
 */
export const INFO_BLOCKS: readonly InfoBlock[] = [
  { main: 'Use TinyFish to build web agents', truth: null },
  {
    main: BAR.repeat(28),
    truth: 'Build agents that can actually interact with the live web.',
  },
  { main: '300K+ active users building', truth: null },
  {
    main: BAR.repeat(24),
    truth: 'Join a growing builder ecosystem and ship something people can use.',
  },
  { main: '2 Tracks to build upon', truth: null },
  {
    main: BAR.repeat(33),
    truth: 'Open innovation across AI/ML and Web3 — choose your battlefield.',
  },
  { main: 'Exclusive swags and goodies', truth: null },
  {
    main: BAR.repeat(20),
    truth: 'Build hard. Ship harder. Walk away with more than just memories.',
  },
  { main: 'Inter-college teams allowed', truth: null },
  {
    main: BAR.repeat(26),
    truth: 'Bring your crew together and build across campuses, branches and disciplines.',
  },
] as const;

/** The chapter heading, revealed word by word over the portrait. */
export const TRACKS_HEADING = 'TRACKS';

/**
 * Restored verbatim when the portrait is torn out of the DOM on the way back,
 * then re-split from this string on the next entry.
 */
export const PORTRAIT_TEXT = TRACKS_HEADING;
export const PORTRAIT_TEXT_PLAIN = TRACKS_HEADING;

export interface Track {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly eligibility: readonly string[];
  readonly prizes: readonly string[];
}

export const TRACKS = {
  columns: [
    {
      title: 'AI/ML TRACK',
      subtitle: 'OPEN INNOVATION',
      description:
        'Build solutions using Artificial Intelligence and Machine Learning to solve a problem or use case of your choice.',
      eligibility: [
        'Student Track — Undergraduate & postgraduate students.',
        'Professional Track — Working professionals & independent builders.',
      ],
      prizes: [
        '1 Student Winner',
        '1 Professional Winner',
        '1 Student Runner Up',
        '1 Professional Runner Up',
      ],
    },
    {
      title: 'WEB3 TRACK',
      subtitle: 'OPEN INNOVATION',
      description:
        'Build solutions using Web3 and blockchain technologies to solve a problem or use case of your choice.',
      eligibility: [
        'Student Track — Undergraduate & postgraduate students.',
        'Professional Track — Working professionals & independent builders.',
      ],
      prizes: ['1 Student Winner', '1 Professional Winner'],
    },
  ] as readonly Track[],
  disclaimer: 'TINYFISH INTEGRATION IS MANDATORY ACROSS BOTH TRACKS.',
} as const;

export const GUIDELINES = {
  heading: 'GUIDELINES FOR HACKATHON',
  subline: 'ASSETMERKLE × TINYFISH',
  items: [
    'Open to participants from all academic backgrounds, branches, specializations, courses and years, subject to category eligibility.',
    'Register under either Student or Professional within your chosen track.',
    'Participants can compete in either AI/ML or Web3.',
    'Inter-college teams are allowed.',
    'Inter-specialization and interdisciplinary teams are allowed.',
    'AI/ML projects should meaningfully utilize AI/ML technologies.',
    'Web3 projects should meaningfully utilize Web3/blockchain technologies.',
    'TinyFish integration is mandatory for all projects.',
    'Teams must participate in mandatory mentorship, evaluation and presentation checkpoints.',
    'Only shortlisted teams continue into the overnight build phase.',
    'Teams must submit their project and required documentation within organizer deadlines.',
  ] as readonly string[],
} as const;

export const ELIGIBILITY = {
  heading: 'ELIGIBILITY',
  intro:
    'KriticalHacks 2026 is open to students and professionals across disciplines, subject to the requirements of the selected category.',
  student: {
    label: 'STUDENT CATEGORY',
    items: [
      'Undergraduate students',
      'Postgraduate students',
      'Students from any academic discipline or year',
      'Students from any college or university',
    ] as readonly string[],
    note: 'Interdisciplinary and inter-college teams are allowed.',
  },
  professional: {
    label: 'PROFESSIONAL CATEGORY',
    items: ['Working professionals', 'Independent builders'] as readonly string[],
  },
  footnote:
    'Participants should register under the category that appropriately represents their team.',
} as const;

export const CARD_STACK = {
  count: 9,
  math: '2 + 2 = 5',
  /** Reality correction, flashed when the cursor comes near the centre. */
  corrected: '2+2=4',
  heading: 'JUDGES AND MENTORS',
  images: [
    'stacking-cards-img-1.png',
    'stacking-cards-img-2.png',
    'stacking-cards-img-3.png',
    'stacking-cards-img-4.png',
    'stacking-cards-img-5.png',
    'stacking-cards-img-6.png',
    'stacking-cards-img-7.png',
    'stacking-cards-img-8.png',
    'final-card-section-6.png',
  ],
  /** One editorial tag per card, in landing order. */
  labels: [
    'MENTOR #1',
    'MENTOR #2',
    'MENTOR #3',
    'MENTOR #4',
    'MENTOR #5',
    'MENTOR #6',
    'JUDGE #1',
    'JUDGE #2',
    'JUDGE #3',
  ] as readonly string[],
} as const;

export const CLOSING = {
  /**
   * Broken to hold the original four-line composition. The longest run is
   * "EVERYONE CARRIES", which is what the closing quote's font size is tuned
   * against.
   */
  quoteLines: [
    '"SEE YOU WHERE',
    'EVERYONE CARRIES',
    'A LAPTOP AND A',
    'BUGGING BRAIN."',
  ],
  author: '— ASSETMERKLE',
  credit: 'PRESENTED TO YOU BY',
  names: 'Akshat & Pranshu',
} as const;

export const CURSOR_WORDS = ['THOUGHTCRIME', 'DOUBLETHINK'] as const;
