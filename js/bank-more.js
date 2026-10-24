/* Nabeeh — extra original questions, mostly for Level 1 (grades 3–5) where the banks were thinnest.
   Each block is appended to the bank it belongs to; difficulty d: 1–3 = Level 1, 4–6 = Level 2, 7–9 = Level 3. */
(function(){
"use strict";
const V=NB.VB,F=(d,en,ar)=>({d,en,ar}),add=(arr,items)=>{for(const x of items)arr.push(x);};

/* ---------- sentence completion ---------- */
add(V.en.SC,[
[1,"A bird uses its ____ to fly.","wings",["feet","beak","eggs"],"Birds fly by flapping their wings."],
[1,"We brush our ____ after every meal.","teeth",["hair","shoes","books"],"Brushing keeps our teeth clean."],
[2,"The library is a ____ place, so please whisper.","quiet",["noisy","wet","busy"],"Libraries are kept quiet so people can read."],
[2,"Mum cut the cake into eight equal ____.","pieces",["cakes","plates","candles"],"Cutting a cake makes pieces."],
[2,"It was so dark that Sami could not ____ anything.","see",["hear","eat","carry"],"Darkness stops us from seeing."],
[3,"Lina was ____ because she had lost her favourite pen.","upset",["delighted","sleepy","proud"],"Losing something you love makes you upset."],
[3,"The baby bird was too ____ to leave the nest.","young",["old","fast","tall"],"Young birds stay in the nest until they can fly."],
[3,"Water turns into ice when it gets very ____.","cold",["hot","dirty","loud"],"Water freezes when it gets very cold."],
[3,"Khalid saved his pocket money ____ he could buy a new football.","so that",["because","but","although"],"\"So that\" gives the purpose of saving."]
]);
add(V.ar.SC,[
[1,"يطير العصفور بـ ____.","جناحيه",["قدميه","منقاره","بيضه"],"تطير الطيور بأجنحتها."],
[1,"ننظّف ____ بالفرشاة بعد الأكل.","أسناننا",["أحذيتنا","كتبنا","شعرنا"],"تنظيف الأسنان بعد الأكل يحميها."],
[2,"المكتبة مكان ____، فتكلّم بصوت منخفض.","هادئ",["صاخب","مبلّل","مزدحم"],"المكتبة هادئة ليقرأ الناس."],
[2,"قسمت أمي الكعكة ثماني ____ متساوية.","قطع",["كعكات","صحون","شموع"],"تقسيم الكعكة ينتج قطعًا."],
[2,"كان المكان مظلمًا جدًّا فلم يستطع سامي أن ____ شيئًا.","يرى",["يسمع","يأكل","يحمل"],"الظلام يمنعنا من الرؤية."],
[3,"حزنت لينا لأنها ____ قلمها المفضّل.","أضاعت",["وجدت","اشترت","زيّنت"],"إضاعة الشيء المحبوب تسبب الحزن."],
[3,"كان فرخ الطائر ____ جدًّا على مغادرة العش.","صغيرًا",["كبيرًا","سريعًا","طويلًا"],"يبقى الفرخ الصغير في العش حتى يقدر على الطيران."],
[3,"يتحوّل الماء إلى جليد عندما يصبح ____ جدًّا.","باردًا",["حارًّا","متّسخًا","مرتفعًا"],"يتجمّد الماء عند البرودة الشديدة."],
[3,"ادّخر خالد مصروفه ____ يشتري كرة جديدة.","لكي",["لأن","لكن","رغم أن"],"«لكي» تبيّن الهدف من الادخار."]
]);

/* ---------- context error (Level 1 had almost none) ---------- */
add(V.en.CE,[
[2,"The [cat] [barked] at the [mouse] and chased it under the [bed].","barked","Cats miaow; it is dogs that bark."],
[2,"We [wear] [gloves] on our [feet] to keep them [warm].","feet","Gloves are worn on the hands."],
[2,"The [fish] [walked] along the [bottom] of the [lake].","walked","Fish swim; they cannot walk."],
[2,"We [read] the [story] with our [ears] in the [library].","ears","We read with our eyes."],
[3,"The [ice cream] [melted] [quickly] in the [freezing] sun.","freezing","Ice cream melts quickly in a hot sun, not a freezing one."],
[3,"Omar was [hungry], so he [ate] a [big] [pillow].","pillow","A hungry person eats food, not a pillow."],
[3,"The [old] man [walked] [slowly] because his legs were [strong].","strong","Walking slowly suggests weak legs, not strong ones."],
[3,"It was [raining] [heavily], so the [ground] was [dry].","dry","Heavy rain makes the ground wet."],
[3,"Sara [whispered] [loudly] so that she would not [wake] the [baby].","loudly","A whisper is quiet, and she wanted to keep the baby asleep."]
]);
add(V.ar.CE,[
[2,"[نبحت] [القطة] على [الفأر] وطاردته تحت [السرير].","نبحت","القطة تموء، والذي ينبح هو الكلب."],
[2,"[نلبس] [القفازات] في [أقدامنا] لتبقى [دافئة].","أقدامنا","القفازات تُلبس في الأيدي."],
[2,"[مشت] [السمكة] على [قاع] [البحيرة].","مشت","السمكة تسبح ولا تمشي."],
[2,"[قرأنا] [القصة] [بآذاننا] في [المكتبة].","بآذاننا","نقرأ بأعيننا لا بآذاننا."],
[3,"[ذاب] [المثلّج] [بسرعة] تحت الشمس [المتجمّدة].","المتجمّدة","يذوب المثلّج بسرعة تحت الشمس الحارة لا المتجمّدة."],
[3,"كان عمر [جائعًا] [فأكل] [وسادة] [كبيرة].","وسادة","الجائع يأكل الطعام لا الوسادة."],
[3,"مشى الرجل [العجوز] [ببطء] لأن ساقيه [قويّتان] [جدًّا].","قويّتان","المشي ببطء يدل على ضعف الساقين لا قوتهما."],
[3,"[نزل] المطر [بغزارة] فأصبحت [الأرض] [جافّة].","جافّة","المطر الغزير يجعل الأرض مبتلّة."],
[3,"[همست] سارة [بصوت عالٍ] حتى لا [توقظ] [الرضيع].","بصوت عالٍ","الهمس صوت منخفض، وهي لا تريد أن يستيقظ الرضيع."]
]);

/* ---------- reading passages for Level 1 ---------- */
Object.assign(V.en.P,{
 garden:"Saad planted tomatoes, mint and peppers in his garden. He waters the tomatoes every morning and the mint every evening. The peppers need less water, so he waters them every two days. Last week a strong wind broke two tomato plants, so Saad tied the others to wooden sticks.",
 falcon2:"Falcons are among the fastest birds in the world. When a falcon spots its prey from high in the sky, it folds its wings and dives. In a dive, some falcons fly faster than a racing car. In Saudi Arabia, people have hunted with falcons for thousands of years, and trained falcons are cared for like members of the family.",
 moon:"The Moon does not make its own light. It shines because sunlight bounces off its surface. As the Moon travels around the Earth, we see different amounts of its lit side. That is why it seems to change shape during the month, from a thin crescent to a full circle and back again."
});
add(V.en.RD,[
 {d:1,p:"garden",q:"Which plant does Saad water every evening?",a:"The mint",w:["The tomatoes","The peppers","All of them"],why:"The passage says he waters the mint every evening."},
 {d:2,p:"garden",q:"Why did Saad tie the tomato plants to sticks?",a:"To protect them from the wind",w:["To make them grow faster","To keep birds away","Because they needed water"],why:"Two plants were broken by the wind, so he supported the others."},
 {d:3,p:"garden",q:"Which plant needs the least water?",a:"The peppers",w:["The tomatoes","The mint","They all need the same"],why:"The peppers are watered only every two days because they need less water."},
 {d:2,p:"falcon2",q:"What does a falcon do when it spots its prey?",a:"It folds its wings and dives",w:["It flies away","It lands on the ground","It calls other falcons"],why:"The second sentence describes the dive."},
 {d:3,p:"falcon2",q:"The passage compares a diving falcon's speed to …",a:"a racing car",w:["a plane","a horse","a rocket"],why:"Some falcons fly faster than a racing car."},
 {d:3,p:"falcon2",q:"What is the main idea of the passage?",a:"Falcons are very fast birds that people have trained for a long time",w:["Falcons live inside houses","Racing cars are faster than falcons","Falcons only eat fish"],why:"The passage is about the falcon's speed and its long history with people."},
 {d:2,p:"moon",q:"Why does the Moon shine?",a:"Sunlight bounces off it",w:["It makes its own light","It is on fire","The stars light it up"],why:"The passage says sunlight bounces off its surface."},
 {d:3,p:"moon",q:"Why does the Moon seem to change shape?",a:"We see different amounts of its lit side",w:["It grows and shrinks","Clouds cover parts of it","The Earth's shadow covers it every night"],why:"As it travels around the Earth, we see different amounts of its lit side."}
]);
Object.assign(V.ar.P,{
 garden:"زرع سعد في حديقته الطماطم والنعناع والفلفل. يسقي الطماطم كل صباح، ويسقي النعناع كل مساء، أما الفلفل فيحتاج إلى ماء أقل، فيسقيه مرة كل يومين. وفي الأسبوع الماضي هبّت ريح قوية فكسرت نبتتين من الطماطم، فربط سعد بقية النبتات بأعواد خشبية.",
 moon:"لا يُصدر القمر ضوءًا من نفسه، وإنما يلمع لأن ضوء الشمس ينعكس عن سطحه. وأثناء دوران القمر حول الأرض نرى أجزاء مختلفة من جانبه المضاء، ولهذا يبدو شكله متغيّرًا خلال الشهر، من هلال رفيع إلى بدر كامل ثم يعود هلالًا.",
 ants:"يعيش النمل في مجموعات كبيرة تسمى المستعمرات. تحفر النملات بيوتها تحت الأرض، وتصنع فيها ممرات وغرفًا كثيرة. وعندما تجد نملة طعامًا تترك خلفها أثرًا له رائحة، فتتبعه بقية النملات حتى تصل إليه. وتستطيع النملة أن تحمل شيئًا أثقل من وزنها مرات كثيرة."
});
add(V.ar.RD,[
 {d:1,p:"garden",q:"أي نبات يسقيه سعد كل مساء؟",a:"النعناع",w:["الطماطم","الفلفل","كلها"],why:"يذكر النص أنه يسقي النعناع كل مساء."},
 {d:2,p:"garden",q:"لماذا ربط سعد نبتات الطماطم بأعواد خشبية؟",a:"ليحميها من الريح",w:["لتنمو أسرع","ليُبعد الطيور","لأنها تحتاج إلى الماء"],why:"كسرت الريح نبتتين، فربط الباقي ليحميه."},
 {d:3,p:"garden",q:"أي النباتات يحتاج إلى أقل كمية من الماء؟",a:"الفلفل",w:["الطماطم","النعناع","كلها تحتاج الكمية نفسها"],why:"يُسقى الفلفل مرة كل يومين لأنه يحتاج ماءً أقل."},
 {d:2,p:"moon",q:"لماذا يلمع القمر؟",a:"لأن ضوء الشمس ينعكس عن سطحه",w:["لأنه يُصدر ضوءًا من نفسه","لأنه مشتعل","لأن النجوم تضيئه"],why:"يذكر النص أن ضوء الشمس ينعكس عن سطحه."},
 {d:3,p:"moon",q:"لماذا يبدو شكل القمر متغيّرًا خلال الشهر؟",a:"لأننا نرى أجزاء مختلفة من جانبه المضاء",w:["لأنه يكبر ويصغر","لأن الغيوم تغطي أجزاء منه","لأن ظل الأرض يغطيه كل ليلة"],why:"أثناء دورانه حول الأرض نرى أجزاء مختلفة من جانبه المضاء."},
 {d:1,p:"ants",q:"أين تحفر النملات بيوتها؟",a:"تحت الأرض",w:["فوق الأشجار","في الماء","على الجدران"],why:"يذكر النص أنها تحفر بيوتها تحت الأرض."},
 {d:2,p:"ants",q:"كيف تصل النملات إلى الطعام الذي وجدته إحداها؟",a:"تتبع أثرًا له رائحة",w:["ترى الطعام من بعيد","تسمع صوت النملة","تحفر ممرًّا جديدًا"],why:"تترك النملة أثرًا له رائحة فتتبعه البقية."},
 {d:3,p:"ants",q:"ما الفكرة الرئيسة للنص؟",a:"النمل حشرة منظّمة تعمل في جماعات",w:["النمل يأكل الحلوى فقط","النملة تعيش وحدها","النمل لا يستطيع حمل أي شيء"],why:"يصف النص حياة النمل الجماعية وتعاونه."}
]);

/* ---------- three-word sequences ---------- */
add(V.en.TRI,[
[1,["Bee","Hive","Honey"],["Cow","Barn",null],"Milk",["Grass","Farmer","Calf"],"An animal, where it lives, and what it gives us."],
[1,["Pen","Paper","Letter"],["Brush","Canvas",null],"Painting",["Artist","Colour","Wall"],"A tool, what you use it on, and what you make."],
[2,["Cold","Cool","Warm"],["Whisper","Talk",null],"Shout",["Song","Quiet","Ear"],"Each row moves step by step from one end to the other."],
[2,["Monday","Tuesday","Wednesday"],["January","February",null],"March",["Month","Winter","December"],"Each row lists things in their order."],
[2,["Spark","Fire","Smoke"],["Cloud","Rain",null],"Puddle",["Sky","Sun","Umbrella"],"Each thing leads to the next."],
[3,["Raw","Cooked","Burnt"],["Damp","Wet",null],"Soaked",["Dry","Rain","Towel"],"Each row goes further in the same direction."],
[4,["Spring","Summer","Autumn"],["Dawn","Noon",null],"Dusk",["Night","Sun","Clock"],"Parts of a cycle, in order."],
[5,["Sketch","Draft","Final copy"],["Idea","Plan",null],"Project",["Dream","Notebook","Mistake"],"Work moves from a first idea to a finished result."],
[6,["Warm","Hot","Scorching"],["Chilly","Cold",null],"Freezing",["Ice","Winter","Mild"],"The same quality pushed to its extreme."],
[8,["Doubt","Belief","Certainty"],["Suspicion","Evidence",null],"Proof",["Crime","Judge","Lie"],"Moving from not knowing to being sure."]
]);
add(V.ar.TRI,[
[1,["نحلة","خلية","عسل"],["بقرة","حظيرة",null],"حليب",["عشب","مزارع","عجل"],"الحيوان، ثم مسكنه، ثم ما يعطينا."],
[1,["قلم","ورقة","رسالة"],["فرشاة","لوحة",null],"رسمة",["رسّام","لون","جدار"],"أداة، ثم ما نستعملها عليه، ثم ما نصنعه."],
[2,["بارد","معتدل","دافئ"],["همس","كلام",null],"صراخ",["أغنية","هدوء","أذن"],"كل سطر يتدرّج خطوة خطوة من طرف إلى آخر."],
[2,["السبت","الأحد","الاثنين"],["محرّم","صفر",null],"ربيع الأول",["شهر","رمضان","ذو الحجة"],"كل سطر يذكر أشياء بترتيبها."],
[2,["شرارة","نار","دخان"],["غيمة","مطر",null],"بِركة",["سماء","شمس","مظلة"],"كل خطوة تؤدي إلى التي بعدها."],
[3,["نيء","مطبوخ","محروق"],["رطب","مبتلّ",null],"غارق",["جاف","مطر","منشفة"],"كل سطر يمضي أبعد في الاتجاه نفسه."],
[4,["ربيع","صيف","خريف"],["فجر","ظهر",null],"عصر",["ليل","شمس","ساعة"],"أجزاء دورة واحدة بترتيبها."],
[5,["مسودة","مراجعة","نسخة نهائية"],["فكرة","خطة",null],"مشروع",["حلم","دفتر","خطأ"],"ينتقل العمل من فكرة أولى إلى نتيجة مكتملة."],
[6,["دافئ","حار","لاهب"],["منعش","بارد",null],"متجمّد",["جليد","شتاء","معتدل"],"تتدرّج الصفة حتى أقصاها."],
[8,["شك","ظن","يقين"],["شبهة","قرينة",null],"دليل قاطع",["جريمة","قاضٍ","كذب"],"الانتقال من عدم اليقين إلى الجزم."]
]);

/* ---------- meaning from context ---------- */
add(V.en.UNK,[
[1,"Dad put on his \"plonks\", tied the laces and went for a run.","Shoes",["Gloves","Hats","Glasses"],"You tie laces on shoes and wear them to run."],
[2,"The \"zelk\" hopped across the field, wiggled its long ears and nibbled a carrot.","A rabbit-like animal",["A bird","A fish","A tree"],"Hopping, long ears and carrots describe an animal like a rabbit."],
[3,"Grandma keeps sugar, rice and flour in tall glass \"crumbets\" on the kitchen shelf.","Jars",["Spoons","Recipes","Ovens"],"Food is kept inside them on a shelf."],
[4,"The room was so \"dismey\" that we had to switch on every lamp to read.","Dark",["Bright","Warm","Crowded"],"Needing every lamp to read means it was dark."],
[5,"After the long, \"pemptious\" lecture, half the students had fallen asleep.","Boring",["Exciting","Short","Funny"],"Students fell asleep, so it was boring."],
[7,"The judge was \"aquant\": she listened to both sides equally and took no one's side.","Fair and neutral",["Angry","Forgetful","Generous"],"Listening equally and taking no side means being fair."]
]);
add(V.ar.UNK,[
[1,"وضعت جدتي السكر والأرز في [الجِرار] الفخارية فوق رف المطبخ.","أوانٍ لحفظ الطعام",["ملاعق","وصفات طعام","أفران"],"يُحفظ فيها الطعام فوق الرف."],
[2,"قفز [الخِرْنِق] في الحقل، وحرّك أذنيه الطويلتين، وقضم جزرة.","حيوان صغير يشبه الأرنب",["طائر","سمكة","شجرة"],"القفز والأذنان الطويلتان والجزر صفات الأرنب."],
[3,"عاد الصيادون في المساء وقد امتلأت [شِباكهم] بالسمك.","أدوات صيد السمك",["قوارب","ثياب","سلال فاكهة"],"امتلأت بالسمك عند عودة الصيادين."],
[4,"كانت الغرفة [حالكة] حتى اضطررنا إلى إشعال كل المصابيح لنقرأ.","شديدة الظلام",["مضيئة","دافئة","مزدحمة"],"الحاجة إلى كل المصابيح للقراءة تعني الظلام الشديد."],
[5,"بعد المحاضرة الطويلة [الرتيبة] نام نصف الطلاب.","المملّة التي تسير على وتيرة واحدة",["المثيرة","القصيرة","المضحكة"],"نوم الطلاب يدل على الملل."],
[7,"كان القاضي [مُنصِفًا]، يستمع إلى الطرفين بالتساوي ولا يميل إلى أحدهما.","عادلًا",["غاضبًا","كثير النسيان","كريمًا"],"الاستماع للطرفين وعدم الميل صفة العادل."]
]);

/* ---------- conclusions ---------- */
add(V.en.INF,[
[1,"Ali put on his coat, gloves and scarf before going outside.","We can conclude that it was:","Cold outside",["A hot summer day","Time for bed","Very sunny and warm"],"Coats, gloves and scarves are worn when it is cold."],
[2,"The plants on the windowsill grew taller and greener than the ones kept in the cupboard.","This shows that plants:","Grow better with light",["Like cupboards","Need no water","Grow best in the dark"],"The plants by the window got more light and grew better."],
[2,"Every time her grandmother visits, Maha bakes her favourite date cookies.","We can conclude that Maha:","Wants to please her grandmother",["Dislikes baking","Has never met her grandmother","Only bakes for herself"],"She bakes her grandmother's favourite cookies for every visit."],
[3,"Small footprints crossed the sand, close together, and stopped beside a hole.","The footprints were most likely made by:","A small animal that went into the hole",["A horse running fast","A big truck","A fish"],"Small, close footprints ending at a hole point to a small animal that went inside."],
[5,"In a survey, most students said they read more during the holidays than in school weeks, because they have more free time.","According to the passage, students read more in the holidays because:","They have more free time",["Books are cheaper","Teachers tell them to","Libraries stay open longer"],"The reason is stated directly."],
[8,"A town banned plastic bags. A year later, fewer bags were found on its beaches, but more paper bags were thrown in the bins.","The best conclusion is that the ban:","Reduced plastic on the beaches but added paper waste",["Ended all waste in the town","Had no effect at all","Increased plastic on the beaches"],"Both results are given: less plastic on beaches, more paper in bins."]
]);
add(V.ar.INF,[
[1,"لبس علي معطفه وقفازيه ووشاحه قبل أن يخرج.","نستنتج أن الجو كان:","باردًا",["حارًّا صيفيًّا","وقت النوم","مشمسًا دافئًا"],"المعطف والقفازان والوشاح تُلبس في البرد."],
[2,"نمت النباتات الموضوعة عند النافذة أطول وأكثر خضرة من التي وُضعت في الخزانة.","يدل ذلك على أن النبات:","ينمو أفضل في الضوء",["يحب الخزانات","لا يحتاج إلى الماء","ينمو أفضل في الظلام"],"النباتات عند النافذة حصلت على ضوء أكثر فنمت أفضل."],
[2,"كلما زارتهم جدتها، تخبز مها كعك التمر الذي تحبه الجدة.","نستنتج أن مها:","تحب أن تُسعد جدتها",["لا تحب الخَبز","لم تقابل جدتها قط","تخبز لنفسها فقط"],"تخبز ما تحبه جدتها في كل زيارة."],
[3,"آثار أقدام صغيرة متقاربة على الرمل، تنتهي عند جحر.","الأرجح أن هذه الآثار لـ:","حيوان صغير دخل الجحر",["حصان يركض بسرعة","شاحنة كبيرة","سمكة"],"الآثار الصغيرة المتقاربة التي تنتهي عند جحر تدل على حيوان صغير دخله."],
[5,"في استبانة، قال أكثر الطلاب إنهم يقرؤون في الإجازة أكثر من أيام الدراسة، لأن عندهم وقت فراغ أكبر.","وفقًا للعبارة، يقرأ الطلاب أكثر في الإجازة لأن:","عندهم وقت فراغ أكبر",["الكتب أرخص","المعلمين يطلبون ذلك","المكتبات تفتح وقتًا أطول"],"السبب مذكور في العبارة."],
[8,"منعت مدينة الأكياس البلاستيكية، وبعد عام قلّت الأكياس على شواطئها، لكن زادت الأكياس الورقية في حاويات النفايات.","الاستنتاج الأدق أن المنع:","قلّل البلاستيك على الشواطئ وزاد النفايات الورقية",["أنهى كل النفايات في المدينة","لم يكن له أثر","زاد البلاستيك على الشواطئ"],"العبارة تذكر النتيجتين: بلاستيك أقل على الشواطئ وورق أكثر في الحاويات."]
]);

/* ---------- flexibility banks (both languages) ---------- */
add(NB.BANKS.unreal,[
F(1,["Cows lay eggs.|Hens give milk.|So to get eggs for breakfast, we go to the …","cow",["hen","fish","goat"],"In this made-up world, eggs come from cows."],["البقرة تبيض.|الدجاجة تعطي الحليب.|إذن لنحصل على البيض للفطور نذهب إلى …","البقرة",["الدجاجة","السمكة","الماعز"],"في هذا العالم الخيالي يأتي البيض من البقرة."]),
F(2,["Clocks tell the weather.|Thermometers tell the time.|So to know if it is lunchtime, we look at the …","thermometer",["clock","window","calendar"],"Here the thermometer is what tells the time."],["الساعة تخبرنا بحالة الطقس.|ميزان الحرارة يخبرنا بالوقت.|إذن لنعرف هل حان وقت الغداء ننظر إلى …","ميزان الحرارة",["الساعة","النافذة","التقويم"],"هنا ميزان الحرارة هو الذي يخبرنا بالوقت."]),
F(3,["Grass is blue.|The sky is green.|So when we look up on a clear day, we see …","green",["blue","white","grey"],"In this made-up world the sky is green."],["العشب أزرق.|السماء خضراء.|إذن عندما ننظر إلى الأعلى في يوم صافٍ نرى اللون …","الأخضر",["الأزرق","الأبيض","الرمادي"],"في هذا العالم الخيالي السماء خضراء."]),
F(4,["Cars run on water.|Plants drink petrol.|So to water the garden, we use …","petrol",["water","milk","sand"],"Here plants drink petrol, so that is what the garden needs."],["السيارات تسير بالماء.|النباتات تشرب البنزين.|إذن لنسقي الحديقة نستخدم …","البنزين",["الماء","الحليب","الرمل"],"هنا النباتات تشرب البنزين، فهو ما تحتاج إليه الحديقة."]),
F(6,["Mirrors show the future.|Windows show the past.|So to see what happened yesterday, Reem looks through …","a window",["a mirror","a door","a camera"],"Here windows show the past."],["المرايا تُظهر المستقبل.|النوافذ تُظهر الماضي.|إذن لترى ريم ما حدث أمس تنظر من …","النافذة",["المرآة","الباب","الكاميرا"],"هنا النوافذ هي التي تُظهر الماضي."]),
F(8,["Everything round is heavy.|Everything heavy floats.|So a round stone dropped in a pond will …","float",["sink","roll away","melt"],"Round → heavy → floats, so the round stone floats."],["كل ما هو مستدير ثقيل.|كل ما هو ثقيل يطفو.|إذن الحجر المستدير إذا أُلقي في بركة …","يطفو",["يغرق","يتدحرج بعيدًا","يذوب"],"المستدير ثقيل، والثقيل يطفو، فالحجر المستدير يطفو."])
]);
add(NB.BANKS.cat,[
F(1,["APPLE","Orange – Mango",["Carrot – Potato","Juice – Milk","Tree – Leaf"],"Apples, oranges and mangoes are fruits."],["تفاح","برتقال – مانجو",["جزر – بطاطس","عصير – حليب","شجرة – ورقة"],"التفاح والبرتقال والمانجو فواكه."]),
F(2,["CAMEL","Sheep – Goat",["Lion – Wolf","Sand – Tent","Eagle – Falcon"],"Camels, sheep and goats are animals that people raise."],["جمل","خروف – ماعز",["أسد – ذئب","رمل – خيمة","نسر – صقر"],"الجمل والخروف والماعز حيوانات يربيها الإنسان."]),
F(2,["RED","Green – Yellow",["Apple – Tomato","Paint – Brush","Big – Small"],"Red, green and yellow are colours."],["أحمر","أخضر – أصفر",["تفاح – طماطم","طلاء – فرشاة","كبير – صغير"],"الأحمر والأخضر والأصفر ألوان."]),
F(4,["RIYADH","Cairo – Amman",["Mecca – Medina","Nile – Euphrates","Egypt – Jordan"],"Riyadh, Cairo and Amman are capital cities. Mecca and Medina are cities, but not capitals."],["الرياض","القاهرة – عمّان",["مكة – المدينة","النيل – الفرات","مصر – الأردن"],"الرياض والقاهرة وعمّان عواصم. مكة والمدينة مدينتان لكنهما ليستا عاصمتين."]),
F(7,["ADDITION","Subtraction – Division",["Number – Digit","Ruler – Compass","Square – Circle"],"Addition, subtraction and division are arithmetic operations."],["الجمع","الطرح – القسمة",["عدد – رقم","مسطرة – فرجار","مربع – دائرة"],"الجمع والطرح والقسمة عمليات حسابية."])
]);
add(NB.BANKS.motive,[
F(1,["Lama waters the class plants every day without being asked. So Lama is …","helpful",["lazy","sleepy","angry"],"Doing a useful job without being asked shows she is helpful."],["تسقي لمى نباتات الفصل كل يوم دون أن يطلب منها أحد. إذن لمى …","متعاونة",["كسولة","نعسانة","غاضبة"],"القيام بعمل نافع دون طلب يدل على التعاون."]),
F(2,["Saad practises reading aloud every evening, even in the holidays. So Saad is …","hard-working",["bored","careless","shy"],"Practising every day, even in the holidays, shows hard work."],["يتدرّب سعد على القراءة بصوت عالٍ كل مساء حتى في الإجازات. إذن سعد …","مجتهد",["ملول","مهمل","خجول"],"التدرب كل يوم حتى في الإجازة يدل على الاجتهاد."]),
F(5,["Although she is afraid of heights, Dana climbed the ladder to help her little brother who was stuck on the roof. Dana showed …","courage",["laziness","pride","carelessness"],"Facing her fear to help someone is courage."],["مع أن دانة تخاف من المرتفعات، صعدت السُّلّم لتساعد أخاها الصغير العالق فوق السطح. أظهرت دانة …","الشجاعة",["الكسل","التكبّر","الإهمال"],"مواجهة خوفها لتساعد غيرها شجاعة."]),
F(8,["When two friends argue, Fahad listens carefully to both before he gives his opinion. Fahad is best described as …","fair-minded",["impatient","stubborn","careless"],"Hearing both sides first is a sign of fairness."],["عندما يختلف صديقان يستمع فهد إلى الاثنين بانتباه قبل أن يقول رأيه. أفضل وصف لفهد أنه …","منصف",["متعجّل","عنيد","مهمل"],"الاستماع للطرفين أولًا علامة الإنصاف."])
]);
})();
