import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'staging.optimaldevelopments.com',
    port:'80' // Specify a port if needed
    //port:'3000' 
  },
});
