// src/config.ts
//
// Single source of truth for the backend base URL.
//
// During `vite dev`, requests are proxied by vite.config.ts, so an empty
// string (relative URLs) works perfectly with no CORS issues.
//
// In production, the frontend is served by Flask from the same origin, so
// an empty string again keeps everything same-origin. To override at
// build time, set VITE_API_BASE when running `npm run build`, e.g.:
//   VITE_API_BASE="https://wapp-266565-dwerfahxbjdngrdm.centralindia-01.azurewebsites.net" npm run build
//
export const API_BASE: string = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");
