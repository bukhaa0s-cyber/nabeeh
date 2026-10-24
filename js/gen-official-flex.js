/* Nabeeh — mental-flexibility item types seen in the official practice tests:
   unrealistic premises, word → pair of the same category, inferring what a person is like, shape → pair of the same kind,
   and everyday reasoning puzzles (rates, time zones, steady change, climbing out of a well).
   Non-verbal sections of the official English version are translations of the Arabic one, so these banks are written as parallel pairs. */
(function(){
"use strict";
const {rnd,pick,shuffle,tr,make,reg,bpick,person,svg,optSvg,shp,txt,INK,COLORS,nearNums}=NB;
const SEC="flex";
const F=(d,en,ar)=>({d,en,ar});

/* ================= 1. UNREALISTIC PREMISES ================= */
const UNREAL=[
F(1,["Snow is hot.|The sun is bright.|So snow is …","warm",["white","cold","bright"],"In this made-up world snow is hot, so it feels warm. What snow is like in real life does not count here."],
    ["الثلج حار.|الشمس مضيئة.|إذن الثلج …","دافئ",["أبيض","بارد","لامع"],"في هذا العالم الخيالي الثلج حار، فهو دافئ. ولا عبرة بما نعرفه عن الثلج في الواقع."]),
F(1,["Fish fly.|Birds sing.|So fish have …","wings",["fins","voices","gills"],"Anything that flies needs wings, so in this made-up world fish have wings."],
    ["الأسماك تطير.|العصافير تغرّد.|إذن للأسماك …","أجنحة",["زعانف","أصوات","خياشيم"],"ما يطير يحتاج إلى أجنحة، فللأسماك أجنحة في هذا العالم الخيالي."]),
F(1,["Ice is sweet.|Lemons are sour.|So ice tastes …","sugary",["sour","cold","salty"],"The made-up rule says ice is sweet, so it tastes sugary. The lemon sentence is there to distract you."],
    ["الجليد حلو.|الليمون حامض.|إذن طعم الجليد …","سكّري",["حامض","بارد","مالح"],"القاعدة الخيالية تقول إن الجليد حلو، فطعمه سكّري. وجملة الليمون للتشتيت فقط."]),
F(2,["Elephants are tiny.|Mice are grey.|So an elephant could hide in …","a matchbox",["a large barn","a football stadium","a wide river"],"If elephants are tiny, a very small place is enough to hide one."],
    ["الفيل صغير جدًّا.|الفأر رمادي.|إذن يستطيع الفيل أن يختبئ في …","علبة كبريت",["حظيرة واسعة","ملعب كرة","نهر عريض"],"إذا كان الفيل صغيرًا جدًّا كفاه مكان صغير جدًّا ليختبئ فيه."]),
F(2,["The moon shines at noon.|Stars shine at night.|So we see the moon …","during the day",["only at night","never","under the sea"],"The made-up rule puts the moon in the noon sky."],
    ["القمر يسطع ظهرًا.|النجوم تلمع ليلًا.|إذن نرى القمر …","في النهار",["في الليل فقط","أبدًا","تحت البحر"],"القاعدة الخيالية تجعل القمر في سماء الظهيرة."]),
F(3,["Books are eaten.|Bread is read.|So a library is a place to …","eat",["read","sleep","bake"],"A library is full of books, and in this made-up world books are eaten."],
    ["الكتب تُؤكل.|الخبز يُقرأ.|إذن المكتبة مكان لـ …","الأكل",["القراءة","النوم","الخَبز"],"المكتبة مليئة بالكتب، والكتب في هذا العالم الخيالي تُؤكل."]),
F(3,["Shoes are worn on the head.|Hats are worn on the feet.|So to protect his head from the sun, Ali wears …","his shoes",["his hat","his gloves","his socks"],"In the made-up world, the head is covered with shoes."],
    ["الحذاء يُلبس على الرأس.|القبعة تُلبس في القدم.|إذن يحمي علي رأسه من الشمس بـ …","حذائه",["قبعته","قفّازه","جوربه"],"في العالم الخيالي يُغطّى الرأس بالحذاء."]),
F(3,["Pencils cut.|Scissors write.|So to write a letter we need …","scissors",["a pencil","a ruler","glue"],"In this made-up world, scissors are what write."],
    ["القلم يقصّ.|المقص يكتب.|إذن لنكتب رسالة نحتاج إلى …","مقص",["قلم","مسطرة","صمغ"],"في هذا العالم الخيالي المقص هو الذي يكتب."]),
F(4,["Trees walk.|Rivers stand still.|So a forest can …","move to a new place",["flow like water","grow fruit","only stay where it is"],"A forest is made of trees, and these trees can walk."],
    ["الأشجار تمشي.|الأنهار ساكنة.|إذن الغابة تستطيع أن …","تنتقل إلى مكان آخر",["تجري كالماء","تُثمر","تبقى في مكانها فقط"],"الغابة أشجار، والأشجار هنا تمشي."]),
F(4,["Doctors bake bread.|Bakers cure illness.|So when Sami is ill, he visits …","the baker",["the doctor","the mechanic","the barber"],"Here it is the baker who cures illness."],
    ["الطبيب يخبز.|الخبّاز يعالج.|إذن عندما يمرض سامي يذهب إلى …","الخبّاز",["الطبيب","الميكانيكي","الحلّاق"],"هنا الخبّاز هو الذي يعالج المرضى."]),
F(5,["Salt is sweet.|Honey is bitter.|So to make tea sweeter, Mum adds …","salt",["honey","lemon","pepper"],"Only salt is sweet in this made-up world; honey has become bitter."],
    ["الملح حلو.|العسل مُرّ.|إذن لتحلية الشاي تضيف أمي …","الملح",["العسل","الليمون","الفلفل"],"الملح وحده حلو في هذا العالم الخيالي، أما العسل فصار مرًّا."]),
F(5,["Night is bright.|Day is dark.|So we switch the lights on at …","midday",["midnight","bedtime","no time at all"],"If the day is dark, lights are needed in the middle of the day."],
    ["الليل مضيء.|النهار مظلم.|إذن نُشعل المصابيح …","وقت الظهيرة",["منتصف الليل","وقت النوم","لا نشعلها أبدًا"],"إذا كان النهار مظلمًا احتجنا إلى المصابيح في وسط النهار."]),
F(5,["Feathers are heavy.|Stones are light.|So a strong wind blows away …","stones",["feathers","trees","houses"],"Wind carries light things, and here stones are the light ones."],
    ["الريش ثقيل.|الحجارة خفيفة.|إذن الريح القوية تحمل …","الحجارة",["الريش","الأشجار","البيوت"],"الريح تحمل الأشياء الخفيفة، والحجارة هنا هي الخفيفة."]),
F(6,["Mountains are lower than valleys.|Seas are deep.|So from the top of a mountain you look …","up at the valley",["down at the valley","out over the sea","down at the clouds"],"If valleys are higher than mountains, you must look up to see one."],
    ["الجبال أخفض من الأودية.|البحار عميقة.|إذن من قمة الجبل ننظر …","إلى أعلى نحو الوادي",["إلى أسفل نحو الوادي","إلى البحر","إلى الغيوم تحتنا"],"إذا كان الوادي أعلى من الجبل فلا بد أن ننظر إلى أعلى لنراه."]),
F(7,["Silence is loud.|Noise is quiet.|So a library is …","very loud",["very quiet","crowded","dark"],"A library is silent, and in this made-up world silence is loud."],
    ["الصمت صاخب.|الضجيج هادئ.|إذن المكتبة …","صاخبة جدًّا",["هادئة جدًّا","مزدحمة","مظلمة"],"المكتبة صامتة، والصمت في هذا العالم الخيالي صاخب."]),
F(7,["Adults are small.|Newborn babies are giants.|So a newborn needs …","a huge bed",["a tiny cradle","a walking stick","a school bag"],"A giant baby needs a very big bed."],
    ["الكبار صغار الحجم.|المواليد عمالقة.|إذن يحتاج المولود الجديد إلى …","سرير ضخم",["مهد صغير","عصا يتوكّأ عليها","حقيبة مدرسية"],"المولود العملاق يحتاج إلى سرير ضخم."]),
F(8,["Running makes people slower.|Resting makes people faster.|So to win a race, a runner should …","rest as much as possible",["run every day","eat more","buy new shoes"],"Follow the made-up rule: rest is what makes people fast."],
    ["الجري يُبطئ الناس.|الراحة تجعلهم أسرع.|إذن ليفوز العدّاء بالسباق عليه أن …","يرتاح أكثر ما يمكن",["يجري كل يوم","يأكل أكثر","يشتري حذاءً جديدًا"],"اتبع القاعدة الخيالية: الراحة هي التي تجعل الناس أسرع."]),
F(8,["Heat makes things shrink.|Cold makes things grow.|So a balloon left in the hot sun becomes …","smaller",["bigger","colder","heavier"],"In this made-up world, heat shrinks things."],
    ["الحرارة تُصغّر الأشياء.|البرودة تُكبّرها.|إذن البالون المتروك في الشمس الحارة يصبح …","أصغر",["أكبر","أبرد","أثقل"],"في هذا العالم الخيالي الحرارة تصغّر الأشياء."]),
F(9,["Every square is round.|Every circle has corners.|So a square table …","has no corners",["has four corners","has three corners","cannot be used"],"Round things have no corners, and here every square is round."],
    ["كل مربع مستدير.|كل دائرة لها زوايا.|إذن الطاولة المربعة …","ليس لها زوايا",["لها أربع زوايا","لها ثلاث زوايا","لا يمكن استخدامها"],"الشيء المستدير لا زوايا له، وكل مربع هنا مستدير."]),
F(9,["Days are made of weeks.|Weeks are made of months.|So the shortest of these is a …","month",["day","week","year"],"A day contains weeks, so a week is shorter than a day; a week contains months, so a month is shorter still."],
    ["الأيام تتكوّن من أسابيع.|الأسابيع تتكوّن من شهور.|إذن أقصر هذه المدد هو …","الشهر",["اليوم","الأسبوع","السنة"],"اليوم يحوي أسابيع فالأسبوع أقصر منه، والأسبوع يحوي شهورًا فالشهر أقصر من الأسبوع."])
];
function genUnreal(d,L,opts){
  const {item,id}=bpick(UNREAL,d,opts,2),r=item[L==="ar"?"ar":"en"],T=tr(L);
  const lines=r[0].split("|");
  const p=T("This question starts with something that is <b>not true in real life</b>. Choose the answer that fits it.","يبدأ السؤال بمقدمة <b>غير واقعية</b>. اختر الإجابة التي تتناسب معها.")+
    `<div class="premise">${lines.map(l=>`<div>${l}</div>`).join("")}</div>`;
  return make(SEC,p,null,r[1],r[2],r[3],"text","unr:"+id);
}
reg("unreal",SEC,genUnreal,{en:"Unrealistic premises",ar:"المقدمات غير الواقعية",min:1,max:9,bank:true});

/* ================= 2. WORD → PAIR OF THE SAME CATEGORY ================= */
const CAT=[
F(1,["CARROT","Potato – Onion",["Apple – Banana","Spoon – Plate","Rose – Tulip"],"Carrots, potatoes and onions are all vegetables."],["جزر","بطاطس – بصل",["تفاح – موز","ملعقة – صحن","ورد – ياسمين"],"الجزر والبطاطس والبصل كلها خضروات."]),
F(1,["SPARROW","Pigeon – Eagle",["Bee – Butterfly","Cat – Dog","Nest – Egg"],"All three are birds. Bees and butterflies fly too, but they are insects."],["عصفور","حمامة – صقر",["نحلة – فراشة","قطة – كلب","عش – بيضة"],"الثلاثة طيور. النحلة والفراشة تطيران أيضًا لكنهما حشرتان."]),
F(1,["HAMMER","Saw – Screwdriver",["Nail – Wood","Pen – Pencil","Carpenter – Builder"],"Hammers, saws and screwdrivers are tools."],["مطرقة","منشار – مفكّ",["مسمار – خشب","قلم – ممحاة","نجّار – بنّاء"],"المطرقة والمنشار والمفك كلها أدوات."]),
F(2,["SHIRT","Trousers – Jacket",["Cotton – Wool","Needle – Thread","Ring – Watch"],"All three are clothes. Cotton and wool are what clothes are made of."],["قميص","بنطال – سترة",["قطن – صوف","إبرة – خيط","خاتم – ساعة"],"الثلاثة ملابس، أما القطن والصوف فمواد تُصنع منها الملابس."]),
F(2,["MILK","Juice – Water",["Cow – Goat","Cup – Glass","Bread – Cheese"],"Milk, juice and water are drinks."],["حليب","عصير – ماء",["بقرة – ماعز","كوب – فنجان","خبز – جبن"],"الحليب والعصير والماء مشروبات."]),
F(3,["SQUARE","Rectangle – Rhombus",["Circle – Oval","Cube – Box","Line – Point"],"All are flat shapes with four sides. A cube is solid, not flat."],["مربع","مستطيل – معيّن",["دائرة – شكل بيضاوي","مكعب – صندوق","خط – نقطة"],"كلها أشكال مستوية لها أربعة أضلاع، أما المكعب فمجسّم."]),
F(3,["JUPITER","Mars – Venus",["Moon – Sun","Rocket – Telescope","Comet – Star"],"Jupiter, Mars and Venus are planets."],["المشتري","المريخ – الزهرة",["القمر – الشمس","صاروخ – منظار","مذنّب – نجم"],"المشتري والمريخ والزهرة كواكب."]),
F(3,["DOCTOR","Nurse – Pharmacist",["Hospital – Clinic","Medicine – Bandage","Patient – Visitor"],"All three are health workers. The other pairs are places, things or people who are not health workers."],["طبيب","ممرّض – صيدلي",["مستشفى – عيادة","دواء – ضماد","مريض – زائر"],"الثلاثة يعملون في الرعاية الصحية، أما الأزواج الأخرى فأماكن أو أشياء أو أشخاص لا يعملون فيها."]),
F(4,["COPPER","Iron – Silver",["Wood – Plastic","Gold – Diamond","Wire – Coin"],"Copper, iron and silver are metals. Gold is a metal but a diamond is not."],["نحاس","حديد – فضة",["خشب – بلاستيك","ذهب – ألماس","سلك – عملة"],"النحاس والحديد والفضة فلزّات. الذهب فلزّ لكن الألماس ليس كذلك."]),
F(5,["WHALE","Dolphin – Seal",["Shark – Tuna","Octopus – Crab","Lion – Tiger"],"Whales, dolphins and seals are sea mammals. Sharks and tuna live in the sea but are fish."],["حوت","دلفين – فقمة",["قرش – تونة","أخطبوط – سلطعون","أسد – نمر"],"الحوت والدلفين والفقمة ثدييات بحرية. القرش والتونة يعيشان في البحر لكنهما سمك."]),
F(5,["TRAIN","Bus – Tram",["Ship – Boat","Plane – Helicopter","Road – Railway"],"All three carry people on land."],["قطار","حافلة – ترام",["سفينة – قارب","طائرة – مروحية","طريق – سكة حديد"],"الثلاثة وسائل نقل برية."]),
F(6,["OXYGEN","Nitrogen – Hydrogen",["Water – Juice","Iron – Copper","Air – Wind"],"Oxygen, nitrogen and hydrogen are gases. Air is a mixture of gases, and wind is moving air."],["أكسجين","نيتروجين – هيدروجين",["ماء – عصير","حديد – نحاس","هواء – ريح"],"الأكسجين والنيتروجين والهيدروجين غازات. الهواء خليط من الغازات، والريح هواء متحرك."]),
F(6,["HEART","Lungs – Liver",["Blood – Sweat","Arm – Leg","Doctor – Nurse"],"All three are organs inside the body."],["قلب","رئتان – كبد",["دم – عرق","ذراع – ساق","طبيب – ممرّض"],"الثلاثة أعضاء داخل الجسم."]),
F(6,["EARTHQUAKE","Flood – Volcano",["Rain – Snow","Map – Compass","Storm – Breeze"],"All three are natural disasters. A breeze is not a disaster."],["زلزال","فيضان – بركان",["مطر – ثلج","خريطة – بوصلة","عاصفة – نسيم"],"الثلاثة كوارث طبيعية، والنسيم ليس كارثة."]),
F(7,["TRIANGLE","Pentagon – Hexagon",["Circle – Semicircle","Pyramid – Cube","Angle – Side"],"All three are flat shapes with straight sides (polygons)."],["مثلث","مخمّس – مسدّس",["دائرة – نصف دائرة","هرم – مكعب","زاوية – ضلع"],"الثلاثة أشكال مستوية أضلاعها مستقيمة (مضلّعات)."]),
F(7,["CENTIMETRE","Metre – Kilometre",["Kilogram – Gram","Ruler – Tape measure","Hour – Minute"],"All three are units of length."],["سنتيمتر","متر – كيلومتر",["كيلوجرام – جرام","مسطرة – شريط قياس","ساعة – دقيقة"],"الثلاثة وحدات لقياس الطول."]),
F(8,["THERMOMETER","Barometer – Scale",["Temperature – Weight","Hammer – Wrench","Fever – Flu"],"All three are instruments that measure something."],["ميزان حرارة","بارومتر – ميزان",["حرارة – وزن","مطرقة – مفتاح ربط","حمّى – زكام"],"الثلاثة أدوات للقياس."]),
F(8,["COURAGE","Honesty – Patience",["Fear – Anger","Hero – Soldier","Strong – Fast"],"All three are good qualities (virtues)."],["شجاعة","أمانة – صبر",["خوف – غضب","بطل – جندي","قوي – سريع"],"الثلاثة فضائل وصفات حسنة."]),
F(9,["NOUN","Verb – Adjective",["Sentence – Paragraph","Comma – Full stop","Book – Story"],"All three are kinds of words (parts of speech)."],["اسم","فعل – حرف",["جملة – فقرة","فاصلة – نقطة","كتاب – قصة"],"الاسم والفعل والحرف أقسام الكلام."]),
F(9,["PHOTOSYNTHESIS","Respiration – Digestion",["Leaf – Root","Sunlight – Water","Oxygen – Sugar"],"All three are life processes. The other pairs are parts or materials."],["البناء الضوئي","التنفّس – الهضم",["ورقة – جذر","ضوء الشمس – ماء","أكسجين – سكر"],"الثلاثة عمليات حيوية، أما الأزواج الأخرى فأجزاء أو مواد."])
];
function genCatPair(d,L,opts){
  const {item,id}=bpick(CAT,d,opts,2),r=item[L==="ar"?"ar":"en"],T=tr(L);
  const p=T("One word is followed by four pairs of words. Choose the pair that belongs to the <b>same category</b> as the word.","في السؤال كلمة يتبعها أربعة أزواج من الكلمات. اختر الزوج الذي يتناسب معها <b>من حيث الفئة</b>.")+`<div class="headword">${r[0]}</div>`;
  return make(SEC,p,null,r[1],r[2],r[3],"text","cat:"+id);
}
reg("catPair",SEC,genCatPair,{en:"Word and category pairs",ar:"الكلمة والزوج المناسب",min:1,max:9,bank:true});

/* ================= 3. WHAT IS THIS PERSON LIKE? ================= */
const MOTIVE=[
F(1,["Sami always shares his lunch with friends who forget theirs. So Sami is …","kind",["hungry","lazy","rich"],"Sharing food with friends shows kindness."],["يشارك سامي طعامه دائمًا مع أصدقائه الذين ينسون طعامهم. إذن سامي …","كريم",["جائع","كسول","ثري"],"مشاركة الطعام مع الأصدقاء تدل على الكرم."]),
F(2,["Hessa reads about planets every night and asked for a telescope for her birthday. So Hessa …","is interested in space",["wants to be a chef","dislikes the night","is afraid of the dark"],"Reading about planets and wanting a telescope show an interest in space."],["تقرأ حصة عن الكواكب كل ليلة، وطلبت منظارًا فلكيًّا هدية في يوم ميلادها. إذن حصة …","تهتم بالفضاء",["تريد أن تكون طاهية","لا تحب الليل","تخاف من الظلام"],"القراءة عن الكواكب وطلب المنظار يدلان على الاهتمام بالفضاء."]),
F(2,["Badr chooses to study in the library with his classmates rather than alone in his room. So Badr …","likes studying with others",["has no books","dislikes his classmates","never studies"],"He picks studying with classmates over studying alone."],["يختار بدر أن يذاكر في المكتبة مع زملائه بدلًا من المذاكرة وحده في غرفته. إذن بدر …","يحب المذاكرة مع الآخرين",["لا يملك كتبًا","لا يحب زملاءه","لا يذاكر أبدًا"],"اختار المذاكرة مع زملائه على المذاكرة وحده."]),
F(3,["Whenever it rains, Turki puts on his boots and runs outside to jump in the puddles. So Turki …","enjoys playing in the rain",["is scared of rain","needs new boots","wants to stay dry"],"Running out to jump in puddles shows he enjoys the rain."],["كلما نزل المطر لبس تركي حذاءه الطويل وخرج يقفز في البرك. إذن تركي …","يستمتع باللعب في المطر",["يخاف من المطر","يحتاج إلى حذاء جديد","يريد أن يبقى جافًّا"],"الخروج للقفز في البرك يدل على الاستمتاع بالمطر."]),
F(4,["Maha checks every answer twice before she hands in a test. So Maha …","is careful",["reads slowly","does not know the answers","dislikes tests"],"Checking answers twice is a sign of care."],["تراجع مها كل إجابة مرتين قبل أن تسلّم الاختبار. إذن مها …","حريصة",["بطيئة في القراءة","لا تعرف الإجابات","لا تحب الاختبارات"],"مراجعة الإجابات مرتين تدل على الحرص."]),
F(5,["Fahad offered to show a new student around the school, even though it made him late for lunch. This shows that Fahad …","puts helping others before his own comfort",["dislikes lunch","does not know the school","likes being late"],"He gave up his own time to help someone new."],["عرض فهد أن يرافق طالبًا جديدًا في جولة بالمدرسة، مع أن ذلك أخّره عن الغداء. يدل ذلك على أن فهدًا …","يقدّم مساعدة الآخرين على راحته",["لا يحب الغداء","لا يعرف المدرسة","يحب التأخّر"],"تنازل عن وقته ليساعد شخصًا جديدًا."]),
F(6,["After winning first prize, Jana spent the evening helping her friend prepare for the next round. Jana is most likely …","supportive and modest",["jealous","boastful","bored of competitions"],"Helping a friend instead of celebrating herself shows support and modesty."],["بعد أن فازت جنى بالمركز الأول قضت المساء تساعد صديقتها على الاستعداد للجولة التالية. جنى على الأرجح …","متعاونة ومتواضعة",["غيورة","متفاخرة","ملّت المسابقات"],"مساعدة الصديقة بدل الاحتفال بنفسها تدل على التعاون والتواضع."]),
F(7,["Nawaf spends his weekends repairing old radios that people throw away, then sells them cheaply. Which describes him best?","resourceful and practical",["wasteful","careless with tools","uninterested in machines"],"He turns things others throw away into something useful."],["يقضي نواف عطلته في إصلاح أجهزة الراديو القديمة التي يرميها الناس، ثم يبيعها بسعر زهيد. أي وصف يناسبه أكثر؟","مبدع وعملي",["مسرف","مهمل في أدواته","لا يهتم بالآلات"],"يحوّل ما يرميه الآخرون إلى شيء نافع."]),
F(8,["Reem always asks \"why?\" when her teacher explains a rule, and she looks for examples that might break it. Reem is best described as …","curious and thoughtful",["rude and lazy","forgetful","uninterested"],"Asking why and testing a rule are signs of a curious, thinking mind."],["تسأل ريم دائمًا \"لماذا؟\" عندما تشرح المعلمة قاعدة، وتبحث عن أمثلة قد لا تنطبق عليها القاعدة. أفضل وصف لريم أنها …","محبّة للاستطلاع وتفكّر بعمق",["وقحة وكسولة","كثيرة النسيان","غير مهتمة"],"السؤال عن السبب واختبار القاعدة دليل على حب الاستطلاع والتفكير."]),
F(9,["Omar keeps a notebook of every mistake he makes in maths and reviews it every week. This suggests that Omar believes …","mistakes are a chance to learn",["mistakes should be hidden","maths cannot be learned","notebooks are for drawing"],"Reviewing mistakes regularly means he learns from them."],["يدوّن عمر كل خطأ يقع فيه في الرياضيات في دفتر، ويراجعه كل أسبوع. يدل ذلك على أن عمر يرى أن …","الأخطاء فرصة للتعلّم",["الأخطاء يجب إخفاؤها","الرياضيات لا يمكن تعلّمها","الدفاتر للرسم فقط"],"مراجعة الأخطاء باستمرار تعني أنه يتعلم منها."])
];
function genMotive(d,L,opts){
  const {item,id}=bpick(MOTIVE,d,opts,3),r=item[L==="ar"?"ar":"en"];
  return make(SEC,r[0],null,r[1],r[2],r[3],"text","mot:"+id);
}
reg("motive",SEC,genMotive,{en:"Understanding people",ar:"استنتاج الصفات",min:1,max:9,bank:true});

/* ================= 4. SHAPE → PAIR OF THE SAME KIND (pictures) =================
   Each shape has features; the right pair shares the target feature with the head shape, every wrong pair breaks it. */
const SH=[
 {k:"tri",sides:3,curved:false,draw:(c)=>shp("triangle",c,40,42,26)},
 {k:"sq",sides:4,curved:false,draw:(c)=>shp("square",c,40,40,22)},
 {k:"dia",sides:4,curved:false,draw:(c)=>shp("diamond",c,40,40,28)},
 {k:"rect",sides:4,curved:false,draw:(c)=>`<rect x="14" y="26" width="52" height="28" rx="2" fill="${c}"/>`},
 {k:"pent",sides:5,curved:false,draw:(c)=>poly(5,c)},
 {k:"hex",sides:6,curved:false,draw:(c)=>poly(6,c)},
 {k:"circ",sides:0,curved:true,draw:(c)=>shp("circle",c,40,40,26)},
 {k:"oval",sides:0,curved:true,draw:(c)=>`<ellipse cx="40" cy="40" rx="30" ry="18" fill="${c}"/>`},
 {k:"semi",sides:1,curved:true,draw:(c)=>`<path d="M12,50 A28,28 0 0 1 68,50 Z" fill="${c}"/>`},
 {k:"star",sides:10,curved:false,draw:(c)=>shp("star",c,40,42,28)}
];
function poly(n,c){let p=[];for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;p.push((40+27*Math.cos(a)).toFixed(1)+","+(42+27*Math.sin(a)).toFixed(1));}return `<polygon points="${p.join(" ")}" fill="${c}"/>`;}
function pairSvg(a,b,ca,cb){return svg(140,70,`<g transform="scale(.85) translate(2,0)">${a.draw(ca)}</g><g transform="translate(70,0) scale(.85)">${b.draw(cb)}</g>`,"pair","",)}
function genShapePair(d,L){
  const T=tr(L),col=()=>pick(COLORS).c;
  const rules=[
    {id:"curved",test:s=>s.curved,en:"made with a curved line",ar:"مرسومة بخط منحنٍ"},
    {id:"straight",test:s=>!s.curved,en:"made only of straight lines",ar:"مرسومة بخطوط مستقيمة فقط"},
    {id:"four",test:s=>s.sides===4,en:"four-sided",ar:"لها أربعة أضلاع"}
  ];
  if(d>=4)rules.push({id:"many",test:s=>!s.curved&&s.sides>=5,en:"made of five or more straight sides",ar:"لها خمسة أضلاع مستقيمة أو أكثر"});
  const r=pick(rules),yes=SH.filter(r.test),no=SH.filter(s=>!r.test(s));
  const head=pick(yes),pool=shuffle(yes.filter(s=>s!==head));
  if(pool.length<2)return genShapePair(d,L);
  const right=[pool[0],pool[1]];
  const wrongs=[],seen=new Set();let guard=0;
  while(wrongs.length<3&&guard++<200){
    const a=pick(no),b=Math.random()<.5?pick(no):pick(yes.filter(s=>s!==head));
    /* reject a pair that would match the head shape under ANY of the rules, so only one answer can be defended */
    if(rules.some(R=>R.test(head)&&R.test(a)&&R.test(b)))continue;
    const sig=[a.k,b.k].sort().join("+");if(seen.has(sig))continue;seen.add(sig);
    wrongs.push(pairSvg(a,b,col(),col()));
  }
  if(wrongs.length<3)return genShapePair(d,L);
  const headSvg=svg(80,80,head.draw(col()),"shape","vis",110);
  return make(SEC,T("Look at the shape. Which pair of shapes belongs to the <b>same kind</b> as it?","انظر إلى الشكل. أي زوج من الأشكال يتناسب معه <b>من حيث الفئة</b>؟"),headSvg,pairSvg(right[0],right[1],col(),col()),wrongs,
    T(`The shape is ${r.en}, and both shapes in the right pair are ${r.en} too. Every other pair has at least one shape that is not.`,`الشكل ${r.ar}، وشكلا الزوج الصحيح كلاهما كذلك. أما كل زوج آخر ففيه شكل واحد على الأقل ليس كذلك.`),"svg");
}
reg("shapePair",SEC,genShapePair,{en:"Shape and category pairs",ar:"الشكل والزوج المناسب",min:2,max:9});

NB.BANKS=NB.BANKS||{};Object.assign(NB.BANKS,{unreal:UNREAL,cat:CAT,motive:MOTIVE});

/* ================= 5. EVERYDAY REASONING PUZZLES (generated, both languages) ================= */
const num=n=>String(n);
function hm(mins,L){const h=Math.floor(mins/60)%24,m=mins%60;return `${h}:${String(m).padStart(2,"0")}`;}
function genRate(d,L){
  const T=tr(L),start=rnd(5,9)*60,s=rnd(d<=3?10:5,d<=3?15:18),rise=pick(d<=3?[1,2]:[1,2,3]),every=pick(d<=3?[30,60]:[15,20,30]),steps=rnd(3,d<=3?5:8),target=s+rise*steps;
  const ans=start+steps*every,cand=[ans-every,ans+every,ans+2*every,ans-2*every].filter(x=>x>start);
  const th=`<rect x="34" y="8" width="16" height="104" rx="8" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="42" cy="120" r="14" fill="#E2457A"/><rect x="38" y="${108-s*2.5}" width="8" height="${s*2.5+6}" fill="#E2457A"/>`+txt(80,60,18,`${s}°`,{a:"start"});
  return make(SEC,T(`At ${hm(start)} in the morning the thermometer shows ${s}°. The temperature rises ${rise}° every ${every} minutes. At what time will it reach ${target}°?`,`عند الساعة ${hm(start)} صباحًا يشير ميزان الحرارة إلى ${s}°، وترتفع الحرارة ${rise}° كل ${every} دقيقة. متى تصل الحرارة إلى ${target}°؟`),
    svg(130,140,th,"thermometer","vis",120),hm(ans),shuffle(cand).slice(0,3).map(x=>hm(x)),
    T(`It must rise ${target-s}°, which is ${steps} steps of ${rise}°. ${steps} × ${every} = ${steps*every} minutes after ${hm(start)} → ${hm(ans)}.`,`يجب أن ترتفع ${target-s}°، أي ${steps} مرات بمقدار ${rise}°. ${steps} × ${every} = ${steps*every} دقيقة بعد ${hm(start)} ← ${hm(ans)}.`));
}
reg("rate",SEC,genRate,{en:"Steady change over time",ar:"التغيّر المنتظم مع الزمن",min:3,max:9});

/* Arabic count of metres: 1 مترًا واحدًا, 2 مترين, 3–10 أمتار, 11+ مترًا */
const arD=n=>n===1?"يوم واحد":n===2?"يومين":(n>=3&&n<=10)?`${n} أيام`:`${n} يومًا`;
const arM=n=>n===1?"مترًا واحدًا":n===2?"مترين":(n>=3&&n<=10)?`${n} أمتار`:`${n} مترًا`;
function genWell(d,L){
  const T=tr(L),up=rnd(2,d>=7?5:3),down=rnd(1,up-1),depth=rnd(d>=7?18:8,d>=7?40:16);
  const ans=Math.ceil((depth-up)/(up-down))+1,naive=Math.ceil(depth/(up-down));
  const an=pick([{en:"snail",ar:"حلزون",f:false},{en:"lizard",ar:"سحلية",f:true},{en:"beetle",ar:"خنفساء",f:true}]),v=(m,f)=>an.f?f:m;
  const wr=nearNums(ans,[naive,naive+1,ans-1,ans+1,ans+2],{min:1});
  return make(SEC,T(`A ${an.en} is at the bottom of a well ${depth} metres deep. Every day it climbs ${up} metres, and every night it slides back ${down} metre${down>1?"s":""}. On which day does it reach the top?`,`${v("يوجد","توجد")} ${an.ar} في قاع بئر عمقها ${arM(depth)}. ${v("يصعد","تصعد")} كل نهار ${arM(up)}، ${v("وينزلق","وتنزلق")} كل ليلة ${arM(down)}. في أي يوم ${v("يصل","تصل")} إلى أعلى البئر؟`),null,
    num(ans),wr.map(num),
    T(`Each full day and night it gains ${up-down} m. Once it is within ${up} m of the top it climbs out during the day without sliding back: (${depth} − ${up}) ÷ ${up-down} = ${(depth-up)/(up-down)} → after ${ans-1} days it is ${(ans-1)*(up-down)} m up, and on day ${ans} it climbs out.`,`يتقدم كل يوم وليلة ${up-down} م. وعندما يصير على بُعد ${up} م من الأعلى يخرج نهارًا دون أن ينزلق: (${depth} − ${up}) ÷ ${up-down} = ${(depth-up)/(up-down)} ← بعد ${arD(ans-1)} يكون على ارتفاع ${(ans-1)*(up-down)} م، وفي اليوم ${ans} يخرج.`));
}
reg("well",SEC,genWell,{en:"Climbing puzzles",ar:"ألغاز الصعود",min:4,max:9});

function genDecline(d,L){
  const T=tr(L),total=pick([20,30,40,50,60,80,100]),pct=pick([5,10,20,25].filter(p=>total*p%100===0)),per=total*pct/100,days=rnd(2,Math.min(8,Math.floor(total/per)-1)),left=total-per*days;
  const what=pick([{en:"students on the bus",ar:"طلاب الحافلة"},{en:"people at the club",ar:"أعضاء النادي الحاضرين"},{en:"visitors to the park",ar:"زوار الحديقة"}]);
  const dayName=n=>L==="ar"?["","الأول","الثاني","الثالث","الرابع","الخامس","السادس","السابع","الثامن","التاسع","العاشر"][n]||String(n):(["","first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth"][n]||n+"th");
  const wr=[days-1,days+1,days+2].filter(x=>x>0&&x<=10);
  return make(SEC,T(`There are usually ${total} ${what.en}. Starting tomorrow, the number falls each day by ${pct}% of the usual ${total}. On which day will there be ${left}?`,`عدد ${what.ar} عادةً ${total}. ابتداءً من الغد يقل العدد كل يوم بمقدار ${pct}٪ من العدد الأصلي ${total}. في أي يوم يصبح العدد ${left}؟`),null,
    T(`The ${dayName(days)} day`,`اليوم ${dayName(days)}`),wr.map(x=>T(`The ${dayName(x)} day`,`اليوم ${dayName(x)}`)),
    T(`${pct}% of ${total} is ${per}, so ${per} fewer each day. ${total} − ${left} = ${total-left}, and ${total-left} ÷ ${per} = ${days} days.`,`${pct}٪ من ${total} = ${per}، فيقل العدد ${per} كل يوم. ${total} − ${left} = ${total-left}، و${total-left} ÷ ${per} = ${days}، أي بعد ${arD(days)}.`));
}
reg("decline",SEC,genDecline,{en:"Percentage change",ar:"التغيّر بالنسبة المئوية",min:6,max:9});

/* Time zones: only cities with no daylight-saving changes, so the difference from Riyadh (UTC+3) is always the same. */
const CITIES=[{en:"Tokyo",ar:"طوكيو",o:6},{en:"Seoul",ar:"سيول",o:6},{en:"Beijing",ar:"بكين",o:5},{en:"Jakarta",ar:"جاكرتا",o:4},{en:"Bangkok",ar:"بانكوك",o:4},{en:"Karachi",ar:"كراتشي",o:2},{en:"Abu Dhabi",ar:"أبوظبي",o:1},{en:"Nairobi",ar:"نيروبي",o:0},{en:"Accra",ar:"أكرا",o:-3},{en:"Brasília",ar:"برازيليا",o:-6},{en:"Buenos Aires",ar:"بوينس آيرس",o:-6}];
function genTimeZone(d,L){
  const T=tr(L);
  if(d<=7||Math.random()<.5){
    const c=pick(CITIES.filter(x=>x.o!==0)),h=rnd(8,16),t=((h+c.o)%24+24)%24;
    const fmt=x=>`${x}:00`,wr=[((h-c.o)%24+24)%24,(t+1)%24,(t+23)%24,h].filter(x=>x!==t);
    return make(SEC,T(`${c.en} is ${Math.abs(c.o)} hour${Math.abs(c.o)>1?"s":""} ${c.o>0?"ahead of":"behind"} Riyadh. When it is ${h}:00 in Riyadh, what time is it in ${c.en}?`,`التوقيت في ${c.ar} ${c.o>0?"يسبق":"يتأخر عن"} توقيت الرياض بـ ${Math.abs(c.o)} ${Math.abs(c.o)===1?"ساعة":Math.abs(c.o)===2?"ساعتين":"ساعات"}. إذا كانت الساعة ${h}:00 في الرياض، فكم الساعة في ${c.ar}؟`),null,
      fmt(t),[...new Set(wr)].slice(0,3).map(fmt),
      T(`${h} ${c.o>0?"+":"−"} ${Math.abs(c.o)} = ${t}:00.`,`${h} ${c.o>0?"+":"−"} ${Math.abs(c.o)} = ${t}:00.`));
  }
  /* reasoning: lunch in Riyadh vs dinner / breakfast abroad */
  const late=Math.random()<.5,who=person(L),v=who.v,pool=late?CITIES.filter(x=>x.o>=4):CITIES.filter(x=>x.o<=-6),c=pick(pool),near=shuffle(CITIES.filter(x=>Math.abs(x.o)<=2)).slice(0,3);
  const arQ=`الوقت وقت الغداء في الرياض. ${v("اتصل","اتصلت")} ${who.name} من خارج المملكة ${v("وقال إنه","وقالت إنها")} ${late?v("انتهى من العشاء قبل قليل","انتهت من العشاء قبل قليل"):v("استيقظ للتو لتناول الفطور","استيقظت للتو لتناول الفطور")}. في أي المدن ${v("يُرجَّح أنه موجود","يُرجَّح أنها موجودة")}؟`;
  return make(SEC,T(`It is lunchtime in Riyadh. ${who.name} phones from abroad and says ${who.he} has ${late?"just finished dinner":"just woken up for breakfast"}. Which city is ${who.he} most likely in?`,arQ),null,
    c[L==="ar"?"ar":"en"],near.map(x=>x[L==="ar"?"ar":"en"]),
    late?T(`Dinner at Riyadh's lunchtime means a city several hours ahead (further east). ${c.en} is ${c.o} hours ahead; the other cities are no more than 2 hours from Riyadh's time.`,`العشاء وقت غداء الرياض يعني مدينة تسبق الرياض بعدة ساعات (أبعد شرقًا). ${c.ar} تسبق الرياض بـ ${c.o} ساعات، أما المدن الأخرى فلا يزيد فرقها عن ساعتين.`)
        :T(`Breakfast at Riyadh's lunchtime means a city several hours behind (further west). ${c.en} is ${-c.o} hours behind; the other cities are no more than 2 hours from Riyadh's time.`,`الفطور وقت غداء الرياض يعني مدينة تتأخر عن الرياض بعدة ساعات (أبعد غربًا). ${c.ar} تتأخر عن الرياض ${-c.o} ساعات، أما المدن الأخرى فلا يزيد فرقها عن ساعتين.`));
}
reg("timeZone",SEC,genTimeZone,{en:"Time zones",ar:"فروق التوقيت",min:6,max:9});
})();
