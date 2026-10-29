/* Nabeeh — which platform the app is running on.
   The phone apps are free: everything is unlocked, there is no in-app purchase and no store code.
   The web version still sells activation codes, so the paid paths live in cloud.js and app.js instead. */
(function(){
"use strict";
const native=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const plat=()=>native()?Capacitor.getPlatform():null;          /* "ios" | "android" | null */
window.NBPlat={native,plat,ios:()=>plat()==="ios",android:()=>plat()==="android"};
})();
