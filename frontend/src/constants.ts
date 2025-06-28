// constants.ts
export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
export const IS_DEVELOPMENT = import.meta.env.DEV;

// Set a default fallback URL for development
export const BACKEND_URL = API_DOMAIN
  ? `${location.protocol}//${API_DOMAIN}`
  : IS_DEVELOPMENT
  ? "http://localhost:8080" // Replace with your dev backend URL
  : `${location.origin}`; // Use same origin in production

console.log("API Config:", { API_DOMAIN, IS_DEVELOPMENT, BACKEND_URL });
