import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'D:/website-project/frontend/public/images';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const images = {
  // 1. Bedsheet - Madurai Traditional Floral
  'bedsheet-double-floral.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDFBF7"/>
      <stop offset="100%" stop-color="#EFE6D8"/>
    </linearGradient>
    <pattern id="floralPat" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M30 15 C20 15 15 25 30 35 C45 25 40 15 30 15 Z" fill="#9E1B28" opacity="0.15"/>
      <circle cx="30" cy="25" r="4" fill="#D4AF37" opacity="0.4"/>
      <path d="M15 30 C15 20 25 15 35 30 C25 45 15 40 15 30 Z" fill="#9E1B28" opacity="0.12"/>
      <circle cx="10" cy="50" r="2.5" fill="#C59B27" opacity="0.3"/>
      <circle cx="50" cy="10" r="2.5" fill="#C59B27" opacity="0.3"/>
    </pattern>
    <linearGradient id="foldShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#4A151B" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  
  <!-- Stacked / Draped Luxury Bedsheet Display -->
  <g transform="translate(100, 70)" filter="url(#cardShadow)">
    <!-- Base folded sheet -->
    <rect x="0" y="80" width="600" height="380" rx="16" fill="#FFFDF9" stroke="#E2D4C0" stroke-width="2"/>
    <rect x="0" y="80" width="600" height="380" rx="16" fill="url(#floralPat)"/>
    
    <!-- Rich Crimson & Gold Border Frame -->
    <rect x="25" y="105" width="550" height="330" rx="10" fill="none" stroke="#9E1B28" stroke-width="6"/>
    <rect x="35" y="115" width="530" height="310" rx="6" fill="none" stroke="#D4AF37" stroke-width="2" stroke-dasharray="8,4"/>
    
    <!-- Sheet Fold Over (Headboard Turn-back) -->
    <path d="M 0 170 Q 300 150 600 170 L 600 80 L 0 80 Z" fill="#FAF4EA" stroke="#D8C4A9" stroke-width="2"/>
    <rect x="0" y="80" width="600" height="90" fill="url(#foldShade)"/>
    <rect x="20" y="95" width="560" height="12" fill="#9E1B28" rx="3"/>
    <rect x="25" y="112" width="550" height="3" fill="#D4AF37"/>

    <!-- 2 Matching Luxury Pillow Shams on Top -->
    <!-- Left Pillow -->
    <g transform="translate(45, 120)">
      <rect x="0" y="0" width="235" height="150" rx="12" fill="#FFFDF9" stroke="#9E1B28" stroke-width="4" filter="url(#cardShadow)"/>
      <rect x="0" y="0" width="235" height="150" rx="12" fill="url(#floralPat)"/>
      <rect x="12" y="12" width="211" height="126" rx="6" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
      <!-- Pillow flange border -->
      <path d="M 0 0 L 235 0 L 235 150 L 0 150 Z" fill="none" stroke="#FAF2E5" stroke-width="16" rx="8"/>
      <circle cx="117" cy="75" r="28" fill="#9E1B28" opacity="0.12"/>
      <circle cx="117" cy="75" r="14" fill="#D4AF37" opacity="0.25"/>
    </g>

    <!-- Right Pillow -->
    <g transform="translate(320, 120)">
      <rect x="0" y="0" width="235" height="150" rx="12" fill="#FFFDF9" stroke="#9E1B28" stroke-width="4" filter="url(#cardShadow)"/>
      <rect x="0" y="0" width="235" height="150" rx="12" fill="url(#floralPat)"/>
      <rect x="12" y="12" width="211" height="126" rx="6" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
      <path d="M 0 0 L 235 0 L 235 150 L 0 150 Z" fill="none" stroke="#FAF2E5" stroke-width="16" rx="8"/>
      <circle cx="117" cy="75" r="28" fill="#9E1B28" opacity="0.12"/>
      <circle cx="117" cy="75" r="14" fill="#D4AF37" opacity="0.25"/>
    </g>
  </g>

  <!-- Premium Quality Seal Badge -->
  <g transform="translate(620, 430)">
    <circle cx="50" cy="50" r="44" fill="#9E1B28" stroke="#D4AF37" stroke-width="3"/>
    <circle cx="50" cy="50" r="39" fill="none" stroke="#FFF2A3" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="50" y="44" fill="#FFF2A3" font-family="'DM Sans',sans-serif" font-weight="700" font-size="11" text-anchor="middle" letter-spacing="1">100% PURE</text>
    <text x="50" y="60" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="800" font-size="14" text-anchor="middle">COTTON</text>
  </g>
  <!-- Shop Signature tag -->
  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · MADURAI</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Double Bed (90" × 108") + 2 Pillow Shams</text>
</svg>`,

  // 2. Bedsheet - Satin Stripe King
  'bedsheet-satin-stripe.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="stripeBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F6F3EE"/>
      <stop offset="100%" stop-color="#E7E0D2"/>
    </linearGradient>
    <pattern id="satinStripes" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="15" height="30" fill="#FFFFFF"/>
      <rect x="15" width="15" height="30" fill="#F0EBE1"/>
    </pattern>
    <filter id="drop" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#302015" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#stripeBg)"/>

  <g transform="translate(90, 80)" filter="url(#drop)">
    <!-- Hotel Satin Stripe Bed Linen -->
    <rect x="10" y="60" width="600" height="380" rx="14" fill="url(#satinStripes)" stroke="#D4C4B0" stroke-width="2"/>
    
    <!-- Top Quilt turn -->
    <path d="M 10 160 Q 310 140 610 160 L 610 60 L 10 60 Z" fill="#FFF" stroke="#C5B5A0" stroke-width="1.5"/>
    <line x1="20" y1="160" x2="600" y2="160" stroke="#C59B27" stroke-width="3"/>

    <!-- Two Pillows with Satin Flange -->
    <g transform="translate(50, 110)">
      <rect x="0" y="0" width="230" height="145" rx="10" fill="url(#satinStripes)" stroke="#C59B27" stroke-width="2"/>
      <rect x="14" y="14" width="202" height="117" fill="#FFFFFF" opacity="0.6"/>
    </g>
    <g transform="translate(330, 110)">
      <rect x="0" y="0" width="230" height="145" rx="10" fill="url(#satinStripes)" stroke="#C59B27" stroke-width="2"/>
      <rect x="14" y="14" width="202" height="117" fill="#FFFFFF" opacity="0.6"/>
    </g>
  </g>

  <!-- 300 TC Luxury Seal -->
  <g transform="translate(630, 430)">
    <circle cx="45" cy="45" r="42" fill="#D4AF37" stroke="#9E1B28" stroke-width="2"/>
    <text x="45" y="40" fill="#9E1B28" font-family="'DM Sans',sans-serif" font-weight="800" font-size="16" text-anchor="middle">300 TC</text>
    <text x="45" y="56" fill="#4A151B" font-family="'DM Sans',sans-serif" font-weight="700" font-size="10" text-anchor="middle" letter-spacing="1">HOTEL LUXURY</text>
  </g>
  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · SATIN STRIPE</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">King Size (108" × 108") · Pure Glace Cotton</text>
</svg>`,

  // 3. Bedsheet - Single Geometric
  'bedsheet-single-geometric.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="geoBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F2F5F8"/>
      <stop offset="100%" stop-color="#D9E2EC"/>
    </linearGradient>
    <pattern id="geoPat" width="40" height="40" patternUnits="userSpaceOnUse">
      <polygon points="20,5 35,20 20,35 5,20" fill="none" stroke="#2B4C6F" stroke-width="1.5" opacity="0.25"/>
      <circle cx="20" cy="20" r="3" fill="#D4AF37" opacity="0.4"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#geoBg)"/>

  <g transform="translate(160, 80)">
    <rect x="0" y="40" width="480" height="420" rx="14" fill="#FFFFFF" stroke="#B8C8D9" stroke-width="2"/>
    <rect x="0" y="40" width="480" height="420" rx="14" fill="url(#geoPat)"/>
    
    <!-- Navy Blue Header Band -->
    <rect x="20" y="60" width="440" height="24" rx="4" fill="#1C3D5A"/>
    <rect x="25" y="88" width="430" height="4" fill="#D4AF37"/>
    
    <!-- Single Pillow Sham -->
    <g transform="translate(100, 120)">
      <rect x="0" y="0" width="280" height="150" rx="12" fill="#FFF" stroke="#1C3D5A" stroke-width="3"/>
      <rect x="0" y="0" width="280" height="150" rx="12" fill="url(#geoPat)"/>
      <rect x="15" y="15" width="250" height="120" rx="6" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
    </g>
  </g>

  <text x="50" y="560" fill="#1C3D5A" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · DAILY COMFORT</text>
  <text x="750" y="560" fill="#52667A" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Single Bed (60" × 90") + 1 Pillow Cover</text>
</svg>`,

  // 4. Towel - Madurai Pure Cotton Waffle Pack
  'towel-waffle-pack.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="towelBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCF9F2"/>
      <stop offset="100%" stop-color="#EFE5D3"/>
    </linearGradient>
    <pattern id="waffleGrid" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="none" stroke="#85633C" stroke-width="0.8" opacity="0.2"/>
      <rect x="3" y="3" width="6" height="6" fill="#85633C" opacity="0.08"/>
    </pattern>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="4" dy="10" stdDeviation="12" flood-color="#402010" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#towelBg)"/>

  <!-- Stack of 3 Madurai Waffle Cotton Bath Towels -->
  <g transform="translate(180, 110)" filter="url(#softShadow)">
    <!-- Bottom Towel: Golden Ochre -->
    <rect x="0" y="240" width="440" height="90" rx="18" fill="#E8B958" stroke="#BF9030" stroke-width="2"/>
    <rect x="0" y="240" width="440" height="90" rx="18" fill="url(#waffleGrid)"/>
    <line x1="30" y1="285" x2="410" y2="285" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="10,6"/>

    <!-- Middle Towel: Rich Maroon Red -->
    <rect x="20" y="150" width="400" height="90" rx="18" fill="#9E1B28" stroke="#7A101B" stroke-width="2"/>
    <rect x="20" y="150" width="400" height="90" rx="18" fill="url(#waffleGrid)"/>
    <line x1="45" y1="195" x2="395" y2="195" stroke="#FFEAA7" stroke-width="3" stroke-dasharray="10,6"/>

    <!-- Top Towel: Pure Cotton Off-White / Natural -->
    <rect x="40" y="60" width="360" height="90" rx="18" fill="#FFFDF8" stroke="#D1C2A5" stroke-width="2"/>
    <rect x="40" y="60" width="360" height="90" rx="18" fill="url(#waffleGrid)"/>
    <line x1="65" y1="105" x2="375" y2="105" stroke="#9E1B28" stroke-width="4"/>
    <line x1="65" y1="113" x2="375" y2="113" stroke="#D4AF37" stroke-width="2"/>

    <!-- Cotton Tag Tied with Twine -->
    <g transform="translate(310, 85)">
      <rect x="0" y="0" width="80" height="42" rx="4" fill="#F4EADB" stroke="#9E1B28" stroke-width="1.5"/>
      <text x="40" y="18" fill="#9E1B28" font-family="'DM Sans',sans-serif" font-weight="800" font-size="10" text-anchor="middle">MADURAI</text>
      <text x="40" y="32" fill="#5A3A1A" font-family="'DM Sans',sans-serif" font-weight="600" font-size="9" text-anchor="middle">PURE COTTON</text>
    </g>
  </g>

  <!-- High Absorption Badge -->
  <g transform="translate(620, 390)">
    <circle cx="45" cy="45" r="42" fill="#FFF" stroke="#9E1B28" stroke-width="2.5"/>
    <text x="45" y="38" fill="#9E1B28" font-family="'DM Sans',sans-serif" font-weight="800" font-size="13" text-anchor="middle">QUICK-DRY</text>
    <text x="45" y="55" fill="#555" font-family="'DM Sans',sans-serif" font-weight="600" font-size="10" text-anchor="middle">HIGH ABSORB</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · MADURAI TOWELS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Pack of 2 · 100% Pure Waffle Cotton (30" × 60")</text>
</svg>`,

  // 5. Towel - Turkish Cotton Bath Towel
  'towel-turkish-bath.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="turkBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F9F6F0"/>
      <stop offset="100%" stop-color="#E5DCCE"/>
    </linearGradient>
    <filter id="plush" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#3A1C20" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#turkBg)"/>

  <g transform="translate(150, 100)" filter="url(#plush)">
    <!-- Plush Royal Crimson Extra Heavy Bath Towel -->
    <rect x="0" y="0" width="500" height="380" rx="20" fill="#8B131B" stroke="#680A10" stroke-width="3"/>
    
    <!-- Dobby Jacquard Border at Top & Bottom -->
    <rect x="0" y="40" width="500" height="30" fill="#D4AF37"/>
    <rect x="0" y="45" width="500" height="2" fill="#680A10"/>
    <rect x="0" y="63" width="500" height="2" fill="#680A10"/>

    <rect x="0" y="310" width="500" height="30" fill="#D4AF37"/>
    <rect x="0" y="315" width="500" height="2" fill="#680A10"/>
    <rect x="0" y="333" width="500" height="2" fill="#680A10"/>

    <!-- Fold Crease Shading -->
    <path d="M 0 190 Q 250 170 500 190 L 500 205 Q 250 185 0 205 Z" fill="#000" opacity="0.18"/>
  </g>

  <!-- 550 GSM Badge -->
  <g transform="translate(620, 420)">
    <circle cx="45" cy="45" r="42" fill="#D4AF37" stroke="#8B131B" stroke-width="2.5"/>
    <text x="45" y="40" fill="#8B131B" font-family="'DM Sans',sans-serif" font-weight="900" font-size="16" text-anchor="middle">550 GSM</text>
    <text x="45" y="55" fill="#4A1015" font-family="'DM Sans',sans-serif" font-weight="700" font-size="10" text-anchor="middle">HEAVY PLUSH</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · TURKISH LUXURY</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Extra Large (35" × 70") · Super Soft Terry</text>
</svg>`,

  // 6. Towel - Face & Hand Towel Set
  'towel-hand-set.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="handBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCFAF7"/>
      <stop offset="100%" stop-color="#EAE3D5"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#handBg)"/>

  <!-- Set of 4 Neatly Rolled Hand & Face Towels -->
  <g transform="translate(100, 120)">
    <!-- Towel 1: Ivory -->
    <g transform="translate(0, 40)">
      <rect x="0" y="0" width="130" height="260" rx="20" fill="#FFFDF8" stroke="#D9CCA8" stroke-width="2"/>
      <ellipse cx="65" cy="20" rx="55" ry="16" fill="#EDE4CE"/>
      <rect x="0" y="80" width="130" height="15" fill="#D4AF37" opacity="0.8"/>
    </g>
    <!-- Towel 2: Crimson -->
    <g transform="translate(150, 40)">
      <rect x="0" y="0" width="130" height="260" rx="20" fill="#9E1B28" stroke="#7A101B" stroke-width="2"/>
      <ellipse cx="65" cy="20" rx="55" ry="16" fill="#800D18"/>
      <rect x="0" y="80" width="130" height="15" fill="#FFF2A3" opacity="0.8"/>
    </g>
    <!-- Towel 3: Saffron Gold -->
    <g transform="translate(300, 40)">
      <rect x="0" y="0" width="130" height="260" rx="20" fill="#E8B958" stroke="#C29432" stroke-width="2"/>
      <ellipse cx="65" cy="20" rx="55" ry="16" fill="#CCA03B"/>
      <rect x="0" y="80" width="130" height="15" fill="#9E1B28" opacity="0.8"/>
    </g>
    <!-- Towel 4: Forest Jade -->
    <g transform="translate(450, 40)">
      <rect x="0" y="0" width="130" height="260" rx="20" fill="#285547" stroke="#1B3B31" stroke-width="2"/>
      <ellipse cx="65" cy="20" rx="55" ry="16" fill="#204539"/>
      <rect x="0" y="80" width="130" height="15" fill="#D4AF37" opacity="0.8"/>
    </g>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · HAND & FACE TOWELS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Set of 4 · Premium Cotton Hand Towels (16" × 24")</text>
</svg>`,

  // 7. Pillows - Pure Ilavam Panju (Silk Cotton)
  'pillow-silk-cotton.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="pillowBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDFBF7"/>
      <stop offset="100%" stop-color="#EBE3D3"/>
    </linearGradient>
    <radialGradient id="plumpShade" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="70%" stop-color="#FAF4E8"/>
      <stop offset="100%" stop-color="#E0D2BC"/>
    </radialGradient>
    <filter id="plumpShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#4A2510" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#pillowBg)"/>

  <!-- Plump Natural Ilavam Panju Pillow with Traditional Red Piped Edge -->
  <g transform="translate(130, 110)" filter="url(#plumpShadow)">
    <!-- Pillow Body -->
    <path d="M 40 40 Q 270 10 500 40 Q 530 180 500 320 Q 270 350 40 320 Q 10 180 40 40 Z" fill="url(#plumpShade)" stroke="#9E1B28" stroke-width="4"/>
    
    <!-- Delicate center tuft / stitching crease -->
    <circle cx="270" cy="180" r="6" fill="#9E1B28" opacity="0.3"/>
    <path d="M 230 180 Q 270 170 310 180" fill="none" stroke="#D1C4B0" stroke-width="2"/>
    <path d="M 270 140 Q 270 180 270 220" fill="none" stroke="#D1C4B0" stroke-width="2"/>

    <!-- Handloom Cotton Label on corner -->
    <g transform="translate(420, 260) rotate(-10)">
      <rect x="0" y="0" width="90" height="40" rx="4" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
      <text x="45" y="16" fill="#FFF2A3" font-family="'DM Sans',sans-serif" font-weight="700" font-size="9" text-anchor="middle">PURE ILAVAM</text>
      <text x="45" y="30" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="800" font-size="11" text-anchor="middle">PANJU</text>
    </g>
  </g>

  <!-- 100% Natural Organic Seal -->
  <g transform="translate(630, 410)">
    <circle cx="45" cy="45" r="42" fill="#285547" stroke="#D4AF37" stroke-width="2.5"/>
    <text x="45" y="36" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="800" font-size="11" text-anchor="middle">100% NATURAL</text>
    <text x="45" y="52" fill="#FFF2A3" font-family="'DM Sans',sans-serif" font-weight="700" font-size="12" text-anchor="middle">SILK COTTON</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · TRADITIONAL PILLOWS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Standard Size (18" × 27") · Pure Ilavam Panju (Cooling & Ergonomic)</text>
</svg>`,

  // 8. Pillows - Luxury Microfiber Pair
  'pillow-microfiber-pair.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="mfBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F4F8FA"/>
      <stop offset="100%" stop-color="#DFEBF2"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#mfBg)"/>

  <!-- Twin Pack of Hotel Cloud Microfiber Pillows -->
  <g transform="translate(100, 100)">
    <!-- Back Pillow -->
    <g transform="translate(60, 20)">
      <rect x="0" y="0" width="480" height="250" rx="24" fill="#FFFFFF" stroke="#C5D7E5" stroke-width="3"/>
      <rect x="12" y="12" width="456" height="226" rx="16" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
    </g>
    <!-- Front Pillow overlapping -->
    <g transform="translate(20, 120)">
      <rect x="0" y="0" width="520" height="270" rx="26" fill="#FCFEFF" stroke="#9E1B28" stroke-width="3"/>
      <rect x="15" y="15" width="490" height="240" rx="18" fill="none" stroke="#D4AF37" stroke-width="2"/>
      <circle cx="260" cy="135" r="4" fill="#9E1B28" opacity="0.3"/>
    </g>
  </g>

  <!-- Hotel Grade Badge -->
  <g transform="translate(630, 420)">
    <circle cx="45" cy="45" r="42" fill="#D4AF37" stroke="#1A3B5C" stroke-width="2.5"/>
    <text x="45" y="38" fill="#1A3B5C" font-family="'DM Sans',sans-serif" font-weight="900" font-size="13" text-anchor="middle">HOTEL</text>
    <text x="45" y="54" fill="#1A3B5C" font-family="'DM Sans',sans-serif" font-weight="700" font-size="12" text-anchor="middle">CLOUD COMFORT</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · HOTEL COMFORT</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Pack of 2 · Virgin Microfiber Down-Alternative Pillows</text>
</svg>`,

  // 9. Beds - Pure Ilavam Panju Traditional Mattress
  'bed-ilavam-panju-mattress.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="mattBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCFAF6"/>
      <stop offset="100%" stop-color="#ECE3D4"/>
    </linearGradient>
    <filter id="bedDrop" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#4A181C" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#mattBg)"/>

  <!-- Isometric / Angled View of Heavy Hand-Tufted Ilavam Panju Mattress -->
  <g transform="translate(100, 110)" filter="url(#bedDrop)">
    <!-- Base 3D Thickness of Mattress -->
    <path d="M 30 180 L 300 320 L 580 200 L 310 60 Z" fill="#9E1B28" stroke="#750E16" stroke-width="3"/>
    
    <!-- Top Face of Mattress with Traditional Red & Gold Cotton Fabric -->
    <path d="M 30 130 L 300 270 L 580 150 L 310 10 Z" fill="#FFF8F0" stroke="#9E1B28" stroke-width="4"/>
    
    <!-- Front Side Thickness -->
    <path d="M 30 130 L 300 270 L 300 320 L 30 180 Z" fill="#8B131B"/>
    <!-- Right Side Thickness -->
    <path d="M 300 270 L 580 150 L 580 200 L 300 320 Z" fill="#6E0C13"/>

    <!-- Hand-stitched Tufting Buttons on Top Surface -->
    <!-- Row 1 -->
    <circle cx="220" cy="90" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
    <circle cx="350" cy="85" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
    <!-- Row 2 -->
    <circle cx="170" cy="140" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
    <circle cx="305" cy="140" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
    <circle cx="440" cy="135" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
    <!-- Row 3 -->
    <circle cx="120" cy="190" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
    <circle cx="260" cy="195" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
    <circle cx="400" cy="190" r="4.5" fill="#9E1B28" stroke="#D4AF37" stroke-width="1.5"/>
  </g>

  <!-- Heritage Craft Seal -->
  <g transform="translate(630, 410)">
    <circle cx="45" cy="45" r="42" fill="#9E1B28" stroke="#D4AF37" stroke-width="3"/>
    <text x="45" y="38" fill="#FFF2A3" font-family="'DM Sans',sans-serif" font-weight="900" font-size="12" text-anchor="middle">MADURAI</text>
    <text x="45" y="54" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="700" font-size="11" text-anchor="middle">HAND-TUFTED</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · HANDCRAFTED MATTRESSES</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Double Bed (75" × 60" × 5") · 100% Pure Ilavam Panju</text>
</svg>`,

  // 10. Beds - Foldable Travel Bed
  'bed-foldable-travel.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="foldBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F8FAF7"/>
      <stop offset="100%" stop-color="#E2EBE0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#foldBg)"/>

  <!-- 3-Fold Portable Floor Bed Mattress -->
  <g transform="translate(140, 110)">
    <!-- Fold 1 (Bottom) -->
    <rect x="0" y="240" width="520" height="85" rx="12" fill="#285547" stroke="#1D3E34" stroke-width="3"/>
    <!-- Fold 2 (Middle) -->
    <rect x="25" y="150" width="470" height="85" rx="12" fill="#3D7362" stroke="#1D3E34" stroke-width="3"/>
    <!-- Fold 3 (Top) -->
    <rect x="50" y="60" width="420" height="85" rx="12" fill="#528F7B" stroke="#1D3E34" stroke-width="3"/>
    
    <!-- Carry Straps & Buckle -->
    <rect x="180" y="45" width="30" height="295" rx="4" fill="#D4AF37" stroke="#8A6E1E" stroke-width="2"/>
    <rect x="340" y="45" width="30" height="295" rx="4" fill="#D4AF37" stroke="#8A6E1E" stroke-width="2"/>
  </g>

  <text x="50" y="560" fill="#285547" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · TRAVEL & GUEST BEDS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Tri-Fold Mattress (72" × 36" × 3") · High Density Cotton Foam</text>
</svg>`,

  // 11. Baby Beds - Newborn Bed with Mosquito Net
  'baby-bed-mosquito-net.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="babyBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFDF9"/>
      <stop offset="100%" stop-color="#FCECEE"/>
    </linearGradient>
    <filter id="babyShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#B35D67" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#babyBg)"/>

  <!-- Newborn Baby Bed with Mesh Mosquito Net Arch & Mini Pillow -->
  <g transform="translate(130, 90)" filter="url(#babyShadow)">
    <!-- Base Baby Mattress Mattress Ring -->
    <ellipse cx="270" cy="330" rx="250" ry="85" fill="#FFCCD5" stroke="#E58C9B" stroke-width="3"/>
    <ellipse cx="270" cy="320" rx="220" ry="70" fill="#FFF9FA"/>
    
    <!-- Mesh Netting Dome / Canopy Arch -->
    <path d="M 50 310 C 50 110 490 110 490 310 Z" fill="none" stroke="#DDA0AA" stroke-width="2" stroke-dasharray="3,3" opacity="0.6"/>
    <path d="M 80 320 C 80 130 460 130 460 320 Z" fill="#FFFFFF" opacity="0.35"/>
    <path d="M 270 120 L 270 330" stroke="#E58C9B" stroke-width="2.5"/>
    
    <!-- Zipper line across dome -->
    <path d="M 120 280 Q 270 140 420 280" fill="none" stroke="#9E1B28" stroke-width="3"/>
    
    <!-- Cute Newborn Crown / Head Shaping Pillow -->
    <g transform="translate(230, 270)">
      <path d="M 0 25 C 10 5 30 0 45 15 C 60 0 80 5 90 25 C 75 40 15 40 0 25 Z" fill="#FFEAA7" stroke="#E5A93C" stroke-width="2"/>
      <circle cx="45" cy="24" r="6" fill="#FFFFFF"/>
    </g>
    
    <!-- Mini Bolsters on sides -->
    <rect x="90" y="295" width="85" height="26" rx="13" fill="#FFCCD5" stroke="#E58C9B" stroke-width="1.5"/>
    <rect x="365" y="295" width="85" height="26" rx="13" fill="#FFCCD5" stroke="#E58C9B" stroke-width="1.5"/>
  </g>

  <!-- Baby Safety Seal -->
  <g transform="translate(630, 410)">
    <circle cx="45" cy="45" r="42" fill="#FFF" stroke="#9E1B28" stroke-width="2.5"/>
    <text x="45" y="38" fill="#9E1B28" font-family="'DM Sans',sans-serif" font-weight="900" font-size="12" text-anchor="middle">100% SAFE</text>
    <text x="45" y="54" fill="#6B131B" font-family="'DM Sans',sans-serif" font-weight="700" font-size="10" text-anchor="middle">ANTI-MOSQUITO</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · NEWBORN BABY CARE</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Baby Bed + Zip Net Canopy + Neck Pillow & 2 Bolsters</text>
</svg>`,

  // 12. Baby Beds - Waterproof Soft Baby Sleeping Nest
  'baby-bed-nest.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="nestBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCF9F4"/>
      <stop offset="100%" stop-color="#EBE3D5"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#nestBg)"/>

  <!-- Padded Baby Nest Lounger -->
  <g transform="translate(180, 80)">
    <!-- Outer bumper ring -->
    <rect x="0" y="30" width="440" height="390" rx="120" fill="#FFF8EE" stroke="#9E1B28" stroke-width="4"/>
    <rect x="35" y="65" width="370" height="320" rx="90" fill="#FFF" stroke="#D4AF37" stroke-width="2"/>
    <ellipse cx="220" cy="225" rx="140" ry="120" fill="#FBF5EA"/>
    
    <!-- Cute Ribbon bow at foot of nest -->
    <path d="M 195 410 Q 220 395 245 410 Q 220 435 195 410 Z" fill="#9E1B28"/>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · BABY COMFORT</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Organic Cotton Baby Nest Bed · Reversible & Waterproof</text>
</svg>`,

  // 13. Function Shawls - Royal Gold Zari Ponnada
  'shawl-gold-ponnada.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="shawlBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2D1115"/>
      <stop offset="100%" stop-color="#140608"/>
    </linearGradient>
    <linearGradient id="goldZari" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#AA771C"/>
      <stop offset="35%" stop-color="#FFE07D"/>
      <stop offset="70%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#996515"/>
    </linearGradient>
    <pattern id="zariMotif" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20 5 L35 20 L20 35 L5 20 Z" fill="none" stroke="#FFEAA7" stroke-width="1.2" opacity="0.6"/>
      <circle cx="20" cy="20" r="3" fill="#FFF2A3"/>
    </pattern>
    <filter id="zariGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#D4AF37" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#shawlBg)"/>

  <!-- Draped Traditional Ponnada Shawl -->
  <g transform="translate(110, 80)" filter="url(#zariGlow)">
    <!-- Main Crimson Silk Shawl Body -->
    <rect x="0" y="50" width="580" height="360" rx="12" fill="#88121A" stroke="#5E0B11" stroke-width="3"/>
    <rect x="0" y="50" width="580" height="360" rx="12" fill="url(#zariMotif)"/>

    <!-- Broad Shimmering Pure Gold Zari Borders (Pallu Ends) -->
    <!-- Left Border -->
    <rect x="0" y="50" width="65" height="360" rx="10" fill="url(#goldZari)"/>
    <line x1="65" y1="50" x2="65" y2="410" stroke="#FFF2A3" stroke-width="2"/>
    <!-- Left Golden Fringes (Kuncham) -->
    <g stroke="#D4AF37" stroke-width="2">
      <line x1="-15" y1="60" x2="0" y2="60"/>
      <line x1="-15" y1="90" x2="0" y2="90"/>
      <line x1="-15" y1="120" x2="0" y2="120"/>
      <line x1="-15" y1="150" x2="0" y2="150"/>
      <line x1="-15" y1="180" x2="0" y2="180"/>
      <line x1="-15" y1="210" x2="0" y2="210"/>
      <line x1="-15" y1="240" x2="0" y2="240"/>
      <line x1="-15" y1="270" x2="0" y2="270"/>
      <line x1="-15" y1="300" x2="0" y2="300"/>
      <line x1="-15" y1="330" x2="0" y2="330"/>
      <line x1="-15" y1="360" x2="0" y2="360"/>
      <line x1="-15" y1="390" x2="0" y2="390"/>
    </g>

    <!-- Right Border -->
    <rect x="515" y="50" width="65" height="360" rx="10" fill="url(#goldZari)"/>
    <line x1="515" y1="50" x2="515" y2="410" stroke="#FFF2A3" stroke-width="2"/>
    <!-- Right Golden Fringes -->
    <g stroke="#D4AF37" stroke-width="2">
      <line x1="580" y1="60" x2="595" y2="60"/>
      <line x1="580" y1="90" x2="595" y2="90"/>
      <line x1="580" y1="120" x2="595" y2="120"/>
      <line x1="580" y1="150" x2="595" y2="150"/>
      <line x1="580" y1="180" x2="595" y2="180"/>
      <line x1="580" y1="210" x2="595" y2="210"/>
      <line x1="580" y1="240" x2="595" y2="240"/>
      <line x1="580" y1="270" x2="595" y2="270"/>
      <line x1="580" y1="300" x2="595" y2="300"/>
      <line x1="580" y1="330" x2="595" y2="330"/>
      <line x1="580" y1="360" x2="595" y2="360"/>
      <line x1="580" y1="390" x2="595" y2="390"/>
    </g>

    <!-- Top & Bottom Gold Zari Edges -->
    <rect x="65" y="50" width="450" height="15" fill="url(#goldZari)"/>
    <rect x="65" y="395" width="450" height="15" fill="url(#goldZari)"/>
  </g>

  <!-- Felicitation & Temple Shawl Seal -->
  <g transform="translate(630, 420)">
    <circle cx="45" cy="45" r="42" fill="#D4AF37" stroke="#FFF" stroke-width="2"/>
    <text x="45" y="38" fill="#5A0A10" font-family="'DM Sans',sans-serif" font-weight="900" font-size="12" text-anchor="middle">ROYAL</text>
    <text x="45" y="54" fill="#5A0A10" font-family="'DM Sans',sans-serif" font-weight="800" font-size="12" text-anchor="middle">PONNADA</text>
  </g>

  <text x="50" y="560" fill="#FFF2A3" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · FUNCTION SHAWLS</text>
  <text x="750" y="560" fill="#D4AF37" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Felicitation Ponnada (2.2m) · Rich Gold Zari & Fringes</text>
</svg>`,

  // 14. Function Shawls - Velvet Bordered Gift Shawl
  'shawl-velvet-traditional.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="velvetBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#261015"/>
      <stop offset="100%" stop-color="#120508"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#velvetBg)"/>

  <!-- Velvet Trimmed Traditional Wedding Gift Shawl -->
  <g transform="translate(120, 90)">
    <rect x="0" y="40" width="560" height="370" rx="14" fill="#6A1017" stroke="#9E1B28" stroke-width="3"/>
    
    <!-- Royal Velvet Border -->
    <rect x="20" y="60" width="520" height="330" rx="8" fill="none" stroke="#D4AF37" stroke-width="12"/>
    <rect x="35" y="75" width="490" height="300" rx="4" fill="none" stroke="#FFF2A3" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Floral Medallion in Center -->
    <circle cx="280" cy="225" r="45" fill="none" stroke="#D4AF37" stroke-width="3"/>
    <circle cx="280" cy="225" r="30" fill="#9E1B28" stroke="#FFF2A3" stroke-width="1.5"/>
  </g>

  <text x="50" y="560" fill="#FFF2A3" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · WEDDING GIFT SHAWLS</text>
  <text x="750" y="560" fill="#D4AF37" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Premium Silk Velvet Bordered Shawl · Ceremonial Gifting</text>
</svg>`,

  // 15. Inner Wears - 100% Combed Cotton Vests Pack
  'innerwear-cotton-vests.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="innerBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="cleanShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#1A365D" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#innerBg)"/>

  <!-- Pack of 3 Pure Combed Cotton White Vests (RNS Cut) -->
  <g transform="translate(190, 80)" filter="url(#cleanShadow)">
    <!-- Vest 3 (Back) -->
    <path d="M 80 80 L 120 40 L 180 80 Q 210 110 240 80 L 300 40 L 340 80 L 340 180 Q 380 200 360 260 L 360 380 L 60 380 L 60 260 Q 40 200 80 180 Z" fill="#F0F4F8" stroke="#CBD5E0" stroke-width="2"/>
    <!-- Vest 2 (Middle) -->
    <path d="M 60 100 L 100 60 L 160 100 Q 190 130 220 100 L 280 60 L 320 100 L 320 200 Q 360 220 340 280 L 340 400 L 40 400 L 40 280 Q 20 220 60 200 Z" fill="#F7FAFC" stroke="#A0AEC0" stroke-width="2"/>
    <!-- Vest 1 (Front) -->
    <path d="M 40 120 L 80 80 L 140 120 Q 170 150 200 120 L 260 80 L 300 120 L 300 220 Q 340 240 320 300 L 320 420 L 20 420 L 20 300 Q 0 240 40 220 Z" fill="#FFFFFF" stroke="#9E1B28" stroke-width="2.5"/>
    
    <!-- Neckline Ribbing -->
    <path d="M 140 120 Q 170 150 200 120" fill="none" stroke="#D4AF37" stroke-width="3"/>
    
    <!-- Brand Stamp on Chest -->
    <g transform="translate(130, 200)">
      <circle cx="40" cy="20" r="18" fill="none" stroke="#9E1B28" stroke-width="1.5"/>
      <text x="40" y="23" fill="#9E1B28" font-family="'DM Sans',sans-serif" font-weight="900" font-size="10" text-anchor="middle">RT</text>
    </g>
  </g>

  <!-- Pack of 3 Seal -->
  <g transform="translate(630, 420)">
    <circle cx="45" cy="45" r="42" fill="#9E1B28" stroke="#D4AF37" stroke-width="2"/>
    <text x="45" y="38" fill="#FFF2A3" font-family="'DM Sans',sans-serif" font-weight="900" font-size="14" text-anchor="middle">PACK OF 3</text>
    <text x="45" y="54" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="700" font-size="10" text-anchor="middle">100% COTTON</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · COMFORT INNERWEAR</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Pack of 3 · 100% Super Combed Cotton Sleeveless Vests</text>
</svg>`,

  // 16. Inner Wears - Men's Briefs & Trunks Pack
  'innerwear-briefs-trunks.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="trunkBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F2F5F8"/>
      <stop offset="100%" stop-color="#D5DEE7"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#trunkBg)"/>

  <!-- Pack of 3 Cotton Stretch Trunks (Navy, Charcoal, Burgundy) -->
  <g transform="translate(150, 110)">
    <!-- Trunk 1: Charcoal -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="150" height="30" rx="4" fill="#9E1B28" stroke="#680A10" stroke-width="1.5"/>
      <text x="75" y="20" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="800" font-size="11" text-anchor="middle">RAJAMANI</text>
      <path d="M 0 30 L 150 30 L 135 180 L 85 180 L 75 140 L 65 180 L 15 180 Z" fill="#2D3748" stroke="#1A202C" stroke-width="2"/>
    </g>
    <!-- Trunk 2: Navy Blue -->
    <g transform="translate(170, 0)">
      <rect x="0" y="0" width="150" height="30" rx="4" fill="#9E1B28" stroke="#680A10" stroke-width="1.5"/>
      <text x="75" y="20" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="800" font-size="11" text-anchor="middle">RAJAMANI</text>
      <path d="M 0 30 L 150 30 L 135 180 L 85 180 L 75 140 L 65 180 L 15 180 Z" fill="#1A365D" stroke="#0F213A" stroke-width="2"/>
    </g>
    <!-- Trunk 3: Royal Crimson -->
    <g transform="translate(340, 0)">
      <rect x="0" y="0" width="150" height="30" rx="4" fill="#D4AF37" stroke="#8A6E1E" stroke-width="1.5"/>
      <text x="75" y="20" fill="#680A10" font-family="'DM Sans',sans-serif" font-weight="800" font-size="11" text-anchor="middle">RAJAMANI</text>
      <path d="M 0 30 L 150 30 L 135 180 L 85 180 L 75 140 L 65 180 L 15 180 Z" fill="#7B111A" stroke="#52070D" stroke-width="2"/>
    </g>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · TRUNKS & BRIEFS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Pack of 3 · Soft Cotton Elastic Waistband Trunks</text>
</svg>`,

  // 17. Door Screens - 7ft Jacquard Door Screen Curtains
  'screen-door-curtain.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="curtainBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="100%" stop-color="#E8DFD0"/>
    </linearGradient>
    <pattern id="jacquardCurtain" width="40" height="80" patternUnits="userSpaceOnUse">
      <path d="M20 10 Q35 30 20 50 Q5 30 20 10 Z" fill="#D4AF37" opacity="0.35"/>
      <circle cx="20" cy="30" r="4" fill="#9E1B28" opacity="0.4"/>
    </pattern>
    <filter id="curtainShade" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="4" dy="14" stdDeviation="16" flood-color="#3A1C20" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#curtainBg)"/>

  <!-- Chrome Rod with Grommets / Eyelets -->
  <rect x="80" y="70" width="640" height="14" rx="7" fill="#C5C7CA" stroke="#8A8C8E" stroke-width="2"/>
  <!-- Left Curtain Panel (Draped Folds) -->
  <g transform="translate(130, 80)" filter="url(#curtainShade)">
    <path d="M 0 0 L 240 0 L 230 430 L 10 430 Z" fill="#9E1B28" stroke="#700C15" stroke-width="2"/>
    <path d="M 0 0 L 240 0 L 230 430 L 10 430 Z" fill="url(#jacquardCurtain)"/>
    <!-- Fold Highlights -->
    <line x1="60" y1="0" x2="55" y2="430" stroke="#FFF" stroke-width="4" opacity="0.12"/>
    <line x1="120" y1="0" x2="115" y2="430" stroke="#000" stroke-width="8" opacity="0.18"/>
    <line x1="180" y1="0" x2="175" y2="430" stroke="#FFF" stroke-width="4" opacity="0.12"/>
    <!-- Eyelet rings -->
    <circle cx="30" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
    <circle cx="90" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
    <circle cx="150" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
    <circle cx="210" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
  </g>

  <!-- Right Curtain Panel -->
  <g transform="translate(430, 80)" filter="url(#curtainShade)">
    <path d="M 0 0 L 240 0 L 250 430 L 30 430 Z" fill="#9E1B28" stroke="#700C15" stroke-width="2"/>
    <path d="M 0 0 L 240 0 L 250 430 L 30 430 Z" fill="url(#jacquardCurtain)"/>
    <line x1="60" y1="0" x2="65" y2="430" stroke="#FFF" stroke-width="4" opacity="0.12"/>
    <line x1="120" y1="0" x2="125" y2="430" stroke="#000" stroke-width="8" opacity="0.18"/>
    <line x1="180" y1="0" x2="185" y2="430" stroke="#FFF" stroke-width="4" opacity="0.12"/>
    <circle cx="30" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
    <circle cx="90" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
    <circle cx="150" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
    <circle cx="210" cy="12" r="9" fill="#E2E4E6" stroke="#555" stroke-width="2"/>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · DOOR & WINDOW SCREENS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Set of 2 Door Curtains (7 Feet × 4 Feet) · Eyelet Jacquard</text>
</svg>`,

  // 18. Window Screens - 5ft Window Screen Drapes
  'screen-window-curtain.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="winBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCFAF5"/>
      <stop offset="100%" stop-color="#EBE3D3"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#winBg)"/>

  <!-- 5ft Window Curtains Pair in Warm Gold / Cream -->
  <rect x="120" y="100" width="560" height="12" rx="6" fill="#C59B27"/>
  <g transform="translate(160, 110)">
    <!-- Left panel -->
    <rect x="0" y="0" width="220" height="340" rx="8" fill="#FFFDF8" stroke="#D4AF37" stroke-width="3"/>
    <line x1="55" y1="0" x2="55" y2="340" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="10,6"/>
    <line x1="110" y1="0" x2="110" y2="340" stroke="#9E1B28" stroke-width="2"/>
    <line x1="165" y1="0" x2="165" y2="340" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="10,6"/>
    <!-- Right panel -->
    <rect x="260" y="0" width="220" height="340" rx="8" fill="#FFFDF8" stroke="#D4AF37" stroke-width="3"/>
    <line x1="315" y1="0" x2="315" y2="340" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="10,6"/>
    <line x1="370" y1="0" x2="370" y2="340" stroke="#9E1B28" stroke-width="2"/>
    <line x1="425" y1="0" x2="425" y2="340" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="10,6"/>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · WINDOW SCREENS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Set of 2 Window Curtains (5 Feet × 4 Feet) · Room Darkening</text>
</svg>`,

  // 19. Bed Spread - Traditional Madurai Jacquard Handloom Bedspread
  'bedspread-jacquard-handloom.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="spreadBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDFBF7"/>
      <stop offset="100%" stop-color="#ECE3D4"/>
    </linearGradient>
    <pattern id="jacquardSpread" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M25 5 L45 25 L25 45 L5 25 Z" fill="#9E1B28" opacity="0.25"/>
      <circle cx="25" cy="25" r="5" fill="#D4AF37" opacity="0.6"/>
    </pattern>
    <filter id="spreadShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#3A1C20" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#spreadBg)"/>

  <!-- Folded Heavy Madurai Handloom Bedspread with Tassels -->
  <g transform="translate(110, 80)" filter="url(#spreadShadow)">
    <rect x="0" y="30" width="580" height="400" rx="14" fill="#FAF4EA" stroke="#9E1B28" stroke-width="4"/>
    <rect x="0" y="30" width="580" height="400" rx="14" fill="url(#jacquardSpread)"/>
    
    <!-- Rich Crimson Border Frame with Traditional Temple Gopuram Motifs -->
    <rect x="30" y="60" width="520" height="340" rx="10" fill="none" stroke="#9E1B28" stroke-width="8"/>
    <rect x="44" y="74" width="492" height="312" rx="6" fill="none" stroke="#D4AF37" stroke-width="2"/>
    
    <!-- Heavy Knotted Fringes / Tassels on Border Ends -->
    <g stroke="#9E1B28" stroke-width="2.5">
      <line x1="0" y1="60" x2="-20" y2="60"/>
      <line x1="0" y1="100" x2="-20" y2="100"/>
      <line x1="0" y1="140" x2="-20" y2="140"/>
      <line x1="0" y1="180" x2="-20" y2="180"/>
      <line x1="0" y1="220" x2="-20" y2="220"/>
      <line x1="0" y1="260" x2="-20" y2="260"/>
      <line x1="0" y1="300" x2="-20" y2="300"/>
      <line x1="0" y1="340" x2="-20" y2="340"/>
      <line x1="0" y1="380" x2="-20" y2="380"/>

      <line x1="580" y1="60" x2="600" y2="60"/>
      <line x1="580" y1="100" x2="600" y2="100"/>
      <line x1="580" y1="140" x2="600" y2="140"/>
      <line x1="580" y1="180" x2="600" y2="180"/>
      <line x1="580" y1="220" x2="600" y2="220"/>
      <line x1="580" y1="260" x2="600" y2="260"/>
      <line x1="580" y1="300" x2="600" y2="300"/>
      <line x1="580" y1="340" x2="600" y2="340"/>
      <line x1="580" y1="380" x2="600" y2="380"/>
    </g>
  </g>

  <!-- Handloom Authentic Badge -->
  <g transform="translate(630, 420)">
    <circle cx="45" cy="45" r="42" fill="#9E1B28" stroke="#D4AF37" stroke-width="2.5"/>
    <text x="45" y="38" fill="#FFF2A3" font-family="'DM Sans',sans-serif" font-weight="900" font-size="12" text-anchor="middle">MADURAI</text>
    <text x="45" y="54" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="700" font-size="11" text-anchor="middle">HANDLOOM</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · HANDLOOM BED SPREADS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Double Bed Spread (90" × 100") · Heavy Woven Cotton Jacquard</text>
</svg>`,

  // 20. Bed Spread - Royal Heritage Chenille Floral Bed Spread
  'bedspread-chenille-royal.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="chenBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCFAF6"/>
      <stop offset="100%" stop-color="#E9DFD0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#chenBg)"/>

  <!-- Velvet Touch Chenille Embossed Bed Spread -->
  <g transform="translate(110, 80)">
    <rect x="0" y="30" width="580" height="400" rx="14" fill="#FFFDF8" stroke="#D4AF37" stroke-width="3"/>
    <!-- Intricate embossed floral medallion -->
    <circle cx="290" cy="230" r="110" fill="none" stroke="#9E1B28" stroke-width="4"/>
    <circle cx="290" cy="230" r="85" fill="none" stroke="#D4AF37" stroke-width="2" stroke-dasharray="6,4"/>
    <circle cx="290" cy="230" r="45" fill="#9E1B28" opacity="0.15"/>
    <!-- Scalloped edges -->
    <rect x="20" y="50" width="540" height="360" rx="10" fill="none" stroke="#9E1B28" stroke-width="2"/>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · CHENILLE BED SPREADS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">King Size (100" × 108") · Embossed Velvet-Soft Touch</text>
</svg>`,

  // 21. Bedcover - All-Season Quilted Reversible Bedcover
  'bedcover-quilted-allseason.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="covBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="100%" stop-color="#E8DFD0"/>
    </linearGradient>
    <pattern id="quiltDiamond" width="30" height="30" patternUnits="userSpaceOnUse">
      <polygon points="15,0 30,15 15,30 0,15" fill="none" stroke="#D4AF37" stroke-width="1.2" opacity="0.5"/>
    </pattern>
    <filter id="quiltShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#4A181C" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#covBg)"/>

  <!-- Heavy Ultrasonic Quilted Double Bed Cover -->
  <g transform="translate(100, 70)" filter="url(#quiltShadow)">
    <rect x="0" y="50" width="600" height="400" rx="16" fill="#FFFDF9" stroke="#9E1B28" stroke-width="3"/>
    <rect x="0" y="50" width="600" height="400" rx="16" fill="url(#quiltDiamond)"/>
    
    <!-- Quilted Padded Border -->
    <rect x="25" y="75" width="550" height="350" rx="10" fill="none" stroke="#9E1B28" stroke-width="6"/>

    <!-- 2 Matching Quilted Shams -->
    <g transform="translate(50, 100)">
      <rect x="0" y="0" width="230" height="150" rx="10" fill="#FFFDF9" stroke="#9E1B28" stroke-width="2.5"/>
      <rect x="0" y="0" width="230" height="150" rx="10" fill="url(#quiltDiamond)"/>
      <rect x="12" y="12" width="206" height="126" rx="6" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
    </g>
    <g transform="translate(320, 100)">
      <rect x="0" y="0" width="230" height="150" rx="10" fill="#FFFDF9" stroke="#9E1B28" stroke-width="2.5"/>
      <rect x="0" y="0" width="230" height="150" rx="10" fill="url(#quiltDiamond)"/>
      <rect x="12" y="12" width="206" height="126" rx="6" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
    </g>
  </g>

  <!-- Reversible Seal -->
  <g transform="translate(630, 420)">
    <circle cx="45" cy="45" r="42" fill="#D4AF37" stroke="#9E1B28" stroke-width="2"/>
    <text x="45" y="38" fill="#4A151B" font-family="'DM Sans',sans-serif" font-weight="900" font-size="12" text-anchor="middle">REVERSIBLE</text>
    <text x="45" y="54" fill="#9E1B28" font-family="'DM Sans',sans-serif" font-weight="800" font-size="12" text-anchor="middle">QUILTED</text>
  </g>

  <text x="50" y="560" fill="#6B131B" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · ALL-SEASON BEDCOVERS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Double Bedcover (90" × 100") + 2 Quilted Pillow Shams</text>
</svg>`,

  // 22. Bedcover - Waterproof Elastic Fitted Bed Cover
  'bedcover-waterproof-fitted.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="wpBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F2F8FD"/>
      <stop offset="100%" stop-color="#DCE9F5"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#wpBg)"/>

  <!-- Elastic Fitted Bed Cover / Mattress Protector -->
  <g transform="translate(120, 100)">
    <rect x="0" y="30" width="560" height="370" rx="20" fill="#FFFFFF" stroke="#2B6CB0" stroke-width="3"/>
    <!-- Terry Cotton Top Surface Texture -->
    <rect x="20" y="50" width="520" height="330" rx="14" fill="#F7FAFC" stroke="#BEE3F8" stroke-width="2"/>
    
    <!-- Water droplet shield motif -->
    <g transform="translate(260, 170)">
      <circle cx="20" cy="40" r="35" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
      <path d="M 20 18 C 15 26 8 36 8 44 C 8 52 13 58 20 58 C 27 58 32 52 32 44 C 32 36 25 26 20 18 Z" fill="#3182CE"/>
    </g>

    <!-- 360 Elastic Skirt Edge -->
    <path d="M 0 370 Q 280 400 560 370" fill="none" stroke="#2B6CB0" stroke-width="6"/>
  </g>

  <!-- 100% Waterproof Seal -->
  <g transform="translate(630, 420)">
    <circle cx="45" cy="45" r="42" fill="#3182CE" stroke="#FFF" stroke-width="2"/>
    <text x="45" y="38" fill="#FFF" font-family="'DM Sans',sans-serif" font-weight="900" font-size="12" text-anchor="middle">100%</text>
    <text x="45" y="54" fill="#EBF8FF" font-family="'DM Sans',sans-serif" font-weight="800" font-size="10" text-anchor="middle">WATERPROOF</text>
  </g>

  <text x="50" y="560" fill="#2B6CB0" font-family="'Cormorant Garamond',serif" font-weight="700" font-size="22" letter-spacing="2">RAJAMANI TEXTILES · MATTRESS PROTECTORS</text>
  <text x="750" y="560" fill="#7A6852" font-family="'DM Sans',sans-serif" font-size="14" text-anchor="end">Fitted Bed Cover (Up to 10" Mattress) · Breathable Terry Cotton</text>
</svg>`
};

for (const [name, content] of Object.entries(images)) {
  writeFileSync(join(outDir, name), content.trim());
  console.log('Generated:', name);
}
console.log('All product images generated successfully!');
