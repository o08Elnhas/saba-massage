# Design Guidelines: Saba Massage Center Platform

## Design Approach
**Reference-Based**: Inspired by wellness booking platforms (Soothe, Spafinder) combined with clean admin interfaces (Linear, Notion). Professional spa aesthetics for public pages, efficient dashboard design for admin sections.

## Core Design Principles
1. **Trust & Professionalism**: Clean, spacious layouts that convey credibility
2. **Arabic-First**: Optimized RTL experience with proper Arabic typography
3. **Dual Personality**: Calming public interface + efficient admin dashboard
4. **Mobile-Primary**: Most bookings happen on mobile

---

## Typography System

**Arabic Font Families**:
- Primary: 'Cairo', sans-serif (headlines, UI elements)
- Secondary: 'Tajawal', sans-serif (body text, descriptions)
- Load via Google Fonts CDN

**Hierarchy**:
- Hero/Page Titles: text-4xl font-bold (mobile), text-5xl (desktop)
- Section Headers: text-2xl font-semibold
- Card Titles: text-xl font-medium
- Body Text: text-base leading-relaxed
- Small Text/Meta: text-sm
- Admin Labels: text-sm font-medium uppercase tracking-wide

---

## Layout & Spacing

**Spacing Units**: Use Tailwind spacing of 4, 6, 8, 12, 16, 20 consistently
- Component padding: p-6 (mobile), p-8 (desktop)
- Section spacing: space-y-12 (mobile), space-y-16 (desktop)
- Card margins: gap-6 in grids

**Container Strategy**:
- Public pages: max-w-6xl mx-auto px-4
- Admin dashboard: max-w-7xl with sidebar layout
- Form containers: max-w-md for focused input

---

## Component Library

### Public-Facing Components

**Navigation Bar**:
- Fixed top position with backdrop blur
- Logo (right), menu items (center), CTA button (left) in RTL
- Mobile: Hamburger menu (left side)
- Height: h-16 with shadow-sm

**Hero Section** (Homepage):
- Full-width image background showing spa/massage environment (peaceful, professional imagery)
- Overlay with gradient for text readability
- Centered content: Logo, tagline, primary CTA
- Height: 70vh on desktop, 60vh mobile

**Offer Cards**:
- Rounded-xl with shadow-md, hover:shadow-lg transition
- Badge positioned top-right (absolute)
- Icon/emoji at top, title, description, pricing row, CTA button
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Booking Form**:
- Step-by-step feel even if single page
- Clear section breaks with dividers
- Input groups: Label above, full-width input with rounded-lg borders
- Map section: h-64 rounded-lg with border

**Map Integration**:
- Full-width within container, rounded corners
- Click-to-place marker with visual feedback
- Display selected coordinates below map

**Contact Section**:
- Split layout: Info (right) + Visual/Map (left) in RTL
- Icons with text for phone, address, social links
- Social media buttons as icon buttons in a row

### Admin Dashboard Components

**Sidebar Navigation**:
- Fixed right side (RTL), w-64, full height
- Logo at top, nav items with icons, logout at bottom
- Active state with subtle background and border-right accent

**Dashboard Content Area**:
- Header bar: Page title (right), actions (left)
- Data tables with striped rows, hover states
- Action buttons (edit/delete) as icon buttons

**Admin Forms**:
- Two-column layout on desktop for efficiency
- Grouped fields with clear labels
- Rich text editor for descriptions (Quill or similar)
- Image upload with preview
- Save/Cancel buttons bottom-left (RTL)

**Offer Management Cards**:
- Compact card design showing: title, price, status badge, action buttons
- Drag handles for reordering
- Quick edit inline for simple fields

**Stats Dashboard**:
- Four-column grid of stat cards (total offers, active bookings, etc.)
- Each card: Large number, label, trend indicator
- Icon representing metric

---

## Interaction Patterns

**Buttons**:
- Primary CTA: Rounded-lg, px-8 py-3, font-medium, hover:scale-105 transition
- Secondary: Border variant with hover:bg-subtle
- Icon buttons: Square with rounded corners, consistent sizing

**Form Inputs**:
- Rounded-lg borders with focus:ring effect
- Adequate padding (px-4 py-3)
- Placeholder text with reduced opacity
- Error states with border-red and text-red-600 message below

**Cards**:
- Consistent rounded-xl throughout
- Hover lift effect (translateY) on interactive cards
- No animations on static info cards

**Modals**:
- Centered overlay with backdrop blur
- max-w-lg for forms, max-w-3xl for content
- Close button top-left (RTL)

---

## Images

**Hero Image**: 
Professional spa environment - serene massage room with natural light, plants, clean linens. Warm, inviting atmosphere. This anchors the homepage experience.

**Offer Card Images** (optional per offer):
Treatment-specific imagery - hands performing massage, spa stones, aromatherapy setup. Small format (aspect-ratio-1).

**About/Contact Section**:
Facility exterior or welcoming reception area to build trust.

---

## Mobile Optimization

- Single column layouts throughout
- Touch-friendly targets (min 44x44px)
- Bottom sheet pattern for filters/actions
- Fixed bottom CTA bar on booking pages
- Collapsible sections in admin on mobile

---

## Authentication Pages

**Login Page**:
- Centered card design (max-w-md)
- Logo centered at top
- Username/password fields stacked
- "Remember me" checkbox (right-aligned in RTL)
- Primary login button full-width
- Minimal, focused design

---

## Page-Specific Layouts

**Homepage**: Hero → Offers Grid → Benefits Row → Contact Section → Footer

**Offer Detail**: Image → Title/Description → Pricing → Features List → Booking CTA → Related Offers

**Booking Flow**: Selected Offer Summary → Personal Info Form → Location Picker → Review → WhatsApp Send

**Admin Dashboard**: Sidebar + Header + Stats Grid + Recent Activity Table

**Admin Offer Manager**: Header with Add Button → Search/Filter Bar → Offers Grid with Inline Actions