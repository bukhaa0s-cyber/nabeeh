/* Nabeeh — read-aloud for the word cards. Picks the best installed voice (enhanced/premium first, never a novelty voice),
   speaks single words slowly, and for Arabic adds the short vowels (tashkeel) that the voice needs to pronounce a word correctly. */
(function(){
"use strict";
const strip=s=>String(s).replace(/[ً-ْٰـ]/g,"");
const TASH=new Map();
`كَبِير صَغِير طَوِيل قَصِير حَارّ بَارِد سَعِيد حَزِين سَرِيع بَطِيء مَفْتُوح مُغْلَق مُمْتَلِئ فَارِغ ثَقِيل خَفِيف نَهَار لَيْل نَظِيف مُتَّسِخ قَرِيب بَعِيد قَوِيّ ضَعِيف دَاخِل خَارِج أَمَام خَلْف
يَفُوز يَخْسَر يَشْتَرِي يَبِيع يَدْفَع يَسْحَب يَضْحَك يَبْكِي يَتَذَكَّر يَنْسَى صَادِق كَاذِب غَنِيّ فَقِير وَاسِع ضَيِّق أَمْلَس خَشِن آمِن خَطِير شُجَاع جَبَان صَدِيق عَدُوّ يَطْفُو يَغُوص يَصِل يُغَادِر
كَرِيم بَخِيل قَدِيم حَدِيث يَزِيد يَنْقُص مُمْكِن مُسْتَحِيل مُهَذَّب وَقِح ضَحْل عَمِيق كَسُول مُجْتَهِد يَقْبَل يَرْفُض نَشِيط خَامِل مُؤَقَّت دَائِم يَتَمَدَّد يَنْكَمِش رَأْسِيّ أُفُقِيّ يَسْتَوْرِد يُصَدِّر يَصْعَد يَهْبِط
مُتَكَرِّر نَادِر طَبِيعِيّ صِنَاعِيّ الأَغْلَبِيَّة الأَقَلِّيَّة مَرِن جَامِد شَفَّاف مُعْتِم مُتَفَائِل مُتَشَائِم اخْتِيَارِيّ إِجْبَارِيّ يَكْشِف يُخْفِي يُبَسِّط يُعَقِّد وَفِير شَحِيح يَمْدَح يَذُمّ مُتَوَاضِع مُتَكَبِّر ضَئِيل هَائِل
مُتَهَوِّر حَذِر غَامِض وَاضِح عِدَائِيّ وَدُود مُوجَز مُسْهَب يُحْجِم يُقْدِم ثَابِت مُتَقَلِّب بَيْت مَنْزِل جَمِيل حَسَن فَرْحَان ذَكِيّ نَبِيه ضَخْم طَرِيق شَارِع يُسَاعِد يُعِين يَقْفِز يَثِب جَرِيء ثَرِيّ
رِحْلَة سَفَر قِصَّة حِكَايَة هَادِئ سَاكِن صَعْب عَسِير يُجِيب يَرُدّ يَصْرُخ يَصِيح هَدِيَّة عَطِيَّة يَرْحَل يَحْصُل يَنَال كَافٍ وَافٍ يُرَاقِب يَرْصُد فَظِيع مُرَوِّع مُرَتَّب مُنَظَّم خَصْم يُظْهِر هَدَف غَايَة
يَخْتَفِي يَتَوَارَى عَتِيق يَجْمَع يَلُمّ يَتَنَبَّأ يَتَوَقَّع شَجَاعَة جُرْأَة دَقِيق مَضْبُوط يُسْرِع يُعَجِّل غَزِير ضَرُورِيّ لَازِم يَكْتُم صُلْب شَاغِر خَالٍ يَمْنَع يَحْظُر مُتَلَهِّف مُتَشَوِّق مُثَابِر جَلِيّ جَلِيل عَظِيم مُبْهَم مُتَأَنٍّ مُتَمَهِّل جَدِيد`
  .split(/\s+/).forEach(w=>{if(w)TASH.set(strip(w),w);});
const vowelled=text=>String(text).split(/(\s+)/).map(p=>TASH.get(strip(p))||p).join("");

let voices=[];
const load=()=>{try{voices=speechSynthesis.getVoices()||[];}catch(e){voices=[];}};
try{load();speechSynthesis.addEventListener("voiceschanged",load);}catch(e){}
const NOVELTY=/^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Kathy|Ralph|Grandma|Grandpa|Rocko|Flo|Eddy|Reed|Sandy|Shelley)\b/i;
const NICE={ar:["majed","maged","tarik","laila"],en:["samantha","ava","allison","nicky","serena","daniel","karen","moira"]};
function pick(kind){
  const want=kind==="ar"?["ar-sa","ar"]:["en-us","en-gb","en"];let best=null,bs=-1;
  for(const v of voices){
    const lang=String(v.lang||"").replace("_","-").toLowerCase();if(!lang.startsWith(kind))continue;
    if(NOVELTY.test(v.name))continue;
    let s=10;const i=want.indexOf(lang);if(i>=0)s+=40-i*10;
    const n=(v.name+" "+v.voiceURI).toLowerCase();
    if(/premium/.test(n))s+=60;else if(/enhanced|siri|neural|natural/.test(n))s+=45;
    if(NICE[kind].some(x=>n.includes(x)))s+=8;
    if(v.localService)s+=3;
    if(s>bs){bs=s;best=v;}
  }
  return best;
}
function say(text,lang){
  try{
    const kind=lang==="ar"?"ar":"en";
    const clean=kind==="ar"?vowelled(text):String(text);
    const u=new SpeechSynthesisUtterance(clean+(kind==="ar"?"":"."));
    const v=pick(kind);if(v){u.voice=v;u.lang=v.lang;}else u.lang=kind==="ar"?"ar-SA":"en-US";
    u.rate=kind==="ar"?.78:.82;u.pitch=1;u.volume=1;
    speechSynthesis.cancel();
    setTimeout(()=>{try{speechSynthesis.speak(u);}catch(e){}},80);
  }catch(e){}
}
window.NBSpeech={say,pick,vowelled,hasArabicVoice:()=>!!pick("ar")};
})();
