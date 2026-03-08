# RDX Esports Registration + URL Shortener

## Current State
A full-stack esports tournament registration app with:
- Registration form (team name, phone, logo, payment screenshot)
- Admin panel at `/panel` with delete/remove-all
- Blob storage for image uploads

## Requested Changes (Diff)

### Add
- URL shortener feature: user pastes a long URL, gets a short code back
- Short URL stored in backend with code, original URL, created timestamp, click count
- A `/shorten` page with input box and "Shorten" button
- Redirect page: visiting `/<code>` resolves and redirects to original URL
- Admin can view all short URLs with click counts and delete them

### Modify
- Backend: add ShortUrl type and CRUD functions alongside existing registration logic

### Remove
- Nothing

## Implementation Plan
1. Add ShortUrl type and functions to Motoko backend:
   - `createShortUrl(originalUrl)` -> ShortUrl
   - `resolveShortUrl(code)` -> ?Text (increments click count)
   - `listShortUrls()` -> [ShortUrl]
   - `deleteShortUrl(code)` -> Bool
2. Add `/shorten` frontend page with paste + shorten + copy result UI
3. Add `/:code` catch-all route that calls resolveShortUrl and redirects
4. Add short URL management section in admin panel
5. Add nav link to URL shortener from main page header
