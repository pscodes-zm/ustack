import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.ustack.bitcoin",
  appName: "UStack",
  webDir: "dist/mobile",
  server: {
    androidScheme: "https",
    iosScheme: "https",
  },
  plugins: {
    StatusBar: {
      style: "Dark",
      backgroundColor: "#080A0F",
    },
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#080A0F",
      showSpinner: false,
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: "body",
      style: "dark",
    },
  },
};

export default config;
