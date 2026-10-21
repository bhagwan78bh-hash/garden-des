/**
 * Verdant Garden Care Guide - Interactive Application Logic
 * Accessible native dialogs, interactive calculators, diagnostic filters, and seasonal chore tracker.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initWateringCalculator();
  initSymptomChecker();
  initSeasonalPlanner();
  initFaqAccordion();
  initLegalModals();
  initNewsletter();
  initScrollSpy();
});

/* -------------------------------------------------------------
 * 1. Mobile Navigation
 * ------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('closeMobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* -------------------------------------------------------------
 * 2. Interactive Watering & Sunlight Calculator
 * ------------------------------------------------------------- */
const plantProfiles = {
  herbs: {
    name: 'Mediterranean Herbs (Rosemary, Thyme, Lavender, Sage)',
    baseDays: 5,
    waterAmount: 'Moderate, deep soak until bottom drainage runs clear',
    soilDepth: 'Top 1.5 - 2 inches must be dry to touch',
    bestTime: 'Early morning (6:00 AM – 9:00 AM)',
    proTip: 'These sun-loving perennials thrive in lean, well-draining soil. Wet feet will quickly lead to root fungal rot. Mulch with light gravel rather than bark.'
  },
  fruiting: {
    name: 'Fruiting Vegetables (Heirloom Tomatoes, Peppers, Squash)',
    baseDays: 2.5,
    waterAmount: 'Deep root drenching, 1 to 1.5 inches of water per week',
    soilDepth: 'Top 1 inch should dry slightly between watering cycles',
    bestTime: 'Early morning at soil base; never wet evening foliage',
    proTip: 'Inconsistent watering causes blossom end rot and fruit splitting. Maintain a 3-inch straw mulch layer to stabilize subterranean moisture levels.'
  },
  greens: {
    name: 'Tender Leafy Greens (Spinach, Butterhead Lettuce, Arugula, Kale)',
    baseDays: 2,
    waterAmount: 'Consistent light moisture, shallow feeder root soaking',
    soilDepth: 'Top 0.5 inch damp like a wrung-out sponge',
    bestTime: 'Morning and gentle afternoon misting during heat spikes',
    proTip: 'Shallow root systems dry out within hours of afternoon heat, inducing premature bolting and bitterness. Shade cloth (30-40%) prolongs spring harvests.'
  },
  succulents: {
    name: 'Succulents & Cacti (Aloe, Echeveria, Jade, Sedum)',
    baseDays: 12,
    waterAmount: 'Drench-and-dry cycle; water thoroughly then allow full desiccation',
    soilDepth: '100% dry throughout entire container root ball',
    bestTime: 'Morning during active growth seasons (Spring & Autumn)',
    proTip: 'Wrinkled, dull leaves signify thirst, whereas translucent yellow leaves indicate cellular water bursting from overwatering.'
  },
  perennials: {
    name: 'Flowering Perennials (Coneflowers, Peonies, Black-Eyed Susans)',
    baseDays: 4,
    waterAmount: 'Substantial deep root soaking at the drip line',
    soilDepth: 'Top 2 inches dry before reapplication',
    bestTime: 'Dawn to allow flower petals and foliage to dry in sun',
    proTip: 'Established native perennials develop taproots up to 4 feet deep. Deep infrequent waterings encourage drought resilience over shallow sprinkles.'
  },
  indoor: {
    name: 'Indoor Tropicals (Monstera, Fiddle Leaf Fig, Pothos, Calathea)',
    baseDays: 7,
    waterAmount: 'Gentle flush with lukewarm filtered or dechlorinated water',
    soilDepth: 'Top 2 inches dry for Monstera/Fig; top 0.5 inch for Calathea',
    bestTime: 'Morning; pair with 55%+ ambient room humidity',
    proTip: 'Always empty the saucer 15 minutes after watering so root tips do not sit in stagnant anaerobic water. Dust leaves monthly to maximize photosynthesis.'
  }
};

const soilModifiers = {
  sandy: { factor: 0.7, note: 'Sandy soil drains quickly; water in shorter, more frequent intervals.' },
  loam: { factor: 1.0, note: 'Ideal balanced loam retains perfect moisture:air balance (40:60).' },
  clay: { factor: 1.35, note: 'Heavy clay retains water; reduce frequency to prevent waterlogged anaerobic roots.' }
};

const sunModifiers = {
  full: { factor: 0.8, label: 'Full Sun (6+ hrs direct)' },
  partial: { factor: 1.0, label: 'Partial Sun / Dappled (4-6 hrs)' },
  shade: { factor: 1.3, label: 'Bright Indirect / Shade (2-4 hrs)' }
};

function initWateringCalculator() {
  const plantSelect = document.getElementById('calcPlant');
  const soilSelect = document.getElementById('calcSoil');
  const sunSelect = document.getElementById('calcSun');

  if (!plantSelect || !soilSelect || !sunSelect) return;

  function updateCalculation() {
    const plantKey = plantSelect.value;
    const soilKey = soilSelect.value;
    const sunKey = sunSelect.value;

    const plant = plantProfiles[plantKey] || plantProfiles.fruiting;
    const soil = soilModifiers[soilKey] || soilModifiers.loam;
    const sun = sunModifiers[sunKey] || sunModifiers.full;

    const calculatedDays = Math.max(1, Math.round(plant.baseDays * soil.factor * sun.factor * 10) / 10);

    const freqBadge = document.getElementById('calcResultFrequency');
    const plantNameEl = document.getElementById('calcResultPlantName');
    const amountEl = document.getElementById('calcResultAmount');
    const depthEl = document.getElementById('calcResultDepth');
    const timingEl = document.getElementById('calcResultTiming');
    const tipEl = document.getElementById('calcResultTip');
    const soilNoticeEl = document.getElementById('calcResultSoilNotice');

    if (freqBadge) {
      if (calculatedDays <= 1.5) {
        freqBadge.textContent = 'Every 1 to 2 Days (High Demand)';
        freqBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200';
      } else if (calculatedDays <= 4) {
        freqBadge.textContent = `Every ${Math.round(calculatedDays)} to ${Math.round(calculatedDays + 1)} Days`;
        freqBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200';
      } else if (calculatedDays <= 7) {
        freqBadge.textContent = `Every ${Math.round(calculatedDays)} to ${Math.round(calculatedDays + 2)} Days`;
        freqBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200';
      } else {
        freqBadge.textContent = `Every 10 to ${Math.round(calculatedDays + 3)} Days (Low Demand)`;
        freqBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200';
      }
    }

    if (plantNameEl) plantNameEl.textContent = plant.name;
    if (amountEl) amountEl.textContent = plant.waterAmount;
    if (depthEl) depthEl.textContent = plant.soilDepth;
    if (timingEl) timingEl.textContent = plant.bestTime;
    if (tipEl) tipEl.textContent = plant.proTip;
    if (soilNoticeEl) soilNoticeEl.textContent = soil.note;
  }

  plantSelect.addEventListener('change', updateCalculation);
  soilSelect.addEventListener('change', updateCalculation);
  sunSelect.addEventListener('change', updateCalculation);

  // Initial calculation trigger
  updateCalculation();
}

/* -------------------------------------------------------------
 * 3. Plant Symptom Diagnostic Tool
 * ------------------------------------------------------------- */
const symptomsData = [
  {
    id: 'symptom-yellow-lower',
    category: 'foliage',
    title: 'Yellowing Lower Leaves (Chlorosis)',
    trigger: 'Older leaves at base turn pale yellow while upper growth remains light green',
    cause: 'Nitrogen deficiency or over-saturation washing away mobile nitrates; also root suffocation from compacted soil.',
    actionNow: 'Inspect soil moisture with a probe or finger 2 inches deep. If soggy, cease watering immediately. If dry, apply a balanced organic fish emulsion liquid feed (5-1-1).',
    actionPrevention: 'Aerate soil with a garden fork and top-dress beds with 1 inch of rich aged worm castings every 4 weeks.',
    urgency: 'Medium',
    urgencyColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'symptom-brown-margins',
    category: 'foliage',
    title: 'Crispy Brown Leaf Tips & Edges',
    trigger: 'Leaf borders scorch and become brittle, curling inward',
    cause: 'Under-watering, harsh dry winds, excessive synthetic fertilizer salt buildup, or fluoride/chlorine sensitivity in tap water.',
    actionNow: 'Flush potting soil with rainwater or distilled water to leach accumulated fertilizer salts. Move container away from direct scorching afternoon wind.',
    actionPrevention: 'Install drip soaker hoses under organic straw mulch and avoid high-nitrogen mineral salts in hot weather.',
    urgency: 'Low',
    urgencyColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'symptom-white-powder',
    category: 'pests-fungi',
    title: 'Powdery White Dust on Leaves',
    trigger: 'Talcum powder-like white spots spreading rapidly over leaf surfaces and stems',
    cause: 'Powdery Mildew fungal infection (Erysiphales), flourishing in stagnant humid air with dry soil roots.',
    actionNow: 'Prune away severely affected foliage and discard (do not compost). Spray remaining foliage with an organic potassium bicarbonate solution (1 tbsp per gallon) or diluted cold-pressed neem oil.',
    actionPrevention: 'Improve plant spacing by 20% to facilitate gentle breeze circulation. Always water soil directly rather than wetting overhead leaves.',
    urgency: 'High',
    urgencyColor: 'bg-red-100 text-red-800 border-red-300'
  },
  {
    id: 'symptom-wilting-wet',
    category: 'roots-stems',
    title: 'Drooping & Wilting in Moist Soil',
    trigger: 'Foliage wilts limp despite soil being noticeably damp or soaked',
    cause: 'Root rot (Pythium / Phytophthora). Drowned roots lack oxygen to draw water upward to upper stems.',
    actionNow: 'For potted plants, unpot immediately, rinse root ball, and prune dark slimy black roots with sterilized shears. Repot in fresh, sterile, gritty potting mix with perlite.',
    actionPrevention: 'Verify all pots have open unobstructed drainage holes. In raised beds, incorporate coarse compost and gypsum to loosen clay compaction.',
    urgency: 'Critical',
    urgencyColor: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'symptom-leaf-chew-holes',
    category: 'pests-fungi',
    title: 'Irregular Ragged Leaf Holes & Silvery Trails',
    trigger: 'Large scalloped holes in leaves overnight with shiny dried tracks on soil',
    cause: 'Slugs and snails feeding actively during damp nights and twilight hours.',
    actionNow: 'Handpick pests at dusk using a flashlight. Set shallow saucer beer traps flush with soil level or ring vulnerable plants with organic iron phosphate bait pellets.',
    actionPrevention: 'Surround sensitive garden borders with crushed eggshells, diatomaceous earth, or copper foil tape on raised wooden beds.',
    urgency: 'Medium',
    urgencyColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'symptom-purple-foliage',
    category: 'foliage',
    title: 'Purplish Red Veins on Underside',
    trigger: 'Stems and leaf undersides take on an unnatural deep purple or bronze sheen',
    cause: 'Phosphorus deficiency, frequently caused by cold soil below 55°F (13°C) locking up nutrient uptake even if present.',
    actionNow: 'Warm cold soils with black mulch or row covers. Apply organic steamed bone meal or micronized soft rock phosphate around the drip zone.',
    actionPrevention: 'Avoid planting warm-season nightshades (peppers, tomatoes) outdoors until nighttime soil temperatures reliably exceed 60°F.',
    urgency: 'Low',
    urgencyColor: 'bg-blue-100 text-blue-800 border-blue-300'
  }
];

function initSymptomChecker() {
  const container = document.getElementById('symptomsGrid');
  const searchInput = document.getElementById('symptomSearch');
  const filterButtons = document.querySelectorAll('.symptom-filter-btn');

  if (!container) return;

  let currentCategory = 'all';
  let currentSearch = '';

  function renderSymptoms() {
    container.innerHTML = '';

    const filtered = symptomsData.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = item.title.toLowerCase().includes(currentSearch) ||
                          item.trigger.toLowerCase().includes(currentSearch) ||
                          item.cause.toLowerCase().includes(currentSearch);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-emerald-200 p-8">
          <svg class="w-12 h-12 mx-auto text-emerald-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-base font-semibold text-slate-800">No matching plant symptoms found</p>
          <p class="text-sm text-slate-500 mt-1">Try searching for keywords like "yellow", "white", "holes", or "droop".</p>
        </div>
      `;
      return;
    }

    filtered.forEach(symptom => {
      const card = document.createElement('article');
      card.className = 'group bg-white rounded-2xl p-6 border border-emerald-950/10 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${symptom.urgencyColor}">
              Urgency: ${symptom.urgency}
            </span>
            <span class="text-xs uppercase tracking-wider text-slate-400 font-medium">${symptom.category.replace('-', ' & ')}</span>
          </div>
          <h3 class="text-lg font-serif font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
            ${symptom.title}
          </h3>
          <p class="text-sm text-slate-600 mt-2 font-medium italic">
            "${symptom.trigger}"
          </p>
          <div class="mt-4 pt-3 border-t border-slate-100">
            <p class="text-xs font-semibold text-slate-700 uppercase tracking-wide">Root Cause:</p>
            <p class="text-sm text-slate-600 mt-1">${symptom.cause}</p>
          </div>
        </div>
        <div class="mt-5 pt-4 border-t border-slate-100 bg-emerald-50/50 rounded-xl p-3.5">
          <p class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Prescribed Organic Action:
          </p>
          <p class="text-xs text-emerald-950 mt-1 leading-relaxed">${symptom.actionNow}</p>
          <p class="text-xs text-slate-500 mt-2 font-medium"><strong class="text-slate-700">Long-Term Guard:</strong> ${symptom.actionPrevention}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderSymptoms();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700', 'hover:bg-emerald-50');
      });
      btn.classList.add('bg-emerald-700', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-emerald-50');

      currentCategory = btn.dataset.category || 'all';
      renderSymptoms();
    });
  });

  renderSymptoms();
}

/* -------------------------------------------------------------
 * 4. Seasonal Master Planner with Local Checklist
 * ------------------------------------------------------------- */
const seasonalTasks = {
  spring: [
    { id: 'sp-1', text: 'Test and amend soil pH (ideal 6.2 - 6.8 for mixed gardens)', done: false },
    { id: 'sp-2', text: 'Start indoor seeds for warm-weather tomatoes, peppers, and eggplants', done: true },
    { id: 'sp-3', text: 'Direct-sow cool-season leafy greens, radishes, carrots, and sweet peas', done: false },
    { id: 'sp-4', text: 'Inspect and clean irrigation lines, drip emitters, and rain barrels', done: false },
    { id: 'sp-5', text: 'Apply a 2-inch fresh organic compost layer before weed seeds germinate', done: false }
  ],
  summer: [
    { id: 'su-1', text: 'Mulch heavily with straw or shredded cedar to conserve root moisture', done: false },
    { id: 'su-2', text: 'Water deeply before 8:00 AM; never wet evening tomato leaves', done: false },
    { id: 'su-3', text: 'Prune tomato suckers and tie vines to trellis supports', done: false },
    { id: 'su-4', text: 'Harvest herbs at flower bud formation for peak essential oil concentration', done: false },
    { id: 'su-5', text: 'Monitor under-leaf surfaces weekly for early spider mites or aphid clusters', done: false }
  ],
  autumn: [
    { id: 'au-1', text: 'Harvest final heirloom tomatoes and preserve herbs through drying or freezing', done: false },
    { id: 'au-2', text: 'Plant hardneck garlic cloves 2 inches deep and 6 inches apart', done: false },
    { id: 'au-3', text: 'Plant spring-flowering bulbs (tulips, alliums, daffodils) in well-drained beds', done: false },
    { id: 'au-4', text: 'Sow crimson clover or hairy vetch winter nitrogen-fixing cover crops', done: false },
    { id: 'au-5', text: 'Collect fallen deciduous leaves to build next season’s carbon leaf-mold compost', done: false }
  ],
  winter: [
    { id: 'wi-1', text: 'Dormant prune deciduous fruit trees, roses, and woody berry brambles', done: false },
    { id: 'wi-2', text: 'Clean, sharpen, and oil bypass pruners, garden shears, and spades', done: false },
    { id: 'wi-3', text: 'Review companion planting maps and rotate nightshade and brassica crop families', done: false },
    { id: 'wi-4', text: 'Protect sensitive perennial root crowns with pine needles or evergreen boughs', done: false },
    { id: 'wi-5', text: 'Order organic heirloom non-GMO certified seeds from reputable heritage seed houses', done: false }
  ]
};

function initSeasonalPlanner() {
  const tabs = document.querySelectorAll('.season-tab-btn');
  const checklistContainer = document.getElementById('seasonTasksList');
  const counterEl = document.getElementById('seasonCompletedCount');
  const seasonTitleEl = document.getElementById('seasonActiveTitle');
  const seasonSummaryEl = document.getElementById('seasonActiveSummary');

  if (!checklistContainer) return;

  let activeSeason = 'spring';

  // Load saved checklist from localStorage if available
  const savedState = localStorage.getItem('verdant_tasks_state');
  let userTasks = seasonalTasks;
  if (savedState) {
    try {
      userTasks = JSON.parse(savedState);
    } catch (e) {
      console.warn('Could not parse saved tasks, using defaults');
    }
  }

  const seasonMeta = {
    spring: {
      title: 'Spring Awakening (March – May)',
      summary: 'Focus on soil awakening, cool-weather sowing, frost-watch protection, and establishing robust root architecture before summer heat.'
    },
    summer: {
      title: 'Summer Flourish & Deep Hydration (June – August)',
      summary: 'Focus on consistent moisture retention, pest deterrence, blossom protection, regular succession harvests, and trellising.'
    },
    autumn: {
      title: 'Autumn Harvest & Soil Restoration (September – November)',
      summary: 'Focus on garlic sowing, winter cover crops, bulb planting, compost pile building, and protecting perennial crowns.'
    },
    winter: {
      title: 'Winter Dormancy & Preparation (December – February)',
      summary: 'Focus on tool sanitization, structural pruning, crop rotation planning, seed inventory auditing, and cold-frame salad greens.'
    }
  };

  function renderTasks() {
    checklistContainer.innerHTML = '';
    const tasks = userTasks[activeSeason] || [];
    let completedCount = 0;

    tasks.forEach((task, idx) => {
      if (task.done) completedCount++;

      const item = document.createElement('li');
      item.className = `flex items-start gap-3 p-3.5 rounded-xl transition-all cursor-pointer border ${
        task.done ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-white border-slate-200/80 hover:border-emerald-300 text-slate-800'
      }`;

      item.innerHTML = `
        <input 
          type="checkbox" 
          id="task-${task.id}" 
          ${task.done ? 'checked' : ''} 
          class="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
        >
        <label for="task-${task.id}" class="text-sm font-medium select-none cursor-pointer flex-1 leading-relaxed ${task.done ? 'line-through text-slate-500' : ''}">
          ${task.text}
        </label>
      `;

      item.addEventListener('click', (e) => {
        // Prevent double toggle if clicking directly on checkbox
        if (e.target.tagName !== 'INPUT') {
          const cb = item.querySelector('input');
          cb.checked = !cb.checked;
        }
        task.done = !task.done;
        try {
          localStorage.setItem('verdant_tasks_state', JSON.stringify(userTasks));
        } catch (err) {}
        renderTasks();
      });

      checklistContainer.appendChild(item);
    });

    if (counterEl) {
      counterEl.textContent = `${completedCount} of ${tasks.length} Completed`;
    }

    if (seasonTitleEl && seasonMeta[activeSeason]) {
      seasonTitleEl.textContent = seasonMeta[activeSeason].title;
    }
    if (seasonSummaryEl && seasonMeta[activeSeason]) {
      seasonSummaryEl.textContent = seasonMeta[activeSeason].summary;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-emerald-800', 'text-white', 'shadow-sm');
        t.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      });
      tab.classList.add('bg-emerald-800', 'text-white', 'shadow-sm');
      tab.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');

      activeSeason = tab.dataset.season || 'spring';
      renderTasks();
    });
  });

  renderTasks();
}

/* -------------------------------------------------------------
 * 5. FAQ Accordion
 * ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other accordions for clean UX
      faqItems.forEach(other => {
        if (other !== item) {
          const otherTrigger = other.querySelector('.faq-trigger');
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* -------------------------------------------------------------
 * 6. Accessible Legal Modals (<dialog>) with Backdrop Dismiss & Keyboard Traps
 * ------------------------------------------------------------- */
function initLegalModals() {
  const termsModal = document.getElementById('termsModal');
  const privacyModal = document.getElementById('privacyModal');

  // Trigger buttons
  const openTermsBtns = document.querySelectorAll('.open-terms-modal');
  const openPrivacyBtns = document.querySelectorAll('.open-privacy-modal');

  // Close buttons
  const closeTermsBtn = document.getElementById('closeTermsBtn');
  const closePrivacyBtn = document.getElementById('closePrivacyBtn');
  const termsCloseFooterBtn = document.getElementById('termsCloseFooterBtn');
  const privacyCloseFooterBtn = document.getElementById('privacyCloseFooterBtn');

  // Switch links between modals
  const switchToPrivacy = document.getElementById('switchToPrivacy');
  const switchToTerms = document.getElementById('switchToTerms');

  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    // Focus the modal heading for screen reader announcement
    const heading = dialog.querySelector('h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }

  function closeDialog(dialog) {
    if (!dialog || typeof dialog.close !== 'function') return;
    dialog.close();
    document.body.style.overflow = '';
  }

  // Bind Open Buttons
  openTermsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDialog(termsModal);
    });
  });

  openPrivacyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDialog(privacyModal);
    });
  });

  // Bind Close Buttons
  if (closeTermsBtn) closeTermsBtn.addEventListener('click', () => closeDialog(termsModal));
  if (termsCloseFooterBtn) termsCloseFooterBtn.addEventListener('click', () => closeDialog(termsModal));

  if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', () => closeDialog(privacyModal));
  if (privacyCloseFooterBtn) privacyCloseFooterBtn.addEventListener('click', () => closeDialog(privacyModal));

  // Light dismiss on backdrop click
  [termsModal, privacyModal].forEach(dialog => {
    if (!dialog) return;

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeDialog(dialog);
      }
    });

    // Handle standard browser close event
    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });

  // Modal switcher links
  if (switchToPrivacy) {
    switchToPrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      closeDialog(termsModal);
      setTimeout(() => openDialog(privacyModal), 100);
    });
  }

  if (switchToTerms) {
    switchToTerms.addEventListener('click', (e) => {
      e.preventDefault();
      closeDialog(privacyModal);
      setTimeout(() => openDialog(termsModal), 100);
    });
  }

  // Print support
  const printTermsBtn = document.getElementById('printTermsBtn');
  const printPrivacyBtn = document.getElementById('printPrivacyBtn');
  if (printTermsBtn) printTermsBtn.addEventListener('click', () => window.print());
  if (printPrivacyBtn) printPrivacyBtn.addEventListener('click', () => window.print());
}

/* -------------------------------------------------------------
 * 7. Newsletter Signup Handler
 * ------------------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const feedbackEl = document.getElementById('newsletterFeedback');

  if (!form || !emailInput || !feedbackEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
      feedbackEl.className = 'mt-3 text-xs font-semibold text-rose-600 block animate-fade-in';
      feedbackEl.textContent = 'Please enter a valid garden email address.';
      emailInput.focus();
      return;
    }

    // Success State
    feedbackEl.className = 'mt-3 text-xs font-semibold text-emerald-700 block animate-fade-in bg-emerald-100/80 p-2.5 rounded-lg border border-emerald-300';
    feedbackEl.innerHTML = `🌿 Success! Your 2026 Companion Planting Cheat Sheet has been sent to <strong>${email}</strong>.`;
    emailInput.value = '';

    setTimeout(() => {
      feedbackEl.classList.add('opacity-0');
      setTimeout(() => feedbackEl.classList.add('hidden'), 500);
    }, 8000);
  });
}

/* -------------------------------------------------------------
 * 8. Scroll Spy for active nav highlight
 * ------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('text-emerald-800', 'font-semibold');
        link.classList.remove('text-slate-600');
      } else {
        link.classList.remove('text-emerald-800', 'font-semibold');
        link.classList.add('text-slate-600');
      }
    });
  }, { passive: true });
}
