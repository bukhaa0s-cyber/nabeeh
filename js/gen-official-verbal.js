/* Nabeeh — verbal item types seen in the official Mawhiba practice tests (all three levels, both languages):
   1) three-word sequence analogies   2) meaning of an unknown word from context   3) conclusion / main idea of a short statement.
   Arabic and English items are written separately in each language (the official verbal section is adapted, not translated).
   All items are original. */
(function(){
"use strict";
const {make,reg,bpick}=NB;
const SEC="verbal";
const mark=s=>s.replace(/\[([^\]]+)\]/g,"<u><b>$1</b></u>");

/* ================= 1. THREE-WORD SEQUENCES =================
   [d, top row, bottom row (null = blank), answer, wrongs, why] */
const TRI_EN=[
[1,["Seed","Plant","Tree"],["Egg","Chick",null],"Hen",["Nest","Feather","Duck"],"Both rows show something growing up, stage by stage."],
[1,["Morning","Noon","Evening"],["Breakfast","Lunch",null],"Dinner",["Plate","Kitchen","Snack"],"Each meal goes with its time of day, in order."],
[1,["Cotton","Thread","Shirt"],["Wheat","Flour",null],"Bread",["Field","Farmer","Rice"],"A raw material becomes a material, then something we use."],
[2,["Breeze","Wind","Storm"],["Drizzle","Rain",null],"Flood",["Cloud","Umbrella","Sunshine"],"Each row grows stronger from left to right."],
[2,["Painter","Brush","Picture"],["Writer","Pen",null],"Story",["Paper","Desk","Reader"],"A person, the tool they use, and what they make."],
[2,["Baby","Child","Adult"],["Bud","Flower",null],"Fruit",["Root","Garden","Stem"],"Stages of growing, in order."],
[2,["Teacher","Lesson","Student"],["Doctor","Medicine",null],"Patient",["Hospital","Nurse","Pharmacy"],"A person gives something to the one who needs it."],
[3,["Grapes","Press","Juice"],["Wheat","Mill",null],"Flour",["Bread","Field","Oven"],"A material, the machine that works on it, and what the machine turns it into."],
[3,["Sand","Glass","Window"],["Wood","Paper",null],"Book",["Tree","Pencil","Forest"],"Raw material, the material made from it, then an object made from that."],
[3,["Second","Minute","Hour"],["Day","Week",null],"Month",["Morning","Calendar","Night"],"Each word is the next bigger unit of time."],
[3,["Letter","Word","Sentence"],["Brick","Wall",null],"House",["Cement","Builder","Door"],"Small parts build something bigger, then bigger again."],
[4,["Whisper","Talk","Shout"],["Smile","Laugh",null],"Roar with laughter",["Cry","Face","Frown"],"The same action becomes stronger each time."],
[4,["Glance","Look","Stare"],["Sip","Drink",null],"Gulp",["Cup","Taste","Thirst"],"The same action becomes bigger or longer each time."],
[4,["Author","Book","Reader"],["Speaker","Speech",null],"Listener",["Microphone","Stage","Word"],"Who makes it, what is made, and who receives it."],
[5,["Hypothesis","Experiment","Conclusion"],["Ingredients","Cooking",null],"Meal",["Recipe","Kitchen","Hunger"],"A beginning, a process, and the result."],
[5,["Annoyed","Angry","Furious"],["Pleased","Happy",null],"Overjoyed",["Calm","Sad","Worried"],"The same feeling grows stronger."],
[5,["Farmer","Wheat","Baker"],["Shepherd","Wool",null],"Weaver",["Sheep","Cotton","Carpet"],"Who produces it, the material, and who uses that material."],
[5,["Star","Galaxy","Universe"],["Student","Class",null],"School",["Teacher","Lesson","Desk"],"One member, a group of them, and a bigger group made of groups."],
[6,["Ignorance","Study",null],["Weakness","Training","Strength"],"Knowledge",["Book","Teacher","Exam"],"A state, the effort that changes it, and the new state."],
[6,["Spark","Flame","Blaze"],["Trickle","Stream",null],"Torrent",["Drop","Bridge","Dam"],"Each row grows in size and force."],
[6,["Apprentice","Craftsman","Master"],["Beginner",null,"Expert"],"Intermediate",["Student","Amateur","Teacher"],"Levels of skill, from lowest to highest."],
[7,["Dispute","Negotiation","Agreement"],["Illness","Treatment",null],"Recovery",["Doctor","Symptom","Hospital"],"A problem, what is done about it, and the result."],
[7,["Ore","Metal","Tool"],["Crude oil","Plastic",null],"Bottle",["Well","Fuel","Factory"],"A natural resource, the material made from it, and a product."],
[7,["Hill","Mountain","Mountain range"],["Pond","Lake",null],"Ocean",["River","Island","Shore"],"Each word is a bigger form of the same thing."],
[8,["Brave","Bold","Reckless"],["Thrifty","Frugal",null],"Stingy",["Generous","Wealthy","Poor"],"A good quality that, pushed too far, becomes a fault."],
[8,["Carelessness","Mistake","Regret"],["Effort",null,"Pride"],"Achievement",["Laziness","Failure","Work"],"An action, its result, and the feeling that follows."],
[9,["Design","Construction","Opening"],["Writing","Editing",null],"Publishing",["Reading","Imagining","Erasing"],"The stages a piece of work goes through before people can use it."],
[9,["Scarce","Rare","Unique"],["Common","Frequent",null],"Everywhere",["Seldom","Unusual","Limited"],"The same idea grows to its most extreme form."]
];
const TRI_AR=[
[1,["بذرة","نبتة","شجرة"],["بيضة","كتكوت",null],"دجاجة",["عش","ريشة","بطة"],"السطران يعرضان مراحل النمو بالترتيب."],
[1,["صباح","ظهر","مساء"],["فطور","غداء",null],"عشاء",["صحن","مطبخ","حلوى"],"كل وجبة توافق وقتها من اليوم بالترتيب."],
[1,["قطن","خيط","قميص"],["قمح","طحين",null],"خبز",["حقل","مزارع","أرز"],"مادة خام تصبح مادة مصنّعة ثم شيئًا نستعمله."],
[2,["نسيم","ريح","إعصار"],["رذاذ","مطر",null],"سيل",["غيم","مظلة","صحو"],"تزداد القوة من اليمين إلى اليسار في السطرين."],
[2,["رسّام","فرشاة","لوحة"],["كاتب","قلم",null],"قصة",["ورقة","مكتب","قارئ"],"صاحب العمل، ثم أداته، ثم ما يصنعه."],
[2,["رضيع","طفل","رجل"],["برعم","زهرة",null],"ثمرة",["جذر","بستان","ساق"],"مراحل النمو بالترتيب."],
[2,["معلّم","درس","طالب"],["طبيب","دواء",null],"مريض",["مستشفى","ممرضة","صيدلية"],"شخص يقدّم شيئًا لمن يحتاج إليه."],
[3,["عنب","معصرة","عصير"],["قمح","مطحنة",null],"طحين",["خبز","حقل","فرن"],"مادة، ثم الآلة التي تعالجها، ثم ما تحوّلها إليه."],
[3,["رمل","زجاج","نافذة"],["خشب","ورق",null],"كتاب",["شجرة","قلم","غابة"],"مادة خام، ثم مادة تُصنع منها، ثم شيء يُصنع من الثانية."],
[3,["ثانية","دقيقة","ساعة"],["يوم","أسبوع",null],"شهر",["صباح","تقويم","ليلة"],"كل كلمة هي وحدة الزمن الأكبر التالية."],
[3,["حرف","كلمة","جملة"],["لَبِنة","جدار",null],"بيت",["إسمنت","بنّاء","باب"],"أجزاء صغيرة تكوّن ما هو أكبر منها، ثم أكبر."],
[4,["همس","كلام","صراخ"],["ابتسامة","ضحكة",null],"قهقهة",["بكاء","فرح","وجه"],"الفعل نفسه يشتد في كل مرة."],
[4,["مؤلّف","كتاب","قارئ"],["خطيب","خطبة",null],"مستمع",["منبر","مسجد","كلمة"],"من يصنع العمل، ثم العمل، ثم من يتلقّاه."],
[4,["نظرة","تأمّل","تحديق"],["رشفة","شربة",null],"جرعة كبيرة",["كوب","طعم","عطش"],"الفعل نفسه يزداد ويطول."],
[5,["فرضية","تجربة","نتيجة"],["مكوّنات","طبخ",null],"وجبة",["وصفة","مطبخ","جوع"],"بداية، ثم عملية، ثم ناتج."],
[5,["منزعج","غاضب","ثائر"],["راضٍ","مسرور",null],"مبتهج",["حزين","هادئ","قلق"],"الشعور نفسه يشتد."],
[5,["مزارع","قمح","خبّاز"],["راعٍ","صوف",null],"نسّاج",["خروف","قطن","سجادة"],"المنتِج، ثم المادة، ثم من يستعمل المادة."],
[5,["نجم","مجرّة","كون"],["طالب","فصل",null],"مدرسة",["معلم","درس","سبورة"],"فرد، ثم مجموعة منه، ثم مجموعة أكبر تضم المجموعات."],
[6,["جهل","تعلّم",null],["ضعف","تدريب","قوة"],"معرفة",["كتاب","معلم","اختبار"],"حال، ثم الجهد الذي يغيّرها، ثم الحال الجديدة."],
[6,["شرارة","لهب","حريق"],["قطرة","جدول",null],"نهر",["سحابة","جسر","سد"],"يكبر الشيء ويشتد في كل سطر."],
[6,["مبتدئ","متمرّس",null],["تلميذ","معلم","عالِم"],"خبير",["هاوٍ","طالب","مدرب"],"درجات المهارة من الأدنى إلى الأعلى."],
[7,["خلاف","تفاوض","اتفاق"],["مرض","علاج",null],"شفاء",["طبيب","عَرَض","مستشفى"],"مشكلة، ثم ما نفعله حيالها، ثم النتيجة."],
[7,["خام","معدن","أداة"],["نفط","بلاستيك",null],"قارورة",["بئر","وقود","مصنع"],"مورد طبيعي، ثم مادة تُصنع منه، ثم منتج."],
[7,["تلّ","جبل","سلسلة جبال"],["بِركة","بحيرة",null],"محيط",["نهر","جزيرة","شاطئ"],"كل كلمة صورة أكبر من الشيء نفسه."],
[8,["شجاع","جريء","متهوّر"],["مقتصد","حريص",null],"بخيل",["كريم","ثري","فقير"],"صفة حسنة إذا زادت عن حدّها صارت عيبًا."],
[8,["إهمال","خطأ","ندم"],["اجتهاد",null,"فخر"],"إنجاز",["كسل","فشل","عمل"],"فعل، ثم نتيجته، ثم الشعور الذي يليها."],
[9,["تصميم","بناء","افتتاح"],["تأليف","مراجعة",null],"نشر",["قراءة","تخيّل","محو"],"المراحل التي يمر بها العمل قبل أن يصل إلى الناس."],
[9,["قليل","نادر","معدوم"],["كثير","وافر",null],"فائض",["شحيح","مفقود","محدود"],"تتدرّج الصفة حتى تبلغ أقصاها."]
];
function triRow(row){return `<div class="triad">${row.map(w=>w==null?'<span class="blank">……</span>':`<span>${w}</span>`).join('<i>–</i>')}</div>`;}
function genTri(bank,lang){
  return function(d,L,opts){
    const {item,id}=bpick(bank,d,opts,2),[,top,bot,ans,wr,why]=item;
    const lead=lang==="ar"?"املأ الفراغ بكلمة تجعل العلاقة في السطر الثاني مثل العلاقة في السطر الأول:":"Fill in the blank so the second row has the same relationship as the first row:";
    return make(SEC,`${lead}<div class="triads">${triRow(top)}<hr>${triRow(bot)}</div>`,null,ans,wr,why,"text","tri:"+id);
  };
}
reg("triadEn",SEC,genTri(TRI_EN,"en"),{en:"Three-word sequences",ar:"العلاقات الثلاثية (إنجليزي)",min:1,max:9,bank:true,lang:"en"});
reg("triadAr",SEC,genTri(TRI_AR,"ar"),{en:"Three-word sequences (Arabic)",ar:"العلاقات الثلاثية",min:1,max:9,bank:true,lang:"ar"});

/* ================= 2. MEANING FROM CONTEXT =================
   English uses made-up words (as the English version does); Arabic uses real, rarely-known words, underlined (as the Arabic version does). */
const UNK_EN=[
[1,"Sara put on her \"zibbet\" before going out in the rain, and she came home completely dry.","Something you wear to stay dry",["A kind of food","A toy","A pet"],"She wore it in the rain and stayed dry, so it protects from rain."],
[1,"Ali poured milk into his \"flonk\" and drank it all.","A cup",["A spoon","A chair","A book"],"You pour milk into it and drink from it."],
[1,"The \"marp\" barked at the stranger and wagged its tail when Dad came home.","An animal",["A car","A plant","A tool"],"Only an animal barks and wags its tail."],
[2,"At the zoo we saw lions, zebras, giraffes and a \"torvil\".","An animal",["A building","A drink","A game"],"It is listed with other zoo animals."],
[2,"Mum bought apples, bananas, grapes and \"plimes\" from the fruit shop.","A kind of fruit",["A kind of fish","A kind of toy","A kind of bread"],"It is listed with fruits bought at a fruit shop."],
[2,"Khalid used a \"dravel\" to tighten the loose screw on his bike.","A tool",["A snack","A sport","A colour"],"You tighten screws with a tool."],
[3,"After the long hike, Reem's legs ached, so she rubbed \"wenna\" on them and the pain soon eased.","A cream that eases pain",["A kind of shoe","A drink","A map"],"It was rubbed on sore legs and the pain went away."],
[3,"In winter we wear coats, scarves and \"fendles\" to keep warm.","A piece of warm clothing",["A heater","A cold drink","A summer hat"],"It is worn with coats and scarves for warmth."],
[3,"The baker took the \"quellin\" out of the oven, sliced it and served it with cheese.","A kind of bread",["A kitchen tool","A drink","A fruit"],"It is baked, sliced and served with cheese."],
[4,"Engineers check the \"pradom\" every week, because if it fails the whole city loses its water.","Part of the water system",["A kind of fish","A road sign","A weather report"],"Its failure cuts the city's water, so it belongs to the water system."],
[4,"Hamad felt \"glorpish\" after winning the competition: he could not stop smiling and phoned everyone he knew.","Delighted",["Worried","Sleepy","Angry"],"Smiling and telling everyone shows great happiness."],
[5,"The old map was so \"vinnet\" that the paper tore as soon as Lina tried to unfold it.","Fragile",["Colourful","Heavy","New"],"Paper that tears at a touch is fragile."],
[5,"Unlike his \"tresk\" brother, who spends every riyal he gets, Yousef saves most of his pocket money.","Wasteful with money",["Careful with money","Honest","Lazy"],"\"Unlike\" tells us the brother is the opposite of a saver."],
[6,"The plan seemed \"morvic\" at first, but after many tests the team found that it worked perfectly.","Unlikely to work",["Perfect","Expensive","Simple"],"\"At first … but\" shows the first opinion was the opposite of what happened."],
[6,"Because the bridge was \"dallow\", heavy trucks were banned from crossing it until it was repaired.","Weak and unsafe",["Crowded","Beautiful","Brand new"],"Trucks are banned and repairs are needed, so the bridge was not safe."],
[7,"The scientist stayed \"pluvant\" about the results; she wanted three more experiments before believing them.","Doubtful",["Excited","Certain","Careless"],"Wanting more proof before believing shows doubt."],
[7,"Desert plants are \"sorvent\": they can survive for months without a drop of rain.","Able to live with very little water",["Poisonous","Fast-growing","Colourful"],"The second half of the sentence explains the word."],
[8,"The speaker's argument was so \"crandle\" that even people who had disagreed changed their minds.","Convincing",["Confusing","Rude","Short"],"It changed the minds of people who disagreed."],
[8,"Her apology seemed \"felm\": she said sorry, yet she kept smiling and repeated the same mistake the next day.","Not sincere",["Heartfelt","Loud","Polite"],"Repeating the mistake shows she did not really mean it."],
[9,"Because the instructions were so \"skelt\", every team understood them the same way and no one needed to ask a question.","Clear and precise",["Long","Funny","Secret"],"Everyone understood them the same way without questions."],
[9,"The museum's collection is \"varnic\": it holds tools, coins, clothes, letters and weapons from twelve different centuries.","Varied",["Small","Modern","Forgotten"],"Many kinds of objects from many centuries means a varied collection."]
];
const UNK_AR=[
[1,"اشترى أبي التفاح والموز و[الكُمّثرى] من سوق الفواكه.","نوع من الفاكهة",["نوع من السمك","نوع من الألعاب","نوع من الخبز"],"ذُكرت مع الفواكه التي تُشترى من سوق الفواكه."],
[1,"استخدم المزارع [المِحراث] ليشقّ الأرض قبل أن يزرع البذور.","أداة زراعية",["نوع من البذور","طائر","آلة لسقي الزرع"],"المزارع يشق به الأرض قبل الزراعة."],
[2,"زرعت أمي الورد والياسمين و[الخُزامى] في حديقة المنزل.","نبات زكيّ الرائحة",["نوع من الطيور","أداة زراعية","فاكهة حامضة"],"ذُكرت مع الورد والياسمين في الحديقة."],
[2,"اشتدّ البرد في الليل فتغطّى سعد بـ[الدِّثار] حتى شعر بالدفء.","غطاء يُتدفّأ به",["طعام ساخن","مدفأة كهربائية","قبعة صيفية"],"تغطّى به فشعر بالدفء."],
[2,"حمل البدويّ [القِربة] على ظهر ناقته ليشرب منها في الطريق.","وعاء لحفظ الماء",["خيمة صغيرة","عصا للرعي","سرج للناقة"],"يشرب منها في الطريق، فهي تحفظ الماء."],
[3,"رأينا في رحلتنا البرية الضبّ والجربوع، ورأينا [القطا] تحلّق فوق الكثبان.","طائر صحراوي",["نبات صحراوي","حشرة مائية","حيوان بحري"],"تحلّق فوق الكثبان في الصحراء."],
[3,"أمسك الخطّاط [اليَراع] وغمسه في الحبر ثم كتب أجمل العبارات.","قلم",["ورقة","مسطرة","ممحاة"],"يُغمس في الحبر ويُكتب به."],
[3,"حصد المزارع القمح بـ[المِنجَل] الحادّ.","أداة لقطع الزرع",["آلة لسقي الزرع","كيس لحفظ الحبوب","نوع من القمح"],"يُحصد به القمح وهو حاد."],
[4,"استيقظنا فوجدنا [الصقيع] يغطي أوراق النبات بطبقة بيضاء باردة.","جليد رقيق يتكوّن من شدة البرد",["غبار","ضوء الشمس","ندى دافئ"],"طبقة بيضاء باردة على الأوراق في الصباح."],
[4,"كان الطفل [وَجِلًا] في يومه الأول بالمدرسة، يمسك يد أبيه ولا يريد أن يتركها.","خائفًا",["فرحًا","نشيطًا","غاضبًا"],"التمسك بيد الأب وعدم تركها يدلان على الخوف."],
[4,"توقفت القافلة في ظل النخيل هربًا من [الهَجير] وقت الظهيرة.","شدة الحر",["الرياح الباردة","المطر","الظلام"],"الهرب إلى الظل وقت الظهيرة يكون من الحر الشديد."],
[5,"بعد يوم طويل من الصيام شعر المسافر بـ[السَّغَب] فأسرع إلى الطعام.","الجوع",["البرد","الفرح","النعاس"],"أسرع إلى الطعام بعد الصيام، فهو جائع."],
[5,"أشعل الراعي النار ليبدّد [الدَّيجور] في ليلة غاب فيها القمر.","الظلام الشديد",["البرد القارس","الذئاب","التعب"],"غياب القمر وإشعال النار يدلان على الظلام."],
[5,"جلسنا في [فَيْء] الشجرة نحتمي من حرارة الشمس.","ظل",["ثمار","أغصان","جذع"],"نحتمي به من الشمس، فهو الظل."],
[6,"كان سعيد [نَزِقًا]، يغضب لأتفه الأسباب ويرفع صوته على أصدقائه.","سريع الغضب",["هادئ الطبع","كثير الضحك","كثير النوم"],"الغضب لأتفه الأسباب صفة سريع الغضب."],
[6,"بعد المطر امتلأت [الغُدران] في الوادي فشربت منها الإبل.","برك ماء المطر",["كثبان الرمل","أشجار الوادي","خيام البدو"],"امتلأت بعد المطر وشربت منها الإبل."],
[6,"كان التاجر [ضنينًا] بماله، لا يتصدّق ولا يعين محتاجًا.","بخيلًا",["كريمًا","فقيرًا","أمينًا"],"من لا يتصدق ولا يعين أحدًا بخيل."],
[7,"أصاب الجسمَ [الوَهْن] بعد المرض الطويل، فلم يعد يقوى على المشي.","الضعف",["النشاط","الجوع","السمنة"],"عدم القدرة على المشي بعد المرض يدل على الضعف."],
[7,"كان رأي المعلم [سديدًا]، فلما عمل به الطلاب نجح مشروعهم.","صائبًا",["غريبًا","طويلًا","ضعيفًا"],"نجاح المشروع بعد العمل بالرأي يدل على صوابه."],
[8,"القائد [الحصيف] يستشير أصحابه ويفكّر في العواقب قبل أن يقرّر.","العاقل الحكيم",["المتسرّع","الثري","القوي الجسم"],"الاستشارة والتفكير في العواقب صفات العاقل."],
[8,"نصح الجدّ حفيده بـ[التريّث] قبل أن يحكم على الآخرين.","التمهّل",["الإسراع","الصمت","الغضب"],"النصيحة قبل الحكم على الناس تكون بعدم العجلة."],
[9,"اقتحم رجل الإطفاء [المِقدام] المبنى المشتعل لينقذ الطفل العالق.","الشجاع",["الطويل","السريع","الجبان"],"اقتحام مبنى مشتعل لإنقاذ طفل فعل الشجاع."],
[9,"كان الطالب [مُثابرًا]، يعيد المسألة الصعبة مرة بعد مرة حتى يحلّها.","مستمرًا لا ييأس",["كسولًا","متسرعًا","متكبرًا"],"إعادة المحاولة حتى الحل صفة من لا ييأس."]
];
function genUnk(bank,lang){
  return function(d,L,opts){
    const {item,id}=bpick(bank,d,opts,2),[,s,ans,wr,why]=item;
    const p=lang==="ar"?`المطلوب تحديد المقصود بما تحته خط وفقًا لمعنى العبارة:<br><span class="pass">${mark(s)}</span>`
      :`The word in quotation marks is made up. Use the sentence to work out what it most likely means.<br><span class="pass">${s.replace(/"([^"]+)"/,'"<b>$1</b>"')}</span>`;
    return make(SEC,p,null,ans,wr,why,"text","unk:"+id);
  };
}
reg("unknownEn",SEC,genUnk(UNK_EN,"en"),{en:"Meaning from context",ar:"المعنى من السياق (إنجليزي)",min:1,max:9,bank:true,lang:"en"});
reg("unknownAr",SEC,genUnk(UNK_AR,"ar"),{en:"Meaning from context (Arabic)",ar:"المقصود بما تحته خط",min:1,max:9,bank:true,lang:"ar"});

/* ================= 3. CONCLUSION / MAIN IDEA ================= */
const INF_EN=[
[1,"We put food in the fridge so that it stays cold and does not go bad.","We can conclude that a fridge is used for:","Keeping food fresh",["Cooking food","Washing dishes","Decorating the kitchen"],"The sentence says it keeps food from going bad."],
[1,"Birds build their nests high up in trees to keep their eggs safe.","Birds build nests high up so that:","Their eggs stay safe",["They can see the sea","The tree grows taller","They can sleep in the day"],"The reason is given in the sentence: to keep the eggs safe."],
[2,"Noura reads a story every night before bed, and her shelf is full of books.","We can conclude that Noura:","Enjoys reading",["Dislikes stories","Is a teacher","Sells books"],"Reading every night and owning many books shows she enjoys reading."],
[2,"Many people carry umbrellas when the sky is full of dark clouds.","People do this because:","They expect rain",["They like dark colours","Umbrellas are heavy","It is very hot"],"Dark clouds often bring rain."],
[3,"Exercise makes the heart stronger, fruit gives the body vitamins, and sleep lets the brain rest.","The main idea is that:","Healthy habits help the body",["Fruit is better than sleep","Everyone must run every day","The brain never rests"],"Each sentence gives a different healthy habit and how it helps."],
[3,"Saad waters his plants every evening and moves them into the sun every morning.","We can conclude that Saad:","Takes good care of his plants",["Wants his plants to wilt","Sells plants","Dislikes the sun"],"Watering and giving sunlight are ways of caring for plants."],
[4,"Bees carry pollen from flower to flower. Without this, many fruit trees could not make fruit.","The passage shows that bees:","Help plants make fruit",["Eat the fruit","Damage flowers","Make pollen"],"Without the bees' work, trees could not make fruit."],
[4,"The library was silent: some students were reading, others were writing notes, and nobody was talking.","The main idea is that:","The students were busy studying",["The library was closed","The students were playing","The library was noisy"],"Everyone in the scene is reading or writing quietly."],
[5,"Recycling one aluminium can saves enough energy to run a television for three hours, yet many cans still end up in the bin.","The writer most likely wants readers to:","Recycle more cans",["Watch less television","Buy more cans","Stop using electricity"],"The writer shows the benefit of recycling and regrets that cans are thrown away."],
[5,"Lina practised her speech in front of a mirror every day for a week. On the day of the competition, she spoke without looking at her notes.","We can conclude that:","Practice helped her speak confidently",["She lost her notes","The mirror was magic","She did not prepare"],"A week of practice led to speaking without notes."],
[6,"Some countries with very little rain still grow plenty of food, because they use drip irrigation, which delivers water straight to the roots.","According to the passage:","Careful use of water can make dry land productive",["Dry countries cannot grow food","Drip irrigation wastes water","Plants do not need roots"],"Drip irrigation lets dry countries grow plenty of food."],
[6,"In the past, a letter took weeks to cross the ocean. Today, an email arrives in seconds.","The main idea is that:","Communication has become much faster",["Paper letters were better","Oceans have become smaller","Emails are slow"],"The passage compares weeks with seconds."],
[7,"A city planted thousands of trees along its streets. Within five years, summer temperatures on those streets fell by two degrees, and fewer people used air conditioning.","What can be concluded?","Trees can help cool a city",["Air conditioners make trees grow","Temperatures rise when trees are planted","The city no longer has a summer"],"After planting trees, the streets became cooler."],
[7,"Ahmad says he loves football, but he has never watched a match or played in one.","Which statement best describes Ahmad's claim?","His actions do not support it",["It is clearly true","It is about basketball","It is backed by evidence"],"Nothing he does shows a love of football."],
[8,"A researcher noticed that students who ate breakfast scored higher on tests. However, those same students also slept more hours each night.","The best conclusion is that:","We cannot be sure that breakfast alone raised the scores",["Breakfast definitely raises scores","Sleep lowers scores","The tests were unfair"],"Two things changed together, so we cannot tell which one caused the higher scores."],
[8,"The more a muscle is used, the stronger it grows, and the same is true of memory.","A student who wants a better memory should:","Practise remembering things regularly",["Rest the brain completely","Only lift weights","Avoid reading"],"Memory, like a muscle, gets stronger with use."],
[9,"Every great invention began as an idea that many people laughed at.","The writer suggests that:","New ideas should not be rejected just because they seem strange",["Every strange idea is great","People who laugh are inventors","Inventions are always funny"],"Great inventions were once laughed at, so being laughed at does not mean an idea is bad."],
[9,"The team lost even though it had the most skilful players, because the players never passed the ball to one another.","The passage suggests that:","Teamwork matters more than individual skill",["Skilful players always win","Passing is against the rules","The other team cheated"],"The best players lost because they did not work together."]
];
const INF_AR=[
[1,"نضع الطعام في الثلاجة ليبقى باردًا ولا يفسد.","نستنتج أن الثلاجة تُستخدم لـ:","حفظ الطعام",["طهي الطعام","غسل الصحون","تزيين المطبخ"],"تذكر العبارة أن الثلاجة تمنع الطعام من الفساد."],
[1,"يبني العصفور عشّه فوق الشجرة العالية ليحمي صغاره.","يبني العصفور عشّه عاليًا من أجل:","حماية صغاره",["رؤية البحر","أن تطول الشجرة","النوم في النهار"],"السبب مذكور في العبارة: حماية الصغار."],
[2,"تقرأ نورة قصة كل ليلة قبل النوم، وفي غرفتها رف مليء بالكتب.","نستنتج أن نورة:","تحب القراءة",["لا تحب القصص","معلّمة","تبيع الكتب"],"القراءة كل ليلة وكثرة الكتب تدلان على حب القراءة."],
[2,"يحمل كثير من الناس المظلات إذا امتلأت السماء بالغيوم الداكنة.","يفعلون ذلك لأنهم:","يتوقعون نزول المطر",["يحبون الألوان الداكنة","يرون المظلات ثقيلة","يشعرون بحر شديد"],"الغيوم الداكنة كثيرًا ما تأتي بالمطر."],
[3,"الرياضة تقوّي القلب، والفاكهة تمدّ الجسم بالفيتامينات، والنوم يريح الدماغ.","الفكرة الرئيسة هي:","العادات الصحية تفيد الجسم",["الفاكهة أهم من النوم","يجب أن يجري الجميع كل يوم","الدماغ لا يرتاح"],"كل جملة تذكر عادة صحية وفائدتها."],
[3,"يسقي سعد نباتاته كل مساء، ويضعها في الشمس كل صباح.","نستنتج أن سعدًا:","يعتني بنباتاته",["يريد أن تذبل نباتاته","يبيع النباتات","لا يحب الشمس"],"السقي والتعريض للشمس من العناية بالنبات."],
[4,"ينقل النحل حبوب اللقاح من زهرة إلى أخرى، ولولا ذلك ما أثمرت كثير من الأشجار.","يدل ذلك على أن النحل:","يساعد النبات على الإثمار",["يأكل الثمار","يُتلف الأزهار","يصنع حبوب اللقاح"],"لولا النحل ما أثمرت الأشجار."],
[4,"كانت المكتبة هادئة؛ بعض الطلاب يقرؤون، وبعضهم يكتبون ملاحظاتهم، ولا أحد يتكلم.","الفكرة الرئيسة:","الطلاب منشغلون بالدراسة",["المكتبة مغلقة","الطلاب يلعبون","المكتبة مليئة بالضجيج"],"كل من في المشهد يقرأ أو يكتب بهدوء."],
[5,"إعادة تدوير علبة ألمنيوم واحدة توفّر طاقة تكفي لتشغيل التلفاز ثلاث ساعات، ومع ذلك ما زالت علب كثيرة تُرمى في النفايات.","يريد الكاتب من القرّاء أن:","يعيدوا تدوير العلب",["يقلّلوا مشاهدة التلفاز","يشتروا علبًا أكثر","يتوقفوا عن استخدام الكهرباء"],"يبيّن الكاتب فائدة التدوير ويأسف لرمي العلب."],
[5,"تدرّبت لينا على إلقاء كلمتها أمام المرآة كل يوم مدة أسبوع، وفي يوم المسابقة ألقتها دون أن تنظر إلى الورقة.","نستنتج أن:","التدريب ساعدها على الإلقاء بثقة",["أضاعت ورقتها","المرآة سحرية","لم تستعدّ"],"أسبوع من التدريب جعلها تلقي كلمتها دون ورقة."],
[6,"بعض الدول قليلة الأمطار تنتج غذاءً وفيرًا لأنها تستخدم الري بالتنقيط الذي يوصل الماء إلى جذور النبات مباشرة.","يُفهم من العبارة أن:","حسن استخدام الماء يجعل الأرض الجافة منتجة",["الدول الجافة لا تستطيع الزراعة","الري بالتنقيط يهدر الماء","النبات لا يحتاج إلى جذور"],"الري بالتنقيط مكّن دولًا جافة من إنتاج غذاء وفير."],
[6,"كانت الرسالة تستغرق أسابيع لتعبر البحار، أما اليوم فيصل البريد الإلكتروني في ثوانٍ.","الفكرة الرئيسة:","أصبح التواصل أسرع بكثير",["الرسائل الورقية أفضل","البحار صارت أصغر","البريد الإلكتروني بطيء"],"تقارن العبارة بين الأسابيع والثواني."],
[7,"زرعت مدينة آلاف الأشجار على جوانب شوارعها، وبعد خمس سنوات انخفضت حرارة الصيف في تلك الشوارع درجتين، وقلّ استخدام المكيّفات.","نستنتج أن:","الأشجار تساعد على تلطيف حرارة المدن",["المكيّفات تنمّي الأشجار","الحرارة ترتفع بزراعة الأشجار","لم يعد في المدينة صيف"],"بعد زراعة الأشجار صارت الشوارع أبرد."],
[7,"يقول أحمد إنه يحب كرة القدم، لكنه لم يشاهد مباراة قط ولم يلعب واحدة.","ما الوصف الأنسب لكلام أحمد؟","لا تؤيده أفعاله",["صحيح بلا شك","يتحدث عن كرة السلة","تدعمه الأدلة"],"لا شيء مما يفعله يدل على حب كرة القدم."],
[8,"لاحظ باحث أن الطلاب الذين يتناولون الفطور يحصلون على درجات أعلى، لكن هؤلاء الطلاب ينامون ساعات أكثر أيضًا.","الاستنتاج الأدق:","لا نستطيع الجزم بأن الفطور وحده سبب ارتفاع الدرجات",["الفطور يرفع الدرجات حتمًا","النوم يخفض الدرجات","الاختبارات غير عادلة"],"تغيّر أمران معًا، فلا نعرف أيهما سبب ارتفاع الدرجات."],
[8,"كلما استُخدمت العضلة زادت قوتها، وكذلك الذاكرة.","على الطالب الذي يريد ذاكرة أقوى أن:","يتدرّب على الحفظ والتذكّر باستمرار",["يريح دماغه تمامًا","يرفع الأثقال فقط","يبتعد عن القراءة"],"الذاكرة مثل العضلة تقوى بالاستخدام."],
[9,"كل اختراع عظيم بدأ فكرةً سخر منها كثير من الناس.","يلمّح الكاتب إلى أن:","الأفكار الجديدة لا ينبغي رفضها لمجرد غرابتها",["كل فكرة غريبة عظيمة","الساخرون هم المخترعون","الاختراعات مضحكة دائمًا"],"الاختراعات العظيمة سُخر منها أولًا، فالسخرية لا تعني أن الفكرة سيئة."],
[9,"خسر الفريق رغم أنه يضم أمهر اللاعبين، لأن لاعبيه لم يمرّروا الكرة بعضهم إلى بعض.","يُفهم من العبارة أن:","العمل الجماعي أهم من مهارة الفرد",["اللاعبون المهرة يفوزون دائمًا","التمرير مخالف للقواعد","الفريق الآخر غشّ"],"خسر أمهر اللاعبين لأنهم لم يتعاونوا."]
];
function genInf(bank){
  return function(d,L,opts){
    const {item,id}=bpick(bank,d,opts,2),[,s,q,ans,wr,why]=item;
    return make(SEC,`<span class="pass">${s}</span>${q}`,null,ans,wr,why,"text","inf:"+id);
  };
}
reg("inferEn",SEC,genInf(INF_EN),{en:"Conclusions and main idea",ar:"الاستنتاج والفكرة الرئيسة (إنجليزي)",min:1,max:9,bank:true,lang:"en"});
NB.VB=NB.VB||{};NB.VB.en=Object.assign(NB.VB.en||{},{TRI:TRI_EN,UNK:UNK_EN,INF:INF_EN});NB.VB.ar=Object.assign(NB.VB.ar||{},{TRI:TRI_AR,UNK:UNK_AR,INF:INF_AR});
reg("inferAr",SEC,genInf(INF_AR),{en:"Conclusions and main idea (Arabic)",ar:"الاستنتاج والفكرة الرئيسة",min:1,max:9,bank:true,lang:"ar"});
})();
