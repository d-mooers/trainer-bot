// This is safe to expose to public, so no need for environment variables

import { handleEnvironments } from "@/lib/handleEnvironments"

export const firebaseConfig = handleEnvironments(
  {
    production: {
      apiKey: "AIzaSyANA26hq9C4X4vljDpgksBF73hw1L7bLx0",
      authDomain: "trainer-bot-7e365.firebaseapp.com",
      projectId: "trainer-bot-7e365",
      storageBucket: "trainer-bot-7e365.appspot.com",
      messagingSenderId: "95856861667",
      appId: "1:95856861667:web:a73f1372b379ae833480d6",
      measurementId: "G-8JERGK33S9",
    },
  },
  "production"
)
