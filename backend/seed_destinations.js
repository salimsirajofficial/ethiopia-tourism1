require('dotenv').config();
const sequelize = require('./src/shared/db/sequelize');
const Destination = require('./src/modules/tourism/infrastructure/destination.model');

const destinations = [
  {
    title: "Lalibela",
    amharic: "ላሊበላ",
    code: "LAL",
    region: "ሰሜን · North",
    description: "Eleven 12th-century churches carved from living rock — a pilgrimage site and architectural wonder unlike anything on Earth.",
    tag: "UNESCO Heritage",
    color: "from-amber-900/80",
    bestTime: "Oct — Mar",
    duration: "2–3 Days",
    basePrice: 250,
    image: "/assets/images/ethiopia/image1.jpg"
  },
  {
    title: "Simien Mountains",
    amharic: "ስሜን ተራሮች",
    code: "SIM",
    region: "ሰሜን · North",
    description: "Dramatic escarpments, rare Gelada baboons, and sunrises above the clouds on the 'Roof of Africa'.",
    tag: "National Park",
    color: "from-emerald-900/80",
    bestTime: "Nov — Apr",
    duration: "3–5 Days",
    basePrice: 180,
    image: "/assets/images/ethiopia/image2.jpg"
  },
  {
    title: "Danakil Depression",
    amharic: "ዳናኪል",
    code: "DNK",
    region: "ምስራቅ · East",
    description: "The hottest inhabited place on Earth — neon sulfur fields, bubbling lava lakes, and surreal alien geology.",
    tag: "Extreme Nature",
    color: "from-orange-900/80",
    bestTime: "Nov — Feb",
    duration: "4–5 Days",
    basePrice: 450,
    image: "/assets/images/ethiopia/image3.jpg"
  },
  {
    title: "Gondar",
    amharic: "ጎንደር",
    code: "GDQ",
    region: "ሰሜን · North",
    description: "Medieval imperial castles, Fasilides's Bath, and the ornate Debre Berhan Selassie church with its angelic ceiling.",
    tag: "Imperial Heritage",
    color: "from-purple-900/80",
    bestTime: "Oct — Apr",
    duration: "1–2 Days",
    basePrice: 150,
    image: "/assets/images/ethiopia/image8.jpg"
  },
  {
    title: "Omo Valley",
    amharic: "ኦሞ ሸለቆ",
    code: "OMO",
    region: "ደቡብ · South",
    description: "The world's most extraordinary cultural mosaic — 16 unique tribes, each with distinct rituals, body art, and languages.",
    tag: "Cultural Tapestry",
    color: "from-red-900/80",
    bestTime: "Sep — Feb",
    duration: "5–7 Days",
    basePrice: 350,
    image: "/assets/images/ethiopia/image4.jpg"
  },
  {
    title: "Ancient Axum",
    amharic: "አክሱም",
    code: "AXM",
    region: "ሰሜን · North",
    description: "Giant granite stelae, claimed home of the Ark of the Covenant — the heartland of the Aksumite Empire.",
    tag: "Ancient Kingdom",
    color: "from-stone-900/80",
    bestTime: "Oct — Mar",
    duration: "1–2 Days",
    basePrice: 120,
    image: "/assets/images/ethiopia/Ancient-Axum.jpg"
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    
    for (let dest of destinations) {
      await Destination.upsert(dest);
    }
    
    console.log("Destinations seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding destinations:", error);
    process.exit(1);
  }
}

seed();
