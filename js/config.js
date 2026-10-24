/* Nabeeh — settings you fill in once before selling. Nothing here is secret: Firebase web config is public by design;
   security comes from firestore.rules. */
window.NB_CONFIG = {
  /* 1) Firebase: paste the "firebaseConfig" object from Firebase console → Project settings → Your apps → Web app.
        Leave null to run in local-only mode (no accounts, progress stays on the device). */
  firebase: {
    apiKey: "AIzaSyDOPL_rqyja32sd-pqODkeAjzLXFxpEAfc",
    authDomain: "nabeeh-1654e.firebaseapp.com",
    projectId: "nabeeh-1654e",
    storageBucket: "nabeeh-1654e.firebasestorage.app",
    messagingSenderId: "1019546344970",
    appId: "1:1019546344970:web:c5a631ea87ffea93aa89f3"
  },

  /* 2) Accounts allowed to open admin.html and create activation codes (a verified email, e.g. Google sign-in).
        Must match isAdmin() in firestore.rules. */
  adminEmails: ["bukhaa0s@gmail.com"],

  /* 3) Where parents buy a code (your Payhip product page, or a Salla/Zid product page). */
  buyUrl: "",

  /* 4) Price shown in the app and on the sales page. */
  price: { sar: 79, note: { ar: "دفعة واحدة تشمل العائلة كلها، حتى ٥ أطفال", en: "One payment for the whole family, up to 5 children" } },

  /* 5) Free trial limits. */
  trial: { dailyQuestions: 15, miniMocks: 1, kids: 1 },
  proKids: 5,

  /* 6) Support contact shown in the app (leave "" to hide). */
  supportEmail: "",
  whatsapp: "",          /* international format without +, e.g. "9665XXXXXXXX" */

  /* 7) Local preview only: this code unlocks everything when firebase is null, so you can demo the full app.
        It is ignored as soon as Firebase is configured. */
  demoCode: "NABEEH-DEMO"
};
