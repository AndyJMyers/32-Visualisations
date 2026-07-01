const folderInput = document.querySelector("#folderInput");
const directoryName = document.querySelector("#directoryName");
const statusLight = document.querySelector("#statusLight");
const statusText = document.querySelector("#statusText");
const currentTrack = document.querySelector("#currentTrack");
const timeReadout = document.querySelector("#timeReadout");
const visualizer = document.querySelector("#visualizer");
const audio = document.querySelector("#audio");
const previousButton = document.querySelector("#previousButton");
const playButton = document.querySelector("#playButton");
const stopButton = document.querySelector("#stopButton");
const nextButton = document.querySelector("#nextButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const shuffleToggle = document.querySelector("#shuffleToggle");
const sortSelect = document.querySelector("#sortSelect");
const visualizerSelect = document.querySelector("#visualizerSelect");
const fireworkFormSelect = document.querySelector("#fireworkFormSelect");
const themeSelect = document.querySelector("#themeSelect");
const fireworkSpeed = document.querySelector("#fireworkSpeed");
const fireworkSpeedValue = document.querySelector("#fireworkSpeedValue");
const handSize = document.querySelector("#handSize");
const handSizeValue = document.querySelector("#handSizeValue");
const eyeDischargeSelect = document.querySelector("#eyeDischargeSelect");
const handCount = document.querySelector("#handCount");
const handCountValue = document.querySelector("#handCountValue");
const handGrasp = document.querySelector("#handGrasp");
const handGraspValue = document.querySelector("#handGraspValue");
const peakToggle = document.querySelector("#peakToggle");
const smilesDial = document.querySelector("#smilesDial");
const smilesDialValue = document.querySelector("#smilesDialValue");
const insanityDial = document.querySelector("#insanityDial");
const insanityDialValue = document.querySelector("#insanityDialValue");
const trackCount = document.querySelector("#trackCount");
const trackList = document.querySelector("#trackList");
const carFolderButton = document.querySelector("#carFolderButton");
const carPrevVisualButton = document.querySelector("#carPrevVisualButton");
const carNextVisualButton = document.querySelector("#carNextVisualButton");
const carAlchemyButton = document.querySelector("#carAlchemyButton");
const carFirstButton = document.querySelector("#carFirstButton");
const carPreviousButton = document.querySelector("#carPreviousButton");
const carPlayButton = document.querySelector("#carPlayButton");
const carNextButton = document.querySelector("#carNextButton");
const carLastButton = document.querySelector("#carLastButton");
if (window.AndroidWaveDeck) {
  document.body.classList.add("android-car");
  audio.removeAttribute("crossorigin");
} else {
  audio.crossOrigin = "anonymous";
}

let tracks = [];
let currentIndex = -1;
let audioContext;
let analyser;
let sourceNode;
let animationId;
let peakLevels = [];
let peakUpdatedAt = [];
let fireworks = [];
let fireworkCooldowns = [];
let fireworkFrame = 0;
let shapeReveal = 0;
let pacDancers = [];
let pacFrame = 0;
let handForms = [];
let handFrame = 0;
let swampBubbles = [];
let swampFrame = 0;
let arrows = [];
let arrowFires = [];
let arrowBursts = [];
let arrowFrame = 0;
let cephArms = [];
let cephInkBlooms = [];
let cephFrame = 0;
let discoCouples = [];
let discoFrame = 0;
let glitterParticles = [];
let glitterFrame = 0;
let butterflies = [];
let butterflyFrame = 0;
let knifeTargets = [];
let thrownKnives = [];
let knifeFrame = 0;
let occlusionOctopi = [];
let octopusFrame = 0;
let loucheLizards = [];
let lizardFrame = 0;
let goddessKisses = [];
let goddessFrame = 0;
let gardenVines = [];
let gardenFrame = 0;
let tigerFrame = 0;
let tigerRoarUntil = 0;
let tigerSpurts = [];
let mandelbrotFrame = 0;
const mandelbrotCanvas = document.createElement("canvas");
let eyeFrame = 0;
let eyePointer = { x: 0, y: 0, active: false };
let lightningFrame = 0;
let lightningBolts = [];
let lightningImpacts = [];
let asteroidFrame = 0;
let asteroidShip = null;
let asteroidRocks = [];
let asteroidShots = [];
let asteroidSaucers = [];
let asteroidBursts = [];
let asteroidKeys = new Set();
let asteroidScore = 0;
let asteroidLastShot = 0;
let interzoneFrame = 0;
let interzoneFigures = [];
let interzoneDrops = [];
let interzoneWisps = [];
let sunflowerFrame = 0;
let sunflowerFaces = [];
let sunflowerInsects = [];
let roseFrame = 0;
let roseUnits = [];
let rosePetals = [];
let roseSlashes = [];
let turtleFrame = 0;
let pilotFish = null;
let riverFish = [];
let riverTurtles = [];
let riverRipples = [];
let cathedralFrame = 0;
let cathedralFigures = [];
let cathedralSparks = [];
let hypnoticFrame = 0;
let hypnoticFigures = [];
let hypnoticMonsters = [];
let hypnoticBlobs = [];
let kaleidoscopeFrame = 0;
const kaleidoscopeWedgeCanvas = document.createElement("canvas");
const kaleidoscopeWedgeContext = kaleidoscopeWedgeCanvas.getContext("2d");
let bobGardenFrame = 0;
let bobGardenBugs = [];
let oilSlideFrame = 0;
let oilBlobs = [];
let oysterFrame = 0;
let oysters = [];
let lingerieFrame = 0;
let lingerieGarments = [];
let snakeCongaFrame = 0;
let snakeCongas = [];
let snakeCongaCastoffs = [];
let stagePulse = null;
let fullscreenInfoPulse = null;
let alchemicalStepByVisual = {};
let spectrumPad = {
  smilesDecadence: 0,
  psychedeliaInsanity: 0,
};
let moodState = {
  energy: 0,
  brightness: 0,
  warmth: 0,
};

const peakHoldMs = 3200;
const defaultDirectoryName = "Andy ChatGPT DALL-E aisongs";
const defaultLibraryApi = "http://127.0.0.1:4173/api/tracks";
const directoryStoreName = "waveDeckDirectory";
const sessionStoreName = "waveDeckSession";
const androidBridge = window.AndroidWaveDeck || null;
const isAndroidCarMode = Boolean(androidBridge);
const performanceProfile = isAndroidCarMode
  ? {
      maxPixelRatio: 1.6,
      populationScale: 0.72,
      maxPopulation: 8,
    }
  : {
      maxPixelRatio: 2.4,
      populationScale: 1,
      maxPopulation: 12,
    };
const fireworksBands = [
  { start: 1, end: 5, threshold: 0.42, name: "bass" },
  { start: 6, end: 14, threshold: 0.35, name: "lowMid" },
  { start: 15, end: 32, threshold: 0.31, name: "mid" },
  { start: 33, end: 60, threshold: 0.28, name: "highMid" },
  { start: 61, end: 112, threshold: 0.22, name: "treble" },
];
const visualizerThemes = {
  mono: {
    idle: "rgba(87, 216, 178, 0.22)",
    peak: "rgba(244, 240, 232, 0.82)",
    color(index, count, value) {
      const lightness = 40 + value * 22;
      return `hsl(156 58% ${lightness}%)`;
    },
  },
  ice: {
    idle: "rgba(117, 199, 255, 0.2)",
    peak: "rgba(255, 255, 255, 0.86)",
    color(index, count, value) {
      const hue = 198 + (index / count) * 34;
      const lightness = 44 + value * 24;
      return `hsl(${hue} 82% ${lightness}%)`;
    },
  },
  ember: {
    idle: "rgba(252, 190, 74, 0.2)",
    peak: "rgba(255, 244, 214, 0.9)",
    color(index, count, value) {
      const hue = 44 - (index / count) * 24;
      const lightness = 45 + value * 20;
      return `hsl(${hue} 92% ${lightness}%)`;
    },
  },
  spectrum: {
    idle: "rgba(166, 173, 181, 0.18)",
    peak: "rgba(255, 255, 255, 0.82)",
    color(index, count, value) {
      const hue = 285 - (index / count) * 230;
      const lightness = 48 + value * 18;
      return `hsl(${hue} 78% ${lightness}%)`;
    },
  },
  pressure: {
    idle: "rgba(255, 58, 112, 0.18)",
    peak: "rgba(255, 244, 255, 0.9)",
    color(index, count, value) {
      const progress = index / Math.max(1, count - 1);
      const hue = 330 - progress * 260 + value * 36;
      const lightness = 42 + value * 28;
      return `hsl(${hue} 94% ${lightness}%)`;
    },
  },
};

const fireworkPalettes = {
  mono: [156, 142, 174],
  ice: [196, 212, 226],
  ember: [18, 34, 48],
  spectrum: [285, 215, 155, 48, 330],
  pressure: [336, 304, 262, 212, 166, 46],
};

const pacBands = [
  { start: 1, end: 5, move: "stomp" },
  { start: 6, end: 12, move: "sway" },
  { start: 13, end: 26, move: "spin" },
  { start: 27, end: 48, move: "slide" },
  { start: 49, end: 80, move: "shimmy" },
  { start: 81, end: 112, move: "twirl" },
];

const handBands = [
  { start: 1, end: 5, root: 0.08, side: 1 },
  { start: 6, end: 12, root: 0.23, side: -1 },
  { start: 13, end: 24, root: 0.39, side: 1 },
  { start: 25, end: 44, root: 0.56, side: -1 },
  { start: 45, end: 74, root: 0.72, side: 1 },
  { start: 75, end: 112, root: 0.9, side: -1 },
];

const swampBands = [
  { start: 1, end: 5, kind: "leviathan" },
  { start: 6, end: 12, kind: "balloon" },
  { start: 13, end: 28, kind: "mutter" },
  { start: 29, end: 56, kind: "midge" },
  { start: 57, end: 88, kind: "soap" },
  { start: 89, end: 112, kind: "tinkle" },
];

const arrowBands = [
  { start: 1, end: 5, weight: 1.45 },
  { start: 6, end: 12, weight: 1.25 },
  { start: 13, end: 28, weight: 1.05 },
  { start: 29, end: 52, weight: 0.95 },
  { start: 53, end: 82, weight: 0.85 },
  { start: 83, end: 112, weight: 0.78 },
];

const cephBands = [
  { start: 1, end: 5 },
  { start: 6, end: 10 },
  { start: 11, end: 17 },
  { start: 18, end: 28 },
  { start: 29, end: 42 },
  { start: 43, end: 58 },
  { start: 59, end: 76 },
  { start: 77, end: 92 },
  { start: 93, end: 104 },
  { start: 105, end: 112 },
];

const discoBands = [
  { start: 1, end: 5, move: "bass-step" },
  { start: 6, end: 12, move: "hip-sway" },
  { start: 13, end: 26, move: "twist" },
  { start: 27, end: 48, move: "hand-jive" },
  { start: 49, end: 78, move: "spin" },
  { start: 79, end: 112, move: "finger-point" },
];

const glitterBands = [
  { start: 1, end: 5, weight: 1.35 },
  { start: 6, end: 12, weight: 1.18 },
  { start: 13, end: 28, weight: 1 },
  { start: 29, end: 52, weight: 0.9 },
  { start: 53, end: 82, weight: 0.76 },
  { start: 83, end: 112, weight: 0.62 },
];

const butterflyBands = [
  { start: 1, end: 5 },
  { start: 6, end: 12 },
  { start: 13, end: 24 },
  { start: 25, end: 40 },
  { start: 41, end: 60 },
  { start: 61, end: 82 },
  { start: 83, end: 112 },
];

const knifeBands = [
  { start: 1, end: 5, kind: "log" },
  { start: 6, end: 12, kind: "drum" },
  { start: 13, end: 26, kind: "wheel" },
  { start: 27, end: 46, kind: "board" },
  { start: 47, end: 76, kind: "tin" },
  { start: 77, end: 112, kind: "bell" },
];

const lizardBands = [
  { start: 1, end: 5, move: "tail-pop" },
  { start: 6, end: 12, move: "hip-roll" },
  { start: 13, end: 24, move: "lapel-snap" },
  { start: 25, end: 42, move: "side-glide" },
  { start: 43, end: 66, move: "shoulder-shimmy" },
  { start: 67, end: 90, move: "hat-tip" },
  { start: 91, end: 112, move: "tongue-flick" },
];

const goddessBands = [
  { start: 1, end: 6 },
  { start: 7, end: 14 },
  { start: 15, end: 28 },
  { start: 29, end: 48 },
  { start: 49, end: 78 },
  { start: 79, end: 112 },
];

const gardenBands = [
  { start: 1, end: 5, root: "floor" },
  { start: 6, end: 12, root: "floor" },
  { start: 13, end: 24, root: "left" },
  { start: 25, end: 42, root: "right" },
  { start: 43, end: 66, root: "floor" },
  { start: 67, end: 90, root: "left" },
  { start: 91, end: 112, root: "right" },
];

const tigerBands = [
  { start: 1, end: 7, move: "pounce" },
  { start: 8, end: 18, move: "bite" },
  { start: 19, end: 38, move: "claw" },
  { start: 39, end: 70, move: "worry" },
  { start: 71, end: 112, move: "roar" },
];

const defaultVisualizerControls = {
  theme: true,
  peak: false,
  speed: true,
  size: false,
  count: false,
  grasp: false,
};

const defaultVisualizerLabels = {
  form: "Form",
  theme: "Colour",
  speed: "Speed",
  size: "Reach",
  count: "Arms",
  grasp: "Grasp",
};

const visualizerConfigs = {
  equalizer: {
    ariaLabel: "Graphic equaliser visualisation",
    controls: { peak: true, speed: false },
  },
  fireworks: {
    ariaLabel: "Frequency fireworks visualisation",
    forms: [
      ["hydra", "Hydra"],
      ["woman", "Woman"],
      ["lion", "Lion rampant"],
    ],
  },
  pacdance: {
    ariaLabel: "Pac Dance frequency visualisation",
  },
  branchhands: {
    ariaLabel: "Branch Hands frequency visualisation",
    controls: { size: true, count: true, grasp: true },
  },
  swampbubbles: {
    ariaLabel: "Swamp Bubbles frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Current", size: "Scale", count: "Population", grasp: "Pressure" },
  },
  arrowstorm: {
    ariaLabel: "Arrow Storm frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Volley speed", size: "Arrow size", count: "Volley size", grasp: "Fire arrows" },
    forms: [
      ["woodland", "Woodland"],
      ["williamtell", "William Tell"],
      ["fort", "Wooden fort"],
    ],
  },
  cephalopod: {
    ariaLabel: "Cephalopod Mind frequency visualisation",
    controls: { size: true, count: true, grasp: true },
  },
  discojive: {
    ariaLabel: "Disco Jive frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Tempo", size: "Scale", count: "Couples", grasp: "Flair" },
  },
  glitterfall: {
    ariaLabel: "Glitter Fall frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { form: "Weather", speed: "Fall pace", size: "Large glitter", count: "Amount", grasp: "Blizzard" },
    forms: [
      ["snowfall", "Snowfall"],
      ["mixed", "Mixed glitter"],
      ["blizzard", "Blizzard"],
    ],
  },
  butterflyhost: {
    ariaLabel: "Butterfly Host frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Tempo", size: "Scale", count: "Host", grasp: "Flutter" },
  },
  knifethunk: {
    ariaLabel: "Knife Thunk frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Throw rate", size: "Scale", count: "Targets", grasp: "Force" },
    forms: [
      ["timber", "Timber wall"],
      ["carnival", "Carnival wheels"],
      ["foundry", "Tin foundry"],
    ],
  },
  octopusocclusion: {
    ariaLabel: "Octopus Occlusion frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Tempo", size: "Scale", count: "Octopi", grasp: "Mood" },
  },
  lizardlouche: {
    ariaLabel: "Lizard Louche frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Tempo", size: "Scale", count: "Lizards", grasp: "Mood" },
  },
  goddesskisses: {
    ariaLabel: "Goddess Kisses frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Kiss rate", size: "Scale", count: "Kisses", grasp: "Pout" },
    forms: [
      ["seduction", "Seduction"],
      ["haka", "Haka"],
      ["bloodruby", "Blood ruby"],
    ],
  },
  climbinggarden: {
    ariaLabel: "Climbing Garden frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Tempo", size: "Range", count: "Shoots", grasp: "Bloom" },
  },
  tipustiger: {
    ariaLabel: "Tipu's Tiger frequency visualisation",
    controls: { size: true, grasp: true },
    labels: { speed: "Tempo", size: "Zoom", grasp: "Gore" },
  },
  mandelbrot: {
    ariaLabel: "Mandelbrot Set frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Introspection", size: "Magnify", count: "Detail", grasp: "Warp" },
  },
  eyevisions: {
    ariaLabel: "Eye Visions frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Blink rate", size: "Lashes", count: "Flecks", grasp: "Gaze" },
    forms: [
      ["sauron", "Sauron's eye"],
      ["snake", "Snake eyes"],
      ["cat", "Cat's eyes"],
      ["dog", "Dog's eyes"],
      ["deer", "Deer eyes"],
      ["filmstar", "Italian film star"],
    ],
  },
  lightning: {
    ariaLabel: "Lightning frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Strike rate", size: "Bolt size", count: "Afterglow", grasp: "Snaking" },
    forms: [
      ["storm", "Storm"],
      ["missilecommand", "Missile Command"],
    ],
  },
  asteroids: {
    ariaLabel: "Playable Asteroids music visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Game tempo", size: "Rock scale", count: "Rock density", grasp: "Saucer threat" },
    forms: [
      ["deepfield", "Deep field"],
      ["arcade", "Arcade neon"],
      ["redalert", "Red alert"],
    ],
  },
  interzoneoracles: {
    ariaLabel: "Interzone Oracles frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Pulse", size: "Stature", count: "Chorus", grasp: "Exudation" },
    forms: [
      ["salon", "Salon"],
      ["procession", "Procession"],
      ["withdrawal", "Withdrawal"],
    ],
  },
  sunflowersmiles: {
    ariaLabel: "Sunflower Smiles frequency visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Breeze", size: "Bloom size", count: "Flowers", grasp: "Insects" },
    forms: [
      ["pinkpond", "Powder-pink pond"],
      ["morning", "Morning meadow"],
      ["sunset", "Peach sunset"],
    ],
  },
  warofroses: {
    ariaLabel: "War of the Roses frequency visualisation",
    controls: { theme: false, size: true, count: true, grasp: true },
    labels: { speed: "March", size: "Bloom scale", count: "Numbers", grasp: "Belligerence" },
    forms: [
      ["openfield", "Open field"],
      ["pincer", "Pincer"],
      ["crownmelee", "Crown melee"],
      ["verona", "Verona lovers"],
    ],
  },
  turtleriver: {
    ariaLabel: "Pilot fish in snapping turtle river visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { theme: "Spectrum", speed: "Grievance", size: "Hunger", count: "Turtles", grasp: "Munchiness" },
    forms: [
      ["meander", "Meander"],
      ["rapids", "Rapids"],
      ["moonbank", "Moonlit banks"],
    ],
  },
  cathedralorganism: {
    ariaLabel: "Living stained glass cathedral music visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { theme: "Glass", speed: "Breath", size: "Flex", count: "Procession", grasp: "Sentience" },
    defaults: { speed: "max", size: "max", count: "max", grasp: "max", theme: "spectrum" },
    forms: [
      ["gothic", "Gothic"],
      ["byzantine", "Byzantine"],
      ["ruinedabbey", "Ruined abbey"],
    ],
  },
  hypnoticflight: {
    ariaLabel: "Hypnotic melting figures fleeing monsters music visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { theme: "Dream", speed: "Pulse", size: "Melt", count: "Runaways", grasp: "Dread" },
    forms: [
      ["liquid", "Liquid panic"],
      ["prismatic", "Prismatic fever"],
      ["nocturne", "Nocturne"],
    ],
  },
  kaleidoscope: {
    ariaLabel: "Kaleidoscope frequency visualisation",
    controls: { theme: false, size: true, count: true, grasp: true },
    labels: { form: "Octagon", speed: "Pulse", size: "Morph", count: "Mirrors", grasp: "Trip" },
    forms: [
      ["vivid", "Drink Me vivid"],
      ["woodland", "Woodland hush"],
      ["garden", "Garden glass"],
      ["psychedelia", "Gonzo psychedelia"],
      ["tea", "Mad tea party"],
      ["cheshire", "Cheshire violet"],
      ["absinthe", "Absinthe meadow"],
      ["midnight", "Midnight rabbit"],
    ],
  },
  bobrossgarden: {
    ariaLabel: "Bob Ross Positive garden visualisation",
    controls: { theme: false, size: true, count: true, grasp: true },
    labels: { form: "Roulette", speed: "Spin", size: "Growth", count: "Plantings", grasp: "Buzz" },
    forms: [
      ["peas", "Mange tout & peas"],
      ["kitchen", "Potatoes & tomatoes"],
      ["alliums", "Garlic chilli onions"],
      ["mushrooms", "Psilocybin & parsnips"],
      ["herbal", "Marihuana & marjoram"],
      ["squash", "Pumpkins & sage"],
      ["berries", "Strawberry & basil"],
      ["roots", "Beetroot & borage"],
    ],
  },
  oilslide: {
    ariaLabel: "Oil Slide liquid light visualisation",
    controls: { theme: false, size: true, count: true, grasp: true },
    labels: { form: "Dyes", speed: "Flow", size: "Cell size", count: "Drops", grasp: "Agitation" },
    forms: [
      ["acid", "Acid primaries"],
      ["warm", "Ruby amber"],
      ["cool", "Aqua violet"],
      ["garden", "Garden oils"],
      ["nocturne", "Nocturne"],
      ["candy", "Sweet shop"],
    ],
  },
  oysterpearls: {
    ariaLabel: "Oyster Pearls slow shell visualisation",
    controls: { theme: false, size: true, count: true, grasp: true },
    labels: { form: "Waters", speed: "Tide", size: "Shell size", count: "Oysters", grasp: "Pearl making" },
    forms: [
      ["lagoon", "Lagoon"],
      ["opal", "Opal"],
      ["midnight", "Midnight"],
      ["coral", "Coral"],
    ],
  },
  lingerie: {
    ariaLabel: "Lingerie music visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { form: "Salon", speed: "Draft", size: "Drape", count: "Wardrobe", grasp: "Mischief" },
    forms: [
      ["chinoiserie", "Chinoiserie"],
      ["lacquer", "Black lacquer"],
      ["bamboo", "Bamboo pavilion"],
      ["shellac", "Amber shellac"],
      ["leather", "Leather salon"],
    ],
  },
  snakeconga: {
    ariaLabel: "Chimaera of Snake and Conga-line music visualisation",
    controls: { size: true, count: true, grasp: true },
    labels: { speed: "Meander", size: "Scale", count: "Procession", grasp: "Snake / Conga mix" },
    defaults: { speed: "1", size: "1", count: "8", grasp: "0.5", theme: "spectrum" },
  },
};

const standardThemeOptions = [
  ["mono", "Mono green"],
  ["ice", "Ice blue"],
  ["ember", "Ember"],
  ["spectrum", "Spectrum"],
  ["pressure", "High Pressure"],
];
const sauronMoodOptions = [
  ["alarmed", "Alarmed"],
  ["dominant", "Dominant"],
  ["victory", "Sure of victory"],
  ["overthrown", "Overthrown"],
];

const alchemicalRecipes = [
  {
    name: "Mercury Bloom",
    form: 1,
    theme: 3,
    speed: 1.8,
    size: 1.45,
    count: 11,
    grasp: 0.72,
    smiles: 1,
    insanity: 0.55,
  },
  {
    name: "Black Sun",
    form: 2,
    theme: 4,
    speed: 0.75,
    size: 1.75,
    count: 5,
    grasp: 0.94,
    smiles: 0,
    insanity: 1,
  },
  {
    name: "Opal Motorik",
    form: 3,
    theme: 1,
    speed: 1.25,
    size: 0.82,
    count: 14,
    grasp: 0.38,
    smiles: 0.55,
    insanity: 0.55,
  },
  {
    name: "Honeyed Static",
    form: 4,
    theme: 2,
    speed: 2.15,
    size: 1.08,
    count: 9,
    grasp: 0.18,
    smiles: 1,
    insanity: 0,
  },
  {
    name: "Glass Cathedral",
    form: 5,
    theme: 3,
    speed: 0.95,
    size: 1.62,
    count: 13,
    grasp: 0.57,
    smiles: 0.55,
    insanity: 1,
  },
  {
    name: "Petrol Peacock",
    form: 6,
    theme: 4,
    speed: 1.55,
    size: 1.22,
    count: 7,
    grasp: 0.82,
    smiles: 1,
    insanity: 1,
  },
  {
    name: "Moonlit Velvet",
    form: 7,
    theme: 0,
    speed: 0.55,
    size: 1.35,
    count: 4,
    grasp: 0.48,
    smiles: 0,
    insanity: 0.55,
  },
];

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function trackTitle(file) {
  return file.name.replace(/\.wav$/i, "");
}

function trackName(track) {
  return track.file?.name || track.name || "";
}

function trackModified(track) {
  return track.file?.lastModified || track.lastModified || 0;
}

function trackDisplayTitle(track) {
  return trackName(track).replace(/\.wav$/i, "");
}

function trackIdentity(track) {
  if (!track) {
    return null;
  }

  return {
    name: trackName(track),
    relativePath: track.relativePath || trackName(track),
    lastModified: trackModified(track),
    source: track.source || "",
  };
}

function tracksMatchIdentity(track, identity) {
  if (!track || !identity) {
    return false;
  }

  const relativePath = track.relativePath || trackName(track);
  return (
    relativePath === identity.relativePath
    || trackName(track) === identity.name
    || (identity.lastModified && trackModified(track) === identity.lastModified && trackName(track) === identity.name)
  );
}

function visualizerDisplayName() {
  return visualizerSelect.selectedOptions[0]?.textContent || "Visualisation";
}

function pulseStageLabel(type, text) {
  stagePulse = {
    type,
    text,
    startedAt: performance.now(),
    duration: 2100,
    hue: type === "track" ? 48 : 184,
  };
}

function drawStagePulse(canvasContext) {
  if (!stagePulse) {
    return;
  }

  const now = performance.now();
  const progress = (now - stagePulse.startedAt) / stagePulse.duration;
  if (progress >= 1) {
    stagePulse = null;
    return;
  }

  const width = visualizer.width;
  const height = visualizer.height;
  const alpha = Math.sin((1 - progress) * Math.PI * 0.5);
  const pulse = 1 + Math.sin(progress * Math.PI * 5) * 0.08;
  const contrastHue = (stagePulse.hue + 168 + progress * 48) % 360;
  const fontSize = Math.max(22, Math.min(width * 0.06, height * 0.16));
  const labelSize = Math.max(12, fontSize * 0.34);
  const maxWidth = width * 0.86;

  canvasContext.save();
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.globalAlpha = alpha;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.shadowBlur = fontSize * 0.55;
  canvasContext.shadowColor = hsla(contrastHue, 100, 58, 0.82);

  const gradient = canvasContext.createLinearGradient(width * 0.18, 0, width * 0.82, 0);
  gradient.addColorStop(0, hsla(stagePulse.hue, 100, 66, 0.95));
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.96)");
  gradient.addColorStop(1, hsla(contrastHue, 100, 62, 0.95));

  canvasContext.fillStyle = `rgba(0, 0, 0, ${0.28 * alpha})`;
  canvasContext.fillRect(width * 0.07, height * 0.36, width * 0.86, height * 0.28);

  canvasContext.fillStyle = hsla(contrastHue, 100, 72, 0.82);
  canvasContext.font = `700 ${labelSize}px "Segoe UI", system-ui, sans-serif`;
  canvasContext.fillText(stagePulse.type === "track" ? "Track" : "Visual", width * 0.5, height * 0.42, maxWidth);

  canvasContext.fillStyle = gradient;
  canvasContext.font = `800 ${fontSize * pulse}px "Segoe UI", system-ui, sans-serif`;
  canvasContext.fillText(stagePulse.text, width * 0.5, height * 0.52, maxWidth);
  canvasContext.restore();
}

function currentTrackDisplayName() {
  if (currentIndex >= 0 && tracks[currentIndex]) {
    return trackDisplayTitle(tracks[currentIndex]);
  }
  const text = currentTrack.textContent.trim();
  return text || "No track loaded";
}

function pulseFullscreenInfo() {
  const player = document.querySelector(".player");
  if (!player.classList.contains("visual-fullscreen")) {
    return;
  }

  fullscreenInfoPulse = {
    startedAt: performance.now(),
    duration: 3300,
    track: currentTrackDisplayName(),
    visual: visualizerDisplayName(),
  };

  if (!animationId) {
    drawIdleVisualizer();
  }
}

function drawFullscreenInfo(canvasContext) {
  if (!fullscreenInfoPulse) {
    return;
  }

  const now = performance.now();
  const progress = (now - fullscreenInfoPulse.startedAt) / fullscreenInfoPulse.duration;
  if (progress >= 1) {
    fullscreenInfoPulse = null;
    return;
  }

  const width = visualizer.width;
  const height = visualizer.height;
  const alpha = Math.sin((1 - progress) * Math.PI * 0.5);
  const pulse = 1 + Math.sin(progress * Math.PI * 5) * 0.055;
  const trackHue = (48 + progress * 40) % 360;
  const visualHue = (184 + progress * 64) % 360;
  const contrastHue = (visualHue + 168) % 360;
  const trackSize = Math.max(19, Math.min(width * 0.044, height * 0.105));
  const visualSize = Math.max(16, trackSize * 0.7);
  const labelSize = Math.max(11, trackSize * 0.28);
  const maxWidth = width * 0.86;

  canvasContext.save();
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.globalAlpha = alpha;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";

  canvasContext.fillStyle = `rgba(0, 0, 0, ${0.28 * alpha})`;
  canvasContext.fillRect(width * 0.07, height * 0.3, width * 0.86, height * 0.38);

  const visualGradient = canvasContext.createLinearGradient(width * 0.18, 0, width * 0.82, 0);
  visualGradient.addColorStop(0, hsla(visualHue, 100, 66, 0.95));
  visualGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.94)");
  visualGradient.addColorStop(1, hsla(contrastHue, 100, 62, 0.95));

  const trackGradient = canvasContext.createLinearGradient(width * 0.18, 0, width * 0.82, 0);
  trackGradient.addColorStop(0, hsla(trackHue, 100, 66, 0.95));
  trackGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.96)");
  trackGradient.addColorStop(1, hsla((trackHue + 178) % 360, 100, 62, 0.95));

  canvasContext.shadowBlur = trackSize * 0.44;
  canvasContext.shadowColor = hsla(contrastHue, 100, 58, 0.76);
  canvasContext.fillStyle = hsla(visualHue, 100, 72, 0.82);
  canvasContext.font = `700 ${labelSize}px "Segoe UI", system-ui, sans-serif`;
  canvasContext.fillText("Visual", width * 0.5, height * 0.39, maxWidth);
  canvasContext.fillStyle = visualGradient;
  canvasContext.font = `800 ${visualSize * pulse}px "Segoe UI", system-ui, sans-serif`;
  canvasContext.fillText(fullscreenInfoPulse.visual, width * 0.5, height * 0.46, maxWidth);

  canvasContext.shadowColor = hsla(trackHue, 100, 58, 0.76);
  canvasContext.fillStyle = hsla((trackHue + 178) % 360, 100, 72, 0.82);
  canvasContext.font = `700 ${labelSize}px "Segoe UI", system-ui, sans-serif`;
  canvasContext.fillText("Track", width * 0.5, height * 0.55, maxWidth);
  canvasContext.fillStyle = trackGradient;
  canvasContext.font = `800 ${trackSize * pulse}px "Segoe UI", system-ui, sans-serif`;
  canvasContext.fillText(fullscreenInfoPulse.track, width * 0.5, height * 0.62, maxWidth);
  canvasContext.restore();

  if (!animationId && fullscreenInfoPulse) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (fullscreenInfoPulse) {
        drawIdleVisualizer();
      }
    });
  }
}

function setStatus(status) {
  statusLight.className = "status-light";

  if (status === "playing") {
    statusLight.classList.add("playing");
    statusText.textContent = "Playing";
    playButton.textContent = "Pause";
    carPlayButton.querySelector(".car-button-main").textContent = "‖";
  } else if (status === "paused") {
    statusLight.classList.add("paused");
    statusText.textContent = "Paused";
    playButton.textContent = "Play";
    carPlayButton.querySelector(".car-button-main").textContent = "▶ / ‖";
  } else {
    statusText.textContent = "Stopped";
    playButton.textContent = "Play";
    carPlayButton.querySelector(".car-button-main").textContent = "▶ / ‖";
  }
}

function setAndroidStatus(message) {
  if (androidBridge) {
    statusText.textContent = message;
  }
}

function sortTracks() {
  const [field, direction] = sortSelect.value.split("-");
  const multiplier = direction === "asc" ? 1 : -1;

  tracks.sort((a, b) => {
    const comparison = field === "name"
      ? collator.compare(trackName(a), trackName(b))
      : trackModified(a) - trackModified(b);
    return comparison * multiplier;
  });
}

function renderTracks() {
  trackList.innerHTML = "";
  trackCount.textContent = `${tracks.length} ${tracks.length === 1 ? "track" : "tracks"}`;

  if (tracks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No WAV files found in this directory.";
    trackList.append(empty);
    setControlsEnabled(false);
    return;
  }

  const fragment = document.createDocumentFragment();

  tracks.forEach((track, index) => {
    const item = document.createElement("li");
    item.className = `track-item${index === currentIndex ? " active" : ""}`;
    item.tabIndex = 0;
    item.dataset.index = index;

    const name = document.createElement("span");
    name.className = "track-name";
    name.textContent = trackDisplayTitle(track);

    const date = document.createElement("span");
    date.className = "track-date";
    date.textContent = dateFormatter.format(new Date(trackModified(track)));

    item.append(name, date);
    fragment.append(item);
  });

  trackList.append(fragment);
  setControlsEnabled(true);
}

function setControlsEnabled(enabled) {
  [
    previousButton,
    playButton,
    stopButton,
    nextButton,
    shuffleToggle,
    sortSelect,
    carFirstButton,
    carPreviousButton,
    carPlayButton,
    carNextButton,
    carLastButton,
  ].forEach((control) => {
    control.disabled = !enabled;
  });

  [carFolderButton, carPrevVisualButton, carNextVisualButton, carAlchemyButton].forEach((control) => {
    control.disabled = false;
  });
}

function visualizerTheme() {
  return visualizerThemes[themeSelect.value] || visualizerThemes.mono;
}

function fireworkSpeedMultiplier() {
  return Number(fireworkSpeed.value) || 1;
}

function updateFireworkSpeedLabel() {
  fireworkSpeedValue.textContent = `${fireworkSpeedMultiplier().toFixed(1)}x`;
}

function handSizeMultiplier() {
  return Number(handSize.value) || 1;
}

function requestedHandCountValue() {
  return Number(handCount.value) || 6;
}

function visualPopulationValue() {
  const requested = requestedHandCountValue();
  const scaled = Math.round(requested * performanceProfile.populationScale);
  return Math.max(1, Math.min(performanceProfile.maxPopulation, scaled));
}

function handCountValueNumber() {
  return visualPopulationValue();
}

function canvasPixelRatio() {
  const ratio = window.devicePixelRatio || 1;
  return Math.min(ratio, performanceProfile.maxPixelRatio);
}

function handGraspAmount() {
  return Number(handGrasp.value) || 0;
}

function glitterLargeShare() {
  return clampNumber((handSizeMultiplier() - 0.55) / 1.25, 0, 1);
}

function updateHandControlLabels() {
  if (visualizerSelect.value === "glitterfall") {
    handSizeValue.textContent = `${Math.round(glitterLargeShare() * 100)}%`;
    handCountValue.textContent = String(handCountValueNumber());
    handGraspValue.textContent = `${Math.round(handGraspAmount() * 100)}%`;
    return;
  }

  handSizeValue.textContent = `${handSizeMultiplier().toFixed(2)}x`;
  handCountValue.textContent = String(handCountValueNumber());
  handGraspValue.textContent = `${Math.round(handGraspAmount() * 100)}%`;
}

let sessionSaveTimer = 0;
let restoredSession = null;
let sessionRestoredToTrack = false;
let lastPersistedSecond = -1;
let continuousPlaybackRequested = false;
let playbackTransitioning = false;
let playbackGeneration = 0;

function currentAudioState() {
  if (!audio.src || currentIndex < 0) {
    return "stopped";
  }

  return audio.paused ? "paused" : "playing";
}

function sessionSnapshot() {
  return {
    version: 1,
    savedAt: Date.now(),
    directoryName: directoryName.textContent,
    librarySource: tracks[currentIndex]?.source || tracks[0]?.source || "",
    currentTrack: trackIdentity(tracks[currentIndex]),
    currentIndex,
    currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
    duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    audioState: currentAudioState(),
    controls: {
      sort: sortSelect.value,
      shuffle: shuffleToggle.checked,
      visualizer: visualizerSelect.value,
      form: fireworkFormSelect.value,
      theme: themeSelect.value,
      speed: fireworkSpeed.value,
      size: handSize.value,
      count: handCount.value,
      grasp: handGrasp.value,
      peak: peakToggle.checked,
      discharge: eyeDischargeSelect.value,
      spectrumPad: { ...spectrumPad },
    },
  };
}

function saveSessionNow() {
  try {
    localStorage.setItem(sessionStoreName, JSON.stringify(sessionSnapshot()));
  } catch (error) {
    console.warn("Session save failed", error);
  }
}

function scheduleSessionSave(delay = 650) {
  window.clearTimeout(sessionSaveTimer);
  sessionSaveTimer = window.setTimeout(saveSessionNow, delay);
}

function loadSavedSession() {
  try {
    const saved = localStorage.getItem(sessionStoreName);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn("Session restore failed", error);
    return null;
  }
}

function setSelectValueIfPresent(select, value) {
  if (!value) {
    return false;
  }

  const option = Array.from(select.options).find((item) => item.value === value);
  if (!option) {
    return false;
  }

  select.value = value;
  return true;
}

function restoreControlPreferences(session) {
  const controls = session?.controls;
  if (!controls) {
    return;
  }

  setSelectValueIfPresent(sortSelect, controls.sort);
  shuffleToggle.checked = Boolean(controls.shuffle);
  peakToggle.checked = controls.peak !== false;
  fireworkSpeed.value = controls.speed || fireworkSpeed.value;
  handSize.value = controls.size || handSize.value;
  handCount.value = controls.count || handCount.value;
  handGrasp.value = controls.grasp || handGrasp.value;
  if (controls.spectrumPad) {
    spectrumPad.smilesDecadence = clampNumber(Number(controls.spectrumPad.smilesDecadence) || 0, 0, 1);
    spectrumPad.psychedeliaInsanity = clampNumber(Number(controls.spectrumPad.psychedeliaInsanity) || 0, 0, 1);
  }

  setSelectValueIfPresent(visualizerSelect, controls.visualizer);
  visualizer.setAttribute("aria-label", visualizerConfig().ariaLabel);
  syncVisualizerControls();
  setSelectValueIfPresent(fireworkFormSelect, controls.form);
  syncVisualizerControls();
  setSelectValueIfPresent(themeSelect, controls.theme);
  setSelectValueIfPresent(eyeDischargeSelect, controls.discharge);
  updateFireworkSpeedLabel();
  updateHandControlLabels();
  updateSpectrumDials();
}

function restoreTrackFromSession(session) {
  if (!session || sessionRestoredToTrack || tracks.length === 0) {
    return;
  }

  const identity = session.currentTrack;
  let index = identity ? tracks.findIndex((track) => tracksMatchIdentity(track, identity)) : -1;
  if (index < 0 && Number.isInteger(session.currentIndex) && session.currentIndex >= 0 && session.currentIndex < tracks.length) {
    index = session.currentIndex;
  }
  if (index < 0) {
    return;
  }

  sessionRestoredToTrack = true;
  const resumeAt = Math.max(0, Number(session.currentTime) || 0);
  loadTrack(index, false, resumeAt);
  setStatus("paused");
  scheduleSessionSave(1000);
}

function setControlLabel(control, text) {
  const label = control.closest("label");
  const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);

  if (textNode) {
    textNode.textContent = `\n            ${text}\n            `;
  }
}

function setSelectOptions(select, options, value) {
  select.replaceChildren(...options.map(([optionValue, label]) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = label;
    return option;
  }));
  select.value = value;
}

function syncSauronMoodControl(active) {
  const selected = themeSelect.value;
  const isMood = sauronMoodOptions.some(([value]) => value === selected);
  const isStandard = standardThemeOptions.some(([value]) => value === selected);

  if (active) {
    const mappedMood = {
      mono: "dominant",
      ice: "overthrown",
      ember: "alarmed",
      spectrum: "victory",
      pressure: "dominant",
    }[selected] || "dominant";
    setSelectOptions(themeSelect, sauronMoodOptions, isMood ? selected : mappedMood);
    setControlLabel(themeSelect, "Mood");
  } else {
    const mappedTheme = {
      alarmed: "ember",
      dominant: "pressure",
      victory: "spectrum",
      overthrown: "ice",
    }[selected] || "mono";
    setSelectOptions(themeSelect, standardThemeOptions, isStandard ? selected : mappedTheme);
    setControlLabel(themeSelect, "Colour");
  }
}

function visualizerConfig(value = visualizerSelect.value) {
  return visualizerConfigs[value] || visualizerConfigs.equalizer;
}

function controlConfig(config) {
  return { ...defaultVisualizerControls, ...(config.controls || {}) };
}

function controlLabels(config) {
  return { ...defaultVisualizerLabels, ...(config.labels || {}) };
}

function applyVisualizerDefaults(config) {
  const defaults = config.defaults || {};
  const setRange = (control, value) => {
    if (!value) return;
    control.value = value === "max" ? control.max : value === "min" ? control.min : value;
  };

  setRange(fireworkSpeed, defaults.speed);
  setRange(handSize, defaults.size);
  setRange(handCount, defaults.count);
  setRange(handGrasp, defaults.grasp);
  if (defaults.theme) {
    themeSelect.value = defaults.theme;
  }
  updateFireworkSpeedLabel();
  updateHandControlLabels();
}

function syncVisualizerControls() {
  const visualizer = visualizerSelect.value;
  const config = visualizerConfig(visualizer);
  const controls = controlConfig(config);
  const labels = controlLabels(config);
  const formOptions = config.forms || [];
  const activeForm = fireworkFormSelect.value;
  const formLabel = fireworkFormSelect.closest("label");
  const peakLabel = peakToggle.closest("label");
  const speedLabel = fireworkSpeed.closest("label");
  const reachLabel = handSize.closest("label");
  const dischargeLabel = eyeDischargeSelect.closest("label");
  const themeLabel = themeSelect.closest("label");
  const armsLabel = handCount.closest("label");
  const graspLabel = handGrasp.closest("label");

  formLabel.hidden = formOptions.length === 0;
  setControlLabel(fireworkFormSelect, labels.form);
  if (formOptions.length > 0) {
    fireworkFormSelect.replaceChildren(...formOptions.map(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = value === activeForm;
      return option;
    }));

    if (!formOptions.some(([value]) => value === fireworkFormSelect.value)) {
      fireworkFormSelect.value = formOptions[0][0];
    }
  }

  const isSauron = visualizer === "eyevisions" && fireworkFormSelect.value === "sauron";
  const isMissileCommand = visualizer === "lightning" && fireworkFormSelect.value === "missilecommand";
  syncSauronMoodControl(isSauron);
  document.querySelector("#visualizer").classList.toggle("missile-targeting", isMissileCommand);
  themeLabel.hidden = !controls.theme;
  peakLabel.hidden = !controls.peak;
  speedLabel.hidden = !controls.speed;
  reachLabel.hidden = isSauron || !controls.size;
  dischargeLabel.hidden = !isSauron;
  armsLabel.hidden = !controls.count;
  graspLabel.hidden = !controls.grasp;
  if (!isSauron) {
    setControlLabel(themeSelect, labels.theme);
  }
  setControlLabel(fireworkSpeed, labels.speed);
  setControlLabel(handSize, labels.size);
  setControlLabel(handCount, labels.count);
  setControlLabel(handGrasp, labels.grasp);
}

function setFullscreenLabel() {
  const active = document.querySelector(".player").classList.contains("visual-fullscreen");
  fullscreenButton.textContent = active ? "X" : "F";
  fullscreenButton.title = active ? "Exit fullscreen (Esc)" : "Visual fullscreen (F4)";
}

function scheduleCanvasResize() {
  requestAnimationFrame(() => {
    resizeCanvas();
    requestAnimationFrame(resizeCanvas);
  });
  window.setTimeout(resizeCanvas, 80);
  window.setTimeout(resizeCanvas, 220);
}

function enterVisualStage() {
  const player = document.querySelector(".player");

  if (player.classList.contains("visual-fullscreen")) {
    return;
  }

  player.classList.add("visual-fullscreen");
  document.body.classList.add("visual-stage");
  setFullscreenLabel();
  scheduleCanvasResize();

  if (player.requestFullscreen) {
    player.requestFullscreen().then(scheduleCanvasResize).catch(scheduleCanvasResize);
  }
}

function exitVisualStage() {
  const player = document.querySelector(".player");

  player.classList.remove("visual-fullscreen");
  document.body.classList.remove("visual-stage");
  setFullscreenLabel();
  scheduleCanvasResize();

  if (document.fullscreenElement) {
    document.exitFullscreen().then(scheduleCanvasResize).catch(scheduleCanvasResize);
  }
}

function toggleVisualFullscreen() {
  if (document.querySelector(".player").classList.contains("visual-fullscreen")) {
    exitVisualStage();
  } else {
    enterVisualStage();
  }
}

const smileDialLevels = [
  { value: 0, label: "Composed", angle: -52 },
  { value: 0.55, label: "Amused", angle: 0 },
  { value: 1, label: "Beaming", angle: 52 },
];
const insanityDialLevels = [
  { value: 0, label: "Sane", angle: -52 },
  { value: 0.55, label: "Strange", angle: 0 },
  { value: 1, label: "Unhinged", angle: 52 },
];

function spectrumLevelIndex(value) {
  if (value >= 0.78) return 2;
  if (value >= 0.28) return 1;
  return 0;
}

function updateSpectrumDials() {
  const smileLevel = smileDialLevels[spectrumLevelIndex(spectrumPad.smilesDecadence)];
  const insanityLevel = insanityDialLevels[spectrumLevelIndex(spectrumPad.psychedeliaInsanity)];
  spectrumPad.smilesDecadence = smileLevel.value;
  spectrumPad.psychedeliaInsanity = insanityLevel.value;

  smilesDial.dataset.level = String(spectrumLevelIndex(smileLevel.value));
  smilesDial.style.setProperty("--dial-angle", `${smileLevel.angle}deg`);
  smilesDial.setAttribute("aria-label", `Smiles: ${smileLevel.label}`);
  smilesDialValue.textContent = smileLevel.label;

  insanityDial.dataset.level = String(spectrumLevelIndex(insanityLevel.value));
  insanityDial.style.setProperty("--dial-angle", `${insanityLevel.angle}deg`);
  insanityDial.setAttribute("aria-label", `Insanity: ${insanityLevel.label}`);
  insanityDialValue.textContent = insanityLevel.label;
}

function spectrumPadLabel() {
  const smileLevel = smileDialLevels[spectrumLevelIndex(spectrumPad.smilesDecadence)];
  const insanityLevel = insanityDialLevels[spectrumLevelIndex(spectrumPad.psychedeliaInsanity)];
  return `${smileLevel.label} / ${insanityLevel.label}`;
}

function setSpectrumDial(axis, index, pulse = true) {
  const levels = axis === "smiles" ? smileDialLevels : insanityDialLevels;
  const level = levels[clampNumber(index, 0, levels.length - 1)];
  if (axis === "smiles") spectrumPad.smilesDecadence = level.value;
  else spectrumPad.psychedeliaInsanity = level.value;
  updateSpectrumDials();
  if (pulse) pulseStageLabel("visual", spectrumPadLabel());
  if (!animationId) {
    drawIdleVisualizer();
  }
  scheduleSessionSave();
}

function adjustSpectrumPad(code) {
  const smileIndex = spectrumLevelIndex(spectrumPad.smilesDecadence);
  const insanityIndex = spectrumLevelIndex(spectrumPad.psychedeliaInsanity);
  if (code === "KeyW") setSpectrumDial("smiles", smileIndex + 1);
  if (code === "KeyS") setSpectrumDial("smiles", smileIndex - 1);
  if (code === "KeyA") setSpectrumDial("insanity", insanityIndex - 1);
  if (code === "KeyD") setSpectrumDial("insanity", insanityIndex + 1);
}

function setRangeControlValue(control, value) {
  control.value = clampNumber(Number(value), Number(control.min), Number(control.max));
}

function selectOptionByRecipe(select, index) {
  const options = Array.from(select.options);
  if (options.length === 0) {
    return;
  }

  select.value = options[index % options.length].value;
}

function applyAlchemicalAdjustment() {
  const visualizer = visualizerSelect.value;
  const step = alchemicalStepByVisual[visualizer] || 0;
  const recipe = alchemicalRecipes[step % alchemicalRecipes.length];
  alchemicalStepByVisual[visualizer] = step + 1;

  syncVisualizerControls();
  selectOptionByRecipe(fireworkFormSelect, recipe.form + step);
  syncVisualizerControls();
  selectOptionByRecipe(themeSelect, recipe.theme + Math.floor(step / 2));
  setRangeControlValue(fireworkSpeed, recipe.speed);
  setRangeControlValue(handSize, recipe.size);
  setRangeControlValue(handCount, recipe.count);
  setRangeControlValue(handGrasp, recipe.grasp);
  spectrumPad.smilesDecadence = recipe.smiles;
  spectrumPad.psychedeliaInsanity = recipe.insanity;

  updateFireworkSpeedLabel();
  updateHandControlLabels();
  updateSpectrumDials();
  syncVisualizerControls();
  pulseStageLabel("visual", `AA: ${recipe.name}`);
  if (!animationId) {
    drawIdleVisualizer();
  }
  scheduleSessionSave(120);
}

function restartVisualizer() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = 0;
  }

  peakLevels = [];
  peakUpdatedAt = [];
  fireworks = [];
  fireworkCooldowns = [];
  fireworkFrame = 0;
  shapeReveal = 0;
  pacDancers = [];
  pacFrame = 0;
  handForms = [];
  handFrame = 0;
  swampBubbles = [];
  swampFrame = 0;
  arrows = [];
  arrowFires = [];
  arrowBursts = [];
  arrowFrame = 0;
  cephArms = [];
  cephInkBlooms = [];
  cephFrame = 0;
  discoCouples = [];
  discoFrame = 0;
  glitterParticles = [];
  glitterFrame = 0;
  butterflies = [];
  butterflyFrame = 0;
  knifeTargets = [];
  thrownKnives = [];
  knifeFrame = 0;
  occlusionOctopi = [];
  octopusFrame = 0;
  loucheLizards = [];
  lizardFrame = 0;
  goddessKisses = [];
  goddessFrame = 0;
  gardenVines = [];
  gardenFrame = 0;
  tigerFrame = 0;
  tigerSpurts = [];
  tigerRoarUntil = 0;
  mandelbrotFrame = 0;
  eyeFrame = 0;
  lightningFrame = 0;
  lightningBolts = [];
  lightningImpacts = [];
  asteroidFrame = 0;
  asteroidShip = null;
  asteroidRocks = [];
  asteroidShots = [];
  asteroidSaucers = [];
  asteroidBursts = [];
  asteroidKeys.clear();
  asteroidScore = 0;
  asteroidLastShot = 0;
  interzoneFrame = 0;
  interzoneFigures = [];
  interzoneDrops = [];
  interzoneWisps = [];
  sunflowerFrame = 0;
  sunflowerFaces = [];
  sunflowerInsects = [];
  roseFrame = 0;
  roseUnits = [];
  rosePetals = [];
  roseSlashes = [];
  turtleFrame = 0;
  pilotFish = null;
  riverFish = [];
  riverTurtles = [];
  riverRipples = [];
  cathedralFrame = 0;
  cathedralFigures = [];
  cathedralSparks = [];
  hypnoticFrame = 0;
  hypnoticFigures = [];
  hypnoticMonsters = [];
  hypnoticBlobs = [];
  kaleidoscopeFrame = 0;
  bobGardenFrame = 0;
  bobGardenBugs = [];
  oilSlideFrame = 0;
  oilBlobs = [];
  oysterFrame = 0;
  oysters = [];
  lingerieFrame = 0;
  lingerieGarments = [];
  snakeCongaFrame = 0;
  snakeCongas = [];
  snakeCongaCastoffs = [];

  if (!audio.paused && analyser) {
    drawVisualizer();
  } else {
    drawIdleVisualizer();
  }
}

function setupAudioGraph() {
  if (!audioContext) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.64;
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

function loadTrack(index, autoplay = true, resumeAt = null) {
  if (index < 0 || index >= tracks.length) {
    return;
  }

  const shouldAutoplay = autoplay || continuousPlaybackRequested;
  playbackGeneration += 1;
  if (shouldAutoplay) {
    playbackTransitioning = true;
  }

  if (
    currentIndex >= 0
    && tracks[currentIndex]?.url
    && tracks[currentIndex].source !== "default-server"
    && tracks[currentIndex].source !== "android-bridge"
  ) {
    URL.revokeObjectURL(tracks[currentIndex].url);
    tracks[currentIndex].url = "";
  }

  currentIndex = index;
  const track = tracks[currentIndex];
  const trackUrl = track.audioUrl || URL.createObjectURL(track.file);
  track.url = trackUrl;
  audio.autoplay = shouldAutoplay;
  audio.preload = "auto";
  audio.src = trackUrl;
  audio.load();
  if (Number.isFinite(resumeAt) && resumeAt > 0) {
    const applyResumeTime = () => {
      const safeDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : resumeAt + 1;
      audio.currentTime = Math.min(resumeAt, Math.max(0, safeDuration - 0.8));
      timeReadout.textContent = `${formatDuration(audio.currentTime)} / ${formatDuration(audio.duration)}`;
    };
    audio.addEventListener("loadedmetadata", applyResumeTime, { once: true });
  }
  currentTrack.textContent = trackDisplayTitle(track);
  renderTracks();
  scheduleSessionSave();

  if (shouldAutoplay) {
    playLoadedTrackWithRetry(playbackGeneration);
  }
}

async function playCurrent() {
  if (tracks.length === 0) {
    return;
  }

  if (currentIndex === -1) {
    loadTrack(0, false);
  }

  continuousPlaybackRequested = true;
  const generation = playbackGeneration;
  setupAudioGraph();
  await audioContext.resume();
  if (isAndroidCarMode) {
    await waitForAudioReady(1800, generation);
  }
  await audio.play();
  if (generation !== playbackGeneration) {
    return;
  }
  playbackTransitioning = false;
  setStatus("playing");
  scheduleSessionSave(120);
  drawVisualizer();
}

function waitForAudioReady(timeoutMs = 2400, generation = playbackGeneration) {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      audio.removeEventListener("canplay", settle);
      audio.removeEventListener("loadeddata", settle);
      window.clearTimeout(timer);
    };
    const settle = () => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve();
    };
    const timer = window.setTimeout(settle, timeoutMs);

    audio.addEventListener("canplay", settle, { once: true });
    audio.addEventListener("loadeddata", settle, { once: true });
  });
}

async function playLoadedTrackWithRetry(generation = playbackGeneration) {
  try {
    if (generation !== playbackGeneration) {
      return;
    }
    await playCurrent();
  } catch (error) {
    console.warn("Playback start deferred", error);
    await waitForAudioReady(2600, generation);
    try {
      if (generation !== playbackGeneration) {
        return;
      }
      await playCurrent();
    } catch (retryError) {
      console.warn("Playback start failed", retryError);
      continuousPlaybackRequested = false;
      playbackTransitioning = false;
      setStatus("paused");
      setAndroidStatus("Android: tap play to continue");
    }
  }
}

function continueToNextTrack() {
  if (tracks.length === 0) {
    return;
  }

  const next = nextIndex();
  continuousPlaybackRequested = true;
  pulseStageLabel("track", trackDisplayTitle(tracks[next]));
  loadTrack(next, true);
  scheduleSessionSave(120);
}

function pauseCurrent() {
  continuousPlaybackRequested = false;
  playbackTransitioning = false;
  audio.pause();
  setStatus("paused");
  scheduleSessionSave(120);
}

function stopCurrent() {
  continuousPlaybackRequested = false;
  playbackTransitioning = false;
  audio.pause();
  audio.currentTime = 0;
  setStatus("stopped");
  scheduleSessionSave(120);
}

function resetLibraryState() {
  tracks.forEach((track) => {
    if (track.url && track.source !== "default-server") {
      URL.revokeObjectURL(track.url);
    }
  });

  currentIndex = -1;
  audio.removeAttribute("src");
  audio.load();
  currentTrack.textContent = "No track loaded";
  timeReadout.textContent = "0:00 / 0:00";
  setStatus("stopped");
}

function openDirectoryStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(directoryStoreName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("handles");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveDirectoryHandle(handle) {
  const db = await openDirectoryStore();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction("handles", "readwrite");
    transaction.objectStore("handles").put(handle, "library");
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function loadDirectoryHandle() {
  const db = await openDirectoryStore();
  const handle = await new Promise((resolve, reject) => {
    const transaction = db.transaction("handles", "readonly");
    const request = transaction.objectStore("handles").get("library");
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return handle;
}

async function collectWavFilesFromHandle(directoryHandle) {
  const files = [];
  const walk = async (handle, prefix = "") => {
    for await (const entry of handle.values()) {
      if (entry.kind === "file" && entry.name.toLowerCase().endsWith(".wav")) {
        const file = await entry.getFile();
        files.push({ file, relativePath: `${prefix}${entry.name}`, source: "directory-handle" });
      } else if (entry.kind === "directory") {
        await walk(entry, `${prefix}${entry.name}/`);
      }
    }
  };

  await walk(directoryHandle);
  return files;
}

function loadTrackFiles(files, name, source) {
  resetLibraryState();
  tracks = files
    .filter((entry) => entry.file?.name?.toLowerCase().endsWith(".wav"))
    .map((entry) => ({
      file: entry.file,
      url: "",
      source,
      relativePath: entry.relativePath || entry.file.webkitRelativePath || entry.file.name,
    }));

  directoryName.textContent = name || defaultDirectoryName;
  sortTracks();
  renderTracks();
  restoreTrackFromSession(restoredSession);
  scheduleSessionSave();
}

function loadServerTracks(library) {
  resetLibraryState();
  tracks = (library.tracks || [])
    .filter((track) => track.name?.toLowerCase().endsWith(".wav") && track.audioUrl)
    .map((track) => ({
      name: track.name,
      lastModified: track.lastModified || 0,
      relativePath: track.relativePath || track.name,
      audioUrl: track.audioUrl,
      url: "",
      source: "default-server",
    }));

  directoryName.textContent = library.directoryName || defaultDirectoryName;
  sortTracks();
  renderTracks();
  restoreTrackFromSession(restoredSession);
  scheduleSessionSave();
}

function loadAndroidTracks(library) {
  resetLibraryState();
  tracks = (library.tracks || [])
    .filter((track) => track.name?.toLowerCase().endsWith(".wav") && track.audioUrl)
    .map((track) => ({
      name: track.name,
      lastModified: track.lastModified || 0,
      relativePath: track.relativePath || track.name,
      audioUrl: track.audioUrl,
      url: "",
      source: "android-bridge",
    }));

  directoryName.textContent = library.directoryName || "Android music folder";
  sortTracks();
  renderTracks();
  restoreTrackFromSession(restoredSession);
  if (library.error) {
    setAndroidStatus(`Android: ${library.error}`);
  } else if (tracks.length > 0) {
    setAndroidStatus(`Android: ${tracks.length} ${tracks.length === 1 ? "track" : "tracks"}`);
  } else {
    setAndroidStatus("Android: no WAV files found");
  }
  scheduleSessionSave();
}

function loadAndroidBridgeLibrary() {
  if (!androidBridge?.getLibrary) {
    return false;
  }

  try {
    const library = JSON.parse(androidBridge.getLibrary());
    loadAndroidTracks(library);
    return tracks.length > 0;
  } catch (error) {
    console.warn("Android library load failed", error);
    setAndroidStatus("Android: library load failed");
    return false;
  }
}

function chooseAndroidFolder() {
  if (!androidBridge?.chooseFolder) {
    return false;
  }

  androidBridge.chooseFolder();
  return true;
}

async function loadDefaultServerLibrary() {
  try {
    const response = await fetch(defaultLibraryApi, { cache: "no-store" });
    if (!response.ok) {
      return false;
    }

    const library = await response.json();
    loadServerTracks(library);
    return tracks.length > 0;
  } catch (error) {
    return false;
  }
}

async function openRememberedDirectory({ prompt = false } = {}) {
  if (!("showDirectoryPicker" in window)) {
    return false;
  }

  try {
    const handle = prompt
      ? await window.showDirectoryPicker({ id: "wave-deck-library", mode: "read", startIn: "music" })
      : await loadDirectoryHandle();

    if (!handle) {
      return false;
    }

    let permission = await handle.queryPermission({ mode: "read" });
    if (permission !== "granted" && prompt) {
      permission = await handle.requestPermission({ mode: "read" });
    }

    if (permission !== "granted") {
      directoryName.textContent = defaultDirectoryName;
      return false;
    }

    const files = await collectWavFilesFromHandle(handle);
    loadTrackFiles(files, handle.name || defaultDirectoryName, "directory-handle");
    await saveDirectoryHandle(handle);
    return true;
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.warn("Directory load failed", error);
    }
    return false;
  }
}

async function loadPreferredLibrary() {
  const loadedFromAndroid = loadAndroidBridgeLibrary();
  if (loadedFromAndroid) {
    restoreTrackFromSession(restoredSession);
    return;
  }

  if (restoredSession?.librarySource === "directory-handle") {
    const opened = await openRememberedDirectory();
    if (opened) {
      restoreTrackFromSession(restoredSession);
      return;
    }
  }

  const loaded = await loadDefaultServerLibrary();
  if (loaded) {
    restoreTrackFromSession(restoredSession);
    return;
  }

  const opened = await openRememberedDirectory();
  if (opened) {
    restoreTrackFromSession(restoredSession);
  }
}

function nextIndex() {
  if (tracks.length < 2) {
    return currentIndex;
  }

  if (shuffleToggle.checked) {
    let next = currentIndex;
    while (next === currentIndex) {
      next = Math.floor(Math.random() * tracks.length);
    }
    return next;
  }

  return (currentIndex + 1) % tracks.length;
}

function previousIndex() {
  if (shuffleToggle.checked || currentIndex <= 0) {
    return 0;
  }

  return currentIndex - 1;
}

function changeTrackByStep(step) {
  if (tracks.length === 0) {
    return;
  }

  const wasPlaying = !audio.paused;
  let next = currentIndex;

  if (currentIndex === -1) {
    next = step > 0 ? 0 : tracks.length - 1;
  } else if (shuffleToggle.checked) {
    next = step > 0 ? nextIndex() : previousIndex();
  } else {
    next = (currentIndex + step + tracks.length) % tracks.length;
  }

  pulseStageLabel("track", trackDisplayTitle(tracks[next]));
  loadTrack(next, wasPlaying);
  if (!wasPlaying && !animationId) {
    drawIdleVisualizer();
  }
}

function loadTrackBoundary(index) {
  if (tracks.length === 0) {
    return;
  }

  const next = clampNumber(index, 0, tracks.length - 1);
  const wasPlaying = !audio.paused;
  pulseStageLabel("track", trackDisplayTitle(tracks[next]));
  loadTrack(next, wasPlaying);
  if (!wasPlaying && !animationId) {
    drawIdleVisualizer();
  }
}

function changeVisualizerByStep(step) {
  const options = Array.from(visualizerSelect.options);
  const current = Math.max(0, options.findIndex((option) => option.value === visualizerSelect.value));
  const next = (current + step + options.length) % options.length;

  visualizerSelect.value = options[next].value;
  pulseStageLabel("visual", visualizerDisplayName());
  visualizerSelect.dispatchEvent(new Event("change"));
}

function roarTipusTiger() {
  tigerRoarUntil = performance.now() + 900;
  pulseStageLabel("visual", "Tipu's Tiger roars");

  if (audioContext) {
    const start = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(92, start);
    oscillator.frequency.exponentialRampToValueAtTime(38, start + 0.75);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.85);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.9);
  }

  if (!animationId) {
    drawIdleVisualizer();
  }
}

function drawVisualizer() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = 0;
  }

  const canvasContext = visualizer.getContext("2d");
  const buffer = new Uint8Array(analyser.frequencyBinCount);

  const draw = () => {
    try {
      canvasContext.setTransform(1, 0, 0, 1, 0, 0);
      canvasContext.globalAlpha = 1;
      canvasContext.globalCompositeOperation = "source-over";
      if (visualizerSelect.value === "snakeconga") {
        drawSnakeCongaFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "lingerie") {
        drawLingerieFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "oysterpearls") {
        drawOysterPearlsFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "oilslide") {
        drawOilSlideFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "bobrossgarden") {
        drawBobRossGardenFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "kaleidoscope") {
        drawKaleidoscopeFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "hypnoticflight") {
        drawHypnoticFlightFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "cathedralorganism") {
        drawCathedralOrganismFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "turtleriver") {
        drawTurtleRiverFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "warofroses") {
        drawWarOfRosesFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "sunflowersmiles") {
        drawSunflowerSmilesFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "interzoneoracles") {
        drawInterzoneOraclesFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "asteroids") {
        drawAsteroidsFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "lightning") {
        drawLightningFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "eyevisions") {
        drawEyeVisionsFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "mandelbrot") {
        drawMandelbrotFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "tipustiger") {
        drawTipusTigerFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "climbinggarden") {
        drawClimbingGardenFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "goddesskisses") {
        drawGoddessKissesFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "lizardlouche") {
        drawLizardLoucheFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "octopusocclusion") {
        drawOctopusOcclusionFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "knifethunk") {
        drawKnifeThunkFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "butterflyhost") {
        drawButterflyHostFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "glitterfall") {
        drawGlitterFallFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "discojive") {
        drawDiscoJiveFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "cephalopod") {
        drawCephalopodFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "arrowstorm") {
        drawArrowStormFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "swampbubbles") {
        drawSwampBubblesFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "branchhands") {
        drawBranchHandsFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "pacdance") {
        drawPacDanceFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "fireworks") {
        drawFireworksFrame(canvasContext, buffer);
      } else {
        drawEqualizerFrame(canvasContext, buffer);
      }
      drawSpectrumDialEffects(canvasContext);
      drawStagePulse(canvasContext);
      drawFullscreenInfo(canvasContext);
    } catch (error) {
      console.warn("Visualizer frame skipped", error);
    }

    animationId = requestAnimationFrame(draw);
  };

  draw();
}

function drawEqualizerFrame(canvasContext, buffer) {
    const width = visualizer.width;
    const height = visualizer.height;
    canvasContext.clearRect(0, 0, width, height);
    canvasContext.fillStyle = "#0b0d0f";
    canvasContext.fillRect(0, 0, width, height);

    analyser.getByteFrequencyData(buffer);

    const barCount = 48;
    const barGap = 5;
    const barWidth = (width - (barCount - 1) * barGap) / barCount;
    const theme = visualizerTheme();
    const now = performance.now();

    for (let i = 0; i < barCount; i += 1) {
      const start = Math.floor((i / barCount) * buffer.length);
      const end = Math.floor(((i + 1) / barCount) * buffer.length);
      let total = 0;

      for (let j = start; j < end; j += 1) {
        total += buffer[j];
      }

      const value = total / Math.max(1, end - start);
      const normalizedValue = value / 255;
      const barHeight = Math.max(8, normalizedValue * (height - 28));
      const x = i * (barWidth + barGap);
      const y = height - barHeight;

      if (!peakLevels[i] || barHeight >= peakLevels[i] || now - peakUpdatedAt[i] > peakHoldMs) {
        peakLevels[i] = barHeight;
        peakUpdatedAt[i] = now;
      }

      canvasContext.fillStyle = theme.color(i, barCount, normalizedValue);
      canvasContext.fillRect(x, y, barWidth, barHeight);
      canvasContext.fillStyle = "rgba(255, 255, 255, 0.18)";
      canvasContext.fillRect(x, y, barWidth, 3);

      if (peakToggle.checked && peakLevels[i]) {
        const age = now - peakUpdatedAt[i];
        const opacity = Math.max(0, 1 - age / peakHoldMs);
        const peakY = height - peakLevels[i];
        canvasContext.fillStyle = theme.peak.replace(/[\d.]+\)$/, `${0.28 + opacity * 0.62})`);
        canvasContext.fillRect(x, peakY, barWidth, 4);
      }
    }
}

function averageBand(buffer, start, end) {
  let total = 0;
  const safeEnd = Math.min(end, buffer.length - 1);

  for (let index = start; index <= safeEnd; index += 1) {
    total += buffer[index];
  }

  return total / Math.max(1, safeEnd - start + 1) / 255;
}

function updateMood(buffer) {
  const bass = averageBand(buffer, 1, 8);
  const mids = averageBand(buffer, 12, 42);
  const treble = averageBand(buffer, 46, 112);
  const energy = bass * 0.42 + mids * 0.36 + treble * 0.22;

  moodState.energy = moodState.energy * 0.92 + energy * 0.08;
  moodState.brightness = moodState.brightness * 0.9 + treble * 0.1;
  moodState.warmth = moodState.warmth * 0.9 + bass * 0.1;
}

function fireworkHue(bandIndex, intensity) {
  const palette = fireworkPalettes[themeSelect.value] || fireworkPalettes.mono;
  const baseHue = palette[bandIndex % palette.length];
  const moodShift = (moodState.brightness - moodState.warmth) * 44;
  return baseHue + moodShift + intensity * 16;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hsla(hue, saturation, lightness, alpha) {
  const smiles = clampNumber(spectrumPad.smilesDecadence, 0, 1);
  const insanity = clampNumber(spectrumPad.psychedeliaInsanity, 0, 1);

  if (smiles || insanity) {
    const now = performance.now?.() || Date.now();
    const movingHue = Math.sin(now * (0.0008 + insanity * 0.0022)) * insanity * 156;
    hue += smiles * -24 + insanity * 148 + movingHue;
    saturation = clampNumber(saturation + smiles * 14 + insanity * 42, 0, 100);
    lightness = clampNumber(lightness + smiles * 17 + insanity * Math.sin(now * 0.004) * 24, 0, 100);
  }

  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

function drawSpectrumDialEffects(canvasContext) {
  const smiles = clampNumber(spectrumPad.smilesDecadence, 0, 1);
  const insanity = clampNumber(spectrumPad.psychedeliaInsanity, 0, 1);
  if (!smiles && !insanity) return;

  const width = visualizer.width;
  const height = visualizer.height;
  const now = performance.now?.() || Date.now();
  canvasContext.save();
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);

  if (smiles) {
    canvasContext.globalCompositeOperation = "screen";
    const glow = canvasContext.createRadialGradient(width * 0.5, height * 0.34, 0, width * 0.5, height * 0.34, width * 0.72);
    glow.addColorStop(0, `rgba(255, 236, 142, ${0.13 * smiles})`);
    glow.addColorStop(0.5, `rgba(255, 102, 138, ${0.08 * smiles})`);
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.fillRect(0, 0, width, height);
  }

  if (insanity) {
    const hue = (now * 0.045) % 360;
    canvasContext.globalCompositeOperation = "color";
    canvasContext.globalAlpha = 0.16 + insanity * 0.32;
    const wash = canvasContext.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, `hsl(${hue} 100% 50%)`);
    wash.addColorStop(0.5, `hsl(${(hue + 137) % 360} 100% 54%)`);
    wash.addColorStop(1, `hsl(${(hue + 272) % 360} 100% 48%)`);
    canvasContext.fillStyle = wash;
    canvasContext.fillRect(0, 0, width, height);

    canvasContext.globalCompositeOperation = "screen";
    canvasContext.globalAlpha = 0.14 + insanity * 0.2;
    canvasContext.lineWidth = Math.max(2, Math.min(width, height) * 0.006);
    for (let ring = 0; ring < 5; ring += 1) {
      const phase = now * (0.00035 + ring * 0.00005) + ring * 1.7;
      const x = width * (0.5 + Math.sin(phase) * 0.34);
      const y = height * (0.5 + Math.cos(phase * 1.3) * 0.3);
      const radius = Math.min(width, height) * (0.08 + ring * 0.07 + insanity * 0.08 * Math.sin(phase * 2));
      canvasContext.strokeStyle = `hsl(${(hue + ring * 73) % 360} 100% 68%)`;
      canvasContext.beginPath();
      canvasContext.arc(x, y, Math.max(4, radius), 0, Math.PI * 2);
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function pressureResponse(value, boost = 1.35) {
  return Math.min(1, Math.pow(Math.max(0, value), 0.58) * boost);
}

function pointOnLine(x1, y1, x2, y2) {
  const amount = Math.random();
  return {
    x: x1 + (x2 - x1) * amount,
    y: y1 + (y2 - y1) * amount,
  };
}

function pointOnEllipse(cx, cy, rx, ry) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random());
  return {
    x: cx + Math.cos(angle) * rx * radius,
    y: cy + Math.sin(angle) * ry * radius,
  };
}

function hydraPoint() {
  const pick = Math.random();

  if (pick < 0.5) {
    const neck = Math.floor(Math.random() * 7);
    const t = Math.random();
    const rootX = 0.5;
    const rootY = 0.78;
    const headX = 0.18 + neck * 0.105;
    const headY = 0.18 + Math.sin(neck * 1.35) * 0.09;
    const bend = Math.sin(t * Math.PI * 2 + neck) * 0.06;
    return {
      x: rootX + (headX - rootX) * t + bend,
      y: rootY + (headY - rootY) * t,
    };
  }

  if (pick < 0.75) {
    const head = Math.floor(Math.random() * 7);
    return pointOnEllipse(0.18 + head * 0.105, 0.18 + Math.sin(head * 1.35) * 0.09, 0.04, 0.05);
  }

  if (pick < 0.9) {
    return pointOnEllipse(0.5, 0.76, 0.18, 0.095);
  }

  const coil = Math.random();
  return {
    x: 0.5 + Math.cos(coil * Math.PI * 2) * (0.08 + coil * 0.1),
    y: 0.78 + Math.sin(coil * Math.PI * 2) * 0.06,
  };
}

function womanPoint() {
  const pick = Math.random();

  if (pick < 0.18) {
    return pointOnEllipse(0.5, 0.22, 0.05, 0.065);
  }

  if (pick < 0.42) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const t = Math.random();
    return {
      x: 0.5 + side * (0.055 + Math.sin(t * Math.PI) * 0.09),
      y: 0.29 + t * 0.33,
    };
  }

  if (pick < 0.66) {
    const side = Math.random() < 0.5 ? -1 : 1;
    return pointOnLine(0.5, 0.36, 0.5 + side * 0.19, 0.52);
  }

  if (pick < 0.86) {
    const side = Math.random() < 0.5 ? -1 : 1;
    return pointOnLine(0.47 + side * 0.035, 0.62, 0.5 + side * 0.12, 0.84);
  }

  return pointOnEllipse(0.5, 0.51, 0.105, 0.18);
}

function lionPoint() {
  const pick = Math.random();

  if (pick < 0.28) {
    return pointOnEllipse(0.46, 0.55, 0.17, 0.11);
  }

  if (pick < 0.42) {
    return pointOnEllipse(0.62, 0.38, 0.07, 0.075);
  }

  if (pick < 0.58) {
    const side = Math.random() < 0.5 ? 0 : 1;
    return side
      ? pointOnLine(0.56, 0.48, 0.76, 0.28)
      : pointOnLine(0.5, 0.48, 0.68, 0.2);
  }

  if (pick < 0.76) {
    const side = Math.random() < 0.5 ? 0 : 1;
    return side
      ? pointOnLine(0.42, 0.62, 0.5, 0.84)
      : pointOnLine(0.54, 0.62, 0.65, 0.82);
  }

  if (pick < 0.9) {
    const t = Math.random();
    return {
      x: 0.3 - Math.sin(t * Math.PI) * 0.14,
      y: 0.5 - t * 0.22 + Math.sin(t * Math.PI * 2) * 0.025,
    };
  }

  return pointOnLine(0.66, 0.35, 0.78, 0.3);
}

function fireworkShapePoint(width, height) {
  const form = fireworkFormSelect.value;
  const point = form === "woman"
    ? womanPoint()
    : form === "lion"
      ? lionPoint()
      : hydraPoint();

  return {
    x: point.x * width,
    y: point.y * height,
  };
}

function spawnFirework(band, bandIndex, intensity, width, height) {
  const speedMultiplier = fireworkSpeedMultiplier();
  const burstScale = 0.55 + Math.random() * 1.75 + moodState.energy * 0.8;
  const particleCount = Math.round((10 + intensity * 26 + moodState.energy * 16) * burstScale);
  const radius = 0.9 + intensity * 3.1 + Math.random() * 2.2;
  const bias = bandIndex / Math.max(1, fireworksBands.length - 1);
  const originX = width * (0.08 + Math.random() * 0.84) * 0.7 + width * bias * 0.3;
  const originY = height * (0.14 + Math.random() * 0.72);
  const hue = fireworkHue(bandIndex, intensity);

  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.8 + Math.random() * (2.6 + intensity * 5.8)) * burstScale * speedMultiplier;
    const target = fireworkShapePoint(width, height);
    fireworks.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - intensity * 1.7,
      life: 1,
      age: 0,
      decay: (0.0048 + Math.random() * 0.0085) * (0.55 + speedMultiplier * 0.55),
      radius,
      targetX: target.x,
      targetY: target.y,
      pull: 0.0018 + Math.random() * 0.0048,
      hue: hue + (Math.random() - 0.5) * 22,
      saturation: 68 + intensity * 24,
      lightness: 48 + moodState.brightness * 30,
    });
  }
}

function drawFireworksFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  updateMood(buffer);
  fireworkFrame += speedMultiplier;
  shapeReveal = Math.min(1, shapeReveal + 0.0018 / Math.max(0.55, speedMultiplier));

  canvasContext.fillStyle = `rgba(5, 7, 9, ${(0.038 + moodState.energy * 0.065) * Math.sqrt(speedMultiplier)})`;
  canvasContext.fillRect(0, 0, width, height);

  const gradient = canvasContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `rgba(87, 216, 178, ${0.03 + moodState.brightness * 0.08})`);
  gradient.addColorStop(1, `rgba(252, 190, 74, ${0.02 + moodState.warmth * 0.08})`);
  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(0, 0, width, height);

  fireworksBands.forEach((band, bandIndex) => {
    const intensity = averageBand(buffer, band.start, band.end);
    const cooldown = fireworkCooldowns[bandIndex] || 0;
    const chance = intensity * 0.12 + moodState.energy * 0.035;

    if ((intensity > band.threshold || Math.random() < chance) && cooldown <= 0) {
      spawnFirework(band, bandIndex, intensity, width, height);
      fireworkCooldowns[bandIndex] = Math.max(4, (24 - intensity * 16 + Math.random() * 16) / speedMultiplier);
    } else {
      fireworkCooldowns[bandIndex] = Math.max(0, cooldown - speedMultiplier);
    }

    if (intensity > 0.12) {
      const pulseRadius = 14 + intensity * 64;
      const pulseHue = fireworkHue(bandIndex, intensity);
      const pulsePoint = fireworkShapePoint(width, height);
      const pulse = canvasContext.createRadialGradient(
        pulsePoint.x,
        pulsePoint.y,
        0,
        pulsePoint.x,
        pulsePoint.y,
        pulseRadius,
      );
      pulse.addColorStop(0, hsla(pulseHue, 78, 58, 0.22));
      pulse.addColorStop(1, "rgba(255, 255, 255, 0)");
      canvasContext.fillStyle = pulse;
      canvasContext.beginPath();
      canvasContext.arc(pulsePoint.x, pulsePoint.y, pulseRadius, 0, Math.PI * 2);
      canvasContext.fill();
    }
  });

  if (Math.floor(fireworkFrame) % 34 < speedMultiplier && moodState.energy > 0.03) {
    const index = Math.floor(Math.random() * fireworksBands.length);
    spawnFirework(fireworksBands[index], index, 0.18 + moodState.energy * 0.8, width, height);
  }

  drawEmergentForm(canvasContext, width, height);

  fireworks = fireworks.filter((particle) => particle.life > 0);
  fireworks.forEach((particle) => {
    const dying = Math.max(0, 0.72 - particle.life) / 0.72;
    const pull = particle.pull * (0.24 + dying * 1.7) * (0.95 + moodState.brightness);
    particle.vx += (particle.targetX - particle.x) * pull;
    particle.vy += (particle.targetY - particle.y) * pull;
    particle.x += particle.vx * speedMultiplier;
    particle.y += particle.vy * speedMultiplier;
    particle.vy += (0.012 + moodState.warmth * 0.03) * speedMultiplier;
    particle.vx *= 0.988 - dying * 0.012;
    particle.vy *= 0.988 - dying * 0.012;
    particle.age += speedMultiplier;
    particle.life -= particle.decay * speedMultiplier;

    const shimmer = 0.72 + Math.sin(particle.age * 0.22 + particle.hue) * 0.28;
    canvasContext.fillStyle = hsla(
      particle.hue,
      particle.saturation,
      particle.lightness + dying * 16,
      Math.max(0, particle.life) * shimmer,
    );
    canvasContext.beginPath();
    canvasContext.arc(particle.x, particle.y, Math.max(0.5, particle.radius * (0.32 + particle.life)), 0, Math.PI * 2);
    canvasContext.fill();
  });

  if (fireworks.length > 1200) {
    fireworks.splice(0, fireworks.length - 1200);
  }
}

function drawEmergentForm(canvasContext, width, height) {
  if (visualizerSelect.value !== "fireworks") {
    return;
  }

  const palette = fireworkPalettes[themeSelect.value] || fireworkPalettes.mono;
  const samples = Math.round(36 + shapeReveal * 118 + moodState.energy * 80);
  const alpha = 0.012 + shapeReveal * 0.032 + moodState.brightness * 0.018;

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";

  for (let index = 0; index < samples; index += 1) {
    const point = fireworkShapePoint(width, height);
    const hue = palette[index % palette.length] + Math.sin((fireworkFrame + index) * 0.017) * 22;
    const flicker = 0.6 + Math.sin(fireworkFrame * 0.08 + index) * 0.4;
    canvasContext.fillStyle = hsla(hue, 72, 64, alpha * flicker);
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 1.1 + shapeReveal * 1.6, 0, Math.PI * 2);
    canvasContext.fill();
  }

  if (fireworkFormSelect.value === "hydra" && shapeReveal > 0.18) {
    for (let neck = 0; neck < 7; neck += 1) {
      const head = {
        x: (0.18 + neck * 0.105) * width,
        y: (0.18 + Math.sin(neck * 1.35) * 0.09) * height,
      };
      canvasContext.strokeStyle = hsla(palette[neck % palette.length], 68, 58, 0.018 + shapeReveal * 0.045);
      canvasContext.lineWidth = 1.2 + shapeReveal * 2.4;
      canvasContext.beginPath();
      canvasContext.moveTo(width * 0.5, height * 0.78);
      canvasContext.quadraticCurveTo(
        width * (0.42 + neck * 0.025),
        height * (0.44 + Math.sin(neck) * 0.06),
        head.x,
        head.y,
      );
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function standardThemeHue(progress, intensity) {
  const theme = themeSelect.value;

  if (theme === "ice") return 188 + progress * 58 + intensity * 18;
  if (theme === "ember") return 2 + progress * 48 + intensity * 14;
  if (theme === "spectrum") return 302 - progress * 268 + intensity * 28;
  if (theme === "pressure") return 338 - progress * 246 + intensity * 58;

  return 148 + progress * 52 + intensity * 16;
}

function frequencyHue(bandIndex, intensity) {
  const progress = bandIndex / Math.max(1, pacBands.length - 1);
  return standardThemeHue(progress, intensity);
}

function setupPacDancers(width, height) {
  if (pacDancers.length) {
    return;
  }

  const rows = [
    height * 0.28,
    height * 0.5,
    height * 0.72,
  ];

  pacDancers = Array.from({ length: 18 }, (_, index) => {
    const bandIndex = index % pacBands.length;
    const row = Math.floor(index / pacBands.length);
    return {
      bandIndex,
      x: width * (0.08 + (index % pacBands.length) * 0.165) + (row % 2) * width * 0.045,
      y: rows[row],
      homeX: width * (0.08 + (index % pacBands.length) * 0.165) + (row % 2) * width * 0.045,
      homeY: rows[row],
      size: 18 + row * 4 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
      lady: index % 3 === 1,
      direction: index % 2 ? -1 : 1,
    };
  });
}

function drawPacCharacter(canvasContext, dancer, intensity, width, height) {
  const speedMultiplier = fireworkSpeedMultiplier();
  const band = pacBands[dancer.bandIndex];
  const beat = pacFrame * (0.045 + dancer.bandIndex * 0.006) + dancer.phase;
  const bounce = Math.sin(beat * 2.2) * intensity * dancer.size * 0.9;
  const sway = Math.sin(beat) * intensity * width * 0.025;
  const spin = band.move === "spin" || band.move === "twirl" ? beat * (0.35 + intensity) : Math.sin(beat) * 0.25;
  const slide = band.move === "slide" ? Math.sin(beat) * intensity * width * 0.06 : 0;
  const shimmy = band.move === "shimmy" ? Math.sin(beat * 6) * intensity * 9 : 0;
  const stomp = band.move === "stomp" ? Math.abs(Math.sin(beat * 1.5)) * intensity * 16 : 0;
  const x = dancer.homeX + sway + slide + shimmy;
  const y = dancer.homeY - bounce + stomp;
  const hue = frequencyHue(dancer.bandIndex, intensity);
  const mouth = 0.18 + Math.abs(Math.sin(beat * (4.8 + intensity * 4))) * (0.42 + intensity * 0.25);
  const radius = dancer.size * (0.92 + intensity * 0.45);

  dancer.homeX += Math.sin(beat * 0.31) * intensity * speedMultiplier * 0.5;
  dancer.homeY += Math.cos(beat * 0.27) * intensity * speedMultiplier * 0.26;
  dancer.homeX += (width * (0.08 + (dancer.bandIndex) * 0.165) - dancer.homeX) * 0.004;
  dancer.homeY += (height * (0.28 + Math.floor(pacDancers.indexOf(dancer) / pacBands.length) * 0.22) - dancer.homeY) * 0.004;

  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(spin * dancer.direction);
  canvasContext.scale(dancer.direction, 1);

  const glow = canvasContext.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius * 2.1);
  glow.addColorStop(0, hsla(hue, 92, 58, 0.24 + intensity * 0.22));
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius * 2.1, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = hsla(hue, 88, 34 + intensity * 34, 0.95);
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);
  canvasContext.arc(0, 0, radius, mouth, Math.PI * 2 - mouth);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(5, 7, 9, 0.82)";
  canvasContext.beginPath();
  canvasContext.arc(radius * 0.25, -radius * 0.45, Math.max(2.2, radius * 0.11), 0, Math.PI * 2);
  canvasContext.fill();

  if (dancer.lady) {
    canvasContext.fillStyle = hsla((hue + 34) % 360, 92, 68, 0.9);
    canvasContext.beginPath();
    canvasContext.moveTo(-radius * 0.25, -radius * 0.95);
    canvasContext.lineTo(-radius * 0.02, -radius * 1.38);
    canvasContext.lineTo(radius * 0.22, -radius * 0.95);
    canvasContext.closePath();
    canvasContext.fill();
    canvasContext.beginPath();
    canvasContext.arc(-radius * 0.02, -radius * 1.05, radius * 0.14, 0, Math.PI * 2);
    canvasContext.fill();
  }

  canvasContext.strokeStyle = hsla(hue, 90, 72, 0.65);
  canvasContext.lineWidth = Math.max(1.4, radius * 0.08);
  const legSwing = Math.sin(beat * 3.2) * radius * 0.36;
  canvasContext.beginPath();
  canvasContext.moveTo(-radius * 0.3, radius * 0.85);
  canvasContext.lineTo(-radius * 0.58, radius * 1.25 + legSwing);
  canvasContext.moveTo(radius * 0.05, radius * 0.9);
  canvasContext.lineTo(radius * 0.38, radius * 1.22 - legSwing);
  canvasContext.stroke();

  canvasContext.restore();
}

function drawPacDanceFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  pacFrame += speedMultiplier;

  canvasContext.fillStyle = "rgba(5, 7, 9, 0.22)";
  canvasContext.fillRect(0, 0, width, height);

  const gridSpacing = Math.max(42, width / 18);
  canvasContext.strokeStyle = "rgba(87, 216, 178, 0.05)";
  canvasContext.lineWidth = 1;
  for (let x = 0; x < width; x += gridSpacing) {
    canvasContext.beginPath();
    canvasContext.moveTo(x, 0);
    canvasContext.lineTo(x, height);
    canvasContext.stroke();
  }
  for (let y = 0; y < height; y += gridSpacing) {
    canvasContext.beginPath();
    canvasContext.moveTo(0, y);
    canvasContext.lineTo(width, y);
    canvasContext.stroke();
  }

  setupPacDancers(width, height);

  const bandIntensities = pacBands.map((band) => averageBand(buffer, band.start, band.end));

  bandIntensities.forEach((intensity, bandIndex) => {
    const hue = frequencyHue(bandIndex, intensity);
    const x = width * (0.08 + bandIndex * 0.165);
    const barHeight = Math.max(4, intensity * height * 0.18);
    canvasContext.fillStyle = hsla(hue, 86, 48 + intensity * 26, 0.22);
    canvasContext.fillRect(x - 18, height - barHeight - 8, 36, barHeight);
  });

  pacDancers.forEach((dancer) => {
    const intensity = bandIntensities[dancer.bandIndex];
    drawPacCharacter(canvasContext, dancer, intensity, width, height);
  });
}

function setupDiscoCouples(width, height) {
  const targetCount = handCountValueNumber();
  if (discoCouples.length === targetCount) {
    return;
  }

  const columns = Math.ceil(Math.sqrt(targetCount * 1.8));
  discoCouples = Array.from({ length: targetCount }, (_, index) => {
    const bandIndex = index % discoBands.length;
    const row = Math.floor(index / columns);
    const col = index % columns;
    const rowCount = Math.ceil(targetCount / columns);

    return {
      bandIndex,
      homeX: width * ((col + 0.55) / Math.max(1, columns)),
      homeY: height * (0.28 + ((row + 0.5) / Math.max(1, rowCount)) * 0.54),
      phase: Math.random() * Math.PI * 2,
      size: Math.min(width, height) * (0.048 + Math.random() * 0.012),
      direction: index % 2 === 0 ? 1 : -1,
    };
  });
}

function drawDiscoBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const floorHue = frequencyHue(4, trebleEnergy);
  const room = canvasContext.createLinearGradient(0, 0, 0, height);
  room.addColorStop(0, "rgba(5, 5, 10, 0.34)");
  room.addColorStop(0.48, hsla(floorHue, 72, 20 + trebleEnergy * 12, 0.34));
  room.addColorStop(1, "rgba(4, 2, 8, 0.52)");
  canvasContext.fillStyle = room;
  canvasContext.fillRect(0, 0, width, height);

  const tileSize = Math.max(26, width / 22);
  for (let x = -tileSize; x < width + tileSize; x += tileSize) {
    for (let y = height * 0.58; y < height + tileSize; y += tileSize) {
      const pulse = Math.sin(discoFrame * 0.04 + x * 0.02 + y * 0.03) * 0.5 + 0.5;
      canvasContext.fillStyle = hsla(300 - pulse * 190, 82, 28 + pulse * 22, 0.1 + bassEnergy * 0.12);
      canvasContext.fillRect(x, y, tileSize - 2, tileSize - 2);
    }
  }

  for (let beam = 0; beam < 5; beam += 1) {
    const hue = frequencyHue(beam, trebleEnergy);
    const x = width * (0.14 + beam * 0.18 + Math.sin(discoFrame * 0.012 + beam) * 0.04);
    const gradient = canvasContext.createRadialGradient(x, height * 0.18, 0, x, height * 0.18, width * 0.22);
    gradient.addColorStop(0, hsla(hue, 92, 62, 0.12 + trebleEnergy * 0.16));
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, width, height);
  }
}

function drawTinyJiver(canvasContext, dancer, role, intensity, x, y, size, hue, beat, direction) {
  const flair = handGraspAmount();
  const isUma = role === "uma";
  const twist = Math.sin(beat * 2.2) * (0.18 + intensity * 0.58 + flair * 0.2);
  const shoulder = Math.sin(beat * 3.4) * size * (0.22 + intensity * 0.34);
  const legKick = Math.sin(beat * 2.8 + (isUma ? Math.PI : 0)) * size * (0.55 + intensity * 0.8 + flair * 0.35);
  const handLift = Math.max(0, Math.sin(beat * 1.7 + (isUma ? 0.8 : 0))) * size * (1.1 + intensity * 0.9);
  const headBob = Math.abs(Math.sin(beat * 2.1)) * size * intensity * 0.42;

  canvasContext.save();
  canvasContext.translate(x, y - headBob);
  canvasContext.scale(direction, 1);
  canvasContext.rotate(twist * (isUma ? -1 : 1));
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";

  const glow = canvasContext.createRadialGradient(0, 0, size * 0.4, 0, 0, size * 3.2);
  glow.addColorStop(0, hsla(hue, 94, 58, 0.12 + intensity * 0.22));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(0, size * 0.45, size * 3.2, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = isUma ? "rgba(245, 239, 226, 0.92)" : "rgba(12, 13, 16, 0.96)";
  canvasContext.lineWidth = Math.max(2, size * 0.2);
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);
  canvasContext.lineTo(0, size * 1.18);
  canvasContext.stroke();

  canvasContext.strokeStyle = isUma ? hsla(hue + 36, 82, 72, 0.9) : "rgba(235, 238, 232, 0.88)";
  canvasContext.lineWidth = Math.max(1.4, size * 0.12);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.3, size * 0.34);
  canvasContext.lineTo(-size * (0.95 + intensity * 0.35), size * 0.05 - handLift * 0.28 + shoulder);
  canvasContext.moveTo(size * 0.28, size * 0.36);
  canvasContext.lineTo(size * (0.9 + flair * 0.42), size * 0.18 - handLift - shoulder);
  canvasContext.stroke();

  canvasContext.strokeStyle = hsla(hue, 78, isUma ? 66 : 46, 0.9);
  canvasContext.lineWidth = Math.max(1.5, size * 0.14);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.16, size * 1.12);
  canvasContext.lineTo(-size * 0.48, size * 1.9 + legKick * 0.16);
  canvasContext.moveTo(size * 0.14, size * 1.12);
  canvasContext.lineTo(size * 0.58, size * 1.82 - legKick * 0.2);
  canvasContext.stroke();

  canvasContext.fillStyle = "rgba(238, 198, 154, 0.96)";
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.42, size * 0.42, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = isUma ? "rgba(10, 8, 9, 0.96)" : "rgba(28, 22, 18, 0.92)";
  canvasContext.beginPath();
  if (isUma) {
    canvasContext.rect(-size * 0.52, -size * 0.82, size * 1.04, size * 0.34);
    canvasContext.rect(-size * 0.58, -size * 0.55, size * 0.22, size * 0.58);
    canvasContext.rect(size * 0.36, -size * 0.55, size * 0.22, size * 0.58);
  } else {
    canvasContext.arc(0, -size * 0.72, size * 0.43, Math.PI, Math.PI * 2);
  }
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(5, 7, 9, 0.82)";
  canvasContext.beginPath();
  canvasContext.arc(size * 0.16, -size * 0.46, Math.max(1, size * 0.055), 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.restore();
}

function drawDiscoCouple(canvasContext, couple, intensity, width, height) {
  const speedMultiplier = fireworkSpeedMultiplier();
  const flair = handGraspAmount();
  const scale = handSizeMultiplier();
  const band = discoBands[couple.bandIndex];
  const beat = discoFrame * (0.052 + couple.bandIndex * 0.008) + couple.phase;
  const hue = frequencyHue(couple.bandIndex, intensity);
  const bassStep = band.move === "bass-step" ? Math.abs(Math.sin(beat * 1.5)) * intensity * height * 0.025 : 0;
  const twistSlide = band.move === "twist" ? Math.sin(beat * 2.4) * intensity * width * 0.018 : 0;
  const spin = band.move === "spin" ? Math.sin(beat) * intensity * 0.55 : 0;
  const point = band.move === "finger-point" ? Math.max(0, Math.sin(beat * 2.2)) * intensity : 0;
  const distance = couple.size * scale * (1.5 + Math.sin(beat) * 0.24 + flair * 0.42 + point * 0.65);
  const size = couple.size * scale * (0.86 + intensity * 0.34);
  const centerX = couple.homeX + Math.sin(beat * 0.5) * intensity * width * 0.018 + twistSlide;
  const centerY = couple.homeY + bassStep + Math.cos(beat * 0.44) * intensity * height * 0.01;

  couple.homeX += Math.sin(beat * 0.21) * intensity * speedMultiplier * 0.55;
  couple.homeY += Math.cos(beat * 0.18) * intensity * speedMultiplier * 0.22;
  couple.homeX += (Math.min(width * 0.92, Math.max(width * 0.08, couple.homeX)) - couple.homeX) * 0.02;
  couple.homeY += (Math.min(height * 0.84, Math.max(height * 0.18, couple.homeY)) - couple.homeY) * 0.02;

  canvasContext.save();
  canvasContext.translate(centerX, centerY);
  canvasContext.rotate(spin * couple.direction);

  canvasContext.strokeStyle = hsla(hue + 18, 88, 72, 0.26 + intensity * 0.34);
  canvasContext.lineWidth = Math.max(1, size * 0.08);
  canvasContext.beginPath();
  canvasContext.moveTo(-distance * 0.7, size * 0.22);
  canvasContext.lineTo(distance * 0.7, size * 0.16);
  canvasContext.stroke();

  drawTinyJiver(canvasContext, couple, "john", intensity, -distance, 0, size, hue, beat, 1);
  drawTinyJiver(canvasContext, couple, "uma", intensity, distance, Math.sin(beat * 2) * size * intensity * 0.35, size * 0.96, hue + 32, beat + Math.PI * 0.18, -1);
  canvasContext.restore();
}

function drawDiscoJiveFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  discoFrame += speedMultiplier;
  setupDiscoCouples(width, height);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.35);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.45);
  canvasContext.fillStyle = "rgba(3, 3, 7, 0.28)";
  canvasContext.fillRect(0, 0, width, height);
  drawDiscoBackground(canvasContext, width, height, bassEnergy, trebleEnergy);

  const bandIntensities = discoBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.46));
  bandIntensities.forEach((intensity, bandIndex) => {
    const hue = frequencyHue(bandIndex, intensity);
    const x = width * ((bandIndex + 0.5) / discoBands.length);
    canvasContext.fillStyle = hsla(hue, 88, 58, 0.12 + intensity * 0.22);
    canvasContext.fillRect(x - width * 0.055, height * (0.88 - intensity * 0.22), width * 0.11, height * 0.22);
  });

  discoCouples.forEach((couple) => {
    drawDiscoCouple(canvasContext, couple, bandIntensities[couple.bandIndex], width, height);
  });
}

function glitterHue(bandIndex, intensity) {
  const theme = themeSelect.value;
  const progress = bandIndex / Math.max(1, glitterBands.length - 1);
  if (theme === "ice") {
    return 190 + progress * 76 + intensity * 24;
  }
  if (theme === "ember") {
    return 12 + progress * 42 + intensity * 18;
  }
  if (theme === "pressure") {
    return 330 - progress * 230 + intensity * 58;
  }
  if (theme === "spectrum") {
    return 298 - progress * 258 + intensity * 32;
  }
  return 150 + progress * 78 + intensity * 18;
}

function glitterWeatherMode() {
  return fireworkFormSelect.value === "blizzard"
    ? "blizzard"
    : fireworkFormSelect.value === "mixed"
      ? "mixed"
      : "snowfall";
}

function glitterBlizzardForce() {
  const mode = glitterWeatherMode();
  const control = handGraspAmount();
  if (mode === "blizzard") return 0.52 + control * 0.48;
  if (mode === "mixed") return control * 0.55;
  return control * 0.22;
}

function glitterTargetParticleCount(mode = glitterWeatherMode()) {
  const density = handCountValueNumber() / 6;
  const blizzard = glitterBlizzardForce();
  if (mode === "blizzard") return Math.round(190 + density * 180 + blizzard * 170);
  if (mode === "mixed") return Math.round(150 + density * 130 + blizzard * 90);
  return Math.round(130 + density * 115 + blizzard * 55);
}

function spawnGlitterParticle(bandIndex, intensity, width, height, seedFullDepth = false) {
  const form = glitterWeatherMode();
  const largeShare = glitterLargeShare();
  const fallRate = fireworkSpeedMultiplier();
  const blizzard = glitterBlizzardForce();
  const density = handCountValueNumber() / 6;
  const isBlizzard = form === "blizzard";
  const isMixed = form === "mixed";
  const isLarge = Math.random() < largeShare;
  const sizeClass = isLarge ? 1.8 + Math.random() * 1.35 : 0.55 + Math.random() * 0.65;
  const baseSize = (isMixed ? 3 : 2.7) * sizeClass;
  const length = baseSize * (1.6 + intensity * 2.4 + blizzard * 0.8);
  const driftDirection = isBlizzard ? (Math.random() < 0.62 ? 1 : -1) : Math.random() < 0.5 ? 1 : -1;

  glitterParticles.push({
    x: Math.random() * width,
    y: seedFullDepth ? Math.random() * height : -height * (0.04 + Math.random() * (isBlizzard ? 0.42 : 0.22)),
    vx: driftDirection * (0.08 + Math.random() * 0.42 + blizzard * (1.8 + intensity * 2.4)),
    vy: (isBlizzard ? 1.55 : isMixed ? 0.95 : 0.38) * (0.42 + intensity * 0.74) * (0.55 + fallRate * 0.48),
    size: baseSize * glitterBands[bandIndex].weight * (0.72 + intensity * 1.25),
    length,
    hue: glitterHue(bandIndex, intensity),
    alpha: 0.6 + Math.random() * 0.36,
    spin: (Math.random() - 0.5) * (0.022 + intensity * 0.13 + blizzard * 0.22),
    angle: Math.random() * Math.PI * 2,
    life: 1,
    bandIndex,
    form,
    twinkle: Math.random() * Math.PI * 2,
    density,
    sizeClass,
    large: isLarge,
  });
}

function seedGlitterField(width, height, targetCount, bassEnergy = 0.18, trebleEnergy = 0.24) {
  if (glitterParticles.length >= targetCount) return;

  const missing = targetCount - glitterParticles.length;
  const batch = Math.min(missing, glitterWeatherMode() === "blizzard" ? 90 : 70);
  for (let index = 0; index < batch; index += 1) {
    const bandIndex = Math.floor(Math.random() * glitterBands.length);
    const intensity = 0.12 + Math.random() * 0.18 + (bandIndex < 3 ? bassEnergy * 0.18 : trebleEnergy * 0.16);
    spawnGlitterParticle(bandIndex, intensity, width, height, true);
  }
}

function recycleGlitterParticle(particle, width, height, fromTop = true) {
  const bandIndex = Math.floor(Math.random() * glitterBands.length);
  const intensity = 0.12 + Math.random() * 0.26;
  const replacementStart = glitterParticles.length;
  spawnGlitterParticle(bandIndex, intensity, width, height, !fromTop);
  const replacement = glitterParticles.pop();
  glitterParticles.length = replacementStart;
  Object.assign(particle, replacement);
  if (fromTop) {
    particle.y = -particle.length * (1 + Math.random() * 8);
  }
}

function drawGlitterBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  canvasContext.fillStyle = "rgba(3, 5, 9, 0.34)";
  canvasContext.fillRect(0, 0, width, height);

  const hue = glitterHue(4, trebleEnergy);
  const glow = canvasContext.createLinearGradient(0, 0, width, height);
  glow.addColorStop(0, hsla(hue, 72, 18 + trebleEnergy * 16, 0.22));
  glow.addColorStop(0.55, "rgba(5, 8, 13, 0.18)");
  glow.addColorStop(1, hsla(hue - 70, 82, 12 + bassEnergy * 14, 0.26));
  canvasContext.fillStyle = glow;
  canvasContext.fillRect(0, 0, width, height);
}

function drawGlitterParticle(canvasContext, particle, bassEnergy, trebleEnergy) {
  const sparkle = Math.sin(glitterFrame * 0.12 + particle.twinkle) * 0.5 + 0.5;
  const alpha = particle.alpha * particle.life * (0.52 + sparkle * 0.62);
  const hue = particle.hue + sparkle * 28 + trebleEnergy * 42;

  canvasContext.save();
  canvasContext.translate(particle.x, particle.y);
  canvasContext.rotate(particle.angle);

  if (particle.form === "snowfall" || particle.form === "blizzard") {
    canvasContext.strokeStyle = hsla(hue, 82, 82, alpha);
    canvasContext.lineWidth = Math.max(1, particle.size * (particle.large ? 0.13 : 0.18));
    for (let arm = 0; arm < 6; arm += 1) {
      const angle = (Math.PI * 2 * arm) / 6;
      canvasContext.beginPath();
      canvasContext.moveTo(Math.cos(angle) * particle.size * 0.2, Math.sin(angle) * particle.size * 0.2);
      canvasContext.lineTo(Math.cos(angle) * particle.size * 1.6, Math.sin(angle) * particle.size * 1.6);
      canvasContext.stroke();
    }
    if (particle.large) {
      canvasContext.fillStyle = hsla(hue + 28, 96, 88, alpha * 0.36);
      canvasContext.beginPath();
      canvasContext.arc(0, 0, particle.size * 0.42, 0, Math.PI * 2);
      canvasContext.fill();
    }
  } else {
    canvasContext.fillStyle = hsla(hue, 94, 62 + sparkle * 24, alpha);
    canvasContext.beginPath();
    canvasContext.moveTo(0, -particle.size * 1.6);
    canvasContext.lineTo(particle.size * 0.5, -particle.size * 0.3);
    canvasContext.lineTo(particle.size * 1.7, 0);
    canvasContext.lineTo(particle.size * 0.5, particle.size * 0.35);
    canvasContext.lineTo(0, particle.size * 1.7);
    canvasContext.lineTo(-particle.size * 0.5, particle.size * 0.35);
    canvasContext.lineTo(-particle.size * 1.7, 0);
    canvasContext.lineTo(-particle.size * 0.5, -particle.size * 0.3);
    canvasContext.closePath();
    canvasContext.fill();
  }

  canvasContext.restore();
}

function drawGlitterFallFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const mode = glitterWeatherMode();
  const fallRate = fireworkSpeedMultiplier();
  const density = handCountValueNumber() / 6;
  const blizzard = glitterBlizzardForce();

  analyser.getByteFrequencyData(buffer);
  glitterFrame += fallRate * (mode === "blizzard" ? 1.26 : 0.62 + blizzard * 0.25);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.34);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.48);

  drawGlitterBackground(canvasContext, width, height, bassEnergy, trebleEnergy);
  seedGlitterField(width, height, glitterTargetParticleCount(mode), bassEnergy, trebleEnergy);

  glitterBands.forEach((band, bandIndex) => {
    const intensity = pressureResponse(averageBand(buffer, band.start, band.end), 1.42);
    const weatherBoost = mode === "blizzard" ? 1.8 + blizzard * 2.2 : mode === "mixed" ? 1.08 + blizzard * 0.8 : 0.52 + blizzard * 0.35;
    const chance = (0.018 + intensity * 0.13 + trebleEnergy * 0.02 + bassEnergy * 0.015) * density * fallRate * weatherBoost;
    if (glitterParticles.length < glitterTargetParticleCount(mode) + 40 && Math.random() < chance) {
      const count = 1 + Math.floor((density - 0.35) * (intensity + 0.2) * (mode === "blizzard" ? 5.2 : 2));
      for (let index = 0; index < count; index += 1) {
        spawnGlitterParticle(bandIndex, intensity, width, height);
      }
    }
  });

  glitterParticles = glitterParticles.filter((particle) => particle.life > 0.02);
  glitterParticles.forEach((particle) => {
    const band = glitterBands[particle.bandIndex] || glitterBands[0];
    const bandEnergy = pressureResponse(averageBand(buffer, band.start, band.end), 1.34);
    const flutter = Math.sin(glitterFrame * (0.03 + bandEnergy * 0.04) + particle.twinkle);
    const stormPush = blizzard * (mode === "blizzard" ? 3.1 : 1.25);
    particle.x += (particle.vx + flutter * (0.24 + stormPush)) * (0.72 + fallRate * 0.35);
    particle.y += particle.vy * (mode === "blizzard" ? 0.85 + fallRate * 0.42 + bandEnergy * 0.35 : 0.34 + fallRate * 0.32 + bandEnergy * 0.16);
    if (particle.x < -particle.length) particle.x = width + particle.length;
    if (particle.x > width + particle.length) particle.x = -particle.length;
    if (particle.y > height + particle.length + 30) recycleGlitterParticle(particle, width, height);
    particle.vx += Math.sin(glitterFrame * 0.011 + particle.twinkle) * blizzard * 0.075;
    particle.angle += particle.spin * (0.6 + fallRate + bandEnergy);
    particle.life -= mode === "snowfall" ? 0.001 : 0.0018 + bandEnergy * 0.0015;
    drawGlitterParticle(canvasContext, particle, bassEnergy, trebleEnergy);
  });

  const maxParticles = glitterTargetParticleCount(mode) + 80;
  if (glitterParticles.length > maxParticles) {
    glitterParticles.sort((a, b) => b.y - a.y);
    glitterParticles.splice(maxParticles);
  }
}

function butterflyHue(bandIndex, intensity) {
  const theme = themeSelect.value;
  const progress = bandIndex / Math.max(1, butterflyBands.length - 1);
  if (theme === "ice") {
    return 188 + progress * 78 + intensity * 32;
  }
  if (theme === "ember") {
    return 12 + progress * 46 + intensity * 24;
  }
  if (theme === "pressure") {
    return 330 - progress * 245 + intensity * 62;
  }
  if (theme === "spectrum") {
    return 302 - progress * 272 + intensity * 38;
  }
  return 144 + progress * 96 + intensity * 26;
}

function setupButterflies(width, height) {
  const targetCount = Math.max(12, handCountValueNumber() * 8);
  if (butterflies.length === targetCount) {
    return;
  }

  butterflies = Array.from({ length: targetCount }, (_, index) => {
    const bandIndex = index % butterflyBands.length;
    const scale = 0.7 + Math.random() * 0.8;
    return {
      bandIndex,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.min(width, height) * (0.012 + Math.random() * 0.014) * scale,
      phase: Math.random() * Math.PI * 2,
      turn: Math.random() * Math.PI * 2,
      energy: 0,
      direction: Math.random() < 0.5 ? -1 : 1,
    };
  });
}

function drawButterflyBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  canvasContext.fillStyle = "rgba(4, 7, 9, 0.24)";
  canvasContext.fillRect(0, 0, width, height);

  const sky = canvasContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, hsla(butterflyHue(5, trebleEnergy), 72, 18 + trebleEnergy * 16, 0.22));
  sky.addColorStop(0.55, "rgba(6, 18, 16, 0.18)");
  sky.addColorStop(1, hsla(butterflyHue(1, bassEnergy), 68, 12 + bassEnergy * 18, 0.34));
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.strokeStyle = `rgba(103, 220, 178, ${0.035 + trebleEnergy * 0.045})`;
  canvasContext.lineWidth = 1;
  for (let stem = 0; stem < 18; stem += 1) {
    const x = width * ((stem + 0.5) / 18);
    const sway = Math.sin(butterflyFrame * 0.012 + stem) * (8 + bassEnergy * 16);
    canvasContext.beginPath();
    canvasContext.moveTo(x, height);
    canvasContext.quadraticCurveTo(x + sway, height * 0.78, x + sway * 0.4, height * (0.58 + (stem % 4) * 0.04));
    canvasContext.stroke();
  }
}

function drawButterfly(canvasContext, butterfly, intensity, bassEnergy, trebleEnergy) {
  const scale = handSizeMultiplier();
  const flutter = handGraspAmount();
  const hue = butterflyHue(butterfly.bandIndex, intensity);
  const wingBeat = butterflyFrame * (0.12 + intensity * 0.32 + flutter * 0.12) + butterfly.phase;
  const wingOpen = Math.abs(Math.sin(wingBeat));
  const size = butterfly.size * scale * (0.88 + intensity * 0.7);
  const angle = Math.atan2(butterfly.vy, butterfly.vx || 0.001) + Math.PI / 2;
  const alpha = 0.62 + intensity * 0.34;

  canvasContext.save();
  canvasContext.translate(butterfly.x, butterfly.y);
  canvasContext.rotate(angle);

  const glow = canvasContext.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 4.2);
  glow.addColorStop(0, hsla(hue, 90, 62, 0.08 + intensity * 0.18));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(0, 0, size * 4.2, 0, Math.PI * 2);
  canvasContext.fill();

  [-1, 1].forEach((side) => {
    canvasContext.save();
    canvasContext.scale(side, 1);
    canvasContext.rotate(side * (0.18 + wingOpen * 0.65));

    const upperWing = canvasContext.createRadialGradient(size * 0.9, -size * 0.9, 0, size * 0.9, -size * 0.9, size * 2.4);
    upperWing.addColorStop(0, hsla(hue + trebleEnergy * 80, 96, 70, alpha));
    upperWing.addColorStop(0.62, hsla(hue, 86, 42 + intensity * 30, alpha * 0.82));
    upperWing.addColorStop(1, hsla(hue - 36, 86, 22, alpha * 0.28));
    canvasContext.fillStyle = upperWing;
    canvasContext.beginPath();
    canvasContext.ellipse(size * 0.8, -size * 0.58, size * (1.25 + wingOpen * 0.6), size * 0.78, -0.34, 0, Math.PI * 2);
    canvasContext.fill();

    canvasContext.fillStyle = hsla(hue + 38, 88, 52 + intensity * 28, alpha * 0.72);
    canvasContext.beginPath();
    canvasContext.ellipse(size * 0.62, size * 0.52, size * (0.86 + wingOpen * 0.36), size * 0.58, 0.42, 0, Math.PI * 2);
    canvasContext.fill();

    canvasContext.strokeStyle = hsla(hue + 12, 92, 82, alpha * (0.18 + wingOpen * 0.36));
    canvasContext.lineWidth = Math.max(0.8, size * 0.08);
    canvasContext.beginPath();
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(size * (1.45 + wingOpen * 0.42), -size * 0.72);
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(size * (1.08 + wingOpen * 0.26), size * 0.55);
    canvasContext.stroke();
    canvasContext.restore();
  });

  canvasContext.strokeStyle = `rgba(9, 10, 13, ${0.76 + bassEnergy * 0.18})`;
  canvasContext.lineWidth = Math.max(1, size * 0.16);
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 0.9);
  canvasContext.lineTo(0, size * 1.1);
  canvasContext.stroke();

  canvasContext.fillStyle = "rgba(8, 8, 10, 0.86)";
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 1.08, size * 0.22, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(hue + 80, 92, 78, alpha * 0.58);
  canvasContext.lineWidth = Math.max(0.7, size * 0.055);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.08, -size * 1.18);
  canvasContext.quadraticCurveTo(-size * 0.5, -size * 1.62, -size * 0.75, -size * (1.4 + trebleEnergy * 0.5));
  canvasContext.moveTo(size * 0.08, -size * 1.18);
  canvasContext.quadraticCurveTo(size * 0.5, -size * 1.62, size * 0.75, -size * (1.4 + trebleEnergy * 0.5));
  canvasContext.stroke();

  canvasContext.restore();
}

function drawButterflyHostFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const tempo = fireworkSpeedMultiplier();
  const flutter = handGraspAmount();

  analyser.getByteFrequencyData(buffer);
  butterflyFrame += tempo;
  setupButterflies(width, height);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.34);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.46);
  const bandIntensities = butterflyBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.44));

  drawButterflyBackground(canvasContext, width, height, bassEnergy, trebleEnergy);

  butterflies.forEach((butterfly) => {
    const intensity = bandIntensities[butterfly.bandIndex];
    butterfly.energy = butterfly.energy * 0.82 + intensity * 0.18;
    const drift = Math.sin(butterflyFrame * 0.018 + butterfly.turn) * (0.12 + flutter * 0.32);
    const lift = Math.cos(butterflyFrame * 0.014 + butterfly.phase) * (0.08 + trebleEnergy * 0.38);

    butterfly.vx += Math.cos(butterfly.turn) * (0.025 + butterfly.energy * 0.16 + flutter * 0.05) + drift;
    butterfly.vy += Math.sin(butterfly.turn) * (0.018 + butterfly.energy * 0.12) - lift - bassEnergy * 0.025;
    butterfly.turn += (Math.random() - 0.48) * (0.06 + flutter * 0.12 + butterfly.energy * 0.1);
    butterfly.vx *= 0.92;
    butterfly.vy *= 0.92;

    const maxSpeed = 1.5 + butterfly.energy * 4.2 + tempo * 0.8 + flutter * 1.8;
    const speed = Math.hypot(butterfly.vx, butterfly.vy);
    if (speed > maxSpeed) {
      butterfly.vx = (butterfly.vx / speed) * maxSpeed;
      butterfly.vy = (butterfly.vy / speed) * maxSpeed;
    }

    butterfly.x += butterfly.vx * tempo;
    butterfly.y += butterfly.vy * tempo;

    if (butterfly.x < -30) butterfly.x = width + 30;
    if (butterfly.x > width + 30) butterfly.x = -30;
    if (butterfly.y < -30) butterfly.y = height + 30;
    if (butterfly.y > height + 30) butterfly.y = -30;

    drawButterfly(canvasContext, butterfly, butterfly.energy, bassEnergy, trebleEnergy);
  });
}

function knifeHue(bandIndex, intensity) {
  const theme = themeSelect.value;
  const progress = bandIndex / Math.max(1, knifeBands.length - 1);
  if (theme === "ice") return 192 + progress * 62 + intensity * 28;
  if (theme === "ember") return 10 + progress * 44 + intensity * 22;
  if (theme === "pressure") return 338 - progress * 220 + intensity * 58;
  if (theme === "spectrum") return 300 - progress * 250 + intensity * 34;
  return 150 + progress * 82 + intensity * 18;
}

function setupKnifeTargets(width, height) {
  const targetCount = handCountValueNumber();
  if (knifeTargets.length === targetCount) {
    return;
  }

  const columns = Math.ceil(Math.sqrt(targetCount * 1.5));
  const rows = Math.ceil(targetCount / columns);
  knifeTargets = Array.from({ length: targetCount }, (_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const bandIndex = index % knifeBands.length;
    const kind = knifeBands[bandIndex].kind;
    return {
      bandIndex,
      kind,
      x: width * ((col + 0.62) / (columns + 0.2)),
      y: height * (0.22 + ((row + 0.55) / Math.max(1, rows)) * 0.62),
      radius: Math.min(width, height) * (kind === "log" || kind === "drum" ? 0.088 : kind === "tin" || kind === "bell" ? 0.054 : 0.07),
      phase: Math.random() * Math.PI * 2,
      ring: 0,
      wobble: 0,
      embedded: [],
    };
  });
}

function drawKnifeBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const scene = fireworkFormSelect.value;
  canvasContext.fillStyle = scene === "foundry" ? "rgba(8, 7, 8, 0.36)" : "rgba(6, 9, 8, 0.34)";
  canvasContext.fillRect(0, 0, width, height);

  const wall = canvasContext.createLinearGradient(0, 0, 0, height);
  wall.addColorStop(0, scene === "foundry" ? "rgba(34, 31, 34, 0.74)" : "rgba(24, 18, 12, 0.72)");
  wall.addColorStop(0.55, scene === "carnival" ? "rgba(48, 22, 34, 0.5)" : "rgba(20, 15, 12, 0.62)");
  wall.addColorStop(1, "rgba(4, 4, 5, 0.88)");
  canvasContext.fillStyle = wall;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.strokeStyle = scene === "foundry" ? "rgba(190, 202, 210, 0.06)" : "rgba(160, 100, 54, 0.08)";
  canvasContext.lineWidth = 2;
  for (let y = height * 0.16; y < height; y += height * 0.14) {
    canvasContext.beginPath();
    canvasContext.moveTo(0, y + Math.sin(knifeFrame * 0.01 + y) * bassEnergy * 8);
    canvasContext.lineTo(width, y);
    canvasContext.stroke();
  }

  for (let light = 0; light < 4; light += 1) {
    const hue = knifeHue(light + 2, trebleEnergy);
    const x = width * (0.16 + light * 0.24 + Math.sin(knifeFrame * 0.012 + light) * 0.03);
    const glow = canvasContext.createRadialGradient(x, height * 0.12, 0, x, height * 0.12, width * 0.22);
    glow.addColorStop(0, hsla(hue, 92, 62, 0.08 + trebleEnergy * 0.14));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.fillRect(0, 0, width, height);
  }
}

function drawKnifeTarget(canvasContext, target, intensity, bassEnergy, trebleEnergy) {
  const scale = handSizeMultiplier();
  const hue = knifeHue(target.bandIndex, intensity);
  const radius = target.radius * scale * (1 + target.wobble * 0.18 + intensity * 0.08);
  const shakeX = Math.sin(knifeFrame * 0.35 + target.phase) * target.wobble * radius * 0.18;
  const shakeY = Math.cos(knifeFrame * 0.31 + target.phase) * target.wobble * radius * 0.12;

  target.ring *= 0.93;
  target.wobble *= 0.88;

  canvasContext.save();
  canvasContext.translate(target.x + shakeX, target.y + shakeY);

  if (target.kind === "tin" || target.kind === "bell") {
    const metal = canvasContext.createRadialGradient(-radius * 0.3, -radius * 0.38, radius * 0.08, 0, 0, radius);
    metal.addColorStop(0, hsla(hue + 30, 34, 86, 0.9));
    metal.addColorStop(0.55, hsla(hue, 38, 46 + trebleEnergy * 22, 0.82));
    metal.addColorStop(1, hsla(hue - 40, 34, 22, 0.72));
    canvasContext.fillStyle = metal;
    canvasContext.beginPath();
    canvasContext.arc(0, 0, radius, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.strokeStyle = hsla(hue + 70, 84, 78, 0.35 + target.ring * 0.48);
    canvasContext.lineWidth = 2 + target.ring * 5;
    canvasContext.stroke();
  } else {
    const wood = canvasContext.createRadialGradient(0, 0, radius * 0.15, 0, 0, radius);
    wood.addColorStop(0, hsla(hue + 22, 62, 44 + intensity * 18, 0.92));
    wood.addColorStop(0.72, hsla(hue - 18, 52, 24, 0.86));
    wood.addColorStop(1, "rgba(22, 10, 6, 0.78)");
    canvasContext.fillStyle = wood;
    canvasContext.beginPath();
    canvasContext.arc(0, 0, radius, 0, Math.PI * 2);
    canvasContext.fill();

    canvasContext.strokeStyle = hsla(hue + 34, 76, 68, 0.22 + target.ring * 0.42);
    for (let ring = 0.34; ring <= 1; ring += 0.22) {
      canvasContext.lineWidth = 1.5 + target.ring * 2.2;
      canvasContext.beginPath();
      canvasContext.arc(0, 0, radius * ring * (1 + target.ring * 0.18), 0, Math.PI * 2);
      canvasContext.stroke();
    }
  }

  target.embedded = target.embedded.filter((knife) => knife.life > 0.02);
  target.embedded.forEach((knife) => {
    knife.life *= 0.992;
    drawKnife(canvasContext, {
      x: Math.cos(knife.angle) * radius * knife.distance,
      y: Math.sin(knife.angle) * radius * knife.distance,
      angle: knife.angle + Math.PI / 2,
      length: knife.length,
      hue: knife.hue,
      alpha: knife.life,
      embedded: true,
    });
  });

  if (target.ring > 0.02) {
    canvasContext.strokeStyle = hsla(hue + 100, 92, 72, target.ring * 0.36);
    canvasContext.lineWidth = 1 + target.ring * 4;
    canvasContext.beginPath();
    canvasContext.arc(0, 0, radius * (1.08 + (1 - target.ring) * 0.95), 0, Math.PI * 2);
    canvasContext.stroke();
  }

  canvasContext.restore();
}

function drawKnife(canvasContext, knife) {
  canvasContext.save();
  canvasContext.translate(knife.x, knife.y);
  canvasContext.rotate(knife.angle);
  canvasContext.globalAlpha = knife.alpha ?? 1;

  const length = knife.length;
  const blade = canvasContext.createLinearGradient(0, -length * 0.52, 0, length * 0.18);
  blade.addColorStop(0, "rgba(250, 252, 246, 0.95)");
  blade.addColorStop(0.55, hsla(knife.hue, 30, 70, 0.86));
  blade.addColorStop(1, "rgba(78, 83, 88, 0.86)");
  canvasContext.fillStyle = blade;
  canvasContext.beginPath();
  canvasContext.moveTo(0, -length * 0.58);
  canvasContext.lineTo(length * 0.13, length * 0.06);
  canvasContext.lineTo(0, length * 0.28);
  canvasContext.lineTo(-length * 0.13, length * 0.06);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(18, 12, 8, 0.94)";
  canvasContext.fillRect(-length * 0.08, length * 0.22, length * 0.16, length * 0.42);
  canvasContext.strokeStyle = hsla(knife.hue + 36, 82, 70, 0.42);
  canvasContext.lineWidth = Math.max(1, length * 0.025);
  canvasContext.strokeRect(-length * 0.08, length * 0.22, length * 0.16, length * 0.42);

  canvasContext.restore();
}

function spawnKnife(bandIndex, intensity, width, height) {
  if (!knifeTargets.length) return;
  const force = handGraspAmount();
  const scale = handSizeMultiplier();
  const targetPool = knifeTargets.filter((target) => target.bandIndex === bandIndex);
  const target = targetPool.length ? targetPool[Math.floor(Math.random() * targetPool.length)] : knifeTargets[Math.floor(Math.random() * knifeTargets.length)];
  const fromLeft = Math.random() < 0.5;
  const startY = height * (0.12 + Math.random() * 0.74);

  thrownKnives.push({
    x: fromLeft ? -width * 0.08 : width * 1.08,
    y: startY,
    vx: (target.x - (fromLeft ? -width * 0.08 : width * 1.08)) * (0.018 + intensity * 0.018 + force * 0.012),
    vy: (target.y - startY) * (0.018 + intensity * 0.015),
    target,
    angle: fromLeft ? Math.PI / 2 : -Math.PI / 2,
    spin: (fromLeft ? 1 : -1) * (0.24 + intensity * 0.52 + force * 0.24),
    length: Math.min(width, height) * (0.055 + intensity * 0.035) * scale,
    hue: knifeHue(bandIndex, intensity),
    alpha: 1,
    bandIndex,
  });
}

function drawKnifeThunkFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const throwRate = fireworkSpeedMultiplier();
  const force = handGraspAmount();

  analyser.getByteFrequencyData(buffer);
  knifeFrame += throwRate;
  setupKnifeTargets(width, height);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.36);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.42);
  drawKnifeBackground(canvasContext, width, height, bassEnergy, trebleEnergy);

  const bandIntensities = knifeBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.42));
  knifeTargets.forEach((target) => {
    drawKnifeTarget(canvasContext, target, bandIntensities[target.bandIndex], bassEnergy, trebleEnergy);
  });

  bandIntensities.forEach((intensity, bandIndex) => {
    const chance = (0.018 + intensity * 0.12 + bassEnergy * 0.018 + force * 0.018) * throwRate;
    if (Math.random() < chance) {
      spawnKnife(bandIndex, intensity, width, height);
    }
  });

  thrownKnives = thrownKnives.filter((knife) => knife.alpha > 0.02 && knife.x > -width * 0.25 && knife.x < width * 1.25 && knife.y > -height * 0.3 && knife.y < height * 1.3);
  thrownKnives.forEach((knife) => {
    const dx = knife.target.x - knife.x;
    const dy = knife.target.y - knife.y;
    knife.vx += dx * (0.0008 + force * 0.0005);
    knife.vy += dy * (0.0008 + force * 0.0004);
    knife.x += knife.vx * throwRate;
    knife.y += knife.vy * throwRate;
    knife.angle += knife.spin * throwRate;
    knife.alpha *= 0.998;
    drawKnife(canvasContext, knife);

    if (Math.hypot(dx, dy) < knife.target.radius * handSizeMultiplier() * 0.62) {
      knife.target.ring = Math.min(1, 0.42 + bandIntensities[knife.bandIndex] * 0.8 + force * 0.35);
      knife.target.wobble = Math.min(1, 0.38 + bandIntensities[knife.bandIndex] * 0.7 + force * 0.35);
      knife.target.embedded.push({
        angle: Math.atan2(knife.y - knife.target.y, knife.x - knife.target.x),
        distance: Math.min(0.82, Math.random() * 0.4 + 0.28),
        length: knife.length,
        hue: knife.hue,
        life: 1,
      });
      knife.alpha = 0;
    }
  });

  if (thrownKnives.length > 160) {
    thrownKnives.splice(0, thrownKnives.length - 160);
  }
}

function goddessHue(index, intensity) {
  const theme = themeSelect.value;
  const progress = index / Math.max(1, goddessBands.length - 1);
  if (theme === "ice") return 188 + progress * 66 + intensity * 28;
  if (theme === "ember") return 8 + progress * 48 + intensity * 28;
  if (theme === "pressure") return 330 - progress * 230 + intensity * 64;
  if (theme === "spectrum") return 304 - progress * 272 + intensity * 44;
  return 154 + progress * 112 + intensity * 28;
}

function drawGoddessChamber(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const mode = fireworkFormSelect.value;
  canvasContext.fillStyle = "rgba(5, 3, 10, 0.3)";
  canvasContext.fillRect(0, 0, width, height);

  const aura = canvasContext.createRadialGradient(width * 0.5, height * 0.34, 0, width * 0.5, height * 0.34, width * 0.54);
  aura.addColorStop(0, hsla(goddessHue(4, trebleEnergy), 96, 54, 0.22 + trebleEnergy * 0.18));
  aura.addColorStop(0.45, hsla(goddessHue(2, bassEnergy), 86, 26, 0.2));
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = aura;
  canvasContext.fillRect(0, 0, width, height);

  const veil = canvasContext.createLinearGradient(0, 0, width, height);
  veil.addColorStop(0, "rgba(12, 6, 22, 0.34)");
  veil.addColorStop(0.5, "rgba(36, 10, 42, 0.18)");
  veil.addColorStop(1, "rgba(4, 3, 9, 0.42)");
  canvasContext.fillStyle = veil;
  canvasContext.fillRect(0, 0, width, height);

  if (mode === "haka") {
    canvasContext.strokeStyle = `rgba(90, 255, 214, ${0.14 + bassEnergy * 0.24})`;
    canvasContext.lineWidth = Math.max(2, height * 0.008);
    for (let ring = 0; ring < 4; ring += 1) {
      const spread = (ring + 1) * (0.12 + bassEnergy * 0.08);
      canvasContext.beginPath();
      canvasContext.ellipse(width * 0.5, height * (0.72 + ring * 0.02), width * spread, height * 0.035, 0, 0, Math.PI * 2);
      canvasContext.stroke();
    }
  }

  if (mode === "seduction") {
    const shimmer = canvasContext.createLinearGradient(0, height * 0.12, width, height * 0.8);
    shimmer.addColorStop(0, hsla(goddessHue(5, trebleEnergy), 100, 72, 0));
    shimmer.addColorStop(0.52, hsla(goddessHue(3, trebleEnergy), 100, 68, 0.08 + trebleEnergy * 0.16));
    shimmer.addColorStop(1, hsla(goddessHue(1, bassEnergy), 96, 34, 0));
    canvasContext.fillStyle = shimmer;
    canvasContext.fillRect(0, 0, width, height);
  }

  if (mode === "bloodruby") {
    canvasContext.fillStyle = `rgba(130, 0, 32, ${0.06 + bassEnergy * 0.16})`;
    canvasContext.fillRect(0, 0, width, height);
    canvasContext.strokeStyle = `rgba(255, 31, 84, ${0.12 + bassEnergy * 0.26})`;
    canvasContext.lineWidth = Math.max(2, width * 0.003);
    for (let pulse = 0; pulse < 5; pulse += 1) {
      const x = width * (0.12 + pulse * 0.19);
      canvasContext.beginPath();
      canvasContext.moveTo(x, height * 0.16);
      canvasContext.bezierCurveTo(
        x + Math.sin(goddessFrame * 0.02 + pulse) * width * 0.04,
        height * 0.35,
        x - Math.cos(goddessFrame * 0.015 + pulse) * width * 0.05,
        height * 0.58,
        x + Math.sin(goddessFrame * 0.03 + pulse) * width * 0.03,
        height * 0.92,
      );
      canvasContext.stroke();
    }
  }
}

function drawGoddessFigure(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const scale = handSizeMultiplier();
  const mode = fireworkFormSelect.value;
  const hue = goddessHue(3, midsEnergy);
  const cx = width * 0.5;
  const cy = height * 0.46;
  const size = Math.min(width, height) * 0.22 * scale * (0.85 + bassEnergy * 0.18);
  const sway = Math.sin(goddessFrame * 0.025) * size * 0.08;
  const stomp = mode === "haka" ? Math.abs(Math.sin(goddessFrame * 0.12)) * bassEnergy : 0;
  const seduce = mode === "seduction" ? Math.sin(goddessFrame * 0.04) * (0.18 + midsEnergy * 0.3) : 0;
  const ruby = mode === "bloodruby" ? 1 : 0.45;

  canvasContext.save();
  canvasContext.translate(cx + sway, cy + stomp * size * 0.18);

  const halo = canvasContext.createRadialGradient(0, -size * 0.52, size * 0.1, 0, -size * 0.52, size * 1.45);
  halo.addColorStop(0, hsla(hue + 50, 100, 72, 0.28 + trebleEnergy * 0.22));
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = halo;
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.45, size * 1.45, 0, Math.PI * 2);
  canvasContext.fill();

  if (mode === "bloodruby" || bassEnergy > 0.38) {
    canvasContext.strokeStyle = `rgba(190, 0, 34, ${0.18 + bassEnergy * 0.38})`;
    canvasContext.lineWidth = Math.max(2, size * 0.035);
    for (let mark = 0; mark < 7; mark += 1) {
      const angle = -Math.PI * 0.88 + mark * 0.29;
      canvasContext.beginPath();
      canvasContext.moveTo(Math.cos(angle) * size * 1.05, Math.sin(angle) * size * 0.8);
      canvasContext.quadraticCurveTo(
        Math.cos(angle) * size * (1.25 + bassEnergy * 0.4),
        Math.sin(angle) * size * (1.0 + bassEnergy * 0.4),
        Math.cos(angle) * size * (1.62 + bassEnergy * 0.65),
        Math.sin(angle) * size * (1.28 + bassEnergy * 0.45),
      );
      canvasContext.stroke();
    }
  }

  canvasContext.save();
  canvasContext.translate(-size * 0.42, size * 0.02);
  canvasContext.rotate(-0.08 + seduce * 0.18);
  const gown = canvasContext.createLinearGradient(0, -size * 0.25, 0, size * 1.25);
  gown.addColorStop(0, hsla(hue + 18, 96, 60 + trebleEnergy * 12, 0.86));
  gown.addColorStop(0.55, hsla(hue - ruby * 36, 88, 34 + midsEnergy * 20, 0.78));
  gown.addColorStop(1, hsla(hue - 90, 92, 18, 0.62));
  canvasContext.fillStyle = gown;
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.28, -size * 0.08);
  canvasContext.bezierCurveTo(-size * 0.72, size * 0.32, -size * 0.86, size * 0.92, -size * 0.52, size * 1.22);
  canvasContext.lineTo(size * 0.52, size * 1.22);
  canvasContext.bezierCurveTo(size * 0.86, size * 0.92, size * 0.72, size * 0.32, size * 0.28, -size * 0.08);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(hue + 70, 100, 76, 0.52 + trebleEnergy * 0.24);
  canvasContext.lineWidth = Math.max(2, size * 0.055);
  const armLift = Math.sin(goddessFrame * 0.045) * size * 0.08 + trebleEnergy * size * 0.2;
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.2, size * 0.02);
  canvasContext.quadraticCurveTo(-size * 0.75, size * 0.12, -size * 0.95, -size * 0.15 - armLift);
  canvasContext.moveTo(size * 0.2, size * 0.02);
  canvasContext.quadraticCurveTo(size * 0.72, -size * 0.05, size * 0.86, -size * 0.38 - armLift);
  canvasContext.stroke();

  canvasContext.fillStyle = "rgba(238, 193, 162, 0.96)";
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.45, size * 0.28, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = hsla(hue - 40, 82, 22, 0.92);
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.58, size * 0.34, Math.PI * 0.92, Math.PI * 2.08);
  canvasContext.fill();

  canvasContext.fillStyle = hsla(336 + trebleEnergy * 30, 96, 62, 0.9);
  canvasContext.beginPath();
  canvasContext.ellipse(size * 0.08, -size * 0.34, size * 0.11, size * 0.045, -0.08, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();

  canvasContext.save();
  canvasContext.translate(size * 0.44, size * 0.06 + stomp * size * 0.12);
  canvasContext.rotate(0.08 - seduce * 0.12);

  const muscleHue = hue + 150 + midsEnergy * 60;
  canvasContext.strokeStyle = hsla(muscleHue, 96, 62, 0.86);
  canvasContext.lineWidth = Math.max(2, size * 0.085);
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 0.04);
  canvasContext.lineTo(0, size * 0.86);
  canvasContext.moveTo(-size * 0.42, size * 0.08);
  canvasContext.quadraticCurveTo(-size * (0.9 + stomp * 0.45), -size * (0.08 + stomp * 0.35), -size * (1.06 + stomp * 0.4), size * 0.32);
  canvasContext.moveTo(size * 0.42, size * 0.08);
  canvasContext.quadraticCurveTo(size * (0.9 + stomp * 0.45), -size * (0.08 + stomp * 0.35), size * (1.06 + stomp * 0.4), size * 0.32);
  canvasContext.stroke();

  canvasContext.fillStyle = hsla(muscleHue + 40, 100, 38 + bassEnergy * 20, 0.9);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.5, size * 0.1);
  canvasContext.lineTo(size * 0.5, size * 0.1);
  canvasContext.lineTo(size * 0.34, size * 0.92);
  canvasContext.lineTo(-size * 0.34, size * 0.92);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.strokeStyle = `rgba(255, 235, 230, ${0.32 + midsEnergy * 0.36})`;
  canvasContext.lineWidth = Math.max(1, size * 0.026);
  [-0.18, 0.18].forEach((x) => {
    canvasContext.beginPath();
    canvasContext.arc(x * size, size * 0.38, size * (0.18 + midsEnergy * 0.08), Math.PI * 0.12, Math.PI * 0.88);
    canvasContext.stroke();
  });

  canvasContext.fillStyle = "rgba(228, 176, 136, 0.96)";
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.36, size * 0.25, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(8, 7, 12, 0.88)";
  canvasContext.beginPath();
  canvasContext.arc(-size * 0.07, -size * 0.39, size * 0.018, 0, Math.PI * 2);
  canvasContext.arc(size * 0.07, -size * 0.39, size * 0.018, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.strokeStyle = hsla(350, 100, 52, 0.8);
  canvasContext.lineWidth = Math.max(1, size * 0.025);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.08, -size * 0.27);
  canvasContext.lineTo(size * 0.08, -size * 0.27);
  canvasContext.stroke();

  if (mode === "haka") {
    canvasContext.strokeStyle = `rgba(250, 250, 235, ${0.42 + bassEnergy * 0.42})`;
    canvasContext.lineWidth = Math.max(1, size * 0.035);
    for (let stripe = 0; stripe < 4; stripe += 1) {
      canvasContext.beginPath();
      canvasContext.moveTo(-size * 0.38, size * (0.2 + stripe * 0.13));
      canvasContext.lineTo(size * 0.38, size * (0.12 + stripe * 0.13));
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
  canvasContext.restore();
}

function spawnGoddessKiss(bandIndex, intensity, width, height) {
  const rate = fireworkSpeedMultiplier();
  const pout = handGraspAmount();
  const scale = handSizeMultiplier();
  const mode = fireworkFormSelect.value;
  const hakaKick = mode === "haka" ? 0.6 : 0;
  const rubyBoost = mode === "bloodruby" ? 1.3 : 1;
  goddessKisses.push({
    x: width * (0.5 + (Math.random() - 0.5) * (mode === "haka" ? 0.22 : 0.12)),
    y: height * (0.32 + (Math.random() - 0.5) * 0.1),
    vx: (Math.random() - 0.5) * (0.8 + pout * 2.2 + hakaKick),
    vy: -0.45 - intensity * (1.3 + hakaKick) + (Math.random() - 0.5) * 0.7,
    z: 0.2 + Math.random() * 0.28,
    vz: (0.012 + intensity * 0.03 + rate * 0.004) * (0.75 + pout * 0.8 + hakaKick * 0.25),
    size: Math.min(width, height) * (0.024 + intensity * 0.032) * scale * rubyBoost,
    hue: mode === "bloodruby" ? 348 + intensity * 22 : goddessHue(bandIndex, intensity),
    alpha: 1,
    life: 1,
    bandIndex,
    spin: (Math.random() - 0.5) * (0.035 + pout * 0.08),
    angle: Math.random() * Math.PI * 2,
    pout,
  });
}

function drawKissGlyph(canvasContext, kiss, bassEnergy, trebleEnergy) {
  const mode = fireworkFormSelect.value;
  const phase = Math.min(1, kiss.z);
  const poutAmount = Math.max(0, 1 - Math.abs(phase - 0.62) * 3.2) * (0.4 + kiss.pout * 1.1 + (mode === "seduction" ? 0.35 : 0));
  const size = kiss.size * (0.8 + phase * 2.8);
  const hue = mode === "bloodruby" ? 350 + bassEnergy * 34 : kiss.hue + trebleEnergy * 58 + phase * 22;
  const alpha = kiss.alpha * kiss.life * (1 - Math.max(0, phase - 0.82) * 4.2);

  canvasContext.save();
  canvasContext.translate(kiss.x, kiss.y);
  canvasContext.rotate(kiss.angle);
  canvasContext.globalAlpha = Math.max(0, alpha);
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";

  if (poutAmount > 0.05) {
    canvasContext.fillStyle = hsla(hue, 100, 58 + poutAmount * 18, 0.86);
    canvasContext.beginPath();
    canvasContext.ellipse(-size * 0.34, 0, size * (0.46 + poutAmount * 0.24), size * (0.18 + poutAmount * 0.12), -0.2, 0, Math.PI * 2);
    canvasContext.ellipse(size * 0.34, 0, size * (0.46 + poutAmount * 0.24), size * (0.18 + poutAmount * 0.12), 0.2, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.strokeStyle = mode === "bloodruby" ? `rgba(110, 0, 20, ${0.42 + bassEnergy * 0.32})` : hsla(hue + 24, 100, 78, 0.55);
    canvasContext.lineWidth = Math.max(1, size * 0.055);
    canvasContext.beginPath();
    canvasContext.moveTo(-size * 0.66, 0);
    canvasContext.quadraticCurveTo(0, size * (0.22 + poutAmount * 0.1), size * 0.66, 0);
    canvasContext.stroke();
  } else {
    canvasContext.strokeStyle = hsla(hue, 100, 66 + phase * 16, 0.92);
    canvasContext.lineWidth = Math.max(2, size * 0.16);
    canvasContext.beginPath();
    canvasContext.moveTo(-size * 0.5, -size * 0.5);
    canvasContext.lineTo(size * 0.5, size * 0.5);
    canvasContext.moveTo(size * 0.5, -size * 0.5);
    canvasContext.lineTo(-size * 0.5, size * 0.5);
    canvasContext.stroke();
  }
  canvasContext.restore();
}

function drawGoddessKissesFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const rate = fireworkSpeedMultiplier();
  const density = handCountValueNumber() / 6;
  const mode = fireworkFormSelect.value;

  analyser.getByteFrequencyData(buffer);
  goddessFrame += rate;

  const pulse = 0.5 + Math.sin(goddessFrame * 0.035) * 0.5;
  const flicker = 0.5 + Math.sin(goddessFrame * 0.071 + 1.6) * 0.5;
  const rawBassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.3);
  const rawMidsEnergy = pressureResponse(averageBand(buffer, 12, 52), 1.36);
  const rawTrebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.46);
  const bassEnergy = Math.max(rawBassEnergy, 0.1 + pulse * 0.12);
  const midsEnergy = Math.max(rawMidsEnergy, 0.12 + flicker * 0.1);
  const trebleEnergy = Math.max(rawTrebleEnergy, 0.12 + (1 - pulse) * 0.12);
  drawGoddessChamber(canvasContext, width, height, bassEnergy, trebleEnergy);
  drawGoddessFigure(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);

  goddessBands.forEach((band, bandIndex) => {
    const intensity = pressureResponse(averageBand(buffer, band.start, band.end), 1.44);
    const modeBoost = mode === "haka" && bandIndex < 2 ? 1.55 : mode === "seduction" && bandIndex >= 2 ? 1.25 : mode === "bloodruby" ? 1.35 : 1;
    const chance = (0.018 + intensity * 0.12 + trebleEnergy * 0.018 + bassEnergy * (mode === "haka" ? 0.02 : 0)) * rate * density * modeBoost;
    if (Math.random() < chance) {
      const count = 1 + Math.floor((density - 0.45) * intensity * 2);
      for (let index = 0; index < count; index += 1) spawnGoddessKiss(bandIndex, intensity, width, height);
    }
  });

  if (goddessKisses.length < 8 + density * 5 && Math.floor(goddessFrame) % Math.max(4, Math.round(16 / rate)) === 0) {
    const bandIndex = Math.floor(goddessFrame / 7) % goddessBands.length;
    spawnGoddessKiss(bandIndex, 0.2 + pulse * 0.18, width, height);
  }

  goddessKisses = goddessKisses.filter((kiss) => kiss.life > 0.02 && kiss.z < 1.08);
  goddessKisses.forEach((kiss) => {
    const band = goddessBands[kiss.bandIndex] || goddessBands[0];
    const bandEnergy = pressureResponse(averageBand(buffer, band.start, band.end), 1.35);
    kiss.z += kiss.vz * (0.8 + bandEnergy * 0.5);
    kiss.x += kiss.vx * (0.7 + kiss.z * 1.5);
    kiss.y += kiss.vy * (0.7 + kiss.z) + Math.sin(goddessFrame * 0.03 + kiss.angle) * bandEnergy * 1.4;
    kiss.angle += kiss.spin + bandEnergy * 0.018;
    kiss.life -= 0.003 + Math.max(0, kiss.z - 0.72) * 0.012;
    drawKissGlyph(canvasContext, kiss, bassEnergy, trebleEnergy);
  });

  const maxKisses = Math.round(70 + density * 60);
  if (goddessKisses.length > maxKisses) goddessKisses.splice(0, goddessKisses.length - maxKisses);
}

function plantHue(index, intensity) {
  const theme = themeSelect.value;
  const progress = index / Math.max(1, gardenBands.length - 1);
  if (theme === "ice") return 172 + progress * 74 + intensity * 34;
  if (theme === "ember") return 18 + progress * 42 + intensity * 30;
  if (theme === "pressure") return 318 - progress * 220 + intensity * 70;
  if (theme === "spectrum") return 138 + progress * 250 + intensity * 52;
  return 118 + progress * 82 + intensity * 32;
}

function setupGardenVines(width, height) {
  const targetCount = handCountValueNumber();
  if (gardenVines.length === targetCount) return;

  gardenVines = Array.from({ length: targetCount }, (_, index) => {
    const bandIndex = index % gardenBands.length;
    const band = gardenBands[bandIndex];
    const spread = targetCount === 1 ? 0.5 : index / (targetCount - 1);
    const rootX = band.root === "left" ? width * 0.02 : band.root === "right" ? width * 0.98 : width * (0.08 + spread * 0.84);
    const rootY = band.root === "floor" ? height * (0.96 - Math.random() * 0.05) : height * (0.18 + (spread * 0.68) % 0.68);
    const angle = band.root === "left" ? -0.12 : band.root === "right" ? Math.PI + 0.12 : -Math.PI / 2 + (spread - 0.5) * 0.55;

    return {
      bandIndex,
      rootX,
      rootY,
      baseAngle: angle,
      phase: Math.random() * Math.PI * 2,
      growth: 0.24 + Math.random() * 0.26,
      curl: (Math.random() - 0.5) * 1.2,
      leafSeed: Math.random() * 100,
      bloom: 0,
    };
  });
}

function drawGardenBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const deep = canvasContext.createLinearGradient(0, 0, width, height);
  deep.addColorStop(0, "rgba(4, 8, 8, 0.34)");
  deep.addColorStop(0.52, hsla(152 + trebleEnergy * 45, 76, 13 + trebleEnergy * 7, 0.34));
  deep.addColorStop(1, hsla(90 + bassEnergy * 36, 80, 7 + bassEnergy * 8, 0.52));
  canvasContext.fillStyle = deep;
  canvasContext.fillRect(0, 0, width, height);

  const glow = canvasContext.createRadialGradient(width * 0.5, height * 0.78, 0, width * 0.5, height * 0.78, width * 0.72);
  glow.addColorStop(0, hsla(plantHue(2, bassEnergy), 84, 28, 0.12 + bassEnergy * 0.12));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.fillRect(0, 0, width, height);
}

function drawGardenFlower(canvasContext, x, y, radius, hue, open, spin) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(spin);
  canvasContext.globalAlpha = Math.max(0, Math.min(1, open));

  for (let petal = 0; petal < 7; petal += 1) {
    const angle = (petal / 7) * Math.PI * 2;
    canvasContext.save();
    canvasContext.rotate(angle);
    canvasContext.fillStyle = hsla(hue + petal * 12, 92, 56 + open * 20, 0.72);
    canvasContext.beginPath();
    canvasContext.ellipse(radius * (0.3 + open * 0.62), 0, radius * (0.22 + open * 0.24), radius * 0.12, 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();
  }

  canvasContext.fillStyle = hsla(hue + 70, 94, 68, 0.82);
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius * (0.16 + open * 0.1), 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawGardenVine(canvasContext, vine, intensity, bassEnergy, trebleEnergy, width, height) {
  const range = handSizeMultiplier();
  const bloomControl = handGraspAmount();
  const hue = plantHue(vine.bandIndex, intensity);
  const maxLength = Math.min(width, height) * (0.55 + range * 0.82);
  const beat = gardenFrame * (0.026 + vine.bandIndex * 0.004) + vine.phase;
  const length = maxLength * vine.growth;
  const segments = 11;
  const points = [];

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const curl = Math.sin(beat + t * 5.4 + vine.curl) * (0.18 + intensity * 0.28 + bloomControl * 0.16);
    const climb = length * t;
    const angle = vine.baseAngle + curl + (t - 0.5) * vine.curl * 0.22;
    const lateral = Math.sin(beat * 0.7 + t * 8) * length * 0.09 * (0.35 + trebleEnergy);
    points.push({
      x: vine.rootX + Math.cos(angle) * climb + Math.cos(angle + Math.PI / 2) * lateral,
      y: vine.rootY + Math.sin(angle) * climb + Math.sin(angle + Math.PI / 2) * lateral,
      t,
    });
  }

  canvasContext.save();
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";
  canvasContext.strokeStyle = hsla(hue, 70, 26 + intensity * 28, 0.8);
  canvasContext.lineWidth = Math.max(2, Math.min(width, height) * 0.008 * range * (0.8 + intensity));
  canvasContext.beginPath();
  points.forEach((point, index) => {
    if (index === 0) canvasContext.moveTo(point.x, point.y);
    else {
      const previous = points[index - 1];
      canvasContext.quadraticCurveTo(previous.x, previous.y, (previous.x + point.x) / 2, (previous.y + point.y) / 2);
    }
  });
  canvasContext.stroke();

  points.slice(2).forEach((point, index) => {
    if (index % 2 !== 0) return;
    const side = index % 4 === 0 ? 1 : -1;
    const leafAngle = vine.baseAngle + side * (0.9 + Math.sin(beat + index) * 0.35);
    const leafSize = Math.min(width, height) * (0.018 + intensity * 0.02) * range * (0.6 + point.t);
    canvasContext.save();
    canvasContext.translate(point.x, point.y);
    canvasContext.rotate(leafAngle);
    canvasContext.fillStyle = hsla(hue + 18 + point.t * 40, 74, 34 + intensity * 26, 0.62 + point.t * 0.24);
    canvasContext.beginPath();
    canvasContext.ellipse(leafSize * 0.75, 0, leafSize, leafSize * 0.36, 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();
  });

  const tip = points[points.length - 1];
  const flowerOpen = Math.max(0, Math.min(1, vine.bloom * (0.5 + bloomControl * 1.5)));
  if (flowerOpen > 0.04) {
    drawGardenFlower(
      canvasContext,
      tip.x,
      tip.y,
      Math.min(width, height) * (0.018 + intensity * 0.034) * range,
      hue + 90 + trebleEnergy * 80,
      flowerOpen,
      beat * 0.35,
    );
  }

  canvasContext.strokeStyle = hsla(hue + 60, 84, 58, 0.22 + trebleEnergy * 0.34);
  canvasContext.lineWidth = Math.max(1, Math.min(width, height) * 0.0025);
  for (let tendril = 0; tendril < 2; tendril += 1) {
    const anchor = points[Math.max(2, Math.min(points.length - 2, 4 + tendril * 3))];
    const twist = beat + tendril * 2.4;
    canvasContext.beginPath();
    canvasContext.moveTo(anchor.x, anchor.y);
    canvasContext.bezierCurveTo(
      anchor.x + Math.cos(twist) * length * 0.05,
      anchor.y + Math.sin(twist) * length * 0.05,
      anchor.x + Math.cos(twist + 1.7) * length * 0.09,
      anchor.y + Math.sin(twist + 1.7) * length * 0.09,
      anchor.x + Math.cos(twist + 3.0) * length * 0.12,
      anchor.y + Math.sin(twist + 3.0) * length * 0.12,
    );
    canvasContext.stroke();
  }

  canvasContext.restore();
}

function drawClimbingGardenFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const tempo = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  gardenFrame += tempo;
  setupGardenVines(width, height);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.42);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.48);
  const bandIntensities = gardenBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.44));

  drawGardenBackground(canvasContext, width, height, bassEnergy, trebleEnergy);

  gardenVines.forEach((vine) => {
    const intensity = bandIntensities[vine.bandIndex];
    const breathing = 0.5 + Math.sin(gardenFrame * 0.018 + vine.phase) * 0.5;
    const targetGrowth = Math.max(0.12, Math.min(1.08, 0.2 + intensity * 0.78 + bassEnergy * 0.14 + breathing * 0.16));
    const retreatRate = targetGrowth < vine.growth ? 0.035 + tempo * 0.006 : 0.02 + tempo * 0.005;
    vine.growth += (targetGrowth - vine.growth) * retreatRate;
    vine.bloom += (Math.max(0, intensity - 0.18) - vine.bloom) * (0.05 + handGraspAmount() * 0.05);
    drawGardenVine(canvasContext, vine, intensity, bassEnergy, trebleEnergy, width, height);
  });
}

function tigerPalette(intensity) {
  const theme = themeSelect.value;
  if (theme === "ice") return { tiger: 196, stripe: 226, blood: 342, coat: 210 };
  if (theme === "ember") return { tiger: 30 + intensity * 16, stripe: 8, blood: 358, coat: 14 };
  if (theme === "pressure") return { tiger: 48, stripe: 324, blood: 330 + intensity * 24, coat: 350 };
  if (theme === "spectrum") return { tiger: 42 + intensity * 80, stripe: 250, blood: 350, coat: 8 };
  return { tiger: 35, stripe: 20, blood: 352, coat: 3 };
}

function drawTigerBackdrop(canvasContext, width, height, bassEnergy, roar) {
  const dusk = canvasContext.createLinearGradient(0, 0, 0, height);
  dusk.addColorStop(0, "rgba(10, 10, 14, 0.92)");
  dusk.addColorStop(0.5, `rgba(56, 30, 12, ${0.35 + bassEnergy * 0.25})`);
  dusk.addColorStop(1, "rgba(7, 5, 4, 0.96)");
  canvasContext.fillStyle = dusk;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.fillStyle = `rgba(242, 180, 65, ${0.06 + bassEnergy * 0.1 + roar * 0.12})`;
  for (let index = 0; index < 7; index += 1) {
    const x = width * (0.08 + index * 0.15 + Math.sin(tigerFrame * 0.006 + index) * 0.015);
    canvasContext.beginPath();
    canvasContext.ellipse(x, height * 0.82, width * 0.18, height * 0.09, 0, 0, Math.PI * 2);
    canvasContext.fill();
  }

  if (roar > 0) {
    canvasContext.strokeStyle = `rgba(255, 214, 90, ${0.32 * roar})`;
    canvasContext.lineWidth = Math.max(2, width * 0.003);
    for (let ring = 0; ring < 5; ring += 1) {
      canvasContext.beginPath();
      canvasContext.arc(width * 0.53, height * 0.38, width * (0.08 + ring * 0.08 + roar * 0.08), 0, Math.PI * 2);
      canvasContext.stroke();
    }
  }
}

function spawnTigerSpurts(width, height, intensity, kind) {
  const gore = handGraspAmount();
  if (gore <= 0.02) return;

  const count = Math.round((2 + intensity * 8) * (0.35 + gore * 1.6));
  for (let index = 0; index < count; index += 1) {
    tigerSpurts.push({
      x: width * (0.55 + Math.random() * 0.12),
      y: height * (0.52 + Math.random() * 0.12),
      vx: (Math.random() - 0.35) * (1.5 + intensity * 5),
      vy: -(1.5 + Math.random() * 5 + intensity * 7) * (kind === "bite" ? 1.3 : 1),
      radius: 2 + Math.random() * (5 + gore * 7),
      life: 1,
      hue: 348 + Math.random() * 18,
    });
  }
}

function drawTigerSpurts(canvasContext, width, height, bassEnergy) {
  tigerSpurts = tigerSpurts.filter((drop) => drop.life > 0.02 && drop.y < height * 1.08);
  tigerSpurts.forEach((drop) => {
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.vy += 0.18 + bassEnergy * 0.22;
    drop.life -= 0.014;
    canvasContext.fillStyle = hsla(drop.hue, 94, 40 + drop.life * 22, drop.life * 0.82);
    canvasContext.beginPath();
    canvasContext.arc(drop.x, drop.y, drop.radius * (0.6 + drop.life * 0.8), 0, Math.PI * 2);
    canvasContext.fill();
  });

  if (tigerSpurts.length > 180) {
    tigerSpurts.splice(0, tigerSpurts.length - 180);
  }
}

function drawRedcoat(canvasContext, scale, biteEnergy, clawEnergy, worryEnergy, palette) {
  const flail = Math.sin(tigerFrame * 0.12) * (0.08 + worryEnergy * 0.22);
  canvasContext.save();
  canvasContext.translate(scale * 0.28, scale * 0.12);
  canvasContext.rotate(-0.36 + flail);

  canvasContext.fillStyle = hsla(palette.coat, 86, 40 + biteEnergy * 14, 0.92);
  canvasContext.beginPath();
  canvasContext.moveTo(-scale * 0.1, -scale * 0.18);
  canvasContext.lineTo(scale * 0.22, -scale * 0.16);
  canvasContext.lineTo(scale * 0.32, scale * 0.46);
  canvasContext.lineTo(-scale * 0.2, scale * 0.5);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.strokeStyle = "rgba(235, 220, 190, 0.88)";
  canvasContext.lineWidth = Math.max(2, scale * 0.035);
  canvasContext.lineCap = "round";
  canvasContext.beginPath();
  canvasContext.moveTo(-scale * 0.08, -scale * 0.02);
  canvasContext.lineTo(-scale * (0.44 + clawEnergy * 0.3), -scale * (0.18 + worryEnergy * 0.22));
  canvasContext.moveTo(scale * 0.2, 0);
  canvasContext.lineTo(scale * (0.5 + worryEnergy * 0.28), -scale * (0.22 + biteEnergy * 0.16));
  canvasContext.moveTo(-scale * 0.06, scale * 0.46);
  canvasContext.lineTo(-scale * (0.34 + clawEnergy * 0.18), scale * 0.76);
  canvasContext.moveTo(scale * 0.22, scale * 0.44);
  canvasContext.lineTo(scale * (0.48 + worryEnergy * 0.2), scale * 0.72);
  canvasContext.stroke();

  canvasContext.strokeStyle = "rgba(244, 230, 200, 0.9)";
  canvasContext.lineWidth = Math.max(2, scale * 0.026);
  canvasContext.beginPath();
  canvasContext.moveTo(-scale * 0.07, -scale * 0.15);
  canvasContext.lineTo(scale * 0.27, scale * 0.38);
  canvasContext.moveTo(scale * 0.19, -scale * 0.15);
  canvasContext.lineTo(-scale * 0.14, scale * 0.38);
  canvasContext.stroke();

  drawRedcoatFace(canvasContext, scale, biteEnergy, worryEnergy, palette);

  canvasContext.restore();
}

function drawRedcoatFace(canvasContext, scale, biteEnergy, worryEnergy, palette) {
  const scream = 0.35 + biteEnergy * 0.45 + worryEnergy * 0.35;
  const tremble = Math.sin(tigerFrame * 0.34) * scale * (0.006 + worryEnergy * 0.018);
  const faceX = scale * 0.08 + tremble;
  const faceY = -scale * 0.36;

  canvasContext.save();
  canvasContext.shadowColor = "rgba(0, 0, 0, 0.32)";
  canvasContext.shadowBlur = scale * 0.03;

  canvasContext.fillStyle = "rgba(235, 235, 220, 0.96)";
  canvasContext.beginPath();
  canvasContext.ellipse(faceX + scale * 0.01, faceY - scale * 0.12, scale * 0.15, scale * 0.075, -0.08, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(238, 198, 148, 0.98)";
  canvasContext.beginPath();
  canvasContext.ellipse(faceX, faceY, scale * 0.13, scale * 0.155, 0.08, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(248, 232, 208, 0.9)";
  canvasContext.beginPath();
  canvasContext.ellipse(faceX + scale * 0.02, faceY - scale * 0.02, scale * 0.08, scale * 0.1, 0.1, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = "rgba(70, 34, 24, 0.92)";
  canvasContext.lineWidth = Math.max(1.5, scale * 0.012);
  canvasContext.lineCap = "round";
  canvasContext.beginPath();
  canvasContext.moveTo(faceX - scale * 0.08, faceY - scale * 0.065);
  canvasContext.lineTo(faceX - scale * 0.025, faceY - scale * (0.1 + scream * 0.03));
  canvasContext.moveTo(faceX + scale * 0.035, faceY - scale * (0.1 + scream * 0.03));
  canvasContext.lineTo(faceX + scale * 0.09, faceY - scale * 0.062);
  canvasContext.stroke();

  canvasContext.fillStyle = "rgba(16, 12, 12, 0.96)";
  [-0.045, 0.052].forEach((offset) => {
    canvasContext.beginPath();
    canvasContext.ellipse(faceX + scale * offset, faceY - scale * 0.042, scale * 0.014, scale * 0.022, 0, 0, Math.PI * 2);
    canvasContext.fill();
  });

  canvasContext.fillStyle = "rgba(80, 10, 12, 0.96)";
  canvasContext.beginPath();
  canvasContext.ellipse(faceX + scale * 0.015, faceY + scale * 0.055, scale * (0.032 + scream * 0.026), scale * (0.038 + scream * 0.042), 0, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = "rgba(112, 40, 32, 0.78)";
  canvasContext.lineWidth = Math.max(1, scale * 0.007);
  canvasContext.beginPath();
  canvasContext.moveTo(faceX - scale * 0.105, faceY + scale * 0.01);
  canvasContext.quadraticCurveTo(faceX - scale * 0.055, faceY + scale * 0.035, faceX - scale * 0.08, faceY + scale * 0.082);
  canvasContext.moveTo(faceX + scale * 0.1, faceY + scale * 0.006);
  canvasContext.quadraticCurveTo(faceX + scale * 0.058, faceY + scale * 0.038, faceX + scale * 0.078, faceY + scale * 0.088);
  canvasContext.stroke();

  canvasContext.strokeStyle = hsla(palette.coat + 8, 96, 62, 0.72);
  canvasContext.lineWidth = Math.max(1, scale * 0.006);
  for (let mark = 0; mark < 3; mark += 1) {
    const y = faceY - scale * (0.14 + mark * 0.04);
    canvasContext.beginPath();
    canvasContext.moveTo(faceX + scale * (0.14 + mark * 0.035), y);
    canvasContext.lineTo(faceX + scale * (0.22 + mark * 0.04), y - scale * (0.03 + biteEnergy * 0.04));
    canvasContext.stroke();
  }

  canvasContext.restore();
}

function drawTiger(canvasContext, scale, bassEnergy, biteEnergy, clawEnergy, worryEnergy, roar, palette) {
  const pounce = Math.sin(tigerFrame * 0.07) * bassEnergy * scale * 0.05;
  const bite = Math.max(0, Math.sin(tigerFrame * 0.18)) * biteEnergy;
  const rake = Math.max(0, Math.sin(tigerFrame * 0.22 + 1.2)) * clawEnergy;
  const worry = Math.sin(tigerFrame * 0.15) * worryEnergy;

  canvasContext.save();
  canvasContext.translate(-scale * 0.12 + pounce, -scale * 0.02);
  canvasContext.rotate(-0.04 + worry * 0.08);

  canvasContext.fillStyle = hsla(palette.tiger, 94, 48 + bassEnergy * 16, 0.98);
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, scale * 0.56, scale * 0.26, -0.05, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(palette.stripe, 86, 13, 0.82);
  canvasContext.lineWidth = Math.max(2, scale * 0.025);
  for (let stripe = 0; stripe < 9; stripe += 1) {
    const x = -scale * 0.38 + stripe * scale * 0.1;
    canvasContext.beginPath();
    canvasContext.moveTo(x, -scale * 0.22);
    canvasContext.quadraticCurveTo(x + scale * 0.05, -scale * 0.02, x - scale * 0.01, scale * 0.2);
    canvasContext.stroke();
  }

  canvasContext.strokeStyle = hsla(palette.tiger + 8, 94, 44, 0.95);
  canvasContext.lineWidth = Math.max(3, scale * 0.055);
  canvasContext.beginPath();
  canvasContext.moveTo(-scale * 0.48, scale * 0.02);
  canvasContext.quadraticCurveTo(-scale * 0.86, -scale * (0.26 + bassEnergy * 0.16), -scale * 0.98, scale * (0.02 + worry * 0.12));
  canvasContext.stroke();

  canvasContext.fillStyle = hsla(palette.tiger + 2, 94, 44 + bassEnergy * 12, 0.98);
  [
    [0.4, -0.26, -0.35],
    [0.57, -0.26, 0.3],
  ].forEach(([x, y, angle]) => {
    canvasContext.save();
    canvasContext.translate(scale * x, scale * y);
    canvasContext.rotate(angle + worry * 0.12);
    canvasContext.beginPath();
    canvasContext.moveTo(0, -scale * 0.12);
    canvasContext.lineTo(scale * 0.085, scale * 0.045);
    canvasContext.lineTo(-scale * 0.085, scale * 0.045);
    canvasContext.closePath();
    canvasContext.fill();
    canvasContext.fillStyle = "rgba(35, 16, 10, 0.8)";
    canvasContext.beginPath();
    canvasContext.moveTo(0, -scale * 0.06);
    canvasContext.lineTo(scale * 0.04, scale * 0.022);
    canvasContext.lineTo(-scale * 0.04, scale * 0.022);
    canvasContext.closePath();
    canvasContext.fill();
    canvasContext.restore();
  });

  canvasContext.fillStyle = hsla(palette.tiger + 2, 94, 50 + biteEnergy * 12, 0.98);
  canvasContext.beginPath();
  canvasContext.ellipse(scale * (0.48 + bite * 0.04), -scale * (0.12 + bite * 0.05), scale * 0.23, scale * 0.18, -0.28 + worry * 0.18, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(palette.stripe, 86, 12, 0.8);
  canvasContext.lineWidth = Math.max(2, scale * 0.017);
  canvasContext.lineCap = "round";
  [-0.065, 0, 0.065].forEach((offset) => {
    canvasContext.beginPath();
    canvasContext.moveTo(scale * (0.45 + offset), -scale * 0.28);
    canvasContext.lineTo(scale * (0.48 + offset * 0.4), -scale * 0.2);
    canvasContext.stroke();
  });

  canvasContext.fillStyle = "rgba(255, 220, 170, 0.9)";
  canvasContext.beginPath();
  canvasContext.ellipse(scale * (0.58 + bite * 0.03), -scale * (0.08 + bite * 0.035), scale * 0.105, scale * 0.072, -0.25, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(48, 14, 10, 0.96)";
  canvasContext.beginPath();
  canvasContext.ellipse(scale * (0.64 + bite * 0.06), -scale * (0.08 + bite * 0.03), scale * (0.05 + bite * 0.04 + roar * 0.02), scale * (0.035 + bite * 0.035 + roar * 0.03), -0.18, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(18, 9, 7, 0.96)";
  canvasContext.beginPath();
  canvasContext.ellipse(scale * 0.69, -scale * 0.12, scale * 0.03, scale * 0.022, -0.2, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(250, 238, 210, 0.94)";
  canvasContext.beginPath();
  canvasContext.moveTo(scale * 0.6, -scale * 0.07);
  canvasContext.lineTo(scale * (0.76 + bite * 0.08), -scale * (0.1 + bite * 0.04));
  canvasContext.lineTo(scale * 0.62, -scale * (0.01 - bite * 0.05));
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.moveTo(scale * 0.61, -scale * 0.16);
  canvasContext.lineTo(scale * (0.74 + bite * 0.07), -scale * (0.2 + bite * 0.03));
  canvasContext.lineTo(scale * 0.62, -scale * 0.11);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(8, 6, 5, 0.96)";
  canvasContext.beginPath();
  canvasContext.arc(scale * 0.55, -scale * 0.2, scale * 0.024 + roar * scale * 0.008, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = "rgba(248, 224, 90, 0.94)";
  canvasContext.beginPath();
  canvasContext.arc(scale * 0.552, -scale * 0.202, scale * 0.01, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = "rgba(20, 10, 7, 0.8)";
  canvasContext.lineWidth = Math.max(1.2, scale * 0.006);
  for (let side = -1; side <= 1; side += 2) {
    for (let whisker = 0; whisker < 3; whisker += 1) {
      canvasContext.beginPath();
      canvasContext.moveTo(scale * 0.62, -scale * (0.08 - whisker * 0.026));
      canvasContext.quadraticCurveTo(scale * (0.74 + side * 0.03), -scale * (0.12 - whisker * 0.012), scale * (0.82 + side * 0.02), -scale * (0.16 - whisker * 0.052));
      canvasContext.stroke();
    }
  }

  canvasContext.strokeStyle = hsla(palette.tiger + 8, 94, 43, 0.96);
  canvasContext.lineWidth = Math.max(3, scale * 0.055);
  canvasContext.lineCap = "round";
  [-0.26, 0.24].forEach((x, index) => {
    const strike = index === 1 ? rake : bassEnergy * 0.4;
    canvasContext.beginPath();
    canvasContext.moveTo(x * scale, scale * 0.14);
    canvasContext.quadraticCurveTo(scale * (x + 0.08), scale * (0.34 + strike * 0.18), scale * (x + 0.03), scale * 0.55);
    canvasContext.stroke();
  });

  canvasContext.strokeStyle = "rgba(250, 238, 210, 0.85)";
  canvasContext.lineWidth = Math.max(1.5, scale * 0.013);
  for (let claw = 0; claw < 4; claw += 1) {
    canvasContext.beginPath();
    canvasContext.moveTo(scale * (0.15 + claw * 0.03), scale * (0.45 + rake * 0.08));
    canvasContext.lineTo(scale * (0.28 + claw * 0.035 + rake * 0.16), scale * (0.36 - rake * 0.12));
    canvasContext.stroke();
  }

  if (roar > 0.08) {
    canvasContext.strokeStyle = `rgba(255, 220, 108, ${0.5 * roar})`;
    canvasContext.lineWidth = Math.max(2, scale * 0.016);
    for (let wave = 0; wave < 4; wave += 1) {
      canvasContext.beginPath();
      canvasContext.arc(scale * 0.72, -scale * 0.15, scale * (0.16 + wave * 0.11 + roar * 0.06), -0.5, 0.6);
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function drawTipusTigerScene(canvasContext, width, height, bassEnergy, biteEnergy, clawEnergy, worryEnergy, trebleEnergy) {
  const zoom = handSizeMultiplier();
  const gore = handGraspAmount();
  const roar = Math.max(0, (tigerRoarUntil - performance.now()) / 900);
  const palette = tigerPalette(trebleEnergy);
  const scale = Math.min(width, height) * 0.48 * zoom * (0.92 + bassEnergy * 0.08);

  drawTigerBackdrop(canvasContext, width, height, bassEnergy, roar);
  canvasContext.save();
  canvasContext.translate(width * 0.5, height * 0.58);

  canvasContext.fillStyle = "rgba(0, 0, 0, 0.28)";
  canvasContext.beginPath();
  canvasContext.ellipse(0, scale * 0.34, scale * 1.15, scale * 0.16, 0, 0, Math.PI * 2);
  canvasContext.fill();

  drawRedcoat(canvasContext, scale, biteEnergy, clawEnergy, worryEnergy, palette);
  drawTiger(canvasContext, scale, bassEnergy, biteEnergy, clawEnergy, worryEnergy, roar, palette);
  canvasContext.save();
  canvasContext.translate(scale * 0.28, scale * 0.12);
  canvasContext.rotate(-0.36 + Math.sin(tigerFrame * 0.12) * (0.08 + worryEnergy * 0.22));
  drawRedcoatFace(canvasContext, scale, biteEnergy, worryEnergy, palette);
  canvasContext.restore();
  canvasContext.restore();

  if (gore > 0.03 && Math.random() < (biteEnergy * 0.08 + clawEnergy * 0.1 + roar * 0.06) * (0.3 + gore)) {
    spawnTigerSpurts(width, height, Math.max(biteEnergy, clawEnergy, roar), biteEnergy > clawEnergy ? "bite" : "claw");
  }
  drawTigerSpurts(canvasContext, width, height, bassEnergy);
}

function drawTipusTigerFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const tempo = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  tigerFrame += tempo;

  const bassEnergy = pressureResponse(averageBand(buffer, tigerBands[0].start, tigerBands[0].end), 1.38);
  const biteEnergy = pressureResponse(averageBand(buffer, tigerBands[1].start, tigerBands[1].end), 1.42);
  const clawEnergy = pressureResponse(averageBand(buffer, tigerBands[2].start, tigerBands[2].end), 1.44);
  const worryEnergy = pressureResponse(averageBand(buffer, tigerBands[3].start, tigerBands[3].end), 1.38);
  const trebleEnergy = pressureResponse(averageBand(buffer, tigerBands[4].start, tigerBands[4].end), 1.5);

  drawTipusTigerScene(canvasContext, width, height, bassEnergy, biteEnergy, clawEnergy, worryEnergy, trebleEnergy);
}

function hslToRgb(hue, saturation, lightness) {
  const h = (((hue % 360) + 360) % 360) / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hueToRgb = (offset) => {
    let t = h + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  return [
    Math.round(hueToRgb(1 / 3) * 255),
    Math.round(hueToRgb(0) * 255),
    Math.round(hueToRgb(-1 / 3) * 255),
  ];
}

function mandelbrotColour(iteration, maxIterations, smoothEscape, bassEnergy, trebleEnergy) {
  if (iteration >= maxIterations) {
    const ember = themeSelect.value === "ember" ? 12 : themeSelect.value === "pressure" ? 28 : 4;
    return [ember + bassEnergy * 20, 5 + trebleEnergy * 10, 12 + bassEnergy * 18];
  }

  const progress = smoothEscape / maxIterations;
  const theme = themeSelect.value;
  let hue = 155;
  let saturation = 82;
  let lightness = 42 + Math.sqrt(progress) * 42 + bassEnergy * 10;

  if (theme === "ice") {
    hue = 188 + progress * 92 + trebleEnergy * 42;
    saturation = 86;
    lightness = 34 + Math.sqrt(progress) * 48 + trebleEnergy * 12;
  } else if (theme === "ember") {
    hue = 4 + progress * 62 + bassEnergy * 32;
    saturation = 96;
    lightness = 28 + Math.sqrt(progress) * 48 + bassEnergy * 16;
  } else if (theme === "pressure") {
    hue = 334 - progress * 250 + trebleEnergy * 80;
    saturation = 100;
    lightness = 26 + Math.sqrt(progress) * 58;
  } else if (theme === "spectrum") {
    hue = 300 - progress * 320 + mandelbrotFrame * 0.7 + trebleEnergy * 70;
    saturation = 92;
    lightness = 32 + Math.sqrt(progress) * 50;
  } else {
    hue = 142 + progress * 80 + trebleEnergy * 24;
    saturation = 68 + bassEnergy * 22;
    lightness = 30 + Math.sqrt(progress) * 45 + trebleEnergy * 8;
  }

  return hslToRgb(hue, saturation, Math.max(4, Math.min(88, lightness)));
}

function drawMandelbrotScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const detail = handCountValueNumber();
  const warp = handGraspAmount();
  const magnify = handSizeMultiplier();
  const renderWidth = Math.round(Math.min(336, Math.max(132, 112 + detail * 16)));
  const renderHeight = Math.max(72, Math.round(renderWidth * (height / Math.max(1, width))));
  const maxIterations = Math.round(42 + detail * 13 + trebleEnergy * 42);
  const phase = mandelbrotFrame * 0.007;
  const introspection = (1 - Math.cos(phase)) * 0.5;
  const zoom = Math.pow(1 + magnify * 56 + bassEnergy * 36, introspection) * (0.95 + bassEnergy * 0.22);
  const aspect = width / Math.max(1, height);
  const drift = (1 - introspection) * (0.0026 + warp * 0.0036);
  const targetX = -0.743643887037151;
  const targetY = 0.13182590420533;
  const cameraEase = Math.pow(introspection, 1.35);
  const centerX = -0.54 + (targetX + Math.sin(phase * 0.37 + midsEnergy * 2) * drift + 0.54) * cameraEase;
  const centerY = (targetY + Math.cos(phase * 0.31 + trebleEnergy * 2.4) * drift) * cameraEase;
  const scale = 3.25 / zoom;
  const imageContext = mandelbrotCanvas.getContext("2d");

  if (mandelbrotCanvas.width !== renderWidth || mandelbrotCanvas.height !== renderHeight) {
    mandelbrotCanvas.width = renderWidth;
    mandelbrotCanvas.height = renderHeight;
  }

  const image = imageContext.createImageData(renderWidth, renderHeight);
  const data = image.data;

  for (let y = 0; y < renderHeight; y += 1) {
    const ci = centerY + (y / renderHeight - 0.5) * scale;
    for (let x = 0; x < renderWidth; x += 1) {
      const cr = centerX + (x / renderWidth - 0.5) * scale * aspect;
      let zr = 0;
      let zi = 0;
      let zr2 = 0;
      let zi2 = 0;
      let iteration = 0;

      while (iteration < maxIterations && zr2 + zi2 <= 4) {
        zi = 2 * zr * zi + ci;
        zr = zr2 - zi2 + cr;
        zr2 = zr * zr;
        zi2 = zi * zi;
        iteration += 1;
      }

      const escaped = iteration < maxIterations;
      const magnitude = Math.sqrt(Math.max(1.000001, zr2 + zi2));
      const smoothEscape = escaped ? iteration + 1 - Math.log2(Math.log2(magnitude)) : iteration;
      const [red, green, blue] = mandelbrotColour(iteration, maxIterations, smoothEscape, bassEnergy, trebleEnergy);
      const edge = escaped ? Math.min(1, smoothEscape / maxIterations) : 0;
      const shimmer = escaped ? 1 + Math.sin(edge * 44 + mandelbrotFrame * 0.05) * (0.03 + warp * 0.06 + trebleEnergy * 0.04) : 1;
      const index = (y * renderWidth + x) * 4;

      data[index] = Math.max(0, Math.min(255, red * shimmer));
      data[index + 1] = Math.max(0, Math.min(255, green * shimmer));
      data[index + 2] = Math.max(0, Math.min(255, blue * shimmer));
      data[index + 3] = 255;
    }
  }

  imageContext.putImageData(image, 0, 0);

  canvasContext.save();
  canvasContext.imageSmoothingEnabled = false;
  canvasContext.drawImage(mandelbrotCanvas, 0, 0, width, height);
  canvasContext.imageSmoothingEnabled = true;

  const glow = canvasContext.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.62);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.03 + trebleEnergy * 0.06})`);
  glow.addColorStop(0.42, `rgba(92, 255, 214, ${0.018 + midsEnergy * 0.042})`);
  glow.addColorStop(1, `rgba(0, 0, 0, ${0.42 - bassEnergy * 0.12})`);
  canvasContext.fillStyle = glow;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.strokeStyle = `rgba(255, 255, 255, ${0.035 + trebleEnergy * 0.07})`;
  canvasContext.lineWidth = Math.max(1, width * 0.0012);
  for (let ring = 0; ring < 5; ring += 1) {
    const radius = Math.min(width, height) * (0.12 + ring * 0.085 + bassEnergy * 0.04);
    canvasContext.beginPath();
    canvasContext.ellipse(
      width * (0.5 + Math.sin(phase * 0.53 + ring) * warp * 0.06),
      height * (0.5 + Math.cos(phase * 0.47 + ring) * warp * 0.05),
      radius * aspect,
      radius,
      phase * 0.08,
      0,
      Math.PI * 2,
    );
    canvasContext.stroke();
  }
  canvasContext.restore();
}

function drawMandelbrotFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const tempo = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  mandelbrotFrame += tempo * (0.62 + pressureResponse(averageBand(buffer, 1, 8), 1.35) * 0.7);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.38);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.34);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.46);
  drawMandelbrotScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
}

function sauronMoodPalette() {
  const mood = themeSelect.value;
  if (mood === "alarmed") {
    return { hue: 10, core: 30, mid: 352, edge: 326, intensity: 1.18 };
  }
  if (mood === "victory") {
    return { hue: 42, core: 36, mid: 18, edge: 350, intensity: 1.28 };
  }
  if (mood === "overthrown") {
    return { hue: 258, core: 260, mid: 222, edge: 198, intensity: 0.62 };
  }
  return { hue: 24, core: 18, mid: 2, edge: 344, intensity: 1 };
}

function sauronDischargeConfig() {
  const style = eyeDischargeSelect.value;
  if (style === "white-fury") return { hue: 48, strength: 1.42, fork: 1.35, lightness: 94 };
  if (style === "violet-venom") return { hue: 282, strength: 1.08, fork: 1.22, lightness: 76 };
  if (style === "blood-arc") return { hue: 354, strength: 1.22, fork: 1.08, lightness: 68 };
  if (style === "ashen-static") return { hue: 206, strength: 0.72, fork: 0.82, lightness: 76 };
  return { hue: 22, strength: 1, fork: 1, lightness: 84 };
}

function eyeHue(form, intensity) {
  const theme = themeSelect.value;
  if (form === "sauron") return sauronMoodPalette().hue + intensity * 18;
  if (form === "snake") return theme === "ice" ? 176 + intensity * 52 : 74 + intensity * 44;
  if (form === "cat") return theme === "ember" ? 42 + intensity * 24 : 92 + intensity * 46;
  if (form === "dog") return 28 + intensity * 14;
  if (form === "deer") return 42 + intensity * 18;
  if (theme === "ice") return 190 + intensity * 42;
  if (theme === "ember") return 18 + intensity * 36;
  if (theme === "pressure") return 318 - intensity * 210;
  if (theme === "spectrum") return 305 - intensity * 285 + eyeFrame * 0.25;
  return 150 + intensity * 52;
}

function eyeConfig(form) {
  if (form === "sauron") {
    return { count: 1, sclera: "rgba(255, 214, 84, 0.96)", skin: "rgba(20, 7, 5, 0.9)", pupil: "vertical", lash: 0.1, lid: 0.08 };
  }
  if (form === "snake") {
    return { count: 2, sclera: "rgba(228, 214, 124, 0.9)", skin: "rgba(24, 40, 18, 0.94)", pupil: "vertical", lash: 0.06, lid: 0.22 };
  }
  if (form === "cat") {
    return { count: 2, sclera: "rgba(245, 230, 158, 0.94)", skin: "rgba(21, 18, 15, 0.95)", pupil: "vertical", lash: 0.18, lid: 0.16 };
  }
  if (form === "dog") {
    return { count: 2, sclera: "rgba(235, 218, 190, 0.9)", skin: "rgba(52, 33, 23, 0.92)", pupil: "round", lash: 0.08, lid: 0.26 };
  }
  if (form === "deer") {
    return { count: 2, sclera: "rgba(239, 218, 176, 0.9)", skin: "rgba(72, 44, 28, 0.92)", pupil: "horizontal", lash: 0.28, lid: 0.18 };
  }
  return { count: 2, sclera: "rgba(250, 238, 224, 0.96)", skin: "rgba(48, 24, 28, 0.9)", pupil: "round", lash: 0.58, lid: 0.12 };
}

function drawEyeLashes(canvasContext, radiusX, radiusY, blink, energy, lashStrength, upper) {
  const count = Math.round(8 + lashStrength * 18);
  const span = upper ? Math.PI * 0.78 : Math.PI * 0.5;
  const start = upper ? Math.PI * 1.1 : Math.PI * 0.2;
  const baseY = upper ? -radiusY * (0.64 - blink * 0.42) : radiusY * 0.58;
  const length = radiusY * (0.14 + lashStrength * 0.22 + energy * 0.08);

  canvasContext.strokeStyle = upper ? "rgba(12, 8, 9, 0.86)" : "rgba(18, 12, 12, 0.44)";
  canvasContext.lineWidth = Math.max(1, radiusY * (0.012 + lashStrength * 0.01));
  canvasContext.lineCap = "round";
  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const angle = start + t * span;
    const x = Math.cos(angle) * radiusX * 0.96;
    const y = baseY + Math.sin(angle) * radiusY * 0.28;
    const lean = (t - 0.5) * radiusX * 0.08;
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    canvasContext.quadraticCurveTo(x + lean, y - length * (upper ? 0.72 : -0.28), x + lean * 1.4, y - length * (upper ? 1 : -0.45));
    canvasContext.stroke();
  }
}

function drawSauronCracks(canvasContext, radiusX, radiusY, bassEnergy, midsEnergy, trebleEnergy) {
  const crackCount = 8;
  const discharge = sauronDischargeConfig();
  const mood = sauronMoodPalette();
  const force = (0.75 + bassEnergy * 0.62 + trebleEnergy * 0.34) * discharge.strength * mood.intensity;
  const sides = [-1, 1, -1, 1, 1, -1, 1, -1];
  const starts = [-0.7, -0.46, -0.06, 0.28, -0.76, 0.64, 0.02, 0.48];

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";

  for (let crack = 0; crack < crackCount; crack += 1) {
    const side = sides[crack];
    const startY = radiusY * starts[crack];
    const points = [{ x: side * radiusX * 0.35, y: startY }];
    const reach = radiusX * (0.42 + bassEnergy * 0.4 + (crack % 4) * 0.09);
    const steps = 4 + (crack % 3);
    const verticalDrift = radiusY * (Math.sin(crack * 2.19 + eyeFrame * 0.011) * 0.5 + (crack % 2 ? -0.12 : 0.16));

    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      const jitter = Math.sin(eyeFrame * (0.035 + crack * 0.003) + crack * 7.2 + step * 3.9) * radiusY * (0.12 + midsEnergy * 0.2);
      points.push({
        x: side * (radiusX * 0.35 + reach * progress),
        y: startY + verticalDrift * progress + jitter,
      });
    }

    const strokeCrack = (lineWidth, alpha, lightness) => {
      canvasContext.strokeStyle = hsla(discharge.hue + trebleEnergy * 26, 100, lightness, alpha * force);
      canvasContext.lineWidth = lineWidth;
      canvasContext.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          canvasContext.moveTo(point.x, point.y);
        } else {
          canvasContext.lineTo(point.x, point.y);
        }
      });
      canvasContext.stroke();
    };

    strokeCrack(Math.max(3, radiusY * 0.075), 0.08, 42);
    strokeCrack(Math.max(1.5, radiusY * 0.026), 0.52, 58);
    strokeCrack(Math.max(1, radiusY * 0.01), 0.9, discharge.lightness);

    if (crack % 3 !== 1) {
      const forkPoint = points[Math.min(2 + (crack % 2), points.length - 2)];
      canvasContext.strokeStyle = hsla(discharge.hue + 12 + trebleEnergy * 22, 100, Math.min(96, discharge.lightness + 4), 0.48 * force);
      canvasContext.lineWidth = Math.max(1, radiusY * 0.012);
      canvasContext.beginPath();
      canvasContext.moveTo(forkPoint.x, forkPoint.y);
      canvasContext.lineTo(
        forkPoint.x + side * radiusX * (0.16 + midsEnergy * 0.14) * discharge.fork,
        forkPoint.y + Math.sign(verticalDrift || 1) * radiusY * (0.16 + trebleEnergy * 0.18),
      );
      canvasContext.lineTo(
        forkPoint.x + side * radiusX * (0.26 + bassEnergy * 0.12) * discharge.fork,
        forkPoint.y + Math.sign(verticalDrift || 1) * radiusY * (0.03 + trebleEnergy * 0.12),
      );
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function drawSauronAtmosphere(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const mood = sauronMoodPalette();
  const core = canvasContext.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, width * 0.68);
  core.addColorStop(0, hsla(mood.core + trebleEnergy * 16, 98, 28 + bassEnergy * 20, 1));
  core.addColorStop(0.24, hsla(mood.mid + midsEnergy * 18, 94, 16 + bassEnergy * 14, 0.98));
  core.addColorStop(0.58, hsla(mood.edge, 78, 9 + bassEnergy * 6, 0.98));
  core.addColorStop(1, "rgba(4, 2, 3, 1)");
  canvasContext.fillStyle = core;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  for (let flame = 0; flame < 15; flame += 1) {
    const phase = eyeFrame * (0.025 + flame * 0.0018) + flame * 2.7;
    const baseX = width * (0.03 + flame / 15) + Math.sin(phase) * width * 0.018;
    const baseY = height * (0.98 - (flame % 3) * 0.05);
    const heightLift = height * (0.2 + (flame % 5) * 0.04 + bassEnergy * 0.25) * mood.intensity;
    const widthLift = width * (0.028 + midsEnergy * 0.032 + (flame % 4) * 0.008);
    canvasContext.fillStyle = hsla(mood.hue + flame * 3 + trebleEnergy * 18, 100, 42 + trebleEnergy * 18, (0.045 + bassEnergy * 0.08) * mood.intensity);
    canvasContext.beginPath();
    canvasContext.moveTo(baseX - widthLift, baseY);
    canvasContext.bezierCurveTo(
      baseX - widthLift * 1.4,
      baseY - heightLift * 0.34,
      baseX + Math.sin(phase * 1.8) * widthLift,
      baseY - heightLift * 0.72,
      baseX + Math.cos(phase) * widthLift * 0.32,
      baseY - heightLift,
    );
    canvasContext.bezierCurveTo(
      baseX + widthLift * 0.9,
      baseY - heightLift * 0.54,
      baseX + widthLift * 1.25,
      baseY - heightLift * 0.28,
      baseX + widthLift,
      baseY,
    );
    canvasContext.closePath();
    canvasContext.fill();
  }

  for (let ember = 0; ember < 34; ember += 1) {
    const rise = ((eyeFrame * (0.008 + (ember % 5) * 0.003) + ember * 0.073) % 1);
    const x = width * (0.06 + ((ember * 0.179) % 0.88)) + Math.sin(eyeFrame * 0.025 + ember) * width * 0.012;
    const y = height * (0.94 - rise * 0.84);
    const radius = 1.3 + (ember % 4) + trebleEnergy * 3;
    canvasContext.fillStyle = hsla(mood.hue + (ember % 4) * 12, 100, 64, (0.1 + (1 - rise) * 0.34) * (0.6 + trebleEnergy) * mood.intensity);
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI * 2);
    canvasContext.fill();
  }
  canvasContext.restore();
}

function drawSingleEye(canvasContext, x, y, radiusX, radiusY, side, form, bassEnergy, midsEnergy, trebleEnergy, pointerGaze) {
  const config = eyeConfig(form);
  const blinkRate = fireworkSpeedMultiplier();
  const lashControl = handSizeMultiplier();
  const flecks = handCountValueNumber();
  const gaze = handGraspAmount();
  const blinkWave = Math.max(0, Math.sin(eyeFrame * (0.022 + blinkRate * 0.018) + side * 0.6));
  const blink = Math.pow(blinkWave, 18 - blinkRate * 4) * (0.85 - bassEnergy * 0.2);
  const pupilBeat = 0.74 + bassEnergy * 0.28 - trebleEnergy * 0.14;
  const irisHue = eyeHue(form, midsEnergy + trebleEnergy * 0.45);
  const wanderX = Math.sin(eyeFrame * 0.016 + side + midsEnergy * 2.2) * radiusX * (0.08 + gaze * 0.16);
  const wanderY = Math.cos(eyeFrame * 0.013 + side * 1.7) * radiusY * (0.04 + gaze * 0.08);
  const gazeX = wanderX * (1 - pointerGaze.weight) + pointerGaze.x * radiusX * (0.42 + gaze * 0.14) * pointerGaze.weight;
  const gazeY = wanderY * (1 - pointerGaze.weight) + pointerGaze.y * radiusY * (0.38 + gaze * 0.12) * pointerGaze.weight;
  const irisRadius = radiusY * (form === "sauron" ? 0.68 : 0.6);
  const lashStrength = config.lash * lashControl;

  canvasContext.save();
  canvasContext.translate(x, y);

  const socket = canvasContext.createRadialGradient(0, 0, radiusY * 0.2, 0, 0, radiusX * 1.25);
  socket.addColorStop(0, "rgba(255, 255, 255, 0.04)");
  socket.addColorStop(1, config.skin);
  canvasContext.fillStyle = socket;
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, radiusX * 1.48, radiusY * 1.45, 0, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.save();
  canvasContext.beginPath();
  if (form === "sauron") {
    canvasContext.ellipse(0, 0, radiusX * 0.55, radiusY * 1.05, 0, 0, Math.PI * 2);
  } else {
    canvasContext.ellipse(0, 0, radiusX, radiusY * (0.72 + config.lid * 0.28), 0, 0, Math.PI * 2);
  }
  canvasContext.clip();

  canvasContext.fillStyle = config.sclera;
  canvasContext.fillRect(-radiusX * 1.1, -radiusY, radiusX * 2.2, radiusY * 2);

  const irisGradient = canvasContext.createRadialGradient(gazeX, gazeY, irisRadius * 0.08, gazeX, gazeY, irisRadius);
  irisGradient.addColorStop(0, hsla(irisHue + 30, 90, 74 + trebleEnergy * 10, 0.98));
  irisGradient.addColorStop(0.45, hsla(irisHue, 86, 40 + midsEnergy * 18, 0.96));
  irisGradient.addColorStop(1, hsla(irisHue - 34, 92, 16 + bassEnergy * 14, 0.98));
  canvasContext.fillStyle = irisGradient;
  canvasContext.beginPath();
  canvasContext.arc(gazeX, gazeY, irisRadius, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(irisHue + 70, 90, 70, 0.28 + trebleEnergy * 0.3);
  canvasContext.lineWidth = Math.max(1, radiusY * 0.012);
  for (let ray = 0; ray < 42; ray += 1) {
    const angle = ray * 0.68 + eyeFrame * 0.006;
    const inner = irisRadius * (0.18 + Math.sin(ray) * 0.04);
    const outer = irisRadius * (0.72 + Math.sin(ray * 2.4 + eyeFrame * 0.03) * 0.18);
    canvasContext.beginPath();
    canvasContext.moveTo(gazeX + Math.cos(angle) * inner, gazeY + Math.sin(angle) * inner);
    canvasContext.lineTo(gazeX + Math.cos(angle) * outer, gazeY + Math.sin(angle) * outer);
    canvasContext.stroke();
  }

  for (let fleck = 0; fleck < flecks * 5; fleck += 1) {
    const angle = fleck * 2.399 + side;
    const distance = irisRadius * (0.22 + ((fleck * 37) % 61) / 100);
    canvasContext.fillStyle = hsla(irisHue + fleck * 9, 96, 64 + trebleEnergy * 20, 0.35 + trebleEnergy * 0.35);
    canvasContext.beginPath();
    canvasContext.arc(gazeX + Math.cos(angle) * distance, gazeY + Math.sin(angle) * distance, radiusY * (0.009 + (fleck % 4) * 0.004), 0, Math.PI * 2);
    canvasContext.fill();
  }

  canvasContext.fillStyle = "rgba(2, 2, 3, 0.96)";
  canvasContext.beginPath();
  if (config.pupil === "vertical") {
    const slitWidth = form === "sauron" ? 0.07 : 0.12 + trebleEnergy * 0.03;
    const slitHeight = form === "sauron" ? 0.66 : 0.86 * pupilBeat;
    canvasContext.ellipse(gazeX, gazeY, irisRadius * slitWidth, irisRadius * slitHeight, 0, 0, Math.PI * 2);
  } else if (config.pupil === "horizontal") {
    canvasContext.ellipse(gazeX, gazeY, irisRadius * (0.76 * pupilBeat), irisRadius * 0.18, 0, 0, Math.PI * 2);
  } else {
    canvasContext.arc(gazeX, gazeY, irisRadius * (0.34 * pupilBeat), 0, Math.PI * 2);
  }
  canvasContext.fill();

  canvasContext.fillStyle = `rgba(255, 248, 216, ${0.62 + trebleEnergy * 0.28})`;
  canvasContext.beginPath();
  canvasContext.ellipse(gazeX - irisRadius * 0.24, gazeY - irisRadius * 0.3, radiusY * 0.09, radiusY * 0.04, -0.45, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = `rgba(158, 232, 255, ${0.22 + midsEnergy * 0.22})`;
  canvasContext.beginPath();
  canvasContext.arc(gazeX + irisRadius * 0.3, gazeY - irisRadius * 0.14, radiusY * (0.035 + trebleEnergy * 0.035), 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.restore();

  canvasContext.fillStyle = form === "sauron" ? "rgba(18, 4, 3, 0.52)" : config.skin;
  canvasContext.beginPath();
  canvasContext.ellipse(0, -radiusY * (0.78 - blink * 0.62), radiusX * 1.06, radiusY * (0.36 + blink * 0.78), 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.ellipse(0, radiusY * (0.78 - blink * 0.52), radiusX * 1.06, radiusY * (0.2 + blink * 0.6), 0, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = "rgba(255, 244, 220, 0.18)";
  canvasContext.lineWidth = Math.max(1, radiusY * 0.012);
  canvasContext.beginPath();
  canvasContext.ellipse(0, -radiusY * 0.02, radiusX, radiusY * 0.75, 0, Math.PI * 1.03, Math.PI * 1.97);
  canvasContext.stroke();

  if (lashStrength > 0.04) {
    drawEyeLashes(canvasContext, radiusX, radiusY, blink, trebleEnergy, lashStrength, true);
    drawEyeLashes(canvasContext, radiusX, radiusY, blink, trebleEnergy * 0.6, lashStrength * 0.45, false);
  }

  if (form === "sauron") {
    drawSauronCracks(canvasContext, radiusX, radiusY, bassEnergy, midsEnergy, trebleEnergy);
  }

  canvasContext.restore();
}

function drawEyeVisionsScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const form = fireworkFormSelect.value || "sauron";
  const config = eyeConfig(form);
  const gaze = handGraspAmount();
  const pointerGaze = {
    x: eyePointer.x,
    y: eyePointer.y,
    weight: eyePointer.active ? 1 : 0,
  };
  const hue = eyeHue(form, midsEnergy);
  if (form === "sauron") {
    drawSauronAtmosphere(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
  } else {
    const background = canvasContext.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.72);
    background.addColorStop(0, hsla(hue, 70, 20 + trebleEnergy * 16, 0.92));
    background.addColorStop(0.5, hsla(hue - 80, 72, 9 + bassEnergy * 10, 0.94));
    background.addColorStop(1, "rgba(3, 3, 6, 0.98)");

    canvasContext.fillStyle = background;
    canvasContext.fillRect(0, 0, width, height);

    canvasContext.globalCompositeOperation = "lighter";
    for (let ray = 0; ray < 9; ray += 1) {
      const angle = ray * 0.72 + eyeFrame * 0.006;
      const x = width * (0.5 + Math.cos(angle) * (0.12 + bassEnergy * 0.08));
      const y = height * (0.35 + Math.sin(angle) * (0.08 + midsEnergy * 0.08));
      const glow = canvasContext.createRadialGradient(x, y, 0, x, y, width * (0.08 + trebleEnergy * 0.08));
      glow.addColorStop(0, hsla(hue + ray * 24, 92, 68, 0.06 + trebleEnergy * 0.08));
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      canvasContext.fillStyle = glow;
      canvasContext.fillRect(0, 0, width, height);
    }
    canvasContext.globalCompositeOperation = "source-over";
  }

  const baseRadius = Math.min(width, height) * (config.count === 1 ? 0.34 : 0.25) * (0.9 + bassEnergy * 0.12);
  const eyeY = height * (form === "sauron" ? 0.52 : 0.5 + Math.sin(eyeFrame * 0.011) * 0.015);
  if (config.count === 1) {
    drawSingleEye(canvasContext, width * 0.5, eyeY, baseRadius * (0.72 + gaze * 0.12), baseRadius * 1.08, 0, form, bassEnergy, midsEnergy, trebleEnergy, pointerGaze);
  } else {
    const spacing = width * (0.21 + gaze * 0.035);
    drawSingleEye(canvasContext, width * 0.5 - spacing, eyeY, baseRadius * 1.2, baseRadius * 0.68, -1, form, bassEnergy, midsEnergy, trebleEnergy, pointerGaze);
    drawSingleEye(canvasContext, width * 0.5 + spacing, eyeY, baseRadius * 1.2, baseRadius * 0.68, 1, form, bassEnergy, midsEnergy, trebleEnergy, pointerGaze);
  }
}

function drawEyeVisionsFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const rate = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.36);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.36);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.48);
  eyeFrame += rate * (0.7 + bassEnergy * 0.7 + trebleEnergy * 0.35);
  drawEyeVisionsScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
}

function lightningSkyPalette(intensity) {
  const theme = themeSelect.value;
  if (theme === "ice") {
    return { top: `rgba(8, 24, 50, ${0.96})`, mid: `rgba(32, 72, 112, ${0.88})`, ground: "rgba(8, 18, 26, 0.98)", hue: 200 + intensity * 24 };
  }
  if (theme === "ember") {
    return { top: "rgba(42, 11, 8, 0.96)", mid: `rgba(112, 46, 22, ${0.74 + intensity * 0.12})`, ground: "rgba(25, 9, 6, 0.98)", hue: 34 + intensity * 22 };
  }
  if (theme === "pressure") {
    return { top: "rgba(26, 4, 36, 0.96)", mid: `rgba(74, 12, 84, ${0.78 + intensity * 0.1})`, ground: "rgba(9, 4, 14, 0.98)", hue: 306 - intensity * 120 };
  }
  if (theme === "spectrum") {
    return { top: hsla(235 + intensity * 80, 74, 10, 0.96), mid: hsla(278 - intensity * 210, 70, 22, 0.84), ground: "rgba(4, 7, 12, 0.98)", hue: 290 - intensity * 250 };
  }
  return { top: "rgba(8, 26, 22, 0.96)", mid: `rgba(16, 70, 62, ${0.68 + intensity * 0.12})`, ground: "rgba(5, 15, 13, 0.98)", hue: 158 + intensity * 40 };
}

function drawLightningSky(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const palette = lightningSkyPalette(trebleEnergy);
  const sky = canvasContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, palette.top);
  sky.addColorStop(0.56, palette.mid);
  sky.addColorStop(1, palette.ground);
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.globalCompositeOperation = "lighter";
  for (let cloud = 0; cloud < 8; cloud += 1) {
    const x = width * (0.08 + cloud * 0.13 + Math.sin(lightningFrame * 0.006 + cloud) * 0.02);
    const y = height * (0.12 + Math.sin(lightningFrame * 0.004 + cloud * 1.7) * 0.04);
    const glow = canvasContext.createRadialGradient(x, y, 0, x, y, width * (0.14 + bassEnergy * 0.06));
    glow.addColorStop(0, hsla(palette.hue + cloud * 9, 80, 56, 0.035 + trebleEnergy * 0.05));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.fillRect(0, 0, width, height * 0.45);
  }
  canvasContext.globalCompositeOperation = "source-over";

  canvasContext.fillStyle = "rgba(0, 0, 0, 0.28)";
  canvasContext.beginPath();
  canvasContext.moveTo(0, height);
  for (let point = 0; point <= 9; point += 1) {
    const x = width * (point / 9);
    const y = height * (0.82 + Math.sin(point * 1.8 + lightningFrame * 0.01) * 0.025 + bassEnergy * 0.035);
    canvasContext.lineTo(x, y);
  }
  canvasContext.lineTo(width, height);
  canvasContext.closePath();
  canvasContext.fill();
}

function createLightningBolt(width, height, intensity, bandIndex, bassEnergy, midsEnergy, trebleEnergy, destination = null, spectacular = false) {
  const size = handSizeMultiplier();
  const afterglow = handCountValueNumber();
  const snaking = handGraspAmount();
  const palette = lightningSkyPalette(trebleEnergy);
  const startX = destination
    ? destination.x + (Math.random() - 0.5) * width * 0.68
    : width * (0.12 + Math.random() * 0.76);
  const endX = destination
    ? destination.x
    : startX + (Math.random() - 0.5) * width * (0.18 + snaking * 0.34 + midsEnergy * 0.16);
  const startY = -height * (0.02 + Math.random() * 0.1);
  const endY = destination ? destination.y : height * (0.74 + Math.random() * 0.18);
  const segments = Math.round(9 + size * 8 + snaking * 10 + intensity * 8 + (spectacular ? 8 : 0));
  const points = [];
  let x = startX;

  for (let segment = 0; segment <= segments; segment += 1) {
    const progress = segment / segments;
    const fall = startY + (endY - startY) * progress;
    const destinationX = startX + (endX - startX) * progress;
    const musicCurl = Math.sin(progress * Math.PI * (2.5 + bandIndex * 0.4) + lightningFrame * 0.05) * width * (0.012 + midsEnergy * 0.026);
    const randomCurl = (Math.random() - 0.5) * width * (0.035 + snaking * 0.075 + intensity * 0.025);
    x += (destinationX - x) * (0.45 + bassEnergy * 0.2) + musicCurl + randomCurl;
    points.push({ x, y: fall });
  }
  if (destination) {
    points[points.length - 1] = { x: destination.x, y: destination.y };
  }

  const branches = [];
  const branchCount = Math.round((1 + intensity * 4 + snaking * 4) * Math.sqrt(size) * (spectacular ? 1.65 : 1));
  for (let branch = 0; branch < branchCount; branch += 1) {
    const originIndex = 1 + Math.floor(Math.random() * Math.max(1, points.length - 3));
    const origin = points[originIndex];
    const length = height * (0.07 + Math.random() * 0.18 + intensity * 0.08) * size;
    const direction = (Math.random() < 0.5 ? -1 : 1) * (0.45 + Math.random() * 0.55 + snaking * 0.5);
    const branchPoints = [origin];
    for (let step = 1; step <= 4; step += 1) {
      branchPoints.push({
        x: origin.x + direction * length * (step / 4) + (Math.random() - 0.5) * width * 0.035 * snaking,
        y: origin.y + length * (step / 4) * (0.2 + Math.random() * 0.5),
      });
    }
    branches.push(branchPoints);
  }

  return {
    points,
    branches,
    life: 1,
    maxLife: 18 + afterglow * 4 + intensity * 18 + (spectacular ? 20 : 0),
    age: 0,
    width: (1.4 + intensity * 5.4 + bassEnergy * 4.2) * size * (spectacular ? 1.65 : 1),
    hue: palette.hue + bandIndex * 9 + trebleEnergy * 30,
    groundX: points[points.length - 1].x,
    groundY: points[points.length - 1].y,
    spectacular,
  };
}

function drawLightningPath(canvasContext, points, width, hue, alpha) {
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";
  canvasContext.strokeStyle = hsla(hue, 96, 88, alpha);
  canvasContext.lineWidth = Math.max(1, width);
  canvasContext.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      canvasContext.moveTo(point.x, point.y);
    } else {
      canvasContext.lineTo(point.x, point.y);
    }
  });
  canvasContext.stroke();
}

function drawLightningBolts(canvasContext, width, height, bassEnergy, trebleEnergy) {
  lightningBolts = lightningBolts.filter((bolt) => bolt.life > 0.02);
  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";

  lightningBolts.forEach((bolt) => {
    bolt.age += 1;
    bolt.life = Math.max(0, 1 - bolt.age / bolt.maxLife);
    const flicker = 0.68 + Math.sin(lightningFrame * 0.7 + bolt.age * 1.9) * 0.22 + Math.random() * 0.1;
    const alpha = bolt.life * flicker;

    if (bolt.age < 4) {
      canvasContext.fillStyle = hsla(bolt.hue + 22, 92, 78, (4 - bolt.age) * 0.035);
      canvasContext.fillRect(0, 0, width, height);
    }

    drawLightningPath(canvasContext, bolt.points, bolt.width * 5.8, bolt.hue, alpha * 0.18);
    drawLightningPath(canvasContext, bolt.points, bolt.width * 2.5, bolt.hue + 18, alpha * 0.42);
    drawLightningPath(canvasContext, bolt.points, bolt.width * 0.72, bolt.hue + 40, Math.min(1, alpha * 1.2));

    bolt.branches.forEach((branch) => {
      drawLightningPath(canvasContext, branch, bolt.width * 1.7, bolt.hue + 20, alpha * 0.28);
      drawLightningPath(canvasContext, branch, bolt.width * 0.46, bolt.hue + 46, Math.min(1, alpha * 0.9));
    });

    const ground = canvasContext.createRadialGradient(bolt.groundX, bolt.groundY, 0, bolt.groundX, bolt.groundY, width * (0.04 + bassEnergy * 0.08));
    ground.addColorStop(0, hsla(bolt.hue + 24, 100, 82, alpha * 0.3));
    ground.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = ground;
    canvasContext.fillRect(0, height * 0.55, width, height * 0.45);
  });

  canvasContext.restore();
  if (lightningBolts.length > 22) {
    lightningBolts.splice(0, lightningBolts.length - 22);
  }
}

function launchMissileCommandStrike(width, height, x, y) {
  const palette = lightningSkyPalette(0.96);
  const target = { x, y };
  for (let bolt = 0; bolt < 4; bolt += 1) {
    lightningBolts.push(createLightningBolt(width, height, 0.9 + Math.random() * 0.1, bolt % fireworksBands.length, 0.94, 0.86, 0.94, target, true));
  }
  lightningImpacts.push({
    x,
    y,
    age: 0,
    life: 1,
    hue: palette.hue,
    seed: Math.random() * Math.PI * 2,
  });
}

function drawLightningImpacts(canvasContext, width, height, bassEnergy, trebleEnergy) {
  lightningImpacts = lightningImpacts.filter((impact) => impact.life > 0.015);
  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";

  lightningImpacts.forEach((impact) => {
    impact.age += 1;
    impact.life = Math.max(0, 1 - impact.age / 100);
    const birth = Math.min(1, impact.age / 12);
    const flareRadius = width * (0.025 + birth * (0.14 + bassEnergy * 0.08));
    const flare = canvasContext.createRadialGradient(impact.x, impact.y, 0, impact.x, impact.y, flareRadius);
    flare.addColorStop(0, hsla(impact.hue + 40, 100, 94, impact.life * 0.8));
    flare.addColorStop(0.22, hsla(impact.hue + 12, 100, 65, impact.life * 0.54));
    flare.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = flare;
    canvasContext.fillRect(impact.x - flareRadius, impact.y - flareRadius, flareRadius * 2, flareRadius * 2);

    for (let ring = 0; ring < 3; ring += 1) {
      const radius = width * (0.018 + (impact.age + ring * 10) * (0.0013 + bassEnergy * 0.0006));
      canvasContext.strokeStyle = hsla(impact.hue + ring * 22, 98, 78, impact.life * (0.6 - ring * 0.13));
      canvasContext.lineWidth = Math.max(1, 3.8 - ring);
      canvasContext.beginPath();
      canvasContext.arc(impact.x, impact.y, radius, 0, Math.PI * 2);
      canvasContext.stroke();
    }

    const sparkCount = 22;
    for (let spark = 0; spark < sparkCount; spark += 1) {
      const angle = impact.seed + (spark / sparkCount) * Math.PI * 2 + Math.sin(lightningFrame * 0.04 + spark) * 0.08;
      const travel = width * (0.015 + impact.age * (0.0013 + trebleEnergy * 0.0004)) * (0.65 + (spark % 5) * 0.1);
      const sx = impact.x + Math.cos(angle) * travel;
      const sy = impact.y + Math.sin(angle) * travel + impact.age * impact.age * height * 0.000012;
      canvasContext.fillStyle = hsla(impact.hue + spark * 3, 100, 76, impact.life * 0.85);
      canvasContext.beginPath();
      canvasContext.arc(sx, sy, Math.max(1, width * 0.0025 * impact.life), 0, Math.PI * 2);
      canvasContext.fill();
    }
  });
  canvasContext.restore();
}

function drawLightningScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, bandIntensities) {
  const rate = fireworkSpeedMultiplier();
  const missileMode = fireworkFormSelect.value === "missilecommand";
  const activeImpact = missileMode
    ? lightningImpacts.slice().reverse().find((impact) => impact.age < 86)
    : null;
  drawLightningSky(canvasContext, width, height, bassEnergy, trebleEnergy);

  bandIntensities.forEach((intensity, bandIndex) => {
    const threshold = 0.18 + bandIndex * 0.035;
    const chance = (intensity - threshold) * (0.05 + rate * 0.04);
    if (chance > 0 && Math.random() < chance) {
      lightningBolts.push(createLightningBolt(width, height, intensity, bandIndex, bassEnergy, midsEnergy, trebleEnergy, activeImpact, Boolean(activeImpact)));
    }
  });

  if (lightningBolts.length === 0 && Math.floor(lightningFrame) % Math.max(18, Math.round(58 / rate)) === 0) {
    lightningBolts.push(createLightningBolt(width, height, 0.28, 2, bassEnergy, midsEnergy, trebleEnergy));
  }

  drawLightningBolts(canvasContext, width, height, bassEnergy, trebleEnergy);
  if (missileMode) {
    drawLightningImpacts(canvasContext, width, height, bassEnergy, trebleEnergy);
  }
}

function drawLightningFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const rate = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.36);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.34);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.46);
  const bandIntensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.4));
  lightningFrame += rate * (0.8 + bassEnergy * 0.8 + trebleEnergy * 0.32);

  drawLightningScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, bandIntensities);
}

function asteroidHue(progress, intensity) {
  const theme = themeSelect.value;
  if (theme === "ice") return 192 + progress * 54 + intensity * 18;
  if (theme === "ember") return 12 + progress * 35 + intensity * 24;
  if (theme === "pressure") return 330 - progress * 170 + intensity * 40;
  if (theme === "spectrum") return (320 - progress * 275 + intensity * 42 + 360) % 360;
  return 152 + progress * 54 + intensity * 22;
}

function setupAsteroidShip(width, height) {
  if (asteroidShip) return;
  asteroidShip = {
    x: width * 0.5,
    y: height * 0.5,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    radius: Math.min(width, height) * 0.035,
    thrust: 0,
    shield: 0,
  };
}

function wrapSpaceObject(object, width, height, padding = 0) {
  if (object.x < -padding) object.x = width + padding;
  if (object.x > width + padding) object.x = -padding;
  if (object.y < -padding) object.y = height + padding;
  if (object.y > height + padding) object.y = -padding;
}

function spawnAsteroid(width, height, intensity, generation = 0, x = null, y = null) {
  const scale = handSizeMultiplier();
  const edge = Math.floor(Math.random() * 4);
  const radius = Math.min(width, height) * (0.028 + Math.random() * 0.048 + intensity * 0.036) * scale * (generation ? 0.6 : 1);
  let rockX = x;
  let rockY = y;
  if (rockX === null) {
    rockX = edge % 2 === 0 ? Math.random() * width : (edge === 1 ? -radius : width + radius);
    rockY = edge % 2 === 1 ? Math.random() * height : (edge === 0 ? -radius : height + radius);
  }
  const targetAngle = Math.atan2(height * (0.3 + Math.random() * 0.4) - rockY, width * (0.3 + Math.random() * 0.4) - rockX);
  const speed = (0.55 + intensity * 3.1 + fireworkSpeedMultiplier() * 0.35) * (generation ? 1.18 : 1);
  const vertexCount = 8 + Math.floor(Math.random() * 5);
  asteroidRocks.push({
    x: rockX,
    y: rockY,
    vx: Math.cos(targetAngle) * speed,
    vy: Math.sin(targetAngle) * speed,
    radius,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * (0.025 + intensity * 0.04),
    hue: asteroidHue(Math.random(), intensity),
    intensity,
    generation,
    vertices: Array.from({ length: vertexCount }, () => 0.72 + Math.random() * 0.38),
  });
}

function spawnAsteroidSaucer(width, height, intensity) {
  const fromLeft = Math.random() < 0.5;
  asteroidSaucers.push({
    x: fromLeft ? -55 : width + 55,
    y: height * (0.14 + Math.random() * 0.55),
    vx: (fromLeft ? 1 : -1) * (1.1 + intensity * 2.4),
    phase: Math.random() * Math.PI * 2,
    radius: Math.min(width, height) * (0.04 + intensity * 0.018),
    hue: asteroidHue(0.8, intensity),
    energy: intensity,
    cooldown: 24 + Math.random() * 45,
    life: 1,
  });
}

function fireShipMissile() {
  if (!asteroidShip || asteroidFrame - asteroidLastShot < 7) return;
  const speed = 11;
  asteroidShots.push({
    x: asteroidShip.x + Math.cos(asteroidShip.angle) * asteroidShip.radius,
    y: asteroidShip.y + Math.sin(asteroidShip.angle) * asteroidShip.radius,
    vx: asteroidShip.vx + Math.cos(asteroidShip.angle) * speed,
    vy: asteroidShip.vy + Math.sin(asteroidShip.angle) * speed,
    life: 72,
    hostile: false,
    hue: asteroidHue(0.98, 0.9),
  });
  asteroidLastShot = asteroidFrame;
}

function fireSaucerShot(saucer, intensity) {
  if (!asteroidShip) return;
  const angle = Math.atan2(asteroidShip.y - saucer.y, asteroidShip.x - saucer.x) + (Math.random() - 0.5) * (0.38 - intensity * 0.2);
  asteroidShots.push({
    x: saucer.x,
    y: saucer.y,
    vx: Math.cos(angle) * (3.2 + intensity * 3.4),
    vy: Math.sin(angle) * (3.2 + intensity * 3.4),
    life: 110,
    hostile: true,
    hue: asteroidHue(0.12, intensity),
  });
}

function burstAsteroid(x, y, hue, force, count = 14) {
  for (let piece = 0; piece < count; piece += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.7 + Math.random() * (2.4 + force * 4);
    asteroidBursts.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.2 + Math.random() * (2.5 + force * 3),
      hue: hue + (Math.random() - 0.5) * 36,
      life: 1,
    });
  }
}

function drawAsteroidField(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const mode = fireworkFormSelect.value;
  const top = mode === "redalert" ? "#18060e" : mode === "arcade" ? "#09051d" : "#020612";
  const lower = mode === "redalert" ? "#320812" : mode === "arcade" ? "#081526" : "#040d18";
  const space = canvasContext.createLinearGradient(0, 0, 0, height);
  space.addColorStop(0, top);
  space.addColorStop(1, lower);
  canvasContext.fillStyle = space;
  canvasContext.fillRect(0, 0, width, height);

  for (let star = 0; star < 96; star += 1) {
    const x = (star * 137.7 + asteroidFrame * (0.04 + (star % 4) * 0.025)) % width;
    const y = (star * 61.3 + Math.sin(star * 3.1) * 42 + height) % height;
    const pulse = 0.28 + ((star % 7) / 10) + trebleEnergy * (star % 4 === 0 ? 0.65 : 0.12);
    canvasContext.fillStyle = hsla(asteroidHue(star / 96, trebleEnergy), 72, 78, Math.min(0.92, pulse));
    canvasContext.fillRect(x, y, star % 9 === 0 ? 2.4 : 1.2, star % 9 === 0 ? 2.4 : 1.2);
  }

  if (bassEnergy > 0.18) {
    const halo = canvasContext.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.54);
    halo.addColorStop(0, hsla(asteroidHue(0.42, bassEnergy), 86, 46, bassEnergy * 0.12));
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = halo;
    canvasContext.fillRect(0, 0, width, height);
  }
}

function drawAsteroidRock(canvasContext, rock) {
  canvasContext.save();
  canvasContext.translate(rock.x, rock.y);
  canvasContext.rotate(rock.rotation);
  canvasContext.fillStyle = hsla(rock.hue, 45, 18 + rock.intensity * 22, 0.88);
  canvasContext.strokeStyle = hsla(rock.hue + 28, 82, 65, 0.76);
  canvasContext.lineWidth = Math.max(1.5, rock.radius * 0.06);
  canvasContext.beginPath();
  rock.vertices.forEach((variance, index) => {
    const angle = (index / rock.vertices.length) * Math.PI * 2;
    const radius = rock.radius * variance;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) canvasContext.moveTo(x, y);
    else canvasContext.lineTo(x, y);
  });
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.stroke();
  canvasContext.strokeStyle = hsla(rock.hue + 18, 60, 48, 0.34);
  canvasContext.beginPath();
  canvasContext.moveTo(-rock.radius * 0.42, -rock.radius * 0.14);
  canvasContext.lineTo(rock.radius * 0.18, rock.radius * 0.28);
  canvasContext.lineTo(rock.radius * 0.42, -rock.radius * 0.22);
  canvasContext.stroke();
  canvasContext.restore();
}

function drawAsteroidShip(canvasContext, ship, trebleEnergy) {
  const glowHue = asteroidHue(0.62, trebleEnergy);
  canvasContext.save();
  canvasContext.translate(ship.x, ship.y);
  canvasContext.rotate(ship.angle + Math.PI / 2);
  canvasContext.shadowBlur = 15 + trebleEnergy * 20;
  canvasContext.shadowColor = hsla(glowHue, 100, 62, 0.75);
  canvasContext.strokeStyle = hsla(glowHue, 92, 78, 0.98);
  canvasContext.fillStyle = "rgba(8, 14, 24, 0.94)";
  canvasContext.lineWidth = 2.4;
  canvasContext.beginPath();
  canvasContext.moveTo(0, -ship.radius * 1.38);
  canvasContext.lineTo(ship.radius * 0.82, ship.radius);
  canvasContext.lineTo(0, ship.radius * 0.54);
  canvasContext.lineTo(-ship.radius * 0.82, ship.radius);
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.stroke();
  if (ship.thrust > 0.04) {
    canvasContext.fillStyle = hsla(24 + trebleEnergy * 32, 100, 60, 0.85);
    canvasContext.beginPath();
    canvasContext.moveTo(-ship.radius * 0.35, ship.radius * 0.72);
    canvasContext.lineTo(0, ship.radius * (1.1 + ship.thrust * 1.65 + Math.random() * 0.35));
    canvasContext.lineTo(ship.radius * 0.35, ship.radius * 0.72);
    canvasContext.fill();
  }
  if (ship.shield > 0) {
    canvasContext.strokeStyle = hsla(glowHue + 70, 100, 72, ship.shield);
    canvasContext.lineWidth = 3;
    canvasContext.beginPath();
    canvasContext.arc(0, 0, ship.radius * 1.7, 0, Math.PI * 2);
    canvasContext.stroke();
  }
  canvasContext.restore();
}

function drawAsteroidSaucer(canvasContext, saucer, trebleEnergy) {
  const pulse = 0.5 + Math.sin(asteroidFrame * 0.14 + saucer.phase) * 0.5;
  canvasContext.save();
  canvasContext.translate(saucer.x, saucer.y);
  canvasContext.shadowBlur = 18 + pulse * 18;
  canvasContext.shadowColor = hsla(saucer.hue, 100, 60, 0.7);
  canvasContext.fillStyle = hsla(saucer.hue, 80, 42 + pulse * 18, 0.9);
  canvasContext.strokeStyle = hsla(saucer.hue + 44, 100, 76, 0.9);
  canvasContext.lineWidth = 2;
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, saucer.radius * 1.45, saucer.radius * 0.38, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.stroke();
  canvasContext.fillStyle = hsla(saucer.hue + trebleEnergy * 70, 88, 68, 0.72);
  canvasContext.beginPath();
  canvasContext.ellipse(0, -saucer.radius * 0.23, saucer.radius * 0.58, saucer.radius * 0.42, 0, Math.PI, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawAsteroidShotsAndBursts(canvasContext) {
  asteroidShots.forEach((shot) => {
    canvasContext.strokeStyle = hsla(shot.hue, 100, 74, 0.94);
    canvasContext.lineWidth = shot.hostile ? 2.8 : 2.1;
    canvasContext.beginPath();
    canvasContext.moveTo(shot.x, shot.y);
    canvasContext.lineTo(shot.x - shot.vx * 1.8, shot.y - shot.vy * 1.8);
    canvasContext.stroke();
  });
  asteroidBursts = asteroidBursts.filter((piece) => piece.life > 0.02);
  asteroidBursts.forEach((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vx *= 0.985;
    piece.vy *= 0.985;
    piece.life *= 0.952;
    canvasContext.fillStyle = hsla(piece.hue, 100, 66, piece.life);
    canvasContext.beginPath();
    canvasContext.arc(piece.x, piece.y, piece.radius * piece.life, 0, Math.PI * 2);
    canvasContext.fill();
  });
}

function drawAsteroidHud(canvasContext, width, height, bassEnergy) {
  canvasContext.save();
  canvasContext.fillStyle = hsla(asteroidHue(0.6, bassEnergy), 92, 72, 0.86);
  canvasContext.font = `600 ${Math.max(13, Math.min(width, height) * 0.04)}px "Segoe UI", system-ui, sans-serif`;
  canvasContext.textAlign = "left";
  canvasContext.fillText(`SCORE ${String(asteroidScore).padStart(5, "0")}`, width * 0.035, height * 0.09);
  canvasContext.restore();
}

function updateAsteroidsScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, bandIntensities) {
  setupAsteroidShip(width, height);
  const tempo = fireworkSpeedMultiplier();
  const density = handCountValueNumber() / 6;
  const threat = handGraspAmount();
  asteroidFrame += tempo;

  if (asteroidKeys.has("KeyA")) asteroidShip.angle -= 0.065 * tempo;
  if (asteroidKeys.has("KeyD")) asteroidShip.angle += 0.065 * tempo;
  asteroidShip.thrust *= 0.82;
  if (asteroidKeys.has("KeyW")) {
    asteroidShip.vx += Math.cos(asteroidShip.angle) * 0.18 * tempo;
    asteroidShip.vy += Math.sin(asteroidShip.angle) * 0.18 * tempo;
    asteroidShip.thrust = 1;
  }
  if (asteroidKeys.has("KeyS")) {
    asteroidShip.vx *= 0.94;
    asteroidShip.vy *= 0.94;
  }
  asteroidShip.vx *= 0.993;
  asteroidShip.vy *= 0.993;
  const shipSpeed = Math.hypot(asteroidShip.vx, asteroidShip.vy);
  if (shipSpeed > 8) {
    asteroidShip.vx = (asteroidShip.vx / shipSpeed) * 8;
    asteroidShip.vy = (asteroidShip.vy / shipSpeed) * 8;
  }
  asteroidShip.x += asteroidShip.vx * tempo;
  asteroidShip.y += asteroidShip.vy * tempo;
  asteroidShip.shield *= 0.94;
  wrapSpaceObject(asteroidShip, width, height, asteroidShip.radius);
  if (asteroidKeys.has("Space")) {
    fireShipMissile();
  }

  const frequencySurge = Math.max(...bandIntensities);
  const spawnDrive = bassEnergy * 0.075 * density * tempo + midsEnergy * 0.018 + frequencySurge * 0.018;
  if (asteroidRocks.length < Math.round(4 + density * 4) || (asteroidRocks.length < 48 && Math.random() < spawnDrive)) {
    spawnAsteroid(width, height, Math.max(0.16, bassEnergy, frequencySurge));
  }
  if (asteroidSaucers.length < 4 && Math.random() < (0.0015 + trebleEnergy * threat * 0.028) * tempo) {
    spawnAsteroidSaucer(width, height, Math.max(0.2, trebleEnergy));
  }

  asteroidRocks.forEach((rock) => {
    rock.x += rock.vx * tempo;
    rock.y += rock.vy * tempo;
    rock.rotation += rock.spin * tempo * (1 + midsEnergy);
    wrapSpaceObject(rock, width, height, rock.radius);
  });

  asteroidSaucers.forEach((saucer) => {
    saucer.x += saucer.vx * tempo;
    saucer.y += Math.sin(asteroidFrame * (0.035 + trebleEnergy * 0.03) + saucer.phase) * (0.5 + trebleEnergy * 2.4);
    saucer.cooldown -= tempo * (0.7 + trebleEnergy * 2 + threat);
    if (saucer.cooldown <= 0) {
      fireSaucerShot(saucer, trebleEnergy * (0.5 + threat * 0.5));
      saucer.cooldown = 20 + Math.random() * (65 - threat * 28);
    }
    if (saucer.x < -100 || saucer.x > width + 100) saucer.life = 0;
  });

  asteroidShots = asteroidShots.filter((shot) => shot.life > 0);
  asteroidShots.forEach((shot) => {
    shot.x += shot.vx * tempo;
    shot.y += shot.vy * tempo;
    shot.life -= tempo;
    wrapSpaceObject(shot, width, height);
    if (shot.hostile && Math.hypot(shot.x - asteroidShip.x, shot.y - asteroidShip.y) < asteroidShip.radius * 1.25) {
      asteroidShip.shield = 1;
      asteroidShip.vx -= shot.vx * 0.28;
      asteroidShip.vy -= shot.vy * 0.28;
      burstAsteroid(asteroidShip.x, asteroidShip.y, shot.hue, 0.5, 12);
      shot.life = 0;
    }
    if (!shot.hostile) {
      asteroidRocks.forEach((rock) => {
        if (rock.hit || shot.life <= 0 || Math.hypot(shot.x - rock.x, shot.y - rock.y) > rock.radius) return;
        rock.hit = true;
        shot.life = 0;
        asteroidScore += rock.generation ? 25 : 10;
        burstAsteroid(rock.x, rock.y, rock.hue, rock.intensity, 10 + Math.round(rock.radius / 4));
        if (rock.generation < 1 && rock.radius > Math.min(width, height) * 0.035) {
          spawnAsteroid(width, height, rock.intensity * 0.76, 1, rock.x, rock.y);
          spawnAsteroid(width, height, rock.intensity * 0.76, 1, rock.x, rock.y);
        }
      });
      asteroidSaucers.forEach((saucer) => {
        if (saucer.life <= 0 || shot.life <= 0 || Math.hypot(shot.x - saucer.x, shot.y - saucer.y) > saucer.radius * 1.4) return;
        saucer.life = 0;
        shot.life = 0;
        asteroidScore += 75;
        burstAsteroid(saucer.x, saucer.y, saucer.hue, 1, 28);
      });
    }
  });
  asteroidRocks = asteroidRocks.filter((rock) => !rock.hit);
  asteroidSaucers = asteroidSaucers.filter((saucer) => saucer.life > 0);

  asteroidRocks.forEach((rock) => {
    if (asteroidShip.shield > 0.2 || Math.hypot(rock.x - asteroidShip.x, rock.y - asteroidShip.y) > rock.radius + asteroidShip.radius * 0.72) return;
    asteroidShip.shield = 1;
    asteroidShip.vx -= rock.vx * 0.42;
    asteroidShip.vy -= rock.vy * 0.42;
    burstAsteroid(asteroidShip.x, asteroidShip.y, asteroidHue(0.3, bassEnergy), 0.7, 20);
  });

  drawAsteroidField(canvasContext, width, height, bassEnergy, trebleEnergy);
  asteroidRocks.forEach((rock) => drawAsteroidRock(canvasContext, rock));
  asteroidSaucers.forEach((saucer) => drawAsteroidSaucer(canvasContext, saucer, trebleEnergy));
  drawAsteroidShotsAndBursts(canvasContext);
  drawAsteroidShip(canvasContext, asteroidShip, trebleEnergy);
  drawAsteroidHud(canvasContext, width, height, bassEnergy);
}

function drawAsteroidsFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.4);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.36);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.48);
  const bandIntensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.42));
  updateAsteroidsScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, bandIntensities);
}

function interzoneHue(progress, intensity) {
  const theme = themeSelect.value;
  if (theme === "ice") return 188 + progress * 62 + intensity * 18;
  if (theme === "ember") return 346 + progress * 44 + intensity * 25;
  if (theme === "pressure") return 310 - progress * 145 + intensity * 55;
  if (theme === "spectrum") return 318 - progress * 260 + intensity * 38;
  return 148 + progress * 42 + intensity * 24;
}

function setupInterzoneFigures(width, height) {
  const desiredCount = Math.max(3, Math.min(14, handCountValueNumber()));
  if (interzoneFigures.length === desiredCount) return;
  interzoneFigures = Array.from({ length: desiredCount }, (_, index) => {
    const spread = desiredCount === 1 ? 0.5 : index / (desiredCount - 1);
    const depth = index % 2 === 0 ? 1 : 0.83;
    return {
      index,
      x: width * (0.1 + spread * 0.8),
      baseY: height * (0.81 + (index % 3) * 0.035),
      depth,
      phase: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.32,
      memory: 0.12,
      blink: Math.random() * Math.PI * 2,
    };
  });
}

function drawInterzoneBackground(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const mode = fireworkFormSelect.value;
  const palette = mode === "withdrawal"
    ? { top: "#070b12", mid: "#15212a", floor: "#09050b", haze: 198 }
    : mode === "procession"
      ? { top: "#190b12", mid: "#32151a", floor: "#090307", haze: 352 }
      : { top: "#130d13", mid: "#262026", floor: "#090609", haze: 308 };
  const room = canvasContext.createLinearGradient(0, 0, 0, height);
  room.addColorStop(0, palette.top);
  room.addColorStop(0.55, palette.mid);
  room.addColorStop(1, palette.floor);
  canvasContext.fillStyle = room;
  canvasContext.fillRect(0, 0, width, height);

  for (let veil = 0; veil < 7; veil += 1) {
    const x = width * (0.08 + veil * 0.145) + Math.sin(interzoneFrame * 0.006 + veil) * width * 0.035;
    const glow = canvasContext.createRadialGradient(x, height * 0.38, 0, x, height * 0.38, width * (0.17 + bassEnergy * 0.06));
    glow.addColorStop(0, hsla(palette.haze + veil * 8, 60, 42 + trebleEnergy * 16, 0.055 + midsEnergy * 0.06));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.fillRect(0, 0, width, height * 0.75);
  }

  const pool = canvasContext.createLinearGradient(0, height * 0.68, 0, height);
  pool.addColorStop(0, `rgba(12, 5, 12, ${0.4 + bassEnergy * 0.24})`);
  pool.addColorStop(1, "rgba(1, 2, 4, 0.98)");
  canvasContext.fillStyle = pool;
  canvasContext.fillRect(0, height * 0.68, width, height * 0.32);

  for (let ripple = 0; ripple < 6; ripple += 1) {
    canvasContext.strokeStyle = hsla(palette.haze + ripple * 12, 72, 42, 0.06 + bassEnergy * 0.09);
    canvasContext.lineWidth = 1.4;
    canvasContext.beginPath();
    canvasContext.ellipse(width * (0.18 + ripple * 0.13), height * 0.88, width * (0.08 + bassEnergy * 0.06), height * 0.012, 0, 0, Math.PI * 2);
    canvasContext.stroke();
  }
}

function spawnInterzoneEmission(figure, intensity, width, height) {
  const secretion = handGraspAmount();
  if (Math.random() > (0.02 + intensity * (0.11 + secretion * 0.22)) * fireworkSpeedMultiplier()) return;
  const stature = handSizeMultiplier();
  const bodyHeight = height * 0.38 * stature * figure.depth;
  const headY = figure.baseY - bodyHeight;
  const direction = figure.index % 2 === 0 ? 1 : -1;
  const mouthX = figure.x + direction * width * (0.018 + stature * 0.022);
  const hue = interzoneHue(figure.index / Math.max(1, interzoneFigures.length - 1), intensity);
  interzoneDrops.push({
    x: mouthX,
    y: headY + height * 0.02,
    vx: direction * (0.2 + intensity * 1.2) + (Math.random() - 0.5) * 0.8,
    vy: 0.7 + intensity * (2.5 + secretion * 2.2),
    size: 2.5 + intensity * (6 + secretion * 8),
    hue,
    life: 1,
    trail: [],
  });
  if (trebleResponse(intensity) > 0.42 && Math.random() < 0.25 + secretion * 0.34) {
    interzoneWisps.push({
      x: mouthX,
      y: headY,
      vx: direction * (0.1 + Math.random() * 0.5),
      vy: -(0.16 + Math.random() * 0.38),
      curl: Math.random() * Math.PI * 2,
      hue,
      life: 1,
      radius: 8 + intensity * 24,
    });
  }
}

function trebleResponse(intensity) {
  return Math.max(0, Math.min(1, intensity * (1.08 + handGraspAmount() * 0.25)));
}

function drawInterzoneFigure(canvasContext, figure, intensity, bassEnergy, trebleEnergy, width, height) {
  const stature = handSizeMultiplier();
  const indexProgress = figure.index / Math.max(1, interzoneFigures.length - 1);
  const hue = interzoneHue(indexProgress, intensity);
  const sway = Math.sin(interzoneFrame * (0.018 + fireworkSpeedMultiplier() * 0.008) + figure.phase) * (0.08 + trebleEnergy * 0.18);
  figure.memory += (intensity - figure.memory) * 0.13;
  const swell = 1 + figure.memory * 0.35 + bassEnergy * 0.16;
  const bodyHeight = height * 0.38 * stature * figure.depth;
  const bodyWidth = Math.min(width, height) * 0.055 * stature * figure.depth * swell;
  const headRadius = bodyWidth * (0.76 + intensity * 0.28);
  const headY = figure.baseY - bodyHeight;
  const direction = figure.index % 2 === 0 ? 1 : -1;
  const proboscisLength = bodyWidth * (0.78 + intensity * 1.18 + handGraspAmount() * 0.6);

  canvasContext.save();
  canvasContext.translate(figure.x, figure.baseY);
  canvasContext.rotate(figure.tilt + sway);
  const torso = canvasContext.createLinearGradient(-bodyWidth, -bodyHeight, bodyWidth, 0);
  torso.addColorStop(0, hsla(hue + 14, 56, 54 + trebleEnergy * 12, 0.84));
  torso.addColorStop(0.5, hsla(hue - 10, 42, 25 + intensity * 17, 0.94));
  torso.addColorStop(1, hsla(hue - 26, 54, 12, 0.9));
  canvasContext.fillStyle = torso;
  canvasContext.beginPath();
  canvasContext.moveTo(-bodyWidth * 0.84, 0);
  canvasContext.bezierCurveTo(-bodyWidth * 1.2, -bodyHeight * 0.38, -bodyWidth * 0.52, -bodyHeight * 0.76, -headRadius * 0.48, -bodyHeight);
  canvasContext.bezierCurveTo(headRadius * 0.48, -bodyHeight, bodyWidth * 0.72, -bodyHeight * 0.7, bodyWidth * 0.94, 0);
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.strokeStyle = hsla(hue + 30, 66, 63, 0.28 + intensity * 0.22);
  canvasContext.lineWidth = 1.4 + intensity * 1.8;
  canvasContext.stroke();

  const throatPulse = 0.55 + Math.sin(interzoneFrame * 0.08 + figure.phase) * 0.2 + bassEnergy * 0.4;
  canvasContext.strokeStyle = hsla(hue + 34, 78, 68, 0.18 + throatPulse * 0.24);
  canvasContext.lineWidth = bodyWidth * (0.12 + throatPulse * 0.09);
  canvasContext.beginPath();
  canvasContext.moveTo(0, -bodyHeight * 0.14);
  canvasContext.bezierCurveTo(direction * bodyWidth * 0.23, -bodyHeight * 0.45, -direction * bodyWidth * 0.17, -bodyHeight * 0.7, 0, -bodyHeight * 0.9);
  canvasContext.stroke();

  canvasContext.translate(0, -bodyHeight);
  canvasContext.fillStyle = hsla(hue + 7, 48, 35 + intensity * 18, 0.96);
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, headRadius * 0.86, headRadius * 1.05, sway * 0.2, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.strokeStyle = hsla(hue + 34, 72, 68, 0.38);
  canvasContext.stroke();

  const blink = Math.max(0.1, Math.abs(Math.sin(interzoneFrame * 0.025 + figure.blink)) * (0.62 + trebleEnergy * 0.38));
  canvasContext.fillStyle = "rgba(234, 220, 188, 0.72)";
  canvasContext.beginPath();
  canvasContext.ellipse(-direction * headRadius * 0.26, -headRadius * 0.12, headRadius * 0.18, headRadius * 0.12 * blink, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = hsla(hue + 80, 96, 42, 0.96);
  canvasContext.beginPath();
  canvasContext.arc(-direction * headRadius * 0.27, -headRadius * 0.12, headRadius * 0.055, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(hue + 6, 55, 43 + intensity * 18, 0.94);
  canvasContext.lineCap = "round";
  canvasContext.lineWidth = headRadius * (0.38 + intensity * 0.12);
  canvasContext.beginPath();
  canvasContext.moveTo(direction * headRadius * 0.36, headRadius * 0.12);
  canvasContext.bezierCurveTo(
    direction * (headRadius + proboscisLength * 0.35),
    headRadius * (0.12 + Math.sin(interzoneFrame * 0.04 + figure.phase) * 0.14),
    direction * (headRadius + proboscisLength * 0.7),
    headRadius * (0.26 + intensity * 0.18),
    direction * (headRadius + proboscisLength),
    headRadius * (0.34 + intensity * 0.16),
  );
  canvasContext.stroke();
  canvasContext.fillStyle = hsla(hue + 20, 70, 56 + intensity * 14, 0.88);
  canvasContext.beginPath();
  canvasContext.arc(direction * (headRadius + proboscisLength), headRadius * (0.34 + intensity * 0.16), headRadius * (0.17 + intensity * 0.1), 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawInterzoneEmissions(canvasContext, width, height, bassEnergy) {
  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  interzoneDrops = interzoneDrops.filter((drop) => drop.life > 0.02 && drop.y < height * 1.06);
  interzoneDrops.forEach((drop) => {
    drop.trail.unshift({ x: drop.x, y: drop.y });
    drop.trail = drop.trail.slice(0, 9);
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.vy += 0.045 + bassEnergy * 0.08;
    drop.life *= 0.986;
    drop.trail.forEach((point, index) => {
      canvasContext.fillStyle = hsla(drop.hue + index * 4, 86, 62, drop.life * (1 - index / 11) * 0.68);
      canvasContext.beginPath();
      canvasContext.arc(point.x, point.y, drop.size * (1 - index / 13), 0, Math.PI * 2);
      canvasContext.fill();
    });
  });

  interzoneWisps = interzoneWisps.filter((wisp) => wisp.life > 0.02);
  interzoneWisps.forEach((wisp) => {
    wisp.x += wisp.vx + Math.sin(interzoneFrame * 0.035 + wisp.curl) * 0.65;
    wisp.y += wisp.vy;
    wisp.radius *= 1.015;
    wisp.life *= 0.972;
    const haze = canvasContext.createRadialGradient(wisp.x, wisp.y, 0, wisp.x, wisp.y, wisp.radius);
    haze.addColorStop(0, hsla(wisp.hue + 24, 84, 64, wisp.life * 0.16));
    haze.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = haze;
    canvasContext.fillRect(wisp.x - wisp.radius, wisp.y - wisp.radius, wisp.radius * 2, wisp.radius * 2);
  });
  canvasContext.restore();
}

function drawInterzoneScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  interzoneFrame += fireworkSpeedMultiplier() * (0.7 + midsEnergy * 0.6);
  setupInterzoneFigures(width, height);
  drawInterzoneBackground(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
  interzoneFigures.forEach((figure, index) => {
    const intensity = intensities[index % intensities.length];
    spawnInterzoneEmission(figure, intensity, width, height);
    drawInterzoneFigure(canvasContext, figure, intensity, bassEnergy, trebleEnergy, width, height);
  });
  drawInterzoneEmissions(canvasContext, width, height, bassEnergy);
}

function drawInterzoneOraclesFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.43);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.36);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.5);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.46));
  drawInterzoneScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

function sunflowerAccent(index, intensity) {
  const theme = themeSelect.value;
  if (theme === "ice") return 42 + intensity * 16 + index * 2;
  if (theme === "ember") return 26 + intensity * 20 + index * 2;
  if (theme === "pressure") return 322 + intensity * 42 + index * 8;
  if (theme === "spectrum") return 42 + index * 38 + intensity * 34;
  return 44 + index * 3 + intensity * 18;
}

function setupSunflowers(width, height) {
  const desired = Math.max(3, Math.min(14, handCountValueNumber()));
  if (sunflowerFaces.length === desired) return;
  sunflowerFaces = Array.from({ length: desired }, (_, index) => {
    const lane = desired === 1 ? 0.5 : index / (desired - 1);
    const foreground = index % 3 !== 1;
    return {
      index,
      x: width * (0.08 + lane * 0.84),
      groundY: height * (foreground ? 0.92 : 0.82),
      height: height * (foreground ? 0.34 + (index % 4) * 0.035 : 0.26 + (index % 2) * 0.025),
      phase: Math.random() * Math.PI * 2,
      lean: (Math.random() - 0.5) * 0.14,
      memory: 0.16,
      foreground,
    };
  });
}

function drawSunflowerLandscape(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const scene = fireworkFormSelect.value;
  const skyTop = scene === "sunset" ? "#ffc0b9" : scene === "morning" ? "#ffd4d7" : "#f8b7d0";
  const skyLow = scene === "sunset" ? "#ffd98d" : scene === "morning" ? "#ffe7dc" : "#fcd5d8";
  const sky = canvasContext.createLinearGradient(0, 0, 0, height * 0.7);
  sky.addColorStop(0, skyTop);
  sky.addColorStop(1, skyLow);
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  for (let cloud = 0; cloud < 5; cloud += 1) {
    const cloudX = ((width * (cloud * 0.26 - 0.1) + sunflowerFrame * (0.18 + cloud * 0.025)) % (width * 1.25)) - width * 0.12;
    const cloudY = height * (0.12 + (cloud % 3) * 0.085 + Math.sin(sunflowerFrame * 0.008 + cloud) * 0.012);
    const scale = width * (0.055 + (cloud % 2) * 0.022 + trebleEnergy * 0.012);
    canvasContext.fillStyle = `rgba(255, 255, 255, ${0.68 + trebleEnergy * 0.18})`;
    [[0, 0, 1], [0.62, -0.22, 0.82], [1.22, 0.02, 0.7], [-0.52, 0.14, 0.62]].forEach(([dx, dy, size]) => {
      canvasContext.beginPath();
      canvasContext.arc(cloudX + dx * scale, cloudY + dy * scale, scale * size, 0, Math.PI * 2);
      canvasContext.fill();
    });
  }

  const hills = canvasContext.createLinearGradient(0, height * 0.46, 0, height);
  hills.addColorStop(0, "#89cc75");
  hills.addColorStop(0.42, "#52a84f");
  hills.addColorStop(1, "#1b6135");
  canvasContext.fillStyle = hills;
  canvasContext.beginPath();
  canvasContext.moveTo(0, height);
  canvasContext.lineTo(0, height * 0.58);
  for (let point = 0; point <= 12; point += 1) {
    const x = width * point / 12;
    const y = height * (0.57 + Math.sin(point * 1.34 + sunflowerFrame * 0.004) * 0.035 - midsEnergy * 0.012);
    canvasContext.lineTo(x, y);
  }
  canvasContext.lineTo(width, height);
  canvasContext.closePath();
  canvasContext.fill();

  const pondX = width * 0.55;
  const pondY = height * 0.7;
  const pondWidth = width * (0.34 + bassEnergy * 0.035);
  const pondHeight = height * 0.1;
  const pond = canvasContext.createRadialGradient(pondX, pondY, 0, pondX, pondY, pondWidth);
  pond.addColorStop(0, "#8ce2df");
  pond.addColorStop(0.56, "#42acbb");
  pond.addColorStop(1, "#237375");
  canvasContext.fillStyle = pond;
  canvasContext.beginPath();
  canvasContext.ellipse(pondX, pondY, pondWidth, pondHeight, -0.05, 0, Math.PI * 2);
  canvasContext.fill();
  for (let ripple = 0; ripple < 4; ripple += 1) {
    canvasContext.strokeStyle = `rgba(245, 255, 255, ${0.22 + trebleEnergy * 0.15})`;
    canvasContext.lineWidth = 1.2;
    canvasContext.beginPath();
    canvasContext.ellipse(pondX + Math.sin(ripple + sunflowerFrame * 0.02) * pondWidth * 0.4, pondY, pondWidth * (0.12 + ripple * 0.16), pondHeight * (0.12 + ripple * 0.14), 0, 0, Math.PI * 2);
    canvasContext.stroke();
  }

  canvasContext.fillStyle = `rgba(250, 230, 120, ${0.18 + bassEnergy * 0.22})`;
  for (let fleck = 0; fleck < 46; fleck += 1) {
    const x = (fleck * 97 + sunflowerFrame * 0.22) % width;
    const y = height * (0.63 + ((fleck * 23) % 32) / 100);
    canvasContext.beginPath();
    canvasContext.arc(x, y, 1 + (fleck % 3), 0, Math.PI * 2);
    canvasContext.fill();
  }
}

function drawSunflowerExpression(canvasContext, radius, intensity, trebleEnergy, phase) {
  const smileDial = clampNumber(spectrumPad.smilesDecadence, 0, 1);
  const insanityDial = clampNumber(spectrumPad.psychedeliaInsanity, 0, 1);
  const instability = Math.sin(sunflowerFrame * (0.035 + insanityDial * 0.12) + phase * 2.3) * insanityDial * 0.38;
  const expression = clampNumber(intensity + smileDial * 0.48 + instability, 0, 1);
  const smile = expression < 0.2 ? "sleepy" : expression < 0.48 ? "smile" : expression < 0.78 ? "laugh" : "surprise";
  const wink = Math.sin(sunflowerFrame * 0.035 + phase) > 0.94 && trebleEnergy > 0.22;
  canvasContext.strokeStyle = "rgba(55, 33, 20, 0.9)";
  canvasContext.fillStyle = "rgba(48, 29, 18, 0.92)";
  canvasContext.lineWidth = Math.max(1.4, radius * 0.055);
  canvasContext.lineCap = "round";

  [-1, 1].forEach((side, eyeIndex) => {
    const eyeX = side * radius * 0.28;
    const closed = wink && eyeIndex === 1;
    if (closed || smile === "sleepy") {
      canvasContext.beginPath();
      canvasContext.arc(eyeX, -radius * 0.12, radius * 0.11, 0.15 * Math.PI, 0.85 * Math.PI);
      canvasContext.stroke();
    } else {
      canvasContext.beginPath();
      canvasContext.arc(eyeX, -radius * 0.12, radius * (0.07 + trebleEnergy * 0.025), 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.fillStyle = "rgba(255, 255, 255, 0.84)";
      canvasContext.beginPath();
      canvasContext.arc(eyeX - radius * 0.024, -radius * 0.15, radius * 0.018, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.fillStyle = "rgba(48, 29, 18, 0.92)";
    }
  });
  canvasContext.beginPath();
  if (smile === "surprise") {
    canvasContext.fillStyle = "rgba(121, 41, 47, 0.8)";
    canvasContext.ellipse(0, radius * 0.25, radius * 0.14, radius * 0.2, 0, 0, Math.PI * 2);
    canvasContext.fill();
  } else if (smile === "laugh") {
    canvasContext.fillStyle = "rgba(121, 41, 47, 0.84)";
    canvasContext.arc(0, radius * 0.12, radius * 0.28, 0, Math.PI);
    canvasContext.closePath();
    canvasContext.fill();
  } else {
    canvasContext.arc(0, radius * 0.08, radius * (smile === "smile" ? 0.29 : 0.2), 0.12 * Math.PI, 0.88 * Math.PI);
    canvasContext.stroke();
  }
}

function drawSunflower(canvasContext, flower, intensity, bassEnergy, trebleEnergy, width, height) {
  flower.memory += (intensity - flower.memory) * 0.14;
  const scale = handSizeMultiplier() * (flower.foreground ? 1 : 0.75);
  const breeze = Math.sin(sunflowerFrame * (0.022 + fireworkSpeedMultiplier() * 0.012) + flower.phase) * (0.06 + bassEnergy * 0.14) + flower.lean;
  const stalkHeight = flower.height * (0.82 + flower.memory * 0.32);
  const faceX = flower.x + Math.sin(breeze) * stalkHeight * 0.34;
  const faceY = flower.groundY - Math.cos(breeze) * stalkHeight;
  const radius = Math.min(width, height) * (0.055 + flower.memory * 0.026) * scale;
  const hue = sunflowerAccent(flower.index, intensity);

  canvasContext.strokeStyle = hsla(108 + trebleEnergy * 16, 62, 32 + intensity * 18, 0.96);
  canvasContext.lineWidth = Math.max(3, radius * 0.18);
  canvasContext.lineCap = "round";
  canvasContext.beginPath();
  canvasContext.moveTo(flower.x, flower.groundY);
  canvasContext.bezierCurveTo(flower.x - breeze * stalkHeight * 0.35, flower.groundY - stalkHeight * 0.35, faceX - radius * 0.2, faceY + radius * 1.2, faceX, faceY);
  canvasContext.stroke();

  canvasContext.fillStyle = hsla(112, 66, 39 + intensity * 12, 0.9);
  [-1, 1].forEach((side) => {
    const leafY = flower.groundY - stalkHeight * (side === 1 ? 0.36 : 0.55);
    const leafX = flower.x + side * radius * 0.38;
    canvasContext.beginPath();
    canvasContext.moveTo(leafX, leafY);
    canvasContext.quadraticCurveTo(leafX + side * radius * 1.1, leafY - radius * 0.45, leafX + side * radius * 1.2, leafY + radius * 0.24);
    canvasContext.quadraticCurveTo(leafX + side * radius * 0.44, leafY + radius * 0.38, leafX, leafY);
    canvasContext.fill();
  });

  canvasContext.save();
  canvasContext.translate(faceX, faceY);
  canvasContext.rotate(breeze * 0.6);
  const petals = 17;
  for (let petal = 0; petal < petals; petal += 1) {
    const angle = petal / petals * Math.PI * 2 + Math.sin(sunflowerFrame * 0.02 + flower.phase) * 0.03;
    canvasContext.save();
    canvasContext.rotate(angle);
    canvasContext.fillStyle = hsla(hue + petal % 3 * 5, 94, 54 + intensity * 13, 0.96);
    canvasContext.beginPath();
    canvasContext.ellipse(0, -radius * 1.14, radius * (0.23 + intensity * 0.04), radius * (0.62 + bassEnergy * 0.12), 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();
  }
  const centre = canvasContext.createRadialGradient(-radius * 0.2, -radius * 0.25, radius * 0.08, 0, 0, radius);
  centre.addColorStop(0, "#d89144");
  centre.addColorStop(0.58, "#9a5a27");
  centre.addColorStop(1, "#633719");
  canvasContext.fillStyle = centre;
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius, 0, Math.PI * 2);
  canvasContext.fill();
  drawSunflowerExpression(canvasContext, radius, flower.memory, trebleEnergy, flower.phase);
  canvasContext.restore();
}

function spawnSunflowerInsect(width, height, trebleEnergy) {
  const abundance = handGraspAmount();
  if (sunflowerInsects.length >= 54 || Math.random() > (0.008 + trebleEnergy * (0.08 + abundance * 0.12)) * fireworkSpeedMultiplier()) return;
  const type = Math.random() < 0.38 ? "butterfly" : Math.random() < 0.72 ? "bee" : "ladybird";
  sunflowerInsects.push({
    type,
    x: Math.random() * width,
    y: height * (0.28 + Math.random() * 0.48),
    vx: (Math.random() - 0.5) * (1.3 + trebleEnergy * 2.8),
    vy: (Math.random() - 0.5) * 0.8,
    phase: Math.random() * Math.PI * 2,
    life: 1,
    hue: 35 + Math.random() * 265,
    size: 3.5 + Math.random() * 6 + trebleEnergy * 4,
  });
}

function drawSunflowerInsects(canvasContext, width, height, midsEnergy, trebleEnergy) {
  sunflowerInsects = sunflowerInsects.filter((insect) => insect.life > 0.02);
  sunflowerInsects.forEach((insect) => {
    insect.x += insect.vx + Math.sin(sunflowerFrame * 0.07 + insect.phase) * (0.7 + trebleEnergy * 1.8);
    insect.y += insect.vy + Math.cos(sunflowerFrame * 0.052 + insect.phase) * (0.45 + midsEnergy * 0.75);
    insect.life -= 0.0018;
    if (insect.x < -18) insect.x = width + 18;
    if (insect.x > width + 18) insect.x = -18;
    if (insect.y < height * 0.14 || insect.y > height * 0.88) insect.vy *= -1;
    canvasContext.save();
    canvasContext.translate(insect.x, insect.y);
    if (insect.type === "butterfly") {
      const flap = 0.3 + Math.abs(Math.sin(sunflowerFrame * 0.18 + insect.phase)) * 0.7;
      canvasContext.fillStyle = hsla(insect.hue, 88, 68, insect.life * 0.86);
      canvasContext.beginPath();
      canvasContext.ellipse(-insect.size * 0.52, 0, insect.size * flap, insect.size, -0.35, 0, Math.PI * 2);
      canvasContext.ellipse(insect.size * 0.52, 0, insect.size * flap, insect.size, 0.35, 0, Math.PI * 2);
      canvasContext.fill();
    } else {
      canvasContext.fillStyle = insect.type === "bee" ? "#f2c339" : "#ee504a";
      canvasContext.beginPath();
      canvasContext.ellipse(0, 0, insect.size, insect.size * 0.58, 0, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.fillStyle = "rgba(255, 255, 255, 0.58)";
      canvasContext.beginPath();
      canvasContext.ellipse(-insect.size * 0.1, -insect.size * 0.62, insect.size * 0.56, insect.size * 0.35, -0.4, 0, Math.PI * 2);
      canvasContext.ellipse(insect.size * 0.34, -insect.size * 0.52, insect.size * 0.56, insect.size * 0.35, 0.3, 0, Math.PI * 2);
      canvasContext.fill();
    }
    canvasContext.restore();
  });
}

function drawSunflowerScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  sunflowerFrame += fireworkSpeedMultiplier() * (0.72 + midsEnergy * 0.46);
  setupSunflowers(width, height);
  drawSunflowerLandscape(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
  sunflowerFaces
    .slice()
    .sort((a, b) => a.groundY - b.groundY)
    .forEach((flower, index) => drawSunflower(canvasContext, flower, intensities[index % intensities.length], bassEnergy, trebleEnergy, width, height));
  spawnSunflowerInsect(width, height, trebleEnergy);
  drawSunflowerInsects(canvasContext, width, height, midsEnergy, trebleEnergy);
}

function drawSunflowerSmilesFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.36);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.34);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.48);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.4));
  drawSunflowerScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

function setupRoseUnits(width, height) {
  const perSide = Math.max(3, Math.min(14, handCountValueNumber()));
  if (roseUnits.length === perSide * 2) return;
  const makeUnit = (side, index) => ({
    side,
    index,
    x: width * (0.12 + Math.random() * 0.76),
    y: height * (0.34 + Math.random() * 0.5),
    homeX: width * (0.12 + Math.random() * 0.76),
    homeY: height * (0.34 + Math.random() * 0.5),
    driftX: width * (0.12 + Math.random() * 0.76),
    driftY: height * (0.34 + Math.random() * 0.5),
    sprout: Math.random(),
    vx: 0,
    vy: 0,
    phase: Math.random() * Math.PI * 2,
    mettle: 0.15 + Math.random() * 0.2,
    affection: Math.random(),
    impact: 0,
  });
  roseUnits = [
    ...Array.from({ length: perSide }, (_, index) => makeUnit("lancaster", index)),
    ...Array.from({ length: perSide }, (_, index) => makeUnit("york", index)),
  ];
}

function roseColour(side, alpha = 1) {
  return side === "lancaster" ? `rgba(186, 18, 42, ${alpha})` : `rgba(245, 244, 231, ${alpha})`;
}

function roseAccent(side, alpha = 1) {
  return side === "lancaster" ? `rgba(255, 84, 92, ${alpha})` : `rgba(170, 174, 164, ${alpha})`;
}

function roseTarget(unit, width, height, bassEnergy, midsEnergy) {
  const mode = fireworkFormSelect.value;
  const perSide = roseUnits.length / 2;
  const rank = unit.index / Math.max(1, perSide - 1);
  const sideSign = unit.side === "lancaster" ? 1 : -1;
  const lane = Math.sin(unit.phase + roseFrame * 0.006) * 0.5 + 0.5;
  const rove = Math.sin(roseFrame * 0.011 + unit.phase * 1.7);
  if (mode === "verona") {
    const beloved = roseUnits.find((candidate) => candidate.side !== unit.side && candidate.index === unit.index)
      || roseUnits.find((candidate) => candidate.side !== unit.side);
    const orbit = roseFrame * 0.015 + unit.phase;
    if (beloved) {
      return {
        x: beloved.x + Math.cos(orbit) * width * (0.045 + unit.affection * 0.035 + bassEnergy * 0.025),
        y: beloved.y + Math.sin(orbit) * height * (0.055 + unit.affection * 0.035 + midsEnergy * 0.02),
      };
    }
  }
  if (mode === "pincer") {
    const flank = unit.index % 2 === 0 ? -1 : 1;
    return {
      x: width * (0.32 + lane * 0.36 + sideSign * flank * (0.04 + bassEnergy * 0.04)),
      y: height * (0.28 + rank * 0.58 + flank * (0.08 + midsEnergy * 0.05)),
    };
  }
  if (mode === "crownmelee") {
    const angle = rank * Math.PI * 2 + (unit.side === "lancaster" ? 0 : Math.PI) + roseFrame * (0.006 + bassEnergy * 0.01);
    return {
      x: width * 0.5 + Math.cos(angle) * width * (0.2 + bassEnergy * 0.08 + unit.affection * 0.06),
      y: height * 0.55 + Math.sin(angle) * height * (0.24 + midsEnergy * 0.05),
    };
  }
  return {
    x: unit.homeX + rove * width * (0.08 + bassEnergy * 0.07) + sideSign * Math.sin(roseFrame * 0.007 + rank * 5) * width * 0.035,
    y: unit.homeY + Math.cos(roseFrame * 0.01 + unit.phase) * height * (0.045 + midsEnergy * 0.06),
  };
}

function drawRoseBattlefield(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const mode = fireworkFormSelect.value;
  const sky = canvasContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, mode === "verona" ? "#f6d8dd" : "#d7d3cb");
  sky.addColorStop(0.52, mode === "verona" ? "#dec6b7" : "#b8b7aa");
  sky.addColorStop(1, "#58684b");
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.fillStyle = `rgba(255, 255, 255, ${0.04 + trebleEnergy * 0.06})`;
  for (let mist = 0; mist < 6; mist += 1) {
    const y = height * (0.16 + mist * 0.1);
    canvasContext.beginPath();
    canvasContext.ellipse((roseFrame * (0.22 + mist * 0.04) + mist * width * 0.19) % (width * 1.2) - width * 0.1, y, width * 0.24, height * 0.035, 0, 0, Math.PI * 2);
    canvasContext.fill();
  }

  canvasContext.fillStyle = mode === "verona" ? "#3f6d43" : "#303a2f";
  canvasContext.beginPath();
  canvasContext.moveTo(0, height);
  canvasContext.lineTo(0, height * 0.72);
  for (let point = 0; point <= 10; point += 1) {
    canvasContext.lineTo(width * point / 10, height * (0.7 + Math.sin(point * 1.3 + roseFrame * 0.006) * 0.035 + bassEnergy * 0.025));
  }
  canvasContext.lineTo(width, height);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(0, 0, 0, 0.18)";
  canvasContext.fillRect(0, height * 0.84, width, height * 0.16);
  if (mode === "verona") {
    canvasContext.fillStyle = "rgba(255, 255, 255, 0.16)";
    for (let balcony = 0; balcony < 2; balcony += 1) {
      const x = width * (balcony === 0 ? 0.12 : 0.77);
      const y = height * 0.26;
      canvasContext.fillRect(x, y, width * 0.11, height * 0.18);
      canvasContext.fillStyle = "rgba(60, 45, 42, 0.28)";
      canvasContext.fillRect(x - width * 0.01, y + height * 0.16, width * 0.13, height * 0.018);
      canvasContext.fillStyle = "rgba(255, 255, 255, 0.16)";
    }
  }
  canvasContext.strokeStyle = `rgba(245, 244, 231, ${0.06 + trebleEnergy * 0.08})`;
  canvasContext.lineWidth = 1;
  for (let line = 0; line < 5; line += 1) {
    canvasContext.beginPath();
    canvasContext.moveTo(0, height * (0.48 + line * 0.09));
    canvasContext.quadraticCurveTo(width * 0.5, height * (0.46 + line * 0.09 + bassEnergy * 0.03), width, height * (0.48 + line * 0.09));
    canvasContext.stroke();
  }
}

function drawHeraldicRose(canvasContext, side, x, y, radius, rotation, intensity) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(rotation);
  const primary = roseColour(side, 0.96);
  const edge = roseAccent(side, 0.92);
  for (let petal = 0; petal < 10; petal += 1) {
    const angle = petal / 10 * Math.PI * 2;
    canvasContext.save();
    canvasContext.rotate(angle);
    canvasContext.fillStyle = petal % 2 === 0 ? primary : edge;
    canvasContext.beginPath();
    canvasContext.ellipse(0, -radius * 0.58, radius * (0.26 + intensity * 0.04), radius * 0.62, 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();
  }
  canvasContext.fillStyle = side === "lancaster" ? "rgba(85, 8, 20, 0.9)" : "rgba(92, 92, 84, 0.9)";
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = "rgba(229, 196, 92, 0.88)";
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius * 0.11, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawRoseUnit(canvasContext, unit, intensity, bassEnergy, width, height) {
  const scale = handSizeMultiplier();
  const radius = Math.min(width, height) * (0.026 + intensity * 0.012) * scale;
  const bob = Math.sin(roseFrame * (0.04 + intensity * 0.03) + unit.phase) * radius * (0.2 + bassEnergy);
  const flagHeight = radius * (2.2 + intensity * 0.7);

  canvasContext.strokeStyle = "rgba(36, 31, 27, 0.78)";
  canvasContext.lineWidth = Math.max(1, radius * 0.13);
  canvasContext.beginPath();
  canvasContext.moveTo(unit.x, unit.y + radius * 1.8);
  canvasContext.lineTo(unit.x, unit.y - flagHeight);
  canvasContext.stroke();

  canvasContext.fillStyle = roseColour(unit.side, 0.82);
  canvasContext.beginPath();
  canvasContext.moveTo(unit.x, unit.y - flagHeight);
  canvasContext.lineTo(unit.x + (unit.side === "lancaster" ? 1 : -1) * radius * 1.7, unit.y - flagHeight * (0.84 + intensity * 0.08));
  canvasContext.lineTo(unit.x, unit.y - flagHeight * 0.68);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.globalAlpha = 0.45;
  canvasContext.fillStyle = "rgba(0, 0, 0, 0.5)";
  canvasContext.beginPath();
  canvasContext.ellipse(unit.x, unit.y + radius * 1.95, radius * 1.5, radius * 0.34, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.globalAlpha = 1;

  drawHeraldicRose(canvasContext, unit.side, unit.x, unit.y + bob, radius * (1 + unit.impact * 0.12), roseFrame * 0.015 + unit.phase, intensity + unit.impact * 0.4);

  unit.impact *= 0.88;
}

function throwRosePetals(x, y, side, force) {
  const count = 4 + Math.round(force * 18);
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * (2.8 + force * 3);
    rosePetals.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      side,
      life: 1,
      size: 2 + Math.random() * 4 + force * 3,
      spin: (Math.random() - 0.5) * 0.2,
      angle: Math.random() * Math.PI * 2,
    });
  }
}

function sproutRoseBloom(width, height, side, force) {
  rosePetals.push({
    x: width * (0.08 + Math.random() * 0.84),
    y: height * (0.3 + Math.random() * 0.56),
    vx: (Math.random() - 0.5) * (0.6 + force),
    vy: -0.1 - Math.random() * 0.7,
    side,
    life: 1.35,
    size: Math.min(width, height) * (0.014 + Math.random() * 0.024 + force * 0.018) * handSizeMultiplier(),
    spin: (Math.random() - 0.5) * 0.06,
    angle: Math.random() * Math.PI * 2,
    bloom: true,
  });
}

function throwRoseJuice(x, y, side, force) {
  const count = 8 + Math.round(force * 36);
  for (let drop = 0; drop < count; drop += 1) {
    const angle = -Math.PI * 0.88 + Math.random() * Math.PI * 1.76;
    const speed = 1.4 + Math.random() * (3.8 + force * 8.5);
    rosePetals.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - force * 0.8,
      side,
      life: 0.9 + Math.random() * 0.5,
      size: 2 + Math.random() * (4 + force * 5),
      spin: (Math.random() - 0.5) * 0.08,
      angle: Math.random() * Math.PI * 2,
      juice: true,
    });
  }
  if (force > 0.72) {
    for (let bloom = 0; bloom < 3 + Math.floor(force * 5); bloom += 1) {
      rosePetals.push({
        x: x + (Math.random() - 0.5) * force * 70,
        y: y + (Math.random() - 0.5) * force * 52,
        vx: (Math.random() - 0.5) * force * 5,
        vy: -Math.random() * force * 4,
        side,
        life: 1.1,
        size: 5 + Math.random() * (8 + force * 14),
        spin: (Math.random() - 0.5) * 0.18,
        angle: Math.random() * Math.PI * 2,
        juice: true,
      });
    }
  }
}

function slashRoseSword(x, y, side, force) {
  const direction = side === "lancaster" ? 1 : -1;
  const count = force > 0.82 ? 2 + Math.floor(force * 2) : 1;
  for (let slash = 0; slash < count; slash += 1) {
    roseSlashes.push({
      x: x + (Math.random() - 0.5) * force * 34,
      y: y + (Math.random() - 0.5) * force * 28,
      side,
      angle: (direction > 0 ? -0.52 : Math.PI + 0.52) + (Math.random() - 0.5) * (0.5 + force * 0.45),
      span: 0.62 + Math.random() * (0.62 + force * 0.72),
      radius: 22 + force * 82 + Math.random() * 54,
      life: 1.15,
    });
  }
}

function drawRosePetals(canvasContext, width, height, bassEnergy) {
  rosePetals = rosePetals.filter((petal) => petal.life > 0.02 && petal.y < height + 40);
  rosePetals.forEach((petal) => {
    petal.x += petal.vx;
    petal.y += petal.vy;
    petal.vx *= 0.987;
    petal.vy += 0.035 + bassEnergy * 0.06;
    petal.angle += petal.spin;
    petal.life *= 0.982;
    canvasContext.save();
    canvasContext.translate(petal.x, petal.y);
    canvasContext.rotate(petal.angle);
    if (petal.bloom) {
      drawHeraldicRose(canvasContext, petal.side, 0, 0, petal.size * Math.min(1, petal.life), 0, 0.32 + bassEnergy);
    } else if (petal.juice) {
      canvasContext.fillStyle = roseColour(petal.side, Math.min(0.92, petal.life));
      canvasContext.beginPath();
      canvasContext.ellipse(0, 0, petal.size * 1.4, petal.size * 0.62, 0, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.fillStyle = roseAccent(petal.side, petal.life * 0.45);
      canvasContext.beginPath();
      canvasContext.arc(petal.size * 0.12, -petal.size * 0.1, petal.size * 0.28, 0, Math.PI * 2);
      canvasContext.fill();
    } else {
      canvasContext.fillStyle = roseColour(petal.side, petal.life * 0.88);
      canvasContext.beginPath();
      canvasContext.ellipse(0, 0, petal.size, petal.size * 0.42, 0, 0, Math.PI * 2);
      canvasContext.fill();
    }
    canvasContext.restore();
  });
}

function drawRoseSlashes(canvasContext) {
  roseSlashes = roseSlashes.filter((slash) => slash.life > 0.03);
  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  roseSlashes.forEach((slash) => {
    slash.life *= 0.86;
    canvasContext.strokeStyle = `rgba(255, 255, 244, ${slash.life * 0.88})`;
    canvasContext.lineWidth = 1.4 + slash.life * 3.2;
    canvasContext.lineCap = "round";
    canvasContext.beginPath();
    canvasContext.arc(slash.x, slash.y, slash.radius, slash.angle - slash.span * 0.5, slash.angle + slash.span * 0.5);
    canvasContext.stroke();
    canvasContext.strokeStyle = `rgba(255, 255, 255, ${slash.life * 0.45})`;
    canvasContext.lineWidth = 1.1;
    canvasContext.beginPath();
    canvasContext.arc(slash.x, slash.y, slash.radius * 1.12, slash.angle - slash.span * 0.42, slash.angle + slash.span * 0.42);
    canvasContext.stroke();
    canvasContext.strokeStyle = roseColour(slash.side, slash.life * 0.42);
    canvasContext.lineWidth = 5 + slash.life * 7;
    canvasContext.beginPath();
    canvasContext.arc(slash.x, slash.y, slash.radius * 0.94, slash.angle - slash.span * 0.35, slash.angle + slash.span * 0.35);
    canvasContext.stroke();
  });
  canvasContext.restore();
}

function launchRosePageant(width, height, force) {
  const side = Math.random() < 0.5 ? "lancaster" : "york";
  const y = height * (0.34 + Math.random() * 0.5);
  const x = width * (0.15 + Math.random() * 0.7);
  for (let slash = 0; slash < 4 + Math.floor(force * 6); slash += 1) {
    slashRoseSword(x + (Math.random() - 0.5) * width * 0.46, y + (Math.random() - 0.5) * height * 0.28, side, force + Math.random() * 0.35);
  }
  for (let burst = 0; burst < 3 + Math.floor(force * 4); burst += 1) {
    const burstSide = burst % 2 === 0 ? side : (side === "lancaster" ? "york" : "lancaster");
    const bx = width * (0.08 + Math.random() * 0.84);
    const by = height * (0.28 + Math.random() * 0.58);
    throwRoseJuice(bx, by, burstSide, force + Math.random() * 0.35);
    sproutRoseBloom(width, height, burstSide, force + Math.random() * 0.22);
  }
}

function drawWarOfRosesScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const march = fireworkSpeedMultiplier();
  const belligerence = handGraspAmount();
  const mode = fireworkFormSelect.value;
  roseFrame += march * (0.72 + midsEnergy * 0.62);
  setupRoseUnits(width, height);
  drawRoseBattlefield(canvasContext, width, height, bassEnergy, trebleEnergy);
  if (Math.random() < (0.014 + bassEnergy * 0.05 + trebleEnergy * 0.025) * march && rosePetals.length < 180) {
    sproutRoseBloom(width, height, Math.random() < 0.5 ? "lancaster" : "york", 0.2 + bassEnergy + trebleEnergy * 0.35);
  }
  if (belligerence > 0.42 && Math.random() < (belligerence - 0.36) * (0.012 + bassEnergy * 0.04 + midsEnergy * 0.025) * march) {
    launchRosePageant(width, height, belligerence + bassEnergy * 0.65 + trebleEnergy * 0.25);
  }

  roseUnits.forEach((unit, index) => {
    const target = roseTarget(unit, width, height, bassEnergy, midsEnergy);
    const intensity = intensities[index % intensities.length];
    if (Math.random() < 0.004 * march + intensity * 0.01) {
      unit.homeX = width * (0.1 + Math.random() * 0.8);
      unit.homeY = height * (0.3 + Math.random() * 0.55);
    }
    const urgency = (0.006 + intensity * 0.015 + belligerence * 0.014) * march;
    unit.vx += (target.x - unit.x) * urgency;
    unit.vy += (target.y - unit.y) * urgency;
    unit.vx += Math.sin(roseFrame * 0.027 + unit.phase) * (0.035 + belligerence * 0.11 + intensity * 0.08);
    unit.vy += Math.cos(roseFrame * 0.024 + unit.phase) * (0.028 + belligerence * 0.07 + midsEnergy * 0.07);
    if (mode === "verona") {
      unit.vx += Math.sin(roseFrame * 0.04 + unit.phase * 2) * 0.18;
      unit.vy += Math.cos(roseFrame * 0.035 + unit.phase * 2) * 0.14;
    }
    unit.vx *= 0.9;
    unit.vy *= 0.9;
    unit.x += unit.vx;
    unit.y += unit.vy;
    if (unit.x < width * 0.04 || unit.x > width * 0.96) unit.vx *= -0.8;
    if (unit.y < height * 0.24 || unit.y > height * 0.9) unit.vy *= -0.8;
    unit.x = Math.max(width * 0.035, Math.min(width * 0.965, unit.x));
    unit.y = Math.max(height * 0.22, Math.min(height * 0.92, unit.y));
    unit.mettle = unit.mettle * 0.86 + intensity * 0.14;
  });

  const lancaster = roseUnits.filter((unit) => unit.side === "lancaster");
  const york = roseUnits.filter((unit) => unit.side === "york");
  lancaster.forEach((red) => {
    york.forEach((white) => {
      const distance = Math.hypot(red.x - white.x, red.y - white.y);
      const threshold = Math.min(width, height) * (0.06 + handSizeMultiplier() * 0.018 + (mode === "verona" ? 0.035 : 0));
      const clashChance = (belligerence * 0.025 + bassEnergy * 0.025 + red.mettle * 0.012 + white.mettle * 0.012 + (mode === "verona" ? 0.025 : 0)) * march;
      if (distance < threshold && Math.random() < clashChance) {
        red.impact = Math.min(1, red.impact + 0.8);
        white.impact = Math.min(1, white.impact + 0.8);
        const side = Math.random() < 0.5 ? "lancaster" : "york";
        const clashX = (red.x + white.x) * 0.5;
        const clashY = (red.y + white.y) * 0.5;
        const force = bassEnergy + belligerence;
        throwRosePetals(clashX, clashY, side, force);
        if (Math.random() < belligerence * (0.65 + bassEnergy * 0.45)) {
          slashRoseSword(clashX, clashY, side, force);
          throwRoseJuice(clashX, clashY, side, force);
        }
        if (mode === "verona" || Math.random() < 0.28 + trebleEnergy * 0.24) {
          sproutRoseBloom(width, height, Math.random() < 0.5 ? red.side : white.side, bassEnergy + trebleEnergy + belligerence);
        }
      }
    });
  });

  roseUnits
    .slice()
    .sort((a, b) => a.y - b.y)
    .forEach((unit, index) => drawRoseUnit(canvasContext, unit, intensities[index % intensities.length], bassEnergy, width, height));
  drawRosePetals(canvasContext, width, height, bassEnergy);
  drawRoseSlashes(canvasContext);
}

function drawWarOfRosesFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.36);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.34);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.44);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.4));
  drawWarOfRosesScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

function turtleSpectrumHue(progress, intensity) {
  const spectrum = themeSelect.value;
  if (spectrum === "ice") return 185 + progress * 72 + intensity * 24;
  if (spectrum === "ember") return 18 + progress * 42 + intensity * 22;
  if (spectrum === "pressure") return 320 - progress * 220 + intensity * 60;
  if (spectrum === "spectrum") return (280 - progress * 260 + intensity * 90 + 360) % 360;
  return 118 + progress * 64 + intensity * 24;
}

function setupPilotFish(width, height) {
  if (pilotFish) return;
  pilotFish = {
    pilot: true,
    x: width * 0.5,
    y: height * 0.5,
    vx: 0,
    vy: 0,
    angle: 0,
    wiggle: Math.random() * Math.PI * 2,
    sizeScale: 1.1,
    hueShift: 0.72,
    kind: "pilot",
    startled: 0,
    life: 1,
  };
}

function spawnRiverFish(width, height, index = riverFish.length) {
  const bounds = riverBounds(width, height, height * 0.2);
  riverFish.push({
    pilot: false,
    x: bounds.left + Math.random() * (bounds.right - bounds.left),
    y: height * (0.08 + Math.random() * 0.86),
    vx: (Math.random() - 0.5) * 2.2,
    vy: 0.4 + Math.random() * 1.8,
    angle: Math.random() * Math.PI * 2,
    wiggle: Math.random() * Math.PI * 2,
    sizeScale: 0.45 + Math.random() * 0.95,
    hueShift: Math.random(),
    kind: index % 4 === 0 ? "dart" : index % 4 === 1 ? "round" : index % 4 === 2 ? "stripe" : "silver",
    startled: 0,
    life: 1,
    phase: Math.random() * Math.PI * 2,
  });
}

function setupRiverFish(width, height) {
  const desired = Math.max(5, Math.min(26, Math.round(handCountValueNumber() * 1.7)));
  while (riverFish.length < desired) {
    spawnRiverFish(width, height);
  }
  if (riverFish.length > desired) {
    riverFish.splice(0, riverFish.length - desired);
  }
}

function setupRiverTurtles(width, height) {
  const desired = Math.max(3, Math.min(14, handCountValueNumber()));
  if (riverTurtles.length === desired) return;
  const moods = ["smug", "furious", "nervous", "sleepy", "grand"];
  riverTurtles = Array.from({ length: desired }, (_, index) => {
    const progress = desired === 1 ? 0.5 : index / (desired - 1);
    const stagger = ((index * 37) % 100) / 100;
    const y = height * (0.1 + progress * 0.8);
    const bounds = riverBounds(width, height, y);
    const lane = 0.14 + ((stagger + (index % 3) * 0.19) % 0.72);
    const side = lane < 0.5 ? -1 : 1;
    const x = bounds.left + (bounds.right - bounds.left) * lane;
    return {
      index,
      side,
      x,
      y,
      homeX: x,
      homeY: y,
      lane,
      laneDrift: (Math.random() - 0.5) * 0.16,
      phase: Math.random() * Math.PI * 2,
      angle: side < 0 ? 0.2 : Math.PI - 0.2,
      grievance: 0.15 + Math.random() * 0.24,
      mood: moods[index % moods.length],
      sizeScale: 0.86 + Math.random() * 0.34,
      shellPattern: index % 3,
      eyeBias: Math.random() * 0.5,
      behaviour: index % 4 === 0 ? "ambush" : index % 4 === 1 ? "chase" : index % 4 === 2 ? "patrol" : "snapper",
      targetFish: null,
      targetUntil: 0,
      jaw: 0,
      lunge: 0,
      ripple: 0,
    };
  });
}

function riverBounds(width, height, y) {
  const t = y / height;
  const wobble = Math.sin(t * Math.PI * 3 + turtleFrame * 0.006) * width * 0.035;
  const left = width * (0.18 + Math.sin(t * Math.PI * 1.7) * 0.045) + wobble;
  const right = width * (0.82 + Math.cos(t * Math.PI * 1.5) * 0.045) + wobble;
  return { left, right };
}

function clampToRiver(entity, width, height, margin, bounce = true) {
  const bounds = riverBounds(width, height, entity.y);
  const minX = bounds.left + margin;
  const maxX = bounds.right - margin;
  if (entity.x < minX) {
    entity.x = minX;
    if (bounce) entity.vx = Math.abs(entity.vx || 0) * 0.72;
  }
  if (entity.x > maxX) {
    entity.x = maxX;
    if (bounce) entity.vx = -Math.abs(entity.vx || 0) * 0.72;
  }
}

function wrapAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function easeAngle(current, target, amount) {
  return current + wrapAngle(target - current) * amount;
}

function drawRiverBankDetails(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const scene = fireworkFormSelect.value;
  const flowerHues = scene === "moonbank" ? [212, 278, 318] : scene === "rapids" ? [44, 92, 184] : [48, 322, 286, 12];
  canvasContext.save();
  for (let side = 0; side < 2; side += 1) {
    for (let i = 0; i < 28; i += 1) {
      const y = ((i * 89 + side * 47 + Math.sin(turtleFrame * 0.004 + i) * 9) % 100) / 100 * height;
      const bounds = riverBounds(width, height, y);
      const bankEdge = side === 0 ? bounds.left : bounds.right;
      const direction = side === 0 ? -1 : 1;
      const drift = Math.sin(i * 12.989 + side * 78.23) * 0.5 + 0.5;
      const x = bankEdge + direction * (width * (0.025 + drift * 0.115));
      const scale = Math.min(width, height) * (0.006 + (i % 5) * 0.0015);
      if (i % 4 === 0) {
        canvasContext.fillStyle = scene === "moonbank" ? "rgba(170, 180, 194, 0.66)" : "rgba(116, 109, 92, 0.72)";
        canvasContext.beginPath();
        canvasContext.ellipse(x, y, scale * 2.4, scale * 1.35, Math.sin(i) * 0.7, 0, Math.PI * 2);
        canvasContext.fill();
        canvasContext.fillStyle = "rgba(255, 255, 255, 0.12)";
        canvasContext.beginPath();
        canvasContext.ellipse(x - scale * 0.45, y - scale * 0.25, scale * 0.65, scale * 0.32, -0.4, 0, Math.PI * 2);
        canvasContext.fill();
      } else if (i % 4 === 1) {
        const hue = flowerHues[i % flowerHues.length] + trebleEnergy * 36;
        canvasContext.strokeStyle = "rgba(43, 82, 39, 0.8)";
        canvasContext.lineWidth = Math.max(1, scale * 0.28);
        canvasContext.beginPath();
        canvasContext.moveTo(x, y + scale * 2.8);
        canvasContext.quadraticCurveTo(x + direction * scale * 0.8, y + scale * 0.8, x, y);
        canvasContext.stroke();
        for (let petal = 0; petal < 5; petal += 1) {
          const angle = petal / 5 * Math.PI * 2 + turtleFrame * 0.012;
          canvasContext.fillStyle = hsla(hue, 84, 66 + bassEnergy * 10, 0.78);
          canvasContext.beginPath();
          canvasContext.ellipse(x + Math.cos(angle) * scale, y + Math.sin(angle) * scale, scale * 0.82, scale * 0.42, angle, 0, Math.PI * 2);
          canvasContext.fill();
        }
        canvasContext.fillStyle = "rgba(255, 234, 130, 0.9)";
        canvasContext.beginPath();
        canvasContext.arc(x, y, scale * 0.42, 0, Math.PI * 2);
        canvasContext.fill();
      } else {
        canvasContext.strokeStyle = scene === "moonbank" ? "rgba(103, 139, 126, 0.58)" : "rgba(92, 143, 75, 0.64)";
        canvasContext.lineWidth = Math.max(1, scale * 0.42);
        for (let blade = 0; blade < 4; blade += 1) {
          const lean = direction * (0.3 + blade * 0.16) + Math.sin(turtleFrame * 0.016 + i + blade) * 0.22;
          canvasContext.beginPath();
          canvasContext.moveTo(x, y + scale * 2);
          canvasContext.quadraticCurveTo(x + lean * scale * 2, y - scale * 0.8, x + lean * scale * 2.5, y - scale * (2.3 + bassEnergy * 1.4));
          canvasContext.stroke();
        }
      }
    }
  }
  canvasContext.restore();
}

function drawTurtleRiverWorld(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const scene = fireworkFormSelect.value;
  const bank = scene === "moonbank" ? "#172d26" : scene === "rapids" ? "#436638" : "#31552f";
  const waterTop = scene === "moonbank" ? "#092234" : scene === "rapids" ? "#147780" : "#166b70";
  const waterLow = scene === "moonbank" ? "#06121f" : scene === "rapids" ? "#6ed5d5" : "#1fa8a8";
  canvasContext.fillStyle = bank;
  canvasContext.fillRect(0, 0, width, height);
  drawRiverBankDetails(canvasContext, width, height, bassEnergy, trebleEnergy);

  canvasContext.beginPath();
  for (let step = 0; step <= 36; step += 1) {
    const y = height * step / 36;
    const bounds = riverBounds(width, height, y);
    if (step === 0) canvasContext.moveTo(bounds.left, y);
    else canvasContext.lineTo(bounds.left, y);
  }
  for (let step = 36; step >= 0; step -= 1) {
    const y = height * step / 36;
    const bounds = riverBounds(width, height, y);
    canvasContext.lineTo(bounds.right, y);
  }
  canvasContext.closePath();
  const water = canvasContext.createLinearGradient(0, 0, 0, height);
  water.addColorStop(0, waterTop);
  water.addColorStop(0.55, "#0f5967");
  water.addColorStop(1, waterLow);
  canvasContext.fillStyle = water;
  canvasContext.fill();

  canvasContext.strokeStyle = `rgba(230, 255, 250, ${0.16 + trebleEnergy * 0.22})`;
  canvasContext.lineWidth = 1.2;
  for (let stream = 0; stream < 22; stream += 1) {
    const y = (stream * height * 0.075 + turtleFrame * (0.45 + bassEnergy * 1.2)) % height;
    const bounds = riverBounds(width, height, y);
    const x = bounds.left + (bounds.right - bounds.left) * ((stream * 37) % 100) / 100;
    canvasContext.beginPath();
    canvasContext.moveTo(x - width * 0.035, y);
    canvasContext.quadraticCurveTo(x, y + height * 0.012, x + width * 0.055, y + height * 0.004);
    canvasContext.stroke();
  }
}

function drawPilotFish(canvasContext, fish, width, height, trebleEnergy) {
  const size = Math.min(width, height) * 0.035 * (fish.sizeScale || 1);
  fish.angle = Math.atan2(fish.vy, fish.vx || 1);
  const hue = turtleSpectrumHue(fish.hueShift ?? 0.72, trebleEnergy);
  canvasContext.save();
  canvasContext.translate(fish.x, fish.y);
  canvasContext.rotate(fish.angle);
  const wiggle = Math.sin(turtleFrame * 0.14 + fish.wiggle) * size * 0.22;
  canvasContext.fillStyle = hsla(hue, fish.kind === "silver" ? 34 : 84, fish.kind === "silver" ? 72 : 58 + fish.startled * 16, fish.pilot ? 0.98 : 0.82);
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, size * (fish.kind === "round" ? 1.1 : 1.45), size * (fish.kind === "dart" ? 0.48 : 0.66), 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = hsla(hue + 34, 90, 68, 0.92);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 1.24, 0);
  canvasContext.lineTo(-size * 2.05, -size * 0.72 + wiggle);
  canvasContext.lineTo(-size * 1.82, size * 0.62 + wiggle);
  canvasContext.closePath();
  canvasContext.fill();
  if (fish.kind === "stripe") {
    canvasContext.strokeStyle = "rgba(255, 255, 255, 0.55)";
    canvasContext.lineWidth = Math.max(1, size * 0.08);
    for (let stripe = -1; stripe <= 1; stripe += 1) {
      canvasContext.beginPath();
      canvasContext.moveTo(stripe * size * 0.32, -size * 0.48);
      canvasContext.lineTo(stripe * size * 0.12, size * 0.48);
      canvasContext.stroke();
    }
  }
  canvasContext.fillStyle = "rgba(255,255,255,0.9)";
  canvasContext.beginPath();
  canvasContext.arc(size * 0.72, -size * 0.18, size * 0.17, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = "rgba(5,10,12,0.92)";
  canvasContext.beginPath();
  canvasContext.arc(size * 0.77, -size * 0.16, size * 0.07, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawSnappingTurtle(canvasContext, turtle, width, height, intensity, bassEnergy) {
  const hunger = handSizeMultiplier();
  const munchiness = handGraspAmount();
  const size = Math.min(width, height) * (0.035 + hunger * 0.018 + intensity * 0.012) * (turtle.sizeScale || 1);
  const hue = turtleSpectrumHue(turtle.index / Math.max(1, riverTurtles.length - 1), intensity);
  const angle = turtle.angle ?? (pilotFish ? Math.atan2(pilotFish.y - turtle.y, pilotFish.x - turtle.x) : 0);
  const jaw = Math.max(turtle.jaw, Math.sin(turtleFrame * 0.12 + turtle.phase) * 0.2 + munchiness * intensity);
  const paddle = Math.sin(turtleFrame * (0.11 + intensity * 0.09) + turtle.phase);
  const blink = Math.max(0.15, Math.sin(turtleFrame * 0.025 + turtle.phase + turtle.eyeBias) > 0.94 ? 0.25 : 1);
  const headLift = turtle.mood === "grand" ? -size * 0.08 : turtle.mood === "sleepy" ? size * 0.06 : 0;
  canvasContext.save();
  canvasContext.translate(turtle.x, turtle.y);
  canvasContext.rotate(angle);

  canvasContext.fillStyle = hsla(hue + 8, 36, 20 + intensity * 11, 0.94);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 1.12, 0);
  canvasContext.lineTo(-size * 1.94, -size * 0.28 + paddle * size * 0.06);
  canvasContext.lineTo(-size * 1.72, size * 0.3 + paddle * size * 0.08);
  canvasContext.closePath();
  canvasContext.fill();

  const legPositions = [
    [-0.58, -0.66, -1],
    [0.56, -0.62, 1],
    [-0.58, 0.66, 1],
    [0.55, 0.62, -1],
  ];
  legPositions.forEach(([lx, ly, offset], legIndex) => {
    const kick = Math.sin(turtleFrame * (0.13 + intensity * 0.1) + turtle.phase + legIndex * 1.7) * offset;
    canvasContext.save();
    canvasContext.translate(size * lx, size * ly);
    canvasContext.rotate(kick * 0.48);
    canvasContext.fillStyle = hsla(hue + 18, 38, 25 + intensity * 16, 0.9);
    canvasContext.beginPath();
    canvasContext.ellipse(0, 0, size * 0.34, size * 0.16, 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();
  });

  canvasContext.fillStyle = hsla(hue, 42, 24 + intensity * 16, 0.96);
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, size * 1.25, size * 0.9, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.strokeStyle = hsla(hue + 28, 56, 48, 0.7);
  canvasContext.lineWidth = 2;
  canvasContext.stroke();
  canvasContext.strokeStyle = hsla(hue + 46, 58, 50 + intensity * 14, 0.32 + bassEnergy * 0.28);
  canvasContext.lineWidth = Math.max(1, size * 0.055);
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, size * 0.82, size * 0.56, 0, 0, Math.PI * 2);
  canvasContext.stroke();
  for (let seam = -1; seam <= 1; seam += 1) {
    canvasContext.beginPath();
    if (turtle.shellPattern === 0) {
      canvasContext.moveTo(-size * 0.72, seam * size * 0.22);
      canvasContext.quadraticCurveTo(0, seam * size * 0.44, size * 0.72, seam * size * 0.22);
    } else if (turtle.shellPattern === 1) {
      canvasContext.moveTo(seam * size * 0.24, -size * 0.54);
      canvasContext.quadraticCurveTo(seam * size * 0.42, 0, seam * size * 0.24, size * 0.54);
    } else {
      canvasContext.moveTo(-size * 0.58, seam * size * 0.34);
      canvasContext.lineTo(size * 0.58, -seam * size * 0.34);
    }
    canvasContext.stroke();
  }

  canvasContext.fillStyle = hsla(hue + 20, 45, 28 + bassEnergy * 20, 0.96);
  canvasContext.beginPath();
  canvasContext.ellipse(size * 1.15, headLift, size * 0.55, size * 0.42, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.strokeStyle = `rgba(250, 250, 220, ${0.6 + jaw * 0.28})`;
  canvasContext.lineWidth = Math.max(1, size * 0.09);
  canvasContext.beginPath();
  canvasContext.moveTo(size * 1.45, headLift - size * (0.12 + jaw * 0.32));
  canvasContext.lineTo(size * (1.92 + jaw * 0.55), headLift - size * (0.36 + jaw * 0.35));
  canvasContext.moveTo(size * 1.45, headLift + size * (0.12 + jaw * 0.32));
  canvasContext.lineTo(size * (1.92 + jaw * 0.55), headLift + size * (0.36 + jaw * 0.35));
  canvasContext.stroke();

  const eyeY = turtle.mood === "nervous" ? -size * 0.24 : -size * 0.2;
  canvasContext.fillStyle = turtle.mood === "furious" ? "rgba(255, 236, 190, 0.96)" : "rgba(245, 255, 236, 0.9)";
  canvasContext.beginPath();
  canvasContext.ellipse(size * 1.34, headLift + eyeY, size * 0.11, size * 0.08 * blink, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = turtle.mood === "sleepy" ? "rgba(20, 30, 20, 0.65)" : "rgba(0, 0, 0, 0.88)";
  canvasContext.beginPath();
  canvasContext.arc(size * (1.37 + jaw * 0.03), headLift + eyeY, size * 0.045, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.strokeStyle = turtle.mood === "furious" ? "rgba(45, 12, 8, 0.9)" : "rgba(9, 22, 15, 0.72)";
  canvasContext.lineWidth = Math.max(1, size * 0.055);
  canvasContext.beginPath();
  const browTilt = turtle.mood === "furious" ? 0.18 : turtle.mood === "smug" ? -0.12 : turtle.mood === "nervous" ? 0.06 : 0;
  canvasContext.moveTo(size * 1.22, headLift + eyeY - size * (0.16 + browTilt));
  canvasContext.lineTo(size * 1.5, headLift + eyeY - size * (0.1 - browTilt));
  canvasContext.stroke();
  canvasContext.restore();
}

function drawRiverRipples(canvasContext) {
  riverRipples = riverRipples.filter((ripple) => ripple.life > 0.02);
  riverRipples.forEach((ripple) => {
    ripple.life *= 0.94;
    ripple.radius += ripple.growth;
    canvasContext.strokeStyle = hsla(ripple.hue, 86, 72, ripple.life * 0.5);
    canvasContext.lineWidth = Math.max(1, ripple.life * 3);
    canvasContext.beginPath();
    canvasContext.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    canvasContext.stroke();
  });
}

function allRiverFish() {
  return [pilotFish, ...riverFish].filter(Boolean);
}

function nearestFish(turtle, fishList) {
  return fishList.reduce((nearest, fish) => {
    const distance = Math.hypot(turtle.x - fish.x, turtle.y - fish.y);
    if (!nearest || distance < nearest.distance) {
      return { fish, distance };
    }
    return nearest;
  }, null);
}

function updateShoalFish(width, height, bassEnergy, midsEnergy, trebleEnergy) {
  riverFish = riverFish.filter((fish) => fish.life > 0.02);
  setupRiverFish(width, height);
  riverFish.forEach((fish, index) => {
    const swim = 0.7 + fish.sizeScale * 0.6 + trebleEnergy * 1.4;
    fish.vx += Math.sin(turtleFrame * 0.035 + fish.phase) * 0.06 + (Math.random() - 0.5) * 0.04;
    fish.vy += 0.025 + bassEnergy * 0.06 + Math.cos(turtleFrame * 0.026 + fish.phase) * 0.04;
    if (index % 5 === 0 && pilotFish) {
      fish.vx += (pilotFish.x - fish.x) * 0.0008;
      fish.vy += (pilotFish.y - fish.y) * 0.0006;
    }
    fish.vx *= 0.96;
    fish.vy *= 0.965;
    fish.x += fish.vx * swim;
    fish.y += fish.vy * swim;
    clampToRiver(fish, width, height, Math.min(width, height) * (0.028 + fish.sizeScale * 0.018));
    if (fish.y > height * 0.96) {
      fish.y = height * 0.06;
      const resetBounds = riverBounds(width, height, fish.y);
      fish.x = resetBounds.left + Math.random() * Math.max(20, resetBounds.right - resetBounds.left);
      clampToRiver(fish, width, height, Math.min(width, height) * (0.028 + fish.sizeScale * 0.018), false);
    }
    if (fish.y < height * 0.04) fish.vy = Math.abs(fish.vy);
    fish.startled *= 0.86;
  });
}

function drawTurtleRiverScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const grievance = fireworkSpeedMultiplier();
  const hunger = handSizeMultiplier();
  const munchiness = handGraspAmount();
  turtleFrame += grievance * (0.8 + midsEnergy * 0.6);
  setupPilotFish(width, height);
  setupRiverTurtles(width, height);
  updateShoalFish(width, height, bassEnergy, midsEnergy, trebleEnergy);

  const acceleration = 0.22 + trebleEnergy * 0.12;
  if (asteroidKeys.has("KeyA")) pilotFish.vx -= acceleration;
  if (asteroidKeys.has("KeyD")) pilotFish.vx += acceleration;
  if (asteroidKeys.has("KeyW")) pilotFish.vy -= acceleration;
  if (asteroidKeys.has("KeyS")) pilotFish.vy += acceleration;
  pilotFish.vx *= 0.94;
  pilotFish.vy *= 0.94;
  pilotFish.y += (0.32 + bassEnergy * 1.4) * grievance;
  pilotFish.x += pilotFish.vx;
  pilotFish.y += pilotFish.vy;
  clampToRiver(pilotFish, width, height, Math.min(width, height) * 0.062);
  if (pilotFish.y > height * 0.94) pilotFish.y = height * 0.08;
  if (pilotFish.y < height * 0.06) pilotFish.y = height * 0.92;
  clampToRiver(pilotFish, width, height, Math.min(width, height) * 0.062);
  pilotFish.startled *= 0.88;
  const fishList = allRiverFish();

  riverTurtles.forEach((turtle, index) => {
    const intensity = intensities[index % intensities.length];
    const patrolBias = turtle.behaviour === "patrol" ? 0.88 : turtle.behaviour === "ambush" ? 0.34 : 0.08;
    if (turtleFrame > turtle.targetUntil || (turtle.targetFish && turtle.targetFish.life <= 0.02)) {
      const nearest = nearestFish(turtle, fishList);
      turtle.targetFish = Math.random() < patrolBias ? null : (nearest?.fish || pilotFish);
      turtle.targetUntil = turtleFrame + 22 + Math.random() * 44 + (turtle.behaviour === "patrol" ? 36 : 0);
    }
    const targetFish = turtle.targetFish;
    const bankBounds = riverBounds(width, height, turtle.y);
    const homeBounds = riverBounds(width, height, turtle.homeY);
    const laneTarget = Math.max(0.12, Math.min(0.88, turtle.lane + Math.sin(turtleFrame * 0.012 + turtle.phase) * (0.08 + turtle.laneDrift)));
    let targetX = homeBounds.left + (homeBounds.right - homeBounds.left) * laneTarget;
    let targetY = turtle.homeY + Math.cos(turtleFrame * 0.018 + turtle.phase) * height * (0.055 + intensity * 0.04);
    if (targetFish && turtle.behaviour !== "ambush") {
      const attackOffset = Math.sin(turtleFrame * 0.018 + turtle.phase) * width * (0.025 + (1 - munchiness) * 0.035);
      targetX = targetFish.x + attackOffset + (turtle.side * -1) * width * (0.02 + (1 - munchiness) * 0.04);
      targetY = targetFish.y + Math.sin(turtleFrame * 0.022 + turtle.phase) * height * (0.08 + index % 3 * 0.025);
    } else if (targetFish && turtle.behaviour === "ambush") {
      targetX = targetFish.x * 0.35 + (turtle.side < 0 ? bankBounds.left + 30 : bankBounds.right - 30) * 0.65;
      targetY = targetFish.y + Math.sin(turtleFrame * 0.015 + turtle.phase) * height * 0.06;
    }
    turtle.grievance = turtle.grievance * 0.88 + intensity * 0.12;
    const behaviourBoost = turtle.behaviour === "chase" ? 1.55 : turtle.behaviour === "snapper" ? 1.25 : turtle.behaviour === "ambush" ? 0.78 : 0.55;
    turtle.x += (targetX - turtle.x) * (0.002 + grievance * 0.002 + turtle.grievance * 0.012) * behaviourBoost;
    turtle.y += (targetY - turtle.y) * (0.004 + hunger * 0.002 + munchiness * 0.008) * behaviourBoost;
    turtle.x += Math.sin(turtleFrame * 0.035 + turtle.phase) * (0.4 + grievance * 0.35);
    riverTurtles.forEach((other, otherIndex) => {
      if (otherIndex === index) return;
      const distance = Math.hypot(turtle.x - other.x, turtle.y - other.y);
      const spread = Math.min(width, height) * (0.095 + hunger * 0.02);
      if (distance > 0 && distance < spread) {
        const push = (spread - distance) / spread * (0.5 + intensity * 0.7);
        turtle.x += (turtle.x - other.x) / distance * push;
        turtle.y += (turtle.y - other.y) / distance * push * 0.7;
      }
    });
    const desiredAngle = Math.atan2((targetFish?.y || targetY) - turtle.y, (targetFish?.x || targetX) - turtle.x);
    turtle.angle = easeAngle(turtle.angle ?? desiredAngle, desiredAngle, 0.045 + intensity * 0.055 + grievance * 0.02);
    turtle.y = Math.max(height * 0.08, Math.min(height * 0.92, turtle.y));
    clampToRiver(turtle, width, height, Math.min(width, height) * (0.076 + hunger * 0.034), false);
    const liveTarget = nearestFish(turtle, allRiverFish());
    const snapFish = liveTarget?.fish || pilotFish;
    const distance = liveTarget?.distance ?? Math.hypot(turtle.x - pilotFish.x, turtle.y - pilotFish.y);
    const snapRange = Math.min(width, height) * (0.055 + hunger * 0.022 + munchiness * 0.036);
    if (distance < snapRange && Math.random() < (0.04 + munchiness * 0.18 + bassEnergy * 0.1) * grievance) {
      turtle.jaw = 1;
      snapFish.startled = 1;
      snapFish.vx += (snapFish.x - turtle.x) / Math.max(1, distance) * (5 + munchiness * 4);
      snapFish.vy += (snapFish.y - turtle.y) / Math.max(1, distance) * (4 + hunger * 3);
      if (!snapFish.pilot && Math.random() < munchiness * 0.72 + hunger * 0.08) {
        snapFish.life = 0;
        riverRipples.push({ x: snapFish.x, y: snapFish.y, radius: 5, growth: 5 + munchiness * 8, life: 1.1, hue: turtleSpectrumHue(snapFish.hueShift, intensity) });
      } else if (snapFish.pilot && Math.random() < munchiness * 0.24) {
        snapFish.x = width * 0.5;
        snapFish.y = height * 0.1;
        riverRipples.push({ x: turtle.x, y: turtle.y, radius: 10, growth: 5 + munchiness * 7, life: 1.2, hue: turtleSpectrumHue(index / riverTurtles.length, intensity) });
      }
      riverRipples.push({ x: snapFish.x, y: snapFish.y, radius: 6, growth: 3 + munchiness * 5, life: 1, hue: turtleSpectrumHue(index / riverTurtles.length, intensity) });
    }
    turtle.jaw *= 0.78;
  });

  drawTurtleRiverWorld(canvasContext, width, height, bassEnergy, trebleEnergy);
  drawRiverRipples(canvasContext);
  riverTurtles.forEach((turtle, index) => drawSnappingTurtle(canvasContext, turtle, width, height, intensities[index % intensities.length], bassEnergy));
  riverFish.forEach((fish) => drawPilotFish(canvasContext, fish, width, height, trebleEnergy));
  drawPilotFish(canvasContext, pilotFish, width, height, trebleEnergy);
}

function drawTurtleRiverFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.34);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 54), 1.32);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.42);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.38));
  drawTurtleRiverScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

function cathedralHue(progress, intensity) {
  const glass = themeSelect.value;
  if (glass === "ice") return 190 + progress * 72 + intensity * 34;
  if (glass === "ember") return 12 + progress * 48 + intensity * 28;
  if (glass === "pressure") return 330 - progress * 250 + intensity * 78;
  if (glass === "spectrum") return (286 - progress * 286 + intensity * 96 + 360) % 360;
  return 150 + progress * 82 + intensity * 28;
}

function setupCathedralFigures(width, height) {
  const desired = Math.max(5, Math.min(28, handCountValueNumber() * 2));
  while (cathedralFigures.length < desired) {
    const index = cathedralFigures.length;
    cathedralFigures.push({
      x: width * (0.18 + Math.random() * 0.64),
      y: height * (0.64 + Math.random() * 0.26),
      lane: 0.2 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.28 + Math.random() * 0.82,
      heightScale: 0.65 + Math.random() * 0.8,
      hueShift: index / Math.max(1, desired - 1),
      sway: Math.random() * Math.PI * 2,
    });
  }
  if (cathedralFigures.length > desired) {
    cathedralFigures.splice(desired);
  }
}

function drawCathedralWindow(canvasContext, x, y, radius, petals, intensity, bassEnergy) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.globalCompositeOperation = "lighter";
  for (let ring = 0; ring < 3; ring += 1) {
    const ringRadius = radius * (0.38 + ring * 0.25);
    const count = petals + ring * 4;
    for (let petal = 0; petal < count; petal += 1) {
      const angle = petal / count * Math.PI * 2 + cathedralFrame * 0.004 * (ring + 1);
      const hue = cathedralHue((petal + ring) / count, intensity);
      canvasContext.fillStyle = hsla(hue, 92, 54 + intensity * 22, 0.22 + intensity * 0.28);
      canvasContext.beginPath();
      canvasContext.moveTo(Math.cos(angle) * ringRadius * 0.28, Math.sin(angle) * ringRadius * 0.28);
      canvasContext.ellipse(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, radius * 0.13, radius * (0.28 + bassEnergy * 0.18), angle, 0, Math.PI * 2);
      canvasContext.fill();
    }
  }
  canvasContext.globalCompositeOperation = "source-over";
  canvasContext.strokeStyle = "rgba(238, 222, 190, 0.48)";
  canvasContext.lineWidth = Math.max(1, radius * 0.035);
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius, 0, Math.PI * 2);
  canvasContext.stroke();
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
  canvasContext.stroke();
  canvasContext.restore();
}

function drawCathedralFigure(canvasContext, figure, width, height, intensity, trebleEnergy) {
  const depth = (figure.y - height * 0.58) / Math.max(1, height * 0.34);
  const size = Math.min(width, height) * (0.018 + depth * 0.026) * figure.heightScale;
  const hue = cathedralHue(figure.hueShift, intensity + trebleEnergy * 0.5);
  const sway = Math.sin(cathedralFrame * 0.035 + figure.sway) * size * (0.18 + intensity * 0.35);
  canvasContext.save();
  canvasContext.translate(figure.x + sway, figure.y);
  canvasContext.globalCompositeOperation = "lighter";
  const aura = canvasContext.createRadialGradient(0, -size * 0.8, 0, 0, -size * 0.8, size * 2.8);
  aura.addColorStop(0, hsla(hue, 96, 64, 0.16 + intensity * 0.22));
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = aura;
  canvasContext.fillRect(-size * 3, -size * 4, size * 6, size * 6);
  canvasContext.globalCompositeOperation = "source-over";
  canvasContext.fillStyle = hsla(hue, 88, 70, 0.74 + intensity * 0.18);
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 1.36, size * 0.36, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 1.06);
  canvasContext.quadraticCurveTo(size * 0.72, -size * 0.16, size * 0.48, size * 1.18);
  canvasContext.lineTo(-size * 0.5, size * 1.18);
  canvasContext.quadraticCurveTo(-size * 0.72, -size * 0.16, 0, -size * 1.06);
  canvasContext.fill();
  canvasContext.restore();
}

function drawCathedralOrganismScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const architecture = fireworkFormSelect.value;
  const breath = fireworkSpeedMultiplier();
  const flex = handSizeMultiplier();
  const sentience = handGraspAmount();
  cathedralFrame += breath * (0.82 + bassEnergy * 0.9 + midsEnergy * 0.34);
  setupCathedralFigures(width, height);

  const inhale = Math.sin(cathedralFrame * 0.035) * (0.5 + bassEnergy * 0.9) * flex;
  const livingLean = Math.sin(cathedralFrame * 0.018 + midsEnergy * 2) * width * 0.018 * sentience;
  const gloom = canvasContext.createLinearGradient(0, 0, 0, height);
  gloom.addColorStop(0, architecture === "ruinedabbey" ? "#110c15" : architecture === "byzantine" ? "#17101e" : "#080a12");
  gloom.addColorStop(0.5, architecture === "byzantine" ? "#24172a" : "#0d1320");
  gloom.addColorStop(1, "#020306");
  canvasContext.fillStyle = gloom;
  canvasContext.fillRect(0, 0, width, height);

  const vanishingY = height * (0.36 + bassEnergy * 0.04);
  const aisle = canvasContext.createLinearGradient(0, height * 0.45, 0, height);
  aisle.addColorStop(0, "rgba(58, 44, 52, 0.18)");
  aisle.addColorStop(1, "rgba(190, 126, 62, 0.2)");
  canvasContext.fillStyle = aisle;
  canvasContext.beginPath();
  canvasContext.moveTo(width * 0.43, vanishingY);
  canvasContext.lineTo(width * 0.57, vanishingY);
  canvasContext.lineTo(width * 0.78, height);
  canvasContext.lineTo(width * 0.22, height);
  canvasContext.closePath();
  canvasContext.fill();

  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 7; i += 1) {
      const depth = i / 6;
      const baseX = width * (0.5 + side * (0.12 + depth * 0.31));
      const baseY = height * (0.38 + depth * 0.54);
      const archHeight = height * (0.34 - depth * 0.14) * (1 + inhale * 0.045);
      const archWidth = width * (0.12 + depth * 0.03) * (1 - inhale * 0.026);
      const x = baseX + side * livingLean * (0.3 + depth);
      const hue = cathedralHue(depth, intensities[i % intensities.length]);
      canvasContext.strokeStyle = hsla(hue, 54, architecture === "ruinedabbey" ? 48 : 58, 0.26 + intensities[i % intensities.length] * 0.32);
      canvasContext.lineWidth = Math.max(2, width * (0.008 + depth * 0.012));
      canvasContext.beginPath();
      canvasContext.moveTo(x - side * archWidth * 0.48, baseY);
      canvasContext.bezierCurveTo(
        x - side * archWidth * 0.7,
        baseY - archHeight * 0.58,
        width * 0.5 + side * livingLean * 0.12,
        baseY - archHeight,
        width * 0.5,
        baseY - archHeight * (0.96 + sentience * 0.05),
      );
      canvasContext.bezierCurveTo(
        width * 0.5 - side * livingLean * 0.12,
        baseY - archHeight,
        width - (x - side * archWidth * 0.48),
        baseY - archHeight * 0.58,
        width - (x - side * archWidth * 0.48),
        baseY,
      );
      canvasContext.stroke();
    }
  }

  const windowIntensity = Math.max(...intensities);
  drawCathedralWindow(canvasContext, width * 0.5 + livingLean * 0.2, height * 0.23 + inhale * height * 0.012, Math.min(width, height) * (0.14 + flex * 0.018 + bassEnergy * 0.025), architecture === "byzantine" ? 18 : 14, windowIntensity, bassEnergy);

  const panelCount = architecture === "ruinedabbey" ? 9 : 12;
  for (let panel = 0; panel < panelCount; panel += 1) {
    const side = panel % 2 === 0 ? -1 : 1;
    const row = Math.floor(panel / 2);
    const x = width * (0.18 + row * 0.07 + (side > 0 ? 0.5 : 0));
    const y = height * (0.2 + (row % 4) * 0.105);
    const w = width * 0.055;
    const h = height * 0.12;
    const intensity = intensities[panel % intensities.length];
    const hue = cathedralHue(panel / panelCount, intensity);
    canvasContext.fillStyle = hsla(hue, 88, 48 + intensity * 25, 0.14 + intensity * 0.28);
    canvasContext.beginPath();
    canvasContext.moveTo(x, y + h);
    canvasContext.lineTo(x, y + h * 0.28);
    canvasContext.quadraticCurveTo(x + w * 0.5, y - h * 0.22, x + w, y + h * 0.28);
    canvasContext.lineTo(x + w, y + h);
    canvasContext.closePath();
    canvasContext.fill();
    canvasContext.strokeStyle = "rgba(238, 222, 190, 0.28)";
    canvasContext.lineWidth = 1.2;
    canvasContext.stroke();
  }

  for (let candle = 0; candle < 42; candle += 1) {
    const side = candle % 2 === 0 ? -1 : 1;
    const depth = (candle % 21) / 20;
    const x = width * (0.5 + side * (0.1 + depth * 0.31));
    const y = height * (0.54 + depth * 0.4);
    const flame = Math.sin(cathedralFrame * (0.09 + trebleEnergy * 0.14) + candle) * 0.5 + 0.5;
    const size = Math.min(width, height) * (0.004 + depth * 0.008);
    canvasContext.fillStyle = "rgba(226, 204, 168, 0.48)";
    canvasContext.fillRect(x - size * 0.18, y, size * 0.36, size * 3.4);
    canvasContext.fillStyle = hsla(38 + flame * 20, 100, 58 + trebleEnergy * 18, 0.52 + flame * 0.34);
    canvasContext.beginPath();
    canvasContext.ellipse(x + Math.sin(cathedralFrame * 0.11 + candle) * size * 0.25, y - size * 0.5, size * (0.8 + trebleEnergy), size * (1.5 + flame), 0, 0, Math.PI * 2);
    canvasContext.fill();
  }

  cathedralFigures.forEach((figure, index) => {
    const intensity = intensities[index % intensities.length];
    figure.x += Math.sin(cathedralFrame * 0.012 + figure.phase) * figure.speed * (0.12 + midsEnergy * 0.7);
    figure.y += Math.cos(cathedralFrame * 0.01 + figure.phase) * figure.speed * 0.09;
    if (figure.x < width * 0.18) figure.x = width * 0.78;
    if (figure.x > width * 0.82) figure.x = width * 0.22;
    drawCathedralFigure(canvasContext, figure, width, height, intensity, trebleEnergy);
  });

  if (Math.random() < (0.06 + trebleEnergy * 0.2 + sentience * 0.12) * breath && cathedralSparks.length < 90) {
    cathedralSparks.push({
      x: width * (0.18 + Math.random() * 0.64),
      y: height * (0.18 + Math.random() * 0.7),
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.25 - Math.random() * 0.7,
      life: 1,
      hue: cathedralHue(Math.random(), trebleEnergy),
    });
  }
  cathedralSparks = cathedralSparks.filter((spark) => spark.life > 0.03);
  cathedralSparks.forEach((spark) => {
    spark.x += spark.vx + Math.sin(cathedralFrame * 0.02 + spark.y) * 0.18 * sentience;
    spark.y += spark.vy;
    spark.life *= 0.965;
    canvasContext.fillStyle = hsla(spark.hue, 94, 68, spark.life * 0.58);
    canvasContext.beginPath();
    canvasContext.arc(spark.x, spark.y, Math.min(width, height) * 0.004 * spark.life, 0, Math.PI * 2);
    canvasContext.fill();
  });

  if (sentience > 0.52) {
    canvasContext.strokeStyle = `rgba(255, 245, 218, ${(sentience - 0.45) * 0.18 + bassEnergy * 0.08})`;
    canvasContext.lineWidth = Math.max(1, width * 0.002);
    for (let nerve = 0; nerve < 16; nerve += 1) {
      const y = height * (0.2 + nerve * 0.045);
      canvasContext.beginPath();
      canvasContext.moveTo(width * 0.22, y);
      canvasContext.bezierCurveTo(width * 0.38, y + Math.sin(cathedralFrame * 0.026 + nerve) * height * 0.04, width * 0.62, y - Math.cos(cathedralFrame * 0.022 + nerve) * height * 0.035, width * 0.78, y);
      canvasContext.stroke();
    }
  }
}

function drawCathedralOrganismFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 9), 1.34);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 58), 1.28);
  const trebleEnergy = pressureResponse(averageBand(buffer, 62, 112), 1.38);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.34));
  drawCathedralOrganismScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

function hypnoticHue(progress, intensity) {
  const dream = themeSelect.value;
  if (dream === "ice") return 182 + progress * 118 + intensity * 78;
  if (dream === "ember") return 8 + progress * 96 + intensity * 50;
  if (dream === "pressure") return 318 - progress * 280 + intensity * 120;
  if (dream === "spectrum") return (42 + progress * 211 + intensity * 173) % 360;
  return (126 + progress * 137 + intensity * 91) % 360;
}

function setupHypnoticFigures(width, height) {
  const desired = Math.max(4, Math.min(22, handCountValueNumber() + 5));
  while (hypnoticFigures.length < desired) {
    const index = hypnoticFigures.length;
    hypnoticFigures.push({
      x: width * (0.12 + Math.random() * 0.78),
      y: height * (0.18 + Math.random() * 0.68),
      vx: (Math.random() - 0.5) * 1.7,
      vy: (Math.random() - 0.5) * 1.2,
      phase: Math.random() * Math.PI * 2,
      hueShift: index / Math.max(1, desired - 1),
      scale: 0.72 + Math.random() * 0.9,
      dissolve: Math.random(),
      turn: Math.random() < 0.5 ? -1 : 1,
    });
  }
  if (hypnoticFigures.length > desired) {
    hypnoticFigures.splice(desired);
  }
}

function setupHypnoticMonsters(width, height) {
  const desired = Math.max(2, Math.min(7, Math.round(2 + handGraspAmount() * 5)));
  while (hypnoticMonsters.length < desired) {
    const index = hypnoticMonsters.length;
    hypnoticMonsters.push({
      x: width * (0.12 + Math.random() * 0.78),
      y: height * (0.18 + Math.random() * 0.68),
      vx: (Math.random() - 0.5) * 0.75,
      vy: (Math.random() - 0.5) * 0.55,
      phase: Math.random() * Math.PI * 2,
      hunger: 0.3 + Math.random() * 0.7,
      limbs: 5 + (index % 4),
    });
  }
  if (hypnoticMonsters.length > desired) {
    hypnoticMonsters.splice(desired);
  }
}

function nearestHypnoticMonster(figure) {
  return hypnoticMonsters.reduce((nearest, monster) => {
    const distance = Math.hypot(figure.x - monster.x, figure.y - monster.y);
    if (!nearest || distance < nearest.distance) {
      return { monster, distance };
    }
    return nearest;
  }, null);
}

function drawHypnoticField(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const form = fireworkFormSelect.value;
  const pulse = Math.sin(hypnoticFrame * 0.035) * 0.5 + 0.5;
  const bg = canvasContext.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, hsla(hypnoticHue(0.05, trebleEnergy), 88, form === "nocturne" ? 10 : 22 + trebleEnergy * 20, 0.92));
  bg.addColorStop(0.42, hsla(hypnoticHue(0.48, midsEnergy), 96, form === "liquid" ? 28 + bassEnergy * 18 : 18 + midsEnergy * 22, 0.92));
  bg.addColorStop(1, hsla(hypnoticHue(0.88, bassEnergy), 86, form === "prismatic" ? 26 + pulse * 22 : 8 + bassEnergy * 18, 0.96));
  canvasContext.fillStyle = bg;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.globalCompositeOperation = "lighter";
  for (let ring = 0; ring < 16; ring += 1) {
    const amount = ring / 15;
    const radius = Math.min(width, height) * (0.16 + amount * 0.72 + bassEnergy * 0.08);
    const x = width * (0.5 + Math.sin(hypnoticFrame * 0.007 + ring) * 0.18);
    const y = height * (0.5 + Math.cos(hypnoticFrame * 0.006 + ring * 1.3) * 0.22);
    canvasContext.strokeStyle = hsla(hypnoticHue(amount, trebleEnergy), 100, 54 + pulse * 18, 0.035 + midsEnergy * 0.04);
    canvasContext.lineWidth = Math.max(1, width * (0.003 + amount * 0.006));
    canvasContext.beginPath();
    canvasContext.ellipse(x, y, radius * (1.1 + Math.sin(hypnoticFrame * 0.015 + ring) * 0.2), radius * 0.58, Math.sin(hypnoticFrame * 0.004 + ring), 0, Math.PI * 2);
    canvasContext.stroke();
  }
  canvasContext.globalCompositeOperation = "source-over";
}

function drawHypnoticBlob(canvasContext, blob, width, height) {
  blob.life *= 0.955;
  blob.radius *= 1.013;
  blob.x += blob.vx;
  blob.y += blob.vy;
  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  const gradient = canvasContext.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
  gradient.addColorStop(0, hsla(blob.hue, 100, 62, blob.life * 0.34));
  gradient.addColorStop(0.55, hsla(blob.hue + 97, 100, 44, blob.life * 0.18));
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = gradient;
  canvasContext.beginPath();
  canvasContext.ellipse(blob.x, blob.y, blob.radius * blob.stretch, blob.radius, blob.spin, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawHypnoticMonster(canvasContext, monster, width, height, intensity, bassEnergy) {
  const dread = handGraspAmount();
  const size = Math.min(width, height) * (0.08 + dread * 0.07 + bassEnergy * 0.06) * monster.hunger;
  const hue = hypnoticHue(monster.hunger, intensity);
  canvasContext.save();
  canvasContext.translate(monster.x, monster.y);
  canvasContext.rotate(Math.sin(hypnoticFrame * 0.013 + monster.phase) * 0.35);
  canvasContext.globalCompositeOperation = "multiply";
  canvasContext.fillStyle = `rgba(0, 0, 0, ${0.24 + dread * 0.34})`;
  canvasContext.beginPath();
  for (let point = 0; point < monster.limbs * 2; point += 1) {
    const angle = point / (monster.limbs * 2) * Math.PI * 2;
    const pulse = 0.72 + Math.sin(hypnoticFrame * 0.04 + monster.phase + point) * 0.24 + intensity * 0.2;
    const radius = size * (point % 2 === 0 ? 1.05 : 0.56) * pulse;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (point === 0) canvasContext.moveTo(x, y);
    else canvasContext.lineTo(x, y);
  }
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.globalCompositeOperation = "lighter";
  canvasContext.strokeStyle = hsla(hue + 180, 96, 58, 0.24 + intensity * 0.28);
  canvasContext.lineWidth = Math.max(1, size * 0.035);
  canvasContext.stroke();
  for (let eye = -1; eye <= 1; eye += 2) {
    canvasContext.fillStyle = hsla(hue + 60, 100, 68, 0.62 + intensity * 0.24);
    canvasContext.beginPath();
    canvasContext.ellipse(size * 0.18, eye * size * 0.18, size * 0.12, size * 0.055, 0, 0, Math.PI * 2);
    canvasContext.fill();
  }
  canvasContext.restore();
}

function drawHypnoticFigure(canvasContext, figure, width, height, intensity, bassEnergy, trebleEnergy) {
  const melt = handSizeMultiplier();
  const size = Math.min(width, height) * 0.04 * figure.scale * (0.8 + intensity * 0.45);
  const hue = hypnoticHue(figure.hueShift, intensity + trebleEnergy * 0.4);
  const drip = size * melt * (0.8 + bassEnergy * 1.6);
  const sway = Math.sin(hypnoticFrame * 0.09 + figure.phase) * size * 0.35;
  canvasContext.save();
  canvasContext.translate(figure.x, figure.y);
  canvasContext.rotate(Math.atan2(figure.vy, figure.vx || 1) * 0.14 + sway * 0.006);
  canvasContext.globalCompositeOperation = "lighter";
  const aura = canvasContext.createRadialGradient(0, 0, 0, 0, 0, size * 3.2);
  aura.addColorStop(0, hsla(hue, 100, 62, 0.18 + intensity * 0.22));
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = aura;
  canvasContext.fillRect(-size * 4, -size * 4, size * 8, size * 8);
  canvasContext.fillStyle = hsla(hue, 92, 60 + intensity * 18, 0.66 + trebleEnergy * 0.18);
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 1.25, size * 0.38, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 0.86);
  canvasContext.bezierCurveTo(size * 0.64, -size * 0.42, size * 0.55 + sway, size * 0.62, size * 0.12, size * 1.1 + drip * 0.35);
  canvasContext.bezierCurveTo(size * 0.42, size * 1.62 + drip, -size * 0.48, size * 1.58 + drip * 0.8, -size * 0.12, size * 0.94);
  canvasContext.bezierCurveTo(-size * 0.56 - sway, size * 0.22, -size * 0.5, -size * 0.44, 0, -size * 0.86);
  canvasContext.fill();
  canvasContext.strokeStyle = hsla(hue + 137, 96, 70, 0.32 + intensity * 0.28);
  canvasContext.lineWidth = Math.max(1, size * 0.08);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.38, -size * 0.18);
  canvasContext.lineTo(-size * (1.2 + bassEnergy), size * (0.38 + figure.dissolve));
  canvasContext.moveTo(size * 0.38, -size * 0.16);
  canvasContext.lineTo(size * (1.05 + trebleEnergy), size * (0.34 + figure.dissolve * 0.8));
  canvasContext.stroke();
  canvasContext.restore();
}

function drawHypnoticFlightScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const speed = fireworkSpeedMultiplier();
  const dread = handGraspAmount();
  hypnoticFrame += speed * (0.88 + bassEnergy * 0.7 + midsEnergy * 0.28);
  setupHypnoticFigures(width, height);
  setupHypnoticMonsters(width, height);
  drawHypnoticField(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);

  if (Math.random() < (0.06 + bassEnergy * 0.18 + trebleEnergy * 0.08) * speed && hypnoticBlobs.length < 80) {
    hypnoticBlobs.push({
      x: width * Math.random(),
      y: height * Math.random(),
      radius: Math.min(width, height) * (0.035 + Math.random() * 0.13 + bassEnergy * 0.12),
      stretch: 0.55 + Math.random() * 1.7,
      spin: Math.random() * Math.PI,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.65,
      hue: hypnoticHue(Math.random(), trebleEnergy),
      life: 1,
    });
  }
  hypnoticBlobs = hypnoticBlobs.filter((blob) => blob.life > 0.035);
  hypnoticBlobs.forEach((blob) => drawHypnoticBlob(canvasContext, blob, width, height));

  hypnoticMonsters.forEach((monster, index) => {
    const target = hypnoticFigures[index % Math.max(1, hypnoticFigures.length)];
    const intensity = intensities[index % intensities.length];
    if (target) {
      monster.vx += (target.x - monster.x) * (0.00018 + dread * 0.00038);
      monster.vy += (target.y - monster.y) * (0.00015 + dread * 0.00032);
    }
    monster.vx += Math.sin(hypnoticFrame * 0.018 + monster.phase) * 0.025;
    monster.vy += Math.cos(hypnoticFrame * 0.016 + monster.phase) * 0.022;
    monster.vx *= 0.96;
    monster.vy *= 0.96;
    monster.x = (monster.x + monster.vx * speed + width) % width;
    monster.y = (monster.y + monster.vy * speed + height) % height;
    drawHypnoticMonster(canvasContext, monster, width, height, intensity, bassEnergy);
  });

  hypnoticFigures.forEach((figure, index) => {
    const nearest = nearestHypnoticMonster(figure);
    const intensity = intensities[index % intensities.length];
    if (nearest) {
      const push = (0.35 + dread * 1.2) / Math.max(80, nearest.distance);
      figure.vx += (figure.x - nearest.monster.x) * push * 0.012;
      figure.vy += (figure.y - nearest.monster.y) * push * 0.01;
    }
    figure.vx += Math.sin(hypnoticFrame * 0.028 + figure.phase) * (0.045 + midsEnergy * 0.09);
    figure.vy += Math.cos(hypnoticFrame * 0.024 + figure.phase) * (0.035 + trebleEnergy * 0.08);
    figure.vx *= 0.95;
    figure.vy *= 0.95;
    figure.x = (figure.x + figure.vx * (0.9 + speed * 0.45) + width) % width;
    figure.y = (figure.y + figure.vy * (0.8 + speed * 0.34) + height) % height;
    drawHypnoticFigure(canvasContext, figure, width, height, intensity, bassEnergy, trebleEnergy);
  });
}

function drawHypnoticFlightFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.38);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 58), 1.32);
  const trebleEnergy = pressureResponse(averageBand(buffer, 62, 112), 1.46);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.36));
  drawHypnoticFlightScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

const kaleidoscopePalettes = {
  vivid: [
    [184, 100, 58],
    [310, 100, 62],
    [42, 100, 58],
    [116, 92, 52],
    [232, 100, 64],
  ],
  woodland: [
    [92, 42, 42],
    [124, 38, 34],
    [38, 48, 48],
    [154, 32, 42],
    [18, 38, 45],
  ],
  garden: [
    [330, 72, 62],
    [112, 58, 48],
    [52, 78, 62],
    [186, 54, 58],
    [12, 64, 58],
  ],
  psychedelia: [
    [288, 100, 58],
    [32, 100, 56],
    [172, 100, 50],
    [236, 100, 62],
    [86, 100, 54],
  ],
  tea: [
    [18, 84, 54],
    [198, 88, 58],
    [48, 92, 62],
    [316, 74, 60],
    [132, 58, 48],
  ],
  cheshire: [
    [282, 82, 48],
    [318, 88, 62],
    [210, 78, 58],
    [168, 68, 54],
    [24, 72, 58],
  ],
  absinthe: [
    [74, 92, 58],
    [112, 84, 46],
    [162, 68, 48],
    [46, 70, 62],
    [286, 54, 58],
  ],
  midnight: [
    [230, 78, 32],
    [266, 70, 42],
    [194, 84, 46],
    [318, 72, 52],
    [52, 82, 64],
  ],
};

const kaleidoscopePaletteOrder = [
  "vivid",
  "woodland",
  "garden",
  "psychedelia",
  "tea",
  "cheshire",
  "absinthe",
  "midnight",
];

function kaleidoscopePalette() {
  return kaleidoscopePalettes[fireworkFormSelect.value] || kaleidoscopePalettes.vivid;
}

function kaleidoscopePaletteIndex() {
  return Math.max(0, kaleidoscopePaletteOrder.indexOf(fireworkFormSelect.value));
}

function kaleidoscopeColour(palette, index, intensity = 0, alpha = 1, hueShift = 0) {
  const colour = palette[index % palette.length];
  return hsla(
    colour[0] + hueShift + intensity * 54,
    clampNumber(colour[1] + intensity * 12, 0, 100),
    clampNumber(colour[2] + intensity * 16, 0, 100),
    alpha,
  );
}

function drawKaleidoscopeOctagon(canvasContext, width, height, palette, bassEnergy, trebleEnergy) {
  const radius = Math.max(34, Math.min(width, height) * 0.075);
  const x = width - radius * 1.55;
  const y = radius * 1.55;
  const selected = kaleidoscopePaletteIndex();

  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.globalCompositeOperation = "source-over";
  canvasContext.shadowBlur = 14 + trebleEnergy * 18;
  canvasContext.shadowColor = kaleidoscopeColour(palette, selected, trebleEnergy, 0.7);

  for (let wedge = 0; wedge < 8; wedge += 1) {
    const start = -Math.PI / 2 + wedge * Math.PI / 4;
    const end = start + Math.PI / 4;
    const optionPalette = kaleidoscopePalettes[kaleidoscopePaletteOrder[wedge]];
    const selectedPulse = wedge === selected ? 1 + bassEnergy * 0.22 : 0.82;
    canvasContext.beginPath();
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(Math.cos(start) * radius * selectedPulse, Math.sin(start) * radius * selectedPulse);
    canvasContext.lineTo(Math.cos(end) * radius * selectedPulse, Math.sin(end) * radius * selectedPulse);
    canvasContext.closePath();
    canvasContext.fillStyle = kaleidoscopeColour(optionPalette, wedge, trebleEnergy, wedge === selected ? 0.95 : 0.54);
    canvasContext.fill();
  }

  canvasContext.lineWidth = Math.max(2, radius * 0.055);
  canvasContext.strokeStyle = kaleidoscopeColour(palette, selected + 2, bassEnergy, 0.86);
  canvasContext.beginPath();
  for (let point = 0; point < 8; point += 1) {
    const angle = -Math.PI / 2 + point * Math.PI / 4;
    const px = Math.cos(angle) * radius * (1.02 + bassEnergy * 0.05);
    const py = Math.sin(angle) * radius * (1.02 + bassEnergy * 0.05);
    if (point === 0) canvasContext.moveTo(px, py);
    else canvasContext.lineTo(px, py);
  }
  canvasContext.closePath();
  canvasContext.stroke();
  canvasContext.restore();
}

function drawKaleidoscopeWedge(canvasContext, radius, palette, segment, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const morph = handSizeMultiplier();
  const trip = handGraspAmount();
  const localPulse = intensities[segment % intensities.length] || 0.18;
  const hueShift = kaleidoscopeFrame * (0.45 + trip * 0.7) + segment * (6 + trip * 8);

  for (let ring = 0; ring < 7; ring += 1) {
    const amount = (ring + 1) / 7;
    const wobble = Math.sin(kaleidoscopeFrame * (0.026 + ring * 0.002) + segment * 0.7 + ring) * morph * 0.12;
    const x = radius * amount * (0.24 + wobble + localPulse * 0.08);
    const y = Math.sin(kaleidoscopeFrame * 0.032 + ring * 1.7 + segment) * radius * (0.018 + trip * 0.028 + midsEnergy * 0.04);
    const petalLength = radius * (0.065 + amount * 0.048 + bassEnergy * 0.06) * morph;
    const petalWidth = radius * (0.016 + trebleEnergy * 0.028 + trip * 0.018);

    canvasContext.save();
    canvasContext.translate(x, y);
    canvasContext.rotate(Math.sin(kaleidoscopeFrame * 0.018 + ring + segment) * 0.9);
    canvasContext.fillStyle = kaleidoscopeColour(palette, ring + segment, localPulse, 0.2 + localPulse * 0.42, hueShift);
    canvasContext.strokeStyle = kaleidoscopeColour(palette, ring + segment + 2, trebleEnergy, 0.24 + trip * 0.36, hueShift);
    canvasContext.lineWidth = Math.max(1, radius * 0.0035);
    canvasContext.beginPath();
    canvasContext.ellipse(0, 0, petalLength, petalWidth, 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.stroke();

    if (ring % 2 === 0) {
      canvasContext.fillStyle = kaleidoscopeColour(palette, ring + 3, trebleEnergy, 0.18 + trebleEnergy * 0.22, hueShift + 70);
      canvasContext.beginPath();
      canvasContext.arc(petalLength * 0.46, 0, petalWidth * (0.72 + trip), 0, Math.PI * 2);
      canvasContext.fill();
    }
    canvasContext.restore();
  }

  canvasContext.strokeStyle = kaleidoscopeColour(palette, segment + 1, midsEnergy, 0.18 + midsEnergy * 0.34, hueShift);
  canvasContext.lineWidth = Math.max(1, radius * (0.004 + trip * 0.004));
  canvasContext.beginPath();
  for (let step = 0; step <= 34; step += 1) {
    const amount = step / 34;
    const x = radius * amount * 0.95;
    const y = Math.sin(amount * Math.PI * (3 + trip * 5) + kaleidoscopeFrame * 0.04 + segment) * radius * (0.014 + midsEnergy * 0.042);
    if (step === 0) canvasContext.moveTo(x, y);
    else canvasContext.lineTo(x, y);
  }
  canvasContext.stroke();
}

function renderKaleidoscopeWedgeSource(angleStep, palette, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const sourceRadius = Math.round(clampNumber(Math.min(visualizer.width, visualizer.height) * 0.32, 220, 640));
  const sourceWidth = Math.round(sourceRadius * 1.12);
  const sourceHeight = Math.round(Math.max(140, sourceRadius * Math.tan(angleStep * 0.56) * 2 + sourceRadius * 0.24));
  const originY = sourceHeight / 2;

  if (kaleidoscopeWedgeCanvas.width !== sourceWidth || kaleidoscopeWedgeCanvas.height !== sourceHeight) {
    kaleidoscopeWedgeCanvas.width = sourceWidth;
    kaleidoscopeWedgeCanvas.height = sourceHeight;
  }

  const context = kaleidoscopeWedgeContext;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.shadowBlur = 0;
  context.clearRect(0, 0, sourceWidth, sourceHeight);
  context.save();
  context.translate(0, originY);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(Math.cos(-angleStep * 0.52) * sourceRadius, Math.sin(-angleStep * 0.52) * sourceRadius);
  context.lineTo(Math.cos(angleStep * 0.52) * sourceRadius, Math.sin(angleStep * 0.52) * sourceRadius);
  context.closePath();
  context.clip();
  context.globalCompositeOperation = "lighter";
  context.shadowBlur = 5 + trebleEnergy * 9 + handGraspAmount() * 6;
  context.shadowColor = kaleidoscopeColour(palette, 3, trebleEnergy, 0.52);
  drawKaleidoscopeWedge(context, sourceRadius, palette, 0, bassEnergy, midsEnergy, trebleEnergy, intensities);
  context.restore();

  return {
    canvas: kaleidoscopeWedgeCanvas,
    radius: sourceRadius,
    width: sourceWidth,
    height: sourceHeight,
    originY,
  };
}

function drawKaleidoscopeScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const palette = kaleidoscopePalette();
  const pulse = fireworkSpeedMultiplier();
  const trip = handGraspAmount();
  const morph = handSizeMultiplier();
  const segmentCount = Math.max(8, Math.min(24, handCountValueNumber() * 2));
  const radius = Math.hypot(width, height) * 0.58;
  const centerX = width / 2 + Math.sin(kaleidoscopeFrame * 0.009) * width * 0.035 * trip;
  const centerY = height / 2 + Math.cos(kaleidoscopeFrame * 0.008) * height * 0.035 * trip;

  kaleidoscopeFrame += pulse * (0.72 + bassEnergy * 0.88 + trebleEnergy * 0.32);

  const background = canvasContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  background.addColorStop(0, kaleidoscopeColour(palette, 0, trebleEnergy, 0.94, kaleidoscopeFrame * 0.2));
  background.addColorStop(0.48, kaleidoscopeColour(palette, 2, midsEnergy, 0.92, -kaleidoscopeFrame * 0.12));
  background.addColorStop(1, kaleidoscopeColour(palette, 4, bassEnergy, 0.98, kaleidoscopeFrame * 0.08));
  canvasContext.fillStyle = background;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.save();
  canvasContext.translate(centerX, centerY);
  canvasContext.rotate(kaleidoscopeFrame * 0.0025 * (0.5 + trip));
  canvasContext.globalCompositeOperation = "lighter";
  const angleStep = Math.PI * 2 / segmentCount;
  const wedgeSource = renderKaleidoscopeWedgeSource(angleStep, palette, bassEnergy, midsEnergy, trebleEnergy, intensities);
  const sourceScale = radius / wedgeSource.radius;
  const drawWidth = wedgeSource.width * sourceScale;
  const drawHeight = wedgeSource.height * sourceScale;
  const drawOriginY = wedgeSource.originY * sourceScale;

  for (let segment = 0; segment < segmentCount; segment += 1) {
    canvasContext.save();
    canvasContext.rotate(segment * angleStep);
    if (segment % 2) canvasContext.scale(1, -1);
    canvasContext.globalAlpha = 0.82 + (segment % 3) * 0.07;
    canvasContext.drawImage(wedgeSource.canvas, 0, -drawOriginY, drawWidth, drawHeight);
    canvasContext.restore();
  }
  canvasContext.globalAlpha = 1;

  canvasContext.globalCompositeOperation = "source-over";
  for (let ring = 0; ring < 7; ring += 1) {
    const amount = (ring + 1) / 7;
    const ringRadius = radius * amount * (0.08 + morph * 0.09 + bassEnergy * 0.04);
    canvasContext.strokeStyle = kaleidoscopeColour(palette, ring + 1, intensities[ring % intensities.length] || 0.2, 0.08 + trip * 0.045);
    canvasContext.lineWidth = Math.max(1, radius * 0.003);
    canvasContext.beginPath();
    canvasContext.arc(0, 0, ringRadius, 0, Math.PI * 2);
    canvasContext.stroke();
  }
  canvasContext.restore();

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  const aperture = Math.min(width, height) * (0.04 + bassEnergy * 0.035 + trip * 0.025);
  const core = canvasContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, aperture * 3.2);
  core.addColorStop(0, "rgba(255, 255, 255, 0.72)");
  core.addColorStop(0.35, kaleidoscopeColour(palette, 1, trebleEnergy, 0.34));
  core.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = core;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, aperture * 3.2, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();

  drawKaleidoscopeOctagon(canvasContext, width, height, palette, bassEnergy, trebleEnergy);
}

function drawKaleidoscopeFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 10), 1.34);
  const midsEnergy = pressureResponse(averageBand(buffer, 14, 58), 1.32);
  const trebleEnergy = pressureResponse(averageBand(buffer, 62, 118), 1.42);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.34));
  drawKaleidoscopeScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

const bobRossGardenChoices = {
  peas: {
    sky: 330,
    soil: 34,
    crops: ["mangeTout", "floweringPea", "sweetPea"],
  },
  kitchen: {
    sky: 22,
    soil: 24,
    crops: ["potato", "garlic", "chilli", "onion", "tomato"],
  },
  alliums: {
    sky: 48,
    soil: 28,
    crops: ["garlic", "onion", "chilli", "marjoram"],
  },
  mushrooms: {
    sky: 286,
    soil: 22,
    crops: ["mushroom", "parsnip", "borage"],
  },
  herbal: {
    sky: 144,
    soil: 32,
    crops: ["hemp", "marjoram", "tomato"],
  },
  squash: {
    sky: 36,
    soil: 30,
    crops: ["pumpkin", "sage", "floweringPea"],
  },
  berries: {
    sky: 338,
    soil: 26,
    crops: ["strawberry", "basil", "sweetPea"],
  },
  roots: {
    sky: 312,
    soil: 20,
    crops: ["beetroot", "borage", "parsnip", "garlic"],
  },
};

const bobRossRouletteOrder = ["peas", "kitchen", "alliums", "mushrooms", "herbal", "squash", "berries", "roots"];

function bobRossChoice() {
  return bobRossGardenChoices[fireworkFormSelect.value] || bobRossGardenChoices.peas;
}

function bobRossChoiceIndex() {
  return Math.max(0, bobRossRouletteOrder.indexOf(fireworkFormSelect.value));
}

function bobRossRouletteState(width, height, bassEnergy, trebleEnergy) {
  const pocketCount = 48;
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.hypot(width, height) * 0.72;
  const innerRadius = Math.min(width, height) * 0.36;
  const wheelRotation = bobGardenFrame * (0.024 + fireworkSpeedMultiplier() * 0.018);
  const ballAngle = -bobGardenFrame * (0.075 + fireworkSpeedMultiplier() * 0.014 + trebleEnergy * 0.025)
    + Math.sin(bobGardenFrame * 0.019) * 0.34
    - bassEnergy * 0.65;
  const relative = ((ballAngle - wheelRotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  const pocket = Math.floor(relative / (Math.PI * 2) * pocketCount) % pocketCount;
  const sector = Math.floor(pocket / (pocketCount / bobRossRouletteOrder.length)) % bobRossRouletteOrder.length;
  const number = ((pocket * 17 + 7) % pocketCount) + 1;
  const redPocket = pocket % 3 !== 0;

  return {
    pocketCount,
    pocket,
    sector,
    number,
    redPocket,
    centerX,
    centerY,
    outerRadius,
    innerRadius,
    wheelRotation,
    ballAngle,
    ballRadius: innerRadius + (outerRadius - innerRadius) * 0.22,
    hueShift: sector * 31 + number * 3,
    growthBoost: 0.82 + (number % 13) / 18 + bassEnergy * 0.32,
    insectBoost: 0.75 + (number % 9) / 10 + trebleEnergy * 0.55,
    earthlyDelight: (redPocket ? 0.22 : 0.45) + (number % 7) * 0.045,
  };
}

function drawBobRossRouletteFrame(canvasContext, width, height, choice, bassEnergy, trebleEnergy, state) {
  const {
    pocketCount,
    pocket,
    number,
    redPocket,
    centerX,
    centerY,
    outerRadius,
    innerRadius,
    wheelRotation,
    ballAngle,
    ballRadius,
  } = state;
  const pocketAngle = Math.PI * 2 / pocketCount;

  canvasContext.save();
  canvasContext.fillStyle = "rgba(14, 7, 12, 0.98)";
  canvasContext.fillRect(0, 0, width, height);
  canvasContext.translate(centerX, centerY);
  canvasContext.rotate(wheelRotation);
  canvasContext.shadowBlur = 28 + trebleEnergy * 24;
  canvasContext.shadowColor = hsla(choice.sky + state.hueShift, 86, 62, 0.52);

  for (let index = 0; index < pocketCount; index += 1) {
    const start = index * pocketAngle - Math.PI / 2;
    const end = start + pocketAngle * 0.96;
    const sector = Math.floor(index / (pocketCount / bobRossRouletteOrder.length)) % bobRossRouletteOrder.length;
    const garden = bobRossGardenChoices[bobRossRouletteOrder[sector]];
    const active = index === pocket;
    const red = index % 3 !== 0;
    const dark = index % 6 === 0;
    const outer = active ? outerRadius * (1.008 + bassEnergy * 0.01) : outerRadius;
    const inner = innerRadius * (active ? 0.965 : 1);

    canvasContext.beginPath();
    canvasContext.arc(0, 0, outer, start, end);
    canvasContext.arc(0, 0, inner, end, start, true);
    canvasContext.closePath();
    canvasContext.fillStyle = active
      ? hsla(garden.sky + state.hueShift, 95, 62 + bassEnergy * 16, 0.98)
      : dark
        ? "rgba(18, 13, 17, 0.96)"
        : red
          ? hsla(garden.sky + sector * 9, 76, 38 + (index % 4) * 4, 0.96)
          : hsla(garden.soil + sector * 11, 66, 28 + (index % 5) * 3, 0.96);
    canvasContext.fill();
    canvasContext.strokeStyle = active ? "rgba(255, 251, 218, 0.9)" : "rgba(255, 235, 190, 0.22)";
    canvasContext.lineWidth = active ? Math.max(2, outerRadius * 0.003) : 1;
    canvasContext.stroke();

    canvasContext.save();
    canvasContext.rotate(start + pocketAngle * 0.48);
    canvasContext.translate(0, inner + (outer - inner) * 0.54);
    canvasContext.rotate(Math.PI / 2);
    canvasContext.font = `${Math.max(9, outerRadius * 0.018)}px system-ui`;
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";
    canvasContext.fillStyle = active ? "rgba(255, 255, 238, 0.98)" : "rgba(255, 244, 218, 0.72)";
    canvasContext.fillText(String(((index * 17 + 7) % pocketCount) + 1), 0, 0);
    canvasContext.restore();
  }

  for (let ring = 0; ring < 5; ring += 1) {
    const radius = innerRadius + (outerRadius - innerRadius) * (ring / 4);
    canvasContext.strokeStyle = ring === 0 || ring === 4 ? "rgba(255, 238, 184, 0.72)" : "rgba(255, 238, 184, 0.22)";
    canvasContext.lineWidth = Math.max(1, outerRadius * (ring === 0 || ring === 4 ? 0.006 : 0.002));
    canvasContext.beginPath();
    canvasContext.arc(0, 0, radius, 0, Math.PI * 2);
    canvasContext.stroke();
  }

  for (let tick = 0; tick < pocketCount * 2; tick += 1) {
    const angle = tick / (pocketCount * 2) * Math.PI * 2;
    const length = tick % 2 === 0 ? outerRadius * 0.04 : outerRadius * 0.022;
    canvasContext.strokeStyle = tick % 2 === 0 ? "rgba(255, 246, 210, 0.68)" : "rgba(255, 246, 210, 0.3)";
    canvasContext.lineWidth = tick % 2 === 0 ? 2 : 1;
    canvasContext.beginPath();
    canvasContext.moveTo(Math.cos(angle) * (outerRadius - length), Math.sin(angle) * (outerRadius - length));
    canvasContext.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
    canvasContext.stroke();
  }

  canvasContext.restore();

  canvasContext.save();
  canvasContext.translate(centerX, centerY);
  const bx = Math.cos(ballAngle - Math.PI / 2) * ballRadius;
  const by = Math.sin(ballAngle - Math.PI / 2) * ballRadius;
  const ballSize = Math.max(8, Math.min(width, height) * 0.018);
  const ballGlow = canvasContext.createRadialGradient(bx - ballSize * 0.35, by - ballSize * 0.35, 0, bx, by, ballSize * 1.8);
  ballGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
  ballGlow.addColorStop(0.42, redPocket ? "rgba(255, 218, 210, 0.96)" : "rgba(215, 255, 220, 0.96)");
  ballGlow.addColorStop(1, "rgba(35, 18, 12, 0.18)");
  canvasContext.shadowBlur = 22 + bassEnergy * 18;
  canvasContext.shadowColor = redPocket ? "rgba(255, 75, 55, 0.75)" : "rgba(80, 255, 155, 0.75)";
  canvasContext.fillStyle = ballGlow;
  canvasContext.beginPath();
  canvasContext.arc(bx, by, ballSize, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();

  canvasContext.save();
  canvasContext.fillStyle = "rgba(255, 244, 215, 0.9)";
  canvasContext.strokeStyle = "rgba(40, 18, 12, 0.65)";
  canvasContext.lineWidth = 2;
  canvasContext.beginPath();
  canvasContext.moveTo(centerX, centerY - innerRadius * 1.04);
  canvasContext.lineTo(centerX - innerRadius * 0.06, centerY - innerRadius * 1.18);
  canvasContext.lineTo(centerX + innerRadius * 0.06, centerY - innerRadius * 1.18);
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.stroke();
  canvasContext.font = `${Math.max(13, innerRadius * 0.07)}px system-ui`;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.fillStyle = redPocket ? "rgba(255, 215, 210, 0.94)" : "rgba(210, 255, 224, 0.94)";
  canvasContext.fillText(`${redPocket ? "RED" : "GREEN"} ${number}`, centerX, centerY + innerRadius * 0.86);
  canvasContext.restore();
}

function drawHappyCloud(canvasContext, x, y, scale, drift) {
  canvasContext.save();
  canvasContext.translate(x, y + Math.sin(bobGardenFrame * 0.018 + drift) * scale * 2);
  canvasContext.fillStyle = "rgba(255, 246, 250, 0.78)";
  for (let puff = 0; puff < 6; puff += 1) {
    const px = (puff - 2.5) * scale * 0.34;
    const py = Math.sin(puff + drift) * scale * 0.07;
    canvasContext.beginPath();
    canvasContext.ellipse(px, py, scale * (0.28 + (puff % 2) * 0.08), scale * 0.18, 0, 0, Math.PI * 2);
    canvasContext.fill();
  }
  canvasContext.restore();
}

function drawHappyTree(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const x = width * 0.82;
  const ground = height * 0.74;
  const size = Math.min(width, height) * (0.18 + handSizeMultiplier() * 0.035);
  const sway = Math.sin(bobGardenFrame * 0.025) * (0.08 + midsEnergy * 0.12);

  canvasContext.save();
  canvasContext.translate(x, ground);
  canvasContext.rotate(sway);
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";
  canvasContext.strokeStyle = hsla(28, 54, 28, 0.95);
  canvasContext.lineWidth = size * 0.14;
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);
  canvasContext.bezierCurveTo(-size * 0.08, -size * 0.32, size * 0.1, -size * 0.64, 0, -size);
  canvasContext.stroke();

  for (let branch = 0; branch < 7; branch += 1) {
    const side = branch % 2 ? 1 : -1;
    const by = -size * (0.28 + branch * 0.09);
    canvasContext.strokeStyle = hsla(34, 48, 30, 0.82);
    canvasContext.lineWidth = size * (0.035 + branch * 0.003);
    canvasContext.beginPath();
    canvasContext.moveTo(0, by);
    canvasContext.quadraticCurveTo(side * size * 0.12, by - size * 0.08, side * size * (0.24 + branch * 0.02), by - size * (0.14 + trebleEnergy * 0.08));
    canvasContext.stroke();
  }

  for (let cluster = 0; cluster < 15; cluster += 1) {
    const angle = cluster / 15 * Math.PI * 2;
    const radius = size * (0.22 + (cluster % 5) * 0.045);
    const lx = Math.cos(angle) * radius * 0.78;
    const ly = -size * 0.78 + Math.sin(angle) * radius * 0.58;
    canvasContext.fillStyle = hsla(105 + cluster * 5 + trebleEnergy * 28, 58, 36 + bassEnergy * 18, 0.86);
    canvasContext.beginPath();
    canvasContext.ellipse(lx, ly, size * (0.18 + bassEnergy * 0.04), size * (0.14 + midsEnergy * 0.05), angle * 0.4, 0, Math.PI * 2);
    canvasContext.fill();
  }

  canvasContext.fillStyle = "rgba(255, 235, 205, 0.82)";
  canvasContext.beginPath();
  canvasContext.ellipse(0, -size * 0.48, size * 0.1, size * 0.13, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = "rgba(43, 25, 17, 0.82)";
  [-1, 1].forEach((side) => {
    canvasContext.beginPath();
    canvasContext.arc(side * size * 0.035, -size * 0.5, size * 0.012, 0, Math.PI * 2);
    canvasContext.fill();
  });
  canvasContext.strokeStyle = hsla(345, 82, 48, 0.75 + bassEnergy * 0.2);
  canvasContext.lineWidth = Math.max(1, size * 0.012);
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.47, size * 0.045, 0.08, Math.PI - 0.08);
  canvasContext.stroke();

  canvasContext.restore();

  canvasContext.save();
  canvasContext.translate(width * 0.9, height * 0.74);
  canvasContext.rotate(Math.sin(bobGardenFrame * 0.04) * 0.12);
  canvasContext.fillStyle = hsla(64 + trebleEnergy * 30, 78, 58, 0.9);
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.2, size * 0.055, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.strokeStyle = hsla(42, 56, 30, 0.86);
  canvasContext.lineWidth = Math.max(2, size * 0.018);
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 0.15);
  canvasContext.lineTo(0, 0);
  canvasContext.stroke();
  canvasContext.strokeStyle = hsla(105, 60, 36, 0.8);
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 0.08);
  canvasContext.quadraticCurveTo(-size * 0.08, -size * 0.16, -size * 0.16, -size * 0.1);
  canvasContext.moveTo(0, -size * 0.08);
  canvasContext.quadraticCurveTo(size * 0.08, -size * 0.16, size * 0.16, -size * 0.1);
  canvasContext.stroke();
  canvasContext.restore();
}

function drawGardenCrop(canvasContext, kind, x, y, scale, intensity, hueShift) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.lineCap = "round";
  const sway = Math.sin(bobGardenFrame * 0.04 + x * 0.01 + hueShift) * scale * (0.12 + intensity * 0.18);

  const stem = (heightFactor = 1, hue = 112) => {
    canvasContext.strokeStyle = hsla(hue + hueShift, 64, 34 + intensity * 18, 0.9);
    canvasContext.lineWidth = Math.max(1, scale * 0.06);
    canvasContext.beginPath();
    canvasContext.moveTo(0, 0);
    canvasContext.quadraticCurveTo(sway, -scale * 0.45 * heightFactor, sway * 0.4, -scale * heightFactor);
    canvasContext.stroke();
  };

  if (kind === "mangeTout" || kind === "floweringPea" || kind === "sweetPea") {
    stem(1.45, 126);
    for (let pod = 0; pod < 4; pod += 1) {
      const side = pod % 2 ? 1 : -1;
      const py = -scale * (0.35 + pod * 0.23);
      canvasContext.fillStyle = kind === "floweringPea" ? hsla(320 + pod * 18, 72, 62, 0.92) : hsla(118 + pod * 8, 64, 45, 0.9);
      canvasContext.beginPath();
      canvasContext.ellipse(side * scale * 0.18 + sway * 0.35, py, scale * 0.18, scale * 0.07, side * 0.4, 0, Math.PI * 2);
      canvasContext.fill();
    }
  } else if (kind === "potato") {
    stem(0.85, 100);
    canvasContext.fillStyle = hsla(36, 48, 52, 0.92);
    canvasContext.beginPath();
    canvasContext.ellipse(-scale * 0.05, scale * 0.05, scale * 0.22, scale * 0.14, 0.2, 0, Math.PI * 2);
    canvasContext.fill();
  } else if (kind === "garlic" || kind === "onion" || kind === "parsnip" || kind === "beetroot") {
    stem(0.75 + intensity * 0.3, kind === "beetroot" ? 132 : 106);
    const hue = kind === "beetroot" ? 326 : kind === "parsnip" ? 46 : kind === "garlic" ? 52 : 22;
    canvasContext.fillStyle = hsla(hue, kind === "garlic" ? 38 : 68, kind === "garlic" ? 72 : 54, 0.92);
    canvasContext.beginPath();
    canvasContext.ellipse(0, scale * 0.04, scale * 0.16, scale * 0.2, 0, 0, Math.PI * 2);
    canvasContext.fill();
  } else if (kind === "chilli" || kind === "tomato" || kind === "strawberry") {
    stem(1.05, 116);
    const hue = kind === "chilli" ? 358 : kind === "tomato" ? 8 : 344;
    canvasContext.fillStyle = hsla(hue + intensity * 20, 90, 48 + intensity * 14, 0.94);
    canvasContext.beginPath();
    if (kind === "chilli") {
      canvasContext.ellipse(sway * 0.6, -scale * 0.58, scale * 0.09, scale * 0.28, 0.18, 0, Math.PI * 2);
    } else {
      canvasContext.arc(sway * 0.5, -scale * 0.58, scale * (kind === "tomato" ? 0.18 : 0.14), 0, Math.PI * 2);
    }
    canvasContext.fill();
  } else if (kind === "mushroom") {
    canvasContext.fillStyle = hsla(38, 38, 72, 0.9);
    canvasContext.fillRect(-scale * 0.05, -scale * 0.22, scale * 0.1, scale * 0.25);
    canvasContext.fillStyle = hsla(292 + intensity * 50, 72, 58, 0.88);
    canvasContext.beginPath();
    canvasContext.ellipse(0, -scale * 0.27, scale * 0.26, scale * 0.15, 0, Math.PI, Math.PI * 2);
    canvasContext.fill();
  } else if (kind === "hemp" || kind === "marjoram" || kind === "sage" || kind === "basil" || kind === "borage") {
    stem(kind === "hemp" ? 1.35 : 0.95, kind === "hemp" ? 128 : 104);
    const leaves = kind === "hemp" ? 7 : 5;
    for (let leaf = 0; leaf < leaves; leaf += 1) {
      const angle = -Math.PI / 2 + (leaf - (leaves - 1) / 2) * 0.36;
      const length = scale * (kind === "hemp" ? 0.34 : 0.22);
      canvasContext.fillStyle = hsla(kind === "borage" ? 210 : 118 + leaf * 4, 58 + intensity * 24, 36 + intensity * 18, 0.88);
      canvasContext.beginPath();
      canvasContext.ellipse(Math.cos(angle) * length * 0.4 + sway * 0.3, -scale * 0.62 + Math.sin(angle) * length * 0.35, length * 0.42, scale * 0.055, angle, 0, Math.PI * 2);
      canvasContext.fill();
    }
    if (kind === "borage") {
      canvasContext.fillStyle = hsla(218, 82, 62, 0.9);
      canvasContext.beginPath();
      canvasContext.arc(sway * 0.4, -scale * 0.95, scale * 0.11, 0, Math.PI * 2);
      canvasContext.fill();
    }
  } else if (kind === "pumpkin") {
    stem(0.65, 106);
    canvasContext.fillStyle = hsla(30 + intensity * 18, 92, 52, 0.95);
    canvasContext.beginPath();
    canvasContext.ellipse(0, -scale * 0.06, scale * 0.27, scale * 0.19, 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.strokeStyle = hsla(22, 72, 38, 0.5);
    for (let rib = -1; rib <= 1; rib += 1) {
      canvasContext.beginPath();
      canvasContext.moveTo(rib * scale * 0.08, -scale * 0.23);
      canvasContext.quadraticCurveTo(rib * scale * 0.14, -scale * 0.06, rib * scale * 0.08, scale * 0.1);
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function setupBobGardenBugs(width, height) {
  const target = Math.max(6, Math.min(26, handCountValueNumber() + 8));
  while (bobGardenBugs.length < target) {
    bobGardenBugs.push({
      x: Math.random() * width,
      y: height * (0.28 + Math.random() * 0.45),
      phase: Math.random() * Math.PI * 2,
      hue: 34 + Math.random() * 260,
      speed: 0.45 + Math.random() * 1.1,
      size: 0.6 + Math.random() * 0.9,
    });
  }
  if (bobGardenBugs.length > target) bobGardenBugs.splice(target);
}

function drawBobGardenBug(canvasContext, bug, width, height, trebleEnergy) {
  const buzz = handGraspAmount();
  bug.x += Math.sin(bobGardenFrame * 0.022 * bug.speed + bug.phase) * (0.45 + buzz * 1.6);
  bug.y += Math.cos(bobGardenFrame * 0.034 * bug.speed + bug.phase) * (0.26 + trebleEnergy * 1.2);
  bug.x = (bug.x + width) % width;
  bug.y = clampNumber(bug.y, height * 0.18, height * 0.78);

  const size = Math.min(width, height) * 0.012 * bug.size;
  const wing = Math.sin(bobGardenFrame * (0.22 + trebleEnergy * 0.18) + bug.phase);
  canvasContext.save();
  canvasContext.translate(bug.x, bug.y);
  canvasContext.rotate(Math.sin(bobGardenFrame * 0.02 + bug.phase) * 0.4);
  canvasContext.fillStyle = hsla(bug.hue, 78, 58 + trebleEnergy * 18, 0.86);
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, size * 0.65, size * 0.42, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = "rgba(255, 255, 245, 0.38)";
  [-1, 1].forEach((side) => {
    canvasContext.beginPath();
    canvasContext.ellipse(side * size * 0.44, -size * 0.2, size * 0.52, size * (0.18 + Math.abs(wing) * 0.24), side * 0.45, 0, Math.PI * 2);
    canvasContext.fill();
  });
  canvasContext.fillStyle = "rgba(30, 24, 20, 0.78)";
  canvasContext.beginPath();
  canvasContext.arc(size * 0.22, -size * 0.05, size * 0.07, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawBobRossGardenScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  const choice = bobRossChoice();
  bobGardenFrame += fireworkSpeedMultiplier() * (0.58 + bassEnergy * 0.44 + trebleEnergy * 0.2);
  const roulette = bobRossRouletteState(width, height, bassEnergy, trebleEnergy);
  const landedChoice = bobRossGardenChoices[bobRossRouletteOrder[roulette.sector]];
  const activeChoice = {
    sky: choice.sky + roulette.hueShift * 0.26,
    soil: choice.soil + roulette.sector * 3,
    crops: [...choice.crops, landedChoice.crops[roulette.number % landedChoice.crops.length]],
  };
  const growth = handSizeMultiplier() * roulette.growthBoost;
  const plantings = handCountValueNumber();
  const buzz = handGraspAmount() * roulette.insectBoost;

  drawBobRossRouletteFrame(canvasContext, width, height, activeChoice, bassEnergy, trebleEnergy, roulette);

  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.ellipse(
    roulette.centerX,
    roulette.centerY,
    roulette.innerRadius * 0.9,
    roulette.innerRadius * 0.74,
    0,
    0,
    Math.PI * 2,
  );
  canvasContext.clip();

  const sky = canvasContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, hsla(activeChoice.sky, 78 + roulette.earthlyDelight * 16, 78, 0.98));
  sky.addColorStop(0.48, hsla(activeChoice.sky + 34 + roulette.number, 62, 68 - roulette.earthlyDelight * 8, 0.96));
  sky.addColorStop(1, hsla(112 + midsEnergy * 28 + roulette.hueShift * 0.12, 48, 42, 0.98));
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  for (let ray = 0; ray < 13; ray += 1) {
    const x = width * (0.12 + ray * 0.07);
    const top = height * (0.12 + Math.sin(ray + bobGardenFrame * 0.01) * 0.04);
    canvasContext.strokeStyle = hsla(activeChoice.sky + ray * 18, 76, 72, 0.035 + roulette.earthlyDelight * 0.035);
    canvasContext.lineWidth = Math.max(1, width * 0.018);
    canvasContext.beginPath();
    canvasContext.moveTo(width * 0.5, height * 0.08);
    canvasContext.lineTo(x, top + height * 0.48);
    canvasContext.stroke();
  }

  drawHappyCloud(canvasContext, width * 0.36, height * 0.16, Math.min(width, height) * 0.18, roulette.number);
  drawHappyCloud(canvasContext, width * 0.68, height * 0.23, Math.min(width, height) * 0.13, roulette.sector);

  const pond = canvasContext.createRadialGradient(width * 0.58, height * 0.82, 0, width * 0.58, height * 0.82, width * 0.32);
  pond.addColorStop(0, hsla(190 + trebleEnergy * 40 + roulette.hueShift * 0.2, 70, 58, 0.38));
  pond.addColorStop(1, "rgba(25, 90, 65, 0)");
  canvasContext.fillStyle = pond;
  canvasContext.beginPath();
  canvasContext.ellipse(width * 0.58, height * 0.82, width * 0.3, height * 0.09, 0, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = hsla(activeChoice.soil, 52 + roulette.earthlyDelight * 20, 25, 0.92);
  canvasContext.beginPath();
  canvasContext.moveTo(0, height * 0.62);
  canvasContext.bezierCurveTo(width * 0.25, height * 0.56, width * 0.58, height * 0.68, width, height * 0.58);
  canvasContext.lineTo(width, height);
  canvasContext.lineTo(0, height);
  canvasContext.closePath();
  canvasContext.fill();

  for (let row = 0; row < 4; row += 1) {
    const y = height * (0.66 + row * 0.075);
    canvasContext.strokeStyle = hsla(activeChoice.soil + 8 + roulette.number * 0.5, 42, 18 + row * 3, 0.32);
    canvasContext.lineWidth = Math.max(2, height * 0.008);
    canvasContext.beginPath();
    canvasContext.moveTo(width * 0.05, y);
    canvasContext.quadraticCurveTo(width * 0.46, y - height * 0.04, width * 0.94, y + height * 0.02);
    canvasContext.stroke();
  }

  const cropCount = Math.max(18, Math.round(plantings * (8 + roulette.earthlyDelight * 2)));
  for (let index = 0; index < cropCount; index += 1) {
    const row = index % 4;
    const slot = Math.floor(index / 4);
    const t = (slot + 0.5) / Math.ceil(cropCount / 4);
    const x = width * (0.08 + t * 0.72) + Math.sin(index * 2.1) * width * 0.012;
    const y = height * (0.67 + row * 0.075) + Math.cos(index * 1.7) * height * 0.008;
    const kind = activeChoice.crops[index % activeChoice.crops.length];
    const intensity = intensities[index % intensities.length] || 0.18;
    const scale = Math.min(width, height) * (0.021 + row * 0.0038) * growth * (0.85 + intensity * 0.45);
    drawGardenCrop(canvasContext, kind, x, y, scale, intensity, index * 7 + roulette.hueShift);
  }

  drawHappyTree(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
  setupBobGardenBugs(width, height);
  bobGardenBugs.forEach((bug) => drawBobGardenBug(canvasContext, bug, width, height, trebleEnergy + buzz * 0.25));
  canvasContext.restore();

  canvasContext.save();
  canvasContext.strokeStyle = "rgba(255, 245, 210, 0.72)";
  canvasContext.lineWidth = Math.max(2, roulette.innerRadius * 0.018);
  canvasContext.shadowBlur = 18;
  canvasContext.shadowColor = hsla(activeChoice.sky, 90, 72, 0.52);
  canvasContext.beginPath();
  canvasContext.ellipse(
    roulette.centerX,
    roulette.centerY,
    roulette.innerRadius * 0.9,
    roulette.innerRadius * 0.74,
    0,
    0,
    Math.PI * 2,
  );
  canvasContext.stroke();
  canvasContext.restore();
}

function drawBobRossGardenFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 10), 1.28);
  const midsEnergy = pressureResponse(averageBand(buffer, 14, 58), 1.28);
  const trebleEnergy = pressureResponse(averageBand(buffer, 62, 118), 1.38);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.28));
  drawBobRossGardenScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

const oilSlidePalettes = {
  acid: [54, 318, 184, 24, 266],
  warm: [350, 22, 42, 8, 316],
  cool: [188, 224, 272, 162, 310],
  garden: [104, 142, 54, 326, 182],
  nocturne: [232, 268, 198, 318, 38],
  candy: [330, 38, 188, 286, 72],
};

function oilSlidePalette() {
  return oilSlidePalettes[fireworkFormSelect.value] || oilSlidePalettes.acid;
}

function setupOilBlobs(width, height) {
  const target = Math.max(8, Math.min(34, handCountValueNumber() * 2));
  const palette = oilSlidePalette();
  while (oilBlobs.length < target) {
    const index = oilBlobs.length;
    const stretch = 0.62 + Math.random() * 1.25;
    oilBlobs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.018,
      vy: (Math.random() - 0.5) * 0.015,
      radius: 0.11 + Math.random() * 0.22,
      stretch,
      baseStretch: stretch,
      phase: Math.random() * Math.PI * 2,
      hue: palette[index % palette.length] + Math.random() * 22,
      band: index % fireworksBands.length,
      spin: (Math.random() - 0.5) * 0.001,
    });
  }
  if (oilBlobs.length > target) {
    oilBlobs.splice(target);
  }
}

function drawOilSlideBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const palette = oilSlidePalette();
  const baseHue = palette[0];
  const wash = canvasContext.createLinearGradient(0, 0, width, height);
  wash.addColorStop(0, hsla(baseHue + oilSlideFrame * 0.006, 82, 13 + trebleEnergy * 10, 0.98));
  wash.addColorStop(0.48, hsla(palette[2] - oilSlideFrame * 0.004, 74, 10 + bassEnergy * 12, 0.98));
  wash.addColorStop(1, hsla(palette[4] + oilSlideFrame * 0.005, 78, 8 + trebleEnergy * 8, 0.98));
  canvasContext.fillStyle = wash;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  for (let band = 0; band < 7; band += 1) {
    const y = height * (0.12 + band * 0.13 + Math.sin(oilSlideFrame * 0.00065 + band) * 0.025);
    const gradient = canvasContext.createLinearGradient(0, y - height * 0.08, width, y + height * 0.08);
    gradient.addColorStop(0, hsla(palette[band % palette.length] + band * 12, 92, 44, 0));
    gradient.addColorStop(0.5, hsla(palette[(band + 2) % palette.length], 88, 52 + trebleEnergy * 12, 0.075 + bassEnergy * 0.05));
    gradient.addColorStop(1, hsla(palette[(band + 4) % palette.length], 92, 44, 0));
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, y - height * 0.06, width, height * 0.14);
  }
  canvasContext.restore();
}

function settleOilBlobInteractions(width, height, bassEnergy, midsEnergy) {
  const scale = handSizeMultiplier();
  const agitation = handGraspAmount();
  const viscosity = 0.000004 + agitation * 0.000008 + bassEnergy * 0.000004;
  const limit = 0.038 + agitation * 0.018 + midsEnergy * 0.012;

  for (let aIndex = 0; aIndex < oilBlobs.length; aIndex += 1) {
    const a = oilBlobs[aIndex];
    a.stretch += ((a.baseStretch || 1) - a.stretch) * 0.006;
    for (let bIndex = aIndex + 1; bIndex < oilBlobs.length; bIndex += 1) {
      const b = oilBlobs[bIndex];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 1;
      const reach = Math.min(width, height) * (a.radius + b.radius) * scale * 0.48;
      if (distance >= reach) continue;

      const pressure = (reach - distance) / reach;
      const nx = dx / distance;
      const ny = dy / distance;
      const force = pressure * viscosity;
      a.vx -= nx * force;
      a.vy -= ny * force;
      b.vx += nx * force;
      b.vy += ny * force;
      a.stretch += pressure * 0.00035;
      b.stretch += pressure * 0.00035;
    }
    a.vx = clampNumber(a.vx, -limit, limit);
    a.vy = clampNumber(a.vy, -limit, limit);
    a.stretch = clampNumber(a.stretch, 0.48, 2.25);
  }
}

function drawOilBlob(canvasContext, blob, width, height, intensity, bassEnergy, midsEnergy, trebleEnergy) {
  const cellScale = handSizeMultiplier();
  const agitation = handGraspAmount();
  const flow = fireworkSpeedMultiplier();
  const radius = Math.min(width, height) * blob.radius * cellScale * (0.82 + intensity * 0.34 + bassEnergy * 0.12);
  const pulse = Math.sin(oilSlideFrame * (0.0012 + flow * 0.00045) + blob.phase) * 0.5 + 0.5;
  const drift = 0.014 + flow * 0.018 + agitation * 0.035;

  blob.vx += Math.sin(oilSlideFrame * 0.0008 + blob.phase) * 0.00018 * drift + (midsEnergy - 0.18) * 0.00032;
  blob.vy += Math.cos(oilSlideFrame * 0.0007 + blob.phase * 0.7) * 0.00018 * drift + (trebleEnergy - 0.18) * 0.00024;
  blob.vx *= 0.92;
  blob.vy *= 0.92;
  blob.x = (blob.x + blob.vx * (0.032 + flow * 0.016) + width + radius) % (width + radius * 2) - radius;
  blob.y = (blob.y + blob.vy * (0.03 + flow * 0.014) + height + radius) % (height + radius * 2) - radius;

  canvasContext.save();
  canvasContext.translate(blob.x, blob.y);
  canvasContext.rotate(oilSlideFrame * blob.spin + Math.sin(blob.phase + oilSlideFrame * 0.00055) * 0.025);
  canvasContext.scale(blob.stretch + pulse * 0.055, 1 / (blob.stretch * 0.72 + 0.55));
  canvasContext.globalCompositeOperation = "lighter";
  const gradient = canvasContext.createRadialGradient(
    -radius * 0.22,
    -radius * 0.18,
    radius * 0.06,
    0,
    0,
    radius,
  );
  gradient.addColorStop(0, hsla(blob.hue + trebleEnergy * 54, 96, 72, 0.24 + intensity * 0.25));
  gradient.addColorStop(0.38, hsla(blob.hue, 92, 48 + pulse * 10, 0.34 + intensity * 0.24));
  gradient.addColorStop(0.72, hsla(blob.hue + 62 + bassEnergy * 34, 88, 36, 0.16 + agitation * 0.1));
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = gradient;
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, radius, radius * (0.54 + pulse * 0.09), 0, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.globalCompositeOperation = "source-over";
  canvasContext.strokeStyle = hsla(blob.hue + 38, 92, 74, 0.13 + intensity * 0.24);
  canvasContext.lineWidth = Math.max(1, radius * 0.018);
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, radius * 0.88, radius * (0.44 + pulse * 0.06), 0, 0, Math.PI * 2);
  canvasContext.stroke();
  canvasContext.restore();
}

function drawOilInterference(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const palette = oilSlidePalette();
  canvasContext.save();
  canvasContext.globalCompositeOperation = "overlay";
  for (let line = 0; line < 14; line += 1) {
    const y = height * (line / 13);
    const amplitude = height * (0.006 + trebleEnergy * 0.018);
    canvasContext.strokeStyle = hsla(palette[line % palette.length] + oilSlideFrame * 0.014, 90, 62, 0.045 + midsEnergy * 0.035);
    canvasContext.lineWidth = Math.max(1, height * 0.0025);
    canvasContext.beginPath();
    for (let step = 0; step <= 60; step += 1) {
      const x = width * (step / 60);
      const wave = Math.sin(step * 0.5 + oilSlideFrame * 0.0018 + line) * amplitude
        + Math.cos(step * 0.17 + oilSlideFrame * 0.0009 + line * 2) * amplitude * (0.8 + bassEnergy);
      if (step === 0) canvasContext.moveTo(x, y + wave);
      else canvasContext.lineTo(x, y + wave);
    }
    canvasContext.stroke();
  }
  canvasContext.restore();
}

function drawOilSlideScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  oilSlideFrame += (0.014 + fireworkSpeedMultiplier() * 0.012) * (0.72 + bassEnergy * 0.12 + handGraspAmount() * 0.08);
  setupOilBlobs(width, height);
  settleOilBlobInteractions(width, height, bassEnergy, midsEnergy);
  drawOilSlideBackground(canvasContext, width, height, bassEnergy, trebleEnergy);

  canvasContext.save();
  canvasContext.filter = `blur(${Math.min(16, Math.max(2.5, Math.min(width, height) * 0.006))}px) saturate(${1.16 + trebleEnergy * 0.5})`;
  oilBlobs.forEach((blob) => {
    const intensity = intensities[blob.band % intensities.length] || 0.18;
    drawOilBlob(canvasContext, blob, width, height, intensity, bassEnergy, midsEnergy, trebleEnergy);
  });
  canvasContext.restore();

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  oilBlobs.slice(0, Math.min(10, oilBlobs.length)).forEach((blob, index) => {
    const radius = Math.min(width, height) * blob.radius * handSizeMultiplier() * 0.72;
    canvasContext.strokeStyle = hsla(blob.hue + 110, 88, 70, 0.06 + trebleEnergy * 0.08);
    canvasContext.lineWidth = Math.max(1, radius * 0.012);
    canvasContext.beginPath();
    canvasContext.arc(
      blob.x + Math.sin(oilSlideFrame * 0.0009 + index) * radius * 0.24,
      blob.y + Math.cos(oilSlideFrame * 0.00075 + index) * radius * 0.18,
      radius * (0.62 + bassEnergy * 0.35),
      0,
      Math.PI * 2,
    );
    canvasContext.stroke();
  });
  canvasContext.restore();

  drawOilInterference(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
}

function drawOilSlideFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 10), 1.28);
  const midsEnergy = pressureResponse(averageBand(buffer, 14, 58), 1.24);
  const trebleEnergy = pressureResponse(averageBand(buffer, 62, 118), 1.36);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.24));
  drawOilSlideScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

const oysterPalettes = {
  lagoon: {
    water: [188, 214, 164],
    shell: [36, 28, 322],
    mantle: [296, 190, 54],
    pearl: [46, 198, 316],
  },
  opal: {
    water: [214, 282, 170],
    shell: [318, 38, 206],
    mantle: [184, 278, 18],
    pearl: [52, 172, 306],
  },
  midnight: {
    water: [226, 256, 188],
    shell: [250, 304, 18],
    mantle: [194, 278, 334],
    pearl: [206, 286, 42],
  },
  coral: {
    water: [186, 202, 156],
    shell: [14, 34, 338],
    mantle: [352, 24, 286],
    pearl: [40, 326, 178],
  },
};

function oysterPalette() {
  return oysterPalettes[fireworkFormSelect.value] || oysterPalettes.lagoon;
}

function setupOysters(width, height) {
  const target = Math.max(4, Math.min(22, handCountValueNumber() + 3));
  const columns = Math.ceil(Math.sqrt(target * 1.45));
  const rows = Math.ceil(target / columns);

  while (oysters.length < target) {
    const index = oysters.length;
    const column = index % columns;
    const row = Math.floor(index / columns);
    const cellWidth = width / columns;
    const cellHeight = height / Math.max(1, rows);
    const hasPearl = Math.random() > 0.42;
    oysters.push({
      x: cellWidth * (column + 0.5) + (Math.random() - 0.5) * cellWidth * 0.42,
      y: height * 0.24 + cellHeight * (row + 0.48) + (Math.random() - 0.5) * cellHeight * 0.28,
      scale: 0.72 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      band: index % fireworksBands.length,
      hueOffset: Math.random() * 18 - 9,
      hasPearl,
      grain: !hasPearl || Math.random() > 0.62,
      pearlAge: hasPearl ? 0.45 + Math.random() * 0.55 : Math.random() * 0.28,
      sway: Math.random() * Math.PI * 2,
    });
  }

  if (oysters.length > target) {
    oysters.splice(target);
  }
}

function drawOysterBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const palette = oysterPalette();
  const water = canvasContext.createLinearGradient(0, 0, 0, height);
  water.addColorStop(0, hsla(palette.water[0] + oysterFrame * 0.01, 58, 12 + trebleEnergy * 5, 1));
  water.addColorStop(0.48, hsla(palette.water[1] - oysterFrame * 0.006, 54, 17 + bassEnergy * 6, 1));
  water.addColorStop(1, hsla(palette.water[2], 48, 8, 1));
  canvasContext.fillStyle = water;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  for (let shaft = 0; shaft < 9; shaft += 1) {
    const x = width * (shaft / 8) + Math.sin(oysterFrame * 0.003 + shaft) * width * 0.035;
    const glow = canvasContext.createLinearGradient(x - width * 0.07, 0, x + width * 0.1, height);
    glow.addColorStop(0, "rgba(210, 255, 244, 0.06)");
    glow.addColorStop(0.5, "rgba(180, 234, 230, 0.025)");
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.beginPath();
    canvasContext.moveTo(x - width * 0.07, 0);
    canvasContext.lineTo(x + width * 0.05, 0);
    canvasContext.lineTo(x + width * 0.18, height);
    canvasContext.lineTo(x - width * 0.16, height);
    canvasContext.closePath();
    canvasContext.fill();
  }
  canvasContext.restore();

  const sand = canvasContext.createLinearGradient(0, height * 0.72, 0, height);
  sand.addColorStop(0, hsla(42, 24, 18, 0));
  sand.addColorStop(0.38, hsla(36, 34, 24, 0.72));
  sand.addColorStop(1, hsla(28, 42, 15, 1));
  canvasContext.fillStyle = sand;
  canvasContext.fillRect(0, height * 0.68, width, height * 0.32);

  canvasContext.save();
  canvasContext.globalAlpha = 0.22;
  for (let speck = 0; speck < 90; speck += 1) {
    const x = ((speck * 97.13 + Math.sin(oysterFrame * 0.002 + speck) * 18) % width + width) % width;
    const y = height * (0.69 + ((speck * 37.7) % 31) / 100);
    canvasContext.fillStyle = hsla(38 + (speck % 7) * 4, 34, 48 + (speck % 5) * 5, 0.28);
    canvasContext.beginPath();
    canvasContext.arc(x, y, 0.8 + (speck % 4) * 0.45, 0, Math.PI * 2);
    canvasContext.fill();
  }
  canvasContext.restore();
}

function drawOyster(canvasContext, oyster, width, height, intensity, bassEnergy, midsEnergy, trebleEnergy) {
  const palette = oysterPalette();
  const scaleControl = handSizeMultiplier();
  const pearlMaking = handGraspAmount();
  const shellBase = Math.min(width, height) * 0.078 * oyster.scale * (0.82 + scaleControl * 0.28);
  const openPulse = Math.sin(oysterFrame * (0.009 + fireworkSpeedMultiplier() * 0.004) + oyster.phase) * 0.5 + 0.5;
  const openness = 0.1 + openPulse * 0.36 + intensity * 0.28 + pearlMaking * 0.12;
  const wobble = Math.sin(oysterFrame * 0.006 + oyster.sway) * shellBase * 0.035;
  const x = oyster.x + wobble;
  const y = oyster.y + Math.sin(oysterFrame * 0.004 + oyster.phase) * shellBase * 0.08;
  const shellHue = palette.shell[oyster.band % palette.shell.length] + oyster.hueOffset;
  const mantleHue = palette.mantle[oyster.band % palette.mantle.length] + trebleEnergy * 22;

  oyster.pearlAge = clampNumber(oyster.pearlAge + (intensity * 0.00055 + pearlMaking * 0.00045), 0, 1);

  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(Math.sin(oysterFrame * 0.0025 + oyster.phase) * 0.035);

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  const halo = canvasContext.createRadialGradient(0, 0, shellBase * 0.2, 0, 0, shellBase * 2.3);
  halo.addColorStop(0, hsla(mantleHue, 72, 62, 0.08 + intensity * 0.11));
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = halo;
  canvasContext.fillRect(-shellBase * 2.4, -shellBase * 2.1, shellBase * 4.8, shellBase * 4.2);
  canvasContext.restore();

  canvasContext.fillStyle = hsla(mantleHue, 58, 30 + midsEnergy * 14, 0.9);
  canvasContext.beginPath();
  canvasContext.ellipse(0, shellBase * 0.18, shellBase * 0.98, shellBase * (0.34 + openness * 0.24), 0, 0, Math.PI * 2);
  canvasContext.fill();

  const topGradient = canvasContext.createLinearGradient(0, -shellBase * 1.3, 0, shellBase * 0.3);
  topGradient.addColorStop(0, hsla(shellHue + 16, 58, 68, 0.96));
  topGradient.addColorStop(0.55, hsla(shellHue, 48, 42, 0.97));
  topGradient.addColorStop(1, hsla(shellHue - 22, 54, 22, 0.98));
  canvasContext.fillStyle = topGradient;
  canvasContext.beginPath();
  canvasContext.ellipse(0, -shellBase * openness, shellBase * 1.12, shellBase * 0.52, -openness * 0.08, Math.PI, Math.PI * 2);
  canvasContext.quadraticCurveTo(shellBase * 0.72, -shellBase * 0.1, 0, shellBase * 0.12);
  canvasContext.quadraticCurveTo(-shellBase * 0.72, -shellBase * 0.1, -shellBase * 1.12, -shellBase * openness);
  canvasContext.fill();

  const bottomGradient = canvasContext.createLinearGradient(0, -shellBase * 0.15, 0, shellBase * 1.05);
  bottomGradient.addColorStop(0, hsla(shellHue + 34, 54, 72, 0.98));
  bottomGradient.addColorStop(0.56, hsla(shellHue + 5, 48, 48, 0.98));
  bottomGradient.addColorStop(1, hsla(shellHue - 34, 54, 24, 1));
  canvasContext.fillStyle = bottomGradient;
  canvasContext.beginPath();
  canvasContext.ellipse(0, shellBase * 0.22, shellBase * 1.16, shellBase * 0.6, 0, 0, Math.PI);
  canvasContext.quadraticCurveTo(shellBase * 0.68, shellBase * 0.82, 0, shellBase * 1.02);
  canvasContext.quadraticCurveTo(-shellBase * 0.68, shellBase * 0.82, -shellBase * 1.16, shellBase * 0.22);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(shellHue + 20, 64, 80, 0.28);
  canvasContext.lineWidth = Math.max(1, shellBase * 0.022);
  for (let rib = -4; rib <= 4; rib += 1) {
    canvasContext.beginPath();
    canvasContext.moveTo(0, shellBase * 0.95);
    canvasContext.quadraticCurveTo(shellBase * rib * 0.12, shellBase * 0.24, shellBase * rib * 0.24, -shellBase * openness * 0.75);
    canvasContext.stroke();
  }

  const pearlRadius = shellBase * (0.09 + oyster.pearlAge * 0.17 + intensity * 0.03);
  if (oyster.hasPearl || oyster.pearlAge > 0.36) {
    const pearlHue = palette.pearl[oyster.band % palette.pearl.length] + trebleEnergy * 34;
    const pearlGradient = canvasContext.createRadialGradient(
      -pearlRadius * 0.32,
      -pearlRadius * 0.35,
      pearlRadius * 0.08,
      0,
      0,
      pearlRadius,
    );
    pearlGradient.addColorStop(0, "rgba(255, 255, 255, 0.98)");
    pearlGradient.addColorStop(0.34, hsla(pearlHue, 76, 80, 0.96));
    pearlGradient.addColorStop(1, hsla(pearlHue + 88, 50, 44, 0.88));
    canvasContext.fillStyle = pearlGradient;
    canvasContext.beginPath();
    canvasContext.arc(0, shellBase * 0.2, pearlRadius, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.strokeStyle = "rgba(255, 255, 255, 0.42)";
    canvasContext.lineWidth = Math.max(1, pearlRadius * 0.08);
    canvasContext.stroke();
  }

  if (oyster.grain && oyster.pearlAge < 0.82) {
    canvasContext.fillStyle = hsla(42, 42, 68, 0.78);
    canvasContext.beginPath();
    canvasContext.arc(shellBase * 0.28, shellBase * 0.18, shellBase * 0.032, 0, Math.PI * 2);
    canvasContext.fill();
  }

  canvasContext.restore();
}

function drawOysterPearlsScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities) {
  oysterFrame += (0.045 + fireworkSpeedMultiplier() * 0.038) * (0.72 + bassEnergy * 0.18);
  setupOysters(width, height);
  drawOysterBackground(canvasContext, width, height, bassEnergy, trebleEnergy);

  oysters
    .slice()
    .sort((a, b) => a.y - b.y)
    .forEach((oyster) => {
      const intensity = intensities[oyster.band % intensities.length] || 0.14;
      drawOyster(canvasContext, oyster, width, height, intensity, bassEnergy, midsEnergy, trebleEnergy);
    });

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";
  for (let bubble = 0; bubble < 36; bubble += 1) {
    const drift = Math.sin(oysterFrame * 0.009 + bubble * 1.7);
    const x = ((bubble * 71.3 + drift * 18) % width + width) % width;
    const y = ((height - ((oysterFrame * (0.12 + trebleEnergy * 0.18) + bubble * 43) % (height * 1.1))) + height * 0.08) % (height * 1.1);
    const radius = Math.max(1.2, Math.min(width, height) * (0.003 + (bubble % 5) * 0.0009));
    canvasContext.strokeStyle = `rgba(220, 255, 248, ${0.06 + trebleEnergy * 0.08})`;
    canvasContext.lineWidth = Math.max(1, radius * 0.18);
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI * 2);
    canvasContext.stroke();
  }
  canvasContext.restore();
}

function drawOysterPearlsFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 10), 1.2);
  const midsEnergy = pressureResponse(averageBand(buffer, 14, 58), 1.18);
  const trebleEnergy = pressureResponse(averageBand(buffer, 62, 118), 1.24);
  const intensities = fireworksBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.18));
  drawOysterPearlsScene(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy, intensities);
}

function setupLoucheLizards(width, height) {
  const targetCount = handCountValueNumber();
  if (loucheLizards.length === targetCount) return;

  const columns = Math.ceil(Math.sqrt(targetCount * 1.65));
  const rows = Math.ceil(targetCount / columns);
  loucheLizards = Array.from({ length: targetCount }, (_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    return {
      index,
      bandIndex: index % lizardBands.length,
      homeX: width * ((col + 0.58) / Math.max(1, columns)),
      homeY: height * (0.24 + ((row + 0.58) / Math.max(1, rows)) * 0.58),
      phase: Math.random() * Math.PI * 2,
      swagger: 0.65 + Math.random() * 0.7,
      direction: index % 2 === 0 ? 1 : -1,
      energy: 0,
      hueOffset: Math.random() * 42,
    };
  });
}

function lizardHue(index, count, intensity) {
  const theme = themeSelect.value;
  const progress = index / Math.max(1, count - 1);
  if (theme === "ice") return 184 + progress * 80 + intensity * 36;
  if (theme === "ember") return 12 + progress * 62 + intensity * 30;
  if (theme === "pressure") return 330 - progress * 260 + intensity * 74;
  return 320 - progress * 320 + intensity * 54;
}

function drawLizardClub(canvasContext, width, height, bassEnergy, trebleEnergy) {
  canvasContext.fillStyle = "rgba(5, 3, 9, 0.28)";
  canvasContext.fillRect(0, 0, width, height);

  const room = canvasContext.createLinearGradient(0, 0, width, height);
  room.addColorStop(0, hsla(300 + trebleEnergy * 40, 98, 18, 0.34));
  room.addColorStop(0.48, "rgba(8, 8, 14, 0.34)");
  room.addColorStop(1, hsla(140 + bassEnergy * 80, 96, 16, 0.42));
  canvasContext.fillStyle = room;
  canvasContext.fillRect(0, 0, width, height);

  const tile = Math.max(28, width / 24);
  for (let x = -tile; x < width + tile; x += tile) {
    for (let y = height * 0.62; y < height + tile; y += tile) {
      const pulse = Math.sin(lizardFrame * 0.045 + x * 0.03 + y * 0.02) * 0.5 + 0.5;
      canvasContext.fillStyle = hsla(330 - pulse * 260 + bassEnergy * 80, 96, 34 + pulse * 18, 0.1 + bassEnergy * 0.16);
      canvasContext.fillRect(x, y, tile - 2, tile - 2);
    }
  }

  for (let beam = 0; beam < 6; beam += 1) {
    const hue = lizardHue(beam, 6, trebleEnergy);
    const x = width * (0.08 + beam * 0.18 + Math.sin(lizardFrame * 0.014 + beam) * 0.045);
    const glow = canvasContext.createRadialGradient(x, height * 0.1, 0, x, height * 0.1, width * 0.22);
    glow.addColorStop(0, hsla(hue, 100, 62, 0.12 + trebleEnergy * 0.18));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.fillRect(0, 0, width, height);
  }
}

function drawZootLizard(canvasContext, lizard, count, intensity, width, height) {
  const tempo = fireworkSpeedMultiplier();
  const scale = handSizeMultiplier();
  const mood = handGraspAmount();
  const band = lizardBands[lizard.bandIndex];
  const beat = lizardFrame * (0.055 + lizard.bandIndex * 0.005) + lizard.phase;
  const commonBeat = lizardFrame * 0.072;
  const size = Math.min(width, height) * 0.055 * scale * (0.86 + intensity * 0.36);
  const hue = lizardHue(lizard.index, count, intensity) + lizard.hueOffset;
  const shimmy = Math.sin(commonBeat * 2 + lizard.phase) * (0.16 + intensity * 0.48 + mood * 0.18);
  const individual = Math.sin(beat * 1.7) * lizard.swagger * (0.12 + intensity * 0.28);
  const glide = band.move === "side-glide" ? Math.sin(beat) * width * intensity * 0.018 : 0;
  const bounce = Math.abs(Math.sin(commonBeat + lizard.phase)) * size * (0.18 + intensity * 0.72);
  const tailPop = band.move === "tail-pop" ? Math.sin(beat * 2.4) * size * (0.7 + intensity) : 0;
  const lapel = band.move === "lapel-snap" ? Math.max(0, Math.sin(beat * 3.1)) * intensity : 0;
  const hatTip = band.move === "hat-tip" ? Math.max(0, Math.sin(beat * 2.2)) * intensity : 0;
  const tongue = band.move === "tongue-flick" ? Math.max(0, Math.sin(beat * 4.8)) * intensity : 0;
  const x = lizard.homeX + glide + Math.sin(beat * 0.5) * intensity * width * 0.01;
  const y = lizard.homeY - bounce;

  lizard.homeX += Math.sin(beat * 0.2) * intensity * tempo * 0.28;
  lizard.homeY += Math.cos(beat * 0.17) * intensity * tempo * 0.16;
  lizard.homeX += (Math.min(width * 0.92, Math.max(width * 0.08, lizard.homeX)) - lizard.homeX) * 0.018;
  lizard.homeY += (Math.min(height * 0.84, Math.max(height * 0.18, lizard.homeY)) - lizard.homeY) * 0.018;

  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.scale(lizard.direction, 1);
  canvasContext.rotate(shimmy + individual);
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";

  const glow = canvasContext.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 4.5);
  glow.addColorStop(0, hsla(hue, 100, 58, 0.16 + intensity * 0.24));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(0, size * 0.4, size * 4.5, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(hue + 80, 100, 54, 0.72);
  canvasContext.lineWidth = Math.max(2, size * 0.22);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.22, size * 1.04);
  canvasContext.quadraticCurveTo(-size * (1.05 + intensity), size * (1.4 + mood), -size * (1.9 + mood), size * (1.05 + tailPop * 0.02));
  canvasContext.stroke();

  const suitHue = hue + 110 + Math.sin(beat) * 45;
  canvasContext.fillStyle = hsla(suitHue, 100, 42 + intensity * 18, 0.96);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.62, -size * 0.15);
  canvasContext.lineTo(size * 0.62, -size * 0.15);
  canvasContext.lineTo(size * (0.92 + lapel * 0.35), size * 1.2);
  canvasContext.lineTo(-size * (0.92 + lapel * 0.35), size * 1.2);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.fillStyle = hsla(hue + 220, 100, 66, 0.9);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.45, -size * 0.08);
  canvasContext.lineTo(0, size * 0.52 + lapel * size * 0.24);
  canvasContext.lineTo(size * 0.45, -size * 0.08);
  canvasContext.lineTo(size * 0.18, size * 0.88);
  canvasContext.lineTo(-size * 0.18, size * 0.88);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(hue + 20, 100, 74, 0.95);
  canvasContext.lineWidth = Math.max(1.4, size * 0.12);
  const armShimmy = Math.sin(beat * 3.4) * size * (0.35 + mood * 0.5 + intensity * 0.5);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.55, size * 0.18);
  canvasContext.lineTo(-size * (1.12 + intensity * 0.45), size * 0.22 + armShimmy);
  canvasContext.moveTo(size * 0.55, size * 0.18);
  canvasContext.lineTo(size * (1.05 + hatTip * 0.72), -size * (0.08 + hatTip * 0.58) - armShimmy * 0.5);
  canvasContext.stroke();

  canvasContext.strokeStyle = hsla(hue + 160, 92, 56, 0.9);
  canvasContext.lineWidth = Math.max(1.5, size * 0.15);
  const leg = Math.sin(commonBeat * 2.3 + lizard.phase) * size * (0.36 + intensity * 0.52);
  canvasContext.beginPath();
  canvasContext.moveTo(-size * 0.3, size * 1.12);
  canvasContext.lineTo(-size * 0.62, size * 1.88 + leg);
  canvasContext.moveTo(size * 0.28, size * 1.12);
  canvasContext.lineTo(size * 0.62, size * 1.84 - leg);
  canvasContext.stroke();

  canvasContext.fillStyle = hsla(hue + 70, 100, 48 + intensity * 18, 0.96);
  canvasContext.beginPath();
  canvasContext.ellipse(0, -size * 0.64, size * 0.56, size * 0.42, -0.05, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.ellipse(size * 0.5, -size * 0.62, size * 0.36, size * 0.19, 0.1, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(3, 4, 7, 0.92)";
  canvasContext.fillRect(-size * 0.42, -size * 0.72, size * 0.86, size * 0.14);
  canvasContext.fillStyle = hsla(hue + 260, 100, 62, 0.95);
  canvasContext.fillRect(-size * 0.34, -size * (1.14 + hatTip * 0.18), size * 0.74, size * 0.18);
  canvasContext.fillRect(-size * 0.18, -size * (1.46 + hatTip * 0.26), size * 0.42, size * 0.34);

  if (tongue > 0.05) {
    canvasContext.strokeStyle = hsla(330, 100, 68, 0.85);
    canvasContext.lineWidth = Math.max(1, size * 0.045);
    canvasContext.beginPath();
    canvasContext.moveTo(size * 0.82, -size * 0.58);
    canvasContext.quadraticCurveTo(size * (1.2 + tongue), -size * 0.65, size * (1.5 + tongue), -size * (0.5 + tongue * 0.3));
    canvasContext.stroke();
  }

  canvasContext.restore();
}

function drawLizardLoucheFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const tempo = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  lizardFrame += tempo;
  setupLoucheLizards(width, height);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.38);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.44);
  const bandIntensities = lizardBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.5));

  drawLizardClub(canvasContext, width, height, bassEnergy, trebleEnergy);

  loucheLizards.forEach((lizard) => {
    lizard.energy = lizard.energy * 0.8 + bandIntensities[lizard.bandIndex] * 0.2;
  });

  [...loucheLizards]
    .sort((a, b) => a.homeY - b.homeY)
    .forEach((lizard) => {
      drawZootLizard(canvasContext, lizard, loucheLizards.length, lizard.energy, width, height);
    });
}

function setupOcclusionOctopi(width, height) {
  const targetCount = handCountValueNumber();
  if (occlusionOctopi.length === targetCount) {
    return;
  }

  occlusionOctopi = Array.from({ length: targetCount }, (_, index) => ({
    index,
    x: width * (0.14 + Math.random() * 0.72),
    y: height * (0.2 + Math.random() * 0.62),
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    baseSize: Math.min(width, height) * (0.07 + Math.random() * 0.035),
    phase: Math.random() * Math.PI * 2,
    mood: Math.floor(Math.random() * 5),
    energy: 0,
    hueOffset: Math.random() * 36,
  }));
}

function octopusBand(index, count, bufferLength) {
  const usableStart = 1;
  const usableEnd = Math.min(112, bufferLength - 1);
  const usableBins = Math.max(1, usableEnd - usableStart + 1);
  const slice = Math.max(1, Math.floor(usableBins / count));
  const start = usableStart + index * slice;
  const end = index === count - 1 ? usableEnd : Math.min(usableEnd, start + slice - 1);
  return { start, end };
}

function octopusHue(index, count, intensity) {
  const theme = themeSelect.value;
  const progress = index / Math.max(1, count - 1);
  if (theme === "ice") return 184 + progress * 74 + intensity * 34;
  if (theme === "ember") return 8 + progress * 48 + intensity * 28;
  if (theme === "pressure") return 332 - progress * 230 + intensity * 64;
  if (theme === "spectrum") return 304 - progress * 274 + intensity * 42;
  return 156 + progress * 90 + intensity * 30;
}

function drawOctopusBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  canvasContext.fillStyle = "rgba(3, 6, 10, 0.32)";
  canvasContext.fillRect(0, 0, width, height);

  const water = canvasContext.createLinearGradient(0, 0, 0, height);
  water.addColorStop(0, hsla(octopusHue(5, 8, trebleEnergy), 66, 18 + trebleEnergy * 14, 0.3));
  water.addColorStop(0.55, "rgba(6, 14, 18, 0.34)");
  water.addColorStop(1, hsla(octopusHue(1, 8, bassEnergy), 66, 10 + bassEnergy * 14, 0.42));
  canvasContext.fillStyle = water;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.strokeStyle = `rgba(126, 230, 218, ${0.035 + trebleEnergy * 0.045})`;
  canvasContext.lineWidth = 1;
  for (let line = 0; line < 9; line += 1) {
    const y = height * (0.16 + line * 0.09);
    canvasContext.beginPath();
    for (let x = 0; x <= width; x += width / 32) {
      const waveY = y + Math.sin(x * 0.013 + octopusFrame * 0.018 + line) * (4 + bassEnergy * 18);
      if (x === 0) {
        canvasContext.moveTo(x, waveY);
      } else {
        canvasContext.lineTo(x, waveY);
      }
    }
    canvasContext.stroke();
  }
}

function drawAmusingOctopusFace(canvasContext, size, energy, mood, hue) {
  const eyeY = -size * 0.12;
  const blink = Math.max(0, Math.sin(octopusFrame * 0.05 + mood));
  const eyeHeight = size * (0.14 - blink * 0.09);

  canvasContext.fillStyle = "rgba(248, 249, 235, 0.92)";
  [-1, 1].forEach((side) => {
    canvasContext.beginPath();
    canvasContext.ellipse(side * size * 0.28, eyeY, size * 0.15, Math.max(size * 0.035, eyeHeight), 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.fillStyle = "rgba(5, 7, 9, 0.9)";
    canvasContext.beginPath();
    canvasContext.arc(side * size * (0.28 + Math.sin(octopusFrame * 0.03 + mood) * 0.035), eyeY, size * 0.055, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.fillStyle = "rgba(248, 249, 235, 0.92)";
  });

  canvasContext.strokeStyle = "rgba(5, 7, 9, 0.82)";
  canvasContext.lineWidth = Math.max(1, size * 0.07);
  canvasContext.beginPath();
  if (mood % 5 === 0) {
    canvasContext.arc(0, size * 0.18, size * (0.16 + energy * 0.1), 0.1 * Math.PI, 0.9 * Math.PI);
  } else if (mood % 5 === 1) {
    canvasContext.moveTo(-size * 0.18, size * 0.25);
    canvasContext.quadraticCurveTo(0, size * (0.34 + energy * 0.2), size * 0.22, size * 0.22);
  } else if (mood % 5 === 2) {
    canvasContext.moveTo(-size * 0.2, size * 0.24);
    canvasContext.lineTo(size * 0.2, size * 0.24);
  } else if (mood % 5 === 3) {
    canvasContext.arc(0, size * 0.25, size * (0.09 + energy * 0.16), 0, Math.PI * 2);
  } else {
    canvasContext.moveTo(-size * 0.22, size * 0.23);
    canvasContext.quadraticCurveTo(-size * 0.02, size * 0.08, size * 0.2, size * 0.22);
  }
  canvasContext.stroke();

  canvasContext.fillStyle = hsla(hue + 80, 90, 74, 0.36 + energy * 0.32);
  canvasContext.beginPath();
  canvasContext.arc(-size * 0.46, size * 0.08, size * (0.08 + energy * 0.05), 0, Math.PI * 2);
  canvasContext.arc(size * 0.46, size * 0.08, size * (0.08 + energy * 0.05), 0, Math.PI * 2);
  canvasContext.fill();
}

function drawOcclusionOctopus(canvasContext, octopus, count, intensity, band) {
  const scale = handSizeMultiplier();
  const moodControl = handGraspAmount();
  const hue = octopusHue(octopus.index, count, intensity) + octopus.hueOffset;
  const size = octopus.baseSize * scale * (0.72 + intensity * 0.85);
  const squash = 1 + Math.sin(octopusFrame * (0.04 + intensity * 0.08) + octopus.phase) * (0.08 + moodControl * 0.12);
  const alpha = 0.58 + intensity * 0.34;

  canvasContext.save();
  canvasContext.translate(octopus.x, octopus.y);
  canvasContext.scale(1 / squash, squash);
  canvasContext.globalAlpha = alpha;

  const glow = canvasContext.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 2.7);
  glow.addColorStop(0, hsla(hue, 92, 58, 0.14 + intensity * 0.2));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(0, size * 0.1, size * 2.7, 0, Math.PI * 2);
  canvasContext.fill();

  for (let arm = 0; arm < 8; arm += 1) {
    const side = arm < 4 ? -1 : 1;
    const lane = arm % 4;
    const rootX = side * size * (0.18 + lane * 0.075);
    const rootY = size * (0.42 + lane * 0.06);
    const curl = Math.sin(octopusFrame * (0.045 + intensity * 0.08) + octopus.phase + arm) * (0.32 + moodControl * 0.35 + intensity * 0.24);
    const reach = size * (0.65 + lane * 0.18 + intensity * 0.42);

    canvasContext.strokeStyle = hsla(hue + arm * 7, 78, 38 + intensity * 26, 0.56);
    canvasContext.lineWidth = Math.max(2, size * (0.15 - lane * 0.018));
    canvasContext.beginPath();
    canvasContext.moveTo(rootX, rootY);
    canvasContext.quadraticCurveTo(rootX + side * reach * 0.32, rootY + size * (0.24 + curl), rootX + side * reach * (0.72 + moodControl * 0.25), rootY + size * (0.5 + curl * 0.35));
    canvasContext.stroke();
  }

  const body = canvasContext.createRadialGradient(-size * 0.24, -size * 0.32, size * 0.14, 0, 0, size * 1.12);
  body.addColorStop(0, hsla(hue + 34, 88, 66 + intensity * 12, 0.95));
  body.addColorStop(0.58, hsla(hue, 72, 38 + intensity * 22, 0.92));
  body.addColorStop(1, hsla(hue - 40, 74, 22, 0.72));
  canvasContext.fillStyle = body;
  canvasContext.beginPath();
  canvasContext.ellipse(0, -size * 0.08, size * (0.82 + intensity * 0.18), size * (0.98 + intensity * 0.24), 0, 0, Math.PI * 2);
  canvasContext.fill();

  for (let spot = 0; spot < 9; spot += 1) {
    const angle = spot * 2.33 + octopus.phase;
    const radius = size * (0.18 + (spot % 4) * 0.12);
    canvasContext.fillStyle = hsla(hue + 80 + spot * 10, 88, 68, (0.12 + intensity * 0.28) * (spot % 3 === 0 ? 1.4 : 1));
    canvasContext.beginPath();
    canvasContext.arc(Math.cos(angle) * radius * 0.75, Math.sin(angle) * radius * 0.82 - size * 0.08, size * (0.035 + intensity * 0.055), 0, Math.PI * 2);
    canvasContext.fill();
  }

  drawAmusingOctopusFace(canvasContext, size, intensity, octopus.mood, hue);

  canvasContext.globalAlpha = 0.78;
  canvasContext.fillStyle = "rgba(235, 247, 248, 0.75)";
  canvasContext.font = `${Math.max(8, size * 0.22)}px Segoe UI, sans-serif`;
  canvasContext.textAlign = "center";
  canvasContext.fillText(`${band.start}-${band.end}`, 0, size * 1.35);
  canvasContext.restore();
}

function drawOctopusOcclusionFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const tempo = fireworkSpeedMultiplier();
  const moodControl = handGraspAmount();

  analyser.getByteFrequencyData(buffer);
  octopusFrame += tempo;
  setupOcclusionOctopi(width, height);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.34);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.42);
  drawOctopusBackground(canvasContext, width, height, bassEnergy, trebleEnergy);

  const count = Math.max(1, occlusionOctopi.length);
  occlusionOctopi.forEach((octopus) => {
    const band = octopusBand(octopus.index, count, buffer.length);
    const intensity = pressureResponse(averageBand(buffer, band.start, band.end), 1.55);
    octopus.energy = octopus.energy * 0.84 + intensity * 0.16;

    const swirl = Math.sin(octopusFrame * 0.018 + octopus.phase) * (0.04 + moodControl * 0.13 + octopus.energy * 0.08);
    octopus.vx += Math.cos(octopus.phase + octopusFrame * 0.012) * (0.02 + octopus.energy * 0.18) + swirl;
    octopus.vy += Math.sin(octopus.phase + octopusFrame * 0.015) * (0.018 + octopus.energy * 0.14) - trebleEnergy * 0.02;
    octopus.vx *= 0.9;
    octopus.vy *= 0.9;
    octopus.x += octopus.vx * tempo;
    octopus.y += octopus.vy * tempo;

    if (octopus.x < -60) octopus.x = width + 60;
    if (octopus.x > width + 60) octopus.x = -60;
    if (octopus.y < -60) octopus.y = height + 60;
    if (octopus.y > height + 60) octopus.y = -60;
  });

  [...occlusionOctopi]
    .sort((a, b) => a.y - b.y)
    .forEach((octopus) => {
      const band = octopusBand(octopus.index, count, buffer.length);
      drawOcclusionOctopus(canvasContext, octopus, count, octopus.energy, band);
    });
}

const lingerieBands = [
  { start: 1, end: 7 },
  { start: 8, end: 16 },
  { start: 17, end: 30 },
  { start: 31, end: 50 },
  { start: 51, end: 78 },
  { start: 79, end: 112 },
];

const lingerieScenes = {
  chinoiserie: { top: "#142b32", bottom: "#391928", panel: "#8e1f2c", trim: "#d4a84f", motif: 166 },
  lacquer: { top: "#08090d", bottom: "#250b12", panel: "#170b0f", trim: "#d8ad57", motif: 8 },
  bamboo: { top: "#173128", bottom: "#49361d", panel: "#31573d", trim: "#c5a34f", motif: 104 },
  shellac: { top: "#31110b", bottom: "#6d2f12", panel: "#8b421c", trim: "#f0a84a", motif: 28 },
  leather: { top: "#140c0c", bottom: "#38221c", panel: "#4a251d", trim: "#bf7952", motif: 350 },
};

function setupLingerieGarments(width, height) {
  const targetCount = Math.max(8, Math.round(handCountValueNumber() * 1.8));
  if (lingerieGarments.length === targetCount) return;

  const types = ["stockings", "briefs", "slip", "corset", "stockings", "garter"];
  lingerieGarments = Array.from({ length: targetCount }, (_, index) => {
    const columns = Math.ceil(Math.sqrt(targetCount * 1.7));
    const column = index % columns;
    const row = Math.floor(index / columns);
    const rows = Math.ceil(targetCount / columns);
    const anchorX = width * (0.1 + (column / Math.max(1, columns - 1)) * 0.8);
    const anchorY = height * (0.2 + (row / Math.max(1, rows - 1)) * 0.52);
    return {
      index,
      bandIndex: index % lingerieBands.length,
      type: types[index % types.length],
      anchorX,
      anchorY,
      x: anchorX,
      y: anchorY,
      vx: 0,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
      scale: 0.78 + Math.random() * 0.5,
      blown: false,
      alpha: 1,
    };
  });
}

function drawLingerieSalon(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const scene = lingerieScenes[fireworkFormSelect.value] || lingerieScenes.chinoiserie;
  const room = canvasContext.createLinearGradient(0, 0, 0, height);
  room.addColorStop(0, scene.top);
  room.addColorStop(1, scene.bottom);
  canvasContext.fillStyle = room;
  canvasContext.fillRect(0, 0, width, height);

  const canopy = canvasContext.createLinearGradient(0, 0, 0, height * 0.2);
  canopy.addColorStop(0, "rgba(7, 2, 8, 0.94)");
  canopy.addColorStop(0.7, "rgba(82, 7, 36, 0.72)");
  canopy.addColorStop(1, "rgba(20, 3, 14, 0)");
  canvasContext.fillStyle = canopy;
  canvasContext.fillRect(0, 0, width, height * 0.22);

  const panelCount = 5;
  const margin = width * 0.035;
  const panelWidth = (width - margin * 2) / panelCount;
  for (let panel = 0; panel < panelCount; panel += 1) {
    const x = margin + panel * panelWidth;
    const sheen = canvasContext.createLinearGradient(x, 0, x + panelWidth, 0);
    sheen.addColorStop(0, "rgba(0, 0, 0, 0.28)");
    sheen.addColorStop(0.45, scene.panel);
    sheen.addColorStop(0.75, `hsla(${scene.motif}, 54%, 48%, ${0.1 + trebleEnergy * 0.12})`);
    sheen.addColorStop(1, "rgba(0, 0, 0, 0.34)");
    canvasContext.fillStyle = sheen;
    canvasContext.fillRect(x + 3, height * 0.06, panelWidth - 6, height * 0.82);
    canvasContext.strokeStyle = scene.trim;
    canvasContext.lineWidth = Math.max(1, width * 0.002);
    canvasContext.strokeRect(x + 3, height * 0.06, panelWidth - 6, height * 0.82);

    canvasContext.strokeStyle = `hsla(${scene.motif + panel * 7}, 58%, 68%, ${0.16 + trebleEnergy * 0.18})`;
    canvasContext.lineWidth = Math.max(1, width * 0.0015);
    canvasContext.beginPath();
    canvasContext.moveTo(x + panelWidth * 0.2, height * 0.73);
    canvasContext.bezierCurveTo(
      x + panelWidth * (0.1 + bassEnergy * 0.2), height * 0.52,
      x + panelWidth * 0.9, height * 0.4,
      x + panelWidth * (0.45 + trebleEnergy * 0.3), height * 0.15,
    );
    canvasContext.stroke();

    canvasContext.fillStyle = `hsla(${scene.motif + 18}, 44%, 12%, ${0.08 + bassEnergy * 0.1})`;
    canvasContext.beginPath();
    canvasContext.ellipse(x + panelWidth * 0.5, height * 0.43, panelWidth * 0.16, height * 0.2, 0, 0, Math.PI * 2);
    canvasContext.ellipse(x + panelWidth * 0.5, height * 0.65, panelWidth * 0.25, height * 0.17, 0, 0, Math.PI * 2);
    canvasContext.fill();
  }

  canvasContext.strokeStyle = scene.trim;
  canvasContext.lineWidth = Math.max(2, height * 0.008);
  canvasContext.beginPath();
  canvasContext.moveTo(width * 0.04, height * 0.13);
  canvasContext.quadraticCurveTo(width * 0.5, height * (0.105 + bassEnergy * 0.015), width * 0.96, height * 0.13);
  canvasContext.stroke();

  canvasContext.fillStyle = "rgba(14, 2, 10, 0.72)";
  for (let fold = 0; fold < 9; fold += 1) {
    const x = width * (fold / 8);
    canvasContext.beginPath();
    canvasContext.moveTo(x - width * 0.09, 0);
    canvasContext.quadraticCurveTo(x, height * (0.12 + (fold % 2) * 0.05), x + width * 0.09, 0);
    canvasContext.fill();
  }

  canvasContext.fillStyle = `rgba(245, 196, 112, ${0.025 + bassEnergy * 0.055})`;
  for (let mote = 0; mote < 38; mote += 1) {
    const x = (mote * 137 + lingerieFrame * (0.22 + trebleEnergy)) % width;
    const y = height * (0.08 + ((mote * 47) % 80) / 100);
    canvasContext.beginPath();
    canvasContext.arc(x, y, 1 + (mote % 3), 0, Math.PI * 2);
    canvasContext.fill();
  }
}

function drawLingerieGarment(canvasContext, garment, energy, bassEnergy, trebleEnergy) {
  const drape = handSizeMultiplier();
  const progress = garment.bandIndex / Math.max(1, lingerieBands.length - 1);
  const hue = standardThemeHue(progress, energy);
  const size = Math.min(visualizer.width, visualizer.height) * 0.112 * garment.scale * Math.sqrt(drape);
  const flutter = Math.sin(lingerieFrame * (0.035 + trebleEnergy * 0.045) + garment.phase);

  canvasContext.save();
  canvasContext.translate(garment.x, garment.y);
  canvasContext.rotate(flutter * (0.08 + energy * 0.22) + (garment.blown ? Math.atan2(garment.vy, garment.vx) * 0.22 : 0));
  canvasContext.globalAlpha = garment.alpha;
  canvasContext.lineJoin = "round";
  canvasContext.lineCap = "round";
  canvasContext.shadowColor = hsla(hue, 84, 62, 0.44);
  canvasContext.shadowBlur = size * (0.08 + energy * 0.15);
  const satin = canvasContext.createLinearGradient(-size, -size * 0.2, size, size * 0.24);
  satin.addColorStop(0, hsla(hue - 12, 72, 18 + energy * 16, 0.72));
  satin.addColorStop(0.42, hsla(hue, 82, 38 + energy * 28, 0.82));
  satin.addColorStop(0.58, hsla(hue + 26, 86, 72 + trebleEnergy * 12, 0.62));
  satin.addColorStop(1, hsla(hue + 4, 76, 24 + energy * 22, 0.76));
  canvasContext.fillStyle = satin;
  canvasContext.strokeStyle = hsla(hue + 22, 72, 72, 0.74);
  canvasContext.lineWidth = Math.max(1.2, size * 0.035);

  if (garment.type === "stockings") {
    [-1, 1].forEach((side) => {
      canvasContext.beginPath();
      canvasContext.moveTo(side * size * 0.12, -size * 0.72);
      canvasContext.bezierCurveTo(side * size * 0.42, -size * 0.2, side * size * 0.1, size * 0.42, side * size * (0.28 + flutter * 0.08), size * 0.72);
      canvasContext.lineTo(side * size * (0.05 + flutter * 0.06), size * 0.72);
      canvasContext.bezierCurveTo(side * size * 0.02, size * 0.2, side * size * 0.18, -size * 0.25, side * size * 0.02, -size * 0.72);
      canvasContext.closePath();
      canvasContext.fill();
      canvasContext.stroke();

      canvasContext.strokeStyle = hsla(hue + 30, 86, 80, 0.7);
      canvasContext.lineWidth = Math.max(1, size * 0.026);
      canvasContext.beginPath();
      canvasContext.moveTo(side * size * 0.02, -size * 0.61);
      canvasContext.lineTo(side * size * 0.25, -size * 0.6);
      canvasContext.moveTo(side * size * 0.09, -size * 0.5);
      canvasContext.bezierCurveTo(side * size * 0.2, -size * 0.05, side * size * 0.02, size * 0.34, side * size * 0.2, size * 0.67);
      canvasContext.stroke();
    });
  } else if (garment.type === "briefs") {
    canvasContext.beginPath();
    canvasContext.moveTo(-size * 0.62, -size * 0.28);
    canvasContext.quadraticCurveTo(0, -size * (0.42 + energy * 0.12), size * 0.62, -size * 0.28);
    canvasContext.lineTo(size * 0.22, size * 0.46);
    canvasContext.quadraticCurveTo(0, size * (0.26 + flutter * 0.08), -size * 0.22, size * 0.46);
    canvasContext.closePath();
    canvasContext.fill();
    canvasContext.stroke();

    canvasContext.strokeStyle = hsla(hue + 34, 88, 84, 0.82);
    canvasContext.lineWidth = Math.max(1, size * 0.025);
    for (let scallop = -5; scallop <= 5; scallop += 1) {
      canvasContext.beginPath();
      canvasContext.arc(scallop * size * 0.1, -size * 0.29, size * 0.06, 0, Math.PI);
      canvasContext.stroke();
    }
    canvasContext.fillStyle = hsla(hue + 44, 88, 78, 0.9);
    canvasContext.beginPath();
    canvasContext.moveTo(0, -size * 0.2);
    canvasContext.quadraticCurveTo(-size * 0.22, -size * 0.4, -size * 0.25, -size * 0.16);
    canvasContext.quadraticCurveTo(-size * 0.12, -size * 0.08, 0, -size * 0.2);
    canvasContext.quadraticCurveTo(size * 0.22, -size * 0.4, size * 0.25, -size * 0.16);
    canvasContext.quadraticCurveTo(size * 0.12, -size * 0.08, 0, -size * 0.2);
    canvasContext.fill();
  } else if (garment.type === "slip") {
    canvasContext.beginPath();
    canvasContext.moveTo(-size * 0.3, -size * 0.66);
    canvasContext.quadraticCurveTo(0, -size * 0.45, size * 0.3, -size * 0.66);
    canvasContext.lineTo(size * (0.58 + flutter * 0.08), size * 0.7);
    canvasContext.quadraticCurveTo(0, size * (0.54 - energy * 0.08), -size * (0.58 - flutter * 0.08), size * 0.7);
    canvasContext.closePath();
    canvasContext.fill();
    canvasContext.stroke();
    canvasContext.strokeStyle = hsla(hue + 32, 82, 82, 0.72);
    canvasContext.beginPath();
    canvasContext.moveTo(-size * 0.3, -size * 0.64);
    canvasContext.quadraticCurveTo(-size * 0.42, -size * 0.92, -size * 0.17, -size * 0.98);
    canvasContext.moveTo(size * 0.3, -size * 0.64);
    canvasContext.quadraticCurveTo(size * 0.42, -size * 0.92, size * 0.17, -size * 0.98);
    canvasContext.moveTo(-size * 0.29, -size * 0.62);
    canvasContext.quadraticCurveTo(0, -size * 0.22, size * 0.29, -size * 0.62);
    canvasContext.stroke();
  } else if (garment.type === "corset") {
    canvasContext.beginPath();
    canvasContext.moveTo(-size * 0.5, -size * 0.62);
    canvasContext.bezierCurveTo(-size * 0.28, 0, -size * 0.42, size * 0.48, -size * 0.3, size * 0.68);
    canvasContext.lineTo(size * 0.3, size * 0.68);
    canvasContext.bezierCurveTo(size * 0.42, size * 0.48, size * 0.28, 0, size * 0.5, -size * 0.62);
    canvasContext.quadraticCurveTo(0, -size * 0.38, -size * 0.5, -size * 0.62);
    canvasContext.fill();
    canvasContext.stroke();
    canvasContext.strokeStyle = hsla(hue + 48, 80, 78, 0.66);
    for (let lace = -2; lace <= 2; lace += 1) {
      canvasContext.beginPath();
      canvasContext.moveTo(-size * 0.14, lace * size * 0.2);
      canvasContext.lineTo(size * 0.14, (lace + 0.5) * size * 0.2);
      canvasContext.stroke();
    }
  } else {
    canvasContext.beginPath();
    canvasContext.ellipse(0, 0, size * 0.62, size * 0.24, flutter * 0.16, 0, Math.PI * 2);
    canvasContext.stroke();
    canvasContext.setLineDash([size * 0.08, size * 0.06]);
    canvasContext.beginPath();
    canvasContext.arc(0, size * 0.2, size * 0.48, 0.2, Math.PI - 0.2);
    canvasContext.stroke();
    canvasContext.setLineDash([]);
    [-1, 1].forEach((side) => {
      canvasContext.beginPath();
      canvasContext.moveTo(side * size * 0.32, size * 0.08);
      canvasContext.bezierCurveTo(side * size * 0.42, size * 0.42, side * size * 0.26, size * 0.62, side * size * 0.36, size * 0.82);
      canvasContext.stroke();
    });
  }

  canvasContext.setLineDash([]);
  canvasContext.globalAlpha = garment.alpha * (0.18 + trebleEnergy * 0.24);
  canvasContext.fillStyle = "rgba(255, 250, 236, 0.8)";
  canvasContext.beginPath();
  canvasContext.arc(-size * 0.16, -size * 0.24, size * (0.025 + energy * 0.035), 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.restore();
}

function drawLingerieScene(canvasContext, energies, active) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speed = fireworkSpeedMultiplier();
  const mischief = handGraspAmount();
  const bassEnergy = energies[0] || 0.12;
  const trebleEnergy = energies[energies.length - 1] || 0.14;
  const wind = (Math.sin(lingerieFrame * 0.018) * 0.7 + trebleEnergy * 1.8 + bassEnergy * 0.45) * speed;

  setupLingerieGarments(width, height);
  drawLingerieSalon(canvasContext, width, height, bassEnergy, trebleEnergy);

  lingerieGarments.forEach((garment) => {
    const energy = energies[garment.bandIndex] || 0.12;

    if (!garment.blown) {
      canvasContext.strokeStyle = `rgba(230, 190, 116, ${0.18 + energy * 0.28})`;
      canvasContext.lineWidth = Math.max(1, width * 0.0012);
      canvasContext.beginPath();
      canvasContext.moveTo(garment.anchorX, height * 0.13);
      canvasContext.quadraticCurveTo(
        garment.anchorX + Math.sin(lingerieFrame * 0.02 + garment.phase) * width * 0.012,
        garment.anchorY * 0.58,
        garment.x,
        garment.y - Math.min(width, height) * 0.055,
      );
      canvasContext.stroke();
    }
    if (active && garment.type === "briefs" && !garment.blown && energy > 0.38 && Math.random() < energy * mischief * 0.018 * speed) {
      garment.blown = true;
      garment.vx = (2.2 + energy * 6 + mischief * 5) * (Math.sin(garment.phase) < 0 ? -1 : 1);
      garment.vy = -1.2 - trebleEnergy * 4;
    }

    if (garment.blown) {
      garment.vx += wind * 0.018;
      garment.vy += Math.sin(lingerieFrame * 0.06 + garment.phase) * 0.08;
      garment.x += garment.vx * speed;
      garment.y += garment.vy * speed;
      garment.alpha -= 0.004 * speed;
      if (garment.alpha <= 0 || garment.x < -width * 0.2 || garment.x > width * 1.2 || garment.y < -height * 0.25) {
        garment.x = garment.anchorX;
        garment.y = garment.anchorY;
        garment.vx = 0;
        garment.vy = 0;
        garment.alpha = 1;
        garment.blown = false;
        garment.phase = Math.random() * Math.PI * 2;
      }
    } else {
      garment.x = garment.anchorX + Math.sin(lingerieFrame * 0.022 * speed + garment.phase) * width * (0.006 + energy * 0.018);
      garment.y = garment.anchorY + Math.cos(lingerieFrame * 0.017 * speed + garment.phase) * height * (0.004 + bassEnergy * 0.012);
    }
    drawLingerieGarment(canvasContext, garment, energy, bassEnergy, trebleEnergy);
  });
}

function drawLingerieFrame(canvasContext, buffer) {
  analyser.getByteFrequencyData(buffer);
  lingerieFrame += fireworkSpeedMultiplier();
  const energies = lingerieBands.map((band) => pressureResponse(averageBand(buffer, band.start, band.end), 1.42));
  drawLingerieScene(canvasContext, energies, true);
}

function snakeCongaMix() {
  return handGraspAmount();
}

function snakeCongaPalette(index, intensity) {
  const theme = visualizerTheme();
  return theme.color(index, 9, clampNumber(intensity, 0, 1));
}

function makeSnakeConga(width, height, options = {}) {
  const angle = options.angle ?? ((Math.random() - 0.5) * 0.8);
  const x = options.x ?? width * (0.64 + Math.random() * 0.1);
  const y = options.y ?? height * (0.3 + Math.random() * 0.4);
  const length = options.length ?? (20 + handCountValueNumber() * 3);
  const spacing = Math.max(5, Math.min(width, height) * 0.024 * handSizeMultiplier());
  const nodes = options.nodes || Array.from({ length }, (_, index) => ({
    x: x - Math.cos(angle) * spacing * index,
    y: y - Math.sin(angle) * spacing * index,
  }));

  return {
    nodes,
    angle,
    phase: Math.random() * Math.PI * 2,
    turnBias: (Math.random() - 0.5) * 0.012,
    hueOffset: Math.floor(Math.random() * 8),
    targetBonus: options.targetBonus || 0,
    splitCooldown: 220 + Math.random() * 260,
    age: 0,
    energy: 0.18,
  };
}

function setupSnakeCongas(width, height) {
  if (!snakeCongas.length) {
    snakeCongas.push(makeSnakeConga(width, height));
  }
}

function shedSnakeCongaNode(node, conga, intensity) {
  snakeCongaCastoffs.push({
    x: node.x,
    y: node.y,
    vx: Math.cos(conga.angle + Math.PI + (Math.random() - 0.5) * 1.8) * (0.35 + intensity * 1.6),
    vy: Math.sin(conga.angle + Math.PI + (Math.random() - 0.5) * 1.8) * (0.35 + intensity * 1.6),
    radius: 2.5 + Math.random() * 5 * handSizeMultiplier(),
    life: 1,
    hueOffset: conga.hueOffset + Math.floor(Math.random() * 3),
  });
  if (snakeCongaCastoffs.length > 90) snakeCongaCastoffs.shift();
}

function splitSnakeConga(conga, width, height, intensity) {
  const minimum = 12;
  if (conga.nodes.length < minimum * 2) return null;
  const splitAt = Math.floor(conga.nodes.length * (0.48 + Math.random() * 0.18));
  const childNodes = conga.nodes.splice(splitAt);
  const childHead = childNodes[0];
  const child = makeSnakeConga(width, height, {
    x: childHead.x,
    y: childHead.y,
    nodes: childNodes,
    angle: conga.angle + (Math.random() < 0.5 ? -1 : 1) * (0.45 + intensity * 0.55),
    targetBonus: -4,
  });
  child.hueOffset = conga.hueOffset + 2;
  conga.splitCooldown = 300;
  return child;
}

function updateSnakeCongas(width, height, bassEnergy, midsEnergy, trebleEnergy, active) {
  const speedControl = fireworkSpeedMultiplier();
  const mix = snakeCongaMix();
  const scale = handSizeMultiplier();
  const baseTarget = 20 + handCountValueNumber() * 3;
  const maxCongas = 2 + Math.floor(handCountValueNumber() / 4);
  const children = [];

  snakeCongaFrame += speedControl * (active ? 1 : 0.72);
  setupSnakeCongas(width, height);

  snakeCongas.forEach((conga, congaIndex) => {
    conga.age += speedControl;
    conga.splitCooldown -= speedControl;
    conga.energy += ((bassEnergy + midsEnergy + trebleEnergy) / 3 - conga.energy) * 0.08;
    conga.targetBonus *= 0.998;
    if (bassEnergy > 0.48 && Math.random() < bassEnergy * 0.045) {
      conga.targetBonus = Math.min(16, conga.targetBonus + 1.5);
    }

    const head = conga.nodes[0];
    const margin = 34 * scale;
    let edgeTurn = 0;
    const lookX = head.x + Math.cos(conga.angle) * margin * 2.4;
    const lookY = head.y + Math.sin(conga.angle) * margin * 2.4;
    if (lookX < margin || lookX > width - margin || lookY < margin || lookY > height - margin) {
      const homeAngle = Math.atan2(height * 0.5 - head.y, width * 0.5 - head.x);
      edgeTurn = Math.atan2(Math.sin(homeAngle - conga.angle), Math.cos(homeAngle - conga.angle)) * 0.045;
    }

    const musicalTurn = Math.sin(snakeCongaFrame * (0.012 + midsEnergy * 0.014) + conga.phase)
      * (0.018 + midsEnergy * 0.036 + mix * 0.008);
    const trebleFlick = Math.sin(snakeCongaFrame * 0.047 + conga.phase * 1.7)
      * trebleEnergy * 0.026;
    conga.angle += (musicalTurn + trebleFlick + conga.turnBias + edgeTurn) * speedControl;

    const travel = (1.15 + bassEnergy * 1.8 + midsEnergy * 0.7) * speedControl * scale;
    const nextHead = {
      x: clampNumber(head.x + Math.cos(conga.angle) * travel, 3, width - 3),
      y: clampNumber(head.y + Math.sin(conga.angle) * travel, 3, height - 3),
    };
    const nodeSpacing = Math.max(5, Math.min(width, height) * (0.016 + mix * 0.01) * scale);
    if (Math.hypot(nextHead.x - head.x, nextHead.y - head.y) >= nodeSpacing * 0.48) {
      conga.nodes.unshift(nextHead);
    } else {
      conga.nodes[0] = nextHead;
    }

    const targetLength = Math.round(baseTarget + conga.targetBonus + bassEnergy * 7 - congaIndex * 3);
    while (conga.nodes.length > Math.max(10, targetLength)) {
      const tail = conga.nodes.pop();
      if (Math.random() < 0.3 + trebleEnergy * 0.5) shedSnakeCongaNode(tail, conga, trebleEnergy);
    }

    if (conga.nodes.length > 12 && trebleEnergy > 0.5 && Math.random() < trebleEnergy * 0.018 * speedControl) {
      shedSnakeCongaNode(conga.nodes.pop(), conga, trebleEnergy);
    }

    const splitEnergy = bassEnergy * 0.46 + midsEnergy * 0.36 + trebleEnergy * 0.42;
    if (snakeCongas.length + children.length < maxCongas
        && conga.splitCooldown <= 0
        && splitEnergy > 0.62
        && Math.random() < splitEnergy * 0.012 * speedControl) {
      const child = splitSnakeConga(conga, width, height, splitEnergy);
      if (child) children.push(child);
    }
  });

  snakeCongas.push(...children);
  snakeCongas = snakeCongas.filter((conga) => conga.nodes.length >= 9);

  snakeCongaCastoffs.forEach((castoff) => {
    castoff.x += castoff.vx * speedControl;
    castoff.y += castoff.vy * speedControl;
    castoff.vx *= 0.985;
    castoff.vy = castoff.vy * 0.985 + 0.012 * speedControl;
    castoff.life -= 0.012 * speedControl;
  });
  snakeCongaCastoffs = snakeCongaCastoffs.filter((castoff) => castoff.life > 0);
}

function drawSnakeCongaBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const theme = visualizerTheme();
  const field = canvasContext.createRadialGradient(width * 0.48, height * 0.46, 0, width * 0.5, height * 0.5, width * 0.72);
  field.addColorStop(0, "rgba(22, 21, 38, 0.98)");
  field.addColorStop(0.58, "rgba(8, 13, 22, 0.99)");
  field.addColorStop(1, "rgba(2, 4, 8, 1)");
  canvasContext.fillStyle = field;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.save();
  canvasContext.globalAlpha = 0.08 + trebleEnergy * 0.12;
  for (let index = 0; index < 32; index += 1) {
    const phase = index * 2.399 + snakeCongaFrame * 0.0015;
    const x = width * (0.5 + Math.sin(phase * 1.7) * 0.48);
    const y = height * (0.5 + Math.cos(phase * 1.3) * 0.46);
    canvasContext.fillStyle = theme.color(index, 32, 0.28 + bassEnergy * 0.3);
    canvasContext.beginPath();
    canvasContext.arc(x, y, 1.2 + (index % 4) * 0.7 + trebleEnergy * 2, 0, Math.PI * 2);
    canvasContext.fill();
  }
  canvasContext.restore();
}

function drawCongaDancer(canvasContext, node, next, radius, hueIndex, intensity, mix, isLeader) {
  const angle = Math.atan2(next.y - node.y, next.x - node.x);
  const shimmyPhase = snakeCongaFrame * (0.13 + intensity * 0.08) + hueIndex * 1.27;
  const lift = Math.sin(shimmyPhase * 0.5) * radius * (0.06 + intensity * 0.14);
  const hipSwing = Math.sin(shimmyPhase) * radius * (0.16 + intensity * 0.2);
  const shoulderTwist = Math.sin(shimmyPhase + Math.PI * 0.5) * (0.1 + intensity * 0.16);
  const step = Math.sin(shimmyPhase + Math.PI * 0.25) * radius * (0.12 + intensity * 0.18);
  const colour = snakeCongaPalette(hueIndex, 0.38 + intensity * 0.55);
  canvasContext.save();
  canvasContext.translate(node.x, node.y);
  canvasContext.rotate(angle);
  canvasContext.translate(0, lift + hipSwing);
  canvasContext.rotate(shoulderTwist);
  canvasContext.globalAlpha = mix * (0.62 + intensity * 0.38);

  canvasContext.strokeStyle = colour;
  canvasContext.fillStyle = colour;
  canvasContext.lineCap = "round";
  canvasContext.lineWidth = Math.max(1.5, radius * 0.19);
  canvasContext.beginPath();
  canvasContext.moveTo(-radius * 0.08, radius * 0.2);
  canvasContext.lineTo(-radius * 0.18 - step, radius * 0.94);
  canvasContext.moveTo(radius * 0.08, radius * 0.2);
  canvasContext.lineTo(radius * 0.35 + step, radius * 0.9);
  canvasContext.stroke();

  canvasContext.beginPath();
  canvasContext.roundRect(-radius * 0.42, -radius * 0.34, radius * 0.84, radius * 0.92, radius * 0.28);
  canvasContext.fill();
  canvasContext.fillStyle = "rgba(255, 244, 220, 0.92)";
  canvasContext.beginPath();
  canvasContext.arc(0, -radius * 0.72, radius * (isLeader ? 0.42 : 0.34), 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = colour;
  canvasContext.beginPath();
  canvasContext.moveTo(radius * 0.2, -radius * 0.14);
  canvasContext.quadraticCurveTo(radius * (0.78 + shoulderTwist), -radius * 0.2, radius * 0.92, -radius * (0.52 + intensity * 0.08));
  canvasContext.moveTo(-radius * 0.2, -radius * 0.12);
  canvasContext.quadraticCurveTo(-radius * (0.64 + shoulderTwist), radius * 0.05, -radius * 0.78, radius * (0.34 + intensity * 0.08));
  canvasContext.stroke();

  if (isLeader) {
    canvasContext.fillStyle = "rgba(15, 12, 25, 0.9)";
    [-1, 1].forEach((side) => {
      canvasContext.beginPath();
      canvasContext.arc(radius * 0.14, -radius * 0.77 + side * radius * 0.11, radius * 0.055, 0, Math.PI * 2);
      canvasContext.fill();
    });
  }
  canvasContext.restore();
}

function snakeCongaSlitherPoints(conga, radius, midsEnergy, trebleEnergy, mix) {
  const points = conga.nodes;
  const lastIndex = Math.max(1, points.length - 1);
  const waveSpeed = 0.075 + midsEnergy * 0.075 + trebleEnergy * 0.025;
  const waveLength = 0.42 + mix * 0.12;
  const amplitude = radius * (0.34 + midsEnergy * 0.42 + trebleEnergy * 0.18) * (1 - mix * 0.28);

  return points.map((point, index) => {
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(lastIndex, index + 1)];
    const tangentX = after.x - before.x;
    const tangentY = after.y - before.y;
    const tangentLength = Math.max(0.001, Math.hypot(tangentX, tangentY));
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;
    const progress = index / lastIndex;
    const envelope = 0.62 + Math.sin(progress * Math.PI) * 0.38;
    const phase = snakeCongaFrame * waveSpeed - index * waveLength + conga.phase;
    const wave = Math.sin(phase) + Math.sin(phase * 1.83 + conga.phase) * 0.24;

    return {
      x: point.x + normalX * wave * amplitude * envelope,
      y: point.y + normalY * wave * amplitude * envelope,
    };
  });
}

function drawSnakeConga(canvasContext, conga, congaIndex, bassEnergy, midsEnergy, trebleEnergy) {
  const mix = snakeCongaMix();
  const scale = handSizeMultiplier();
  const radius = Math.min(visualizer.width, visualizer.height) * 0.044 * scale * (0.88 + bassEnergy * 0.35);
  if (conga.nodes.length < 2) return;
  const points = snakeCongaSlitherPoints(conga, radius, midsEnergy, trebleEnergy, mix);

  canvasContext.save();
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";
  canvasContext.shadowBlur = radius * (0.8 + trebleEnergy * 1.7);
  canvasContext.shadowColor = snakeCongaPalette(conga.hueOffset, 0.7);
  canvasContext.strokeStyle = snakeCongaPalette(conga.hueOffset, 0.34 + conga.energy * 0.5);
  canvasContext.globalAlpha = 0.24 + (1 - mix) * 0.68;
  canvasContext.lineWidth = radius * (1.72 - mix * 0.55);
  canvasContext.beginPath();
  canvasContext.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const previous = points[index - 1];
    canvasContext.quadraticCurveTo(previous.x, previous.y, (previous.x + point.x) * 0.5, (previous.y + point.y) * 0.5);
  }
  canvasContext.stroke();
  canvasContext.restore();

  const stride = Math.max(2, Math.round(2 + mix * 2));
  for (let index = points.length - 2; index >= 0; index -= stride) {
    const point = points[index];
    const next = points[Math.min(points.length - 1, index + stride)];
    const progress = 1 - index / points.length;
    const localRadius = radius * (0.54 + progress * 0.48);
    if (mix < 0.78) {
      canvasContext.save();
      canvasContext.globalAlpha = (1 - mix) * (0.24 + trebleEnergy * 0.32);
      canvasContext.fillStyle = snakeCongaPalette(conga.hueOffset + index, 0.42 + trebleEnergy * 0.5);
      canvasContext.beginPath();
      canvasContext.arc(point.x, point.y, localRadius * 0.3, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.restore();
    }
    if (mix > 0.08) {
      drawCongaDancer(canvasContext, point, next, localRadius, conga.hueOffset + index, conga.energy, mix, index === 0);
    }
  }

  const head = points[0];
  const neck = points[Math.min(points.length - 1, 3)];
  const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);
  canvasContext.save();
  canvasContext.translate(head.x, head.y);
  canvasContext.rotate(headAngle);
  canvasContext.globalAlpha = 0.28 + (1 - mix) * 0.72;
  canvasContext.fillStyle = snakeCongaPalette(conga.hueOffset, 0.62 + bassEnergy * 0.34);
  canvasContext.beginPath();
  canvasContext.ellipse(radius * 0.35, 0, radius * 0.9, radius * 0.66, 0, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.fillStyle = "rgba(250, 246, 212, 0.94)";
  [-1, 1].forEach((side) => {
    canvasContext.beginPath();
    canvasContext.arc(radius * 0.7, side * radius * 0.27, radius * 0.11, 0, Math.PI * 2);
    canvasContext.fill();
  });
  if (trebleEnergy > 0.3) {
    canvasContext.strokeStyle = "rgba(255, 90, 120, 0.9)";
    canvasContext.lineWidth = Math.max(1, radius * 0.08);
    canvasContext.beginPath();
    canvasContext.moveTo(radius * 1.18, 0);
    canvasContext.lineTo(radius * (1.5 + trebleEnergy * 0.45), 0);
    canvasContext.moveTo(radius * (1.5 + trebleEnergy * 0.45), 0);
    canvasContext.lineTo(radius * 1.68, -radius * 0.14);
    canvasContext.moveTo(radius * (1.5 + trebleEnergy * 0.45), 0);
    canvasContext.lineTo(radius * 1.68, radius * 0.14);
    canvasContext.stroke();
  }
  canvasContext.restore();
}

function drawSnakeCongaScene(canvasContext, bassEnergy, midsEnergy, trebleEnergy, active) {
  const width = visualizer.width;
  const height = visualizer.height;
  updateSnakeCongas(width, height, bassEnergy, midsEnergy, trebleEnergy, active);
  drawSnakeCongaBackground(canvasContext, width, height, bassEnergy, trebleEnergy);
  snakeCongas.slice().reverse().forEach((conga, index) => {
    drawSnakeConga(canvasContext, conga, index, bassEnergy, midsEnergy, trebleEnergy);
  });
  snakeCongaCastoffs.forEach((castoff) => {
    canvasContext.save();
    canvasContext.globalAlpha = castoff.life * 0.72;
    canvasContext.fillStyle = snakeCongaPalette(castoff.hueOffset, 0.64);
    canvasContext.beginPath();
    canvasContext.arc(castoff.x, castoff.y, castoff.radius * castoff.life, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();
  });
}

function drawSnakeCongaFrame(canvasContext, buffer) {
  analyser.getByteFrequencyData(buffer);
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 10), 1.35);
  const midsEnergy = pressureResponse(averageBand(buffer, 11, 52), 1.32);
  const trebleEnergy = pressureResponse(averageBand(buffer, 53, 112), 1.38);
  drawSnakeCongaScene(canvasContext, bassEnergy, midsEnergy, trebleEnergy, true);
}

function drawIdleSnakeConga() {
  const pulse = 0.5 + Math.sin(snakeCongaFrame * 0.021) * 0.5;
  const shimmer = 0.5 + Math.sin(snakeCongaFrame * 0.033 + 1.4) * 0.5;
  drawSnakeCongaScene(visualizer.getContext("2d"), 0.14 + pulse * 0.1, 0.13 + shimmer * 0.1, 0.12 + (1 - pulse) * 0.12, false);
  if (visualizerSelect.value === "snakeconga" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) drawIdleVisualizer();
    });
  }
}

function drawIdleLingerie() {
  lingerieFrame += 0.7;
  drawLingerieScene(visualizer.getContext("2d"), [0.14, 0.18, 0.12, 0.2, 0.16, 0.22], false);
}

function setupHandForms(width, height) {
  const targetCount = handCountValueNumber();

  if (handForms.length === targetCount) {
    return;
  }

  handForms = Array.from({ length: targetCount }, (_, index) => {
    const band = handBands[index % handBands.length];
    const progress = targetCount === 1 ? 0.5 : index / (targetCount - 1);
    const side = index % 2 === 0 ? 1 : -1;
    return {
      band,
      rootX: width * (0.06 + progress * 0.88),
      rootY: height * (side > 0 ? 0.91 : 0.09),
      baseAngle: side > 0 ? -Math.PI / 2 : Math.PI / 2,
      side,
      phase: Math.random() * Math.PI * 2,
      growth: 0,
      fingers: Array.from({ length: 5 }, (_, finger) => ({
        spread: (finger - 2) * 0.21,
        length: 0.48 + finger * 0.08 + Math.random() * 0.16,
        knuckle: 0.28 + Math.random() * 0.24,
      })),
      index,
      count: targetCount,
    };
  });
}

function handHue(index, intensity) {
  const progress = index / Math.max(1, handCountValueNumber() - 1);
  return standardThemeHue(progress, intensity);
}

function branchFieldColours() {
  const fields = {
    mono: ["rgba(7, 46, 36, 0.2)", "rgba(14, 82, 62, 0.12)", "rgba(38, 20, 54, 0.12)"],
    ice: ["rgba(4, 35, 72, 0.28)", "rgba(20, 112, 150, 0.2)", "rgba(92, 80, 180, 0.18)"],
    ember: ["rgba(88, 7, 3, 0.3)", "rgba(156, 42, 4, 0.18)", "rgba(74, 10, 28, 0.2)"],
    spectrum: ["rgba(82, 8, 112, 0.22)", "rgba(7, 100, 104, 0.16)", "rgba(132, 70, 3, 0.2)"],
    pressure: ["rgba(106, 2, 48, 0.27)", "rgba(72, 10, 128, 0.2)", "rgba(5, 104, 112, 0.19)"],
  };
  return fields[themeSelect.value] || fields.mono;
}

function drawLittleBuoyMan(canvasContext, x, y, size, hue, alpha, wobble) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(Math.sin(wobble) * 0.35);
  canvasContext.strokeStyle = hsla(hue, 78, 68, alpha);
  canvasContext.fillStyle = hsla(hue, 82, 58, alpha * 0.9);
  canvasContext.lineWidth = Math.max(1, size * 0.12);
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.55, size * 0.22, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 0.3);
  canvasContext.lineTo(0, size * 0.28);
  canvasContext.moveTo(0, -size * 0.1);
  canvasContext.lineTo(-size * 0.34, size * 0.08);
  canvasContext.moveTo(0, -size * 0.1);
  canvasContext.lineTo(size * 0.34, size * 0.08);
  canvasContext.moveTo(0, size * 0.28);
  canvasContext.lineTo(-size * 0.25, size * 0.7);
  canvasContext.moveTo(0, size * 0.28);
  canvasContext.lineTo(size * 0.25, size * 0.7);
  canvasContext.stroke();
  canvasContext.restore();
}

function drawFinger(canvasContext, hand, finger, intensity, width, height) {
  const speedMultiplier = fireworkSpeedMultiplier();
  const sizeMultiplier = handSizeMultiplier();
  const grasp = handGraspAmount();
  const hue = handHue(hand.index, intensity);
  const direction = hand.side;
  const pulse = Math.sin(handFrame * 0.035 * speedMultiplier + hand.phase + finger.spread * 4);
  const reach = hand.growth * finger.length * (0.62 + intensity * 0.72 + grasp * 0.28);
  const baseLength = height * 0.34 * sizeMultiplier;
  const length = baseLength * reach;
  const angle = hand.baseAngle + finger.spread + pulse * (0.18 + intensity * 0.32);
  const curl = Math.sin(handFrame * 0.05 + hand.phase + finger.knuckle * 8) * (0.18 + intensity * 0.4) + grasp * direction * (0.45 + intensity * 0.9);
  const rootX = hand.rootX + Math.sin(hand.phase + finger.spread) * width * 0.015;
  const rootY = hand.rootY;
  const midX = rootX + Math.cos(angle) * length * finger.knuckle;
  const midY = rootY + Math.sin(angle) * length * finger.knuckle;
  const tipAngle = angle + curl * direction;
  const tipX = midX + Math.cos(tipAngle) * length * (1 - finger.knuckle);
  const tipY = midY + Math.sin(tipAngle) * length * (1 - finger.knuckle);
  const branchAlpha = 0.22 + intensity * 0.58 + grasp * 0.16;

  canvasContext.strokeStyle = hsla(hue, 76, 38 + intensity * 30, branchAlpha);
  canvasContext.lineWidth = Math.max(1.5, (5.5 - Math.abs(finger.spread) * 9) * (0.6 + intensity * 0.65 + grasp * 0.28) * Math.sqrt(sizeMultiplier));
  canvasContext.lineCap = "round";
  canvasContext.beginPath();
  canvasContext.moveTo(rootX, rootY);
  canvasContext.quadraticCurveTo(midX, midY, tipX, tipY);
  canvasContext.stroke();

  canvasContext.strokeStyle = hsla(hue + 30, 86, 70, 0.18 + intensity * 0.28);
  canvasContext.lineWidth = 1;
  for (let branch = 0; branch < 3; branch += 1) {
    const t = 0.35 + branch * 0.18;
    const bx = rootX + (tipX - rootX) * t;
    const by = rootY + (tipY - rootY) * t;
    const twigAngle = tipAngle + (branch % 2 ? 1 : -1) * (0.65 + intensity * 0.45 + grasp * 0.75);
    const twigLength = length * (0.08 + branch * 0.025) * (0.5 + intensity + grasp * 0.5);
    canvasContext.beginPath();
    canvasContext.moveTo(bx, by);
    canvasContext.lineTo(bx + Math.cos(twigAngle) * twigLength, by + Math.sin(twigAngle) * twigLength);
    canvasContext.stroke();
  }

  const glow = canvasContext.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18 + intensity * 34);
  glow.addColorStop(0, hsla(hue, 92, 66, 0.26 + intensity * 0.28));
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(tipX, tipY, 18 + intensity * 34, 0, Math.PI * 2);
  canvasContext.fill();

  if (grasp > 0.08) {
    const bits = Math.round(1 + grasp * 5 + intensity * 4);
    canvasContext.fillStyle = hsla(hue + 48, 92, 68, 0.18 + grasp * 0.42);
    for (let bit = 0; bit < bits; bit += 1) {
      const amount = Math.random();
      const bitX = tipX + (rootX - tipX) * amount * grasp + Math.sin(handFrame * 0.12 + bit) * 9 * grasp;
      const bitY = tipY + (rootY - tipY) * amount * grasp + Math.cos(handFrame * 0.1 + bit) * 9 * grasp;
      canvasContext.beginPath();
      canvasContext.arc(bitX, bitY, 1.2 + grasp * 2.4, 0, Math.PI * 2);
      canvasContext.fill();
    }
  }

  if (intensity > 0.13 || finger.spread === 0 || grasp > 0.55) {
    drawLittleBuoyMan(canvasContext, tipX, tipY, (7 + intensity * 14) * Math.sqrt(sizeMultiplier), hue + 16, 0.22 + intensity * 0.58 + grasp * 0.12, handFrame * 0.05 + finger.spread);
  }
}

function drawBranchHandsFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  handFrame += speedMultiplier;
  setupHandForms(width, height);

  canvasContext.fillStyle = "rgba(3, 5, 9, 0.19)";
  canvasContext.fillRect(0, 0, width, height);

  const fieldColours = branchFieldColours();
  const field = canvasContext.createLinearGradient(0, 0, width, height);
  field.addColorStop(0, fieldColours[0]);
  field.addColorStop(0.52, fieldColours[1]);
  field.addColorStop(1, fieldColours[2]);
  canvasContext.fillStyle = field;
  canvasContext.fillRect(0, 0, width, height);

  handForms.forEach((hand) => {
    const intensity = averageBand(buffer, hand.band.start, hand.band.end);
    const grasp = handGraspAmount();
    hand.growth += (intensity * (1 + grasp * 0.42) - hand.growth) * (0.025 + speedMultiplier * 0.025 + grasp * 0.025);
    const hue = handHue(hand.index, intensity);

    canvasContext.fillStyle = hsla(hue, 78, 34 + intensity * 28, 0.18 + intensity * 0.24);
    canvasContext.beginPath();
    canvasContext.ellipse(
      hand.rootX,
      hand.rootY,
      (24 + intensity * 24) * Math.sqrt(handSizeMultiplier()),
      10 + intensity * 10 + grasp * 10,
      0,
      0,
      Math.PI * 2,
    );
    canvasContext.fill();

    hand.fingers.forEach((finger) => {
      drawFinger(canvasContext, hand, finger, intensity, width, height);
    });
  });
}

function swampHue(index, intensity) {
  const progress = index / Math.max(1, swampBands.length - 1);
  const theme = themeSelect.value;
  if (theme === "ice") {
    return 188 + progress * 66 + intensity * 26;
  }
  if (theme === "ember") {
    return 6 + progress * 42 + intensity * 18;
  }
  if (theme === "spectrum") {
    return 294 - progress * 236 + intensity * 32;
  }
  if (theme === "pressure") {
    return 338 - progress * 188 + intensity * 48;
  }
  return progress < 0.45
    ? 356 + progress * 54
    : 292 - progress * 18 + intensity * 12;
}

function spawnSwampBubble(bandIndex, intensity, width, height, bassBoom = 0) {
  const band = swampBands[bandIndex];
  const speedMultiplier = fireworkSpeedMultiplier();
  const scale = handSizeMultiplier();
  const pressure = handGraspAmount();
  const isBass = bandIndex < 2;
  const radius = isBass
    ? height * (0.07 + intensity * 0.36 + bassBoom * (0.18 + pressure * 0.22)) * scale
    : (5 + intensity * 34 + Math.random() * 16) * Math.sqrt(scale);
  const horizon = height * (0.5 + Math.sin(swampFrame * 0.012 + bandIndex) * (0.03 + pressure * 0.04));
  const x = isBass
    ? width * (0.18 + Math.random() * 0.64)
    : width * Math.random();
  const y = isBass
    ? horizon + height * (0.08 + Math.random() * 0.22)
    : height * (0.75 + Math.random() * 0.22);

  swampBubbles.push({
    x,
    y,
    vx: (Math.random() - 0.5) * (0.25 + intensity * 1.3 + pressure * 1.2),
    vy: -(0.22 + intensity * 2.2 + pressure * 0.45 + (isBass ? bassBoom * (2.2 + pressure * 2) : 0)) * speedMultiplier,
    radius,
    targetRadius: radius * (0.75 + Math.random() * (0.62 + pressure * 0.7)),
    hue: swampHue(bandIndex, intensity),
    life: 1,
    decay: isBass ? 0.0018 + intensity * 0.0025 : 0.0045 + intensity * 0.012,
    wobble: Math.random() * Math.PI * 2,
    kind: band.kind,
    alarm: isBass ? pressure * 0.25 : Math.min(1, bassBoom + intensity * 0.8 + pressure * 0.45),
    bass: isBass,
  });
}

function drawSwampCreature(canvasContext, bubble, bassEnergy) {
  const pressure = handGraspAmount();
  const wobble = Math.sin(swampFrame * (0.035 + pressure * 0.03) + bubble.wobble) * bubble.radius * (0.12 + pressure * 0.1);
  const stretch = 1 + Math.sin(swampFrame * 0.023 + bubble.wobble) * (0.08 + pressure * 0.07) + bubble.alarm * 0.24;
  const alpha = Math.max(0, bubble.life);
  const hue = bubble.hue + Math.sin(swampFrame * 0.012 + bubble.wobble) * (10 + pressure * 20);

  canvasContext.save();
  canvasContext.translate(bubble.x + wobble, bubble.y);
  canvasContext.scale(1 / stretch, stretch);

  const gradient = canvasContext.createRadialGradient(
    -bubble.radius * 0.25,
    -bubble.radius * 0.35,
    bubble.radius * 0.04,
    0,
    0,
    bubble.radius,
  );
  gradient.addColorStop(0, hsla(hue + 26, 74, bubble.bass ? 35 : 72, alpha * 0.62));
  gradient.addColorStop(0.62, hsla(hue, 72, bubble.bass ? 24 : 54, alpha * 0.36));
  gradient.addColorStop(1, hsla(hue - 18, 78, bubble.bass ? 12 : 34, alpha * 0.12));
  canvasContext.fillStyle = gradient;
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, bubble.radius * 1.08, bubble.radius * 0.88, 0, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(hue + 42, 88, bubble.bass ? 42 : 76, alpha * (bubble.bass ? 0.36 : 0.62));
  canvasContext.lineWidth = Math.max(1, bubble.radius * 0.035);
  canvasContext.stroke();

  const eyeCount = bubble.bass ? 3 : 2;
  for (let eye = 0; eye < eyeCount; eye += 1) {
    const eyeX = (eye - (eyeCount - 1) / 2) * bubble.radius * 0.32;
    const eyeY = -bubble.radius * (0.1 + bubble.alarm * 0.18);
    canvasContext.fillStyle = hsla(55 + bassEnergy * 32, 90, 76, alpha * 0.8);
    canvasContext.beginPath();
    canvasContext.arc(eyeX, eyeY, Math.max(1.4, bubble.radius * (bubble.bass ? 0.045 : 0.085)), 0, Math.PI * 2);
    canvasContext.fill();
  }

  if (!bubble.bass) {
    canvasContext.strokeStyle = hsla(hue + 80, 86, 82, alpha * bubble.alarm * 0.65);
    canvasContext.lineWidth = 1;
    for (let jolt = 0; jolt < 3; jolt += 1) {
      const angle = -Math.PI / 2 + (jolt - 1) * 0.45;
      canvasContext.beginPath();
      canvasContext.moveTo(Math.cos(angle) * bubble.radius * 0.65, Math.sin(angle) * bubble.radius * 0.65);
      canvasContext.lineTo(Math.cos(angle) * bubble.radius * (1 + bubble.alarm), Math.sin(angle) * bubble.radius * (1 + bubble.alarm));
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function drawSwampBubblesFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();
  const population = handCountValueNumber() / 6;
  const pressure = handGraspAmount();
  const scale = handSizeMultiplier();

  analyser.getByteFrequencyData(buffer);
  swampFrame += speedMultiplier;

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 7), 1.42);
  const trebleEnergy = pressureResponse(averageBand(buffer, 62, 112), 1.48);
  const midEnergy = pressureResponse(averageBand(buffer, 14, 48), 1.34);

  const sky = canvasContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, `rgba(42, 5, 28, ${0.34 + pressure * 0.2})`);
  sky.addColorStop(0.42, `rgba(75, 18, 70, ${0.18 + midEnergy * 0.28 + pressure * 0.12})`);
  sky.addColorStop(0.54, "rgba(38, 38, 38, 0.42)");
  sky.addColorStop(1, "rgba(2, 8, 7, 0.72)");
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  const swamp = canvasContext.createLinearGradient(0, height * 0.52, 0, height);
  swamp.addColorStop(0, "rgba(22, 23, 18, 0.45)");
  swamp.addColorStop(0.45, "rgba(5, 24, 18, 0.72)");
  swamp.addColorStop(1, "rgba(0, 4, 4, 0.92)");
  canvasContext.fillStyle = swamp;
  canvasContext.fillRect(0, height * 0.52, width, height * 0.48);

  const horizonY = height * (0.51 + Math.sin(swampFrame * (0.01 + pressure * 0.012)) * (0.014 + pressure * 0.035));
  canvasContext.strokeStyle = `rgba(173, 78, 126, ${0.12 + bassEnergy * 0.22 + pressure * 0.14})`;
  canvasContext.lineWidth = 2 + bassEnergy * 10 + pressure * 5;
  canvasContext.beginPath();
  for (let x = 0; x <= width; x += width / 32) {
    const y = horizonY + Math.sin(x * 0.018 + swampFrame * (0.025 + pressure * 0.022)) * (5 + bassEnergy * 28 + pressure * 22);
    if (x === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }
  }
  canvasContext.stroke();

  swampBands.forEach((band, bandIndex) => {
    const intensity = pressureResponse(averageBand(buffer, band.start, band.end), 1.36);
    const chance = bandIndex < 2
      ? intensity * 0.1 + bassEnergy * (0.08 + pressure * 0.08)
      : intensity * 0.12 + trebleEnergy * 0.07 + pressure * 0.018;

    if (Math.random() < chance * speedMultiplier * population) {
      const spawnCount = 1 + Math.floor((population - 0.5) * intensity * 2.2);
      for (let index = 0; index < spawnCount; index += 1) {
        spawnSwampBubble(bandIndex, intensity, width, height, bassEnergy);
      }
    }
  });

  if (bassEnergy > 0.32 - pressure * 0.12 && Math.random() < bassEnergy * (0.16 + pressure * 0.22) * population) {
    spawnSwampBubble(0, bassEnergy, width, height, bassEnergy);
  }

  swampBubbles = swampBubbles.filter((bubble) => bubble.life > 0 && bubble.y + bubble.radius > -height * 0.2);
  swampBubbles.forEach((bubble) => {
    const fright = Math.max(0, bassEnergy - (0.25 - pressure * 0.12));
    bubble.x += bubble.vx * speedMultiplier + (bubble.bass ? 0 : Math.sin(swampFrame * 0.08 + bubble.wobble) * fright * (5 + pressure * 9));
    bubble.y += bubble.vy * speedMultiplier;
    bubble.vx += Math.sin(swampFrame * (0.015 + pressure * 0.018) + bubble.wobble) * (0.012 + pressure * 0.03);
    bubble.vy -= bubble.bass ? 0.001 + pressure * 0.002 : 0.004 + trebleEnergy * (0.014 + pressure * 0.018);
    bubble.radius += (bubble.targetRadius - bubble.radius) * (0.018 + pressure * 0.012) + (bubble.bass ? bassEnergy * (0.22 + pressure * 0.3) : trebleEnergy * 0.05 * Math.sqrt(scale));
    bubble.alarm = Math.max(bubble.alarm * (0.955 - pressure * 0.035), fright + pressure * 0.12);
    bubble.life -= bubble.decay * speedMultiplier * (bubble.bass ? 0.68 : 1.05);
    drawSwampCreature(canvasContext, bubble, bassEnergy);
  });

  const maxBubbles = Math.round(110 + population * 90);
  if (swampBubbles.length > maxBubbles) {
    swampBubbles.splice(0, swampBubbles.length - maxBubbles);
  }

  canvasContext.fillStyle = `rgba(7, 3, 7, ${0.12 + bassEnergy * 0.1})`;
  canvasContext.fillRect(0, height * 0.84, width, height * 0.16);
}

function arrowHue(index, intensity) {
  const progress = index / Math.max(1, arrowBands.length - 1);
  const theme = themeSelect.value;
  if (theme === "ice") {
    return 194 + progress * 74 + intensity * 28;
  }
  if (theme === "ember") {
    return 4 + progress * 54 + intensity * 22;
  }
  if (theme === "spectrum") {
    return 300 - progress * 260 + intensity * 34;
  }
  if (theme === "pressure") {
    return 342 - progress * 248 + intensity * 62;
  }
  return progress < 0.45
    ? 354 + progress * 2.22 * 52
    : 62 + (progress - 0.45) * 1.82 * 224 + intensity * 18;
}

function spawnArrow(bandIndex, intensity, width, height, bassEnergy) {
  const density = handCountValueNumber() / 6;
  const drama = handGraspAmount();
  const size = handSizeMultiplier();
  const speedMultiplier = fireworkSpeedMultiplier();
  const scene = fireworkFormSelect.value;
  const length = (34 + intensity * 54 + bassEnergy * 42) * size * arrowBands[bandIndex].weight;
  const fire = Math.random() < drama;
  const williamTellHit = scene === "williamtell" && Math.random() < 0.2 + intensity * 0.14;
  const centreWeighted = Math.random() < 0.7;
  const fieldX = centreWeighted
    ? (Math.random() + Math.random() + Math.random()) / 3
    : Math.random();
  const fieldY = centreWeighted
    ? (Math.random() + Math.random() + Math.random()) / 3
    : Math.random();
  const targetX = williamTellHit
    ? width * (0.5 + (Math.random() - 0.5) * (0.2 - intensity * 0.08))
    : width * (0.035 + fieldX * 0.93);
  const targetY = williamTellHit
    ? height * (0.55 + Math.random() * 0.07)
    : height * (0.045 + fieldY * 0.91);
  const entry = Math.random();
  let x;
  let y;
  if (entry < 0.72) {
    x = width * (-0.05 + Math.random() * 1.1);
    y = -length * (0.7 + Math.random());
  } else if (entry < 0.86) {
    x = -length;
    y = height * Math.random() * 0.72;
  } else {
    x = width + length;
    y = height * Math.random() * 0.72;
  }
  const dx = targetX - x;
  const dy = targetY - y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const launchSpeed = (6.4 + intensity * 9 + bassEnergy * 6) * speedMultiplier;

  arrows.push({
    x,
    y,
    vx: (dx / distance) * launchSpeed,
    vy: (dy / distance) * launchSpeed,
    angle: Math.atan2(dy, dx) - Math.PI / 2,
    spin: (Math.random() - 0.5) * 0.016 * (1 + drama),
    length,
    targetX,
    targetY,
    lastDistance: distance,
    travel: 0,
    hue: arrowHue(bandIndex, intensity),
    alpha: 1,
    fire,
    stuck: false,
    ignited: false,
    impact: 0,
    bandIndex,
    intensity,
    density,
    agency: 0.16 + drama * 0.55 + intensity * 0.45 + bassEnergy * 0.28,
    weavePhase: Math.random() * Math.PI * 2,
    curiosity: Math.random() * 0.7 + 0.3,
  });
}

function drawArrowBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  const scene = fireworkFormSelect.value;
  const sky = canvasContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, scene === "fort" ? "rgba(55, 12, 16, 0.58)" : "rgba(7, 18, 18, 0.6)");
  sky.addColorStop(0.52, scene === "williamtell" ? "rgba(30, 54, 42, 0.48)" : "rgba(24, 30, 28, 0.56)");
  sky.addColorStop(1, "rgba(4, 7, 5, 0.9)");
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.fillStyle = scene === "fort" ? "rgba(48, 20, 14, 0.85)" : "rgba(8, 31, 19, 0.82)";
  canvasContext.fillRect(0, height * 0.66, width, height * 0.34);

  if (scene === "williamtell") {
    const cx = width * 0.5;
    const cy = height * 0.58;
    canvasContext.fillStyle = "rgba(230, 212, 160, 0.18)";
    canvasContext.beginPath();
    canvasContext.arc(cx, cy, 42 + bassEnergy * 26, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.strokeStyle = `rgba(244, 230, 190, ${0.36 + trebleEnergy * 0.28})`;
    canvasContext.lineWidth = 3;
    for (let ring = 1; ring <= 3; ring += 1) {
      canvasContext.beginPath();
      canvasContext.arc(cx, cy, ring * 16 + bassEnergy * 4, 0, Math.PI * 2);
      canvasContext.stroke();
    }
    canvasContext.fillStyle = "rgba(180, 20, 32, 0.78)";
    canvasContext.beginPath();
    canvasContext.arc(cx, cy, 7 + bassEnergy * 8, 0, Math.PI * 2);
    canvasContext.fill();
  } else if (scene === "fort") {
    canvasContext.fillStyle = "rgba(72, 35, 22, 0.9)";
    const baseY = height * 0.6;
    for (let x = 0; x < width; x += 34) {
      canvasContext.fillRect(x, baseY - 42 - Math.sin(x * 0.04) * 10, 24, height * 0.35);
    }
    canvasContext.fillStyle = `rgba(255, 88, 22, ${0.08 + bassEnergy * 0.18})`;
    canvasContext.fillRect(0, baseY - 24, width, 40 + bassEnergy * 50);
  } else {
    canvasContext.fillStyle = "rgba(10, 42, 24, 0.58)";
    for (let x = -20; x < width; x += 58) {
      const treeHeight = height * (0.22 + ((x / 58) % 3) * 0.04);
      canvasContext.beginPath();
      canvasContext.moveTo(x, height * 0.68);
      canvasContext.lineTo(x + 28, height * 0.68 - treeHeight);
      canvasContext.lineTo(x + 56, height * 0.68);
      canvasContext.closePath();
      canvasContext.fill();
    }
  }
}

function drawArrow(canvasContext, arrow, bassEnergy) {
  canvasContext.save();
  canvasContext.translate(arrow.x, arrow.y);
  canvasContext.rotate(arrow.angle);

  if (arrow.fire) {
    const flame = canvasContext.createLinearGradient(0, -arrow.length * 0.55, 0, arrow.length * 0.8);
    flame.addColorStop(0, hsla(34 + bassEnergy * 26, 96, 62, 0));
    flame.addColorStop(0.7, hsla(18, 96, 54, 0.38 * arrow.alpha));
    flame.addColorStop(1, hsla(4, 92, 42, 0.58 * arrow.alpha));
    canvasContext.strokeStyle = flame;
    canvasContext.lineWidth = Math.max(4, arrow.length * 0.12);
    canvasContext.beginPath();
    canvasContext.moveTo(0, -arrow.length * 0.68);
    canvasContext.lineTo(0, -arrow.length * 1.38);
    canvasContext.stroke();
  }

  canvasContext.strokeStyle = hsla(arrow.hue, 80, 62, 0.84 * arrow.alpha);
  canvasContext.lineWidth = Math.max(2, arrow.length * 0.045);
  canvasContext.beginPath();
  canvasContext.moveTo(0, -arrow.length * 0.5);
  canvasContext.lineTo(0, arrow.length * 0.5);
  canvasContext.stroke();

  canvasContext.fillStyle = hsla(arrow.hue + 20, 88, 68, 0.92 * arrow.alpha);
  canvasContext.beginPath();
  canvasContext.moveTo(0, arrow.length * 0.58);
  canvasContext.lineTo(-arrow.length * 0.12, arrow.length * 0.3);
  canvasContext.lineTo(arrow.length * 0.12, arrow.length * 0.3);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(arrow.hue - 28, 72, 74, 0.62 * arrow.alpha);
  canvasContext.lineWidth = 1.2;
  canvasContext.beginPath();
  canvasContext.moveTo(0, -arrow.length * 0.48);
  canvasContext.lineTo(-arrow.length * 0.14, -arrow.length * 0.66);
  canvasContext.moveTo(0, -arrow.length * 0.48);
  canvasContext.lineTo(arrow.length * 0.14, -arrow.length * 0.66);
  canvasContext.stroke();
  canvasContext.restore();
}

function igniteArrowLanding(arrow, width, height) {
  arrow.ignited = true;
  arrowFires.push({
    x: clampNumber(arrow.x, width * 0.01, width * 0.99),
    y: clampNumber(arrow.y + arrow.length * 0.25, height * 0.03, height * 0.98),
    radius: arrow.length * (0.18 + Math.random() * 0.22),
    fuel: 0.9 + Math.random() * 0.8,
    age: 0,
    phase: Math.random() * Math.PI * 2,
  });
  if (arrowFires.length > 110) arrowFires.splice(0, arrowFires.length - 110);
}

function spawnArrowBurst(arrow, bandEnergy, bassEnergy, trebleEnergy) {
  const particleCount = Math.round(24 + bandEnergy * 34 + bassEnergy * 22);
  const force = arrow.length * (0.055 + bandEnergy * 0.065 + trebleEnergy * 0.04);
  const particles = Array.from({ length: particleCount }, (_, index) => {
    const angle = (index / particleCount) * Math.PI * 2 + Math.random() * 0.2;
    const speed = force * (0.42 + Math.random() * 0.9);
    return {
      x: arrow.x,
      y: arrow.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.72 + Math.random() * 0.28,
      decay: 0.012 + Math.random() * 0.014,
      hue: arrow.hue + (Math.random() - 0.5) * 54,
      size: 1.3 + Math.random() * (2.8 + trebleEnergy * 3.5),
      trail: 0.55 + Math.random() * 0.55,
    };
  });

  arrowBursts.push({
    x: arrow.x,
    y: arrow.y,
    life: 1,
    hue: arrow.hue,
    radius: arrow.length * 0.18,
    particles,
  });
  if (arrowBursts.length > 36) arrowBursts.splice(0, arrowBursts.length - 36);
}

function drawArrowBursts(canvasContext, bassEnergy) {
  const speed = fireworkSpeedMultiplier();
  arrowBursts = arrowBursts.filter((burst) => burst.life > 0.01 || burst.particles.some((particle) => particle.life > 0.01));

  arrowBursts.forEach((burst) => {
    burst.life *= Math.pow(0.88, speed);
    burst.radius += (3 + bassEnergy * 8) * speed;
    canvasContext.strokeStyle = hsla(burst.hue + 36, 96, 74, burst.life * 0.72);
    canvasContext.lineWidth = Math.max(1, burst.radius * 0.06);
    canvasContext.beginPath();
    canvasContext.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
    canvasContext.stroke();

    burst.particles.forEach((particle) => {
      if (particle.life <= 0) return;
      const oldX = particle.x;
      const oldY = particle.y;
      particle.x += particle.vx * speed;
      particle.y += particle.vy * speed;
      particle.vx *= Math.pow(0.982, speed);
      particle.vy = particle.vy * Math.pow(0.982, speed) + (0.018 + bassEnergy * 0.035) * speed;
      particle.life -= particle.decay * speed;
      canvasContext.strokeStyle = hsla(particle.hue, 96, 66, Math.max(0, particle.life) * 0.9);
      canvasContext.lineWidth = particle.size * Math.max(0.35, particle.life);
      canvasContext.beginPath();
      canvasContext.moveTo(oldX, oldY);
      canvasContext.lineTo(
        particle.x + particle.vx * particle.trail,
        particle.y + particle.vy * particle.trail,
      );
      canvasContext.stroke();
    });
  });
}

function drawArrowFires(canvasContext, width, height, bassEnergy) {
  const speed = fireworkSpeedMultiplier();
  const fireShare = handGraspAmount();
  arrowFires = arrowFires.filter((fire) => fire.fuel > 0.02);

  arrowFires.forEach((fire, fireIndex) => {
    fire.age += speed;
    fire.fuel -= (0.00065 + Math.max(0, fire.age - 520) * 0.0000014) * speed;
    const strength = Math.min(1, fire.age / 10) * Math.min(1, fire.fuel) * (0.72 + bassEnergy * 0.7);
    const glowRadius = fire.radius * (2.2 + bassEnergy * 1.5);
    const glow = canvasContext.createRadialGradient(fire.x, fire.y, 0, fire.x, fire.y, glowRadius);
    glow.addColorStop(0, `rgba(255, 224, 92, ${0.3 * strength})`);
    glow.addColorStop(0.38, `rgba(255, 76, 18, ${0.2 * strength})`);
    glow.addColorStop(1, "rgba(42, 0, 0, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.fillRect(fire.x - glowRadius, fire.y - glowRadius, glowRadius * 2, glowRadius * 2);

    const tongues = 4 + Math.round(bassEnergy * 5);
    for (let tongue = 0; tongue < tongues; tongue += 1) {
      const sway = Math.sin(arrowFrame * 0.11 + fire.phase + tongue * 1.7);
      const x = fire.x + (tongue / Math.max(1, tongues - 1) - 0.5) * fire.radius * 1.5;
      const flameHeight = fire.radius * (0.9 + ((tongue * 7) % 5) * 0.16 + bassEnergy * 1.8) * strength;
      const flame = canvasContext.createLinearGradient(x, fire.y, x + sway * fire.radius * 0.35, fire.y - flameHeight);
      flame.addColorStop(0, `rgba(174, 18, 3, ${0.7 * strength})`);
      flame.addColorStop(0.48, `rgba(255, 112, 16, ${0.82 * strength})`);
      flame.addColorStop(1, `rgba(255, 244, 154, ${0.08 * strength})`);
      canvasContext.fillStyle = flame;
      canvasContext.beginPath();
      canvasContext.moveTo(x - fire.radius * 0.18, fire.y);
      canvasContext.quadraticCurveTo(x + sway * fire.radius * 0.5, fire.y - flameHeight * 0.52, x + sway * fire.radius * 0.28, fire.y - flameHeight);
      canvasContext.quadraticCurveTo(x - sway * fire.radius * 0.18, fire.y - flameHeight * 0.42, x + fire.radius * 0.2, fire.y);
      canvasContext.fill();
    }

    canvasContext.fillStyle = `rgba(18, 5, 3, ${0.32 + strength * 0.34})`;
    canvasContext.beginPath();
    canvasContext.ellipse(fire.x, fire.y + 2, fire.radius * 1.15, fire.radius * 0.28, 0, 0, Math.PI * 2);
    canvasContext.fill();

    if (fireIndex < 40 && bassEnergy > 0.44 && Math.random() < bassEnergy * fireShare * 0.0009 * speed && arrowFires.length < 110) {
      arrowFires.push({
        x: clampNumber(fire.x + (Math.random() - 0.5) * fire.radius * 5, 0, width),
        y: clampNumber(fire.y + (Math.random() - 0.5) * fire.radius, height * 0.03, height * 0.98),
        radius: fire.radius * (0.62 + Math.random() * 0.45),
        fuel: 0.6 + Math.random() * 0.7,
        age: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }
  });
}

function drawArrowStormFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();
  const density = handCountValueNumber() / 6;
  const drama = handGraspAmount();

  analyser.getByteFrequencyData(buffer);
  arrowFrame += speedMultiplier;
  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.36);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.42);

  drawArrowBackground(canvasContext, width, height, bassEnergy, trebleEnergy);
  drawArrowFires(canvasContext, width, height, bassEnergy);

  arrowBands.forEach((band, bandIndex) => {
    const intensity = pressureResponse(averageBand(buffer, band.start, band.end), 1.34);
    const volley = intensity * 0.09 * density + bassEnergy * 0.025 + drama * 0.01;
    if (Math.random() < volley * speedMultiplier) {
      const count = 1 + Math.floor((intensity + bassEnergy * 0.7) * density * 3);
      for (let i = 0; i < count; i += 1) {
        spawnArrow(bandIndex, intensity, width, height, bassEnergy);
      }
    }
  });

  arrows = arrows.filter((arrow) => (
    arrow.alpha > 0
    && arrow.x > -arrow.length * 2
    && arrow.x < width + arrow.length * 2
    && arrow.y > -arrow.length * 2
    && arrow.y < height + arrow.length * 2
  ));
  arrows.forEach((arrow) => {
    if (!arrow.stuck) {
      const band = arrowBands[arrow.bandIndex] || arrowBands[0];
      const bandEnergy = pressureResponse(averageBand(buffer, band.start, band.end), 1.32);
      const targetPull = (0.006 + arrow.agency * 0.018 + bandEnergy * 0.02) * speedMultiplier;
      const wander = Math.sin(arrowFrame * (0.026 + arrow.curiosity * 0.014) + arrow.weavePhase + arrow.y * 0.01);
      const lift = Math.cos(arrowFrame * 0.017 + arrow.weavePhase) * trebleEnergy * arrow.curiosity;
      const dx = arrow.targetX - arrow.x;
      const dy = arrow.targetY - arrow.y;

      arrow.vx += (dx / width) * targetPull * 24;
      arrow.vy += (dy / height) * targetPull * 12;
      arrow.vx += wander * (0.045 + bandEnergy * 0.24 + drama * 0.14) * speedMultiplier;
      arrow.vy += (0.025 + bassEnergy * 0.13 - lift * 0.08) * speedMultiplier;
      arrow.vx *= 0.992 - Math.min(0.018, drama * 0.012);
      arrow.vy *= 0.994;

      const maxSpeed = 14 + bandEnergy * 11 + bassEnergy * 8;
      const speed = Math.hypot(arrow.vx, arrow.vy);
      if (speed > maxSpeed) {
        arrow.vx = (arrow.vx / speed) * maxSpeed;
        arrow.vy = (arrow.vy / speed) * maxSpeed;
      }

      arrow.x += arrow.vx * speedMultiplier;
      arrow.y += arrow.vy * speedMultiplier;
      arrow.travel += speed * speedMultiplier;
      const targetAngle = Math.atan2(arrow.vy, arrow.vx) - Math.PI / 2;
      const angleDelta = Math.atan2(Math.sin(targetAngle - arrow.angle), Math.cos(targetAngle - arrow.angle));
      arrow.angle += angleDelta * (0.12 + arrow.agency * 0.12) + arrow.spin * speedMultiplier;

      const newDistance = Math.hypot(arrow.targetX - arrow.x, arrow.targetY - arrow.y);
      const impactDistance = Math.max(8, arrow.length * 0.26);
      const passedTarget = arrow.travel > arrow.length
        && newDistance > arrow.lastDistance
        && arrow.lastDistance < arrow.length * 0.72;
      if (newDistance < impactDistance || passedTarget) {
        arrow.stuck = true;
        arrow.x = arrow.targetX;
        arrow.y = arrow.targetY;
        arrow.impact = 1;
        arrow.angle += (Math.random() - 0.5) * 0.18;
        if (arrow.fire) {
          igniteArrowLanding(arrow, width, height);
          if (Math.random() < 0.24 + bandEnergy * 0.52 + trebleEnergy * 0.18) {
            spawnArrowBurst(arrow, bandEnergy, bassEnergy, trebleEnergy);
          }
        }
      }
      arrow.lastDistance = newDistance;
    } else {
      arrow.impact *= 0.88;
      arrow.alpha -= arrow.fire ? 0.0025 : 0.0045;
    }

    drawArrow(canvasContext, arrow, bassEnergy);

    if (arrow.impact > 0.02) {
      canvasContext.fillStyle = hsla(arrow.hue + 42, 92, 68, arrow.impact * 0.34);
      canvasContext.beginPath();
      canvasContext.arc(arrow.x, arrow.y, arrow.length * (0.12 + arrow.impact * 0.45), 0, Math.PI * 2);
      canvasContext.fill();
    }
  });

  if (arrows.length > 420) {
    arrows.splice(0, arrows.length - 420);
  }
  drawArrowBursts(canvasContext, bassEnergy);
}

function setupCephArms(width, height) {
  const desiredCount = Math.max(3, Math.min(14, handCountValueNumber()));
  if (cephArms.length === desiredCount) {
    return;
  }

  cephArms = Array.from({ length: desiredCount }, (_, index) => {
    const progress = desiredCount === 1 ? 0.5 : index / (desiredCount - 1);
    const baseAngle = Math.PI * (0.92 + progress * 1.16);
    const longTentacle = index === 0 || index === desiredCount - 1;

    return {
      index,
      baseAngle,
      phase: Math.random() * Math.PI * 2,
      memory: 0.12 + Math.random() * 0.18,
      delay: Math.random() * Math.PI * 2,
      length: (longTentacle ? 0.46 : 0.34) * Math.min(width, height),
      width: longTentacle ? 17 : 21,
      nerve: Math.random(),
    };
  });
}

function cephHue(progress, intensity) {
  const theme = themeSelect.value;
  if (theme === "pressure") {
    return 334 - progress * 220 + intensity * 64;
  }
  if (theme === "ember") {
    return 8 + progress * 52 + intensity * 18;
  }
  if (theme === "ice") {
    return 186 + progress * 62 + intensity * 24;
  }
  if (theme === "spectrum") {
    return 302 - progress * 260 + intensity * 34;
  }
  return 168 + progress * 72 + intensity * 16;
}

function drawCephBackground(canvasContext, width, height, bassEnergy, trebleEnergy) {
  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#030508";
  canvasContext.fillRect(0, 0, width, height);

  const water = canvasContext.createLinearGradient(0, 0, 0, height);
  water.addColorStop(0, `rgba(18, 55, 70, ${0.38 + trebleEnergy * 0.18})`);
  water.addColorStop(0.48, "rgba(6, 23, 35, 0.82)");
  water.addColorStop(1, `rgba(8, 2, 18, ${0.92 + bassEnergy * 0.08})`);
  canvasContext.fillStyle = water;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.fillStyle = `rgba(92, 255, 222, ${0.025 + trebleEnergy * 0.05})`;
  for (let index = 0; index < 36; index += 1) {
    const x = ((index * 131 + cephFrame * 0.7) % (width + 120)) - 60;
    const y = height * (0.08 + ((index * 47) % 80) / 100);
    canvasContext.beginPath();
    canvasContext.arc(x, y, 1.2 + ((index * 7) % 4), 0, Math.PI * 2);
    canvasContext.fill();
  }
}

function spawnCephInk(width, height, bassEnergy) {
  if (bassEnergy < 0.24 || cephInkBlooms.length > 22 || Math.random() > bassEnergy * 0.22) {
    return;
  }

  cephInkBlooms.push({
    x: width * (0.42 + (Math.random() - 0.5) * 0.18),
    y: height * (0.42 + (Math.random() - 0.5) * 0.18),
    radius: Math.min(width, height) * (0.07 + bassEnergy * 0.18),
    life: 1,
    driftX: (Math.random() - 0.5) * 0.9,
    driftY: 0.25 + Math.random() * 0.6,
  });
}

function drawCephInk(canvasContext) {
  cephInkBlooms = cephInkBlooms.filter((bloom) => bloom.life > 0.02);
  cephInkBlooms.forEach((bloom) => {
    bloom.x += bloom.driftX;
    bloom.y += bloom.driftY;
    bloom.radius *= 1.012;
    bloom.life *= 0.965;

    const gradient = canvasContext.createRadialGradient(
      bloom.x,
      bloom.y,
      0,
      bloom.x,
      bloom.y,
      bloom.radius,
    );
    gradient.addColorStop(0, `rgba(7, 0, 18, ${0.48 * bloom.life})`);
    gradient.addColorStop(0.62, `rgba(27, 0, 38, ${0.28 * bloom.life})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasContext.fillStyle = gradient;
    canvasContext.beginPath();
    canvasContext.arc(bloom.x, bloom.y, bloom.radius, 0, Math.PI * 2);
    canvasContext.fill();
  });
}

function drawCephArm(canvasContext, arm, bodyX, bodyY, bodyRadius, intensity, bassEnergy, trebleEnergy) {
  const speed = fireworkSpeedMultiplier();
  const reach = handSizeMultiplier();
  const grasp = handGraspAmount();
  const progress = arm.index / Math.max(1, cephArms.length - 1);
  const hue = cephHue(progress, intensity);
  const armLength = arm.length * reach * (0.66 + intensity * 0.98);
  const baseX = bodyX + Math.cos(arm.baseAngle) * bodyRadius * 0.58;
  const baseY = bodyY + Math.sin(arm.baseAngle) * bodyRadius * 0.36;
  const segments = 18;
  const points = [];

  arm.memory = arm.memory * (0.82 - grasp * 0.08) + intensity * (0.18 + grasp * 0.16);
  arm.nerve = (arm.nerve + 0.016 * speed + intensity * 0.035) % 1;

  for (let pointIndex = 0; pointIndex <= segments; pointIndex += 1) {
    const amount = pointIndex / segments;
    const curl = Math.sin(cephFrame * 0.045 * speed + arm.phase + amount * (4.2 + grasp * 6.8));
    const independentThought = Math.sin(cephFrame * 0.028 * speed + arm.delay + amount * 8.5);
    const angle = arm.baseAngle + curl * (0.3 + arm.memory * 0.72) + independentThought * (grasp * 0.54 + intensity * 0.22);
    const distance = armLength * amount;
    const drift = Math.sin(amount * Math.PI) * bodyRadius * (0.16 + bassEnergy * 0.12);

    points.push({
      x: baseX + Math.cos(angle) * distance + Math.cos(angle + Math.PI / 2) * drift,
      y: baseY + Math.sin(angle) * distance + Math.sin(angle + Math.PI / 2) * drift + amount * amount * bodyRadius * 0.3,
      amount,
    });
  }

  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";

  for (let segment = 0; segment < points.length - 1; segment += 1) {
    const point = points[segment];
    const next = points[segment + 1];
    const taper = 1 - point.amount * 0.82;
    canvasContext.strokeStyle = hsla(hue + point.amount * 42, 78, 38 + intensity * 34, 0.38 + intensity * 0.5);
    canvasContext.lineWidth = Math.max(2, arm.width * taper * reach * (0.82 + intensity * 0.42));
    canvasContext.beginPath();
    canvasContext.moveTo(point.x, point.y);
    canvasContext.lineTo(next.x, next.y);
    canvasContext.stroke();
  }

  points.forEach((point, pointIndex) => {
    if (pointIndex % 2 !== 0 || point.amount < 0.18) {
      return;
    }

    const side = pointIndex % 4 === 0 ? 1 : -1;
    const pulseDistance = Math.abs(point.amount - arm.nerve);
    const pulse = Math.max(0, 1 - pulseDistance * 9);
    const suckerSize = (2.2 + intensity * 7 + pulse * 7) * (1 - point.amount * 0.45);
    const offset = 5 + 12 * (1 - point.amount);

    canvasContext.fillStyle = hsla(hue + trebleEnergy * 96, 92, 58 + pulse * 24, 0.3 + pulse * 0.66);
    canvasContext.beginPath();
    canvasContext.arc(point.x + side * offset, point.y, suckerSize, 0, Math.PI * 2);
    canvasContext.fill();
  });
}

function drawCephBeak(canvasContext, bodyRadius, bassEnergy, midsEnergy, trebleEnergy) {
  const mischief = handGraspAmount();
  const pulse = Math.sin(cephFrame * 0.08 * fireworkSpeedMultiplier());
  const open = clampNumber(bassEnergy * 0.8 + midsEnergy * 0.42 + Math.max(0, pulse) * trebleEnergy * 0.3, 0.08, 1);
  const mood = trebleEnergy > 0.62
    ? "startled"
    : bassEnergy > 0.62
      ? "indignant"
      : mischief > 0.62
        ? "scheming"
        : midsEnergy > 0.42
          ? "pleased"
          : "pensive";
  const y = bodyRadius * 0.27;
  const width = bodyRadius * (0.28 + open * 0.12);
  const height = bodyRadius * (0.11 + open * 0.16);
  const tilt = mood === "scheming" ? -0.12 : mood === "indignant" ? 0.08 * pulse : 0;

  canvasContext.save();
  canvasContext.translate(0, y);
  canvasContext.rotate(tilt);
  canvasContext.shadowColor = hsla(22 + trebleEnergy * 42, 92, 62, 0.72);
  canvasContext.shadowBlur = bodyRadius * 0.1;
  canvasContext.fillStyle = hsla(30 - bassEnergy * 18, 78, 28 + trebleEnergy * 22, 0.96);
  canvasContext.strokeStyle = hsla(44 + trebleEnergy * 34, 88, 72, 0.88);
  canvasContext.lineWidth = Math.max(1.5, bodyRadius * 0.025);

  canvasContext.beginPath();
  canvasContext.moveTo(-width, mood === "pleased" ? -height * 0.25 : -height * 0.62);
  canvasContext.quadraticCurveTo(0, -height * (0.18 + open * 0.24), width, -height * 0.62);
  canvasContext.quadraticCurveTo(width * 0.34, height * (0.12 + open * 0.36), 0, height);
  canvasContext.quadraticCurveTo(-width * 0.34, height * (0.12 + open * 0.36), -width, -height * 0.62);
  canvasContext.fill();
  canvasContext.stroke();

  if (open > 0.28) {
    canvasContext.fillStyle = "rgba(4, 2, 8, 0.82)";
    canvasContext.beginPath();
    canvasContext.ellipse(0, height * 0.18, width * 0.46, height * open * 0.42, 0, 0, Math.PI * 2);
    canvasContext.fill();
  }

  if (mood === "startled") {
    canvasContext.strokeStyle = "rgba(215, 252, 255, 0.72)";
    canvasContext.beginPath();
    canvasContext.arc(0, 0, width * 1.28, 0, Math.PI * 2);
    canvasContext.stroke();
  } else if (mood === "scheming") {
    canvasContext.fillStyle = "rgba(242, 224, 178, 0.78)";
    canvasContext.beginPath();
    canvasContext.moveTo(width * 0.12, height * 0.05);
    canvasContext.lineTo(width * 0.42, height * 0.26);
    canvasContext.lineTo(width * 0.22, height * 0.48);
    canvasContext.fill();
  }
  canvasContext.restore();
}

function drawCephBody(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy) {
  const bodyX = width * 0.5;
  const bodyY = height * 0.42;
  const bodyRadius = Math.min(width, height) * (0.12 + bassEnergy * 0.105 + midsEnergy * 0.035) * handSizeMultiplier();
  const bodyHue = cephHue(0.42 + trebleEnergy * 0.3, midsEnergy);

  canvasContext.save();
  canvasContext.translate(bodyX, bodyY);
  canvasContext.rotate(Math.sin(cephFrame * 0.015) * 0.08);

  const mantle = canvasContext.createRadialGradient(0, -bodyRadius * 0.15, bodyRadius * 0.12, 0, 0, bodyRadius * 1.25);
  mantle.addColorStop(0, hsla(bodyHue + 28, 92, 62 + trebleEnergy * 18, 0.78));
  mantle.addColorStop(0.48, hsla(bodyHue, 72, 30 + midsEnergy * 30, 0.84));
  mantle.addColorStop(1, "rgba(5, 8, 15, 0.2)");
  canvasContext.fillStyle = mantle;
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, bodyRadius * 0.95, bodyRadius * 1.24, 0, 0, Math.PI * 2);
  canvasContext.fill();

  for (let spot = 0; spot < 34; spot += 1) {
    const angle = spot * 2.399;
    const radius = bodyRadius * Math.sqrt((spot % 17) / 17);
    const flash = Math.max(0, Math.sin(cephFrame * 0.085 + spot + trebleEnergy * 12));
    canvasContext.fillStyle = hsla(bodyHue + spot * 9, 92, 48 + flash * 32, (0.1 + trebleEnergy * 0.58) * flash);
    canvasContext.beginPath();
    canvasContext.arc(
      Math.cos(angle) * radius * 0.78,
      Math.sin(angle) * radius,
      2.5 + flash * (6.5 + trebleEnergy * 7),
      0,
      Math.PI * 2,
    );
    canvasContext.fill();
  }

  canvasContext.fillStyle = "rgba(230, 255, 245, 0.82)";
  [-1, 1].forEach((side) => {
    canvasContext.beginPath();
    canvasContext.ellipse(side * bodyRadius * 0.27, -bodyRadius * 0.05, bodyRadius * 0.09, bodyRadius * 0.13, 0, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.fillStyle = "rgba(4, 9, 13, 0.86)";
    canvasContext.beginPath();
    canvasContext.arc(side * bodyRadius * 0.28, -bodyRadius * 0.04, bodyRadius * (0.035 + trebleEnergy * 0.026), 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.fillStyle = "rgba(230, 255, 245, 0.82)";
  });

  drawCephBeak(canvasContext, bodyRadius, bassEnergy, midsEnergy, trebleEnergy);

  canvasContext.restore();

  return { bodyX, bodyY, bodyRadius };
}

function drawCephalopodFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  updateMood(buffer);
  cephFrame += speedMultiplier;
  setupCephArms(width, height);

  const bassEnergy = pressureResponse(averageBand(buffer, 1, 8), 1.52);
  const midsEnergy = pressureResponse(averageBand(buffer, 12, 52), 1.42);
  const trebleEnergy = pressureResponse(averageBand(buffer, 58, 112), 1.55);

  drawCephBackground(canvasContext, width, height, bassEnergy, trebleEnergy);
  spawnCephInk(width, height, bassEnergy);
  drawCephInk(canvasContext);

  const body = drawCephBody(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
  cephArms.forEach((arm, index) => {
    const band = cephBands[index % cephBands.length];
    const intensity = pressureResponse(averageBand(buffer, band.start, band.end), 1.48);
    drawCephArm(canvasContext, arm, body.bodyX, body.bodyY, body.bodyRadius, intensity, bassEnergy, trebleEnergy);
  });
  drawCephBody(canvasContext, width, height, bassEnergy, midsEnergy, trebleEnergy);
}

function drawIdleVisualizer() {
  const canvasContext = visualizer.getContext("2d");
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.globalAlpha = 1;
  canvasContext.globalCompositeOperation = "source-over";

  if (visualizerSelect.value === "snakeconga") {
    drawIdleSnakeConga();
  } else if (visualizerSelect.value === "lingerie") {
    drawIdleLingerie();
  } else if (visualizerSelect.value === "oysterpearls") {
    drawIdleOysterPearls();
  } else if (visualizerSelect.value === "oilslide") {
    drawIdleOilSlide();
  } else if (visualizerSelect.value === "bobrossgarden") {
    drawIdleBobRossGarden();
  } else if (visualizerSelect.value === "kaleidoscope") {
    drawIdleKaleidoscope();
  } else if (visualizerSelect.value === "hypnoticflight") {
    drawIdleHypnoticFlight();
  } else if (visualizerSelect.value === "cathedralorganism") {
    drawIdleCathedralOrganism();
  } else if (visualizerSelect.value === "turtleriver") {
    drawIdleTurtleRiver();
  } else if (visualizerSelect.value === "warofroses") {
    drawIdleWarOfRoses();
  } else if (visualizerSelect.value === "sunflowersmiles") {
    drawIdleSunflowerSmiles();
  } else if (visualizerSelect.value === "interzoneoracles") {
    drawIdleInterzoneOracles();
  } else if (visualizerSelect.value === "asteroids") {
    drawIdleAsteroids();
  } else if (visualizerSelect.value === "lightning") {
    drawIdleLightning();
  } else if (visualizerSelect.value === "eyevisions") {
    drawIdleEyeVisions();
  } else if (visualizerSelect.value === "mandelbrot") {
    drawIdleMandelbrot();
  } else if (visualizerSelect.value === "tipustiger") {
    drawIdleTipusTiger();
  } else if (visualizerSelect.value === "climbinggarden") {
    drawIdleClimbingGarden();
  } else if (visualizerSelect.value === "goddesskisses") {
    drawIdleGoddessKisses();
  } else if (visualizerSelect.value === "lizardlouche") {
    drawIdleLizardLouche();
  } else if (visualizerSelect.value === "octopusocclusion") {
    drawIdleOctopusOcclusion();
  } else if (visualizerSelect.value === "knifethunk") {
    drawIdleKnifeThunk();
  } else if (visualizerSelect.value === "butterflyhost") {
    drawIdleButterflyHost();
  } else if (visualizerSelect.value === "glitterfall") {
    drawIdleGlitterFall();
  } else if (visualizerSelect.value === "discojive") {
    drawIdleDiscoJive();
  } else if (visualizerSelect.value === "cephalopod") {
    drawIdleCephalopod();
  } else if (visualizerSelect.value === "arrowstorm") {
    drawIdleArrowStorm();
  } else if (visualizerSelect.value === "swampbubbles") {
    drawIdleSwampBubbles();
  } else if (visualizerSelect.value === "branchhands") {
    drawIdleBranchHands();
  } else if (visualizerSelect.value === "pacdance") {
    drawIdlePacDance();
  } else if (visualizerSelect.value === "fireworks") {
    drawIdleFireworks();
  } else {
    drawIdleEqualizer();
  }
  drawSpectrumDialEffects(canvasContext);
  drawStagePulse(canvasContext);
  drawFullscreenInfo(canvasContext);
}

function drawIdleArrowStorm() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  drawArrowBackground(canvasContext, width, height, 0.22, 0.18);
  for (let index = 0; index < 26; index += 1) {
    const bandIndex = index % arrowBands.length;
    const arrow = {
      x: width * Math.random(),
      y: height * (0.12 + Math.random() * 0.78),
      angle: Math.PI / 2 + (Math.random() - 0.5) * 0.45,
      length: (34 + bandIndex * 9) * handSizeMultiplier(),
      hue: arrowHue(bandIndex, 0.24),
      alpha: 0.52,
      fire: index % 5 === 0,
    };
    drawArrow(canvasContext, arrow, 0.22);
  }
}

function drawIdleCephalopod() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  cephFrame += 1;
  setupCephArms(width, height);
  drawCephBackground(canvasContext, width, height, 0.16, 0.24);
  drawCephInk(canvasContext);

  const body = drawCephBody(canvasContext, width, height, 0.2, 0.22, 0.26);
  cephArms.forEach((arm, index) => {
    drawCephArm(
      canvasContext,
      arm,
      body.bodyX,
      body.bodyY,
      body.bodyRadius,
      0.12 + (index % 5) * 0.025,
      0.18,
      0.24,
    );
  });
  drawCephBody(canvasContext, width, height, 0.2, 0.22, 0.26);
}

function drawIdleSwampBubbles() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#050707";
  canvasContext.fillRect(0, 0, width, height);

  const gradient = canvasContext.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(55, 7, 36, 0.56)");
  gradient.addColorStop(0.5, "rgba(55, 34, 52, 0.34)");
  gradient.addColorStop(1, "rgba(0, 8, 6, 0.82)");
  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(0, 0, width, height);

  for (let index = 0; index < 18; index += 1) {
    const bandIndex = index % swampBands.length;
    const radius = bandIndex < 2 ? 28 + Math.random() * 58 : 7 + Math.random() * 24;
    const bubble = {
      x: width * Math.random(),
      y: height * (0.55 + Math.random() * 0.38),
      radius,
      hue: swampHue(bandIndex, 0.2),
      life: 0.32,
      wobble: Math.random() * Math.PI * 2,
      alarm: bandIndex > 3 ? 0.5 : 0,
      bass: bandIndex < 2,
    };
    drawSwampCreature(canvasContext, bubble, 0.18);
  }
}


function drawIdleBranchHands() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  canvasContext.clearRect(0, 0, width, height);
  const fieldColours = branchFieldColours();
  const field = canvasContext.createLinearGradient(0, 0, width, height);
  field.addColorStop(0, fieldColours[0]);
  field.addColorStop(0.52, fieldColours[1]);
  field.addColorStop(1, fieldColours[2]);
  canvasContext.fillStyle = "#050709";
  canvasContext.fillRect(0, 0, width, height);
  canvasContext.fillStyle = field;
  canvasContext.fillRect(0, 0, width, height);
  setupHandForms(width, height);

  handForms.forEach((hand) => {
    hand.growth = 0.28;
    hand.fingers.forEach((finger) => {
      drawFinger(canvasContext, hand, finger, 0.16 + hand.index * 0.025, width, height);
    });
  });
}


function drawIdlePacDance() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#050709";
  canvasContext.fillRect(0, 0, width, height);
  setupPacDancers(width, height);

  pacDancers.forEach((dancer) => {
    drawPacCharacter(canvasContext, dancer, 0.12 + dancer.bandIndex * 0.025, width, height);
  });
}

function drawIdleDiscoJive() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  discoFrame += 1;
  discoCouples = [];
  setupDiscoCouples(width, height);
  canvasContext.clearRect(0, 0, width, height);
  drawDiscoBackground(canvasContext, width, height, 0.18, 0.22);

  discoCouples.forEach((couple) => {
    drawDiscoCouple(canvasContext, couple, 0.14 + couple.bandIndex * 0.026, width, height);
  });
}

function drawIdleGlitterFall() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const mode = glitterWeatherMode();
  const blizzard = glitterBlizzardForce();

  glitterFrame += mode === "blizzard" ? 1.2 : 0.55 + blizzard * 0.35;
  drawGlitterBackground(canvasContext, width, height, 0.18, 0.24);

  seedGlitterField(width, height, glitterTargetParticleCount(mode), 0.18, 0.24);

  glitterParticles = glitterParticles.filter((particle) => particle.life > 0.02);
  glitterParticles.forEach((particle) => {
    particle.x += particle.vx + Math.sin(glitterFrame * 0.026 + particle.twinkle) * (0.35 + blizzard * 2.2);
    particle.y += particle.vy * (mode === "blizzard" ? 0.75 : 0.38);
    if (particle.x < -particle.length) particle.x = width + particle.length;
    if (particle.x > width + particle.length) particle.x = -particle.length;
    if (particle.y > height + particle.length + 30) recycleGlitterParticle(particle, width, height);
    particle.angle += particle.spin;
    particle.life -= mode === "blizzard" ? 0.0015 : 0.0008;
    drawGlitterParticle(canvasContext, particle, 0.16, 0.22);
  });
}

function drawIdleButterflyHost() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  butterflyFrame += 1;
  setupButterflies(width, height);
  drawButterflyBackground(canvasContext, width, height, 0.16, 0.22);

  butterflies.forEach((butterfly) => {
    const idleEnergy = 0.12 + (butterfly.bandIndex % 4) * 0.035;
    butterfly.x += Math.sin(butterflyFrame * 0.018 + butterfly.phase) * 0.28;
    butterfly.y += Math.cos(butterflyFrame * 0.014 + butterfly.turn) * 0.2;
    drawButterfly(canvasContext, butterfly, idleEnergy, 0.16, 0.22);
  });
}

function drawIdleKnifeThunk() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  knifeFrame += 1;
  setupKnifeTargets(width, height);
  drawKnifeBackground(canvasContext, width, height, 0.18, 0.2);

  knifeTargets.forEach((target, index) => {
    target.ring = Math.max(target.ring, index % 3 === 0 ? 0.18 : 0);
    drawKnifeTarget(canvasContext, target, 0.14 + target.bandIndex * 0.025, 0.18, 0.2);
  });

  if (thrownKnives.length < 8) {
    spawnKnife(thrownKnives.length % knifeBands.length, 0.18, width, height);
  }

  thrownKnives.forEach((knife) => {
    knife.x += knife.vx * 0.45;
    knife.y += knife.vy * 0.45;
    knife.angle += knife.spin * 0.45;
    knife.alpha *= 0.992;
    drawKnife(canvasContext, knife);
  });
}

function drawIdleOctopusOcclusion() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  octopusFrame += 1;
  setupOcclusionOctopi(width, height);
  drawOctopusBackground(canvasContext, width, height, 0.16, 0.2);

  const count = Math.max(1, occlusionOctopi.length);
  occlusionOctopi.forEach((octopus) => {
    octopus.x += Math.sin(octopusFrame * 0.014 + octopus.phase) * 0.18;
    octopus.y += Math.cos(octopusFrame * 0.013 + octopus.phase) * 0.14;
  });

  [...occlusionOctopi]
    .sort((a, b) => a.y - b.y)
    .forEach((octopus) => {
      const band = octopusBand(octopus.index, count, 128);
      drawOcclusionOctopus(canvasContext, octopus, count, 0.14 + (octopus.index % 4) * 0.035, band);
    });
}

function drawIdleLizardLouche() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  lizardFrame += 1;
  setupLoucheLizards(width, height);
  drawLizardClub(canvasContext, width, height, 0.18, 0.22);

  loucheLizards.forEach((lizard) => {
    drawZootLizard(canvasContext, lizard, loucheLizards.length, 0.16 + (lizard.bandIndex % 4) * 0.04, width, height);
  });
}

function drawIdleGoddessKisses() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const rate = fireworkSpeedMultiplier();
  const pulse = 0.5 + Math.sin(goddessFrame * 0.04) * 0.5;
  const shimmer = 0.5 + Math.sin(goddessFrame * 0.073 + 0.8) * 0.5;

  goddessFrame += rate;
  drawGoddessChamber(canvasContext, width, height, 0.16 + pulse * 0.16, 0.18 + shimmer * 0.18);
  drawGoddessFigure(canvasContext, width, height, 0.16 + pulse * 0.16, 0.16 + shimmer * 0.18, 0.18 + (1 - pulse) * 0.18);

  if (goddessKisses.length < 14 || Math.floor(goddessFrame) % Math.max(5, Math.round(18 / rate)) === 0) {
    spawnGoddessKiss(goddessKisses.length % goddessBands.length, 0.18 + pulse * 0.18, width, height);
  }

  goddessKisses = goddessKisses.filter((kiss) => kiss.life > 0.02 && kiss.z < 1.08);
  goddessKisses.forEach((kiss) => {
    kiss.z += kiss.vz * 0.75;
    kiss.x += kiss.vx * (0.5 + kiss.z);
    kiss.y += kiss.vy * 0.55;
    kiss.angle += kiss.spin;
    kiss.life -= 0.0025;
    drawKissGlyph(canvasContext, kiss, 0.16 + pulse * 0.16, 0.18 + shimmer * 0.18);
  });

  if (visualizerSelect.value === "goddesskisses" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleClimbingGarden() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  gardenFrame += fireworkSpeedMultiplier();
  setupGardenVines(width, height);
  drawGardenBackground(canvasContext, width, height, 0.18, 0.22);

  gardenVines.forEach((vine) => {
    const pulse = 0.5 + Math.sin(gardenFrame * 0.025 + vine.phase) * 0.5;
    vine.growth += (0.34 + pulse * 0.26 - vine.growth) * 0.035;
    vine.bloom += (0.22 + pulse * 0.18 - vine.bloom) * 0.035;
    drawGardenVine(canvasContext, vine, 0.16 + pulse * 0.18, 0.18, 0.22 + pulse * 0.12, width, height);
  });

  if (visualizerSelect.value === "climbinggarden" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleTipusTiger() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(tigerFrame * 0.045) * 0.5;
  const bite = 0.2 + Math.max(0, Math.sin(tigerFrame * 0.09)) * 0.28;
  const claw = 0.18 + Math.max(0, Math.sin(tigerFrame * 0.11 + 1.4)) * 0.28;
  const roar = Math.max(0, (tigerRoarUntil - performance.now()) / 900);

  tigerFrame += fireworkSpeedMultiplier();
  drawTipusTigerScene(canvasContext, width, height, 0.2 + pulse * 0.22, bite, claw, 0.18 + pulse * 0.22, 0.18 + roar * 0.36);

  if (visualizerSelect.value === "tipustiger" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleMandelbrot() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(mandelbrotFrame * 0.032) * 0.5;
  const shimmer = 0.5 + Math.sin(mandelbrotFrame * 0.051 + 1.7) * 0.5;

  mandelbrotFrame += fireworkSpeedMultiplier() * 0.68;
  drawMandelbrotScene(canvasContext, width, height, 0.14 + pulse * 0.2, 0.12 + shimmer * 0.2, 0.18 + (1 - pulse) * 0.22);

  if (visualizerSelect.value === "mandelbrot" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleEyeVisions() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(eyeFrame * 0.043) * 0.5;
  const shimmer = 0.5 + Math.sin(eyeFrame * 0.061 + 1.4) * 0.5;

  eyeFrame += fireworkSpeedMultiplier() * 0.85;
  drawEyeVisionsScene(canvasContext, width, height, 0.14 + pulse * 0.22, 0.16 + shimmer * 0.24, 0.18 + (1 - pulse) * 0.26);

  if (visualizerSelect.value === "eyevisions" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleAsteroids() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(asteroidFrame * 0.037) * 0.5;
  const shimmer = 0.5 + Math.sin(asteroidFrame * 0.063 + 1.3) * 0.5;
  const bandIntensities = fireworksBands.map((band, index) => 0.1 + pulse * 0.12 + (index % 2) * shimmer * 0.07);

  updateAsteroidsScene(canvasContext, width, height, 0.12 + pulse * 0.16, 0.12 + shimmer * 0.14, 0.13 + (1 - pulse) * 0.2, bandIntensities);

  if (visualizerSelect.value === "asteroids" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleInterzoneOracles() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(interzoneFrame * 0.04) * 0.5;
  const tremor = 0.5 + Math.sin(interzoneFrame * 0.071 + 1.8) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.14 + pulse * 0.18 + (index % 2) * tremor * 0.1);
  drawInterzoneScene(canvasContext, width, height, 0.14 + pulse * 0.18, 0.13 + tremor * 0.15, 0.16 + (1 - pulse) * 0.2, intensities);

  if (visualizerSelect.value === "interzoneoracles" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleSunflowerSmiles() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const sway = 0.5 + Math.sin(sunflowerFrame * 0.036) * 0.5;
  const sparkle = 0.5 + Math.sin(sunflowerFrame * 0.064 + 1.5) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.16 + sway * 0.2 + (index % 2) * sparkle * 0.1);
  drawSunflowerScene(canvasContext, width, height, 0.12 + sway * 0.18, 0.13 + sway * 0.12, 0.16 + sparkle * 0.22, intensities);

  if (visualizerSelect.value === "sunflowersmiles" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleWarOfRoses() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(roseFrame * 0.035) * 0.5;
  const shimmer = 0.5 + Math.sin(roseFrame * 0.061 + 1.2) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.12 + pulse * 0.18 + (index % 2) * shimmer * 0.09);
  drawWarOfRosesScene(canvasContext, width, height, 0.12 + pulse * 0.16, 0.12 + shimmer * 0.16, 0.13 + (1 - pulse) * 0.18, intensities);

  if (visualizerSelect.value === "warofroses" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleTurtleRiver() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(turtleFrame * 0.036) * 0.5;
  const glint = 0.5 + Math.sin(turtleFrame * 0.065 + 1.1) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.12 + pulse * 0.16 + (index % 2) * glint * 0.1);
  drawTurtleRiverScene(canvasContext, width, height, 0.12 + pulse * 0.18, 0.12 + glint * 0.14, 0.14 + (1 - pulse) * 0.18, intensities);

  if (visualizerSelect.value === "turtleriver" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleCathedralOrganism() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(cathedralFrame * 0.035) * 0.5;
  const shimmer = 0.5 + Math.sin(cathedralFrame * 0.061 + 0.8) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.18 + pulse * 0.18 + (index % 2) * shimmer * 0.12);
  drawCathedralOrganismScene(canvasContext, width, height, 0.16 + pulse * 0.2, 0.15 + shimmer * 0.16, 0.15 + (1 - pulse) * 0.2, intensities);

  if (visualizerSelect.value === "cathedralorganism" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleKaleidoscope() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(kaleidoscopeFrame * 0.045) * 0.5;
  const shimmer = 0.5 + Math.sin(kaleidoscopeFrame * 0.071 + 1.2) * 0.5;
  const intensities = fireworksBands.map((band, index) => (
    0.12 + pulse * 0.18 + shimmer * 0.1 + (index % 3) * 0.035
  ));

  drawKaleidoscopeScene(
    canvasContext,
    width,
    height,
    0.14 + pulse * 0.22,
    0.12 + shimmer * 0.2,
    0.16 + (1 - pulse) * 0.26,
    intensities,
  );

  if (visualizerSelect.value === "kaleidoscope" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleBobRossGarden() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(bobGardenFrame * 0.04) * 0.5;
  const shimmer = 0.5 + Math.sin(bobGardenFrame * 0.063 + 1.8) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.12 + pulse * 0.16 + shimmer * 0.08 + (index % 4) * 0.025);

  drawBobRossGardenScene(
    canvasContext,
    width,
    height,
    0.14 + pulse * 0.2,
    0.12 + shimmer * 0.18,
    0.16 + (1 - pulse) * 0.2,
    intensities,
  );

  if (visualizerSelect.value === "bobrossgarden" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleOilSlide() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(oilSlideFrame * 0.003) * 0.5;
  const shimmer = 0.5 + Math.sin(oilSlideFrame * 0.004 + 1.2) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.14 + pulse * 0.12 + shimmer * 0.08 + (index % 3) * 0.03);

  drawOilSlideScene(
    canvasContext,
    width,
    height,
    0.14 + pulse * 0.14,
    0.14 + shimmer * 0.14,
    0.16 + (1 - pulse) * 0.18,
    intensities,
  );

  if (visualizerSelect.value === "oilslide" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleOysterPearls() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const tide = 0.5 + Math.sin(oysterFrame * 0.012) * 0.5;
  const shimmer = 0.5 + Math.sin(oysterFrame * 0.017 + 1.4) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.1 + tide * 0.1 + shimmer * 0.04 + (index % 3) * 0.025);

  drawOysterPearlsScene(
    canvasContext,
    width,
    height,
    0.12 + tide * 0.08,
    0.1 + shimmer * 0.08,
    0.12 + (1 - tide) * 0.08,
    intensities,
  );

  if (visualizerSelect.value === "oysterpearls" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleHypnoticFlight() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const pulse = 0.5 + Math.sin(hypnoticFrame * 0.04) * 0.5;
  const shimmer = 0.5 + Math.sin(hypnoticFrame * 0.067 + 1.4) * 0.5;
  const intensities = fireworksBands.map((band, index) => 0.18 + pulse * 0.17 + (index % 2) * shimmer * 0.13);
  drawHypnoticFlightScene(canvasContext, width, height, 0.14 + pulse * 0.22, 0.13 + shimmer * 0.18, 0.16 + (1 - pulse) * 0.22, intensities);

  if (visualizerSelect.value === "hypnoticflight" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleLightning() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const rate = fireworkSpeedMultiplier();
  const pulse = 0.5 + Math.sin(lightningFrame * 0.05) * 0.5;
  const shimmer = 0.5 + Math.sin(lightningFrame * 0.071 + 1.2) * 0.5;
  const bandIntensities = fireworksBands.map((band, index) => 0.12 + pulse * 0.18 + (index % 2) * shimmer * 0.08);

  lightningFrame += rate;
  drawLightningScene(canvasContext, width, height, 0.14 + pulse * 0.18, 0.12 + shimmer * 0.22, 0.16 + (1 - pulse) * 0.22, bandIntensities);

  if (visualizerSelect.value === "lightning" && audio.paused) {
    animationId = requestAnimationFrame(() => {
      animationId = 0;
      if (audio.paused) {
        drawIdleVisualizer();
      }
    });
  }
}

function drawIdleEqualizer() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const barCount = 48;
  const barGap = 5;
  const barWidth = (width - (barCount - 1) * barGap) / barCount;
  const theme = visualizerTheme();

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#0b0d0f";
  canvasContext.fillRect(0, 0, width, height);

  for (let i = 0; i < barCount; i += 1) {
    const wave = Math.sin(i * 0.48) * 0.5 + 0.5;
    const barHeight = 14 + wave * height * 0.18;
    const x = i * (barWidth + barGap);
    const y = height - barHeight;
    canvasContext.fillStyle = theme.idle;
    canvasContext.fillRect(x, y, barWidth, barHeight);
  }
}

function drawIdleFireworks() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const palette = fireworkPalettes[themeSelect.value] || fireworkPalettes.mono;

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#050709";
  canvasContext.fillRect(0, 0, width, height);

  fireworksBands.forEach((band, index) => {
    const point = fireworkShapePoint(width, height);
    const x = point.x;
    const y = point.y;
    const radius = 22 + Math.sin(index * 1.7) * 6;
    const glow = canvasContext.createRadialGradient(x, y, 0, x, y, radius * 3.2);
    glow.addColorStop(0, hsla(palette[index % palette.length], 74, 58, 0.2));
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius * 3.2, 0, Math.PI * 2);
    canvasContext.fill();

    canvasContext.fillStyle = hsla(palette[index % palette.length], 74, 58, 0.34);
    canvasContext.beginPath();
    canvasContext.arc(x, y, 3 + index, 0, Math.PI * 2);
    canvasContext.fill();
  });

  for (let index = 0; index < 90; index += 1) {
    const point = fireworkShapePoint(width, height);
    canvasContext.fillStyle = hsla(palette[index % palette.length], 66, 62, 0.055);
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 1.4, 0, Math.PI * 2);
    canvasContext.fill();
  }
}

function resizeCanvas() {
  const ratio = canvasPixelRatio();
  const rect = visualizer.getBoundingClientRect();
  const isVisualFullscreen = document.querySelector(".player").classList.contains("visual-fullscreen");
  let cssWidth = isVisualFullscreen ? window.innerWidth : rect.width;
  let cssHeight = isVisualFullscreen ? window.innerHeight : rect.height;

  if (isAndroidCarMode && !isVisualFullscreen) {
    const deckHeight = document.querySelector(".car-deck")?.getBoundingClientRect().height || 0;
    const nowPlayingHeight = document.querySelector(".now-playing")?.getBoundingClientRect().height || 0;
    cssWidth = window.innerWidth;
    cssHeight = Math.max(120, window.innerHeight - deckHeight - nowPlayingHeight);
  }

  visualizer.width = Math.floor(cssWidth * ratio);
  visualizer.height = Math.floor(cssHeight * ratio);
  pacDancers = [];
  handForms = [];
  swampBubbles = [];
  arrows = [];
  arrowFires = [];
  arrowBursts = [];
  cephArms = [];
  cephInkBlooms = [];
  discoCouples = [];
  glitterParticles = [];
  butterflies = [];
  knifeTargets = [];
  thrownKnives = [];
  occlusionOctopi = [];
  loucheLizards = [];
  goddessKisses = [];
  gardenVines = [];
  tigerSpurts = [];
  asteroidShip = null;
  asteroidRocks = [];
  asteroidShots = [];
  asteroidSaucers = [];
  asteroidBursts = [];
  interzoneFigures = [];
  interzoneDrops = [];
  interzoneWisps = [];
  sunflowerFaces = [];
  sunflowerInsects = [];
  roseUnits = [];
  rosePetals = [];
  roseSlashes = [];
  pilotFish = null;
  riverFish = [];
  riverTurtles = [];
  riverRipples = [];
  cathedralFrame = 0;
  cathedralFigures = [];
  cathedralSparks = [];
  hypnoticFrame = 0;
  hypnoticFigures = [];
  hypnoticMonsters = [];
  hypnoticBlobs = [];
  kaleidoscopeFrame = 0;
  bobGardenFrame = 0;
  bobGardenBugs = [];
  oilSlideFrame = 0;
  oilBlobs = [];
  oysterFrame = 0;
  oysters = [];
  lingerieFrame = 0;
  lingerieGarments = [];
  snakeCongaFrame = 0;
  snakeCongas = [];
  snakeCongaCastoffs = [];

  if (!animationId) {
    drawIdleVisualizer();
  }
}

async function openLibraryPicker() {
  if (chooseAndroidFolder()) {
    return;
  }

  if ("showDirectoryPicker" in window) {
    const opened = await openRememberedDirectory({ prompt: true });
    if (opened) {
      scheduleSessionSave(120);
    }
  } else {
    folderInput.click();
  }
}

folderInput.closest("label").addEventListener("click", async (event) => {
  if (androidBridge || "showDirectoryPicker" in window) {
    event.preventDefault();
    await openLibraryPicker();
  }
});

window.waveDeckAndroidFolderSelected = () => {
  const loaded = loadAndroidBridgeLibrary();
  if (loaded) {
    scheduleSessionSave(120);
  }
};

window.waveDeckAndroidFolderCancelled = () => {
  if (tracks.length === 0) {
    directoryName.textContent = "Choose Downloads/TVR Playlist";
  }
};

folderInput.addEventListener("change", () => {
  const files = Array.from(folderInput.files || []);
  loadTrackFiles(
    files.map((file) => ({ file, relativePath: file.webkitRelativePath || file.name })),
    files[0]?.webkitRelativePath?.split("/")[0] || defaultDirectoryName,
    "picker",
  );
  scheduleSessionSave(120);
});

sortSelect.addEventListener("change", () => {
  const activeTrack = tracks[currentIndex];
  sortTracks();
  currentIndex = activeTrack ? tracks.findIndex((track) => track === activeTrack) : -1;
  renderTracks();
  scheduleSessionSave(120);
});

themeSelect.addEventListener("change", () => {
  if (!animationId) {
    drawIdleVisualizer();
  }
  scheduleSessionSave();
});

window.addEventListener("pointermove", (event) => {
  const bounds = visualizer.getBoundingClientRect();
  pulseFullscreenInfo();
  if (!bounds.width || !bounds.height) {
    return;
  }

  eyePointer.x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
  eyePointer.y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
  eyePointer.active = true;

  if (visualizerSelect.value === "eyevisions" && audio.paused && !animationId) {
    drawIdleVisualizer();
  }
});

window.addEventListener("pointerleave", () => {
  eyePointer.active = false;
});

visualizer.addEventListener("click", (event) => {
  if (visualizerSelect.value !== "lightning" || fireworkFormSelect.value !== "missilecommand") {
    return;
  }

  const bounds = visualizer.getBoundingClientRect();
  const x = (event.clientX - bounds.left) * (visualizer.width / bounds.width);
  const y = (event.clientY - bounds.top) * (visualizer.height / bounds.height);
  launchMissileCommandStrike(visualizer.width, visualizer.height, x, y);

  if (!animationId) {
    drawIdleVisualizer();
  }
});

peakToggle.addEventListener("change", () => {
  peakLevels = [];
  peakUpdatedAt = [];
  scheduleSessionSave();
});

smilesDial.addEventListener("click", () => {
  const nextLevel = (spectrumLevelIndex(spectrumPad.smilesDecadence) + 1) % smileDialLevels.length;
  setSpectrumDial("smiles", nextLevel);
});

insanityDial.addEventListener("click", () => {
  const nextLevel = (spectrumLevelIndex(spectrumPad.psychedeliaInsanity) + 1) % insanityDialLevels.length;
  setSpectrumDial("insanity", nextLevel);
});

visualizerSelect.addEventListener("change", () => {
  const config = visualizerConfig();

  visualizer.setAttribute("aria-label", config.ariaLabel);
  syncVisualizerControls();
  applyVisualizerDefaults(config);
  restartVisualizer();
  scheduleSessionSave();
});

fireworkFormSelect.addEventListener("change", () => {
  syncVisualizerControls();
  restartVisualizer();
  scheduleSessionSave();
});

eyeDischargeSelect.addEventListener("change", () => {
  if (!animationId) {
    drawIdleVisualizer();
  }
  scheduleSessionSave();
});

handSize.addEventListener("input", () => {
  updateHandControlLabels();
  if (visualizerSelect.value === "glitterfall") {
    glitterParticles = [];
    if (!animationId) {
      drawIdleVisualizer();
    }
  }
  scheduleSessionSave();
});

handCount.addEventListener("input", () => {
  updateHandControlLabels();
  handForms = [];
  cephArms = [];
  discoCouples = [];
  glitterParticles = [];
  butterflies = [];
  knifeTargets = [];
  thrownKnives = [];
  occlusionOctopi = [];
  loucheLizards = [];
  goddessKisses = [];
  gardenVines = [];
  tigerSpurts = [];
  lightningBolts = [];
  lightningImpacts = [];
  asteroidRocks = [];
  asteroidShots = [];
  asteroidSaucers = [];
  asteroidBursts = [];
  interzoneFigures = [];
  interzoneDrops = [];
  interzoneWisps = [];
  sunflowerFaces = [];
  sunflowerInsects = [];
  roseUnits = [];
  rosePetals = [];
  roseSlashes = [];
  pilotFish = null;
  riverFish = [];
  riverTurtles = [];
  riverRipples = [];
  cathedralFrame = 0;
  cathedralFigures = [];
  cathedralSparks = [];
  hypnoticFrame = 0;
  hypnoticFigures = [];
  hypnoticMonsters = [];
  hypnoticBlobs = [];
  kaleidoscopeFrame = 0;
  bobGardenFrame = 0;
  bobGardenBugs = [];
  oilSlideFrame = 0;
  oilBlobs = [];
  oysterFrame = 0;
  oysters = [];
  lingerieFrame = 0;
  lingerieGarments = [];
  snakeCongaFrame = 0;
  snakeCongas = [];
  snakeCongaCastoffs = [];
  if (!animationId) {
    drawIdleVisualizer();
  }
  scheduleSessionSave();
});

handGrasp.addEventListener("input", () => {
  updateHandControlLabels();
  scheduleSessionSave();
});

trackList.addEventListener("click", (event) => {
  const item = event.target.closest(".track-item");
  if (item) {
    loadTrack(Number(item.dataset.index));
  }
});

trackList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const item = event.target.closest(".track-item");
  if (item) {
    event.preventDefault();
    loadTrack(Number(item.dataset.index));
  }
});

function togglePlayPause() {
  if (!audio.paused) {
    pauseCurrent();
  } else {
    continuousPlaybackRequested = true;
    playLoadedTrackWithRetry();
  }
}

playButton.addEventListener("click", togglePlayPause);

stopButton.addEventListener("click", stopCurrent);
nextButton.addEventListener("click", () => loadTrack(nextIndex()));
previousButton.addEventListener("click", () => loadTrack(previousIndex()));
fullscreenButton.addEventListener("click", toggleVisualFullscreen);
carFolderButton.addEventListener("click", openLibraryPicker);
carFirstButton.addEventListener("click", () => loadTrackBoundary(0));
carPlayButton.addEventListener("click", togglePlayPause);
carPreviousButton.addEventListener("click", () => changeTrackByStep(-1));
carNextButton.addEventListener("click", () => changeTrackByStep(1));
carLastButton.addEventListener("click", () => loadTrackBoundary(tracks.length - 1));
carPrevVisualButton.addEventListener("click", () => changeVisualizerByStep(-1));
carNextVisualButton.addEventListener("click", () => changeVisualizerByStep(1));
carAlchemyButton.addEventListener("click", applyAlchemicalAdjustment);

shuffleToggle.addEventListener("change", () => scheduleSessionSave());
fireworkSpeed.addEventListener("input", () => {
  updateFireworkSpeedLabel();
  scheduleSessionSave();
});

audio.addEventListener("ended", () => {
  continueToNextTrack();
});
audio.addEventListener("pause", () => {
  if (playbackTransitioning || continuousPlaybackRequested) {
    scheduleSessionSave(120);
    return;
  }

  if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
    setStatus("paused");
  }
  scheduleSessionSave(120);
});
audio.addEventListener("timeupdate", () => {
  timeReadout.textContent = `${formatDuration(audio.currentTime)} / ${formatDuration(audio.duration)}`;
  const second = Math.floor(audio.currentTime || 0);
  if (Math.abs(second - lastPersistedSecond) >= 3) {
    lastPersistedSecond = second;
    scheduleSessionSave(900);
  }
});
audio.addEventListener("loadedmetadata", () => scheduleSessionSave(120));
audio.addEventListener("error", () => {
  const code = audio.error?.code ? ` ${audio.error.code}` : "";
  continuousPlaybackRequested = false;
  playbackTransitioning = false;
  setAndroidStatus(`Android: audio error${code}`);
});

window.addEventListener("resize", resizeCanvas);
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.querySelector(".player").classList.remove("visual-fullscreen");
    document.body.classList.remove("visual-stage");
  }
  setFullscreenLabel();
  scheduleCanvasResize();
});

function handleGlobalKey(event) {
  const player = document.querySelector(".player");
  const key = event.key || "";
  const code = event.code || "";
  const lowerKey = key.toLowerCase();
  const tagName = event.target.tagName.toLowerCase();
  const isEditingTarget = tagName === "input" || tagName === "select" || tagName === "textarea";

  if (key === "Escape" && player.classList.contains("visual-fullscreen") && !document.fullscreenElement) {
    event.preventDefault();
    exitVisualStage();
    return;
  }

  if (key === "F4" || code === "F4" || event.keyCode === 115 || lowerKey === "f") {
    event.preventDefault();
    event.stopPropagation();
    toggleVisualFullscreen();
    return;
  }

  if (lowerKey === "t") {
    event.preventDefault();
    roarTipusTiger();
    return;
  }

  if (!isEditingTarget && ["KeyA", "KeyD", "KeyW", "KeyS"].includes(code)) {
    event.preventDefault();
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    adjustSpectrumPad(code);
    if (!["turtleriver", "asteroids"].includes(visualizerSelect.value)) {
      return;
    }
  }

  if (visualizerSelect.value === "turtleriver" && ["KeyA", "KeyD", "KeyW", "KeyS"].includes(code)) {
    event.preventDefault();
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    asteroidKeys.add(code);
    if (!animationId) {
      drawIdleVisualizer();
    }
    return;
  }

  if (visualizerSelect.value === "asteroids" && ["KeyA", "KeyD", "KeyW", "KeyS", "Space"].includes(code)) {
    event.preventDefault();
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    asteroidKeys.add(code);
    if (code === "Space" && !event.repeat) {
      fireShipMissile();
    }
    if (!animationId) {
      drawIdleVisualizer();
    }
    return;
  }

  if (isEditingTarget) {
    return;
  }

  if (key === "ArrowRight") {
    event.preventDefault();
    changeTrackByStep(1);
    return;
  }

  if (key === "ArrowLeft") {
    event.preventDefault();
    changeTrackByStep(-1);
    return;
  }

  if (key === "ArrowUp") {
    event.preventDefault();
    changeVisualizerByStep(1);
    return;
  }

  if (key === "ArrowDown") {
    event.preventDefault();
    changeVisualizerByStep(-1);
    return;
  }

}

document.addEventListener("keydown", handleGlobalKey, true);
document.addEventListener("keyup", (event) => {
  asteroidKeys.delete(event.code);
  if (event.key === "F4" || event.code === "F4" || event.keyCode === 115) {
    handleGlobalKey(event);
  }
}, true);
window.addEventListener("blur", () => asteroidKeys.clear());
window.addEventListener("pagehide", saveSessionNow);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveSessionNow();
  }
});

restoredSession = loadSavedSession();
restoreControlPreferences(restoredSession);
resizeCanvas();
updateFireworkSpeedLabel();
updateHandControlLabels();
updateSpectrumDials();
syncVisualizerControls();
setFullscreenLabel();
setControlsEnabled(false);
setStatus("stopped");
directoryName.textContent = restoredSession?.directoryName || defaultDirectoryName;
loadPreferredLibrary();
