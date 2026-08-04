import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.etqaan.rahman',
  appName: 'دار الرحمن',
  webDir: 'out',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
};

export default config;
