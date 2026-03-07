# RDX Esports Tournament Registration

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing/hero section: "RDX ESPORTS presents" banner with a "Register Now" CTA
- "We are proudly invites" sponsor section showing 3 sponsors: TG ESPORTS, KD PAIYAN YT, TG Panel (each with a logo placeholder)
- Team registration form with fields:
  - Team Name (text)
  - Response/IGN (text)
  - Team Logo (image upload)
  - Player Photo (image upload)
  - Phone Number (text)
  - Referred By Name (text)
  - WhatsApp Link to Join (URL)
  - Payment (GPay Screenshot image upload)
  - Proof of Payment (image upload)
- Rules section listing tournament rules:
  NO EMOTE, NO WALL BREAK, NO ZONE BLOCK, NO PC, NO HACK, NO PANEL, NO REFUND, NO ROOF, ONLY FACE TO FACE
- On successful registration:
  - Auto-generate a unique Registration ID
  - Show confirmation card with: Registration ID, Team Name, Team Logo, Date, "THANK YOU FOR REGISTERING" message
- Backend: store registrations with all form data and uploaded image references
- Admin view: list all registrations (accessible via /admin route, no auth required for MVP)
- Footer: "Designed by NAVEEN"

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend canister: Registration record type with all fields, createRegistration, getRegistration, listRegistrations, auto-generate unique IDs
2. Blob storage for image uploads (team logo, player photo, payment screenshot, proof of payment)
3. Frontend: Hero section with gradient esports branding, Register Now button scrolls to form
4. Sponsor row: 3 sponsor cards with logos
5. Registration form with validation and image upload fields
6. Rules section as styled list
7. Success/confirmation card shown after submission with generated ID, team name, team logo, date
8. Admin page at /admin listing all registrations in a table
9. Footer credit
