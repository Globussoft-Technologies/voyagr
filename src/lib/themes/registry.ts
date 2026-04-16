export type ThemeConfig = {
  key: string;
  name: string;
  description: string;
  thumbnail: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: string;
  features: string[];
};

export const themes: Record<string, ThemeConfig> = {
  // ============================================================
  // 1. LUXURY TRAVEL (5)
  // ============================================================
  "modern-luxury": {
    key: "modern-luxury",
    name: "Modern Luxury",
    description: "Sleek, contemporary luxury travel with refined aesthetics",
    thumbnail: "",
    colors: {
      primary: "#1a1a2e",
      secondary: "#c9a84c",
      accent: "#e8d5a3",
      background: "#faf8f5",
      text: "#1a1a2e",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Inter, sans-serif",
    },
    layout: "luxury",
    features: ["Luxury accommodations", "VIP concierge", "Private transfers", "Fine dining"],
  },
  "classic-elegance": {
    key: "classic-elegance",
    name: "Classic Elegance",
    description: "Timeless, sophisticated theme for premium travel brands",
    thumbnail: "",
    colors: {
      primary: "#0c1f3f",
      secondary: "#b8860b",
      accent: "#d4c5a0",
      background: "#fffef9",
      text: "#1b1b1b",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "Lato, sans-serif",
    },
    layout: "elegant",
    features: ["Heritage properties", "Butler service", "Gourmet experiences", "Spa retreats"],
  },
  "boutique-hotel": {
    key: "boutique-hotel",
    name: "Boutique Hotel",
    description: "Intimate, design-forward boutique hotel experience",
    thumbnail: "",
    colors: {
      primary: "#2c3e50",
      secondary: "#c7a94e",
      accent: "#e6d4a5",
      background: "#f9f7f4",
      text: "#2c3e50",
    },
    fonts: {
      heading: "DM Serif Display, serif",
      body: "DM Sans, sans-serif",
    },
    layout: "gallery",
    features: ["Room galleries", "Design highlights", "Local curations", "Artisan amenities"],
  },
  "royal-retreat": {
    key: "royal-retreat",
    name: "Royal Retreat",
    description: "Opulent, palace-inspired theme for royal-level hospitality",
    thumbnail: "",
    colors: {
      primary: "#1b0a3c",
      secondary: "#d4af37",
      accent: "#f0e6c8",
      background: "#fdfbf7",
      text: "#1b0a3c",
    },
    fonts: {
      heading: "Cinzel, serif",
      body: "Raleway, sans-serif",
    },
    layout: "luxury",
    features: ["Palace stays", "Royal dining", "Private tours", "Helicopter transfers"],
  },
  "platinum-travel": {
    key: "platinum-travel",
    name: "Platinum Travel",
    description: "Ultra-premium theme for exclusive platinum-tier travelers",
    thumbnail: "",
    colors: {
      primary: "#1c2331",
      secondary: "#a89060",
      accent: "#d6c9a8",
      background: "#f8f6f2",
      text: "#1c2331",
    },
    fonts: {
      heading: "Bodoni Moda, serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "minimal",
    features: ["Private jets", "Exclusive access", "Personal stylists", "Luxury yachts"],
  },

  // ============================================================
  // 2. ADVENTURE TRAVEL (5)
  // ============================================================
  "extreme-adventure": {
    key: "extreme-adventure",
    name: "Extreme Adventure",
    description: "High-adrenaline theme for extreme sports and thrill-seekers",
    thumbnail: "",
    colors: {
      primary: "#dc2626",
      secondary: "#1c1917",
      accent: "#f97316",
      background: "#fafaf9",
      text: "#1c1917",
    },
    fonts: {
      heading: "Oswald, sans-serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "adventure",
    features: ["Extreme sports", "Safety briefings", "Gear rentals", "Guided expeditions"],
  },
  "mountain-explorer": {
    key: "mountain-explorer",
    name: "Mountain Explorer",
    description: "Rugged mountain theme for trekking and hiking enthusiasts",
    thumbnail: "",
    colors: {
      primary: "#3d5a3e",
      secondary: "#8b6914",
      accent: "#e8a832",
      background: "#f5f2ed",
      text: "#2a2a2a",
    },
    fonts: {
      heading: "Archivo Black, sans-serif",
      body: "Cabin, sans-serif",
    },
    layout: "adventure",
    features: ["Trail maps", "Altitude guides", "Mountain lodges", "Peak challenges"],
  },
  "jungle-trek": {
    key: "jungle-trek",
    name: "Jungle Trek",
    description: "Dense, lush jungle expedition theme for rainforest adventures",
    thumbnail: "",
    colors: {
      primary: "#1a5c2a",
      secondary: "#8b5e2f",
      accent: "#d4a843",
      background: "#f0f4e8",
      text: "#1a2e1a",
    },
    fonts: {
      heading: "Teko, sans-serif",
      body: "Nunito, sans-serif",
    },
    layout: "safari",
    features: ["Canopy walks", "Wildlife spotting", "River crossings", "Camp setups"],
  },
  "desert-expedition": {
    key: "desert-expedition",
    name: "Desert Expedition",
    description: "Sandy, warm theme for desert and arid landscape adventures",
    thumbnail: "",
    colors: {
      primary: "#a0522d",
      secondary: "#c7944a",
      accent: "#e8c872",
      background: "#fdf6e9",
      text: "#3b2410",
    },
    fonts: {
      heading: "Rajdhani, sans-serif",
      body: "Open Sans, sans-serif",
    },
    layout: "bold",
    features: ["Dune bashing", "Oasis tours", "Stargazing camps", "Camel treks"],
  },
  "arctic-voyage": {
    key: "arctic-voyage",
    name: "Arctic Voyage",
    description: "Icy, pristine theme for polar and arctic expeditions",
    thumbnail: "",
    colors: {
      primary: "#1a3a5c",
      secondary: "#5b8fb9",
      accent: "#8ec8e8",
      background: "#f0f6fa",
      text: "#0f2640",
    },
    fonts: {
      heading: "Barlow Condensed, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "magazine",
    features: ["Ice trekking", "Northern lights", "Polar wildlife", "Expedition cruises"],
  },

  // ============================================================
  // 3. BEACH & ISLAND (5)
  // ============================================================
  "tropical-paradise": {
    key: "tropical-paradise",
    name: "Tropical Paradise",
    description: "Vibrant tropical beach theme with lush island vibes",
    thumbnail: "",
    colors: {
      primary: "#0891b2",
      secondary: "#06b6d4",
      accent: "#fbbf24",
      background: "#f0fdfa",
      text: "#134e4a",
    },
    fonts: {
      heading: "Pacifico, cursive",
      body: "Nunito Sans, sans-serif",
    },
    layout: "starter",
    features: ["Beach resorts", "Snorkeling tours", "Island hopping", "Sunset cruises"],
  },
  "mediterranean-blue": {
    key: "mediterranean-blue",
    name: "Mediterranean Blue",
    description: "Sun-soaked Mediterranean coastline theme",
    thumbnail: "",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#f59e0b",
      background: "#fefce8",
      text: "#1e3a5f",
    },
    fonts: {
      heading: "Libre Baskerville, serif",
      body: "Lato, sans-serif",
    },
    layout: "elegant",
    features: ["Coastal villas", "Yacht rentals", "Wine tasting", "Historic ports"],
  },
  "caribbean-vibes": {
    key: "caribbean-vibes",
    name: "Caribbean Vibes",
    description: "Colorful, rhythmic Caribbean island theme",
    thumbnail: "",
    colors: {
      primary: "#0e7490",
      secondary: "#14b8a6",
      accent: "#fb923c",
      background: "#fff7ed",
      text: "#0c4a6e",
    },
    fonts: {
      heading: "Baloo 2, sans-serif",
      body: "Quicksand, sans-serif",
    },
    layout: "bold",
    features: ["All-inclusive resorts", "Reggae festivals", "Diving spots", "Local cuisine"],
  },
  "surf-coast": {
    key: "surf-coast",
    name: "Surf Coast",
    description: "Laid-back surfing and coastal lifestyle theme",
    thumbnail: "",
    colors: {
      primary: "#0284c7",
      secondary: "#38bdf8",
      accent: "#facc15",
      background: "#f8fafc",
      text: "#1e293b",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "adventure",
    features: ["Surf lessons", "Board rentals", "Beach breaks", "Coastal trails"],
  },
  "island-escape": {
    key: "island-escape",
    name: "Island Escape",
    description: "Secluded, dreamy private island retreat theme",
    thumbnail: "",
    colors: {
      primary: "#0d9488",
      secondary: "#5eead4",
      accent: "#fcd34d",
      background: "#f0fdfa",
      text: "#115e59",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Mulish, sans-serif",
    },
    layout: "gallery",
    features: ["Private islands", "Overwater villas", "Marine life", "Spa treatments"],
  },

  // ============================================================
  // 4. SAFARI & WILDLIFE (5)
  // ============================================================
  "african-safari": {
    key: "african-safari",
    name: "African Safari",
    description: "Earthy, warm African safari and wildlife adventure theme",
    thumbnail: "",
    colors: {
      primary: "#b45309",
      secondary: "#78716c",
      accent: "#65a30d",
      background: "#fef3c7",
      text: "#422006",
    },
    fonts: {
      heading: "Bitter, serif",
      body: "Cabin, sans-serif",
    },
    layout: "safari",
    features: ["Big Five tracking", "Lodge stays", "Bush walks", "Sunset drives"],
  },
  "rainforest-wildlife": {
    key: "rainforest-wildlife",
    name: "Rainforest Wildlife",
    description: "Dense, green rainforest biodiversity exploration theme",
    thumbnail: "",
    colors: {
      primary: "#166534",
      secondary: "#4d7c0f",
      accent: "#a3e635",
      background: "#f0fdf4",
      text: "#14532d",
    },
    fonts: {
      heading: "Merriweather, serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "magazine",
    features: ["Canopy tours", "Species guides", "Night walks", "Conservation talks"],
  },
  "marine-discovery": {
    key: "marine-discovery",
    name: "Marine Discovery",
    description: "Deep blue marine life and ocean exploration theme",
    thumbnail: "",
    colors: {
      primary: "#1e3a8a",
      secondary: "#0e7490",
      accent: "#22d3ee",
      background: "#eff6ff",
      text: "#1e3a5f",
    },
    fonts: {
      heading: "Josefin Sans, sans-serif",
      body: "Open Sans, sans-serif",
    },
    layout: "gallery",
    features: ["Whale watching", "Reef diving", "Marine biology", "Submarine tours"],
  },
  "birdwatching-tours": {
    key: "birdwatching-tours",
    name: "Birdwatching Tours",
    description: "Peaceful, nature-focused birdwatching and avian theme",
    thumbnail: "",
    colors: {
      primary: "#3f6212",
      secondary: "#a16207",
      accent: "#84cc16",
      background: "#fefce8",
      text: "#365314",
    },
    fonts: {
      heading: "Spectral, serif",
      body: "Nunito, sans-serif",
    },
    layout: "minimal",
    features: ["Species checklists", "Hide locations", "Guided walks", "Photography hides"],
  },
  "polar-expedition": {
    key: "polar-expedition",
    name: "Polar Expedition",
    description: "Icy, dramatic polar wildlife and expedition theme",
    thumbnail: "",
    colors: {
      primary: "#1e3a5f",
      secondary: "#64748b",
      accent: "#93c5fd",
      background: "#f1f5f9",
      text: "#0f172a",
    },
    fonts: {
      heading: "Barlow, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "adventure",
    features: ["Penguin colonies", "Ice shelf tours", "Research stations", "Zodiac cruises"],
  },

  // ============================================================
  // 5. CULTURAL & HERITAGE (5)
  // ============================================================
  "ancient-world": {
    key: "ancient-world",
    name: "Ancient World",
    description: "Rich, historical theme for ancient civilization exploration",
    thumbnail: "",
    colors: {
      primary: "#7c2d12",
      secondary: "#92400e",
      accent: "#d4a24e",
      background: "#fef7ed",
      text: "#431407",
    },
    fonts: {
      heading: "Cinzel, serif",
      body: "EB Garamond, serif",
    },
    layout: "cultural",
    features: ["Archaeological sites", "Guided history tours", "Museum passes", "Ancient ruins"],
  },
  "artisan-journey": {
    key: "artisan-journey",
    name: "Artisan Journey",
    description: "Handcrafted, artisan-focused cultural travel theme",
    thumbnail: "",
    colors: {
      primary: "#9a3412",
      secondary: "#b45309",
      accent: "#e7a948",
      background: "#fffbeb",
      text: "#451a03",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "Mulish, sans-serif",
    },
    layout: "gallery",
    features: ["Craft workshops", "Local artisans", "Textile tours", "Pottery classes"],
  },
  "festival-travel": {
    key: "festival-travel",
    name: "Festival Travel",
    description: "Vibrant, celebratory theme for global festival tourism",
    thumbnail: "",
    colors: {
      primary: "#be123c",
      secondary: "#9333ea",
      accent: "#f59e0b",
      background: "#fdf2f8",
      text: "#1e1b4b",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Rubik, sans-serif",
    },
    layout: "bold",
    features: ["Festival calendars", "Cultural performances", "Street parades", "Music events"],
  },
  "museum-tours": {
    key: "museum-tours",
    name: "Museum Tours",
    description: "Refined, intellectual theme for museum and gallery travel",
    thumbnail: "",
    colors: {
      primary: "#44403c",
      secondary: "#78716c",
      accent: "#b45309",
      background: "#fafaf9",
      text: "#1c1917",
    },
    fonts: {
      heading: "DM Serif Display, serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "minimal",
    features: ["Curated exhibits", "Audio guides", "Gallery maps", "Art workshops"],
  },
  "culinary-heritage": {
    key: "culinary-heritage",
    name: "Culinary Heritage",
    description: "Deep, flavorful theme for food and culinary heritage travel",
    thumbnail: "",
    colors: {
      primary: "#881337",
      secondary: "#a16207",
      accent: "#ca8a04",
      background: "#fef9f0",
      text: "#3b0a1a",
    },
    fonts: {
      heading: "Libre Baskerville, serif",
      body: "Lato, sans-serif",
    },
    layout: "magazine",
    features: ["Food trails", "Heritage recipes", "Market tours", "Wine pairings"],
  },

  // ============================================================
  // 6. WELLNESS & SPA (5)
  // ============================================================
  "yoga-retreat": {
    key: "yoga-retreat",
    name: "Yoga Retreat",
    description: "Tranquil, mindful yoga and meditation retreat theme",
    thumbnail: "",
    colors: {
      primary: "#5b7a5e",
      secondary: "#8fae8b",
      accent: "#d4b896",
      background: "#f7f5f0",
      text: "#2d3b2e",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "Raleway, sans-serif",
    },
    layout: "wellness",
    features: ["Yoga classes", "Meditation sessions", "Ayurvedic meals", "Mindfulness workshops"],
  },
  "luxury-spa": {
    key: "luxury-spa",
    name: "Luxury Spa",
    description: "Premium, indulgent spa and wellness retreat theme",
    thumbnail: "",
    colors: {
      primary: "#4a3f6b",
      secondary: "#8b7fb5",
      accent: "#c9a96e",
      background: "#f8f6fa",
      text: "#2a2442",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "DM Sans, sans-serif",
    },
    layout: "luxury",
    features: ["Spa treatments", "Thermal baths", "Beauty rituals", "Private suites"],
  },
  "meditation-escape": {
    key: "meditation-escape",
    name: "Meditation Escape",
    description: "Peaceful, contemplative meditation and silence retreat theme",
    thumbnail: "",
    colors: {
      primary: "#6b5b73",
      secondary: "#a89db5",
      accent: "#d4c4a0",
      background: "#faf8fc",
      text: "#3a2e42",
    },
    fonts: {
      heading: "Spectral, serif",
      body: "Nunito, sans-serif",
    },
    layout: "minimal",
    features: ["Silent retreats", "Guided meditation", "Zen gardens", "Sound healing"],
  },
  "holistic-wellness": {
    key: "holistic-wellness",
    name: "Holistic Wellness",
    description: "Comprehensive mind-body-spirit wellness travel theme",
    thumbnail: "",
    colors: {
      primary: "#0d9488",
      secondary: "#5eead4",
      accent: "#c084fc",
      background: "#f0fdf4",
      text: "#134e4a",
    },
    fonts: {
      heading: "Libre Baskerville, serif",
      body: "Open Sans, sans-serif",
    },
    layout: "wellness",
    features: ["Detox programs", "Nutrition coaching", "Energy healing", "Nature therapy"],
  },
  "fitness-travel": {
    key: "fitness-travel",
    name: "Fitness Travel",
    description: "Energetic, active fitness-focused travel and bootcamp theme",
    thumbnail: "",
    colors: {
      primary: "#059669",
      secondary: "#34d399",
      accent: "#fbbf24",
      background: "#f0fdf9",
      text: "#064e3b",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "adventure",
    features: ["Fitness bootcamps", "Trail running", "Outdoor gyms", "Wellness coaches"],
  },

  // ============================================================
  // 7. CRUISE & SAILING (5)
  // ============================================================
  "ocean-cruise": {
    key: "ocean-cruise",
    name: "Ocean Cruise",
    description: "Grand, oceanic cruise liner theme for sea voyages",
    thumbnail: "",
    colors: {
      primary: "#0369a1",
      secondary: "#0ea5e9",
      accent: "#fbbf24",
      background: "#f0f9ff",
      text: "#0c4a6e",
    },
    fonts: {
      heading: "Merriweather, serif",
      body: "Open Sans, sans-serif",
    },
    layout: "cruise",
    features: ["Deck plans", "Itinerary builder", "Cabin selection", "Onboard dining"],
  },
  "river-voyage": {
    key: "river-voyage",
    name: "River Voyage",
    description: "Scenic, serene river cruise and waterway theme",
    thumbnail: "",
    colors: {
      primary: "#1d4e89",
      secondary: "#4a90c4",
      accent: "#e8b84b",
      background: "#f5f8fc",
      text: "#1a3355",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Lato, sans-serif",
    },
    layout: "elegant",
    features: ["River routes", "Shore excursions", "Scenic dining", "Cultural stops"],
  },
  "yacht-charter": {
    key: "yacht-charter",
    name: "Yacht Charter",
    description: "Exclusive, premium yacht and private sailing charter theme",
    thumbnail: "",
    colors: {
      primary: "#0f2b5b",
      secondary: "#2563eb",
      accent: "#c9a84c",
      background: "#f8faff",
      text: "#0f2b5b",
    },
    fonts: {
      heading: "Bodoni Moda, serif",
      body: "DM Sans, sans-serif",
    },
    layout: "luxury",
    features: ["Private charters", "Crew service", "Custom itineraries", "Gourmet catering"],
  },
  "expedition-cruise": {
    key: "expedition-cruise",
    name: "Expedition Cruise",
    description: "Adventurous expedition cruise for remote destinations",
    thumbnail: "",
    colors: {
      primary: "#1a365d",
      secondary: "#3182ce",
      accent: "#ed8936",
      background: "#edf2f7",
      text: "#1a202c",
    },
    fonts: {
      heading: "Barlow Condensed, sans-serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "adventure",
    features: ["Expedition leaders", "Zodiac landings", "Onboard lectures", "Remote ports"],
  },
  "sailing-adventure": {
    key: "sailing-adventure",
    name: "Sailing Adventure",
    description: "Hands-on sailing and nautical adventure theme",
    thumbnail: "",
    colors: {
      primary: "#1e3a5f",
      secondary: "#4299e1",
      accent: "#f6ad55",
      background: "#ebf8ff",
      text: "#2a4365",
    },
    fonts: {
      heading: "Oswald, sans-serif",
      body: "Nunito, sans-serif",
    },
    layout: "bold",
    features: ["Sailing lessons", "Regatta events", "Port hopping", "Crew experiences"],
  },

  // ============================================================
  // 8. ECO & SUSTAINABLE (5)
  // ============================================================
  "eco-lodge": {
    key: "eco-lodge",
    name: "Eco Lodge",
    description: "Sustainable, nature-immersive eco-lodge retreat theme",
    thumbnail: "",
    colors: {
      primary: "#2d5016",
      secondary: "#65a30d",
      accent: "#a3b18a",
      background: "#f5f7f0",
      text: "#1a2e0a",
    },
    fonts: {
      heading: "Bitter, serif",
      body: "Cabin, sans-serif",
    },
    layout: "safari",
    features: ["Eco lodges", "Carbon-neutral stays", "Nature walks", "Organic dining"],
  },
  "conservation-travel": {
    key: "conservation-travel",
    name: "Conservation Travel",
    description: "Purpose-driven conservation and wildlife protection theme",
    thumbnail: "",
    colors: {
      primary: "#15803d",
      secondary: "#4ade80",
      accent: "#86efac",
      background: "#f0fdf4",
      text: "#14532d",
    },
    fonts: {
      heading: "Merriweather, serif",
      body: "Mulish, sans-serif",
    },
    layout: "magazine",
    features: ["Wildlife sanctuaries", "Volunteer programs", "Research projects", "Habitat tours"],
  },
  "agritourism": {
    key: "agritourism",
    name: "Agritourism",
    description: "Rustic, farm-to-table agricultural tourism theme",
    thumbnail: "",
    colors: {
      primary: "#854d0e",
      secondary: "#a16207",
      accent: "#84cc16",
      background: "#fefdf5",
      text: "#422006",
    },
    fonts: {
      heading: "Vollkorn, serif",
      body: "Open Sans, sans-serif",
    },
    layout: "starter",
    features: ["Farm stays", "Harvest tours", "Cooking classes", "Farmers markets"],
  },
  "nature-immersion": {
    key: "nature-immersion",
    name: "Nature Immersion",
    description: "Deep, immersive nature and wilderness experience theme",
    thumbnail: "",
    colors: {
      primary: "#1a4731",
      secondary: "#2d6a4f",
      accent: "#95d5b2",
      background: "#f1f8f4",
      text: "#0d2818",
    },
    fonts: {
      heading: "Josefin Sans, sans-serif",
      body: "Raleway, sans-serif",
    },
    layout: "gallery",
    features: ["Forest bathing", "Wilderness camps", "Star gazing", "Nature journals"],
  },
  "green-getaway": {
    key: "green-getaway",
    name: "Green Getaway",
    description: "Bright, modern sustainable travel and green tourism theme",
    thumbnail: "",
    colors: {
      primary: "#16a34a",
      secondary: "#22c55e",
      accent: "#a3e635",
      background: "#f7fef5",
      text: "#166534",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "minimal",
    features: ["Green certifications", "Eco-friendly transport", "Sustainable stays", "Carbon tracking"],
  },

  // ============================================================
  // 9. CITY & URBAN (5)
  // ============================================================
  "metropolitan-explorer": {
    key: "metropolitan-explorer",
    name: "Metropolitan Explorer",
    description: "Sleek, modern big-city exploration and discovery theme",
    thumbnail: "",
    colors: {
      primary: "#18181b",
      secondary: "#3f3f46",
      accent: "#6366f1",
      background: "#fafafa",
      text: "#18181b",
    },
    fonts: {
      heading: "Space Grotesk, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "urban",
    features: ["City guides", "Metro maps", "Landmark tours", "Local tips"],
  },
  "nightlife-guide": {
    key: "nightlife-guide",
    name: "Nightlife Guide",
    description: "Dark, vibrant nightlife and entertainment exploration theme",
    thumbnail: "",
    colors: {
      primary: "#0f0f0f",
      secondary: "#1a1a2e",
      accent: "#e11d48",
      background: "#18181b",
      text: "#fafafa",
    },
    fonts: {
      heading: "Bebas Neue, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "bold",
    features: ["Club listings", "Bar crawls", "Live music", "Late-night eats"],
  },
  "street-food-tours": {
    key: "street-food-tours",
    name: "Street Food Tours",
    description: "Bustling, flavorful street food and market tour theme",
    thumbnail: "",
    colors: {
      primary: "#ea580c",
      secondary: "#dc2626",
      accent: "#facc15",
      background: "#fff7ed",
      text: "#431407",
    },
    fonts: {
      heading: "Baloo 2, sans-serif",
      body: "Quicksand, sans-serif",
    },
    layout: "magazine",
    features: ["Food maps", "Vendor spotlights", "Tasting tours", "Market guides"],
  },
  "architecture-walks": {
    key: "architecture-walks",
    name: "Architecture Walks",
    description: "Refined, structural architecture and design tour theme",
    thumbnail: "",
    colors: {
      primary: "#292524",
      secondary: "#57534e",
      accent: "#0ea5e9",
      background: "#f5f5f4",
      text: "#1c1917",
    },
    fonts: {
      heading: "DM Serif Display, serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "gallery",
    features: ["Building histories", "Walking routes", "Design highlights", "Photo spots"],
  },
  "shopping-destinations": {
    key: "shopping-destinations",
    name: "Shopping Destinations",
    description: "Glamorous, trend-focused shopping and retail tour theme",
    thumbnail: "",
    colors: {
      primary: "#4a1d6e",
      secondary: "#7c3aed",
      accent: "#f472b6",
      background: "#faf5ff",
      text: "#2e1065",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Nunito Sans, sans-serif",
    },
    layout: "urban",
    features: ["Shopping districts", "Boutique guides", "Tax-free tips", "Fashion events"],
  },

  // ============================================================
  // 10. FAMILY & KIDS (5)
  // ============================================================
  "family-resort": {
    key: "family-resort",
    name: "Family Resort",
    description: "Cheerful, all-ages family resort and vacation theme",
    thumbnail: "",
    colors: {
      primary: "#2563eb",
      secondary: "#16a34a",
      accent: "#f472b6",
      background: "#eff6ff",
      text: "#1e3a5f",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Rubik, sans-serif",
    },
    layout: "family",
    features: ["Kids clubs", "Family suites", "Pool areas", "Child-friendly dining"],
  },
  "theme-park-vacations": {
    key: "theme-park-vacations",
    name: "Theme Park Vacations",
    description: "Exciting, fun-filled theme park and attraction vacation theme",
    thumbnail: "",
    colors: {
      primary: "#dc2626",
      secondary: "#2563eb",
      accent: "#facc15",
      background: "#fef9ec",
      text: "#1a1a1a",
    },
    fonts: {
      heading: "Fredoka, sans-serif",
      body: "Nunito, sans-serif",
    },
    layout: "bold",
    features: ["Park tickets", "Ride guides", "Show schedules", "Fast passes"],
  },
  "educational-travel": {
    key: "educational-travel",
    name: "Educational Travel",
    description: "Inspiring, knowledge-rich educational travel for families",
    thumbnail: "",
    colors: {
      primary: "#1d4ed8",
      secondary: "#7c3aed",
      accent: "#f59e0b",
      background: "#f5f3ff",
      text: "#1e1b4b",
    },
    fonts: {
      heading: "Merriweather, serif",
      body: "Open Sans, sans-serif",
    },
    layout: "magazine",
    features: ["Learning programs", "Science centers", "Historical sites", "Interactive tours"],
  },
  "camping-adventure": {
    key: "camping-adventure",
    name: "Camping Adventure",
    description: "Outdoorsy, fun family camping and nature adventure theme",
    thumbnail: "",
    colors: {
      primary: "#4d7c0f",
      secondary: "#ca8a04",
      accent: "#f97316",
      background: "#f7fee7",
      text: "#365314",
    },
    fonts: {
      heading: "Archivo Black, sans-serif",
      body: "Cabin, sans-serif",
    },
    layout: "adventure",
    features: ["Campsite finder", "Gear checklists", "Nature activities", "S'mores recipes"],
  },
  "all-inclusive-family": {
    key: "all-inclusive-family",
    name: "All-Inclusive Family",
    description: "Stress-free, all-inclusive family vacation theme",
    thumbnail: "",
    colors: {
      primary: "#0891b2",
      secondary: "#f43f5e",
      accent: "#a855f7",
      background: "#f0f9ff",
      text: "#164e63",
    },
    fonts: {
      heading: "Baloo 2, sans-serif",
      body: "Quicksand, sans-serif",
    },
    layout: "family",
    features: ["All-inclusive packages", "Nanny services", "Teen zones", "Water parks"],
  },

  // ============================================================
  // 11. HONEYMOON & ROMANCE (5)
  // ============================================================
  "romantic-getaway": {
    key: "romantic-getaway",
    name: "Romantic Getaway",
    description: "Intimate, dreamy romantic travel theme for couples",
    thumbnail: "",
    colors: {
      primary: "#9f1239",
      secondary: "#e11d63",
      accent: "#f9a8d4",
      background: "#fff1f2",
      text: "#4c0519",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Raleway, sans-serif",
    },
    layout: "elegant",
    features: ["Couples suites", "Candlelit dining", "Sunset tours", "Couples spa"],
  },
  "couples-retreat": {
    key: "couples-retreat",
    name: "Couples Retreat",
    description: "Luxurious, intimate couples-only retreat and spa theme",
    thumbnail: "",
    colors: {
      primary: "#831843",
      secondary: "#be185d",
      accent: "#d4a76a",
      background: "#fdf2f8",
      text: "#500724",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "Lato, sans-serif",
    },
    layout: "luxury",
    features: ["Private villas", "Couple massages", "Wine evenings", "Private pools"],
  },
  "destination-wedding": {
    key: "destination-wedding",
    name: "Destination Wedding",
    description: "Elegant, celebration-ready destination wedding travel theme",
    thumbnail: "",
    colors: {
      primary: "#a8516e",
      secondary: "#d4859e",
      accent: "#c9a84c",
      background: "#fef9f6",
      text: "#3d1f2e",
    },
    fonts: {
      heading: "Cinzel, serif",
      body: "Mulish, sans-serif",
    },
    layout: "gallery",
    features: ["Venue selection", "Wedding planning", "Guest travel", "Ceremony packages"],
  },
  "anniversary-escape": {
    key: "anniversary-escape",
    name: "Anniversary Escape",
    description: "Special, milestone-celebrating anniversary travel theme",
    thumbnail: "",
    colors: {
      primary: "#7f1d1d",
      secondary: "#b91c1c",
      accent: "#e8c872",
      background: "#fef2f2",
      text: "#450a0a",
    },
    fonts: {
      heading: "DM Serif Display, serif",
      body: "DM Sans, sans-serif",
    },
    layout: "elegant",
    features: ["Celebration packages", "Fine dining", "Memory tours", "Luxury upgrades"],
  },
  "love-voyage": {
    key: "love-voyage",
    name: "Love Voyage",
    description: "Playful, modern romantic cruise and travel theme",
    thumbnail: "",
    colors: {
      primary: "#be185d",
      secondary: "#ec4899",
      accent: "#fbbf24",
      background: "#fce7f3",
      text: "#831843",
    },
    fonts: {
      heading: "Pacifico, cursive",
      body: "Nunito, sans-serif",
    },
    layout: "cruise",
    features: ["Love boats", "Romantic ports", "Couples activities", "Honeymoon suites"],
  },

  // ============================================================
  // 12. BACKPACKER & BUDGET (5)
  // ============================================================
  "hostel-hopper": {
    key: "hostel-hopper",
    name: "Hostel Hopper",
    description: "Budget-friendly, social hostel and dorm travel theme",
    thumbnail: "",
    colors: {
      primary: "#10b981",
      secondary: "#6366f1",
      accent: "#f43f5e",
      background: "#fffbeb",
      text: "#1f2937",
    },
    fonts: {
      heading: "Fredoka, sans-serif",
      body: "Nunito, sans-serif",
    },
    layout: "backpacker",
    features: ["Hostel ratings", "Budget tips", "Social events", "Common areas"],
  },
  "backpacker-trail": {
    key: "backpacker-trail",
    name: "Backpacker Trail",
    description: "Adventurous, route-based backpacking trail planner theme",
    thumbnail: "",
    colors: {
      primary: "#7c3aed",
      secondary: "#06b6d4",
      accent: "#fbbf24",
      background: "#f5f3ff",
      text: "#1e1b4b",
    },
    fonts: {
      heading: "Teko, sans-serif",
      body: "Quicksand, sans-serif",
    },
    layout: "adventure",
    features: ["Trail routes", "Budget calculator", "Packing lists", "Visa guides"],
  },
  "road-trip-planner": {
    key: "road-trip-planner",
    name: "Road Trip Planner",
    description: "Free-spirited, open-road trip planning theme",
    thumbnail: "",
    colors: {
      primary: "#ea580c",
      secondary: "#0ea5e9",
      accent: "#84cc16",
      background: "#fff7ed",
      text: "#1c1917",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "bold",
    features: ["Route planner", "Gas calculator", "Roadside stops", "Playlist builder"],
  },
  "gap-year-guide": {
    key: "gap-year-guide",
    name: "Gap Year Guide",
    description: "Youthful, inspiring gap year travel planning theme",
    thumbnail: "",
    colors: {
      primary: "#2563eb",
      secondary: "#ec4899",
      accent: "#14b8a6",
      background: "#eff6ff",
      text: "#1e40af",
    },
    fonts: {
      heading: "Baloo 2, sans-serif",
      body: "Rubik, sans-serif",
    },
    layout: "magazine",
    features: ["Year planner", "Work abroad", "Language schools", "Travel insurance"],
  },
  "volunteer-travel": {
    key: "volunteer-travel",
    name: "Volunteer Travel",
    description: "Purpose-driven, community-focused volunteer travel theme",
    thumbnail: "",
    colors: {
      primary: "#059669",
      secondary: "#8b5cf6",
      accent: "#f59e0b",
      background: "#ecfdf5",
      text: "#064e3b",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Open Sans, sans-serif",
    },
    layout: "starter",
    features: ["Volunteer programs", "Community projects", "Teaching abroad", "Conservation work"],
  },

  // ============================================================
  // 13. FOOD & CULINARY (5)
  // ============================================================
  "wine-country": {
    key: "wine-country",
    name: "Wine Country",
    description: "Rich, vineyard-inspired wine country travel theme",
    thumbnail: "",
    colors: {
      primary: "#6b1c3a",
      secondary: "#8b3a5e",
      accent: "#c9a84c",
      background: "#fdf8f0",
      text: "#3b0d1f",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "Lato, sans-serif",
    },
    layout: "elegant",
    features: ["Vineyard tours", "Wine tasting", "Cellar dinners", "Harvest festivals"],
  },
  "gourmet-tours": {
    key: "gourmet-tours",
    name: "Gourmet Tours",
    description: "Refined, high-end gourmet food tour and tasting theme",
    thumbnail: "",
    colors: {
      primary: "#451a03",
      secondary: "#78350f",
      accent: "#d97706",
      background: "#fffbeb",
      text: "#292524",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "luxury",
    features: ["Michelin dining", "Chef experiences", "Tasting menus", "Food pairing"],
  },
  "street-food-explorer": {
    key: "street-food-explorer",
    name: "Street Food Explorer",
    description: "Vibrant, authentic street food exploration theme",
    thumbnail: "",
    colors: {
      primary: "#c2410c",
      secondary: "#e11d48",
      accent: "#fde047",
      background: "#fef2e8",
      text: "#431407",
    },
    fonts: {
      heading: "Teko, sans-serif",
      body: "Nunito, sans-serif",
    },
    layout: "bold",
    features: ["Street food maps", "Vendor reviews", "Local favorites", "Food photography"],
  },
  "cooking-class-travel": {
    key: "cooking-class-travel",
    name: "Cooking Class Travel",
    description: "Hands-on, interactive cooking class and culinary school theme",
    thumbnail: "",
    colors: {
      primary: "#9a3412",
      secondary: "#c2410c",
      accent: "#65a30d",
      background: "#fff7ed",
      text: "#431407",
    },
    fonts: {
      heading: "Vollkorn, serif",
      body: "Cabin, sans-serif",
    },
    layout: "starter",
    features: ["Cooking workshops", "Recipe cards", "Chef profiles", "Ingredient tours"],
  },
  "farm-to-table": {
    key: "farm-to-table",
    name: "Farm to Table",
    description: "Rustic, organic farm-to-table dining experience theme",
    thumbnail: "",
    colors: {
      primary: "#4d7c0f",
      secondary: "#854d0e",
      accent: "#f59e0b",
      background: "#f7fee7",
      text: "#1a2e0a",
    },
    fonts: {
      heading: "Bitter, serif",
      body: "Mulish, sans-serif",
    },
    layout: "safari",
    features: ["Farm visits", "Seasonal menus", "Organic produce", "Harvest dinners"],
  },

  // ============================================================
  // 14. WINTER & SNOW (5)
  // ============================================================
  "ski-resort": {
    key: "ski-resort",
    name: "Ski Resort",
    description: "Crisp, alpine ski resort and winter sports theme",
    thumbnail: "",
    colors: {
      primary: "#1e3a5f",
      secondary: "#3b82f6",
      accent: "#f87171",
      background: "#f0f9ff",
      text: "#0f172a",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "adventure",
    features: ["Slope maps", "Lift passes", "Ski lessons", "Apres-ski"],
  },
  "snowboard-escape": {
    key: "snowboard-escape",
    name: "Snowboard Escape",
    description: "Edgy, youth-oriented snowboard and freestyle winter theme",
    thumbnail: "",
    colors: {
      primary: "#0f172a",
      secondary: "#334155",
      accent: "#22d3ee",
      background: "#f1f5f9",
      text: "#0f172a",
    },
    fonts: {
      heading: "Bebas Neue, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "bold",
    features: ["Terrain parks", "Board rentals", "Freestyle events", "Mountain lodges"],
  },
  "winter-wonderland": {
    key: "winter-wonderland",
    name: "Winter Wonderland",
    description: "Magical, sparkling winter holiday and Christmas travel theme",
    thumbnail: "",
    colors: {
      primary: "#1e40af",
      secondary: "#6366f1",
      accent: "#c0c0c0",
      background: "#eef2ff",
      text: "#1e1b4b",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Raleway, sans-serif",
    },
    layout: "magazine",
    features: ["Christmas markets", "Ice skating", "Snow activities", "Winter lodges"],
  },
  "alpine-retreat": {
    key: "alpine-retreat",
    name: "Alpine Retreat",
    description: "Cozy, chalet-style alpine mountain retreat theme",
    thumbnail: "",
    colors: {
      primary: "#44403c",
      secondary: "#78716c",
      accent: "#dc2626",
      background: "#faf9f7",
      text: "#292524",
    },
    fonts: {
      heading: "Libre Baskerville, serif",
      body: "Open Sans, sans-serif",
    },
    layout: "luxury",
    features: ["Chalet rentals", "Fireplace dining", "Mountain views", "Hot springs"],
  },
  "nordic-adventures": {
    key: "nordic-adventures",
    name: "Nordic Adventures",
    description: "Clean, Scandinavian-inspired Nordic winter adventure theme",
    thumbnail: "",
    colors: {
      primary: "#1a2744",
      secondary: "#4a6fa5",
      accent: "#94b8db",
      background: "#f5f8fc",
      text: "#1a2744",
    },
    fonts: {
      heading: "Josefin Sans, sans-serif",
      body: "Nunito Sans, sans-serif",
    },
    layout: "minimal",
    features: ["Aurora tours", "Husky sledding", "Ice hotels", "Fjord cruises"],
  },

  // ============================================================
  // 15. PHOTOGRAPHY & ART (5)
  // ============================================================
  "photo-tours": {
    key: "photo-tours",
    name: "Photo Tours",
    description: "Visual, photography-focused travel and workshop theme",
    thumbnail: "",
    colors: {
      primary: "#171717",
      secondary: "#404040",
      accent: "#f59e0b",
      background: "#fafafa",
      text: "#171717",
    },
    fonts: {
      heading: "Space Grotesk, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "gallery",
    features: ["Photo workshops", "Golden hour tours", "Camera gear", "Print exhibitions"],
  },
  "art-travel": {
    key: "art-travel",
    name: "Art Travel",
    description: "Creative, expressive art-focused travel experience theme",
    thumbnail: "",
    colors: {
      primary: "#581c87",
      secondary: "#7c3aed",
      accent: "#f97316",
      background: "#faf5ff",
      text: "#3b0764",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "DM Sans, sans-serif",
    },
    layout: "gallery",
    features: ["Art residencies", "Gallery visits", "Studio tours", "Creative workshops"],
  },
  "gallery-hopping": {
    key: "gallery-hopping",
    name: "Gallery Hopping",
    description: "Cultured, gallery and art exhibition tour theme",
    thumbnail: "",
    colors: {
      primary: "#1c1917",
      secondary: "#57534e",
      accent: "#e11d48",
      background: "#f5f5f4",
      text: "#1c1917",
    },
    fonts: {
      heading: "DM Serif Display, serif",
      body: "Lato, sans-serif",
    },
    layout: "minimal",
    features: ["Exhibition guides", "Gallery maps", "Artist talks", "Opening nights"],
  },
  "landscape-photography": {
    key: "landscape-photography",
    name: "Landscape Photography",
    description: "Epic, wide-angle landscape photography travel theme",
    thumbnail: "",
    colors: {
      primary: "#1e293b",
      secondary: "#475569",
      accent: "#0ea5e9",
      background: "#f8fafc",
      text: "#0f172a",
    },
    fonts: {
      heading: "Barlow Condensed, sans-serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "magazine",
    features: ["Location scouting", "Time-lapse spots", "Drone photography", "Weather tracking"],
  },
  "documentary-travel": {
    key: "documentary-travel",
    name: "Documentary Travel",
    description: "Storytelling-focused documentary and narrative travel theme",
    thumbnail: "",
    colors: {
      primary: "#27272a",
      secondary: "#52525b",
      accent: "#dc2626",
      background: "#fafafa",
      text: "#18181b",
    },
    fonts: {
      heading: "Oswald, sans-serif",
      body: "Mulish, sans-serif",
    },
    layout: "bold",
    features: ["Story guides", "Interview spots", "Film locations", "Narrative trails"],
  },

  // ============================================================
  // 16. RELIGIOUS & SPIRITUAL (5)
  // ============================================================
  "pilgrimage-paths": {
    key: "pilgrimage-paths",
    name: "Pilgrimage Paths",
    description: "Sacred, devotional pilgrimage route and path theme",
    thumbnail: "",
    colors: {
      primary: "#4a1d6b",
      secondary: "#7e3fb5",
      accent: "#d4af37",
      background: "#f9f5ff",
      text: "#2e1046",
    },
    fonts: {
      heading: "Cinzel, serif",
      body: "EB Garamond, serif",
    },
    layout: "cultural",
    features: ["Pilgrimage routes", "Sacred sites", "Guided prayers", "Accommodation lists"],
  },
  "spiritual-journeys": {
    key: "spiritual-journeys",
    name: "Spiritual Journeys",
    description: "Transcendent, soul-searching spiritual travel theme",
    thumbnail: "",
    colors: {
      primary: "#5b21b6",
      secondary: "#8b5cf6",
      accent: "#c9a84c",
      background: "#faf5ff",
      text: "#3b0764",
    },
    fonts: {
      heading: "Spectral, serif",
      body: "Raleway, sans-serif",
    },
    layout: "wellness",
    features: ["Ashram stays", "Spiritual guides", "Retreat centers", "Inner journeys"],
  },
  "temple-tours": {
    key: "temple-tours",
    name: "Temple Tours",
    description: "Ornate, temple and sacred architecture exploration theme",
    thumbnail: "",
    colors: {
      primary: "#92400e",
      secondary: "#b45309",
      accent: "#d4af37",
      background: "#fef3c7",
      text: "#451a03",
    },
    fonts: {
      heading: "Vollkorn, serif",
      body: "Open Sans, sans-serif",
    },
    layout: "gallery",
    features: ["Temple guides", "Ceremony schedules", "Architecture tours", "Meditation halls"],
  },
  "sacred-places": {
    key: "sacred-places",
    name: "Sacred Places",
    description: "Reverent, world sacred sites and holy places theme",
    thumbnail: "",
    colors: {
      primary: "#3b1d6e",
      secondary: "#6d4aa5",
      accent: "#e8c872",
      background: "#f5f0ff",
      text: "#1a0a3e",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "Nunito, sans-serif",
    },
    layout: "magazine",
    features: ["Sacred site maps", "Dress codes", "Visitor etiquette", "Spiritual history"],
  },
  "faith-travel": {
    key: "faith-travel",
    name: "Faith Travel",
    description: "Welcoming, inclusive faith-based travel community theme",
    thumbnail: "",
    colors: {
      primary: "#4338ca",
      secondary: "#6366f1",
      accent: "#f5c842",
      background: "#eef2ff",
      text: "#312e81",
    },
    fonts: {
      heading: "Merriweather, serif",
      body: "Mulish, sans-serif",
    },
    layout: "starter",
    features: ["Faith groups", "Religious calendars", "Community trips", "Prayer spaces"],
  },

  // ============================================================
  // 17. BUSINESS & CORPORATE (5)
  // ============================================================
  "corporate-travel": {
    key: "corporate-travel",
    name: "Corporate Travel",
    description: "Professional, streamlined corporate travel management theme",
    thumbnail: "",
    colors: {
      primary: "#1e3a5f",
      secondary: "#475569",
      accent: "#2563eb",
      background: "#f8fafc",
      text: "#0f172a",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "minimal",
    features: ["Corporate rates", "Expense tracking", "Travel policies", "Airport lounges"],
  },
  "conference-planner": {
    key: "conference-planner",
    name: "Conference Planner",
    description: "Organized, detail-oriented conference and event travel theme",
    thumbnail: "",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#f59e0b",
      background: "#eff6ff",
      text: "#1e3a8a",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "starter",
    features: ["Venue search", "Event schedules", "Speaker profiles", "Networking events"],
  },
  "incentive-trips": {
    key: "incentive-trips",
    name: "Incentive Trips",
    description: "Motivating, reward-focused corporate incentive travel theme",
    thumbnail: "",
    colors: {
      primary: "#0f4c75",
      secondary: "#3282b8",
      accent: "#bbe1fa",
      background: "#f0f7ff",
      text: "#1b262c",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "luxury",
    features: ["Reward programs", "Team experiences", "Luxury venues", "Achievement awards"],
  },
  "executive-retreats": {
    key: "executive-retreats",
    name: "Executive Retreats",
    description: "Premium, exclusive executive retreat and leadership theme",
    thumbnail: "",
    colors: {
      primary: "#1a1a2e",
      secondary: "#16213e",
      accent: "#a89060",
      background: "#f7f7fa",
      text: "#1a1a2e",
    },
    fonts: {
      heading: "DM Serif Display, serif",
      body: "Lato, sans-serif",
    },
    layout: "elegant",
    features: ["Private boardrooms", "Executive suites", "Golf courses", "Fine dining"],
  },
  "team-building": {
    key: "team-building",
    name: "Team Building",
    description: "Dynamic, engaging team-building activity travel theme",
    thumbnail: "",
    colors: {
      primary: "#0369a1",
      secondary: "#0ea5e9",
      accent: "#f97316",
      background: "#f0f9ff",
      text: "#0c4a6e",
    },
    fonts: {
      heading: "Barlow, sans-serif",
      body: "Rubik, sans-serif",
    },
    layout: "adventure",
    features: ["Team activities", "Challenge courses", "Group retreats", "Bonding events"],
  },

  // ============================================================
  // 18. SENIOR & RETIREMENT (5)
  // ============================================================
  "golden-journeys": {
    key: "golden-journeys",
    name: "Golden Journeys",
    description: "Warm, comfortable travel theme for golden-age explorers",
    thumbnail: "",
    colors: {
      primary: "#92400e",
      secondary: "#b45309",
      accent: "#fbbf24",
      background: "#fffdf5",
      text: "#292524",
    },
    fonts: {
      heading: "Libre Baskerville, serif",
      body: "Open Sans, sans-serif",
    },
    layout: "starter",
    features: ["Accessible tours", "Comfort lodging", "Guided groups", "Medical support"],
  },
  "slow-travel": {
    key: "slow-travel",
    name: "Slow Travel",
    description: "Relaxed, unhurried slow travel and extended stay theme",
    thumbnail: "",
    colors: {
      primary: "#5b6b4e",
      secondary: "#8a9a76",
      accent: "#c9a84c",
      background: "#f8f6f0",
      text: "#2d3529",
    },
    fonts: {
      heading: "Vollkorn, serif",
      body: "Raleway, sans-serif",
    },
    layout: "minimal",
    features: ["Extended stays", "Local immersion", "Scenic routes", "Cultural depth"],
  },
  "comfort-tours": {
    key: "comfort-tours",
    name: "Comfort Tours",
    description: "Easy, well-organized comfort-first guided tour theme",
    thumbnail: "",
    colors: {
      primary: "#7c5c3c",
      secondary: "#a67c5b",
      accent: "#d4a76a",
      background: "#faf5ef",
      text: "#3e2c1a",
    },
    fonts: {
      heading: "Merriweather, serif",
      body: "Nunito, sans-serif",
    },
    layout: "family",
    features: ["Door-to-door service", "Comfortable coaches", "Rest stops", "Easy pace"],
  },
  "heritage-trails": {
    key: "heritage-trails",
    name: "Heritage Trails",
    description: "Nostalgic, heritage-focused historical trail theme for seniors",
    thumbnail: "",
    colors: {
      primary: "#78350f",
      secondary: "#a16207",
      accent: "#b45309",
      background: "#fef9e7",
      text: "#3b1a06",
    },
    fonts: {
      heading: "Cinzel, serif",
      body: "EB Garamond, serif",
    },
    layout: "cultural",
    features: ["Heritage walks", "History talks", "Archive visits", "Memorial tours"],
  },
  "leisure-voyages": {
    key: "leisure-voyages",
    name: "Leisure Voyages",
    description: "Gentle, leisurely cruise and scenic voyage theme",
    thumbnail: "",
    colors: {
      primary: "#1e4d6e",
      secondary: "#4a8ab5",
      accent: "#e8c45a",
      background: "#f5f9fc",
      text: "#1a3550",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Lato, sans-serif",
    },
    layout: "cruise",
    features: ["Scenic cruises", "Gentle excursions", "Onboard entertainment", "Wellness programs"],
  },

  // ============================================================
  // 19. SPORTS & ACTIVE (5)
  // ============================================================
  "golf-getaways": {
    key: "golf-getaways",
    name: "Golf Getaways",
    description: "Prestigious, green-and-gold golf travel and course theme",
    thumbnail: "",
    colors: {
      primary: "#1a472a",
      secondary: "#2d6a4f",
      accent: "#d4af37",
      background: "#f0fdf4",
      text: "#14532d",
    },
    fonts: {
      heading: "DM Serif Display, serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "luxury",
    features: ["Course reviews", "Tee times", "Golf resorts", "Tournament travel"],
  },
  "scuba-diving": {
    key: "scuba-diving",
    name: "Scuba Diving",
    description: "Deep blue, underwater scuba diving adventure theme",
    thumbnail: "",
    colors: {
      primary: "#0c4a6e",
      secondary: "#0284c7",
      accent: "#06b6d4",
      background: "#ecfeff",
      text: "#164e63",
    },
    fonts: {
      heading: "Barlow Condensed, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "adventure",
    features: ["Dive sites", "Certification courses", "Equipment rentals", "Marine guides"],
  },
  "cycling-tours": {
    key: "cycling-tours",
    name: "Cycling Tours",
    description: "Energetic, road and mountain cycling tour theme",
    thumbnail: "",
    colors: {
      primary: "#b91c1c",
      secondary: "#1d4ed8",
      accent: "#facc15",
      background: "#fef2f2",
      text: "#1f2937",
    },
    fonts: {
      heading: "Oswald, sans-serif",
      body: "Cabin, sans-serif",
    },
    layout: "bold",
    features: ["Route maps", "Bike rentals", "Stage guides", "Support vehicles"],
  },
  "marathon-travel": {
    key: "marathon-travel",
    name: "Marathon Travel",
    description: "High-energy marathon and running event travel theme",
    thumbnail: "",
    colors: {
      primary: "#dc2626",
      secondary: "#f97316",
      accent: "#fbbf24",
      background: "#fef2f2",
      text: "#1a1a1a",
    },
    fonts: {
      heading: "Rajdhani, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "magazine",
    features: ["Race calendars", "Training plans", "City routes", "Runner communities"],
  },
  "climbing-expeditions": {
    key: "climbing-expeditions",
    name: "Climbing Expeditions",
    description: "Rugged, vertical climbing and mountaineering expedition theme",
    thumbnail: "",
    colors: {
      primary: "#44403c",
      secondary: "#78716c",
      accent: "#f97316",
      background: "#fafaf9",
      text: "#1c1917",
    },
    fonts: {
      heading: "Archivo Black, sans-serif",
      body: "Nunito Sans, sans-serif",
    },
    layout: "adventure",
    features: ["Summit guides", "Gear lists", "Route grades", "Base camps"],
  },

  // ============================================================
  // 20. DIGITAL NOMAD (5)
  // ============================================================
  "remote-work-travel": {
    key: "remote-work-travel",
    name: "Remote Work Travel",
    description: "Modern, productive remote work and travel lifestyle theme",
    thumbnail: "",
    colors: {
      primary: "#1e293b",
      secondary: "#334155",
      accent: "#6366f1",
      background: "#f8fafc",
      text: "#0f172a",
    },
    fonts: {
      heading: "Space Grotesk, sans-serif",
      body: "DM Sans, sans-serif",
    },
    layout: "minimal",
    features: ["WiFi ratings", "Coworking spaces", "Visa info", "Cost of living"],
  },
  "coworking-escapes": {
    key: "coworking-escapes",
    name: "Coworking Escapes",
    description: "Collaborative, community-driven coworking retreat theme",
    thumbnail: "",
    colors: {
      primary: "#4f46e5",
      secondary: "#818cf8",
      accent: "#34d399",
      background: "#eef2ff",
      text: "#312e81",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Inter, sans-serif",
    },
    layout: "urban",
    features: ["Space reviews", "Community events", "Day passes", "Networking hubs"],
  },
  "long-stay-rentals": {
    key: "long-stay-rentals",
    name: "Long-Stay Rentals",
    description: "Practical, comfort-focused long-term rental and apartment theme",
    thumbnail: "",
    colors: {
      primary: "#0f766e",
      secondary: "#14b8a6",
      accent: "#fbbf24",
      background: "#f0fdfa",
      text: "#134e4a",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Open Sans, sans-serif",
    },
    layout: "starter",
    features: ["Apartment listings", "Monthly rates", "Neighborhood guides", "Lease tips"],
  },
  "expat-guide": {
    key: "expat-guide",
    name: "Expat Guide",
    description: "Comprehensive, supportive expat relocation and living guide theme",
    thumbnail: "",
    colors: {
      primary: "#1e40af",
      secondary: "#60a5fa",
      accent: "#f97316",
      background: "#f0f5ff",
      text: "#1e3a8a",
    },
    fonts: {
      heading: "Barlow, sans-serif",
      body: "Lato, sans-serif",
    },
    layout: "magazine",
    features: ["Relocation guides", "Legal advice", "Community forums", "Language resources"],
  },
  "freelancer-hubs": {
    key: "freelancer-hubs",
    name: "Freelancer Hubs",
    description: "Tech-savvy, indie freelancer travel and workspace theme",
    thumbnail: "",
    colors: {
      primary: "#0d1b2a",
      secondary: "#1b2838",
      accent: "#00d4ff",
      background: "#f0f4f8",
      text: "#0d1b2a",
    },
    fonts: {
      heading: "Rajdhani, sans-serif",
      body: "Source Sans 3, sans-serif",
    },
    layout: "urban",
    features: ["Hub directories", "Speed tests", "Digital tools", "Freelancer meetups"],
  },
};

export function getTheme(key: string): ThemeConfig {
  return themes[key] ?? themes["tropical-paradise"];
}
