## Objective
Replace all branding from "Delta Executor" to "VOXELIA", and swap the Δ icon for the uploaded logo image across the entire landing page.

## Scope of changes

### 1. Asset: logo image
- Copy the downloaded image into `public/logo.png` so it is served at `/logo.png`.

### 2. `src/routes/index.tsx`
- Replace every occurrence of **"Delta Executor"** with **"VOXELIA"**.
- Replace isolated **"Delta"** references in headings / CTA text / descriptions with **"VOXELIA"** (e.g. "Download Delta" → "Download VOXELIA", "Why Delta" → "Why VOXELIA", etc.).
- Replace the hard-coded **Δ** symbol in the header logo box and footer logo box with an `<img src="/logo.png" alt="VOXELIA" className="..." />` sized to fit the existing container.
- Update the key-generation prefix from **"DELTA-"** to **"VOXELIA-"**.
- Update all `<head>` meta for the route: title, description, og:title, og:description.

### 3. `src/routes/__root.tsx`
- Update the default `<title>` from "Lovable App" to **"VOXELIA"**.
- Update the default description and og:title/description to reference **VOXELIA** instead of generic "Lovable App".

## Files to modify
1. `public/logo.png` — copy the uploaded logo image.
2. `src/routes/index.tsx` — text replacements + logo image swap.
3. `src/routes/__root.tsx` — root meta tag updates.

## Out of scope
- No changes to colors, layout, animations, or functionality beyond the rebrand.
- No new routes or components.