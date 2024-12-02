
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: 'staging.optimaldevelopments.com', // Allow access from all IPs (or use your domain)
//     port: 80, // Production port
//     proxy: {
//       '/api': 'http://127.0.0.1:5000', // Proxy for development
//     },
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'staging.optimaldevelopments.com',
    port: 80, 
    proxy: {
      '/api': 'http://127.0.0.1:5000', 
    },
  },
});
