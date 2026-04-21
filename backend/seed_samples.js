require('dotenv').config();
const sequelize = require('./src/shared/db/sequelize');
const Destination = require('./src/modules/tourism/infrastructure/destination.model');
const Tour = require('./src/modules/tourism/infrastructure/tour.model');

const videos = [
  "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563937/video1_eyig4b.mp4",
  "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563974/video2_bq3cmy.mp4",
  "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563697/Video3_qlpsq0.mp4",
  "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563714/video4_jsshq5.mp4",
  "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563698/video2_yydrhx.mp4",
  "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563696/video1_gdhwzk.mp4",
  "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563695/video3_mf2imu.mp4"
];

const images = [
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776565260/image1_suayaj.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776565263/image2_qdrswe.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776565265/image3_zbzf72.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776567601/image4_ntbw79.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776567609/image5_daqonn.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776567610/image6_hqs9f9.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776567613/image8_yw0x3d.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776565259/Ancient_harar_qddrc2.jpg",
  "https://res.cloudinary.com/dywydpgjg/image/upload/v1776565259/Ancient-Axum_lhdgau.jpg"
];

const sampleDestinations = [
  {
    title: "Lalibela",
    amharic: "ላሊበላ",
    code: "LAL-PREM",
    region: "Amhara Region",
    description: "The New Jerusalem. Home to the legendary rock-hewn churches carved from living basalt.",
    image: images[0],
    video_url: videos[0],
    tag: "UNESCO Site",
    color: "from-amber-900/80",
    bestTime: "Oct — Mar",
    duration: "3 Days",
    basePrice: 450
  },
  {
    title: "Simien Mountains",
    amharic: "ስሜን ተራሮች",
    code: "SIM-PREM",
    region: "North Gondar",
    description: "Trek the roof of Africa. Dramatic escarpments and unique wildlife in a cinematic landscape.",
    image: images[1],
    video_url: videos[1],
    tag: "National Park",
    color: "from-emerald-900/80",
    bestTime: "Nov — Apr",
    duration: "5 Days",
    basePrice: 600
  }
];

const sampleTours = [
  {
    title: "The Grand Northern Circuit",
    subtitle: "Absolute Cinematic Journey",
    description: "A comprehensive expedition covering the historical heartland of Ethiopia. Experience high-definition history.",
    highlight: "Cinematic views of Lalibela and Axum",
    duration: "10 Days",
    groupSize: "4–8 People",
    location: "Northern Ethiopia",
    basePrice: 1800,
    difficulty: "Moderate",
    tags: ["History", "Culture", "Premium"],
    image: images[2],
    video_url: videos[0],
    itinerary: [
      { day: 1, title: "Arrival in Addis", description: "City tour and briefing." },
      { day: 2, title: "Flight to Lalibela", description: "Exploring the first group of churches." },
      { day: 3, title: "Lalibela Depth", description: "The second group and evening ceremony." }
    ]
  },
  {
    title: "Omo Valley Cultural Odyssey",
    subtitle: "Living Heritage",
    description: "Documentary-style exploration of the Omo Valley tribes. Remote, raw, and visually stunning.",
    highlight: "Authentic tribal encounters in 4K clarity",
    duration: "7 Days",
    groupSize: "2–6 People",
    location: "South Ethiopia",
    basePrice: 2200,
    difficulty: "Moderate",
    tags: ["Tribal", "Culture", "Photography"],
    image: images[3],
    video_url: videos[2],
    itinerary: [
      { day: 1, title: "Jinka Arrival", description: "Introduction to the Ari tribe." },
      { day: 2, title: "Mursi People", description: "Deep in the Mago National Park." }
    ]
  },
  {
    title: "Danakil Extreme Expedition",
    subtitle: "The Alien Landscape",
    description: "Venture to the hottest place on Earth. Bubbling lava lakes and sulfur fields that look like another planet.",
    highlight: "Erta Ale lava lake at night",
    duration: "4 Days",
    groupSize: "Small Groups Only",
    location: "Afar Region",
    basePrice: 1500,
    difficulty: "Challenging",
    tags: ["Extreme", "Nature", "Cinematic"],
    image: images[4],
    video_url: videos[3],
    itinerary: [
      { day: 1, title: "Dallol Sulfur Fields", description: "The yellow and green neon pools." },
      { day: 2, title: "Erta Ale Ascent", description: "Camping on the rim of the volcano." }
    ]
  },
  {
    title: "Axum: The Ark of History",
    subtitle: "Ancient Kingdoms",
    description: "Explore the ancient stelae and the home of the Ark of the Covenant.",
    highlight: "Giant Obelisks",
    duration: "3 Days",
    groupSize: "Flexible",
    location: "Tigray",
    basePrice: 800,
    difficulty: "Easy",
    tags: ["Ancient", "Religious"],
    image: images[8],
    video_url: videos[4],
    itinerary: [{ day: 1, title: "Stelae Park", description: "Ancient monuments." }]
  },
  {
    title: "Blue Nile & Lake Tana",
    subtitle: "The Source",
    description: "Journey to the spectacular Tis Isat Falls and the island monasteries of Lake Tana.",
    highlight: "Blue Nile Falls",
    duration: "3 Days",
    groupSize: "Flexible",
    location: "Bahir Dar",
    basePrice: 700,
    difficulty: "Easy",
    tags: ["Waterfalls", "Relaxation"],
    image: images[5],
    video_url: videos[5],
    itinerary: [{ day: 1, title: "Falls Trek", description: "Hiking to the viewpoint." }]
  },
  {
    title: "Harar: The Forbidden City",
    subtitle: "East African Soul",
    description: "The walled city of 99 mosques. Hyena feeding rituals and colorful markets.",
    highlight: "Feeding Hyenas",
    duration: "3 Days",
    groupSize: "2–10 People",
    location: "Harar",
    basePrice: 900,
    difficulty: "Easy",
    tags: ["City", "Unique"],
    image: images[7],
    video_url: videos[6],
    itinerary: [{ day: 1, title: "Old Town Walk", description: "The 82 mosques of Harar." }]
  }
];

async function seedSamples() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for sampling.');

    // Seed Premium Destinations
    for (const dest of sampleDestinations) {
      await Destination.upsert(dest);
      console.log(`Seeded Destination: ${dest.title}`);
    }

    // Seed Premium Tours
    for (const tour of sampleTours) {
      // Find or create based on title
      const [existing] = await Tour.findOrCreate({
        where: { title: tour.title },
        defaults: tour
      });
      if (existing) {
        await existing.update(tour);
      }
      console.log(`Seeded Tour: ${tour.title}`);
    }

    console.log('Sample media data seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed samples:', error);
    process.exit(1);
  }
}

seedSamples();
