// ── Data ──────────────────────────────────────────────────────────────────────
const OPPS = [
    { id: 1, title: "Forest Restoration Drive", org: "GreenEarth NGO", cause: "Environment", location: "Pune, MH", date: "Feb 22, 2026", slots: 12, filled: 8, hours: 6, skills: ["Planting", "Teamwork"], icon: "🌱", urgent: true },
    { id: 2, title: "Digital Literacy for Seniors", org: "TechBridge Foundation", cause: "Education", location: "Online", date: "Feb 25, 2026", slots: 20, filled: 11, hours: 3, skills: ["Teaching", "Patience"], icon: "💻", urgent: false },
    { id: 3, title: "Blood Donation Camp", org: "LifeRed Society", cause: "Healthcare", location: "Mumbai, MH", date: "Mar 1, 2026", slots: 50, filled: 34, hours: 4, skills: ["Medical", "Empathy"], icon: "🩸", urgent: true },
    { id: 4, title: "Beach Cleanup Initiative", org: "OceanCare India", cause: "Environment", location: "Goa", date: "Mar 5, 2026", slots: 30, filled: 18, hours: 5, skills: ["Physical", "Teamwork"], icon: "🌊", urgent: false },
    { id: 5, title: "Coding Workshop for Kids", org: "FutureCoders", cause: "Education", location: "Bangalore, KA", date: "Mar 8, 2026", slots: 15, filled: 9, hours: 4, skills: ["Coding", "Teaching"], icon: "👨‍💻", urgent: false },
    { id: 6, title: "Community Kitchen", org: "FoodShare India", cause: "Social Welfare", location: "Delhi", date: "Mar 10, 2026", slots: 25, filled: 20, hours: 3, skills: ["Cooking", "Logistics"], icon: "🍲", urgent: true },
];

const INITIAL_POSTS = [
    { id: 1, user: "Priya S.", avatar: "PS", avatarClass: "mint-av", time: "2h ago", text: "Just completed the beach cleanup at Versova! We collected 40kg of plastic 🌊 So proud of our team!", likes: 24 },
    { id: 2, user: "Rahul M.", avatar: "RM", avatarClass: "lime-av", time: "5h ago", text: "Looking for volunteers for a digital literacy drive next weekend in Pune. 3-hour commitment, all materials provided!", likes: 18 },
    { id: 3, user: "Ananya I.", avatar: "AI", avatarClass: "amber-av", time: "1d ago", text: "Our NGO just crossed 500 registered volunteers on VolunteerConnect! Thank you all 🙏 This platform is a game changer.", likes: 67 },
];

// ── State ─────────────────────────────────────────────────────────────────────
let currentPage = 'home';
let currentFilter = 'All';
let joinedOpps = new Set();
let posts = [...INITIAL_POSTS];
let signupStep = 1;
let barChartBuilt = false;

// ── Page Navigation ───────────────────────────────────────────────────────────
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show target
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    currentPage = page;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update nav buttons active state
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Update bottom nav
    updateBottomNav(page);

    // Page-specific init
    if (page === 'opportunities') renderOpps();
    if (page === 'community') renderPosts();
    if (page === 'dashboard' && !barChartBuilt) { buildBarChart(); barChartBuilt = true; }
}

function updateBottomNav(page) {
    const pageMap = { home: 0, opportunities: 1, dashboard: 2, community: 3, signup: 4 };
    document.querySelectorAll('.bottom-nav button').forEach((btn, i) => {
        btn.classList.toggle('active', i === pageMap[page]);
    });
}

// ── Navbar scroll effect ──────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger ─────────────────────────────────────────────────────────────────
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburger');
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    btn.textContent = isOpen ? '☰' : '✕';
}
function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').textContent = '☰';
}

// ── Volunteer Counter Animation ───────────────────────────────────────────────
function animateCounter() {
    const el = document.getElementById('volunteerCount');
    if (!el) return;
    let count = 0;
    const target = 12400;
    const step = 137;
    const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count.toLocaleString();
        if (count >= target) clearInterval(timer);
    }, 10);
}

// ── Opportunities ─────────────────────────────────────────────────────────────
function renderOpps() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const grid = document.getElementById('oppsGrid');
    if (!grid) return;

    const filtered = OPPS.filter(o => {
        const matchCause = currentFilter === 'All' || o.cause === currentFilter;
        const matchSearch = o.title.toLowerCase().includes(search) || o.org.toLowerCase().includes(search);
        return matchCause && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px">
      <p style="font-size:40px">🌿</p>
      <p style="font-family:'Playfair Display',serif;color:var(--sand);font-size:18px;margin-top:12px">No results found. Try adjusting your filters.</p>
    </div>`;
        return;
    }

    grid.innerHTML = filtered.map(opp => {
        const pct = Math.round((opp.filled / opp.slots) * 100);
        const isJoined = joinedOpps.has(opp.id);
        const progressColor = pct > 80 ? 'coral' : 'lime';
        return `
    <div class="opp-card">
      ${opp.urgent ? '<div class="urgent-badge">URGENT</div>' : ''}
      <div class="opp-card-top">
        <div class="opp-emoji">${opp.icon}</div>
        <div>
          <div class="opp-title">${opp.title}</div>
          <div class="opp-org">${opp.org.toUpperCase()}</div>
        </div>
      </div>
      <div class="badge-row">
        <span class="badge mint">${opp.cause}</span>
        <span class="badge sky">📍 ${opp.location}</span>
        <span class="badge amber">⏱ ${opp.hours}h</span>
      </div>
      <div class="opp-progress-label">
        <span>${opp.filled}/${opp.slots} volunteers</span>
        <span style="color:var(--${progressColor})">${pct}% filled</span>
      </div>
      <div class="progress-bar"><div class="progress-fill ${progressColor}" style="width:${pct}%"></div></div>
      <div class="badge-row">
        ${opp.skills.map(s => `<span class="badge sage">${s}</span>`).join('')}
      </div>
      <div class="opp-actions">
        <button class="register-btn ${isJoined ? 'joined' : ''}" onclick="toggleJoin(${opp.id}, this)">
          ${isJoined ? '✓ Registered!' : 'Register Now →'}
        </button>
        <button class="wish-btn">♡</button>
      </div>
      <div class="opp-date">📅 ${opp.date}</div>
    </div>`;
    }).join('');
}

function filterOpps() { renderOpps(); }

function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    renderOpps();
}

function toggleJoin(id, btn) {
    if (joinedOpps.has(id)) {
        joinedOpps.delete(id);
        btn.textContent = 'Register Now →';
        btn.classList.remove('joined');
    } else {
        joinedOpps.add(id);
        btn.textContent = '✓ Registered!';
        btn.classList.add('joined');
    }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function switchTab(tabName, btn) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    // Show selected
    document.getElementById('tab-' + tabName).classList.add('active');
    btn.classList.add('active');
}

function buildBarChart() {
    const chart = document.getElementById('barChart');
    if (!chart) return;
    const values = [3, 5, 2, 6, 4, 8, 5, 3, 7, 6, 4, 9];
    const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const max = Math.max(...values);
    chart.innerHTML = values.map((v, i) => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
      <div class="bar" style="height:${(v / max) * 80}px;width:100%"></div>
      <span style="font-family:'Space Mono',monospace;font-size:7px;color:var(--sage)">${labels[i]}</span>
    </div>
  `).join('');
}

// ── Community ─────────────────────────────────────────────────────────────────
function renderPosts() {
    const feed = document.getElementById('postsFeed');
    if (!feed) return;
    feed.innerHTML = posts.map(post => `
    <div class="post-card">
      <div class="post-top">
        <div class="avatar ${post.avatarClass || 'sky-av'}">${post.avatar}</div>
        <div>
          <div class="post-user">${post.user}</div>
          <div class="post-time">${post.time.toUpperCase()}</div>
        </div>
      </div>
      <div class="post-text">${post.text}</div>
      <div class="post-actions">
        <button class="post-action-btn like-btn" onclick="likePost(${post.id}, this)">♥ ${post.likes}</button>
        <button class="post-action-btn reply-btn">💬 Reply</button>
        <button class="post-action-btn share-btn">↗ Share</button>
      </div>
    </div>
  `).join('');
}

function likePost(id, btn) {
    const post = posts.find(p => p.id === id);
    if (post) {
        post.likes++;
        btn.textContent = `♥ ${post.likes}`;
    }
}

function addPost() {
    const input = document.getElementById('postInput');
    const text = input.value.trim();
    if (!text) return;
    posts.unshift({
        id: Date.now(),
        user: 'You',
        avatar: 'YO',
        avatarClass: 'sky-av',
        time: 'Just now',
        text: text,
        likes: 0,
    });
    input.value = '';
    renderPosts();
}

// ── Signup ────────────────────────────────────────────────────────────────────
function signupNext() {
    if (signupStep < 3) {
        document.getElementById('step' + signupStep).classList.remove('active');
        signupStep++;
        document.getElementById('step' + signupStep).classList.add('active');
        updateSignupUI();
    } else {
        // Done
        document.getElementById('signupWrap').style.display = 'none';
        document.getElementById('signupSuccess').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function signupBack() {
    if (signupStep > 1) {
        document.getElementById('step' + signupStep).classList.remove('active');
        signupStep--;
        document.getElementById('step' + signupStep).classList.add('active');
        updateSignupUI();
    }
}

function updateSignupUI() {
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    backBtn.style.display = signupStep > 1 ? 'inline-block' : 'none';
    nextBtn.textContent = signupStep < 3 ? 'Continue →' : 'Join the Movement 🌿';

    // Update step dots
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('sdot' + i);
        dot.classList.toggle('active', i <= signupStep);
    }
    for (let i = 1; i <= 2; i++) {
        const line = document.getElementById('sline' + i);
        line.classList.toggle('active', i < signupStep);
    }
}

function toggleChoice(btn) {
    btn.classList.toggle('selected');
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    animateCounter();
    updateSignupUI();

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const nav = document.getElementById('navbar');
        if (!nav.contains(e.target)) closeMenu();
    });
});