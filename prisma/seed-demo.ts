import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("🌴 Seeding Travel Stall demo content...\n");

  // ── Find the tenant ────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.findUnique({ where: { slug: "travelstall" } });
  if (!tenant) throw new Error('Tenant "travelstall" not found. Create it first.');
  const tenantId = tenant.id;

  // ── Find owner user for blog posts ─────────────────────────────────────────
  const membership = await prisma.membership.findFirst({
    where: { tenantId, role: "OWNER" },
    include: { user: true },
  });
  if (!membership) throw new Error("No OWNER membership found for travelstall tenant.");
  const authorId = membership.userId;

  // ── Update tenant theme & description ──────────────────────────────────────
  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      themeKey: "tropical-paradise",
      description:
        "Your gateway to unforgettable journeys — curated travel experiences that inspire, transform, and connect you to the world's most breathtaking destinations.",
    },
  });
  console.log("✅ Tenant theme and description updated");

  // ── Clean existing demo data ───────────────────────────────────────────────
  await prisma.postTag.deleteMany({ where: { post: { tenantId } } });
  await prisma.postCategory.deleteMany({ where: { post: { tenantId } } });
  await prisma.post.deleteMany({ where: { tenantId } });
  await prisma.page.deleteMany({ where: { tenantId } });
  await prisma.category.deleteMany({ where: { tenantId } });
  await prisma.tag.deleteMany({ where: { tenantId } });
  await prisma.menuItem.deleteMany({ where: { tenantId } });
  await prisma.subscriber.deleteMany({ where: { tenantId } });
  console.log("✅ Cleared existing content");

  // ════════════════════════════════════════════════════════════════════════════
  // PAGES
  // ════════════════════════════════════════════════════════════════════════════

  const pages = [
    {
      slug: "home",
      title: "Welcome to Travel Stall",
      sortOrder: 0,
      metaTitle: "Travel Stall — Your Gateway to Unforgettable Journeys",
      metaDesc: "Discover curated travel experiences to the world's most breathtaking destinations. Custom itineraries, group tours, luxury getaways, and more.",
      ogImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=630&fit=crop",
      content: `
<section class="hero">
  <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&h=600&fit=crop" alt="Traveler overlooking a stunning mountain landscape" style="width:100%;border-radius:12px;" />
  <h1>Explore the World with Travel Stall</h1>
  <p><strong>Curated journeys. Unforgettable memories.</strong> Whether you're chasing sunsets in Bali, trekking through the Swiss Alps, or discovering ancient temples in Japan — we craft travel experiences that stay with you forever.</p>
</section>

<h2>Featured Destinations</h2>
<p>From tropical paradises to snow-capped peaks, our hand-picked destinations offer something for every kind of traveler.</p>
<ul>
  <li><strong>Bali, Indonesia</strong> — Lush rice terraces, sacred temples, and world-class surf</li>
  <li><strong>Maldives</strong> — Crystal-clear waters and overwater bungalows</li>
  <li><strong>Switzerland</strong> — Alpine grandeur, chocolate, and scenic train rides</li>
  <li><strong>Kenya</strong> — The Big Five and the Great Migration</li>
  <li><strong>Japan</strong> — Where ancient tradition meets cutting-edge modernity</li>
</ul>
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=500&fit=crop" alt="Beautiful tropical beach at sunset" style="width:100%;border-radius:12px;margin:20px 0;" />

<h2>Why Choose Travel Stall?</h2>
<ul>
  <li><strong>Expert Local Guides</strong> — Our destination specialists live where they lead, giving you authentic insider access.</li>
  <li><strong>Tailored Itineraries</strong> — No cookie-cutter tours. Every trip is designed around your interests, pace, and budget.</li>
  <li><strong>24/7 Support</strong> — From booking to boarding and beyond, our travel concierge team is always a call away.</li>
  <li><strong>Best Price Guarantee</strong> — We negotiate exclusive rates with hotels, airlines, and activity providers.</li>
  <li><strong>Sustainable Travel</strong> — We partner with eco-certified operators and offset carbon for every trip.</li>
</ul>

<h2>What Our Travelers Say</h2>
<blockquote>
  <p>"Travel Stall transformed our honeymoon into a fairy tale. The Maldives overwater villa, the private dinner on the beach — everything was flawless."</p>
  <p><em>— Sarah &amp; James, London</em></p>
</blockquote>
<blockquote>
  <p>"I've used many travel agencies, but the level of personalization here is unmatched. Our Japan itinerary hit every note perfectly."</p>
  <p><em>— Priya Menon, Mumbai</em></p>
</blockquote>
<blockquote>
  <p>"From the moment I inquired to the day I returned, the team was responsive, professional, and genuinely passionate about making my trip special."</p>
  <p><em>— Carlos Rivera, Madrid</em></p>
</blockquote>

<h2>Ready to Start Your Journey?</h2>
<p>Browse our <a href="/destinations">destinations</a>, explore our <a href="/services">services</a>, or <a href="/contact">get in touch</a> with our travel experts today. Your next adventure is just a conversation away.</p>
      `.trim(),
    },
    {
      slug: "about",
      title: "About Us",
      sortOrder: 1,
      metaTitle: "About Travel Stall — Our Story, Mission & Team",
      metaDesc: "Learn about Travel Stall's journey from a small travel blog to a trusted global travel agency serving thousands of happy travelers.",
      ogImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop",
      content: `
<img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=500&fit=crop" alt="Travel Stall team collaborating" style="width:100%;border-radius:12px;" />

<h2>Our Story</h2>
<p>Travel Stall was founded in 2018 by a group of passionate travelers who believed that everyone deserves access to extraordinary travel experiences — not just the ultra-wealthy. What started as a small travel blog sharing destination guides and budget tips quickly grew into a full-service travel agency serving thousands of clients across 40+ countries.</p>
<p>Today, we are a team of 35 dedicated travel professionals, destination specialists, and customer experience experts based in Mumbai, with partner offices in London, Dubai, and Singapore.</p>

<h2>Our Mission</h2>
<p><strong>To make transformative travel accessible to everyone.</strong> We believe travel is not a luxury — it's an education, a therapy, and a bridge between cultures. Our mission is to design journeys that are thoughtful, responsible, and deeply personal.</p>

<h2>What Sets Us Apart</h2>
<ul>
  <li><strong>Destination Expertise:</strong> Our team members have collectively visited over 120 countries. We don't sell destinations we haven't experienced firsthand.</li>
  <li><strong>Relationship-First Approach:</strong> We build lasting relationships with our clients. Over 60% of our business comes from repeat travelers and referrals.</li>
  <li><strong>Technology + Human Touch:</strong> Our platform streamlines booking and planning, but every itinerary is reviewed and refined by a human expert.</li>
</ul>

<h2>Meet the Team</h2>

<h3>Arjun Mehta — Founder &amp; CEO</h3>
<p>A former management consultant turned travel entrepreneur, Arjun has visited 85 countries and believes the best business meetings happen over street food. He leads the company's vision and strategic partnerships.</p>

<h3>Priya Sharma — Head of Destinations</h3>
<p>With 12 years in the travel industry and a specialization in luxury and experiential travel, Priya curates our destination portfolio and trains our specialist team. Her favorite destination? "Whichever one I haven't been to yet."</p>

<h3>David Chen — Director of Operations</h3>
<p>David ensures every trip runs like clockwork. From flight logistics to hotel confirmations, his operations team handles the complexity so our travelers can focus on the experience.</p>

<h3>Aisha Patel — Customer Experience Lead</h3>
<p>Aisha and her team are the voice of Travel Stall — always available, always empathetic, always solution-oriented. She has a near-perfect customer satisfaction score and believes that great service is invisible.</p>

<h2>Our Numbers</h2>
<ul>
  <li><strong>8,500+</strong> happy travelers served</li>
  <li><strong>120+</strong> destinations worldwide</li>
  <li><strong>4.9/5</strong> average customer rating</li>
  <li><strong>98%</strong> trip satisfaction rate</li>
</ul>
      `.trim(),
    },
    {
      slug: "destinations",
      title: "Destinations",
      sortOrder: 2,
      metaTitle: "Explore Our Destinations — Travel Stall",
      metaDesc: "Browse our curated collection of destinations spanning tropical beaches, alpine adventures, cultural expeditions, and wildlife safaris across the globe.",
      ogImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=630&fit=crop",
      content: `
<h2>Explore the World's Most Inspiring Destinations</h2>
<p>Every destination in our portfolio has been personally vetted by our travel specialists. We select locations not just for their beauty, but for the depth of experience they offer — from cultural immersion to adrenaline-pumping adventure.</p>

<img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=500&fit=crop" alt="Bali rice terraces" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Bali, Indonesia</h3>
<p>Emerald rice paddies, ancient Hindu temples, world-class surfing, and a wellness culture that draws visitors back year after year. Bali is the perfect blend of adventure, relaxation, and spiritual discovery.</p>
<p><strong>Best for:</strong> Honeymoons, wellness retreats, surf trips, cultural exploration</p>

<img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&h=500&fit=crop" alt="Maldives overwater villas" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Maldives</h3>
<p>The ultimate tropical escape — pristine white-sand beaches, turquoise lagoons, vibrant coral reefs, and some of the world's most luxurious overwater villas. The Maldives is where paradise becomes reality.</p>
<p><strong>Best for:</strong> Luxury getaways, honeymoons, diving &amp; snorkeling</p>

<img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&h=500&fit=crop" alt="Swiss Alps" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Switzerland</h3>
<p>Snow-capped peaks, pristine lakes, charming alpine villages, and the legendary Glacier Express. Switzerland delivers breathtaking scenery in every season, paired with world-renowned chocolate, cheese, and hospitality.</p>
<p><strong>Best for:</strong> Scenic train journeys, skiing, hiking, romantic getaways</p>

<img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=500&fit=crop" alt="Kenya safari with elephants" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Kenya</h3>
<p>Witness the Great Migration across the Masai Mara, spot the Big Five on a guided game drive, and experience the warmth of Kenyan culture. A safari in Kenya is a bucket-list experience that changes how you see the natural world.</p>
<p><strong>Best for:</strong> Wildlife safaris, photography, cultural encounters</p>

<img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=500&fit=crop" alt="Japanese temple in autumn" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Japan</h3>
<p>A country of mesmerizing contrasts — ancient Shinto shrines stand beside neon-lit skyscrapers, and tranquil tea ceremonies coexist with bullet trains. Japan offers an unparalleled cultural journey for the curious traveler.</p>
<p><strong>Best for:</strong> Culture, food, cherry blossom season, technology</p>

<img src="https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=500&fit=crop" alt="Machu Picchu, Peru" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Peru</h3>
<p>From the mystical ruins of Machu Picchu to the vibrant streets of Lima, Peru is a treasure trove of history, cuisine, and natural wonder. Trek the Inca Trail, cruise Lake Titicaca, or explore the Amazon rainforest.</p>
<p><strong>Best for:</strong> Trekking, history, gastronomy, adventure</p>

<img src="https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=1200&h=500&fit=crop" alt="Iceland Northern Lights" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Iceland</h3>
<p>The Land of Fire and Ice delivers otherworldly landscapes — erupting geysers, cascading waterfalls, volcanic black-sand beaches, and the ethereal Northern Lights. Iceland is nature at its most dramatic.</p>
<p><strong>Best for:</strong> Northern Lights, road trips, hot springs, solo travel</p>

<img src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=500&fit=crop" alt="Morocco medina" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Morocco</h3>
<p>Lose yourself in the labyrinthine medinas of Marrakech, ride camels across the Sahara, and savor tagine under a canopy of stars. Morocco is a sensory feast that bridges Africa and the Arab world.</p>
<p><strong>Best for:</strong> Culture, desert expeditions, shopping, food</p>

<img src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=500&fit=crop" alt="Thai temple at sunset" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>Thailand</h3>
<p>Golden temples, floating markets, turquoise islands, and some of the best street food on the planet. Thailand welcomes millions of visitors with its legendary hospitality and incredible value for money.</p>
<p><strong>Best for:</strong> Budget travel, beaches, temples, nightlife, food</p>

<img src="https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&h=500&fit=crop" alt="New Zealand mountains and lake" style="width:100%;border-radius:12px;margin:20px 0;" />
<h3>New Zealand</h3>
<p>A paradise for adventure seekers and nature lovers — bungee jumping in Queenstown, hiking the Milford Track, exploring Hobbiton, and cruising through fjords. New Zealand's landscapes are the stuff of fantasy — literally.</p>
<p><strong>Best for:</strong> Adventure sports, hiking, film tourism, road trips</p>

<h2>Can't Decide?</h2>
<p>Our destination specialists are here to help you find the perfect match. <a href="/contact">Get in touch</a> and tell us what inspires you — we'll do the rest.</p>
      `.trim(),
    },
    {
      slug: "services",
      title: "Our Services",
      sortOrder: 3,
      metaTitle: "Travel Services — Custom Itineraries, Group Tours & More",
      metaDesc: "From bespoke luxury itineraries to budget-friendly group tours and corporate travel management — discover the full range of Travel Stall services.",
      ogImage: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&h=630&fit=crop",
      content: `
<h2>Travel Services Tailored to You</h2>
<p>At Travel Stall, we don't believe in one-size-fits-all travel. Whether you're a solo adventurer, a honeymooning couple, a corporate team, or a multigenerational family — we design experiences that fit <em>you</em>.</p>

<img src="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&h=500&fit=crop" alt="Travel planning" style="width:100%;border-radius:12px;margin:20px 0;" />

<h3>Custom Itineraries</h3>
<p>Tell us your dream destination, travel dates, budget, and interests — and our specialists will craft a bespoke itinerary down to the last detail. From flight bookings and hotel reservations to restaurant recommendations and local experiences, we handle everything.</p>
<ul>
  <li>Personalized day-by-day planning</li>
  <li>Hand-picked accommodations matching your style</li>
  <li>Local experiences and hidden gems</li>
  <li>Flexible modification up to 14 days before departure</li>
</ul>

<h3>Group Tours</h3>
<p>Join a community of like-minded travelers on our expertly guided group tours. Small group sizes (8–16 people), professional local guides, and thoughtfully curated experiences make our tours feel personal — never generic.</p>
<ul>
  <li>Upcoming: <strong>Safari &amp; Culture — Kenya</strong> (May 2026)</li>
  <li>Upcoming: <strong>Cherry Blossom Trail — Japan</strong> (April 2026)</li>
  <li>Upcoming: <strong>Mediterranean Cruise — Greece &amp; Turkey</strong> (June 2026)</li>
  <li>Upcoming: <strong>Northern Lights — Iceland</strong> (September 2026)</li>
</ul>

<h3>Corporate Travel</h3>
<p>Streamline your company's travel with our corporate travel management service. We offer negotiated rates, centralized booking, duty-of-care tracking, and detailed expense reporting — saving your business time and money.</p>
<ul>
  <li>Dedicated corporate account manager</li>
  <li>Policy-compliant booking platform</li>
  <li>24/7 emergency support</li>
  <li>Monthly analytics and cost reports</li>
</ul>

<h3>Luxury Packages</h3>
<p>For travelers who want nothing but the best — our luxury collection features five-star resorts, private villas, first-class flights, exclusive experiences, and VIP access. Every detail is elevated.</p>
<ul>
  <li>Private island retreats in the Maldives</li>
  <li>First-class rail journeys across Europe</li>
  <li>Chartered yacht cruises in the Mediterranean</li>
  <li>Michelin-starred dining experiences in Tokyo</li>
</ul>

<h3>Travel Insurance &amp; Visa Assistance</h3>
<p>We partner with leading insurance providers to offer comprehensive travel insurance covering medical emergencies, trip cancellations, and lost luggage. Our visa assistance team handles applications, documentation, and appointment scheduling for hassle-free approvals.</p>

<h2>Let's Plan Your Next Trip</h2>
<p>Ready to get started? <a href="/contact">Contact our team</a> for a free consultation. No obligation, no pressure — just great travel advice.</p>
      `.trim(),
    },
    {
      slug: "contact",
      title: "Contact Us",
      sortOrder: 4,
      metaTitle: "Contact Travel Stall — Get in Touch",
      metaDesc: "Have a question or ready to book? Reach out to Travel Stall via phone, email, or our contact form. We typically respond within 2 hours.",
      ogImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=630&fit=crop",
      content: `
<h2>We'd Love to Hear from You</h2>
<p>Whether you have a question about a destination, need help planning a trip, or want to provide feedback — our team is ready to help. Reach out through any of the channels below, and we'll get back to you within 2 hours during business hours.</p>

<h3>Head Office — Mumbai</h3>
<p>
  <strong>Address:</strong> 14th Floor, Horizon Tower, Andheri East, Mumbai 400069, India<br />
  <strong>Phone:</strong> +91 22 4567 8900<br />
  <strong>Email:</strong> <a href="mailto:hello@travelstall.com">hello@travelstall.com</a><br />
  <strong>Hours:</strong> Monday – Saturday, 9:00 AM – 7:00 PM IST
</p>

<h3>Regional Offices</h3>
<ul>
  <li><strong>London:</strong> 42 Kensington High Street, London W8 4PT, UK — +44 20 7946 0958</li>
  <li><strong>Dubai:</strong> Suite 1201, Business Bay Tower, Dubai, UAE — +971 4 321 6789</li>
  <li><strong>Singapore:</strong> 8 Marina Boulevard, #12-04, Singapore 018981 — +65 6789 0123</li>
</ul>

<h3>Send Us a Message</h3>
<p>Fill out the form below and a travel specialist will reach out to you shortly.</p>

<form class="contact-form" style="max-width:600px;">
  <p><label><strong>Full Name</strong><br /><input type="text" name="name" placeholder="Your full name" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;" /></label></p>
  <p><label><strong>Email Address</strong><br /><input type="email" name="email" placeholder="you@example.com" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;" /></label></p>
  <p><label><strong>Phone (optional)</strong><br /><input type="tel" name="phone" placeholder="+1 234 567 890" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;" /></label></p>
  <p><label><strong>Destination of Interest</strong><br /><input type="text" name="destination" placeholder="e.g., Bali, Japan, Kenya..." style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;" /></label></p>
  <p><label><strong>Message</strong><br /><textarea name="message" rows="5" placeholder="Tell us about your dream trip..." style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;"></textarea></label></p>
  <p><button type="submit" style="background:#0070f3;color:#fff;padding:12px 32px;border:none;border-radius:6px;cursor:pointer;font-size:16px;">Send Message</button></p>
</form>

<h3>Follow Us</h3>
<p>Stay connected and inspired — follow us on <strong>Instagram</strong>, <strong>Facebook</strong>, <strong>Twitter</strong>, and <strong>YouTube</strong> for travel tips, destination spotlights, and exclusive deals.</p>
      `.trim(),
    },
    {
      slug: "faq",
      title: "Frequently Asked Questions",
      sortOrder: 5,
      metaTitle: "FAQ — Travel Stall",
      metaDesc: "Find answers to common questions about booking, cancellations, travel insurance, visas, payments, and more at Travel Stall.",
      content: `
<h2>Frequently Asked Questions</h2>
<p>Can't find your answer here? <a href="/contact">Contact us</a> — we're happy to help.</p>

<h3>1. How do I book a trip with Travel Stall?</h3>
<p>You can book directly through our website, send us an email at <a href="mailto:hello@travelstall.com">hello@travelstall.com</a>, or call our team. We'll schedule a free consultation to understand your preferences and create a personalized itinerary.</p>

<h3>2. What is your cancellation policy?</h3>
<p>Cancellations made <strong>30+ days</strong> before departure receive a full refund minus a small processing fee. Cancellations <strong>15–30 days</strong> before departure receive a 50% refund. Cancellations within <strong>14 days</strong> are non-refundable. We strongly recommend purchasing travel insurance.</p>

<h3>3. Do you offer travel insurance?</h3>
<p>Yes! We partner with leading insurance providers to offer comprehensive travel insurance covering medical emergencies, trip cancellations, flight delays, and lost luggage. We can add insurance to any booking.</p>

<h3>4. Can you help with visa applications?</h3>
<p>Absolutely. Our visa assistance team handles documentation, application forms, appointment scheduling, and follow-ups. We have a 98% visa approval rate across all destinations.</p>

<h3>5. What payment methods do you accept?</h3>
<p>We accept credit/debit cards (Visa, Mastercard, Amex), bank transfers, UPI (for Indian clients), and PayPal. We also offer EMI options on select bookings.</p>

<h3>6. Are your group tours suitable for solo travelers?</h3>
<p>Yes! Many of our group tour participants are solo travelers. Our small group sizes (8–16 people) create a friendly, social atmosphere. We also offer single-occupancy room options.</p>

<h3>7. How far in advance should I book?</h3>
<p>We recommend booking at least <strong>3–6 months</strong> in advance for international trips and <strong>4–8 weeks</strong> for domestic getaways. Peak-season destinations (e.g., Europe in summer, Japan during cherry blossom) should be booked even earlier.</p>

<h3>8. Can I customize a group tour itinerary?</h3>
<p>Group tours follow a set itinerary, but we offer flexibility on pre/post-tour extensions. For fully customizable experiences, our <a href="/services">custom itinerary service</a> is the perfect fit.</p>

<h3>9. What happens if my flight is cancelled or delayed?</h3>
<p>Our 24/7 support team monitors all active bookings. If a disruption occurs, we'll immediately work on rebooking flights, adjusting hotel reservations, and minimizing impact on your trip.</p>

<h3>10. Do you offer corporate or group discounts?</h3>
<p>Yes. We offer volume discounts for corporate bookings (10+ travelers) and special rates for group bookings (weddings, family reunions, etc.). <a href="/contact">Contact our corporate team</a> for a custom quote.</p>
      `.trim(),
    },
    {
      slug: "terms",
      title: "Terms and Conditions",
      sortOrder: 6,
      metaTitle: "Terms and Conditions — Travel Stall",
      metaDesc: "Read the terms and conditions governing the use of Travel Stall's services, website, and booking policies.",
      content: `
<h2>Terms and Conditions</h2>
<p><em>Last updated: April 1, 2026</em></p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing and using the Travel Stall website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.</p>

<h3>2. Booking and Payment</h3>
<p>All bookings are subject to availability. A deposit of 25% is required at the time of booking, with the remaining balance due 30 days before the departure date. Failure to pay the balance by the due date may result in cancellation of the booking.</p>

<h3>3. Pricing</h3>
<p>All prices are quoted in USD unless otherwise specified. Prices are subject to change due to currency fluctuations, fuel surcharges, tax changes, or supplier rate adjustments. Once a booking is confirmed and payment received, the quoted price is guaranteed.</p>

<h3>4. Cancellation and Refund Policy</h3>
<ul>
  <li><strong>30+ days before departure:</strong> Full refund minus $50 processing fee</li>
  <li><strong>15–30 days before departure:</strong> 50% refund</li>
  <li><strong>Less than 15 days:</strong> No refund</li>
</ul>
<p>Cancellations must be submitted in writing to <a href="mailto:support@travelstall.com">support@travelstall.com</a>.</p>

<h3>5. Travel Documents</h3>
<p>Travelers are responsible for ensuring they possess valid passports, visas, and any required health certifications. Travel Stall provides visa assistance as a courtesy but is not liable for visa rejections or document issues.</p>

<h3>6. Travel Insurance</h3>
<p>We strongly recommend all travelers purchase comprehensive travel insurance. Travel Stall is not liable for losses, injuries, or expenses arising from events beyond our control, including but not limited to natural disasters, pandemics, political unrest, or carrier cancellations.</p>

<h3>7. Limitation of Liability</h3>
<p>Travel Stall acts as an intermediary between travelers and third-party suppliers (airlines, hotels, tour operators). We are not liable for any loss, damage, injury, or delay caused by these suppliers. Our liability is limited to the amount paid for the services booked through us.</p>

<h3>8. Intellectual Property</h3>
<p>All content on this website — including text, images, logos, and design — is the property of Travel Stall and may not be reproduced or distributed without prior written consent.</p>

<h3>9. Privacy</h3>
<p>Your use of our services is also governed by our <a href="/privacy">Privacy Policy</a>.</p>

<h3>10. Changes to Terms</h3>
<p>Travel Stall reserves the right to update these terms at any time. Continued use of our services after changes are posted constitutes acceptance of the revised terms.</p>

<p>For questions about these terms, contact us at <a href="mailto:legal@travelstall.com">legal@travelstall.com</a>.</p>
      `.trim(),
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      sortOrder: 7,
      metaTitle: "Privacy Policy — Travel Stall",
      metaDesc: "Learn how Travel Stall collects, uses, and protects your personal information when you use our website and services.",
      content: `
<h2>Privacy Policy</h2>
<p><em>Last updated: April 1, 2026</em></p>

<h3>1. Information We Collect</h3>
<p>We collect the following types of information:</p>
<ul>
  <li><strong>Personal information:</strong> Name, email, phone number, passport details (for bookings), payment information</li>
  <li><strong>Usage data:</strong> Browser type, IP address, pages visited, time spent on site</li>
  <li><strong>Cookies:</strong> We use cookies to improve your browsing experience and analyze site traffic</li>
</ul>

<h3>2. How We Use Your Information</h3>
<ul>
  <li>Processing bookings and payments</li>
  <li>Sending booking confirmations, itineraries, and travel documents</li>
  <li>Providing customer support</li>
  <li>Sending promotional newsletters (with your opt-in consent)</li>
  <li>Improving our website and services</li>
</ul>

<h3>3. Data Sharing</h3>
<p>We share your personal information only with:</p>
<ul>
  <li><strong>Travel suppliers</strong> (airlines, hotels, tour operators) necessary to fulfill your booking</li>
  <li><strong>Payment processors</strong> for secure transaction handling</li>
  <li><strong>Government authorities</strong> when required by law or for visa processing</li>
</ul>
<p>We do <strong>not</strong> sell your personal information to third parties.</p>

<h3>4. Data Security</h3>
<p>We implement industry-standard security measures including SSL encryption, secure data storage, and access controls to protect your personal information.</p>

<h3>5. Your Rights</h3>
<p>You have the right to:</p>
<ul>
  <li>Access the personal data we hold about you</li>
  <li>Request correction of inaccurate data</li>
  <li>Request deletion of your data (subject to legal obligations)</li>
  <li>Opt out of marketing communications at any time</li>
</ul>

<h3>6. Data Retention</h3>
<p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations, typically for a period of 7 years after your last transaction.</p>

<h3>7. Cookies</h3>
<p>Our website uses cookies for analytics, personalization, and advertising. You can manage cookie preferences through your browser settings.</p>

<h3>8. Contact Us</h3>
<p>For privacy-related inquiries, contact our Data Protection Officer at <a href="mailto:privacy@travelstall.com">privacy@travelstall.com</a>.</p>
      `.trim(),
    },
    {
      slug: "careers",
      title: "Careers at Travel Stall",
      sortOrder: 8,
      metaTitle: "Careers — Join the Travel Stall Team",
      metaDesc: "Explore exciting career opportunities at Travel Stall. Join a passionate team that's redefining travel experiences worldwide.",
      ogImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=630&fit=crop",
      content: `
<img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=500&fit=crop" alt="Travel Stall team at work" style="width:100%;border-radius:12px;" />

<h2>Join Our Team</h2>
<p>At Travel Stall, we're building the future of travel — and we need passionate, creative, and driven people to help us get there. If you love travel, technology, and creating exceptional experiences, you'll feel right at home.</p>

<h3>Why Work With Us?</h3>
<ul>
  <li><strong>Travel perks:</strong> Annual travel allowance and discounted trips for all employees</li>
  <li><strong>Remote-friendly:</strong> Flexible work arrangements with hybrid office/remote options</li>
  <li><strong>Growth:</strong> Clear career paths, mentorship programs, and learning budgets</li>
  <li><strong>Culture:</strong> A diverse, inclusive team that celebrates curiosity and creativity</li>
  <li><strong>Impact:</strong> Your work directly shapes how thousands of people experience the world</li>
</ul>

<h2>Open Positions</h2>

<h3>Senior Destination Specialist — Southeast Asia</h3>
<p><strong>Location:</strong> Mumbai / Remote | <strong>Type:</strong> Full-time</p>
<p>We're looking for an experienced travel professional with deep knowledge of Southeast Asian destinations. You'll design custom itineraries, manage supplier relationships, and mentor junior specialists.</p>

<h3>Full-Stack Developer</h3>
<p><strong>Location:</strong> Mumbai | <strong>Type:</strong> Full-time</p>
<p>Help us build the next generation of our travel platform. You'll work with Next.js, TypeScript, Prisma, and modern web technologies to create beautiful, performant travel experiences.</p>

<h3>Content Writer — Travel &amp; Lifestyle</h3>
<p><strong>Location:</strong> Remote | <strong>Type:</strong> Full-time</p>
<p>Craft compelling destination guides, blog posts, and marketing copy that inspires travelers to book their next adventure. Strong SEO knowledge and travel experience required.</p>

<h3>Customer Experience Associate</h3>
<p><strong>Location:</strong> Mumbai | <strong>Type:</strong> Full-time</p>
<p>Be the first point of contact for our travelers. Handle inquiries, assist with bookings, resolve issues, and ensure every client interaction reflects our commitment to exceptional service.</p>

<h3>Marketing Manager — Digital &amp; Social</h3>
<p><strong>Location:</strong> Mumbai / Remote | <strong>Type:</strong> Full-time</p>
<p>Lead our digital marketing strategy across social media, email, SEO, and paid channels. You'll drive brand awareness, engagement, and bookings through data-driven campaigns.</p>

<h2>How to Apply</h2>
<p>Send your resume and a brief cover letter to <a href="mailto:careers@travelstall.com">careers@travelstall.com</a> with the position title in the subject line. We review all applications within 5 business days.</p>
      `.trim(),
    },
    {
      slug: "gallery",
      title: "Photo Gallery",
      sortOrder: 9,
      metaTitle: "Travel Photo Gallery — Travel Stall",
      metaDesc: "Browse stunning travel photography from our featured destinations — Bali, Maldives, Japan, Kenya, Iceland, and more.",
      ogImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&h=630&fit=crop",
      content: `
<h2>Travel Gallery</h2>
<p>A picture is worth a thousand miles. Browse our collection of stunning travel photography from destinations around the world.</p>

<h3>Tropical Paradise</h3>
<img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=500&fit=crop" alt="Tropical beach with crystal clear water" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=500&fit=crop" alt="Palm-lined beach at golden hour" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop" alt="Overwater bungalow in Maldives" style="width:100%;border-radius:12px;margin:10px 0;" />

<h3>Mountain Adventures</h3>
<img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop" alt="Majestic mountain peaks at sunrise" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=500&fit=crop" alt="Hiker on mountain trail" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=500&fit=crop" alt="Snow-covered alpine village" style="width:100%;border-radius:12px;margin:10px 0;" />

<h3>Cultural Encounters</h3>
<img src="https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=500&fit=crop" alt="Traditional Japanese street" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=500&fit=crop" alt="Taj Mahal at sunrise" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&h=500&fit=crop" alt="Colorful Moroccan market" style="width:100%;border-radius:12px;margin:10px 0;" />

<h3>Wildlife &amp; Safari</h3>
<img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop" alt="Lions resting on the savanna" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1535338454528-1b9456715d68?w=800&h=500&fit=crop" alt="Elephant crossing a river in Kenya" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=500&fit=crop" alt="Giraffe at golden hour" style="width:100%;border-radius:12px;margin:10px 0;" />

<h3>Northern Wonders</h3>
<img src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=500&fit=crop" alt="Northern Lights over Iceland" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=500&fit=crop" alt="Icelandic waterfall" style="width:100%;border-radius:12px;margin:10px 0;" />
<img src="https://images.unsplash.com/photo-1476610182048-b716b8515aaa?w=800&h=500&fit=crop" alt="Nordic fjord landscape" style="width:100%;border-radius:12px;margin:10px 0;" />

<p><em>All photos are credited to their respective photographers via Unsplash.</em></p>
<p>Want to see your destination in our gallery? <a href="/contact">Let us plan your trip</a> and bring home your own incredible memories.</p>
      `.trim(),
    },
  ];

  for (const page of pages) {
    await prisma.page.create({
      data: {
        tenantId,
        slug: page.slug,
        title: page.title,
        content: page.content,
        metaTitle: page.metaTitle ?? null,
        metaDesc: page.metaDesc ?? null,
        ogImage: page.ogImage ?? null,
        published: true,
        sortOrder: page.sortOrder,
      },
    });
  }
  console.log(`✅ Created ${pages.length} pages`);

  // ════════════════════════════════════════════════════════════════════════════
  // CATEGORIES
  // ════════════════════════════════════════════════════════════════════════════

  const categoryData = [
    { name: "Destinations", slug: "destinations" },
    { name: "Adventure", slug: "adventure" },
    { name: "Culture", slug: "culture" },
    { name: "Tips & Guides", slug: "tips-guides" },
    { name: "Luxury", slug: "luxury" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.create({
      data: { tenantId, name: cat.name, slug: cat.slug },
    });
    categories[cat.slug] = created.id;
  }
  console.log(`✅ Created ${categoryData.length} categories`);

  // ════════════════════════════════════════════════════════════════════════════
  // TAGS
  // ════════════════════════════════════════════════════════════════════════════

  const tagData = [
    { name: "Asia", slug: "asia" },
    { name: "Europe", slug: "europe" },
    { name: "Africa", slug: "africa" },
    { name: "Budget", slug: "budget" },
    { name: "Luxury", slug: "luxury" },
    { name: "Adventure", slug: "adventure" },
    { name: "Food", slug: "food" },
    { name: "Honeymoon", slug: "honeymoon" },
    { name: "Eco-Travel", slug: "eco-travel" },
    { name: "Solo Travel", slug: "solo-travel" },
  ];

  const tags: Record<string, string> = {};
  for (const tag of tagData) {
    const created = await prisma.tag.create({
      data: { tenantId, name: tag.name, slug: tag.slug },
    });
    tags[tag.slug] = created.id;
  }
  console.log(`✅ Created ${tagData.length} tags`);

  // ════════════════════════════════════════════════════════════════════════════
  // BLOG POSTS
  // ════════════════════════════════════════════════════════════════════════════

  const blogPosts = [
    {
      slug: "10-hidden-gems-in-southeast-asia",
      title: "10 Hidden Gems in Southeast Asia You Need to Visit",
      excerpt: "Beyond the well-trodden tourist trail, Southeast Asia hides some of the most breathtaking, untouched destinations on the planet. From secret islands in the Philippines to ancient caves in Laos, discover the places most travelers miss.",
      featuredImage: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-02"),
      categories: ["destinations"],
      tags: ["asia", "adventure", "budget"],
      content: `
<img src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&h=600&fit=crop" alt="Hidden beach in Southeast Asia" style="width:100%;border-radius:12px;" />

<p>Southeast Asia has long been a magnet for backpackers, luxury travelers, and everyone in between. But beyond the famous beaches of Phuket and the temples of Angkor Wat lie hidden gems that offer equally stunning experiences — without the crowds.</p>

<h2>1. Siargao, Philippines</h2>
<p>Known as the surfing capital of the Philippines, Siargao is so much more than waves. Crystal-clear rock pools, mangrove forests, and a laid-back island vibe make it a paradise for those seeking authenticity. The famous <strong>Cloud 9</strong> surf break draws professionals, but beginners will find gentle waves and warm, welcoming locals throughout the island.</p>

<h2>2. Phong Nha, Vietnam</h2>
<p>Home to the world's largest cave — <strong>Son Doong</strong> — Phong Nha-Ke Bang National Park is a UNESCO World Heritage Site that feels like stepping into another world. Underground rivers, towering stalagmites, and bioluminescent organisms create scenes straight out of a fantasy novel.</p>

<h2>3. Nong Khiaw, Laos</h2>
<p>Nestled between dramatic limestone karsts along the Nam Ou River, Nong Khiaw is one of Laos's best-kept secrets. Trek to hidden viewpoints, kayak through river gorges, and stay in bamboo bungalows overlooking misty mountains.</p>

<h2>4. Koh Rong Samloem, Cambodia</h2>
<p>While Koh Rong has become increasingly developed, its smaller sister island — Koh Rong Samloem — remains beautifully untouched. Bioluminescent plankton lights up the water at night, and you can still find beaches where you're the only person in sight.</p>

<h2>5. Raja Ampat, Indonesia</h2>
<p>Located off the coast of West Papua, Raja Ampat is considered the <strong>epicenter of marine biodiversity</strong>. With over 1,500 fish species and 75% of all known coral species, it's arguably the best diving and snorkeling destination on Earth.</p>

<h3>More Hidden Gems Worth Exploring</h3>
<ul>
  <li><strong>Hsipaw, Myanmar</strong> — Trekking through Shan State hill villages</li>
  <li><strong>Kampot, Cambodia</strong> — Riverside charm and famous pepper plantations</li>
  <li><strong>Pai, Thailand</strong> — Mountain hippie town with hot springs and canyons</li>
  <li><strong>Ninh Binh, Vietnam</strong> — Karst landscapes and ancient temples (the "Halong Bay on land")</li>
  <li><strong>Flores, Indonesia</strong> — Komodo dragons, volcanic lakes, and traditional villages</li>
</ul>

<p>The beauty of Southeast Asia is that even after decades of tourism, it continues to reveal new wonders. Pack light, stay curious, and let the region surprise you.</p>
      `.trim(),
    },
    {
      slug: "ultimate-guide-planning-safari-kenya",
      title: "The Ultimate Guide to Planning a Safari in Kenya",
      excerpt: "A Kenya safari is a bucket-list experience like no other. From the Great Migration in the Masai Mara to the flamingo-lined shores of Lake Nakuru, this comprehensive guide covers everything you need to plan the perfect African wildlife adventure.",
      featuredImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-05"),
      categories: ["destinations", "tips-guides"],
      tags: ["africa", "adventure"],
      content: `
<img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=600&fit=crop" alt="Elephants on the African savanna" style="width:100%;border-radius:12px;" />

<p>There are few travel experiences that match the raw, awe-inspiring power of an African safari. Kenya — with its vast savannas, diverse wildlife, and rich cultural heritage — remains one of the world's premier safari destinations. Whether it's your first safari or your fifth, this guide will help you plan an unforgettable journey.</p>

<h2>When to Go</h2>
<p>Kenya is a year-round safari destination, but timing matters depending on what you want to see:</p>
<ul>
  <li><strong>July – October:</strong> The Great Migration — millions of wildebeest and zebra cross the Mara River in one of nature's greatest spectacles</li>
  <li><strong>January – February:</strong> Calving season in the Serengeti/Mara ecosystem — newborn animals and active predators</li>
  <li><strong>June – October:</strong> Dry season with excellent wildlife viewing as animals gather around water sources</li>
  <li><strong>November – May:</strong> Green season — fewer crowds, lower prices, lush landscapes, and great birdwatching</li>
</ul>

<h2>Top Safari Destinations in Kenya</h2>

<h3>Masai Mara National Reserve</h3>
<p>Kenya's crown jewel and part of the greater Serengeti ecosystem. The Mara offers <strong>the highest density of predators in Africa</strong> — lion prides, cheetah coalitions, leopards, and massive Nile crocodiles. During the Great Migration (July–October), the river crossings are a once-in-a-lifetime spectacle.</p>

<h3>Amboseli National Park</h3>
<p>Famous for its iconic views of <strong>Mount Kilimanjaro</strong> towering over vast herds of elephants. Amboseli's open landscapes make it one of the best parks for photography in all of Africa.</p>

<h3>Tsavo National Park</h3>
<p>One of the largest national parks in the world, Tsavo is divided into East and West. It's known for its red elephants (dusted in red volcanic soil), dramatic lava flows, and the Mzima Springs where hippos and crocodiles dwell in crystal-clear water.</p>

<h2>What to Pack</h2>
<ul>
  <li>Neutral-colored clothing (khaki, olive, beige)</li>
  <li>High-quality binoculars and a camera with a telephoto lens</li>
  <li>Sunscreen, hat, and sunglasses</li>
  <li>Light layers — mornings can be surprisingly cold</li>
  <li>Insect repellent with DEET</li>
</ul>

<h2>Budget Considerations</h2>
<p>Safari costs vary widely. A mid-range safari in Kenya typically costs <strong>$250–$450 per person per day</strong>, including accommodation, meals, park fees, and game drives. Luxury options with private conservancies can exceed $1,000/day, while budget camping safaris start around $150/day.</p>

<blockquote><p>"A safari is not just a trip — it's a perspective shift. You return home seeing the natural world differently." — Travel Stall Destination Specialist</p></blockquote>

<p>Ready to plan your Kenya safari? <a href="/contact">Contact our Africa specialists</a> for a personalized itinerary.</p>
      `.trim(),
    },
    {
      slug: "why-bali-remains-top-destination-2026",
      title: "Why Bali Remains the Top Destination for 2026",
      excerpt: "Year after year, Bali continues to top travel destination lists. With its unique blend of spirituality, natural beauty, world-class dining, and affordable luxury, the Island of the Gods shows no signs of slowing down.",
      featuredImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-08"),
      categories: ["destinations"],
      tags: ["asia", "honeymoon", "luxury"],
      content: `
<img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=600&fit=crop" alt="Bali temple with rice terraces" style="width:100%;border-radius:12px;" />

<p>Bali isn't just a destination — it's a feeling. The island has an almost magnetic pull that draws travelers back again and again. In 2026, Bali has evolved to offer even more for visitors while preserving the cultural and natural treasures that make it special.</p>

<h2>The Eternal Appeal</h2>
<p>What makes Bali uniquely compelling is the sheer <strong>density of experiences</strong> packed into a relatively small island. Within a single day, you can watch the sunrise from a volcanic crater, surf world-class waves, explore a 1,000-year-old temple, enjoy a farm-to-table lunch in a rice paddy, and end with a traditional Kecak fire dance at sunset.</p>

<h2>What's New in 2026</h2>
<ul>
  <li><strong>Sustainable tourism initiatives:</strong> Bali has implemented new eco-tourism programs, including plastic-free zones, coral restoration projects, and community-led village tours that directly benefit local families.</li>
  <li><strong>North Bali renaissance:</strong> The quieter north coast — with its volcanic black-sand beaches, waterfalls, and traditional fishing villages — is emerging as an alternative to the busier south.</li>
  <li><strong>Culinary boom:</strong> Bali's food scene continues to explode, with new restaurants blending traditional Balinese flavors with contemporary techniques.</li>
  <li><strong>Digital nomad infrastructure:</strong> With fast internet, co-working spaces, and a thriving international community, Bali remains the world's top destination for remote workers.</li>
</ul>

<h2>Where to Stay</h2>
<p>Bali offers accommodation for every budget and style:</p>
<ul>
  <li><strong>Ubud:</strong> Jungle retreats, yoga resorts, and cultural immersion</li>
  <li><strong>Seminyak:</strong> Beach clubs, boutique shopping, and vibrant nightlife</li>
  <li><strong>Uluwatu:</strong> Clifftop villas, world-class surfing, and dramatic ocean views</li>
  <li><strong>Canggu:</strong> Bohemian cafes, rice paddies, and a creative community</li>
  <li><strong>Nusa Penida:</strong> Raw, rugged beauty with Instagram-famous viewpoints</li>
</ul>

<h2>Travel Tips</h2>
<p>The best time to visit is during the <strong>dry season (April–October)</strong>. Book accommodations early for peak months (July–August). And remember — a little respect for Balinese culture goes a long way. Dress modestly when visiting temples, and always ask before photographing religious ceremonies.</p>

<p>Let us craft your perfect Bali itinerary — <a href="/contact">get in touch</a> with our Southeast Asia specialists.</p>
      `.trim(),
    },
    {
      slug: "budget-travel-tips-europe-50-dollars-day",
      title: "Budget Travel Tips: How to See Europe on $50 a Day",
      excerpt: "Think Europe has to be expensive? Think again. With smart planning, flexible timing, and insider knowledge, you can explore the continent's greatest cities, landscapes, and cuisines on a surprisingly lean budget.",
      featuredImage: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-11"),
      categories: ["tips-guides"],
      tags: ["europe", "budget"],
      content: `
<img src="https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1200&h=600&fit=crop" alt="European old town street" style="width:100%;border-radius:12px;" />

<p>Europe is one of the most rewarding travel regions on Earth — centuries of history, world-class art, stunning natural landscapes, and cuisines that have influenced the entire globe. But it has a reputation for being expensive. The truth? With the right strategies, you can experience Europe richly on <strong>$50 a day or less</strong>.</p>

<h2>Accommodation: $15–25/night</h2>
<ul>
  <li><strong>Hostels:</strong> Europe has some of the world's best hostels. Dorms in cities like Prague, Budapest, and Lisbon start at $10–15/night. Many offer free breakfast.</li>
  <li><strong>House-sitting &amp; work exchanges:</strong> Platforms like Trusted Housesitters and Workaway offer free accommodation in exchange for pet care or a few hours of help.</li>
  <li><strong>Off-season stays:</strong> Visit popular destinations in shoulder season (April–May, September–October) for dramatically lower prices.</li>
</ul>

<h2>Food: $10–15/day</h2>
<ul>
  <li><strong>Markets and supermarkets:</strong> Buy fresh bread, cheese, and produce from local markets for incredible picnic lunches.</li>
  <li><strong>Lunch menus:</strong> Many European restaurants offer fixed-price lunch menus at a fraction of dinner prices. In Spain, the <em>menú del día</em> typically costs $8–12 for a three-course meal.</li>
  <li><strong>Street food:</strong> From German bratwurst to Turkish döner kebabs, street food is delicious, authentic, and cheap.</li>
</ul>

<h2>Transport: $10–15/day</h2>
<ul>
  <li><strong>Bus companies:</strong> FlixBus connects hundreds of European cities with fares starting at $5.</li>
  <li><strong>Rail passes:</strong> The Eurail pass can be excellent value for multi-country trips if you plan ahead.</li>
  <li><strong>Budget airlines:</strong> Ryanair and Wizz Air offer flights as low as $15 if you book early and pack light.</li>
  <li><strong>Walking:</strong> Most European city centers are compact and walkable — often the best way to explore.</li>
</ul>

<h2>The Best Budget-Friendly Countries</h2>
<p>Your money stretches furthest in <strong>Eastern and Southern Europe</strong>:</p>
<ul>
  <li><strong>Portugal:</strong> Affordable, beautiful, and increasingly popular — Lisbon and Porto offer incredible value.</li>
  <li><strong>Hungary:</strong> Budapest is one of Europe's most stunning capitals, with thermal baths, grand architecture, and meals under $5.</li>
  <li><strong>Czech Republic:</strong> Prague's beauty rivals Paris at a fraction of the cost.</li>
  <li><strong>Greece:</strong> Island life doesn't have to be expensive — skip Santorini for Naxos or Milos.</li>
  <li><strong>Poland:</strong> Krakow, Wroclaw, and Gdansk are cultural treasures with incredibly low costs.</li>
</ul>

<h2>The Golden Rule</h2>
<p><strong>Travel slow.</strong> The biggest budget killer is trying to see too much too fast. Stay longer in fewer places, cook some meals, walk instead of taxi, and you'll not only save money — you'll have a richer experience.</p>
      `.trim(),
    },
    {
      slug: "luxury-train-journeys-around-the-world",
      title: "Luxury Train Journeys Around the World",
      excerpt: "From the Orient Express to the Maharajas' Express, luxury train travel offers a romantic, unhurried way to experience the world's most scenic landscapes. Discover the most iconic rail journeys money can buy.",
      featuredImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-14"),
      categories: ["luxury"],
      tags: ["luxury", "europe", "asia"],
      content: `
<img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=600&fit=crop" alt="Scenic train journey through mountains" style="width:100%;border-radius:12px;" />

<p>In an age of budget airlines and ride-sharing apps, luxury train travel stands as a glorious anachronism — a reminder that the journey itself can be the destination. These are the world's most spectacular rail experiences, where five-star dining, opulent cabins, and ever-changing landscapes create memories that last a lifetime.</p>

<h2>Venice Simplon-Orient-Express (Europe)</h2>
<p>The <strong>Venice Simplon-Orient-Express</strong> is the gold standard of luxury rail travel. Restored 1920s carriages, impeccable Art Deco interiors, and a route that sweeps through the Alps from London to Venice (via Paris) make this a journey dripping with old-world glamour. Black-tie dinners, champagne brunches, and views of the Brenner Pass — it doesn't get more romantic than this.</p>

<h2>The Maharajas' Express (India)</h2>
<p>India's most luxurious train traverses the subcontinent in extraordinary style. Choose from routes that cover Rajasthan's regal cities — Jaipur, Jodhpur, Udaipur — with stops at the Taj Mahal and Ranthambore tiger reserve. Presidential suites feature king-size beds, private living rooms, and personal butlers.</p>

<h2>Rocky Mountaineer (Canada)</h2>
<p>The <strong>Rocky Mountaineer</strong> is widely considered the most scenic train ride in North America. Two-day journeys from Vancouver to Banff wind through the Canadian Rockies, with glass-domed observation cars offering 360-degree views of glaciers, canyons, and turquoise lakes.</p>

<h2>Belmond Royal Scotsman (Scotland)</h2>
<p>A boutique hotel on wheels, the Royal Scotsman carries just 36 guests through the Scottish Highlands. Expect whisky tastings at distilleries, guided nature walks, and evenings with live folk music — all while rolling past heather-clad moors and misty lochs.</p>

<h2>The Ghan (Australia)</h2>
<p>Named after the Afghan camel drivers who once traversed this route, <strong>The Ghan</strong> runs from Adelaide to Darwin — 2,979 km through the heart of Australia. The landscape shifts from southern wine regions to the red desert of the Outback to the tropical Top End.</p>

<h3>Why Choose Train Travel?</h3>
<ul>
  <li><strong>Slow travel at its finest:</strong> Unplug, watch the world go by, and truly relax</li>
  <li><strong>Scenic routes:</strong> Trains access landscapes that planes and cars simply cannot</li>
  <li><strong>Social experience:</strong> Shared dining cars foster conversation and connection</li>
  <li><strong>Lower carbon footprint:</strong> Rail travel produces significantly fewer emissions than flying</li>
</ul>

<p>Interested in a luxury rail journey? Our <a href="/services">luxury travel specialists</a> can arrange end-to-end packages including pre/post-train stays and excursions.</p>
      `.trim(),
    },
    {
      slug: "food-lovers-guide-japanese-street-food",
      title: "A Food Lover's Guide to Japanese Street Food",
      excerpt: "Japan's street food culture is a culinary art form — from perfectly golden takoyaki in Osaka to sweet, fluffy dorayaki in Tokyo. Discover the essential dishes, best streets, and insider tips for eating your way through Japan.",
      featuredImage: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-17"),
      categories: ["culture"],
      tags: ["asia", "food"],
      content: `
<img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=600&fit=crop" alt="Japanese street food stall" style="width:100%;border-radius:12px;" />

<p>Japan treats street food with the same reverence and precision it brings to everything — which means even a $3 snack from a roadside stall can be a revelation. Unlike many countries where street food is casual by necessity, in Japan it's casual <em>by choice</em> — the quality is extraordinary.</p>

<h2>Must-Try Street Foods</h2>

<h3>Takoyaki (Osaka)</h3>
<p>Crispy on the outside, molten on the inside — these <strong>octopus balls</strong> are Osaka's most iconic street food. Topped with bonito flakes, tangy sauce, and mayonnaise, they're best enjoyed fresh from the griddle at Dotonbori's famous stalls.</p>

<h3>Yakitori (Nationwide)</h3>
<p>Skewered, charcoal-grilled chicken in dozens of variations — from juicy thigh meat (<em>momo</em>) to crispy skin (<em>kawa</em>) to adventurous options like heart and cartilage. Pair with a cold beer at the tiny standing bars under Tokyo's railway tracks in Yurakucho.</p>

<h3>Taiyaki (Nationwide)</h3>
<p>Fish-shaped pastries filled with sweet red bean paste, custard, or chocolate. These adorable treats are found at street stalls across Japan and make the perfect walking snack. Modern variations include matcha cream and sweet potato fillings.</p>

<h3>Okonomiyaki (Osaka &amp; Hiroshima)</h3>
<p>Often called "Japanese pizza" or "Japanese pancake," okonomiyaki is a savory griddle cake loaded with cabbage, meat, seafood, and topped with a sweet-savory sauce. Osaka and Hiroshima have famously different styles — try both and pick your favorite.</p>

<h3>Ramen (Nationwide)</h3>
<p>While not strictly street food, Japan's ubiquitous ramen shops operate with street-food energy — fast, affordable, and intensely flavorful. Each region has its signature style: <strong>tonkotsu</strong> (pork bone) in Fukuoka, <strong>miso</strong> in Sapporo, and <strong>shoyu</strong> (soy sauce) in Tokyo.</p>

<h2>Best Street Food Neighborhoods</h2>
<ul>
  <li><strong>Dotonbori, Osaka:</strong> The undisputed street food capital of Japan</li>
  <li><strong>Tsukiji Outer Market, Tokyo:</strong> Fresh seafood, tamago (egg) skewers, and incredible sushi</li>
  <li><strong>Nishiki Market, Kyoto:</strong> "Kyoto's Kitchen" — over 100 stalls of local specialties</li>
  <li><strong>Nakamise-dori, Tokyo:</strong> Traditional snacks along the approach to Senso-ji temple</li>
</ul>

<h2>Etiquette Tips</h2>
<ul>
  <li>Most Japanese eat street food <strong>standing near the stall</strong> — walking and eating is generally frowned upon</li>
  <li>Dispose of your trash properly (public bins are rare — carry a small bag)</li>
  <li>A simple <strong>"itadakimasu"</strong> (I humbly receive) before eating shows respect</li>
</ul>

<p>A culinary tour of Japan is one of the most rewarding travel experiences on Earth. <a href="/contact">Let us plan your food-focused Japan itinerary</a>.</p>
      `.trim(),
    },
    {
      slug: "top-5-honeymoon-destinations-2026",
      title: "Top 5 Honeymoon Destinations for 2026",
      excerpt: "Planning the most romantic trip of your life? From the overwater villas of the Maldives to the cliffside sunsets of Santorini, here are our top five honeymoon destinations for 2026 — plus insider tips for making the trip unforgettable.",
      featuredImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-20"),
      categories: ["destinations", "luxury"],
      tags: ["honeymoon", "luxury"],
      content: `
<img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&h=600&fit=crop" alt="Maldives overwater villa at sunset" style="width:100%;border-radius:12px;" />

<p>Your honeymoon is the first great adventure of married life — and it deserves to be extraordinary. After months of wedding planning, you need a destination that delivers romance, relaxation, and memories you'll cherish for decades. Here are our top picks for 2026.</p>

<h2>1. Maldives</h2>
<p>The Maldives remains the world's most iconic honeymoon destination — and for good reason. <strong>Overwater villas with glass floors</strong>, private beach dinners under the stars, world-class snorkeling on pristine reefs, and a level of seclusion that makes you feel like you have your own private island.</p>
<p><strong>Best for:</strong> Ultimate luxury, underwater experiences, total seclusion</p>
<p><strong>Budget:</strong> $$$$ — but worth every penny</p>

<h2>2. Santorini, Greece</h2>
<p>White-washed villages cascading down volcanic cliffs, legendary sunsets over the caldera, and incredible Greek wine and cuisine. Santorini's dramatic beauty has made it one of the most photographed places on Earth — and it's even more stunning in person.</p>
<p><strong>Best for:</strong> Sunset lovers, wine enthusiasts, photography</p>
<p><strong>Budget:</strong> $$$</p>

<h2>3. Bali, Indonesia</h2>
<p>Bali offers honeymooners an extraordinary blend of romance and adventure. Stay in a jungle-canopy villa in Ubud, surf together in Uluwatu, enjoy a traditional Balinese spa treatment, and dine at world-class restaurants — all at a fraction of European prices.</p>
<p><strong>Best for:</strong> Adventure + romance combo, culture, affordability</p>
<p><strong>Budget:</strong> $$</p>

<h2>4. Amalfi Coast, Italy</h2>
<p>Driving the winding coastal roads between Positano, Ravello, and Amalfi is one of life's great romantic experiences. Add fresh pasta, limoncello, boat trips to hidden coves, and evenings on candlelit terraces overlooking the Tyrrhenian Sea.</p>
<p><strong>Best for:</strong> Food lovers, road trips, classic European romance</p>
<p><strong>Budget:</strong> $$$</p>

<h2>5. Bora Bora, French Polynesia</h2>
<p>The name alone evokes paradise. Mount Otemanu rises dramatically from a turquoise lagoon surrounded by a coral reef. Overwater bungalows, couples' spa treatments, and private lagoon excursions make Bora Bora the ultimate escape.</p>
<p><strong>Best for:</strong> Once-in-a-lifetime splurge, natural beauty, water activities</p>
<p><strong>Budget:</strong> $$$$</p>

<h3>Honeymoon Planning Tips</h3>
<ul>
  <li>Book at least <strong>4–6 months in advance</strong> for the best availability and rates</li>
  <li>Mention it's your honeymoon at every opportunity — upgrades and special touches are common</li>
  <li>Consider a <strong>honeymoon registry</strong> instead of traditional wedding gifts</li>
  <li>Don't over-plan — leave room for spontaneity and relaxation</li>
</ul>

<p>Let our romance specialists design your perfect honeymoon — <a href="/contact">start planning today</a>.</p>
      `.trim(),
    },
    {
      slug: "sustainable-travel-reduce-carbon-footprint",
      title: "Sustainable Travel: How to Reduce Your Carbon Footprint",
      excerpt: "Travel broadens minds, but it also impacts the planet. The good news? With thoughtful choices — from how you fly to where you stay — you can dramatically reduce your travel footprint without sacrificing the experience.",
      featuredImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-23"),
      categories: ["tips-guides"],
      tags: ["eco-travel"],
      content: `
<img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop" alt="Lush green forest" style="width:100%;border-radius:12px;" />

<p>The travel industry accounts for roughly <strong>8% of global carbon emissions</strong>. As travelers, we have both a responsibility and an opportunity to make choices that minimize our impact. Sustainable travel isn't about giving up adventure — it's about traveling smarter.</p>

<h2>Flying Smarter</h2>
<p>Aviation is the biggest contributor to travel-related emissions. While we can't always avoid flying, we can make better choices:</p>
<ul>
  <li><strong>Choose direct flights:</strong> Takeoff and landing consume the most fuel — fewer stops means lower emissions</li>
  <li><strong>Fly economy:</strong> Business and first-class seats take up 2–3x more space, meaning fewer passengers per flight</li>
  <li><strong>Carbon offset:</strong> Use verified programs like Gold Standard or Verra to offset your flight emissions</li>
  <li><strong>Choose newer airlines:</strong> Modern aircraft like the A350 and 787 are 20–25% more fuel-efficient than older models</li>
</ul>

<h2>Accommodation Choices</h2>
<ul>
  <li><strong>Eco-certified hotels:</strong> Look for certifications like Green Key, EarthCheck, or LEED</li>
  <li><strong>Locally owned stays:</strong> Small guesthouses and B&Bs keep money in local communities</li>
  <li><strong>Reuse towels and linens:</strong> It sounds small, but across millions of hotel stays, the water and energy savings are enormous</li>
  <li><strong>Off-grid lodges:</strong> Solar-powered eco-lodges in destinations like Costa Rica, Kenya, and Borneo offer incredible wildlife experiences with minimal environmental impact</li>
</ul>

<h2>On the Ground</h2>
<ul>
  <li><strong>Use public transport:</strong> Trains, buses, and metros are far more efficient than rental cars or taxis</li>
  <li><strong>Walk and bike:</strong> The best way to explore — zero emissions and maximum discovery</li>
  <li><strong>Eat local:</strong> Food miles matter. Choosing locally sourced meals supports farmers and reduces transport emissions</li>
  <li><strong>Carry a reusable water bottle:</strong> Over 500 billion plastic bottles are produced annually — don't add to it</li>
  <li><strong>Refuse single-use plastics:</strong> Bring your own shopping bags, straws, and utensils</li>
</ul>

<h2>Choose Destinations Wisely</h2>
<p>Some destinations are leading the way in sustainable tourism:</p>
<ul>
  <li><strong>Costa Rica:</strong> 99% renewable energy and a pioneer in eco-tourism</li>
  <li><strong>Slovenia:</strong> Europe's greenest country with a capital named EU Green Capital</li>
  <li><strong>Bhutan:</strong> Carbon-negative and committed to gross national happiness over GDP</li>
  <li><strong>New Zealand:</strong> Strong conservation ethic and world-leading eco-lodges</li>
</ul>

<blockquote><p>"We do not inherit the Earth from our ancestors; we borrow it from our children." — Indigenous proverb</p></blockquote>

<p>At Travel Stall, we're committed to sustainable travel. We offset carbon for every trip we book and partner with eco-certified suppliers. <a href="/services">Learn more about our sustainability initiatives</a>.</p>
      `.trim(),
    },
    {
      slug: "adventure-sports-new-zealand-complete-guide",
      title: "Adventure Sports in New Zealand: A Complete Guide",
      excerpt: "New Zealand is the adventure capital of the world — from bungee jumping in Queenstown to skydiving over Lake Taupo and glacier hiking on the South Island. Here's everything you need for an adrenaline-fueled trip.",
      featuredImage: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-26"),
      categories: ["adventure"],
      tags: ["adventure"],
      content: `
<img src="https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&h=600&fit=crop" alt="New Zealand mountain and lake landscape" style="width:100%;border-radius:12px;" />

<p>If there's one country that was designed for adventure, it's New Zealand. This small island nation in the South Pacific packs an absurd amount of adrenaline-pumping activities into its compact geography. From the birthplace of bungee jumping to world-class skiing, caving, and jet boating — New Zealand is every thrill-seeker's paradise.</p>

<h2>Bungee Jumping — Queenstown</h2>
<p>It all started here. AJ Hackett's <strong>Kawarau Bridge Bungy</strong> — a 43-meter leap over a turquoise gorge — launched the modern bungee industry in 1988. For the truly brave, the <strong>Nevis Bungy</strong> offers a 134-meter free fall — New Zealand's highest. The sensation of stepping off that platform is something you'll never forget.</p>

<h2>Skydiving — Lake Taupo &amp; Wanaka</h2>
<p>New Zealand offers some of the world's most scenic skydives. Jump from <strong>15,000 feet above Lake Taupo</strong> for views of snow-capped volcanoes, sparkling lakes, and lush farmland. In Wanaka, you'll freefall with the Southern Alps as your backdrop. Both locations offer tandem jumps — no experience needed.</p>

<h2>Glacier Hiking — Fox &amp; Franz Josef</h2>
<p>Walk on ancient ice. The <strong>Fox and Franz Josef glaciers</strong> on the West Coast descend from the Southern Alps nearly to sea level — a geological rarity. Guided heli-hike tours fly you to the upper glacier for hours of exploring ice caves, crevasses, and brilliant blue ice formations.</p>

<h2>Jet Boating — Shotover River</h2>
<p>Invented in New Zealand, jet boating is a wild ride through narrow canyons at speeds up to <strong>85 km/h</strong>. The Shotover Jet in Queenstown spins through the dramatic Shotover Canyon, missing rock walls by inches. It's fast, wet, and absolutely exhilarating.</p>

<h2>More Adventures</h2>
<ul>
  <li><strong>White-water rafting</strong> on the Kaituna River (includes a 7-meter waterfall drop)</li>
  <li><strong>Caving</strong> in the Waitomo Glowworm Caves — abseil into underground rivers lit by bioluminescent insects</li>
  <li><strong>Hiking</strong> the Milford Track, Routeburn Track, or Tongariro Alpine Crossing</li>
  <li><strong>Skiing &amp; snowboarding</strong> at Remarkables, Treble Cone, or Mt Hutt</li>
  <li><strong>Zorbing</strong> in Rotorua — roll downhill inside a giant inflatable ball</li>
</ul>

<h2>When to Go</h2>
<p>New Zealand's adventure season runs year-round, but <strong>October to April</strong> (Southern Hemisphere summer) offers the best weather for most activities. Skiing season runs <strong>June to September</strong>.</p>

<p>Ready to push your limits? <a href="/contact">Talk to our New Zealand adventure specialists</a> about building your ultimate adrenaline itinerary.</p>
      `.trim(),
    },
    {
      slug: "best-time-to-visit-maldives",
      title: "The Best Time to Visit the Maldives",
      excerpt: "The Maldives is gorgeous year-round, but timing your visit right can mean the difference between endless sunshine and tropical downpours. Here's our month-by-month breakdown for planning the perfect Maldives getaway.",
      featuredImage: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-29"),
      categories: ["destinations", "tips-guides"],
      tags: ["asia", "luxury", "honeymoon"],
      content: `
<img src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&h=600&fit=crop" alt="Maldives aerial view of atolls" style="width:100%;border-radius:12px;" />

<p>The Maldives — a constellation of 1,190 coral islands scattered across the Indian Ocean — is a destination that feels almost too beautiful to be real. But when should you go? The answer depends on what you want from your trip.</p>

<h2>Dry Season (November – April) — Peak Season</h2>
<p>This is the <strong>northeast monsoon (iruvai)</strong> season, bringing clear skies, calm seas, and minimal rainfall. It's the most popular time to visit, and for good reason:</p>
<ul>
  <li><strong>December – March:</strong> The driest months with up to 8 hours of sunshine daily</li>
  <li><strong>Visibility:</strong> Crystal-clear water with 30+ meter underwater visibility — perfect for diving and snorkeling</li>
  <li><strong>Temperature:</strong> 28–31°C (82–88°F) air, 27–29°C (81–84°F) water</li>
</ul>
<p><em>Downside:</em> Peak season means higher prices and busier resorts. Book 4–6 months in advance.</p>

<h2>Wet Season (May – October) — Green Season</h2>
<p>The <strong>southwest monsoon (hulhangu)</strong> brings more rain, stronger winds, and occasional storms. But it also brings significant advantages:</p>
<ul>
  <li><strong>Prices drop 30–50%</strong> — luxury resorts become surprisingly accessible</li>
  <li><strong>Manta ray season:</strong> May – November is peak time for manta ray sightings on the western atolls</li>
  <li><strong>Surfing:</strong> The monsoon swells create the best surfing conditions</li>
  <li><strong>Fewer crowds:</strong> More privacy, more attention from resort staff, more serenity</li>
</ul>

<h2>Month-by-Month Snapshot</h2>
<ul>
  <li><strong>January–February:</strong> Driest, sunniest. Best overall weather. Peak prices.</li>
  <li><strong>March–April:</strong> Still dry. Excellent diving. Slightly more affordable.</li>
  <li><strong>May–June:</strong> Monsoon transition. Short rain showers but still warm. Manta rays arrive.</li>
  <li><strong>July–August:</strong> Wettest months. Best deals. Great surfing.</li>
  <li><strong>September–October:</strong> Monsoon winding down. Good value with improving weather.</li>
  <li><strong>November–December:</strong> Dry season returns. Holiday season pricing kicks in.</li>
</ul>

<h2>Our Recommendation</h2>
<p>For the <strong>best combination of weather and value</strong>, visit in <strong>March–April or November</strong>. You'll get dry-season weather without the peak-season prices and crowds.</p>

<p>Planning a Maldives escape? Our <a href="/contact">luxury travel team</a> can match you with the perfect resort and the ideal travel dates.</p>
      `.trim(),
    },
    {
      slug: "cultural-etiquette-tips-traveling-middle-east",
      title: "Cultural Etiquette Tips for Traveling in the Middle East",
      excerpt: "The Middle East is a region of extraordinary hospitality, rich traditions, and deep cultural pride. Understanding local customs and etiquette will enrich your experience and earn you respect from the people you meet.",
      featuredImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-04-01"),
      categories: ["culture", "tips-guides"],
      tags: ["asia"],
      content: `
<img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=600&fit=crop" alt="Middle Eastern architecture" style="width:100%;border-radius:12px;" />

<p>The Middle East offers some of the world's most rewarding cultural experiences — ancient cities, warm hospitality, mesmerizing architecture, and a culinary tradition that spans millennia. But it's also a region where cultural awareness matters. A little knowledge of local etiquette goes a long way in building genuine connections.</p>

<h2>Dress Code</h2>
<p>Dress codes vary by country, but modesty is valued across the region:</p>
<ul>
  <li><strong>Women:</strong> Cover shoulders and knees in public. In more conservative countries (Saudi Arabia, Iran), a headscarf is required or strongly recommended. In the UAE and Jordan, casual Western clothing is fine in tourist areas.</li>
  <li><strong>Men:</strong> Avoid shorts in religious sites and traditional areas. Long trousers and a collared shirt are a safe bet.</li>
  <li><strong>Mosques:</strong> Remove shoes before entering. Women should cover their hair. Many mosques provide appropriate coverings for visitors.</li>
</ul>

<h2>Greetings &amp; Social Customs</h2>
<ul>
  <li><strong>"As-salamu alaykum"</strong> (Peace be upon you) is the standard greeting — respond with <strong>"Wa alaykum as-salam"</strong></li>
  <li>Handshakes are common between same genders. <strong>Wait for a woman to extend her hand</strong> before offering yours — some women may prefer not to shake hands with men.</li>
  <li>Use your <strong>right hand</strong> for greetings, eating, and passing items. The left hand is considered unclean in many Middle Eastern cultures.</li>
</ul>

<h2>Hospitality &amp; Dining</h2>
<p>Middle Eastern hospitality is legendary. If you're invited to someone's home:</p>
<ul>
  <li><strong>Accept tea or coffee</strong> — refusing can be seen as impolite</li>
  <li><strong>Remove your shoes</strong> before entering a home</li>
  <li><strong>Eat with your right hand</strong> if dining without utensils</li>
  <li><strong>Compliment the food</strong> — your host will have put great effort into the meal</li>
  <li>It's polite to <strong>leave a little food on your plate</strong> to show you've been well-fed</li>
</ul>

<h2>Photography</h2>
<ul>
  <li><strong>Always ask permission</strong> before photographing people, especially women</li>
  <li>Avoid photographing military installations, government buildings, and airports</li>
  <li>In mosques and religious sites, check for photography rules before shooting</li>
</ul>

<h2>During Ramadan</h2>
<p>If you visit during the holy month of Ramadan:</p>
<ul>
  <li><strong>Do not eat, drink, or smoke in public</strong> during daylight hours</li>
  <li>Be extra respectful of noise levels and public behavior</li>
  <li>Embrace the experience — <em>iftar</em> (the evening meal breaking the fast) is a beautiful communal tradition that many restaurants open to visitors</li>
</ul>

<p>Traveling the Middle East with cultural sensitivity transforms a good trip into a deeply meaningful one. <a href="/contact">Let our specialists help you plan a respectful and enriching journey</a>.</p>
      `.trim(),
    },
    {
      slug: "road-trip-essentials-complete-packing-checklist",
      title: "Road Trip Essentials: Your Complete Packing Checklist",
      excerpt: "Whether you're crossing a continent or exploring a coastal highway, the right packing list can make or break a road trip. Here's our comprehensive, field-tested checklist covering everything from safety gear to snacks.",
      featuredImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-04-04"),
      categories: ["tips-guides"],
      tags: ["adventure"],
      content: `
<img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop" alt="Car on an open road" style="width:100%;border-radius:12px;" />

<p>A great road trip is one of travel's purest pleasures — the open road, good music, changing landscapes, and the freedom to stop wherever curiosity takes you. But nothing kills road trip vibes faster than realizing you forgot something essential 200 miles from the nearest store. Use this checklist to make sure you're prepared for anything.</p>

<h2>Vehicle Essentials</h2>
<ul>
  <li>Spare tire, jack, and lug wrench (check condition before departure)</li>
  <li>Jumper cables or a portable jump starter</li>
  <li>Basic tool kit (screwdrivers, pliers, duct tape, zip ties)</li>
  <li>Emergency roadside kit (flares, reflective triangle, flashlight)</li>
  <li>Motor oil and coolant (top off before departing)</li>
  <li>Paper maps or offline GPS maps (cell coverage isn't guaranteed)</li>
</ul>

<h2>Comfort &amp; Convenience</h2>
<ul>
  <li>Sunglasses and a sun visor</li>
  <li>Neck pillow and blanket for passengers</li>
  <li>Phone mounts and chargers (bring at least two cables)</li>
  <li>Cooler with drinks and snacks</li>
  <li>Reusable water bottles</li>
  <li>Trash bags for keeping the car clean</li>
  <li>Wet wipes and hand sanitizer</li>
</ul>

<h2>Entertainment</h2>
<ul>
  <li>Curated road trip playlist (download for offline listening)</li>
  <li>Podcasts and audiobooks (download in advance)</li>
  <li>Travel games for passengers (card games, trivia apps)</li>
  <li>Camera or action cam for capturing the journey</li>
</ul>

<h2>Safety &amp; Health</h2>
<ul>
  <li>First aid kit (bandages, antiseptic, pain relievers, allergy meds)</li>
  <li>Prescription medications (with extra supply)</li>
  <li>Sunscreen and insect repellent</li>
  <li>Driver's license, registration, and insurance documents</li>
  <li>Emergency contact list (written, not just in your phone)</li>
</ul>

<h2>If You're Camping</h2>
<ul>
  <li>Tent, sleeping bags, and sleeping pads</li>
  <li>Camp stove and fuel</li>
  <li>Headlamps or lanterns</li>
  <li>Fire-starting supplies (matches, lighter, fire starters)</li>
  <li>Biodegradable soap and camp towel</li>
</ul>

<h2>Pro Tips</h2>
<ul>
  <li><strong>Pack in layers:</strong> Weather can change dramatically over long distances</li>
  <li><strong>Fill up at half tank:</strong> Don't wait until empty, especially in remote areas</li>
  <li><strong>Plan rest stops every 2 hours:</strong> Stretch, hydrate, switch drivers if possible</li>
  <li><strong>Share your itinerary:</strong> Let someone know your route and expected timeline</li>
</ul>

<p>Planning an epic road trip? Our team can help with <a href="/services">route planning, car rentals, and accommodation bookings</a> along the way.</p>
      `.trim(),
    },
    {
      slug: "island-hopping-greece-2-week-itinerary",
      title: "Island Hopping in Greece: A 2-Week Itinerary",
      excerpt: "Greece has over 6,000 islands, but you only need two weeks to experience the best of them. From the iconic sunsets of Santorini to the hidden beaches of Milos, here's our perfect Greek island-hopping itinerary.",
      featuredImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-04-07"),
      categories: ["destinations"],
      tags: ["europe", "adventure"],
      content: `
<img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=600&fit=crop" alt="Santorini blue domes" style="width:100%;border-radius:12px;" />

<p>Greek island hopping is one of Europe's ultimate travel experiences — turquoise waters, whitewashed villages, ancient ruins, and some of the Mediterranean's best food and wine. With over 200 inhabited islands to choose from, planning can be overwhelming. That's why we've designed this two-week itinerary that balances iconic highlights with hidden gems.</p>

<h2>Days 1–3: Athens</h2>
<p>Start in the Greek capital. Explore the <strong>Acropolis</strong> and its museum, wander through the Plaka neighborhood, catch sunset from Lycabettus Hill, and eat your way through the Central Market. Athens' culinary scene has exploded in recent years — don't miss it.</p>

<h2>Days 4–6: Naxos</h2>
<p>Take the ferry to <strong>Naxos</strong> — the largest of the Cycladic islands and one of the most underrated. Long sandy beaches, mountain villages, Byzantine churches, and outstanding local cuisine (the island is famous for its cheese and potatoes). It's a less crowded, more authentic alternative to Mykonos.</p>

<h2>Days 7–9: Santorini</h2>
<p>No Greek trip is complete without <strong>Santorini</strong>. Watch the sunset from Oia (arrive early for the best spot), explore the archaeological site of Akrotiri, take a catamaran cruise around the caldera, and sample wines from the island's unique volcanic vineyards. Yes, it's touristy — but the beauty is undeniable.</p>

<h2>Days 10–12: Milos</h2>
<p><strong>Milos</strong> is our secret weapon. This volcanic island boasts over 70 beaches — many only accessible by boat — with rock formations in surreal colors: white, red, orange, and gray. Visit the fishing village of Klima with its colorful boat garages, explore the catacombs, and swim in the moonscape of Sarakiniko Beach.</p>

<h2>Days 13–14: Return to Athens</h2>
<p>Ferry back to Athens for a final night. Pick up last-minute souvenirs at Monastiraki Flea Market, enjoy a farewell dinner in Psyri, and reflect on two weeks of island magic.</p>

<h2>Practical Tips</h2>
<ul>
  <li><strong>Best time:</strong> Late May – June or September – early October (warm, sunny, fewer crowds than July–August)</li>
  <li><strong>Ferries:</strong> Book through FerryHopper or Blue Star Ferries. High-speed ferries are faster but pricier.</li>
  <li><strong>Budget:</strong> $80–150/day for mid-range travel (accommodation, food, ferries, activities)</li>
  <li><strong>Rent ATVs:</strong> The best way to explore smaller islands independently</li>
</ul>

<p>Want a custom Greek island itinerary? Our <a href="/contact">Mediterranean specialists</a> can tailor the perfect route for your dates and interests.</p>
      `.trim(),
    },
    {
      slug: "why-iceland-should-be-your-next-solo-travel-destination",
      title: "Why Iceland Should Be Your Next Solo Travel Destination",
      excerpt: "Iceland is one of the safest, most welcoming, and most visually spectacular countries on Earth — making it an ideal destination for solo travelers. From road-tripping the Ring Road to soaking in hidden hot springs, here's why Iceland is perfect for going it alone.",
      featuredImage: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-04-10"),
      categories: ["destinations", "adventure"],
      tags: ["europe", "adventure", "solo-travel"],
      content: `
<img src="https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=1200&h=600&fit=crop" alt="Iceland dramatic landscape" style="width:100%;border-radius:12px;" />

<p>There's something about Iceland that makes it feel like it was designed for solo travelers. The vast, empty landscapes demand reflection. The silence is restorative. The people are warm but respectful of personal space. And practically speaking, it's one of the <strong>safest countries in the world</strong> — consistently ranked #1 on the Global Peace Index.</p>

<h2>The Ring Road: Solo Road Trip of a Lifetime</h2>
<p>Iceland's <strong>Route 1 (Ring Road)</strong> encircles the entire island in approximately 1,322 kilometers. It's the perfect solo road trip — well-maintained, well-signed, and passing through landscapes that change dramatically every hour. Glaciers, volcanoes, black-sand deserts, waterfalls, fjords — the Ring Road has it all.</p>
<p>Allow at least <strong>7–10 days</strong> to drive the full loop at a comfortable pace with time for detours and hikes.</p>

<h2>Hot Springs &amp; Thermal Pools</h2>
<p>Nothing says solo self-care like soaking in a geothermal hot spring under the Northern Lights. While the Blue Lagoon is famous (and worth visiting), the real magic lies in the <strong>hidden hot pots</strong> scattered across the countryside — free, natural, and often completely empty. Notable ones include Seljavallalaug, Reykjadalur, and the Myvatn Nature Baths.</p>

<h2>Safety &amp; Practicality</h2>
<ul>
  <li><strong>Crime rate:</strong> Virtually nonexistent. You'll see locals leave their cars running outside shops in winter.</li>
  <li><strong>English:</strong> Spoken fluently by nearly everyone</li>
  <li><strong>Infrastructure:</strong> Excellent roads, reliable cell coverage (on main routes), and well-equipped campsites</li>
  <li><strong>Solo dining:</strong> Icelanders are accustomed to people dining alone — there's zero stigma</li>
</ul>

<h2>Must-Do Experiences for Solo Travelers</h2>
<ul>
  <li><strong>Chase the Northern Lights</strong> (September – March) — best viewed from rural areas with no light pollution</li>
  <li><strong>Hike to Skogafoss and Seljalandsfoss</strong> — two of the world's most photogenic waterfalls</li>
  <li><strong>Explore the Snaefellsnes Peninsula</strong> — often called "Iceland in miniature"</li>
  <li><strong>Snorkel between tectonic plates</strong> at Silfra fissure in Thingvellir National Park</li>
  <li><strong>Whale watch from Husavik</strong> — the whale capital of Iceland</li>
</ul>

<h2>Budget Tips</h2>
<p>Iceland is expensive, but solo travelers can manage costs:</p>
<ul>
  <li>Rent a campervan and camp — saves significantly on accommodation</li>
  <li>Cook your own meals using supermarket ingredients</li>
  <li>Visit free natural attractions (most waterfalls and hot springs are free)</li>
  <li>Travel in shoulder season (May–June, September) for lower prices</li>
</ul>

<p>Ready for the adventure of a lifetime? <a href="/contact">Let us plan your solo Iceland escape</a>.</p>
      `.trim(),
    },
    {
      slug: "rise-of-digital-nomad-friendly-destinations",
      title: "The Rise of Digital Nomad-Friendly Destinations",
      excerpt: "Remote work has transformed how — and where — we live and travel. Countries around the world are rolling out digital nomad visas and building infrastructure to attract location-independent professionals. Here are the best places to work from paradise.",
      featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-04-13"),
      categories: ["tips-guides", "culture"],
      tags: ["solo-travel", "budget"],
      content: `
<img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop" alt="Digital nomads working at a co-working space" style="width:100%;border-radius:12px;" />

<p>The pandemic permanently changed our relationship with work. What began as a forced experiment in remote work has blossomed into a global movement of <strong>digital nomads</strong> — professionals who leverage technology to work from anywhere with a Wi-Fi connection. And the world is taking notice.</p>

<h2>The Digital Nomad Visa Revolution</h2>
<p>Over 50 countries now offer some form of <strong>digital nomad or remote worker visa</strong>, making it easier than ever to live and work abroad legally. These visas typically allow stays of 6–12 months and require proof of remote employment or freelance income.</p>

<h3>Top Countries with Digital Nomad Visas</h3>
<ul>
  <li><strong>Portugal:</strong> The D7 visa and vibrant Lisbon co-working scene make it Europe's top nomad hub</li>
  <li><strong>Estonia:</strong> The world's first digital nomad visa — perfect for those who love efficiency and technology</li>
  <li><strong>Indonesia (Bali):</strong> The new B211A digital nomad visa formalized what Bali has been for years — the world's favorite remote work paradise</li>
  <li><strong>Colombia:</strong> Medellin's "city of eternal spring" offers incredible value, fast internet, and a thriving nomad community</li>
  <li><strong>Thailand:</strong> The Long-Term Resident visa and cities like Chiang Mai offer unbeatable quality of life at low cost</li>
</ul>

<h2>What Makes a Great Nomad Destination?</h2>
<ul>
  <li><strong>Reliable internet:</strong> Minimum 50 Mbps — essential for video calls and cloud work</li>
  <li><strong>Cost of living:</strong> Affordable accommodation, food, and transport stretch your income further</li>
  <li><strong>Co-working spaces:</strong> Professional environments with good desks, fast Wi-Fi, and community</li>
  <li><strong>Time zone compatibility:</strong> Overlap with your clients or team's working hours</li>
  <li><strong>Quality of life:</strong> Climate, safety, healthcare, food, and social scene</li>
</ul>

<h2>Our Top 5 Nomad Cities for 2026</h2>

<h3>1. Lisbon, Portugal</h3>
<p>Stunning architecture, incredible food, reliable internet, and a creative community. Lisbon has it all — plus easy access to the rest of Europe.</p>

<h3>2. Canggu, Bali</h3>
<p>Rice paddies, surf breaks, healthy cafes, and more co-working spaces per square kilometer than almost anywhere on Earth.</p>

<h3>3. Medellin, Colombia</h3>
<p>Spring-like weather year-round, friendly locals, excellent coffee, and a cost of living that lets you live like royalty on a modest income.</p>

<h3>4. Chiang Mai, Thailand</h3>
<p>The original digital nomad hub. Incredible food, ancient temples, jungle trekking, and a monthly budget of under $1,000 is easily achievable.</p>

<h3>5. Split, Croatia</h3>
<p>Mediterranean beauty, Adriatic coastline, rich history, and a growing tech and nomad scene. Croatia's digital nomad visa is one of Europe's most accessible.</p>

<h2>Getting Started</h2>
<p>If you're considering the nomad lifestyle, start with a <strong>1–3 month trial</strong> in one destination before committing to a longer stay. Test the internet, the co-working options, and the social scene before making it your base.</p>

<p>Need help planning your nomad journey? <a href="/contact">Our travel specialists</a> can recommend destinations, accommodation, and logistics tailored to remote workers.</p>
      `.trim(),
    },
  ];

  for (const post of blogPosts) {
    const created = await prisma.post.create({
      data: {
        tenantId,
        authorId,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        published: true,
        publishedAt: post.publishedAt,
        metaTitle: post.title,
        metaDesc: post.excerpt,
      },
    });

    // Link categories
    for (const catSlug of post.categories) {
      if (categories[catSlug]) {
        await prisma.postCategory.create({
          data: { postId: created.id, categoryId: categories[catSlug] },
        });
      }
    }

    // Link tags
    for (const tagSlug of post.tags) {
      if (tags[tagSlug]) {
        await prisma.postTag.create({
          data: { postId: created.id, tagId: tags[tagSlug] },
        });
      }
    }
  }
  console.log(`✅ Created ${blogPosts.length} blog posts with categories and tags`);

  // ════════════════════════════════════════════════════════════════════════════
  // MENU ITEMS
  // ════════════════════════════════════════════════════════════════════════════

  const menuItems = [
    { label: "Home", url: "/", position: 0 },
    { label: "Destinations", url: "/destinations", position: 1 },
    { label: "Services", url: "/services", position: 2 },
    { label: "Blog", url: "/blog", position: 3 },
    { label: "About", url: "/about", position: 4 },
    { label: "Contact", url: "/contact", position: 5 },
    { label: "Gallery", url: "/gallery", position: 6 },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: { tenantId, label: item.label, url: item.url, position: item.position },
    });
  }
  console.log(`✅ Created ${menuItems.length} menu items`);

  // ════════════════════════════════════════════════════════════════════════════
  // SUBSCRIBERS
  // ════════════════════════════════════════════════════════════════════════════

  const subscribers = [
    { email: "demo@example.com", name: "Demo User" },
    { email: "traveler@example.com", name: "Avid Traveler" },
    { email: "wanderlust@example.com", name: "Wanderlust Explorer" },
  ];

  for (const sub of subscribers) {
    await prisma.subscriber.create({
      data: { tenantId, email: sub.email, name: sub.name, status: "active" },
    });
  }
  console.log(`✅ Created ${subscribers.length} subscribers`);

  console.log("\n🎉 Travel Stall demo content seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
