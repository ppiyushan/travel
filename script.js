/* ==========================================================================
   Explore Sri Lanka — script.js
   Vanilla JavaScript only. Sections:
     1. Data (destinations, categories, planner settings)
     2. Helpers (DOM, escaping, image fallbacks)
     3. Navigation and page effects
     4. Destination cards, search, filter and sort
     5. Details modal
     6. Trip planner
     7. Photo gallery and lightbox
     8. Contact form validation
     9. Start-up
   ========================================================================== */

(() => {
  'use strict';

  /* ======================================================================
     1. DATA
     Image files are expected in the images/ folder (see images/README.txt).
     If a file is missing, a generated illustration is shown instead.
     ====================================================================== */

  const CATEGORY_LABELS = {
    beaches: 'Beaches',
    mountains: 'Mountains',
    wildlife: 'Wildlife',
    historical: 'Historical Places',
    temples: 'Temples',
    adventure: 'Adventure'
  };

  const INTEREST_LABELS = {
    beaches: 'Beaches',
    nature: 'Nature',
    wildlife: 'Wildlife',
    culture: 'Culture',
    adventure: 'Adventure'
  };

  const GALLERY_FILTERS = [
    { id: 'all', label: 'All photos' },
    { id: 'beaches', label: 'Beaches' },
    { id: 'mountains', label: 'Mountains' },
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'temples', label: 'Temples' },
    { id: 'historical', label: 'Historical sites' }
  ];

  /* Fields per destination:
     categories  - filters used in the destination list
     galleryCat  - which gallery filter it belongs to
     interests   - used by the trip planner
     order       - rough north-to-south-to-coast route order (planner)
     months      - months (1-12) that suit a visit; empty means "any month" */
  const DESTINATIONS = [
    {
      id: 'sigiriya',
      name: 'Sigiriya Rock Fortress',
      location: 'Matale District, Central Province',
      mapQuery: 'Sigiriya Rock Fortress, Sri Lanka',
      categories: ['historical', 'adventure'],
      galleryCat: 'historical',
      interests: ['culture', 'adventure'],
      region: 'Cultural Triangle',
      order: 3,
      months: [2, 3, 4, 5, 6, 7, 8, 9],
      timeNeeded: '3 to 4 hours',
      image: 'images/sigiriya.jpg',
      alt: 'Sigiriya, the Lion Rock, rising above the jungle in central Sri Lanka',
      short: 'A 5th-century rock citadel crowned with royal ruins, painted frescoes and sweeping jungle views.',
      description: 'Sigiriya, the “Lion Rock”, is a granite column that rises about 200 metres above the surrounding plains. King Kashyapa built his royal citadel here in the late 5th century CE, complete with landscaped water gardens, a mirror wall and a lion-shaped gateway of which the huge paws remain. Visitors climb staircases and galleries past ancient frescoes to the ruins on the summit and a view across the jungle. It was listed as a UNESCO World Heritage Site in 1982.',
      bestTime: 'February to September, the drier months. Arrive when the site opens to beat the heat and the crowds.',
      activities: ['Climb the staircases to the summit gardens', 'See the frescoes and the mirror wall', 'Stroll the symmetrical water gardens', 'Watch sunrise or sunset from nearby Pidurangala Rock'],
      tips: ['Start at opening time; there is little shade on the climb.', 'Wear sturdy shoes and carry water.', 'Photography is restricted at the frescoes, so follow the signs.', 'Keep noise down on the upper stairways, where wasps sometimes nest.'],
      nearby: [{ name: 'Pidurangala Rock' }, { name: 'Dambulla Cave Temple', id: 'dambulla' }, { name: 'Minneriya National Park' }, { name: 'Polonnaruwa Ancient City', id: 'polonnaruwa' }]
    },
    {
      id: 'ella',
      name: 'Ella and Nine Arch Bridge',
      location: 'Badulla District, Uva Province',
      mapQuery: 'Nine Arch Bridge, Ella, Sri Lanka',
      categories: ['mountains', 'adventure'],
      galleryCat: 'mountains',
      interests: ['nature', 'adventure'],
      region: 'Hill Country',
      order: 9,
      months: [1, 2, 3, 4],
      timeNeeded: 'Half a day to two days',
      image: 'images/ella.jpg',
      alt: 'A blue train crossing the stone Nine Arch Bridge among green tea hills near Ella',
      short: 'A relaxed hill village of tea slopes, waterfalls and a famous curved railway viaduct.',
      description: 'Ella is a small hill-country village ringed by tea estates, waterfalls and forested ridges. Its best-known sight is the Nine Arch Bridge near Demodara, a curved stone-and-brick railway viaduct from the British colonial era that trains still cross several times a day. Short hikes lead to Little Adam’s Peak and Ella Rock for wide views over the Uva highlands, and the train ride from Kandy is one of the most scenic in Asia.',
      bestTime: 'January to April is generally the driest and clearest period.',
      activities: ['Watch a train cross the Nine Arch Bridge', 'Hike Little Adam’s Peak at sunrise', 'Hike to Ella Rock', 'Visit Ravana Falls', 'Ride the scenic Kandy to Ella train'],
      tips: ['Ask locally for current train times; delays are common.', 'Start the Ella Rock hike early and consider a local guide, as trails can be confusing.', 'Evenings are cool, so bring a light jacket.'],
      nearby: [{ name: 'Little Adam’s Peak' }, { name: 'Ella Rock' }, { name: 'Ravana Falls' }, { name: 'Lipton’s Seat, Haputale' }]
    },
    {
      id: 'galle',
      name: 'Galle Fort',
      location: 'Galle, Southern Province',
      mapQuery: 'Galle Fort, Sri Lanka',
      categories: ['historical'],
      galleryCat: 'historical',
      interests: ['culture', 'beaches'],
      region: 'South Coast',
      order: 14,
      months: [12, 1, 2, 3, 4],
      timeNeeded: 'Half a day',
      image: 'images/galle-fort.jpg',
      alt: 'The white lighthouse and old stone ramparts of Galle Fort beside the sea',
      short: 'A walled colonial town on the sea, with ramparts, a lighthouse, churches and cafés.',
      description: 'Galle Fort is a walled old town on the southwest coast. The Portuguese first fortified the site in 1588, and the Dutch greatly expanded the defences in the 17th century. Today you can walk the full circuit of the ramparts, pass the lighthouse and the Dutch Reformed Church, and wander lanes of boutiques, galleries and cafés in restored colonial houses. The Old Town of Galle and its Fortifications is a UNESCO World Heritage Site, listed in 1988.',
      bestTime: 'December to April, when the southwest coast is at its driest.',
      activities: ['Walk the ramparts at sunset', 'Visit the lighthouse and the Dutch Reformed Church', 'Browse galleries, jewellery and craft shops', 'Stop at a café in a restored colonial house'],
      tips: ['Walk the ramparts in the late afternoon for cooler air and softer light.', 'The lanes are best explored on foot, so park outside the walls.', 'Cover shoulders and knees when entering churches and mosques.'],
      nearby: [{ name: 'Unawatuna Beach' }, { name: 'Jungle Beach' }, { name: 'Hikkaduwa Beach', id: 'hikkaduwa' }, { name: 'Mirissa Beach', id: 'mirissa' }]
    },
    {
      id: 'mirissa',
      name: 'Mirissa Beach',
      location: 'Matara District, Southern Province',
      mapQuery: 'Mirissa Beach, Sri Lanka',
      categories: ['beaches', 'wildlife'],
      galleryCat: 'beaches',
      interests: ['beaches', 'wildlife'],
      region: 'South Coast',
      order: 13,
      months: [11, 12, 1, 2, 3, 4],
      timeNeeded: 'One to two days',
      image: 'images/mirissa.jpg',
      alt: 'Palm trees leaning over the golden sand and turquoise water of Mirissa Beach',
      short: 'A palm-fringed bay with golden sand, beach cafés and some of the best whale watching in Asia.',
      description: 'Mirissa is a crescent of golden sand on the south coast, lined with palms, beach shacks and seafood restaurants. Boats leave at sunrise for whale watching, and blue whales are seen between about November and April, often alongside dolphins. Walk out to Parrot Rock at low tide, photograph the palms of Coconut Tree Hill, or spend lazy hours on the sand. Nearby Weligama has gentle waves for beginner surfers.',
      bestTime: 'November to April, which is also whale-watching season.',
      activities: ['Go whale and dolphin watching', 'Visit Coconut Tree Hill at sunrise', 'Walk to Parrot Rock at low tide', 'Learn to surf at nearby Weligama', 'Eat fresh seafood on the beach'],
      tips: ['Choose a boat operator that follows responsible whale-watching guidelines.', 'Take seasickness tablets if you are prone to motion sickness.', 'Currents can be strong, so swim where lifeguards or locals advise.'],
      nearby: [{ name: 'Weligama Bay' }, { name: 'Coconut Tree Hill' }, { name: 'Dondra Head Lighthouse' }, { name: 'Galle Fort', id: 'galle' }]
    },
    {
      id: 'yala',
      name: 'Yala National Park',
      location: 'Southern and Uva Provinces',
      mapQuery: 'Yala National Park, Sri Lanka',
      categories: ['wildlife', 'adventure'],
      galleryCat: 'wildlife',
      interests: ['wildlife', 'adventure'],
      region: 'Southern Wildlife',
      order: 11,
      months: [2, 3, 4, 5, 6, 7],
      timeNeeded: 'Half a day (a safari)',
      image: 'images/yala.jpg',
      alt: 'A leopard resting on a rock in the scrub of Yala National Park',
      short: 'Sri Lanka’s best-known safari park, famous for leopards, elephants and coastal scrub.',
      description: 'Yala, in the southeast, is Sri Lanka’s most visited wildlife park and is known for one of the highest leopard densities in the world. Open scrub, lagoons, rocky outcrops and sandy beaches shelter elephants, sloth bears, crocodiles, water buffalo and a long list of birds. Safaris run in open jeeps with a licensed driver and tracker, and early mornings give the best chance of seeing big cats.',
      bestTime: 'February to July. Parts of the park are sometimes closed for a few weeks in the dry season, so check dates before you book.',
      activities: ['Take a dawn jeep safari', 'Look for leopards and elephants', 'Go birdwatching at the lagoons', 'Visit the nearby temple town of Kataragama'],
      tips: ['Book a jeep and driver through a licensed operator.', 'Go at dawn, when animals are most active and the air is cool.', 'Stay seated and keep quiet during sightings.'],
      nearby: [{ name: 'Tissamaharama' }, { name: 'Kataragama temple town' }, { name: 'Bundala National Park' }, { name: 'Udawalawe National Park', id: 'udawalawe' }]
    },
    {
      id: 'temple-of-the-tooth',
      name: 'Temple of the Sacred Tooth Relic',
      location: 'Kandy, Central Province',
      mapQuery: 'Sri Dalada Maligawa, Kandy, Sri Lanka',
      categories: ['temples', 'historical'],
      galleryCat: 'temples',
      interests: ['culture'],
      region: 'Kandy',
      order: 5,
      months: [],
      timeNeeded: '1 to 2 hours',
      image: 'images/temple-of-the-tooth.jpg',
      alt: 'The golden-roofed Temple of the Sacred Tooth Relic beside Kandy Lake',
      short: 'Sri Lanka’s holiest Buddhist shrine, home to a relic of the tooth of the Buddha.',
      description: 'The Sri Dalada Maligawa in Kandy houses a sacred relic of the tooth of the Buddha and is one of the most important Buddhist sites in the world. The temple sits within the old royal palace complex beside Kandy Lake, and daily puja ceremonies fill the shrine with drums, flowers and worshippers. Kandy itself is a UNESCO World Heritage Site, and the temple is the focus of the Esala Perahera, a procession of dancers and decorated elephants held in July or August.',
      bestTime: 'Any time of year. The Esala Perahera in July or August is the biggest festival, so book ahead if you plan to attend.',
      activities: ['Attend a puja ceremony', 'Visit the temple museum', 'Walk around Kandy Lake', 'See a cultural dance show in town'],
      tips: ['Dress modestly, with shoulders and knees covered, and remove shoes and hats.', 'Expect security checks and queues at ceremony times.', 'Arrive early for the best view of the ceremony.'],
      nearby: [{ name: 'Kandy Lake' }, { name: 'Royal Botanic Gardens, Peradeniya' }, { name: 'Udawattakele Forest Reserve' }, { name: 'Nuwara Eliya', id: 'nuwara-eliya' }]
    },
    {
      id: 'nuwara-eliya',
      name: 'Nuwara Eliya',
      location: 'Central Highlands',
      mapQuery: 'Nuwara Eliya, Sri Lanka',
      categories: ['mountains'],
      galleryCat: 'mountains',
      interests: ['nature'],
      region: 'Hill Country',
      order: 7,
      months: [3, 4, 5],
      timeNeeded: 'One to two days',
      image: 'images/nuwara-eliya.jpg',
      alt: 'Rolling green tea plantations around Nuwara Eliya under a misty sky',
      short: '“Little England”, a cool hill town of tea estates, colonial villas and lakeside gardens.',
      description: 'At about 1,868 metres, Nuwara Eliya is Sri Lanka’s highest town and the heart of its tea country. Nicknamed “Little England”, it keeps a colonial atmosphere with Tudor-style villas, a golf course and manicured parks. Visit a tea factory to see leaves processed and taste a fresh cup, stroll around Gregory Lake, and look out over the surrounding slopes of tea bushes.',
      bestTime: 'March to May. April is the festive season and the busiest time, so book rooms early.',
      activities: ['Tour a tea estate and factory', 'Walk around Gregory Lake', 'Visit Victoria Park', 'Visit Hakgala Botanical Garden'],
      tips: ['Bring a warm layer; evenings are cold even in the dry months.', 'Book accommodation well ahead for April.', 'Factory tours are quietest on weekday mornings.'],
      nearby: [{ name: 'Horton Plains National Park', id: 'horton-plains' }, { name: 'Hakgala Botanical Garden' }, { name: 'Lover’s Leap Waterfall' }, { name: 'Ambewela' }]
    },
    {
      id: 'horton-plains',
      name: 'Horton Plains National Park',
      location: 'Central Highlands, near Nuwara Eliya',
      mapQuery: 'Horton Plains National Park, Sri Lanka',
      categories: ['mountains', 'wildlife', 'adventure'],
      galleryCat: 'mountains',
      interests: ['nature', 'wildlife', 'adventure'],
      region: 'Hill Country',
      order: 8,
      months: [1, 2, 3],
      timeNeeded: '3 to 4 hours (the loop walk)',
      image: 'images/horton-plains.jpg',
      alt: 'Misty grassland and cloud forest on the Horton Plains plateau',
      short: 'A high plateau of grassland and cloud forest ending at the dramatic cliff known as World’s End.',
      description: 'Horton Plains is a high plateau of rolling grassland and cloud forest more than 2,000 metres above sea level. A circular trail of about nine kilometres leads to Mini World’s End, World’s End, a sheer cliff with a drop of roughly 870 metres, and Baker’s Falls. Sambar deer graze the grassland, and many endemic birds and plants live here. The park is part of the Central Highlands World Heritage Site.',
      bestTime: 'January to March for the clearest views. Mist usually rolls in by mid-morning, so go early.',
      activities: ['Walk the World’s End loop', 'See Baker’s Falls', 'Spot sambar deer and endemic birds', 'Photograph the sunrise light over the plains'],
      tips: ['Arrive when the gates open; views from World’s End are clearest early in the morning.', 'Dress in layers and bring a rain jacket.', 'Plastic bags are not allowed in the park, so pack a reusable bottle.', 'Stay on the marked trail.'],
      nearby: [{ name: 'Nuwara Eliya', id: 'nuwara-eliya' }, { name: 'Pattipola railway station' }, { name: 'Ella and Nine Arch Bridge', id: 'ella' }]
    },
    {
      id: 'dambulla',
      name: 'Dambulla Cave Temple',
      location: 'Dambulla, Central Province',
      mapQuery: 'Dambulla Cave Temple, Sri Lanka',
      categories: ['temples', 'historical'],
      galleryCat: 'temples',
      interests: ['culture'],
      region: 'Cultural Triangle',
      order: 4,
      months: [],
      timeNeeded: '1.5 to 2 hours',
      image: 'images/dambulla.jpg',
      alt: 'Rows of golden Buddha statues inside the Dambulla Cave Temple',
      short: 'Five cave sanctuaries filled with golden Buddha statues and vivid painted ceilings.',
      description: 'High on a rock above the town, the Dambulla Cave Temple is a complex of five caves with more than 150 statues of the Buddha and ceilings covered in colourful murals. The caves have been used as a place of worship since the 1st century BCE, and later kings added paintings and statues. It is a UNESCO World Heritage Site, listed in 1991, and a short climb from the foot of the hill brings you to wide views over the plains toward Sigiriya.',
      bestTime: 'Any time of year. Mornings are cooler and quieter.',
      activities: ['Explore the five painted caves', 'Enjoy the view over the plains', 'Visit the Golden Temple at the entrance'],
      tips: ['Dress modestly and remove shoes before entering the caves.', 'Macaque monkeys live on the path, so keep food out of sight.', 'Allow time for the climb, which takes around 15 to 20 minutes.'],
      nearby: [{ name: 'Sigiriya Rock Fortress', id: 'sigiriya' }, { name: 'Minneriya National Park' }, { name: 'Popham Arboretum' }]
    },
    {
      id: 'anuradhapura',
      name: 'Anuradhapura Ancient City',
      location: 'North Central Province',
      mapQuery: 'Anuradhapura Sacred City, Sri Lanka',
      categories: ['historical', 'temples'],
      galleryCat: 'historical',
      interests: ['culture'],
      region: 'Cultural Triangle',
      order: 1,
      months: [2, 3, 4, 5, 6, 7, 8, 9],
      timeNeeded: 'A full day',
      image: 'images/anuradhapura.jpg',
      alt: 'The white dome of Ruwanwelisaya stupa in the ancient city of Anuradhapura',
      short: 'Sri Lanka’s first great capital, with enormous white stupas and the sacred Bodhi tree.',
      description: 'Anuradhapura was the capital of the island’s first great kingdom, and for well over a thousand years it was a centre of political power and Buddhist learning. Its monuments include massive brick stupas such as Ruwanwelisaya and Jetavanaramaya, ruined monasteries, ancient ponds and the Sri Maha Bodhi, a sacred fig tree grown from a cutting of the tree at Bodh Gaya. The Sacred City of Anuradhapura is a UNESCO World Heritage Site, listed in 1982.',
      bestTime: 'May to September is generally the drier period. Start early because it gets very hot.',
      activities: ['Visit the Sri Maha Bodhi', 'See Ruwanwelisaya and Jetavanaramaya', 'Explore the Abhayagiri monastery ruins', 'Hire a bicycle to cover the ruins'],
      tips: ['Start at sunrise to avoid the heat.', 'Wear modest clothing and carry socks; stone paths are hot.', 'Poson Poya in June brings huge crowds of pilgrims.'],
      nearby: [{ name: 'Mihintale' }, { name: 'Wilpattu National Park' }, { name: 'Ritigala' }, { name: 'Polonnaruwa Ancient City', id: 'polonnaruwa' }]
    },
    {
      id: 'polonnaruwa',
      name: 'Polonnaruwa Ancient City',
      location: 'North Central Province',
      mapQuery: 'Polonnaruwa Ancient City, Sri Lanka',
      categories: ['historical'],
      galleryCat: 'historical',
      interests: ['culture'],
      region: 'Cultural Triangle',
      order: 2,
      months: [2, 3, 4, 5, 6, 7, 8, 9],
      timeNeeded: 'Half a day to a full day',
      image: 'images/polonnaruwa.jpg',
      alt: 'The giant carved Buddha statues of Gal Vihara at Polonnaruwa',
      short: 'A medieval capital of ruined palaces, circular relic houses and giant rock-carved Buddhas.',
      description: 'Polonnaruwa became the capital in the 11th century and flourished under kings such as Parakramabahu I, who built a huge reservoir known as the Parakrama Samudra. The site holds the ruins of a royal palace, the circular Vatadage relic house, temples and the Gal Vihara, a group of Buddha figures carved into granite. It is far more compact and walkable than Anuradhapura and was listed as a UNESCO World Heritage Site in 1982.',
      bestTime: 'February to September. Go early or late in the day to avoid the midday heat.',
      activities: ['Cycle between the ruins', 'See the Gal Vihara Buddha statues', 'Explore the Royal Palace and the Vatadage', 'Watch the sunset over Parakrama Samudra'],
      tips: ['Rent a bicycle at the gate to cover the site comfortably.', 'Start at the museum for useful context.', 'Dress modestly and carry water.'],
      nearby: [{ name: 'Minneriya National Park' }, { name: 'Kaudulla National Park' }, { name: 'Giritale' }, { name: 'Sigiriya Rock Fortress', id: 'sigiriya' }]
    },
    {
      id: 'adams-peak',
      name: 'Adam’s Peak (Sri Pada)',
      location: 'Peak Wilderness, Central Highlands',
      mapQuery: 'Adam\'s Peak (Sri Pada), Sri Lanka',
      categories: ['mountains', 'temples', 'adventure'],
      galleryCat: 'mountains',
      interests: ['adventure', 'nature', 'culture'],
      region: 'Hill Country',
      order: 6,
      months: [12, 1, 2, 3, 4],
      timeNeeded: 'A night climb (4 to 7 hours round trip)',
      image: 'images/adams-peak.jpg',
      alt: 'The cone-shaped summit of Adam’s Peak above clouds at sunrise',
      short: 'A 2,243-metre sacred mountain climbed at night by pilgrims to see sunrise from the summit.',
      description: 'Adam’s Peak, known in Sinhala as Sri Pada, rises 2,243 metres above sea level. A rock formation at the summit is revered as a sacred footprint by Buddhists, Hindus, Muslims and Christians alike. During the pilgrimage season, thousands of people climb the stairways overnight, lit by lamps along the path, to reach the top for sunrise, when the peak casts a triangular shadow across the land below.',
      bestTime: 'December to April. The pilgrimage season runs from December to about May, when the path is lit and tea stalls are open.',
      activities: ['Climb overnight for sunrise', 'Watch the triangular shadow of the peak', 'Walk through tea country on the way'],
      tips: ['Start around 2 am to reach the top before dawn.', 'Bring warm layers, a headlamp, water and snacks.', 'Dress modestly and remove shoes at the shrine.', 'Expect crowds on full-moon (Poya) days.'],
      nearby: [{ name: 'Maskeliya' }, { name: 'Laxapana Falls' }, { name: 'Hatton tea estates' }, { name: 'Kitulgala' }]
    },
    {
      id: 'arugam-bay',
      name: 'Arugam Bay',
      location: 'Ampara District, Eastern Province',
      mapQuery: 'Arugam Bay, Sri Lanka',
      categories: ['beaches', 'adventure'],
      galleryCat: 'beaches',
      interests: ['beaches', 'adventure'],
      region: 'East Coast',
      order: 10,
      months: [5, 6, 7, 8, 9],
      timeNeeded: 'Two to three days',
      image: 'images/arugam-bay.jpg',
      alt: 'A surfer riding a wave at Arugam Bay on the east coast of Sri Lanka',
      short: 'A laid-back east-coast surf town with long point breaks and lagoon safaris.',
      description: 'Arugam Bay is a relaxed surf village on the east coast, known for long, right-hand point breaks that attract surfers from around the world. When the swell is small, the water is good for swimming and stand-up paddleboarding, and Pottuvil Lagoon nearby offers boat safaris past crocodiles, birds and mangroves. Kumana National Park and the ancient Muhudu Maha Viharaya temple are within easy reach.',
      bestTime: 'May to September, the surf season, when the east coast is at its driest.',
      activities: ['Surf at Main Point or Whiskey Point', 'Take a boat safari in Pottuvil Lagoon', 'Visit Elephant Rock', 'Explore Kumana National Park'],
      tips: ['Beginners should choose gentler breaks and take a lesson.', 'Respect local dress norms away from the beach.', 'Plan for a long road journey from Colombo or the hill country.'],
      nearby: [{ name: 'Pottuvil Lagoon' }, { name: 'Kumana National Park' }, { name: 'Muhudu Maha Viharaya' }, { name: 'Yala National Park', id: 'yala' }]
    },
    {
      id: 'udawalawe',
      name: 'Udawalawe National Park',
      location: 'Sabaragamuwa and Uva Provinces',
      mapQuery: 'Udawalawe National Park, Sri Lanka',
      categories: ['wildlife'],
      galleryCat: 'wildlife',
      interests: ['wildlife', 'nature'],
      region: 'Southern Wildlife',
      order: 12,
      months: [5, 6, 7, 8, 9],
      timeNeeded: 'Half a day (a safari)',
      image: 'images/udawalawe.jpg',
      alt: 'A herd of wild elephants beside a waterhole in Udawalawe National Park',
      short: 'Open grassland and a reservoir where herds of wild elephants are reliably seen.',
      description: 'Udawalawe is built around a large reservoir and open grassland, which makes wildlife easy to spot. It is best known for its elephants, which are often seen in herds, but you may also see water buffalo, sambar deer, crocodiles and many birds. Close to the park gate, the Elephant Transit Home cares for orphaned calves until they are old enough to be released back to the wild.',
      bestTime: 'All year, with the best sightings in the dry months from May to September.',
      activities: ['Take a morning or afternoon jeep safari', 'Watch elephants at the reservoir', 'Visit the Elephant Transit Home', 'Go birdwatching'],
      tips: ['Book a licensed jeep and driver.', 'Check feeding times at the Elephant Transit Home before you go.', 'Bring a hat, sunscreen and binoculars.'],
      nearby: [{ name: 'Elephant Transit Home' }, { name: 'Udawalawe Reservoir' }, { name: 'Yala National Park', id: 'yala' }, { name: 'Ella and Nine Arch Bridge', id: 'ella' }]
    },
    {
      id: 'hikkaduwa',
      name: 'Hikkaduwa Beach',
      location: 'Galle District, Southern Province',
      mapQuery: 'Hikkaduwa Beach, Sri Lanka',
      categories: ['beaches', 'adventure'],
      galleryCat: 'beaches',
      interests: ['beaches', 'adventure'],
      region: 'South Coast',
      order: 15,
      months: [11, 12, 1, 2, 3, 4],
      timeNeeded: 'One to two days',
      image: 'images/hikkaduwa.jpg',
      alt: 'A sea turtle swimming over coral near Hikkaduwa Beach',
      short: 'A lively west-coast beach town known for coral reefs, snorkelling, surf and sea turtles.',
      description: 'Hikkaduwa is a lively beach town on the southwest coast with a long sweep of sand and a reef that shelters tropical fish and green turtles. The Hikkaduwa National Marine Park protects the coral, and you can snorkel straight from the beach or take a glass-bottom boat. There are surf breaks for all levels, plenty of cafés and restaurants, and several turtle conservation projects further along the coast.',
      bestTime: 'November to April, when seas are calmest.',
      activities: ['Snorkel on the coral reef', 'Take a glass-bottom boat trip', 'Surf the local breaks', 'Look for sea turtles'],
      tips: ['Never touch or stand on coral.', 'Support turtle projects that release hatchlings rather than keep turtles in tanks.', 'Obey red flags and swim in patrolled areas.'],
      nearby: [{ name: 'Galle Fort', id: 'galle' }, { name: 'Ambalangoda mask workshops' }, { name: 'Peraliya Tsunami Memorial' }, { name: 'Kosgoda turtle conservation projects' }]
    }
  ];

  const DEST_BY_ID = Object.fromEntries(DESTINATIONS.map(d => [d.id, d]));

  const FEATURED_IDS = ['sigiriya', 'ella', 'galle', 'mirissa'];

  /* Planner: how many stops to suggest for each trip length */
  const PLAN_STOPS = { 3: 4, 5: 7, 7: 10, 10: 14 };

  /* Gallery category -> illustration style for the fallback artwork */
  const ART_KIND = {
    beaches: 'beach',
    mountains: 'mountain',
    wildlife: 'wildlife',
    temples: 'temple',
    historical: 'historical'
  };

  /* ======================================================================
     2. HELPERS
     ====================================================================== */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Escape text before putting it into an HTML template string. */
  function esc(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Lower-case text and drop apostrophes so "adam's" matches "Adam’s". */
  function normalise(text) {
    return String(text).toLowerCase().replace(/[’'`]/g, '');
  }

  const PIN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

  /**
   * Builds a small illustrated placeholder (as an SVG data URI) for a destination.
   * It is shown only when the real photo in the images/ folder can't be loaded.
   */
  function makeArt(dest) {
    const kind = ART_KIND[dest.galleryCat] || 'mountain';
    const title = esc(dest.name);

    const scenes = {
      beach: `
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a5570"/><stop offset=".55" stop-color="#7fd0d4"/><stop offset="1" stop-color="#f7c95a"/></linearGradient>
          <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1493b0"/><stop offset="1" stop-color="#07455c"/></linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#a)"/>
        <circle cx="600" cy="215" r="64" fill="#fff4c9"/>
        <rect y="300" width="800" height="300" fill="url(#b)"/>
        <path d="M0 340 Q100 322 200 340 T400 340 T600 340 T800 340" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
        <path d="M0 392 Q100 372 200 392 T400 392 T600 392 T800 392" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
        <path d="M0 450 Q200 410 420 450 T800 430 V600 H0Z" fill="#f3d58a"/>
        <path d="M170 500 C190 420 200 380 245 330" fill="none" stroke="#5b3d1c" stroke-width="12" stroke-linecap="round"/>
        <path d="M245 330 C200 300 160 310 130 345 C175 325 210 325 245 330Z M245 330 C270 290 320 285 355 310 C315 305 280 312 245 330Z M245 330 C240 285 255 255 285 235 C270 265 262 295 245 330Z" fill="#1b6040"/>`,
      mountain: `
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a5570"/><stop offset=".5" stop-color="#9fd8df"/><stop offset="1" stop-color="#eef8f4"/></linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#a)"/>
        <circle cx="620" cy="170" r="50" fill="#fff4c9" opacity=".9"/>
        <path d="M0 360 L120 250 L230 340 L360 200 L500 330 L610 260 L800 370 V600 H0Z" fill="#6aa98a" opacity=".6"/>
        <path d="M0 430 C120 360 220 350 330 400 C450 450 560 330 680 360 C740 375 780 400 800 410 V600 H0Z" fill="#2f7a56"/>
        <path d="M0 500 C140 450 260 470 400 500 C540 530 680 470 800 490 V600 H0Z" fill="#1b6040"/>
        <path d="M0 520 C140 475 260 490 400 520 C540 548 680 495 800 512" fill="none" stroke="#5fa17f" stroke-opacity=".6" stroke-width="3"/>`,
      wildlife: `
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e7c9b"/><stop offset=".6" stop-color="#f7c95a"/><stop offset="1" stop-color="#f2a03a"/></linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#a)"/>
        <circle cx="440" cy="370" r="95" fill="#fff0b8" opacity=".95"/>
        <path d="M0 420 C200 400 600 400 800 420 V600 H0Z" fill="#7a9a3f"/>
        <path d="M0 470 C250 450 550 460 800 450 V600 H0Z" fill="#2f7a56"/>
        <path d="M130 480 V385 M130 405 L95 365 M130 415 L168 372" stroke="#0f3a25" stroke-width="10" stroke-linecap="round" fill="none"/>
        <ellipse cx="130" cy="352" rx="100" ry="26" fill="#0f3a25"/>
        <path d="M650 470 V415 M650 425 L628 400" stroke="#0f3a25" stroke-width="7" stroke-linecap="round" fill="none"/>
        <ellipse cx="650" cy="394" rx="62" ry="17" fill="#0f3a25"/>`,
      historical: `
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a5570"/><stop offset=".5" stop-color="#5cc2c6"/><stop offset="1" stop-color="#f7c95a"/></linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#a)"/>
        <circle cx="650" cy="190" r="52" fill="#fff4c9"/>
        <path d="M215 470 C245 360 290 320 318 262 L330 240 L470 240 L486 262 C520 320 565 360 600 470 Z" fill="#123d27"/>
        <path d="M320 240 h160 v-14 h-160z" fill="#1b6040"/>
        <path d="M0 470 C120 430 220 440 330 470 C450 500 560 430 680 460 C740 475 780 470 800 462 V600 H0Z" fill="#1b6040"/>
        <path d="M0 520 C150 490 300 520 450 505 C600 490 700 515 800 500 V600 H0Z" fill="#0f3a25"/>`,
      temple: `
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a5570"/><stop offset=".7" stop-color="#f7c95a"/><stop offset="1" stop-color="#f2b632"/></linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#a)"/>
        <circle cx="620" cy="170" r="46" fill="#fff4c9"/>
        <rect x="260" y="470" width="280" height="24" fill="#e9dfc2"/>
        <rect x="285" y="446" width="230" height="24" fill="#f6efd6"/>
        <path d="M310 446 A90 90 0 0 1 490 446 Z" fill="#fffaf0"/>
        <rect x="388" y="322" width="24" height="36" fill="#fffaf0"/>
        <path d="M400 262 L412 322 H388 Z" fill="#f2b632"/>
        <path d="M0 500 C100 470 200 480 270 500 V600 H0Z" fill="#1b6040"/>
        <path d="M800 500 C700 470 600 480 530 500 V600 H800Z" fill="#1b6040"/>`
    };

    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="' + title + '">' +
      scenes[kind] +
      '<rect y="516" width="800" height="84" fill="#062f40" fill-opacity=".62"/>' +
      '<text x="32" y="568" font-family="Georgia, Times New Roman, serif" font-size="32" fill="#ffffff">' + title + '</text>' +
      '</svg>';

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /**
   * Looks for <img data-art="destination-id"> inside a container and swaps in the
   * generated artwork if the real photo fails to load (missing file, no network, etc.).
   */
  function armImageFallbacks(root) {
    $$('img[data-art]', root).forEach(img => {
      const dest = DEST_BY_ID[img.dataset.art];
      if (!dest) return;

      // Read the destination at failure time, because the lightbox reuses one <img>.
      const useFallback = () => {
        const current = DEST_BY_ID[img.dataset.art];
        if (img.dataset.failed || !current) return;
        img.dataset.failed = 'true';
        img.src = makeArt(current);
      };

      // Assigning onerror (rather than adding listeners) means re-arming never stacks handlers.
      img.onerror = useFallback;
      // Handles an image that already failed before this listener was attached.
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) useFallback();
    });
  }

  /** Returns the first focusable elements inside a container (for focus trapping). */
  function getFocusable(container) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(el => !el.hidden && el.offsetParent !== null);
  }

  /** Smooth-scroll helper that respects the reduced-motion setting. */
  function scrollToElement(el) {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ======================================================================
     3. NAVIGATION AND PAGE EFFECTS
     ====================================================================== */

  function initNavigation() {
    const header = $('#site-header');
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');

    function setMenu(open) {
      menu.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));

    // Close the mobile menu after choosing a link.
    $$('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 920) setMenu(false);
    });

    // Solid header background once the page is scrolled.
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Highlight the nav link for the section currently in view.
    const links = $$('a[href^="#"]', menu);
    const sections = links.map(link => $(link.getAttribute('href'))).filter(Boolean);

    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          links.forEach(link => {
            const active = link.getAttribute('href') === '#' + entry.target.id;
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(section => spy.observe(section));
    }
  }

  /** Fades elements in as they scroll into view. */
  function initScrollReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => observer.observe(el));
  }

  /** Hero strip: shows places that suit the current month. */
  function renderSeason() {
    const container = $('#season');
    const now = new Date();
    const month = now.getMonth() + 1;
    const monthName = now.toLocaleString('en-GB', { month: 'long' });

    let picks = DESTINATIONS.filter(d => d.months.includes(month));
    let label = 'Good to visit in ' + monthName + ':';

    if (picks.length === 0) {
      picks = DESTINATIONS.filter(d => d.months.length === 0);
      label = monthName + ' falls between monsoons. Year-round favourites:';
    }

    picks = picks.slice(0, 5);
    container.innerHTML =
      '<span class="season-label">' + esc(label) + '</span>' +
      picks.map(d => '<button type="button" class="chip" data-open="' + esc(d.id) + '">' + esc(d.name) + '</button>').join('');
  }

  /* ======================================================================
     4. DESTINATION CARDS, SEARCH, FILTER AND SORT
     ====================================================================== */

  const state = { query: '', category: 'all', sort: 'featured' };

  function cardHTML(dest, index) {
    const label = CATEGORY_LABELS[dest.categories[0]];
    return `
      <article class="card" style="animation-delay:${Math.min(index, 8) * 40}ms">
        <div class="card-media">
          <img src="${esc(dest.image)}" alt="${esc(dest.alt)}" width="800" height="600" loading="lazy" decoding="async" data-art="${esc(dest.id)}">
          <span class="pill">${esc(label)}</span>
        </div>
        <div class="card-body">
          <h3>${esc(dest.name)}</h3>
          <p class="card-loc">${PIN_ICON}<span>${esc(dest.location)}</span></p>
          <p class="card-desc">${esc(dest.short)}</p>
          <button type="button" class="btn btn-outline" data-open="${esc(dest.id)}" aria-label="View Details: ${esc(dest.name)}">View Details</button>
        </div>
      </article>`;
  }

  /** Applies the current search, category and sort to the destination list. */
  function getVisibleDestinations() {
    const query = normalise(state.query.trim());

    let list = DESTINATIONS.filter(dest => {
      const inCategory = state.category === 'all' || dest.categories.includes(state.category);
      if (!inCategory) return false;
      if (!query) return true;
      const haystack = normalise([dest.name, dest.location, ...dest.categories.map(c => CATEGORY_LABELS[c])].join(' '));
      return haystack.includes(query);
    });

    if (state.sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }

  function renderDestinations() {
    const grid = $('#destination-grid');
    const empty = $('#empty-state');
    const count = $('#result-count');
    const list = getVisibleDestinations();

    grid.innerHTML = list.map(cardHTML).join('');
    armImageFallbacks(grid);

    empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;

    if (list.length === 0) {
      count.textContent = 'No destinations found.';
    } else {
      count.textContent = 'Showing ' + list.length + ' of ' + DESTINATIONS.length + ' destinations';
    }
  }

  function renderCategoryFilters() {
    const container = $('#category-filters');
    const filters = [{ id: 'all', label: 'All' }].concat(
      Object.keys(CATEGORY_LABELS).map(id => ({ id, label: CATEGORY_LABELS[id] }))
    );

    container.innerHTML = filters.map(f =>
      '<button type="button" class="filter-btn" data-category="' + f.id + '" aria-pressed="' + (f.id === state.category) + '">' + esc(f.label) + '</button>'
    ).join('');
  }

  function renderFeatured() {
    const grid = $('#featured-grid');
    grid.innerHTML = FEATURED_IDS.map(id => {
      const dest = DEST_BY_ID[id];
      return `
        <article class="feature">
          <img src="${esc(dest.image)}" alt="${esc(dest.alt)}" width="800" height="600" loading="lazy" decoding="async" data-art="${esc(dest.id)}">
          <div class="feature-body">
            <span class="pill">${esc(CATEGORY_LABELS[dest.categories[0]])}</span>
            <h3>${esc(dest.name)}</h3>
            <p>${esc(dest.short)}</p>
            <button type="button" class="btn btn-gold" data-open="${esc(dest.id)}" aria-label="View Details: ${esc(dest.name)}">View Details</button>
          </div>
        </article>`;
    }).join('');
    armImageFallbacks(grid);
  }

  function initDestinationControls() {
    const search = $('#search-input');
    const sort = $('#sort-select');
    const filters = $('#category-filters');

    // Wait briefly after typing stops so the list doesn't re-render on every key press.
    let timer;
    search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.query = search.value;
        renderDestinations();
      }, 150);
    });

    sort.addEventListener('change', () => {
      state.sort = sort.value;
      renderDestinations();
    });

    filters.addEventListener('click', event => {
      const btn = event.target.closest('[data-category]');
      if (!btn) return;
      state.category = btn.dataset.category;
      $$('.filter-btn', filters).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderDestinations();
    });

    $('#reset-filters').addEventListener('click', () => {
      state.query = '';
      state.category = 'all';
      state.sort = 'featured';
      search.value = '';
      sort.value = 'featured';
      renderCategoryFilters();
      renderDestinations();
      search.focus();
    });
  }

  /* ======================================================================
     5. DETAILS MODAL
     ====================================================================== */

  const modal = {
    root: null, panel: null, content: null, lastFocus: null, closing: false
  };

  function modalHTML(dest) {
    const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(dest.mapQuery);
    const cats = dest.categories.map(c => CATEGORY_LABELS[c]).join(', ');

    const nearby = dest.nearby.map(item => {
      if (item.id && DEST_BY_ID[item.id]) {
        return '<li><button type="button" class="link-btn nearby-btn" data-open="' + esc(item.id) + '">' + esc(item.name) + '</button></li>';
      }
      return '<li>' + esc(item.name) + '</li>';
    }).join('');

    return `
      <div class="modal-hero">
        <img src="${esc(dest.image)}" alt="${esc(dest.alt)}" width="800" height="600" decoding="async" data-art="${esc(dest.id)}">
        <div class="modal-hero-text">
          <span class="pill">${esc(cats)}</span>
          <h2 id="modal-title">${esc(dest.name)}</h2>
          <p class="card-loc">${PIN_ICON}<span>${esc(dest.location)}</span></p>
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-main">
          <h3>About this destination</h3>
          <p>${esc(dest.description)}</p>
          <h3>Popular activities</h3>
          <ul class="check-list">${dest.activities.map(a => '<li>' + esc(a) + '</li>').join('')}</ul>
          <h3>Travel tips</h3>
          <ul class="check-list tip-list">${dest.tips.map(t => '<li>' + esc(t) + '</li>').join('')}</ul>
        </div>
        <aside class="modal-side" aria-label="Quick facts">
          <h3>Location</h3>
          <p>${esc(dest.location)}<br><a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Open in Google Maps (new tab)</a></p>
          <h3>Best time to visit</h3>
          <p>${esc(dest.bestTime)}</p>
          <h3>Time to allow</h3>
          <p>${esc(dest.timeNeeded)}</p>
          <h3>Nearby attractions</h3>
          <ul class="check-list">${nearby}</ul>
        </aside>
      </div>`;
  }

  function openModal(id, trigger) {
    const dest = DEST_BY_ID[id];
    if (!dest) return;

    // When switching between destinations from inside the modal, keep the original opener.
    if (modal.root.hidden) modal.lastFocus = trigger || document.activeElement;
    modal.closing = false;

    modal.content.innerHTML = modalHTML(dest);
    armImageFallbacks(modal.content);

    modal.root.hidden = false;
    document.body.classList.add('no-scroll');
    modal.panel.scrollTop = 0;
    requestAnimationFrame(() => modal.root.classList.add('is-open'));
    $('.modal-close', modal.root).focus();
  }

  function closeModal() {
    if (modal.root.hidden || modal.closing) return;
    modal.closing = true;
    modal.root.classList.remove('is-open');

    setTimeout(() => {
      if (!modal.closing) return;
      modal.root.hidden = true;
      modal.closing = false;
      document.body.classList.remove('no-scroll');
      if (modal.lastFocus && document.contains(modal.lastFocus)) modal.lastFocus.focus();
    }, prefersReducedMotion() ? 0 : 250);
  }

  function initModal() {
    modal.root = $('#modal');
    modal.panel = $('#modal-panel');
    modal.content = $('#modal-content');

    // One listener handles every "open details" button on the page, including ones added later.
    document.addEventListener('click', event => {
      const opener = event.target.closest('[data-open]');
      if (opener) openModal(opener.dataset.open, opener);
      if (event.target.closest('[data-close-modal]')) closeModal();
    });

    document.addEventListener('keydown', event => {
      if (modal.root.hidden) return;
      if (event.key === 'Escape') {
        closeModal();
      } else if (event.key === 'Tab') {
        // Keep keyboard focus inside the dialog while it is open.
        const focusable = getFocusable(modal.panel);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ======================================================================
     6. TRIP PLANNER
     ====================================================================== */

  let currentPlan = null;

  /** How well a destination matches the chosen interests (0 to 5). */
  function interestScore(dest, interests) {
    return dest.interests.filter(i => interests.includes(i)).length;
  }

  /**
   * Chooses stops for the trip.
   * 1. Destinations are sorted into a sensible route order.
   * 2. A window of neighbouring stops with the best interest score is chosen,
   *    so each trip stays in one part of the island.
   * 3. Inside that window, the best-matching stops are kept in route order.
   */
  function chooseStops(days, interests) {
    const target = PLAN_STOPS[days];
    const ordered = [...DESTINATIONS].sort((a, b) => a.order - b.order);
    const windowSize = Math.min(ordered.length, target + 2);

    let bestStart = 0;
    let bestScore = -1;
    for (let start = 0; start + windowSize <= ordered.length; start++) {
      const total = ordered
        .slice(start, start + windowSize)
        .reduce((sum, dest) => sum + interestScore(dest, interests), 0);
      if (total > bestScore) {
        bestScore = total;
        bestStart = start;
      }
    }

    return ordered
      .slice(bestStart, bestStart + windowSize)
      .map((dest, index) => ({ dest, index, score: interestScore(dest, interests) }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, target)
      .sort((a, b) => a.index - b.index)
      .map(item => item.dest);
  }

  /** Splits the stops across the days as evenly as possible (earlier days get the extra stop). */
  function splitIntoDays(stops, days) {
    const base = Math.floor(stops.length / days);
    const extra = stops.length % days;
    const result = [];
    let cursor = 0;
    for (let day = 0; day < days; day++) {
      const size = base + (day < extra ? 1 : 0);
      result.push(stops.slice(cursor, cursor + size));
      cursor += size;
    }
    return result;
  }

  function buildItinerary(days, interests) {
    const stops = chooseStops(days, interests);
    return { days, interests, schedule: splitIntoDays(stops, days) };
  }

  function listJoin(items) {
    if (items.length <= 1) return items.join('');
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }

  function unique(items) {
    return items.filter((item, index) => items.indexOf(item) === index);
  }

  function renderItinerary(plan) {
    const container = $('#itinerary');
    const interestText = listJoin(plan.interests.map(i => INTEREST_LABELS[i].toLowerCase()));
    const allStops = plan.schedule.flat();
    const route = unique(allStops.map(d => d.region)).join(' → ');

    const dayHTML = plan.schedule.map((stops, index) => {
      const regions = unique(stops.map(d => d.region)).join(' → ');
      const stopHTML = stops.map(dest => {
        const matches = dest.interests.filter(i => plan.interests.includes(i));
        const why = matches.length
          ? 'Matches your interest in ' + listJoin(matches.map(i => INTEREST_LABELS[i].toLowerCase())) + '.'
          : 'A worthwhile stop on the way.';
        return `
          <li class="stop">
            <div class="stop-title">
              <button type="button" class="link-btn" data-open="${esc(dest.id)}">${esc(dest.name)}</button>
              <span class="tag">${esc(CATEGORY_LABELS[dest.categories[0]])}</span>
            </div>
            <p>${esc(dest.short)}</p>
            <p class="meta"><strong>${esc(why)}</strong> Allow: ${esc(dest.timeNeeded)}.</p>
            <p class="meta">Tip: ${esc(dest.tips[0])}</p>
          </li>`;
      }).join('');

      return `
        <li class="day" style="animation-delay:${index * 60}ms">
          <div class="day-badge">Day ${index + 1}</div>
          <div class="day-body">
            <h4>${esc(regions)}</h4>
            <ul class="stop-list">${stopHTML}</ul>
          </div>
        </li>`;
    }).join('');

    container.innerHTML = `
      <div class="itinerary-head">
        <div>
          <h3>Your ${plan.days}-day itinerary</h3>
          <p>Interests: ${esc(interestText)}. Route: ${esc(route)}.</p>
        </div>
        <div class="itinerary-actions">
          <button type="button" class="btn btn-outline" id="copy-itinerary">Copy itinerary</button>
        </div>
      </div>
      <ol class="day-list">${dayHTML}</ol>
      <p class="itinerary-note">This is a suggested pace, not a booking. Roads in Sri Lanka are slower than distances suggest, so check travel times, opening hours and seasons before you commit.</p>`;

    $('#copy-itinerary').addEventListener('click', copyItinerary);
  }

  /** Plain-text version of the plan for the clipboard. */
  function itineraryAsText(plan) {
    const lines = ['Explore Sri Lanka: ' + plan.days + '-day itinerary', ''];
    plan.schedule.forEach((stops, index) => {
      lines.push('Day ' + (index + 1));
      stops.forEach(dest => lines.push('  - ' + dest.name + ' (' + dest.location + ')'));
      lines.push('');
    });
    return lines.join('\n');
  }

  function copyItinerary(event) {
    if (!currentPlan) return;
    const button = event.currentTarget;
    const text = itineraryAsText(currentPlan);

    const done = () => {
      button.textContent = 'Copied!';
      setTimeout(() => { button.textContent = 'Copy itinerary'; }, 2000);
    };

    // Older fallback that also works when the page is opened as a local file.
    const fallbackCopy = () => {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
        done();
      } catch (err) {
        button.textContent = 'Copy failed';
      }
      document.body.removeChild(area);
      button.focus();
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function readPlannerForm() {
    const form = $('#planner-form');
    const days = Number(new FormData(form).get('duration'));
    const interests = $$('input[name="interests"]:checked', form).map(input => input.value);
    return { days, interests };
  }

  function generateFromForm() {
    const error = $('#planner-error');
    const { days, interests } = readPlannerForm();

    if (interests.length === 0) {
      error.textContent = 'Choose at least one interest so the planner knows what to suggest.';
      error.hidden = false;
      $('input[name="interests"]').focus();
      return false;
    }

    error.hidden = true;
    currentPlan = buildItinerary(days, interests);
    renderItinerary(currentPlan);
    return true;
  }

  /** Fills the planner from a "Travel inspiration" card and builds the itinerary. */
  function applyPreset(days, interests) {
    const form = $('#planner-form');
    $$('input[name="duration"]', form).forEach(input => { input.checked = Number(input.value) === days; });
    $$('input[name="interests"]', form).forEach(input => { input.checked = interests.includes(input.value); });
    if (generateFromForm()) {
      const result = $('#itinerary');
      scrollToElement(result);
      result.focus({ preventScroll: true });
    }
  }

  function initPlanner() {
    const form = $('#planner-form');

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (generateFromForm()) {
        const result = $('#itinerary');
        scrollToElement(result);
        result.focus({ preventScroll: true });
      }
    });

    form.addEventListener('reset', () => {
      currentPlan = null;
      $('#planner-error').hidden = true;
      $('#itinerary').innerHTML = '<p class="itinerary-empty">Your itinerary will appear here.</p>';
    });

    // Clear the error once the visitor picks an interest.
    form.addEventListener('change', () => {
      if (readPlannerForm().interests.length > 0) $('#planner-error').hidden = true;
    });

    $$('[data-preset]').forEach(button => {
      button.addEventListener('click', () => {
        const [days, list] = button.dataset.preset.split('|');
        applyPreset(Number(days), list.split(','));
      });
    });
  }

  /* ======================================================================
     7. PHOTO GALLERY AND LIGHTBOX
     ====================================================================== */

  const gallery = { filter: 'all', items: [] };

  const lightbox = { root: null, img: null, caption: null, index: 0, lastFocus: null };

  function renderGalleryFilters() {
    const container = $('#gallery-filters');
    container.innerHTML = GALLERY_FILTERS.map(f =>
      '<button type="button" class="filter-btn" data-gallery="' + f.id + '" aria-pressed="' + (f.id === gallery.filter) + '">' + esc(f.label) + '</button>'
    ).join('');
  }

  function renderGallery() {
    const grid = $('#gallery-grid');
    gallery.items = DESTINATIONS.filter(d => gallery.filter === 'all' || d.galleryCat === gallery.filter);

    grid.innerHTML = gallery.items.map((dest, index) => `
      <button type="button" class="gallery-item" data-index="${index}" style="animation-delay:${Math.min(index, 8) * 40}ms" aria-label="Open photo: ${esc(dest.name)}">
        <img src="${esc(dest.image)}" alt="${esc(dest.alt)}" width="800" height="600" loading="lazy" decoding="async" data-art="${esc(dest.id)}">
        <span class="gallery-cap">${esc(dest.name)}</span>
      </button>`).join('');

    armImageFallbacks(grid);
  }

  function showLightboxImage(index) {
    const count = gallery.items.length;
    lightbox.index = (index + count) % count;
    const dest = gallery.items[lightbox.index];

    lightbox.img.classList.add('is-fading');

    setTimeout(() => {
      delete lightbox.img.dataset.failed;
      lightbox.img.dataset.art = dest.id;
      lightbox.img.alt = dest.alt;
      lightbox.img.src = dest.image;
      lightbox.caption.textContent = dest.name + ' (' + (lightbox.index + 1) + ' of ' + count + ')';
      armImageFallbacks(lightbox.root);
      requestAnimationFrame(() => lightbox.img.classList.remove('is-fading'));
    }, prefersReducedMotion() ? 0 : 180);
  }

  function openLightbox(index, trigger) {
    lightbox.lastFocus = trigger;
    lightbox.root.hidden = false;
    document.body.classList.add('no-scroll');
    showLightboxImage(index);
    $('#lb-close').focus();
  }

  function closeLightbox() {
    lightbox.root.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lightbox.lastFocus && document.contains(lightbox.lastFocus)) lightbox.lastFocus.focus();
  }

  function initGallery() {
    lightbox.root = $('#lightbox');
    lightbox.img = $('#lb-img');
    lightbox.caption = $('#lb-caption');

    $('#gallery-filters').addEventListener('click', event => {
      const btn = event.target.closest('[data-gallery]');
      if (!btn) return;
      gallery.filter = btn.dataset.gallery;
      $$('#gallery-filters .filter-btn').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderGallery();
    });

    $('#gallery-grid').addEventListener('click', event => {
      const item = event.target.closest('.gallery-item');
      if (item) openLightbox(Number(item.dataset.index), item);
    });

    $('#lb-close').addEventListener('click', closeLightbox);
    $('#lb-prev').addEventListener('click', () => showLightboxImage(lightbox.index - 1));
    $('#lb-next').addEventListener('click', () => showLightboxImage(lightbox.index + 1));

    // Click the dark area around the photo to close.
    lightbox.root.addEventListener('click', event => {
      if (event.target === lightbox.root) closeLightbox();
    });

    document.addEventListener('keydown', event => {
      if (lightbox.root.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      else if (event.key === 'ArrowLeft') showLightboxImage(lightbox.index - 1);
      else if (event.key === 'ArrowRight') showLightboxImage(lightbox.index + 1);
      else if (event.key === 'Tab') {
        const focusable = getFocusable(lightbox.root);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ======================================================================
     8. CONTACT FORM VALIDATION
     ====================================================================== */

  const VALIDATORS = {
    name: value => value.trim().length < 2 ? 'Enter your full name (at least 2 characters).' : '',
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Enter a valid email address, like name@example.com.',
    subject: value => value.trim().length < 3 ? 'Enter a subject (at least 3 characters).' : '',
    message: value => value.trim().length < 10 ? 'Write a message of at least 10 characters.' : ''
  };

  function validateField(input) {
    const message = VALIDATORS[input.name](input.value);
    const errorEl = $('#' + input.id + '-error');
    errorEl.textContent = message;
    errorEl.hidden = message === '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return message === '';
  }

  function initContactForm() {
    const form = $('#contact-form');
    const success = $('#form-success');
    const fields = $$('input, textarea', form);

    // Check each field when the visitor leaves it, and keep re-checking once it has an error.
    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const results = fields.map(field => validateField(field));
      const firstInvalid = fields.find((field, index) => !results[index]);

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const firstName = $('#name').value.trim().split(/\s+/)[0];
      $('#success-text').textContent =
        'Thank you, ' + firstName + '. Your entries passed the checks. This demo website has no server, so your message was not sent anywhere. ' +
        'To receive real messages, connect the form to a backend or an external form service such as Formspree, Netlify Forms or EmailJS.';

      form.hidden = true;
      success.hidden = false;
      success.focus();
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
    });

    $('#send-another').addEventListener('click', () => {
      success.hidden = true;
      form.hidden = false;
      $('#name').focus();
    });
  }

  /* ======================================================================
     9. START-UP
     ====================================================================== */

  function init() {
    $('#year').textContent = new Date().getFullYear();

    initNavigation();
    renderSeason();
    renderFeatured();

    renderCategoryFilters();
    renderDestinations();
    initDestinationControls();

    initModal();
    initPlanner();

    renderGalleryFilters();
    renderGallery();
    initGallery();

    initContactForm();
    initScrollReveal();
  }

  init();
})();
