/* Nabeeh — which platform the app is running on.
   The phone apps sell Nabeeh Plus and Remove Ads through the stores (iap.js); the website sells activation codes (cloud.js). */
(function(){
"use strict";
const native=()=>!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const plat=()=>native()?Capacitor.getPlatform():null;          /* "ios" | "android" | null */
window.NBPlat={native,plat,ios:()=>plat()==="ios",android:()=>plat()==="android"};
})();
