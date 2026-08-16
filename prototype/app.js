// Global State
let currentTab = 'home';
let currentProfileSubTab = 'reels';
let activeChatId = null;

// Mock Users (Self)
const currentUser = {
  name: "Selin Kaya",
  username: "@selinkaya",
  avatar: "assets/profile_avatar.png",
  bio: "Kupa bardakta kahve ☕, canlı konserler 🎸 ve doğa yürüyüşleri 🌲 vazgeçilmezim. Loopin ile yeni insanlarla tanışmayı seviyorum!"
};

// Events Mock Data
let eventsData = [
  {
    id: 1,
    title: "Neon Ritmi: Cyberpunk Festivali",
    category: "Müzik & Konser",
    date: "24 Temmuz Cuma, 21:00",
    location: "Zorlu PSM, Beşiktaş",
    maxCapacity: 50,
    currentCapacity: 15,
    isFull: false,
    price: "Herkes Kendi Öder",
    image: "assets/event_concert.png",
    desc: "Şehrin en fütüristik müzik festivalinde buluşuyoruz. Neon ışıklar altında, synthwave ve techno ritimleriyle sabahın ilk ışıklarına kadar dans edeceğiz! Buluşma noktası ana giriş kapısıdır.",
    liked: false,
    joined: false,
    likeCount: 42,
    comments: 3,
    commentsList: [
      { user: "Hakan Öztürk", avatar: "assets/profile_avatar.png", text: "Konser için yerimizi aldık, sabırsızlanıyoruz! 🔥", time: "2 saat önce" },
      { user: "Deniz Yılmaz", avatar: "assets/profile_avatar.png", text: "Grup harika çalıyor, kaçırmayın derim.", time: "1 saat önce" },
      { user: "Mert Demir", avatar: "assets/profile_avatar.png", text: "Kapıda buluşup beraber gireriz arkadaşlar. 👍", time: "10 dk önce" }
    ],
    attendees: [
      { name: "Hakan Öztürk", avatar: "assets/profile_avatar.png" },
      { name: "Deniz Yılmaz", avatar: "assets/profile_avatar.png" },
      { name: "Mert Demir", avatar: "assets/profile_avatar.png" }
    ],
    hostName: "Mert Demir",
    hostAvatar: "assets/profile_avatar.png",
    hostTrust: "%98 Güven Skoru"
  },
  {
    id: 2,
    title: "Nitelikli Kahve Yapımı & Tadımı",
    category: "Kahve & Yemek",
    date: "26 Temmuz Pazar, 14:00",
    location: "Petra Roasting Co., Gayrettepe",
    maxCapacity: 8,
    currentCapacity: 8,
    isFull: true,
    price: "Ücretsiz",
    image: "assets/event_coffee.png",
    desc: "Kahve çekirdeklerinin büyüleyici dünyasına adım atın. V60 ve Aeropress demleme tekniklerini öğrenip farklı kökenlerden çekirdekleri tadacağız. Kontenjan sınırlıdır!",
    liked: false,
    joined: false,
    likeCount: 18,
    comments: 2,
    commentsList: [
      { user: "Selin Kaya", avatar: "assets/profile_avatar.png", text: "V60 demlenirken çıkan koku efsane oluyor.", time: "3 saat önce" },
      { user: "Ece Yılmaz", avatar: "assets/profile_avatar.png", text: "Atölyede kontenjan dolmuş ama yedeklerdeyim. ☕", time: "45 dk önce" }
    ],
    attendees: [
      { name: "Selin Kaya", avatar: "assets/profile_avatar.png" },
      { name: "Ece Yılmaz", avatar: "assets/profile_avatar.png" },
      { name: "Hakan Öztürk", avatar: "assets/profile_avatar.png" },
      { name: "Deniz Yılmaz", avatar: "assets/profile_avatar.png" },
      { name: "Mert Demir", avatar: "assets/profile_avatar.png" },
      { name: "Ayşe Can", avatar: "assets/profile_avatar.png" },
      { name: "Burak Yıldız", avatar: "assets/profile_avatar.png" },
      { name: "Zeynep Arslan", avatar: "assets/profile_avatar.png" }
    ],
    hostName: "Ece Yılmaz",
    hostAvatar: "assets/profile_avatar.png",
    hostTrust: "%95 Güven Skoru"
  }
];

// Reels Mock Data
let reelsData = [
  {
    id: 1,
    publisher: "Can Aksoy",
    publisherAvatar: "assets/profile_avatar.png",
    caption: "Güneş dağların ardında batarken... Doğa her zaman huzur verir. 🌅🌲 #nature #travel #reels",
    image: "assets/reel_nature.png",
    liked: false,
    likeCount: 234,
    comments: 18,
    isSelf: false
  },
  {
    id: 2,
    publisher: "Selin Kaya",
    publisherAvatar: "assets/profile_avatar.png",
    caption: "Fütüristik neon gecelerinden bir an! Dün akşamki konser inanılmazdı. 🔥🎸 #cyberpunk #concert #neon",
    image: "assets/event_concert.png",
    liked: true,
    likeCount: 412,
    comments: 32,
    isSelf: true
  },
  {
    id: 3,
    publisher: "Ece Yılmaz",
    publisherAvatar: "assets/profile_avatar.png",
    caption: "Güne sıcak bir latte ile başlamak... ☕✨ Demleme atölyesinden ufak bir kesit.",
    image: "assets/event_coffee.png",
    liked: false,
    likeCount: 189,
    comments: 9,
    isSelf: false
  }
];

// Messages Mock Data
let chatsData = [
  {
    id: 1,
    name: "Ece Yılmaz",
    avatar: "assets/profile_avatar.png",
    online: true,
    lastActive: "Çevrimiçi",
    messages: [
      { text: "Selam! Pazar günkü kahve tadım etkinliğine geliyor musun?", sender: "received", time: "14:02" },
      { text: "Evet, orada olacağım! Hatta Aeropress demlemeyi denemek istiyorum.", sender: "sent", time: "14:05" },
      { text: "Süper! Görüşmek üzere.", sender: "received", time: "14:06" }
    ],
    unread: false
  },
  {
    id: 2,
    name: "Mert Demir",
    avatar: "assets/profile_avatar.png",
    online: false,
    lastActive: "15 dk önce aktifti",
    messages: [
      { text: "Kanka konser bileti aldın mı?", sender: "received", time: "Dün" },
      { text: "Aldım aldım, kapıda buluşuruz.", sender: "sent", time: "Dün" }
    ],
    unread: false
  },
  {
    id: 3,
    name: "Hakan Öztürk",
    avatar: "assets/profile_avatar.png",
    online: true,
    lastActive: "Çevrimiçi",
    messages: [
      { text: "Doğa yürüyüşü için yanımıza ne alalım?", sender: "received", time: "Salı" }
    ],
    unread: true // Unread message initially to trigger badge!
  }
];

// DOM Elements
const eventsFeed = document.getElementById('events-feed');
const reelsFeed = document.getElementById('reels-feed');
const chatListView = document.getElementById('chat-list-view');
const activeChatPanel = document.getElementById('active-chat-panel');
const messagesNavBadge = document.getElementById('messages-nav-badge');

// Initialization
window.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  renderReels();
  renderChatList();
  renderProfile();
  updateMessagesBadge();
  
  // Set up Simulated Incoming Message timer after 10 seconds
  setTimeout(triggerSimulatedNotification, 10000);
});

// 1. RENDER EVENTS (Anasayfa)
function renderEvents() {
  eventsFeed.innerHTML = '';
  if (eventsData.length === 0) {
    eventsFeed.innerHTML = `
      <div class="empty-feed">
        <p>Henüz aktif bir etkinlik bulunmuyor.</p>
      </div>`;
    return;
  }
  
  eventsData.forEach((event, index) => {
    const isFirstCard = index === 0;
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Clicking anywhere on the card (except buttons/links) opens details modal
    card.onclick = (e) => {
      if (e.target.closest('button') || e.target.closest('.side-actions-float') || e.target.closest('.card-host-row-overlay') || e.target.closest('.side-action-avatar-wrapper') || e.target.closest('.event-comments-preview')) {
        return;
      }
      showDetailLightbox('event', event);
    };

    // Calculate latest comment preview
    let latestCommentHtml = `<span class="empty-comment-text">Henüz yorum yapılmamış. İlk yorumu sen yaz!</span>`;
    if (event.commentsList && event.commentsList.length > 0) {
      const latest = event.commentsList[event.commentsList.length - 1];
      latestCommentHtml = `<span class="comment-author">${latest.user}:</span> <span class="comment-text">${latest.text}</span>`;
    }

    card.innerHTML = `
      ${isFirstCard ? `
      <div class="swipe-up-hint">
        <span class="swipe-arrow">➔</span>
        <span>Yukarı kaydırarak diğer etkinlikleri gör</span>
      </div>` : ''}
      
      <!-- Top header: Title only (No category/capacity) -->
      <div class="event-card-header">
        <h2 class="event-card-title">${event.title}</h2>
      </div>

      <!-- Middle media section with side action column overlaid on the RIGHT -->
      <div class="event-card-media-wrapper">
        <img src="${event.image}" alt="${event.title}" class="event-card-img">
        
        <!-- Action Buttons Column on the RIGHT side of the image (overlaid) -->
        <div class="side-actions-float inside-media-right">
          <!-- 1. Host profile image -->
          <button class="side-action-btn host-avatar-btn" onclick="event.stopPropagation(); showDetailLightbox('event', eventsData.find(e => e.id === ${event.id}))">
            <div class="side-action-avatar-wrapper">
              <img src="${event.hostAvatar}" alt="${event.hostName}" class="side-action-avatar">
              <span class="avatar-follow-plus">+</span>
            </div>
          </button>

          <!-- 2. Like Button -->
          <button class="side-action-btn ${event.liked ? 'liked' : ''}" onclick="toggleLikeEvent(${event.id}, event)">
            <div class="btn-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <span id="event-like-count-${event.id}">${event.likeCount}</span>
          </button>

          <!-- 3. Comment Button -->
          <button class="side-action-btn" onclick="openCommentsDrawer(${event.id}, event)">
            <div class="btn-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <span id="event-comment-count-${event.id}">${event.comments}</span>
          </button>

          <!-- 4. Share Button -->
          <button class="side-action-btn" onclick="shareEvent(${event.id}, event)">
            <div class="btn-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </div>
            <span>Paylaş</span>
          </button>
        </div>
      </div>

      <!-- Bottom area: Description and Latest Comment Preview (No Join button) -->
      <div class="event-card-body">
        <p class="event-card-desc">${event.desc}</p>
        
        <!-- Comments Preview (Latest Comment) -->
        <div class="event-comments-preview" onclick="event.stopPropagation(); openCommentsDrawer(${event.id}, event)">
          <div class="comments-preview-header">Yorumlar (${event.comments})</div>
          <div class="comments-preview-body" id="event-latest-comment-${event.id}">
            ${latestCommentHtml}
          </div>
        </div>
      </div>
    `;
    eventsFeed.appendChild(card);
  });
}

// 2. RENDER REELS
function renderReels() {
  reelsFeed.innerHTML = '';
  reelsData.forEach((reel, index) => {
    const isFirstCard = index === 0;
    const card = document.createElement('div');
    card.className = 'reel-card';
    card.innerHTML = `
      ${isFirstCard ? `
      <div class="swipe-up-hint">
        <span class="swipe-arrow">➔</span>
        <span>Yukarı kaydırarak diğer reels'ları gör</span>
      </div>` : ''}
      
      <!-- Reels Simulated Video/Photo display -->
      <div class="video-canvas-container">
        <img src="${reel.image}" alt="Reel media" class="card-bg-img">
        <div class="pulsing-visualizer"></div>
      </div>
      <div class="card-bg-gradient"></div>

      <!-- Reels Interactions Floater -->
      <div class="side-actions-float">
        <button class="side-action-btn ${reel.liked ? 'liked' : ''}" onclick="toggleLikeReel(${reel.id}, event)">
          <div class="btn-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <span id="reel-like-count-${reel.id}">${reel.likeCount}</span>
        </button>
        <button class="side-action-btn" onclick="openComments(${reel.id}, event)">
          <div class="btn-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <span>${reel.comments}</span>
        </button>
        <button class="side-action-btn" onclick="shareReel(${reel.id}, event)">
          <div class="btn-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </div>
          <span>Paylaş</span>
        </button>
      </div>

      <!-- Reels Text Caption Overlay -->
      <div class="card-content-overlay">
        <div class="reel-user-row">
          <img src="${reel.publisherAvatar}" alt="${reel.publisher}" class="reel-avatar">
          <span class="reel-username">${reel.publisher}</span>
          ${!reel.isSelf ? `<button class="reel-follow-btn" onclick="followUser('${reel.publisher}', event)">Takip Et</button>` : ''}
        </div>
        <div class="reel-caption-container">
          <p class="reel-caption">${reel.caption}</p>
        </div>
      </div>
    `;
    reelsFeed.appendChild(card);
  });
}

// 3. RENDER CHAT LIST
function renderChatList() {
  chatListView.innerHTML = '';
  chatsData.forEach(chat => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    const isUnread = chat.unread;
    
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.onclick = () => openChatPanel(chat.id);
    chatItem.innerHTML = `
      <div class="chat-item-avatar-wrapper">
        <img src="${chat.avatar}" alt="${chat.name}" class="chat-item-avatar">
        ${chat.online ? '<span class="chat-online-dot"></span>' : ''}
      </div>
      <div class="chat-item-info">
        <div class="chat-item-name-row">
          <span class="chat-item-name">${chat.name}</span>
          <span class="chat-item-time">${lastMsg ? lastMsg.time : ''}</span>
        </div>
        <div class="chat-item-msg-row">
          <span class="chat-item-lastmsg ${isUnread ? 'unread-msg' : ''}">
            ${lastMsg ? lastMsg.text : 'Sohbeti başlatın'}
          </span>
          ${isUnread ? '<span class="chat-item-badge">1</span>' : ''}
        </div>
      </div>
    `;
    chatListView.appendChild(chatItem);
  });
}

// 4. RENDER PROFILE
function renderProfile() {
  // Update Profile Info Header elements from currentUser
  const profileNameEl = document.querySelector('.profile-name');
  if (profileNameEl) profileNameEl.innerHTML = `${currentUser.name} <span class="premium-badge">PRO</span>`;
  
  const profileUsernameEl = document.querySelector('.profile-username');
  if (profileUsernameEl) profileUsernameEl.innerText = currentUser.username;

  const profileBioEl = document.querySelector('.profile-bio');
  if (profileBioEl && currentUser.bio !== undefined) profileBioEl.innerText = currentUser.bio;

  const profileAvatarImg = document.querySelector('.profile-main-avatar');
  if (profileAvatarImg && currentUser.avatar) profileAvatarImg.src = currentUser.avatar;

  const navAvatarImg = document.getElementById('nav-btn-avatar');
  if (navAvatarImg && currentUser.avatar) navAvatarImg.src = currentUser.avatar;

  // Update stats counters
  document.getElementById('profile-reels-count').innerText = reelsData.filter(r => r.isSelf).length;
  document.getElementById('profile-events-count').innerText = eventsData.filter(e => e.hostName === currentUser.name).length;
  
  // Render Reels Grid (Paylaşımlar SubTab)
  const mediaGrid = document.getElementById('profile-media-grid');
  mediaGrid.innerHTML = '';
  
  const selfReels = reelsData.filter(r => r.isSelf);
  if (selfReels.length === 0) {
    mediaGrid.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 40px; color: var(--color-text-tertiary);">Henüz reels paylaşmadınız.</div>`;
  } else {
    selfReels.forEach(reel => {
      const gridItem = document.createElement('div');
      gridItem.className = 'media-grid-item';
      gridItem.onclick = () => showDetailLightbox('reel', reel);
      gridItem.innerHTML = `
        <img src="${reel.image}" alt="Reel image">
        <div class="grid-item-overlay">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <span>${reel.likeCount}</span>
        </div>
        <div class="grid-icon-type">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        </div>
      `;
      mediaGrid.appendChild(gridItem);
    });
  }

  // Render Hosted Events List (Etkinliklerim SubTab)
  const eventsList = document.getElementById('profile-events-list');
  eventsList.innerHTML = '';
  
  const selfEvents = eventsData.filter(e => e.hostName === currentUser.name || e.joined);
  if (selfEvents.length === 0) {
    eventsList.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--color-text-tertiary);">Kayıtlı veya oluşturulan etkinliğiniz yok.</div>`;
  } else {
    selfEvents.forEach(event => {
      const isOwner = event.hostName === currentUser.name;
      const listItem = document.createElement('div');
      listItem.className = 'event-list-item';
      listItem.onclick = () => showDetailLightbox('event', event);
      listItem.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="event-list-img">
        <div class="event-list-info">
          <div>
            <div class="event-list-title">${event.title}</div>
            <div class="event-list-date">${event.date}</div>
          </div>
          <div class="event-list-place" style="display: flex; justify-content: space-between; align-items: center;">
            <span>📍 ${event.location.split(',')[0]}</span>
            <span style="font-size: 9px; color: ${isOwner ? 'var(--color-primary)' : 'var(--color-secondary)'}; font-weight: bold; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">
              ${isOwner ? 'Kurucu' : 'Katılımcı'}
            </span>
          </div>
        </div>
      `;
      eventsList.appendChild(listItem);
    });
  }
}

// SWITCH NAVIGATION TABS
function switchTab(tabName) {
  currentTab = tabName;
  
  // Remove active from all tabs
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.remove('active-view');
  });
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active-nav');
  });
  
  // Activate selected tab view
  const targetView = document.getElementById(`tab-${tabName}`);
  if (targetView) targetView.classList.add('active-view');
  
  // Highlight active button in nav
  const targetBtn = document.getElementById(`nav-btn-${tabName}`);
  if (targetBtn) targetBtn.classList.add('active-nav');

  // Specific tab actions
  if (tabName === 'messages') {
    // If opening messages, read all if desired or close panel
    closeChatPanel();
  }
  
  if (tabName === 'profile') {
    renderProfile();
  }
}

// PROFILE SUBTABS SWITCHER
function switchProfileSubTab(subTab) {
  currentProfileSubTab = subTab;
  
  document.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.classList.remove('active-tab');
  });
  
  document.querySelectorAll('.profile-subtab-view').forEach(view => {
    view.classList.remove('active-subtab');
  });
  
  // Find active button
  const buttons = document.querySelectorAll('.profile-tab-btn');
  if (subTab === 'reels') {
    buttons[0].classList.add('active-tab');
    document.getElementById('profile-subtab-reels').classList.add('active-subtab');
  } else {
    buttons[1].classList.add('active-tab');
    document.getElementById('profile-subtab-events').classList.add('active-subtab');
  }
}

// LIKE ACTIONS
function toggleLikeEvent(id, event) {
  event.stopPropagation();
  const eventObj = eventsData.find(e => e.id === id);
  if (eventObj) {
    eventObj.liked = !eventObj.liked;
    eventObj.likeCount += eventObj.liked ? 1 : -1;
    
    // Animate and update layout
    const btn = event.currentTarget;
    btn.classList.toggle('liked', eventObj.liked);
    document.getElementById(`event-like-count-${id}`).innerText = eventObj.likeCount;
  }
}

function toggleLikeReel(id, event) {
  event.stopPropagation();
  const reelObj = reelsData.find(r => r.id === id);
  if (reelObj) {
    reelObj.liked = !reelObj.liked;
    reelObj.likeCount += reelObj.liked ? 1 : -1;
    
    // Animate and update layout
    const btn = event.currentTarget;
    btn.classList.toggle('liked', reelObj.liked);
    document.getElementById(`reel-like-count-${id}`).innerText = reelObj.likeCount;
  }
}

// EVENT JOIN ACTIONS
function toggleJoinEvent(id) {
  const eventObj = eventsData.find(e => e.id === id);
  if (eventObj) {
    eventObj.joined = !eventObj.joined;
    
    // Update button text and class
    const btn = document.getElementById(`join-btn-${id}`);
    if (eventObj.joined) {
      btn.innerText = 'Katılıyorsun ✓';
      btn.style.background = 'linear-gradient(135deg, var(--color-secondary), #059669)';
      btn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
      alert(`"${eventObj.title}" etkinliğine katılım talebiniz onaylandı! Özel grup sohbetine eklendiniz.`);
    } else {
      btn.innerText = 'Etkinliğe Katıl';
      btn.style.background = '';
      btn.style.boxShadow = '';
    }
    
    renderProfile(); // Update Profile Events list if user is inside profile
  }
}

// FOLLOW ACTION
function followUser(username, event) {
  event.stopPropagation();
  const btn = event.currentTarget;
  if (btn.innerText === 'Takip Et') {
    btn.innerText = 'Takip Ediliyor';
    btn.style.background = 'rgba(255, 255, 255, 0.1)';
  } else {
    btn.innerText = 'Takip Et';
    btn.style.background = '';
  }
}

// CREATE POST MODAL CONTROL
function openCreateModal() {
  const modal = document.getElementById('create-modal');
  modal.classList.add('active-modal');
}

function closeCreateModal() {
  const modal = document.getElementById('create-modal');
  modal.classList.remove('active-modal');
  resetForms();
}

function closeCreateModalOnOverlay(event) {
  if (event.target.id === 'create-modal') {
    closeCreateModal();
  }
}

function toggleCreateType(type) {
  const reelBtn = document.getElementById('type-btn-reel');
  const eventBtn = document.getElementById('type-btn-event');
  const reelForm = document.getElementById('form-create-reel');
  const eventForm = document.getElementById('form-create-event');
  
  if (type === 'reel') {
    reelBtn.classList.add('active-type');
    eventBtn.classList.remove('active-type');
    reelForm.classList.add('active-form');
    eventForm.classList.remove('active-form');
  } else {
    reelBtn.classList.remove('active-type');
    eventBtn.classList.add('active-type');
    reelForm.classList.remove('active-form');
    eventForm.classList.add('active-form');
  }
}

// TRIGGER FILE UPLOAD UI
function triggerFileInput(inputId) {
  document.getElementById(inputId).click();
}

// MEDIA PREVIEW SIMULATION
function previewMedia(input, imgId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewImg = document.getElementById(imgId);
      const placeholder = input.parentElement.querySelector('.upload-placeholder');
      
      previewImg.src = e.target.result;
      previewImg.classList.remove('hidden-element');
      if (placeholder) placeholder.classList.add('hidden-element');
    }
    reader.readAsDataURL(file);
  }
}

// RESET FORMS
function resetForms() {
  document.getElementById('form-create-reel').reset();
  document.getElementById('form-create-event').reset();
  
  // Reset previews
  document.getElementById('reel-preview-img').classList.add('hidden-element');
  document.getElementById('reel-upload-placeholder').classList.remove('hidden-element');
  document.getElementById('event-preview-img').classList.add('hidden-element');
  document.getElementById('event-upload-placeholder').classList.remove('hidden-element');
}

// SUBMIT REEL (PHOTO/VIDEO)
function submitReel(e) {
  e.preventDefault();
  
  const caption = document.getElementById('reel-caption').value;
  const previewImg = document.getElementById('reel-preview-img').src;
  
  // Use uploaded photo or default to travel photo if empty
  const mediaSrc = previewImg || "assets/reel_nature.png";
  
  const newReel = {
    id: reelsData.length + 1,
    publisher: currentUser.name,
    publisherAvatar: currentUser.avatar,
    caption: caption,
    image: mediaSrc,
    liked: false,
    likeCount: 0,
    comments: 0,
    isSelf: true
  };
  
  // Add to state and re-render
  reelsData.unshift(newReel);
  renderReels();
  renderProfile();
  
  // Close and switch view
  closeCreateModal();
  switchTab('reels');
  
  // Scroll reels to top to see new post
  reelsFeed.scrollTop = 0;
}

// SUBMIT EVENT
function submitEvent(e) {
  e.preventDefault();
  
  const title = document.getElementById('event-title').value;
  const categorySelection = document.getElementById('event-category').value;
  const rawDate = document.getElementById('event-date').value;
  const location = document.getElementById('event-location').value;
  const capacityNum = document.getElementById('event-capacity').value;
  const priceType = document.getElementById('event-price').value;
  const desc = document.getElementById('event-desc').value;
  const previewImg = document.getElementById('event-preview-img').src;
  
  // Format date readable
  let dateFormatted = "Yakında";
  if (rawDate) {
    const d = new Date(rawDate);
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    dateFormatted = `${d.getDate()} ${months[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  
  // Use uploaded image or default to concert cover
  const mediaSrc = previewImg || "assets/event_concert.png";
  
  const newEvent = {
    id: eventsData.length + 1,
    title: title,
    category: categorySelection,
    date: dateFormatted,
    location: location,
    capacity: `1/${capacityNum} Katılımcı`,
    isFull: false,
    price: priceType,
    image: mediaSrc,
    desc: desc,
    liked: false,
    joined: false,
    likeCount: 0,
    comments: 0,
    commentsList: [],
    hostName: currentUser.name,
    hostAvatar: currentUser.avatar,
    hostTrust: "%100 Güven Skoru"
  };
  
  // Add to state and re-render
  eventsData.unshift(newEvent);
  renderEvents();
  renderProfile();
  
  // Close and switch view
  closeCreateModal();
  switchTab('home');
  
  // Scroll home events feed to top to see new post
  eventsFeed.scrollTop = 0;
}

// 6. MESSAGES / ACTIVE CHAT FLOW
function updateMessagesBadge() {
  const hasUnread = chatsData.some(c => c.unread);
  if (hasUnread) {
    messagesNavBadge.classList.add('active-badge');
    messagesNavBadge.innerText = chatsData.filter(c => c.unread).length;
  } else {
    messagesNavBadge.classList.remove('active-badge');
  }
}

function openChatPanel(chatId) {
  activeChatId = chatId;
  const chat = chatsData.find(c => c.id === chatId);
  if (!chat) return;
  
  // Set unread to false
  chat.unread = false;
  updateMessagesBadge();
  renderChatList();
  
  // Populate chat UI
  document.getElementById('chat-active-name').innerText = chat.name;
  document.getElementById('chat-active-avatar').src = chat.avatar;
  
  const statusEl = document.getElementById('chat-active-status');
  statusEl.innerText = chat.online ? 'Çevrimiçi' : chat.lastActive;
  statusEl.style.color = chat.online ? 'var(--color-secondary)' : 'var(--color-text-tertiary)';
  
  // Load Messages
  renderChatMessages();
  
  // Slide in panel
  activeChatPanel.classList.add('open-panel');
  
  // Event listeners inside chat panel
  document.getElementById('chat-back-btn').onclick = closeChatPanel;
  
  // Send Button click
  document.getElementById('send-message-btn').onclick = sendChatMessage;
  document.getElementById('chat-message-input').onkeydown = function(e) {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };
}

function closeChatPanel() {
  activeChatId = null;
  activeChatPanel.classList.remove('open-panel');
}

function renderChatMessages() {
  const msgArea = document.getElementById('chat-messages-area');
  msgArea.innerHTML = '';
  
  const chat = chatsData.find(c => c.id === activeChatId);
  if (!chat) return;
  
  chat.messages.forEach(msg => {
    const bubble = document.createElement('div');
    bubble.className = `msg-bubble ${msg.sender}`;
    bubble.innerHTML = `
      <span>${msg.text}</span>
      <span class="msg-time">${msg.time}</span>
    `;
    msgArea.appendChild(bubble);
  });
  
  // Auto scroll to bottom
  msgArea.scrollTop = msgArea.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chat-message-input');
  const text = input.value.trim();
  if (text === '') return;
  
  const chat = chatsData.find(c => c.id === activeChatId);
  if (!chat) return;
  
  // Get time stamp
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Add message
  chat.messages.push({
    text: text,
    sender: 'sent',
    time: timeStr
  });
  
  input.value = '';
  renderChatMessages();
  renderChatList();
  
  // Simulate reply after 1.5 seconds
  setTimeout(() => {
    simulateIncomingReply(chat.id);
  }, 1500);
}

function simulateIncomingReply(chatId) {
  const chat = chatsData.find(c => c.id === chatId);
  if (!chat) return;
  
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const botReplies = [
    "Harika! O zaman planı netleştirelim.",
    "Aynen öyle, katılıyorum. 👍",
    "Süper, detayları grupta da konuşuruz.",
    "Bana uyar, o gün görüşmek üzere!",
    "Harika bir fikir bu arada, sabırsızlanıyorum!"
  ];
  const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
  
  chat.messages.push({
    text: randomReply,
    sender: 'received',
    time: timeStr
  });
  
  // If user is currently looking at this chat, render directly
  if (activeChatId === chatId) {
    renderChatMessages();
  } else {
    // Set unread and trigger badge in navbar
    chat.unread = true;
    updateMessagesBadge();
  }
  
  renderChatList();
}

// TRIGGER SYSTEM NOTIFICATION SIMULATION
function triggerSimulatedNotification() {
  // Add an unread message from Hakan if not already chatting
  const hakanChat = chatsData.find(c => c.id === 3);
  if (hakanChat && activeChatId !== 3) {
    hakanChat.unread = true;
    hakanChat.messages.push({
      text: "Selam! Yeni bir etkinlik paylaştım, bir göz at istersen. 🎸",
      sender: "received",
      time: "Şimdi"
    });
    updateMessagesBadge();
    renderChatList();
    
    // Soft notification alert
    console.log("Simulated Message Received from Hakan");
  }
}

// 7. LIGHTBOX DETAIL MODALS FOR PROFILE
function showDetailLightbox(type, item) {
  const modal = document.getElementById('detail-modal');
  const content = document.getElementById('detail-modal-content');
  
  if (type === 'reel') {
    content.innerHTML = `
      <img src="${item.image}" alt="Reel" class="detail-img">
      <div class="detail-body">
        <div class="reel-user-row" style="margin-bottom: 4px;">
          <img src="${item.publisherAvatar}" alt="${item.publisher}" class="reel-avatar" style="width: 28px; height: 28px;">
          <span class="reel-username" style="font-size: 13px;">${item.publisher}</span>
        </div>
        <p class="detail-desc" style="font-size: 13px; color: var(--color-text-primary);">${item.caption}</p>
        <div class="detail-meta-list" style="margin-top: 4px;">
          <span>❤️ ${item.likeCount} Beğeni</span>
          <span>💬 ${item.comments} Yorum</span>
        </div>
      </div>
    `;
  } else if (type === 'event') {
    const remaining = item.maxCapacity - item.currentCapacity;
    const isFull = item.isFull || remaining <= 0;
    const isJoined = item.joined;
    
    // Capacity label: if only 1 spot left show that
    let capacityLabel = `${item.currentCapacity}/${item.maxCapacity} Katılımcı`;
    if (!isFull && remaining === 1) capacityLabel = `${item.currentCapacity}/${item.maxCapacity} — Son 1 yer!`;
    else if (!isFull && remaining <= 3) capacityLabel = `${item.currentCapacity}/${item.maxCapacity} — Son ${remaining} yer`;
    else if (isFull) capacityLabel = `${item.maxCapacity}/${item.maxCapacity} — Kontenjan Doldu`;

    // Attendees avatars row (show first 5 + overflow count)
    const maxShow = 5;
    const shown = item.attendees.slice(0, maxShow);
    const extra = item.attendees.length - maxShow;
    const attendeeAvatars = shown.map((a, i) =>
      `<img src="${a.avatar}" alt="${a.name}" title="${a.name}" class="attendee-avatar" style="margin-left: ${i > 0 ? '-10px' : '0'}; z-index: ${maxShow - i};">`
    ).join('');
    const extraBadge = extra > 0
      ? `<span class="attendee-extra" style="margin-left: -10px; z-index: 0;">+${extra}</span>`
      : '';

    // Join button state
    let joinBtnHtml;
    if (isJoined) {
      joinBtnHtml = `<button class="btn btn-outline btn-sm join-event-btn" style="width:100%; padding:10px; margin-top:8px; border-color: var(--color-error); color: var(--color-error);" onclick="joinEvent(${item.id}, this)">✓ Katıldınız — İptal Et</button>`;
    } else if (isFull) {
      joinBtnHtml = `<button class="btn btn-sm" style="width:100%; padding:10px; margin-top:8px; background: rgba(255,255,255,0.1); color: var(--color-text-tertiary); cursor: not-allowed;" disabled>Kontenjan Doldu</button>`;
    } else {
      joinBtnHtml = `<button class="btn btn-primary btn-sm join-event-btn" style="width:100%; padding:10px; margin-top:8px;" onclick="joinEvent(${item.id}, this)">🎉 Etkinliğe Katıl</button>`;
    }

    content.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="detail-img">
      <div class="detail-body">
        <span class="category-badge" style="align-self: flex-start; margin-bottom: 2px;">${item.category}</span>
        <h3 class="detail-title">${item.title}</h3>
        
        <div class="detail-meta-list">
          <div>📅 ${item.date}</div>
          <div>📍 ${item.location}</div>
          <div>👤 Kurucu: ${item.hostName}</div>
          <div>💳 Ücret: ${item.price}</div>
          <div style="color: ${isFull ? 'var(--color-error)' : remaining <= 3 ? '#f59e0b' : 'inherit'};">👥 ${capacityLabel}</div>
        </div>
        
        <p class="detail-desc">${item.desc}</p>

        <!-- Attendees Section -->
        <div class="detail-attendees-section">
          <div class="detail-attendees-label">Katılımcılar (${item.attendees.length})</div>
          <div class="detail-attendees-row">
            ${attendeeAvatars}${extraBadge}
          </div>
        </div>
        
        ${joinBtnHtml}
      </div>
    `;
  }
  
  modal.classList.add('active-modal');
}

function joinEvent(eventId, btn) {
  const eventObj = eventsData.find(e => e.id === eventId);
  if (!eventObj) return;

  if (eventObj.joined) {
    // Cancel join
    eventObj.joined = false;
    eventObj.currentCapacity = Math.max(0, eventObj.currentCapacity - 1);
    eventObj.attendees = eventObj.attendees.filter(a => a.name !== currentUser.name);
    if (eventObj.currentCapacity < eventObj.maxCapacity) eventObj.isFull = false;
    btn.textContent = '🎉 Etkinliğe Katıl';
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
    btn.style.borderColor = '';
    btn.style.color = '';
    btn.onclick = () => joinEvent(eventId, btn);
  } else {
    // Join
    eventObj.joined = true;
    eventObj.currentCapacity = Math.min(eventObj.maxCapacity, eventObj.currentCapacity + 1);
    if (!eventObj.attendees.find(a => a.name === currentUser.name)) {
      eventObj.attendees.unshift({ name: currentUser.name, avatar: currentUser.avatar });
    }
    if (eventObj.currentCapacity >= eventObj.maxCapacity) eventObj.isFull = true;
    btn.textContent = '✓ Katıldınız — İptal Et';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    btn.style.borderColor = 'var(--color-error)';
    btn.style.color = 'var(--color-error)';
    btn.onclick = () => joinEvent(eventId, btn);
  }

  // Re-render the detail modal with updated data
  showDetailLightbox('event', eventObj);
}

function closeDetailModal() {
  const modal = document.getElementById('detail-modal');
  modal.classList.remove('active-modal');
}

// SHARE SIMULATIONS
function shareEvent(id, event) {
  event.stopPropagation();
  const eventObj = eventsData.find(e => e.id === id);
  if (eventObj) {
    if (navigator.share) {
      navigator.share({
        title: eventObj.title,
        text: eventObj.desc,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      alert(`"${eventObj.title}" paylaşım bağlantısı kopyalandı!`);
    }
  }
}

function shareReel(id, event) {
  event.stopPropagation();
  const reelObj = reelsData.find(r => r.id === id);
  if (reelObj) {
    alert(`@${reelObj.publisher} paylaştığı reel bağlantısı kopyalandı!`);
  }
}

function openComments(id, event) {
  openCommentsDrawer(id, event);
}

// Comments Bottom Sheet Sliding Drawer
let activeCommentsEventId = null;

function openCommentsDrawer(eventId, event) {
  if (event) event.stopPropagation();
  activeCommentsEventId = eventId;
  const eventObj = eventsData.find(e => e.id === eventId);
  if (!eventObj) return;

  // Set counts
  document.getElementById('drawer-comment-count').innerText = eventObj.comments;
  
  // Render comments list
  renderDrawerComments();
  
  // Slide open bottom sheet
  const modal = document.getElementById('comments-drawer-modal');
  modal.classList.add('active-modal');
  
  // Bind send event
  document.getElementById('drawer-send-comment-btn').onclick = submitDrawerComment;
  document.getElementById('drawer-new-comment-input').onkeydown = function(e) {
    if (e.key === 'Enter') {
      submitDrawerComment();
    }
  };
}

function closeCommentsDrawer() {
  activeCommentsEventId = null;
  const modal = document.getElementById('comments-drawer-modal');
  modal.classList.remove('active-modal');
  document.getElementById('drawer-new-comment-input').value = '';
}

function closeCommentsDrawerOnOverlay(event) {
  if (event.target.id === 'comments-drawer-modal') {
    closeCommentsDrawer();
  }
}

function renderDrawerComments() {
  const listEl = document.getElementById('drawer-comments-list');
  listEl.innerHTML = '';
  
  const eventObj = eventsData.find(e => e.id === activeCommentsEventId);
  if (!eventObj) return;
  
  if (!eventObj.commentsList || eventObj.commentsList.length === 0) {
    listEl.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--color-text-tertiary); font-style: italic;">Henüz yorum yapılmamış. İlk yorumu sen yaz!</div>`;
    return;
  }
  
  eventObj.commentsList.forEach(c => {
    const item = document.createElement('div');
    item.className = 'drawer-comment-item';
    item.innerHTML = `
      <img src="${c.avatar}" alt="${c.user}" class="drawer-comment-avatar">
      <div class="drawer-comment-content">
        <span class="drawer-comment-user">${c.user}</span>
        <span class="drawer-comment-text">${c.text}</span>
        <span class="drawer-comment-time">${c.time}</span>
      </div>
    `;
    listEl.appendChild(item);
  });
  
  // Auto scroll to bottom
  listEl.scrollTop = listEl.scrollHeight;
}

function submitDrawerComment() {
  const input = document.getElementById('drawer-new-comment-input');
  const text = input.value.trim();
  if (text === '') return;
  
  const eventObj = eventsData.find(e => e.id === activeCommentsEventId);
  if (!eventObj) return;
  
  // Create comment object
  const newComment = {
    user: currentUser.name,
    avatar: currentUser.avatar,
    text: text,
    time: "Şimdi"
  };
  
  if (!eventObj.commentsList) eventObj.commentsList = [];
  eventObj.commentsList.push(newComment);
  eventObj.comments = eventObj.commentsList.length;
  
  // Refresh UI
  input.value = '';
  document.getElementById('drawer-comment-count').innerText = eventObj.comments;
  
  // Update counts and latest comments on Home Feed card
  const commentCountEl = document.getElementById(`event-comment-count-${eventObj.id}`);
  if (commentCountEl) commentCountEl.innerText = eventObj.comments;
  
  const latestCommentPreviewEl = document.getElementById(`event-latest-comment-${eventObj.id}`);
  if (latestCommentPreviewEl) {
    latestCommentPreviewEl.innerHTML = `<span class="comment-author">${currentUser.name}:</span> <span class="comment-text">${text}</span>`;
  }
  
  renderDrawerComments();
  renderProfile(); // Update profile stats if applicable
}

// 8. EDIT PROFILE MODAL LOGIC
function openEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  if (!modal) return;

  // Populate fields
  const avatarPreview = document.getElementById('edit-avatar-preview');
  if (avatarPreview) avatarPreview.src = currentUser.avatar;

  const usernameInput = document.getElementById('edit-username-input');
  if (usernameInput) {
    const rawUsername = currentUser.username.replace(/^@/, '');
    usernameInput.value = rawUsername;
    updateEditUsernamePreview(rawUsername);
  }

  const nameInput = document.getElementById('edit-name-input');
  if (nameInput) nameInput.value = currentUser.name;

  const bioInput = document.getElementById('edit-bio-input');
  if (bioInput) {
    bioInput.value = currentUser.bio || '';
    updateEditBioCounter(bioInput.value);
  }

  modal.classList.add('active-modal');
}

function closeEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.classList.remove('active-modal');
}

function closeEditProfileModalOnOverlay(event) {
  if (event.target.id === 'edit-profile-modal') {
    closeEditProfileModal();
  }
}

function updateEditUsernamePreview(val) {
  const cleanVal = val.trim().replace(/^@/, '');
  const urlPreview = document.getElementById('edit-url-preview');
  if (urlPreview) {
    urlPreview.innerText = `www.loopin.app/@${cleanVal || 'kullanici'}`;
  }
}

function updateEditBioCounter(val) {
  const counter = document.getElementById('edit-bio-counter');
  if (counter) {
    counter.innerText = `${val.length}/80`;
  }
}

function previewEditAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const avatarPreview = document.getElementById('edit-avatar-preview');
      if (avatarPreview) avatarPreview.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveProfileChanges(event) {
  event.preventDefault();

  const nameInput = document.getElementById('edit-name-input');
  const usernameInput = document.getElementById('edit-username-input');
  const bioInput = document.getElementById('edit-bio-input');
  const avatarPreview = document.getElementById('edit-avatar-preview');

  if (nameInput && nameInput.value.trim() !== '') {
    currentUser.name = nameInput.value.trim();
  }

  if (usernameInput && usernameInput.value.trim() !== '') {
    let un = usernameInput.value.trim();
    if (!un.startsWith('@')) un = '@' + un;
    currentUser.username = un;
  }

  if (bioInput) {
    currentUser.bio = bioInput.value.trim();
  }

  if (avatarPreview && avatarPreview.src) {
    currentUser.avatar = avatarPreview.src;
  }

  // Update profile UI
  renderProfile();

  closeEditProfileModal();
}

function openSettingsModal() {
  alert("⚙️ Ayarlar menüsü: Hesap, Bildirimler, Gizlilik ve Güvenlik ayarları aktiftir.");
}

// Global Window Binds
window.openEditProfileModal = openEditProfileModal;
window.closeEditProfileModal = closeEditProfileModal;
window.closeEditProfileModalOnOverlay = closeEditProfileModalOnOverlay;
window.updateEditUsernamePreview = updateEditUsernamePreview;
window.updateEditBioCounter = updateEditBioCounter;
window.previewEditAvatar = previewEditAvatar;
window.saveProfileChanges = saveProfileChanges;
window.openSettingsModal = openSettingsModal;


