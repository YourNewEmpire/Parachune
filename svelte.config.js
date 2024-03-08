import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

import adapter from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),

    csp: {
      directives: {
        "base-uri": ["'self'"],
        "child-src": ["'self'"],
        "connect-src": [
          "'self'",
          "https://hfwrhujnelzjihpvhglb.supabase.co/",
          "wss://hfwrhujnelzjihpvhglb.supabase.co/realtime/v1/",
        ],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://lh3.googleusercontent.com/a/",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com/"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "frame-src": ["'self'"],
        "manifest-src": ["'self'"],
        "media-src": ["'self'", "blob:"],
        "object-src": ["'none'"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com/",
        ],
        "default-src": ["self"],
        "script-src": ["self"],
        "worker-src": ["'self'"],
      },
    },
  },
};

export default config;
