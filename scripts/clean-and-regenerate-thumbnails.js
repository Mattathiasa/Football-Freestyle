import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current constants file
const constantsPath = path.join(__dirname, '../constants.tsx');
let constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Function to generate thumbnail URL from video URL
function generateThumbnailUrl(videoUrl) {
  if (!videoUrl.includes('cloudinary.com')) {
    return ''; // Return empty for non-Cloudinary URLs
  }
  
  // Extract the public ID from the video URL
  const match = videoUrl.match(/\/v\d+\/([^.]+)\./);
  if (!match) return '';
  
  const publicId = match[1];
  
  // Generate thumbnail URL with proper transformations
  return `https://res.cloudinary.com/dg1xa7q5c/video/upload/w_400,h_488,c_fill,g_auto,q_auto,f_auto,so_3.0/${publicId}.jpg`;
}

// Clean and updated highlights data
const cleanedHighlights = [
  {
    id: 'matty-featured',
    title: 'Covid + Pre Covid Videos',
    category: 'Full Video',
    tags: ['Precision', 'Flow', 'Elite', 'Featured'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036418/Matty_Final_pbj7kf.mp4',
    description: 'High-intensity training session showcasing precision and flow.',
    stats: { power: 88, speed: 82, control: 91 }
  },
  {
    id: 'matty-ecusta',
    title: 'Ecusta',
    category: 'Match',
    tags: ['Team Play', 'Collaboration', 'Tactical'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036426/Matty_14_spc8ax.mp4',
    description: 'Team tactical session with multiple players showcasing collaboration.',
    stats: { power: 90, speed: 88, control: 92 }
  },
  {
    id: 'matty-2021',
    title: '2021',
    category: 'Training',
    tags: ['Technical', 'Skill Development'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036440/Matty_2021_oswyaw.mp4',
    description: 'Technical skill development session.',
    stats: { power: 82, speed: 85, control: 94 }
  },
  {
    id: 'matty-au-2018',
    title: 'AU 2018',
    category: 'Training',
    tags: ['Solo', 'Fundamentals', 'Endurance'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036383/Matty_6_xtqijx.mp4',
    description: 'Solo training session focusing on fundamentals.',
    stats: { power: 85, speed: 82, control: 88 }
  },
  {
    id: 'matty-basketball-team',
    title: 'Basketball shot with Uchi, Naty and MK',
    category: 'Recap',
    tags: ['Full Session', 'Complete', 'Mastery'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036296/Matty_39..._With_Uchi_Naty_And_Mk_dyod7l.mp4',
    description: 'Complete session showcasing technical mastery.',
    stats: { power: 88, speed: 90, control: 95 }
  },
  {
    id: 'matty-experiment-47',
    title: 'Experiment',
    category: 'Skills',
    tags: ['Advanced', 'Protocol', 'Elite'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036349/Matty_47_ul0bbf.mp4',
    description: 'Advanced skill protocol demonstration.',
    stats: { power: 86, speed: 92, control: 96 }
  },
  {
    id: 'matty-experiment-solo-iec',
    title: 'Experiment Solo IEC',
    category: 'Training',
    tags: ['Movement', 'Analysis', 'Agility'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036245/Matty_44_k5u1oe.mp4',
    description: 'Movement analysis and agility training.',
    stats: { power: 80, speed: 95, control: 85 }
  },
  {
    id: 'matty-experiment-solo-ecusta',
    title: 'Experiment Solo Ecusta',
    category: 'Skills',
    tags: ['Skill', 'Technique', 'Flow'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036243/Matty_34_jqvmt0.mp4',
    description: 'Technical skill session with flow emphasis.',
    stats: { power: 78, speed: 88, control: 93 }
  },
  {
    id: 'matty-iec-experiment',
    title: 'IEC Experiment',
    category: 'Training',
    tags: ['Core', 'Mechanics', 'Foundation'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036235/Matty_42_Full_Version_tsuxb9.mp4',
    description: 'Core mechanics and foundation training.',
    stats: { power: 84, speed: 80, control: 90 }
  },
  {
    id: 'matty-basketball-shots-iec',
    title: 'Basketball shots IEC',
    category: 'Skills',
    tags: ['POV', 'Tactical', 'Vision'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036218/Matty_29_xyy9f4.mp4',
    description: 'POV perspective tactical demonstration.',
    stats: { power: 75, speed: 85, control: 98 }
  },
  {
    id: 'matty-around-world-basketball',
    title: 'Around the world Basketball IEC',
    category: 'Skills',
    tags: ['Elite', 'Protocol', 'Advanced'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036217/Matty_33_zbjvsn.mp4',
    description: 'Elite protocol with advanced techniques.',
    stats: { power: 82, speed: 90, control: 96 }
  },
  {
    id: 'matty-basketball-rain',
    title: 'Basketball shots Rain',
    category: 'Training',
    tags: ['Rain', 'Weather', 'Grit', 'Determination'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036204/Matty_28_mlujcm.mp4',
    description: 'Training session in challenging rain conditions.',
    stats: { power: 88, speed: 82, control: 94 }
  },
  {
    id: 'matty-experiment-iec-13',
    title: 'Experiment IEC',
    category: 'Skills',
    tags: ['Peak', 'Performance', 'Elite'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036175/Matty_13_koin39.mp4',
    description: 'Peak performance demonstration.',
    stats: { power: 92, speed: 94, control: 90 }
  },
  {
    id: 'matty-experiment-iec-25',
    title: 'Experiment IEC',
    category: 'Skills',
    tags: ['POV', 'Tactical', 'First Person'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036175/Matty_25_th1k3l.mp4',
    description: 'First-person tactical perspective.',
    stats: { power: 76, speed: 88, control: 97 }
  },
  {
    id: 'matty-skills-match',
    title: 'Skills Match',
    category: 'Recap',
    tags: ['Ultimate', 'Milestone', 'Achievement'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036168/Matty_2_xtmpuq.mp4',
    description: 'Ultimate milestone session - 50th video achievement.',
    stats: { power: 95, speed: 95, control: 95 }
  },
  {
    id: 'matty-experiment-inshot',
    title: 'Experiment',
    category: 'Training',
    tags: ['Technical', 'Drill', 'Precision'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036141/Inshot_20240316_100322674_fa8yrz.mp4',
    description: 'Technical drill focusing on precision.',
    stats: { power: 80, speed: 84, control: 92 }
  },
  {
    id: 'matty-lomi-battle-2',
    title: 'Lomi Battle 2',
    category: '1v1',
    tags: ['1v1', 'Battle', 'Lomi', 'Skill'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036135/Inshot_20250214_190750437_zcndol.mp4',
    description: 'Second battle session with Lomi.',
    stats: { power: 85, speed: 96, control: 94 }
  },
  {
    id: 'matty-basketball-solo',
    title: 'Basketball Solo',
    category: 'Training',
    tags: ['Solo', 'Training', 'Development'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036131/Matty_Basketball_jnypru.mp4',
    description: 'Solo training and skill development.',
    stats: { power: 78, speed: 86, control: 89 }
  },
  {
    id: 'matty-skills-iec-46',
    title: 'Skills IEC',
    category: 'Skills',
    tags: ['Solo', 'First Touch', 'Control'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036074/Matty_46_n5b2tc.mp4',
    description: 'Solo session emphasizing first touch and control.',
    stats: { power: 75, speed: 88, control: 96 }
  },
  {
    id: 'matty-ping-pong-ecusta',
    title: 'Ping-Pong Ecusta',
    category: 'Skills',
    tags: ['Creative', 'Play', 'Vision'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036071/Matty_45_bqvv61.mp4',
    description: 'Creative play with vision and touch.',
    stats: { power: 72, speed: 90, control: 95 }
  },
  {
    id: 'matty-basketball-shots-43',
    title: 'Basketball shots IEC',
    category: 'Training',
    tags: ['Technical', 'Drill', 'Repetition'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036059/Matty_43_cnhwis.mp4',
    description: 'Technical drill with repetition focus.',
    stats: { power: 83, speed: 85, control: 91 }
  },
  {
    id: 'matty-solo-skills-iec-38',
    title: 'Solo Skills IEC',
    category: 'Skills',
    tags: ['Advanced', 'Skills', 'Flair'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036046/Matty_38_ds6hjc.mp4',
    description: 'Advanced skills with creative flair.',
    stats: { power: 74, speed: 89, control: 97 }
  },
  {
    id: 'matty-basketball-shots-42',
    title: 'Basketball shots IEC',
    category: 'Training',
    tags: ['Drill', 'Execution', 'Precision'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770036039/Matty_42_nammk5.mp4',
    description: 'Precise drill execution demonstration.',
    stats: { power: 87, speed: 83, control: 92 }
  },
  {
    id: 'matty-lomi-final',
    title: 'Lomi Final',
    category: 'Recap',
    tags: ['Final', 'Protocol', 'Mastery'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035982/Matty_40_Lomi_2%EF%B8%8F%E2%83%A3_hercnj.mp4',
    description: 'Final protocol showcasing complete mastery.',
    stats: { power: 94, speed: 94, control: 94 }
  },
  {
    id: 'matty-rain-iec',
    title: 'Rain IEC',
    category: '1v1',
    tags: ['1v1', 'Lomi', 'Battle', 'Skill'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035979/Matty_36_Rain_%EF%B8%8F_%EF%B8%8F_v6jmok.mp4',
    description: 'Intense 1v1 battle with Lomi showcasing skill moves.',
    stats: { power: 79, speed: 96, control: 95 }
  },
  {
    id: 'matty-basketball-burst-32',
    title: 'Basketball Burst',
    category: 'Skills',
    tags: ['Technical', 'Burst', 'Explosive'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035942/Matty_32_uxnef4.mp4',
    description: 'Explosive technical burst demonstration.',
    stats: { power: 86, speed: 97, control: 93 }
  },
  {
    id: 'matty-experiment-iec-35',
    title: 'Experiment IEC',
    category: 'Skills',
    tags: ['Skill', 'Session', 'Ball Mastery'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035923/Matty_35_va0ayn.mp4',
    description: 'Skill session focusing on ball mastery.',
    stats: { power: 73, speed: 92, control: 96 }
  },
  {
    id: 'matty-experiment-iec-3',
    title: 'Experiment IEC',
    category: 'Pingball',
    tags: ['Precision', 'Unit', 'Target'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035868/Matty_3_iolij4.mp4',
    description: 'Precision targeting and execution unit.',
    stats: { power: 96, speed: 81, control: 94 }
  },
  {
    id: 'matty-basketball-baseball-31',
    title: 'Basketball Baseball',
    category: 'Skills',
    tags: ['Technical', 'Burst', 'Explosive'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035864/Matty_31_2%EF%B8%8F%E2%83%A3_nh4wad.mp4',
    description: 'Explosive technical burst demonstration.',
    stats: { power: 86, speed: 97, control: 93 }
  },
  {
    id: 'matty-basketball-tries-27',
    title: 'Basketball Tries IEC',
    category: 'Skills',
    tags: ['Skill', 'Session', 'Ball Mastery'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035846/Matty_27_igrazc.mp4',
    description: 'Skill session focusing on ball mastery.',
    stats: { power: 73, speed: 92, control: 96 }
  },
  {
    id: 'matty-lomi-iec-22',
    title: 'Lomi IEC',
    category: '1v1',
    tags: ['Precision', '1v1', 'Battle'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035798/Matty_22_Lomi_arkf2f.mp4',
    description: 'Precision 1v1 battle with Lomi.',
    stats: { power: 96, speed: 81, control: 94 }
  },
  {
    id: 'matty-experiment-ecusta-23',
    title: 'Experiment ECUSTA',
    category: 'Training',
    tags: ['Precision', 'Technical', 'Flow'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035791/Matty_23_wbonnq.mp4',
    description: 'Technical flow session at Ecusta.',
    stats: { power: 85, speed: 88, control: 92 }
  },
  {
    id: 'matty-experiment-entoto-21',
    title: 'Experiment Entoto',
    category: 'Training',
    tags: ['Location', 'Outdoor', 'Natural'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035788/Matty_21_d4rdfi.mp4',
    description: 'Outdoor training session at Entoto.',
    stats: { power: 82, speed: 85, control: 89 }
  },
  {
    id: 'matty-experiment-baseball-26',
    title: 'Experiment Baseball IEC',
    category: 'Training',
    tags: ['Cross-training', 'Baseball', 'Coordination'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035786/Matty_26_cm5dmb.mp4',
    description: 'Cross-training with baseball elements.',
    stats: { power: 88, speed: 83, control: 87 }
  },
  {
    id: 'matty-experiment-ecusta-24',
    title: 'Experiment Ecusta',
    category: 'Training',
    tags: ['Technical', 'Drill', 'Consistency'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035764/Matty_24_igfndn.mp4',
    description: 'Consistent technical drill work.',
    stats: { power: 84, speed: 86, control: 91 }
  },
  {
    id: 'matty-ping-pong-ecusta-20',
    title: 'Ping-Pong Ecusta',
    category: 'Skills',
    tags: ['Creative', 'Touch', 'Finesse'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035742/Matty_20_fvqvra.mp4',
    description: 'Creative touch and finesse work.',
    stats: { power: 70, speed: 92, control: 98 }
  },
  {
    id: 'matty-basketball-shots-19',
    title: 'Basketball shots IEC',
    category: 'Training',
    tags: ['Shooting', 'Accuracy', 'Repetition'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035690/Matty_19_qhhzjk.mp4',
    description: 'Shooting accuracy and repetition training.',
    stats: { power: 89, speed: 78, control: 93 }
  },
  {
    id: 'matty-experiment-iec-17',
    title: 'Experiment IEC',
    category: 'Skills',
    tags: ['Innovation', 'Technique', 'Development'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035680/Matty_17_orpcry.mp4',
    description: 'Innovative technique development.',
    stats: { power: 76, speed: 91, control: 95 }
  },
  {
    id: 'matty-experiment-home-16',
    title: 'Experiment Home',
    category: 'Training',
    tags: ['Home', 'Solo', 'Practice'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035653/Matty_16_zsw0mo.mp4',
    description: 'Home-based solo practice session.',
    stats: { power: 75, speed: 84, control: 90 }
  },
  {
    id: 'matty-skills-iec-11',
    title: 'Skills IEC',
    category: 'Skills',
    tags: ['Technical', 'Skills', 'Mastery'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035651/Matty_11_jvobgs.mp4',
    description: 'Technical skills mastery session.',
    stats: { power: 81, speed: 89, control: 94 }
  },
  {
    id: 'matty-experiment-ecusta-15',
    title: 'Experiment Ecusta',
    category: 'Training',
    tags: ['Experimental', 'Innovation', 'Testing'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035645/Matty_15_qpmjwy.mp4',
    description: 'Experimental training and innovation testing.',
    stats: { power: 78, speed: 87, control: 92 }
  },
  {
    id: 'matty-skills-iec-10',
    title: 'Skills IEC',
    category: 'Skills',
    tags: ['Foundation', 'Building', 'Core'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035628/Matty_10_ep8epn.mp4',
    description: 'Foundation building and core skills.',
    stats: { power: 77, speed: 85, control: 91 }
  },
  {
    id: 'matty-basketball-shots-12',
    title: 'Basketball shots IEC',
    category: 'Training',
    tags: ['Shooting', 'Form', 'Technique'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035626/Matty_12_xvafbd.mp4',
    description: 'Shooting form and technique work.',
    stats: { power: 86, speed: 80, control: 88 }
  },
  {
    id: 'matty-first-video',
    title: 'First Video Ever',
    category: 'Milestone',
    tags: ['First', 'Beginning', 'Journey'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035616/Matty_1_q2bzia.mp4',
    description: 'The very first video - beginning of the journey.',
    stats: { power: 65, speed: 70, control: 75 }
  },
  {
    id: 'matty-2024-recap',
    title: '2024 Recap',
    category: 'Recap',
    tags: ['Year', 'Summary', 'Progress'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035610/Inshot_20241231_211644228_ihcy0v.mp4',
    description: 'Complete 2024 year summary and progress.',
    stats: { power: 90, speed: 88, control: 93 }
  },
  {
    id: 'matty-skills-basketball-combo',
    title: 'Skills and Basketball IEC',
    category: 'Training',
    tags: ['Combination', 'Multi-sport', 'Versatility'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035580/Inshot_20250410_092047074_tgvsk4.mp4',
    description: 'Multi-sport combination training showing versatility.',
    stats: { power: 85, speed: 87, control: 90 }
  },
  {
    id: 'matty-basketball-shots-april',
    title: 'Basketball shots April',
    category: 'Training',
    tags: ['Monthly', 'Progress', 'Consistency'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035575/Inshot_20250430_202849160_beg1h7.mp4',
    description: 'April monthly progress and consistency work.',
    stats: { power: 83, speed: 82, control: 89 }
  },
  {
    id: 'matty-basketball-june',
    title: 'Basketball June',
    category: 'Training',
    tags: ['Summer', 'Heat', 'Endurance'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035528/Inshot_20240620_121858581_ub8hdq.mp4',
    description: 'Summer training with focus on endurance.',
    stats: { power: 87, speed: 85, control: 91 }
  },
  {
    id: 'matty-basketball-special',
    title: 'Basketball Special',
    category: 'Training',
    tags: ['Special', 'Unique', 'Showcase'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035502/Vid_299440917_181029_538_oaps4o.mp4',
    description: 'Special showcase session with unique elements.',
    stats: { power: 88, speed: 86, control: 92 }
  },
  {
    id: 'matty-50th-milestone',
    title: '50th Video Milestone',
    category: 'Milestone',
    tags: ['Milestone', '50th', 'Achievement'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035496/Matty_50_vtzns1.mp4',
    description: '50th video milestone achievement.',
    stats: { power: 95, speed: 95, control: 95 }
  },
  {
    id: 'matty-experiment-babogaya',
    title: 'Experiment Babogaya',
    category: 'Training',
    tags: ['Location', 'Outdoor', 'Adventure'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035444/Matty_7_avvhlq.mp4',
    description: 'Outdoor adventure training at Babogaya.',
    stats: { power: 80, speed: 88, control: 85 }
  },
  {
    id: 'matty-target-shot-alew',
    title: 'Target Shot with Alew',
    category: 'Training',
    tags: ['Partner', 'Accuracy', 'Teamwork'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035425/Matty_8_With_Alew_kdmg1c.mp4',
    description: 'Partner training focusing on accuracy and teamwork.',
    stats: { power: 84, speed: 82, control: 93 }
  },
  {
    id: 'matty-experiment-iec-49',
    title: 'Experiment IEC Advanced',
    category: 'Skills',
    tags: ['Advanced', 'Elite', 'Mastery'],
    videoUrl: 'https://res.cloudinary.com/dg1xa7q5c/video/upload/v1770035418/Matty_49_hknf6z.mp4',
    description: 'Advanced elite mastery demonstration.',
    stats: { power: 92, speed: 94, control: 97 }
  }
];

// Generate new constants content with cleaned data and auto-generated thumbnails
const newHighlights = cleanedHighlights.map(highlight => ({
  ...highlight,
  thumbnail: generateThumbnailUrl(highlight.videoUrl)
}));

// Create the new constants content
const newConstantsContent = `import { Highlight } from './types';

export const PLAYER_NAME = "Mattathias Abraham";
export const PLAYER_TITLE = "Football Creator & Skill Enthusiast";
export const PLAYER_TAGLINE = "Built on faith. Driven by football.";

export const MILESTONES = {
  hoursTrained: "2,400+",
  skillsMastered: "42",
  clipsShared: "150+",
  passionLevel: "100%"
};

/**
 * HIGHLIGHTS ARCHIVE
 * Using Cloudinary for optimized video streaming
 * Thumbnails auto-generated from video URLs
 */
export const HIGHLIGHTS: Highlight[] = ${JSON.stringify(newHighlights, null, 2)};
`;

// Write the updated constants file
fs.writeFileSync(constantsPath, newConstantsContent);

console.log('✅ Constants file updated successfully!');
console.log(`📊 Processed ${newHighlights.length} videos`);
console.log(`🖼️ Generated ${newHighlights.filter(h => h.thumbnail).length} thumbnails`);
console.log('🧹 Removed duplicates and cleaned data structure');