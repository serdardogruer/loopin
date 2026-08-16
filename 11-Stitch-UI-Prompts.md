
# 11-Stitch-UI-Prompts.md
stitch_ui = """
# Loopin
## Stitch UI Prompts
### Version 1.0

---

# 1. Genel Bakis

Bu dokuman, AI araclarinin (v0, Bolt, Lovable, Replit vb.) Loopin UI bilesenleri uretmesi icin prompt sablonlarini icerir. Her prompt, tutarli ve markaya uygun UI uretimi icin optimize edilmistir.

---

# 2. Marka Kimligi

## 2.1 Renk Paleti
```
Primary:    #6366F1 (Indigo)
Secondary:  #10B981 (Emerald)
Accent:     #F59E0B (Amber)

Background: #0A0A0A (Near Black)
Surface:    #1A1A1A (Dark Gray)
Surface-2:  #2A2A2A (Medium Gray)

Text Primary:   #FFFFFF (White)
Text Secondary: #E5E5E5 (Light Gray)
Text Tertiary:  #A3A3A3 (Gray)

Error:   #EF4444 (Red)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Info:    #3B82F6 (Blue)
```

## 2.2 Tipografi
```
Font Family: Inter (Google Fonts)

Headline 1: 28px / Bold / -0.02em
Headline 2: 24px / Bold / -0.01em
Headline 3: 20px / Semibold / 0
Body 1:     16px / Regular / 0.01em
Body 2:     14px / Regular / 0.01em
Caption:    12px / Medium / 0.02em
Button:     16px / Semibold / 0.01em
```

## 2.3 Yuvarlaklik (Border Radius)
```
Small:   8px  (Butonlar, Chip'ler, Input'lar)
Medium:  12px (Kartlar, Modal'lar)
Large:   16px (Bottom Sheet'ler, Dialog'lar)
Full:    999px (Avatar'lar, Badge'ler)
```

## 2.4 Golge (Shadow)
```
Card:      0 4px 12px rgba(0,0,0,0.3)
Modal:     0 8px 32px rgba(0,0,0,0.4)
Floating:  0 2px 8px rgba(0,0,0,0.2)
```

## 2.5 Animasyon
```
Page Transition:  300ms / ease-out
Bottom Sheet:     250ms / cubic-bezier(0.4, 0, 0.2, 1)
Button Press:     100ms / scale(0.98)
Card Hover:       150ms / scale(1.02) / brightness(1.1)
Skeleton:         1.5s / shimmer animation
Loading:          600ms / pulse
```

---

# 3. Temel Prompt Sablonu

## 3.1 Ana Sablon
```
Create a [COMPONENT_TYPE] for a social event matching app called "Loopin".

BRAND IDENTITY:
- Dark theme (background: #0A0A0A, surface: #1A1A1A)
- Primary color: #6366F1 (indigo)
- Accent color: #10B981 (emerald)
- Font: Inter
- Modern, premium, trustworthy feel
- Mobile-first design

DESIGN SYSTEM:
- Border radius: 12px for cards, 8px for buttons
- Shadows: subtle dark shadows
- Spacing: 16px base unit
- Icons: Lucide icons
- Images: rounded corners, aspect ratio 16:9 or 1:1

[SPECIFIC_REQUIREMENTS]

INTERACTIONS:
- Hover states with subtle scale/brightness
- Active states with scale(0.98)
- Loading skeleton states
- Empty states with illustrations
- Error states with retry buttons

RESPONSIVE:
- Mobile: 375px width (primary)
- Tablet: 768px (2-column grids)
- Desktop: 1024px+ (max-width containers)

OUTPUT:
- React component with Tailwind CSS
- TypeScript types
- Responsive design
- Dark theme only
- Accessible (WCAG 2.1 AA)
```

---

# 4. Bilesen Prompt'lari

## 4.1 Event Card
```
Create an Event Card component for Loopin app.

CONTENT:
- Event image (16:9 aspect ratio, rounded-lg)
- Category badge with icon and color (top-left on image)
- Event title (bold, 2 lines max)
- Date and time row with calendar icon
- Location row with location pin icon
- Participant count: "2/4 joined" with people icon
- Creator info: avatar, name, rating (stars)
- "Join" button (primary color, full width)

STYLING:
- Card background: #1A1A1A
- Border radius: 12px
- Padding: 16px
- Gap between elements: 12px
- Image overlay gradient for text readability
- Verified badge (checkmark icon) next to creator name

STATES:
- Default: Normal card
- Hover: Subtle lift (shadow increase)
- Full: "Event Full" badge, disabled button
- Past: Grayscale filter, "Completed" badge
- Loading: Skeleton shimmer

INTERACTIONS:
- Card tap: Navigate to event detail
- Join button: Show application modal
- Creator avatar tap: Navigate to profile

EXAMPLE DATA:
{
  "title": "Akşam Yemeği @ Kadıköy",
  "category": { "name": "Yemek", "icon": "utensils", "color": "#FF6B6B" },
  "date": "20 Temmuz 2026",
  "time": "20:00",
  "location": "Kadıköy, Moda Caddesi",
  "participants": { "current": 2, "max": 4 },
  "creator": {
    "name": "Ahmet Yılmaz",
    "avatar": "https://i.pravatar.cc/150?img=1",
    "rating": 4.8,
    "isVerified": true
  }
}
```

## 4.2 Bottom Navigation
```
Create a Bottom Navigation Bar for Loopin app.

TABS:
1. Home (icon: home) - "Ana Sayfa"
2. Explore (icon: compass) - "Keşfet"
3. Create (icon: plus-circle, centered, larger) - "Oluştur"
4. Messages (icon: message-circle) - "Mesajlar"
5. Profile (icon: user) - "Profil"

STYLING:
- Background: #1A1A1A with top border
- Height: 64px + safe area
- Active tab: Primary color (#6366F1) with filled icon
- Inactive tab: Gray (#A3A3A3) with outlined icon
- Center button: Elevated, primary background, larger (56px)
- Badge: Red dot on Messages tab (unread count)

INTERACTIONS:
- Tap: Scale animation (0.9 -> 1.0)
- Active indicator: Top border or background highlight
- Haptic feedback on tap

SPECIAL:
- Create button: Floating above nav bar
- Safe area padding for notched devices
- Hide on scroll down, show on scroll up
```

## 4.3 Filter Modal
```
Create a Filter Modal (Bottom Sheet) for Loopin app.

SECTIONS:
1. Header: "Filtrele" title + "Reset" button + drag handle
2. Location: City dropdown + District dropdown + Distance slider (0-50km)
3. Date: Quick chips (Today, Tomorrow, This Weekend, Custom) + Date picker
4. Category: Horizontal scroll chips (All, Food, Coffee, Sports, Concert, Travel, Nightlife)
5. User Filters: Age range slider (18-60) + "Verified only" toggle
6. Goal: Radio buttons (Friendship, Social, Meet, Travel, Business, Dating)
7. Footer: "Apply (24 results)" button

STYLING:
- Background: #1A1A1A
- Border radius: 16px top corners
- Max height: 85% of screen
- Scrollable content
- Sticky footer with button

INTERACTIONS:
- Drag to dismiss (swipe down)
- Backdrop tap to dismiss
- Apply button: Close modal + refresh list
- Reset: Clear all filters
- Real-time result count update

ANIMATIONS:
- Slide up from bottom (250ms)
- Backdrop fade in
- Chips selection: Scale bounce
```

## 4.4 Chat Screen
```
Create a Chat Screen for Loopin app.

LAYOUT:
1. App Bar: Back button + Avatar + Name/Rating + Call/More options
2. Messages Area: Scrollable list
3. Input Area: Text field + Attach + Send

MESSAGE BUBBLES:
- Sent (me): Primary color background (#6366F1), right-aligned
- Received: Surface background (#2A2A2A), left-aligned
- Timestamp: Below bubble, small gray text
- Read receipts: Double checkmark for sent

STYLING:
- Message padding: 12px 16px
- Border radius: 16px (sent: top-right 4px, received: top-left 4px)
- Max width: 75% of screen
- Gap between messages: 8px
- Date separator: Centered gray text

INPUT:
- Text field: Surface background, rounded-full
- Placeholder: "Mesaj yaz..."
- Send button: Primary color, disabled when empty
- Attach: Paperclip icon
- Auto-resize: Max 5 lines

INTERACTIONS:
- Long press: Message options (copy, delete)
- Swipe left: Reply gesture
- Typing indicator: Three dots animation
- Scroll to bottom: Floating button
- Pull to load older messages

STATES:
- Empty: "Henüz mesaj yok" illustration
- Loading: Skeleton messages
- Error: Retry button
- Offline: Banner notification
```

## 4.5 Profile Screen
```
Create a Profile Screen for Loopin app.

SECTIONS:
1. Header: Settings icon (top-right)
2. Avatar: Large (120px), centered, with edit button
3. Name & Age: "Serdar, 29" - Bold, large
4. Rating: Stars (4.8) + count (32 reviews) + verified badge
5. Location & Job: "📍 İstanbul | 💼 Software Engineer"
6. Goal Badge: "🎯 Yeni insanlarla tanışma"
7. Interests: Horizontal scroll chips (Food, Travel, Photography, Tech)
8. Stats Row: 3 columns (Events Joined, Events Created, Connections)
9. Bio: "About me" text, expandable
10. Action Buttons: "Edit Profile" (primary), "Share Profile"
11. Tabs: Events | Reviews | Photos

STYLING:
- Background: Gradient from #0A0A0A to #1A1A1A
- Avatar border: 4px primary color ring
- Stats: Surface cards with rounded corners
- Interests: Surface background chips

INTERACTIONS:
- Avatar tap: Full-screen image view
- Interest chip tap: Filter events by interest
- Stats tap: Navigate to detail
- Tab swipe: Horizontal scroll
- Pull to refresh

OTHER USER PROFILE:
- Show "Message" button instead of "Edit"
- Show "Block" and "Report" options
- Show mutual connections
```

## 4.6 Create Event Form
```
Create a Multi-Step Event Creation Form for Loopin app.

STEP 1 - Basic Info:
- Title input (max 100 chars)
- Category selection (grid of icons)
- Description textarea (max 500 chars, character counter)

STEP 2 - Date & Location:
- Date picker (calendar, min: today)
- Time picker (24h format)
- Location input with autocomplete
- Map preview (small embedded map)

STEP 3 - Participants:
- Max participants slider (2-50)
- Age range slider (18-100)
- Gender preference: Any/Male/Female
- Goal selection: Friendship/Social/Meet/Travel/Business/Dating
- Payment type: Split/Host pays/Shared

STEP 4 - Photos:
- Photo upload grid (max 5)
- Camera/Gallery options
- Reorder photos (drag)
- Remove photo (X button)

NAVIGATION:
- Step indicator: Dots (1 2 3 4)
- Back/Next buttons
- Preview button on last step
- Progress bar

STYLING:
- Each step: Full screen scrollable
- Input fields: Surface background, rounded-lg
- Category grid: 3 columns, selectable cards
- Selected state: Primary border + checkmark

VALIDATION:
- Real-time validation
- Error messages below fields
- Next button disabled until valid
- Summary review before publish
```

## 4.7 Rating Screen
```
Create an Event Rating Screen for Loopin app.

CONTENT:
1. Header: "Etkinliği Değerlendir"
2. Event Info: Small card with event title and date
3. User Info: Avatar + Name
4. Rating Categories:
   - Respect (Saygı): 1-5 stars
   - Punctuality (Dakiklik): 1-5 stars
   - Communication (İletişim): 1-5 stars
   - Overall Experience (Genel): 1-5 stars
5. Comment: Textarea (optional, max 300 chars)
6. Submit Button

STYLING:
- Stars: 32px, filled = primary color, empty = gray
- Active star: Scale animation (1.2) + bounce
- Category labels: Left-aligned, bold
- Comment: Surface background, rounded-lg

INTERACTIONS:
- Star tap: Set rating + haptic feedback
- Star long press: Half star (optional)
- Submit: Loading state + success animation
- Success: Confetti + "Teşekkürler!" message

STATES:
- Incomplete: Submit disabled, show required message
- Complete: Submit enabled
- Submitting: Loading spinner
- Success: Auto-navigate after 2 seconds
```

## 4.8 Notification Screen
```
Create a Notifications Screen for Loopin app.

NOTIFICATION TYPES:
1. New Application: "Zeynep etkinliğine başvurdu"
2. Application Accepted: "Ahmet başvurunu kabul etti"
3. New Message: "Can: 'Yarın saat 9'da buluşalım mı?'"
4. Event Reminder: "Akşam Yemeği @ Kadıköy - 2 saat kaldı"
5. Rating Request: "Koşu @ Belgrad Ormanı - Değerlendir"
6. System: "Loopin Premium'a yükselt!"

STYLING:
- Unread: Left border accent (primary color) + bold text
- Read: Normal text, gray timestamp
- Icon: Category-specific (colored)
- Avatar: For user-related notifications
- Timestamp: Relative (2 dk önce, 1 saat önce)

INTERACTIONS:
- Tap: Navigate to related screen + mark as read
- Swipe left: Delete notification
- Long press: Mark as read/unread
- Pull to refresh
- "Mark all as read" button

EMPTY STATE:
- Illustration: Bell icon with Zzz
- Text: "Henüz bildirimin yok"
- Subtext: "Etkinliklere katıldıkça bildirim alacaksın"

GROUPING:
- Today
- Yesterday
- Earlier this week
- Older
```

## 4.9 Empty States
```
Create Empty State components for Loopin app.

VARIANTS:
1. No Events:
   - Icon: Calendar with plus sign (64px, gray)
   - Title: "Henüz etkinlik yok"
   - Subtitle: "İlk etkinliği sen oluşturabilirsin!"
   - Action: "Etkinlik Oluştur" button

2. No Messages:
   - Icon: Chat bubble (64px, gray)
   - Title: "Henüz mesajın yok"
   - Subtitle: "Bir etkinliğe katılarak sohbet etmeye başla"
   - Action: "Etkinliklere Göz At" button

3. No Notifications:
   - Icon: Bell (64px, gray)
   - Title: "Henüz bildirimin yok"
   - Subtitle: "Etkinliklere katıldıkça bildirim alacaksın"

4. No Search Results:
   - Icon: Search with X (64px, gray)
   - Title: "Sonuç bulunamadı"
   - Subtitle: "Farklı arama kriterleri dene"
   - Action: "Filtreleri Sıfırla" button

5. No Internet:
   - Icon: Wifi-off (64px, warning color)
   - Title: "İnternet bağlantısı yok"
   - Subtitle: "Bağlantını kontrol et ve tekrar dene"
   - Action: "Tekrar Dene" button

STYLING:
- Centered layout
- Icon: Surface background circle, 120px
- Title: 20px, bold, white
- Subtitle: 14px, gray, centered
- Action button: Primary color, medium size
- Padding: 48px vertical
```

## 4.10 Loading States
```
Create Loading State components for Loopin app.

VARIANTS:
1. Skeleton Card:
   - Image placeholder: 16:9, shimmer animation
   - Title: 2 lines, 80% and 60% width
   - Details: 3 lines, 40% width each
   - Avatar: Circle, 40px

2. Skeleton List:
   - 3-5 skeleton cards stacked
   - Consistent spacing

3. Skeleton Profile:
   - Avatar: Circle, 120px
   - Name: 60% width
   - Stats: 3 boxes
   - Bio: 4 lines

4. Shimmer Animation:
   - Base: Surface color (#1A1A1A)
   - Highlight: Lighter shade (#2A2A2A)
   - Animation: Left to right sweep
   - Duration: 1.5s, infinite

5. Spinner:
   - Circular progress indicator
   - Primary color
   - Size: 24px (inline), 48px (fullscreen)

6. Pull to Refresh:
   - Circular progress
   - Primary color
   - Bounce animation

STYLING:
- Border radius: Match actual content
- No shadows
- Subtle pulse for spinners
```

---

# 5. Ekran Prompt'lari

## 5.1 Home Feed Screen
```
Create the Home Feed screen for Loopin app.

LAYOUT:
- App Bar: Logo (left) + City selector (center) + Notifications + Messages (right)
- Search Bar: Sticky, with search icon
- Category Chips: Horizontal scroll, sticky below search
- Event List: Vertical scroll, infinite loading
- Bottom Nav: 5 tabs (Home, Explore, Create, Messages, Profile)

FEATURES:
- Pull to refresh
- Infinite scroll (load more on reach bottom)
- Category filter (tap chip to filter)
- Search (navigate to search screen)
- Floating action button for quick create (optional)

STATES:
- Loading: Skeleton list
- Empty: No events illustration
- Error: Retry button
- Success: Event cards list

RESPONSIVE:
- Mobile: Single column
- Tablet: 2-column grid
- Desktop: 3-column grid, max-width container

DATA:
Show 5-6 example event cards with realistic Turkish content.
```

## 5.2 Event Detail Screen
```
Create the Event Detail screen for Loopin app.

LAYOUT:
- Hero Image: Full width, 16:9, parallax scroll
- Category Badge: Overlaid on image
- Title: Large, bold, below image
- Date/Time Row: Calendar + clock icons
- Location Row: Pin icon + address + "Map" link
- Description: Expandable text
- Creator Card: Avatar, name, rating, verified badge
- Participants: Avatar stack + count
- Details Grid: Age, Gender, Payment, Goal
- Photo Gallery: Horizontal scroll
- Action Button: "Başvuru Gönder" (sticky bottom)

INTERACTIONS:
- Image tap: Full-screen gallery
- Creator tap: Profile navigation
- Map tap: Open maps app
- Share: Native share sheet
- Report: Bottom sheet with options
- Join: Application modal

STATES:
- Creator view: Show "Başvuruları Gör" button
- Applied: Show "Başvurun Beklemede"
- Approved: Show "Sohbete Git"
- Full: Show "Etkinlik Dolu"
- Past: Show "Etkinlik Sona Erdi"

ANIMATIONS:
- Hero image parallax
- Content fade-in on scroll
- Button slide-up on load
```

## 5.3 Onboarding Screens
```
Create the Onboarding flow for Loopin app.

FLOW:
1. Splash Screen: Logo animation (2s)
2. Welcome Screen: 3-page carousel
   - Page 1: "Yeni İnsanlarla Tanış" - Illustration
   - Page 2: "Etkinlik Keşfet" - Illustration
   - Page 3: "Gerçek Hayatta Buluş" - Illustration
3. Login/Register Screen
4. Phone Verification (OTP)
5. Profile Setup (Name, Age, City, Job, Education)
6. Location Setup (City selection)
7. Photo Upload (1-6 photos)
8. Interest Selection (min 3)
9. Goal Selection (single choice)
10. Home Feed (success!)

STYLING:
- Full screen backgrounds
- Gradient accents
- Large illustrations (SVG)
- Clear CTAs
- Progress indicators
- Skip options where applicable

ANIMATIONS:
- Page transitions: Slide horizontal
- Illustrations: Subtle float animation
- Buttons: Scale on tap
- Progress: Smooth fill

INTERACTIONS:
- Swipe between onboarding pages
- Tap dots to navigate
- "Skip" jumps to login
- "Başlayalım" starts registration
```

---

# 6. AI Prompt Best Practices

## 6.1 Prompt Yazma Kurallari
```
1. Belirli Ol: "Guzel bir kart yap" yerine "16:9 aspect ratio, 
   rounded-12px, surface background event card"

2. Context Ver: Marka kimligi, renkler, font'lar her prompt'ta

3. Ornek Data Kullan: Gercekci icerikle doldur

4. State'leri Belirt: Default, hover, active, loading, error, empty

5. Responsive Dusun: Mobile, tablet, desktop davranislari

6. Interaction'lari Tanimla: Tap, swipe, long-press, drag

7. Accessibility Ekle: ARIA labels, focus states, screen reader

8. Cikti Formatini Belirt: React, Vue, Flutter, vb.
```

## 6.2 Prompt Optimizasyonu
```
Kisa Prompt (Kotu):
"Bir etkinlik karti yap"

Uzun Prompt (Iyi):
"Loopin app icin dark theme event card component'i olustur.
Background: #1A1A1A, border-radius: 12px, padding: 16px.
Icerik: 16:9 image (rounded-lg), kategori badge (top-left),
title (bold, 2 lines), tarih/saat (calendar icon), konum
(location icon), katilimci sayisi (people icon), olusturan
kullanici (avatar + isim + rating stars + verified badge),
'Katıl' butonu (full-width, primary color #6366F1).
Hover: shadow increase, scale(1.02).
Loading: skeleton shimmer.
Empty: 'Henüz etkinlik yok' illustration.
React + Tailwind + TypeScript."
```

## 6.3 Iteratif Gelistirme
```
1. Ilk Prompt: Temel yapiyi olustur
2. Inceleme: Eksikleri belirle
3. Revizyon Prompt: "Karta su ozellikleri ekle..."
4. Polish Prompt: "Animasyonlari ve interaction'lari ekle..."
5. Final: "Responsive ve accessibility kontrolu yap..."
```

---

# 7. Platform Ozel Prompt'lar

## 7.1 v0.dev Prompt'lari
```
v0 icin ozel:
- "Use v0's built-in components"
- "Follow shadcn/ui patterns"
- "Use Radix UI primitives"
- "Tailwind CSS only"
- "Dark theme default"
- "Mobile-first responsive"
```

## 7.2 Bolt.new Prompt'lari
```
Bolt icin ozel:
- "Full-stack Next.js app"
- "App Router structure"
- "Server Components default"
- "Prisma ORM"
- "PostgreSQL database"
- "NextAuth.js authentication"
```

## 7.3 Lovable Prompt'lari
```
Lovable icin ozel:
- "Supabase backend"
- "Realtime subscriptions"
- "Row Level Security"
- "Storage for images"
- "Edge Functions"
```

---

# SONUC

Bu Stitch UI Prompt dokumani, Loopin projesinde AI araclarinin tutarli, markaya uygun ve yuksek kaliteli UI bilesenleri uretmesini saglar. Her prompt sablonu, marka kimligi ve teknik gereksinimlerle desteklenmistir.
"""

with open('/mnt/agents/output/11-Stitch-UI-Prompts.md', 'w', encoding='utf-8') as f:
    f.write(stitch_ui)

print("✅ 11-Stitch-UI-Prompts.md olusturuldu")
