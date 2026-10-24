/* Nabeeh — Verbal reasoning & reading, ENGLISH version (written natively, not translated).
   Also holds the logic generators (ordering, syllogisms) used by both languages. */
(function(){
"use strict";
const {rnd,pick,shuffle,tr,make,reg,bpick,people}=NB;
const SEC="verbal";

/* ================= ANALOGIES =================
   [d, relation, a, b, c, answer, [wrong words], why]
   relation tags keep pair-style distractors from sharing the right relation. Symmetric tags: opp, syn */
const AN=[
[1,"young","Puppy","Dog","Kitten","Cat",["Mouse","Milk","Lion"],"A puppy is a baby dog, and a kitten is a baby cat."],
[1,"young","Calf","Cow","Lamb","Sheep",["Grass","Wool","Goat"],"A calf is a baby cow; a lamb is a baby sheep."],
[1,"young","Chick","Hen","Cub","Lion",["Tiger","Den","Egg"],"A chick is a baby hen; a cub is a baby lion."],
[1,"home","Bird","Nest","Bee","Hive",["Honey","Flower","Tree"],"A bird lives in a nest; a bee lives in a hive."],
[1,"opp","Hot","Cold","Up","Down",["High","Sky","Left"],"These are opposites."],
[1,"opp","Day","Night","Big","Small",["Large","Tall","Long"],"These are opposites."],
[1,"opp","Happy","Sad","Fast","Slow",["Quick","Run","Car"],"These are opposites."],
[1,"worn","Glove","Hand","Sock","Foot",["Shoe","Leg","Warm"],"A glove is worn on the hand; a sock is worn on the foot."],
[1,"worn","Hat","Head","Ring","Finger",["Gold","Hand","Necklace"],"A hat is worn on the head; a ring is worn on a finger."],
[1,"tool","Pen","Write","Knife","Cut",["Fork","Sharp","Cook"],"A pen is used to write; a knife is used to cut."],
[1,"part","Wheel","Car","Page","Book",["Read","Pen","Library"],"A wheel is part of a car; a page is part of a book."],
[1,"product","Cow","Milk","Hen","Eggs",["Farm","Chick","Corn"],"A cow gives us milk; a hen gives us eggs."],
[1,"sense","Eye","See","Ear","Hear",["Nose","Sound","Head"],"We see with our eyes and hear with our ears."],
[1,"kind","Apple","Fruit","Carrot","Vegetable",["Orange","Rabbit","Juice"],"An apple is a kind of fruit; a carrot is a kind of vegetable."],
[1,"sound","Lion","Roar","Dog","Bark",["Bone","Tail","Meow"],"This is the sound each animal makes."],
[1,"move","Fish","Swim","Bird","Fly",["Feather","Sing","Tree"],"This is how each animal moves."],
[2,"place","Teacher","School","Doctor","Hospital",["Nurse","Medicine","Sick"],"This is where each person works."],
[2,"place","Chef","Kitchen","Farmer","Farm",["Tractor","Cow","Food"],"This is where each person works."],
[2,"worker","Hammer","Carpenter","Brush","Painter",["Paint","Wall","Colour"],"Each tool is used by that worker."],
[2,"part","Petal","Flower","Leaf","Tree",["Green","Garden","Branch"],"A petal is part of a flower; a leaf is part of a tree."],
[2,"part","Finger","Hand","Toe","Foot",["Nail","Leg","Shoe"],"A finger is part of a hand; a toe is part of a foot."],
[2,"time","Minute","Hour","Day","Week",["Night","Clock","Second"],"60 minutes make an hour; 7 days make a week."],
[2,"grow","Caterpillar","Butterfly","Tadpole","Frog",["Fish","Pond","Egg"],"A caterpillar grows into a butterfly; a tadpole grows into a frog."],
[2,"measure","Ruler","Length","Clock","Time",["Wall","Number","Watch"],"A ruler measures length; a clock measures time."],
[2,"keeps","Library","Books","Zoo","Animals",["Cage","Keeper","Ticket"],"A library keeps books; a zoo keeps animals."],
[2,"feel","Happy","Smile","Sad","Cry",["Laugh","Face","Party"],"When happy we smile; when sad we cry."],
[2,"room","Kitchen","Cook","Bedroom","Sleep",["Bed","Pillow","Eat"],"This is what we do in each room."],
[2,"home","Spider","Web","Horse","Stable",["Saddle","Hay","Barn owl"],"A spider lives in a web; a horse lives in a stable."],
[2,"sound","Duck","Quack","Horse","Neigh",["Hoof","Gallop","Moo"],"This is the sound each animal makes."],
[3,"measure","Thermometer","Temperature","Scale","Weight",["Kitchen","Heavy","Number"],"Each tool measures that thing."],
[3,"group","Herd","Cows","Flock","Sheep",["Wool","Field","Shepherd"],"A herd is a group of cows; a flock is a group of sheep."],
[3,"creator","Author","Book","Baker","Bread",["Oven","Flour","Shop"],"An author makes books; a baker makes bread."],
[3,"grow","Seed","Plant","Egg","Bird",["Nest","Shell","Yellow"],"The first grows into the second."],
[3,"material","Bottle","Glass","Sweater","Wool",["Warm","Winter","Button"],"A bottle can be made of glass; a sweater is made of wool."],
[3,"worker","Scissors","Tailor","Stethoscope","Doctor",["Heart","Hospital","Medicine"],"Each tool is used by that worker."],
[3,"habitat","Camel","Desert","Polar bear","Arctic",["Snow","Fish","White"],"Each animal lives in that kind of place."],
[3,"cause","Rain","Wet","Sun","Dry",["Hot","Sky","Cloud"],"Rain makes things wet; sun makes things dry."],
[3,"syn","Big","Large","Little","Small",["Tall","Huge","Thin"],"Each pair means the same."],
[4,"group","Swarm","Bees","Pack","Wolves",["Forest","Hunter","Howl"],"A swarm is a group of bees; a pack is a group of wolves."],
[4,"creator","Architect","Building","Poet","Poem",["Pen","Rhyme","Book shop"],"Each person designs or writes that thing."],
[4,"degree","Warm","Hot","Cool","Freezing",["Ice","Winter","Mild"],"The second word is a stronger form of the first."],
[4,"degree","Whisper","Shout","Walk","Sprint",["Run","Legs","Slow"],"The second word is a much stronger form of the first."],
[4,"material","Candle","Wax","Tyre","Rubber",["Wheel","Round","Road"],"Each thing is made of that material."],
[4,"product","Bee","Honey","Silkworm","Silk",["Leaf","Thread","Moth"],"Each creature makes that product."],
[4,"part","Chapter","Book","Verse","Poem",["Poet","Rhyme","Line"],"A chapter is a section of a book; a verse is a section of a poem."],
[4,"function","Lungs","Breathe","Heart","Pump blood",["Beat fast","Love","Chest"],"This is the main job of each organ."],
[4,"syn","Begin","Start","Finish","End",["Win","Stop","Late"],"Each pair means the same."],
[5,"degree","Tired","Exhausted","Hungry","Starving",["Thirsty","Food","Full"],"The second word is an extreme form of the first."],
[5,"degree","Damp","Soaked","Chilly","Frozen",["Windy","Warm","Snow"],"The second word is an extreme form of the first."],
[5,"cause","Exercise","Fitness","Practice","Skill",["Lesson","Teacher","Game"],"The first leads to the second."],
[5,"lack","Silence","Sound","Darkness","Light",["Night","Shadow","Black"],"Silence is the absence of sound; darkness is the absence of light."],
[5,"worker","Astronomer","Telescope","Scientist","Microscope",["Laboratory","Experiment","Germ"],"Each worker uses that instrument."],
[5,"opp","Ancient","Modern","Expand","Shrink",["Grow","Spread","Wide"],"These are opposites."],
[5,"trait","Cheetah","Fast","Snail","Slow",["Shell","Garden","Small"],"Each animal is known for that quality."],
[5,"keeps","Wallet","Money","Quiver","Arrows",["Bow","Archer","Target"],"A wallet holds money; a quiver holds arrows."],
[6,"lack","Drought","Water","Famine","Food",["Hunger","Farm","Rain"],"A drought is a serious lack of water; a famine is a serious lack of food."],
[6,"opp","Generous","Stingy","Transparent","Opaque",["Clear","Glass","Shiny"],"These are opposites."],
[6,"cause","Virus","Illness","Spark","Fire",["Smoke","Wire","Match box"],"The first can cause the second."],
[6,"young","Sapling","Tree","Bud","Flower",["Petal","Garden","Root"],"A sapling is a young tree; a bud is a young flower."],
[6,"part","Lens","Camera","Key","Keyboard",["Typing","Lock","Screen"],"A lens is part of a camera; a key is part of a keyboard."],
[6,"function","Rudder","Steer","Anchor","Hold still",["Sink","Sail","Rope"],"This is the job each part of a ship does."],
[6,"study","Biology","Living things","Geology","Rocks",["Maps","Volcano","Mountains climbing"],"Each science studies that subject."],
[7,"worker","Surgeon","Scalpel","Calligrapher","Pen",["Ink","Paper","Letters"],"A surgeon works with a scalpel; a calligrapher works with a pen."],
[7,"degree","Glad","Overjoyed","Annoyed","Furious",["Calm","Sad","Bored"],"The second word is a much stronger form of the first."],
[7,"opp","Scarce","Plentiful","Temporary","Permanent",["Short","Quick","Brief"],"These are opposites."],
[7,"lack","Ignorance","Knowledge","Poverty","Wealth",["Money","Poor","Bank"],"The first is the lack of the second."],
[7,"study","Astronomy","Stars","Botany","Plants",["Garden","Flowers shop","Farmer"],"Each science studies that subject."],
[7,"measure","Thermometer","Fever","X-ray","Broken bone",["Doctor","Hospital","Medicine"],"A thermometer shows a fever; an X-ray shows a broken bone."],
[7,"syn","Rapid","Swift","Assist","Help",["Hinder","Ask","Need"],"Each pair means the same."],
[8,"opp","Optimist","Pessimist","Ascend","Descend",["Climb","Mount","Rise"],"These are opposites."],
[8,"cause","Erosion","Canyon","Pressure","Diamond",["Rock","Ring","Jewel"],"Over a long time, the first produces the second."],
[8,"trait","Feather","Light","Lead","Heavy",["Grey","Pencil","Metal"],"Each thing is known for that quality."],
[8,"syn","Abundant","Plentiful","Fragile","Delicate",["Strong","Broken","Glass"],"Each pair means the same."],
[8,"part","Stanza","Poem","Scene","Play",["Actor","Theatre","Act out"],"A stanza is one part of a poem; a scene is one part of a play."],
[9,"opp","Praise","Criticise","Include","Exclude",["Contain","Add","Involve"],"These are opposites."],
[9,"degree","Dislike","Loathe","Admire","Adore",["Respect","Hate","Notice"],"The second word is a much stronger form of the first."],
[9,"lack","Insomnia","Sleep","Amnesia","Memory",["Dream","Brain","Forget"],"Insomnia is the inability to sleep; amnesia is the loss of memory."],
[9,"creator","Cartographer","Map","Lexicographer","Dictionary",["Words","Library","Spelling"],"Each specialist makes that thing."]
];
const SYM={opp:1,syn:1};
/* relations that are close enough to confuse are grouped, so a distractor never comes from the same family */
const FAM={creator:"make",product:"make",tool:"use",function:"use",measure:"use",sense:"use",young:"grow",grow:"grow",home:"where",habitat:"where",place:"where",keeps:"where",room:"where"};
const fam=r=>FAM[r]||r;
function genAnalogy(d,L,opts){
  const {item:a,id}=bpick(AN,d,opts,2),[,r,A,B,C,D,W,why]=a;
  if(d>=4){ /* pair format, like the older-level tests */
    const others=shuffle(AN.filter(x=>fam(x[1])!==fam(r)&&x[0]<=d+1)).slice(0,3).map(x=>`${x[2]} : ${x[3]}`);
    const wr=SYM[r]?others:[`${D} : ${C}`,...others.slice(0,2)];
    return make(SEC,`Which pair has the same relationship as <b>${A} : ${B}</b>?`,null,`${C} : ${D}`,wr,why,"text","an:"+id);
  }
  return make(SEC,`<b>${A}</b> is to <b>${B}</b> as <b>${C}</b> is to ____?`,null,D,W,why,"text","an:"+id);
}
reg("analogyEn",SEC,genAnalogy,{en:"Word analogies",ar:"التناظر اللفظي (إنجليزي)",min:1,max:9,bank:true,lang:"en"});

/* ================= SENTENCE COMPLETION ================= */
const SC=[
[1,"We use an umbrella when it is ____.","raining",["hungry","sleeping","reading"],"An umbrella keeps us dry in the rain."],
[1,"The baby is tired, so she is going to ____.","sleep",["run","shout","jump"],"Being tired makes us want to sleep."],
[1,"Fish live in ____.","water",["trees","sand","fire"],"Fish need water to live."],
[1,"I wear a coat because it is ____ outside.","cold",["hot","sunny","bright"],"A coat keeps us warm when it is cold."],
[1,"We read books in the ____.","library",["kitchen","garage","pool"],"A library is the place for books."],
[2,"Ali was so thirsty that he drank two glasses of ____.","water",["bread","sand","soap"],"Thirsty means needing a drink."],
[2,"The ice cream ____ quickly in the hot sun.","melted",["froze","grew","sang"],"Heat makes ice cream melt."],
[2,"Sara could not see the board, so she put on her ____.","glasses",["shoes","gloves","hat"],"Glasses help people see clearly."],
[2,"The road was wet ____ it had rained all night.","because",["but","so","until"],"The rain is the reason the road was wet."],
[3,"Omar practised every day, ____ he won the race.","so",["but","although","unless"],"Winning was the result of practising."],
[3,"The room was very ____, so we turned on the light.","dark",["bright","clean","large"],"We need light when a room is dark."],
[3,"Plants need sunlight and ____ to grow.","water",["plastic","noise","shoes"],"Plants need water as well as sunlight."],
[3,"She whispered so that she would not ____ the sleeping baby.","wake",["feed","carry","see"],"Whispering keeps a baby from waking up."],
[4,"The old bridge was ____, so the city closed it until it could be repaired.","unsafe",["beautiful","crowded","famous"],"A bridge is closed when it is not safe."],
[4,"____ the test was difficult, most students passed.","Although",["Because","Since","So"],"'Although' joins two ideas that seem to clash."],
[4,"A good scientist does not guess; she ____ her ideas with experiments.","tests",["hides","forgets","sells"],"Scientists check ideas by testing them."],
[4,"The desert is very dry; it ____ rains there.","rarely",["often","always","heavily"],"Dry places get very little rain."],
[4,"The boy was ____ about the trip and could not stop smiling.","excited",["worried","bored","angry"],"Smiling non-stop shows excitement."],
[5,"The firefighters were praised for their ____ during the dangerous rescue.","courage",["laziness","fear","silence"],"Praise for a dangerous rescue points to bravery."],
[5,"The instructions were so ____ that nobody could understand them.","confusing",["clear","short","simple"],"People could not understand them, so they were confusing."],
[5,"Water ____ when it is cooled below zero degrees Celsius.","freezes",["boils","melts","evaporates"],"Below 0 °C water turns to ice."],
[5,"The museum keeps ____ objects, some more than a thousand years old.","ancient",["modern","plastic","cheap"],"Objects over a thousand years old are ancient."],
[5,"Instead of arguing, the two teams decided to ____ and share the field.","cooperate",["compete","quarrel","leave"],"Sharing the field means working together."],
[6,"The medicine did not cure the illness, but it ____ the pain.","reduced",["increased","caused","created"],"'But' tells us the medicine still helped a little."],
[6,"Because the evidence was ____, the judge could not reach a decision.","incomplete",["convincing","clear","complete"],"A judge cannot decide when evidence is missing."],
[6,"The new law aims to ____ pollution by limiting factory smoke.","reduce",["increase","ignore","celebrate"],"Limiting smoke lowers pollution."],
[6,"His answer was ____: it was short but covered every important point.","concise",["lengthy","careless","wrong"],"Short but complete means concise."],
[6,"The hikers were ____ after walking for ten hours without rest.","exhausted",["energetic","refreshed","bored"],"Ten hours of walking would leave anyone exhausted."],
[7,"Scientists remain ____ about the claim until more evidence is found.","sceptical",["certain","convinced","careless"],"Without enough evidence, scientists doubt a claim."],
[7,"The village was so ____ that the nearest town was a day's journey away.","remote",["crowded","central","modern"],"Far from any town means remote."],
[7,"Her ____ to detail meant that she noticed even the smallest mistakes.","attention",["dislike","blindness","boredom"],"Noticing tiny mistakes shows close attention to detail."],
[7,"Although the storm was severe, the damage to the town was ____.","minimal",["enormous","total","serious"],"'Although' signals a surprise: little damage despite a severe storm."],
[7,"The coach's ____ words gave the tired team the energy to keep going.","encouraging",["insulting","boring","confusing"],"Words that give energy are encouraging."],
[8,"The theory was ____ when new experiments produced exactly the opposite results.","disproved",["confirmed","celebrated","supported"],"Opposite results show the theory was wrong."],
[8,"Being ____, he always planned for the worst so he would never be surprised.","cautious",["reckless","careless","hasty"],"Planning for the worst is cautious behaviour."],
[8,"The speaker was so ____ that the audience hung on every word.","captivating",["dull","quiet","nervous"],"An audience hanging on every word means the speaker held their attention."],
[8,"The two reports seemed to ____ each other, so the editor checked both again.","contradict",["agree with","repeat","copy"],"Checking again suggests the reports disagreed."],
[9,"Her success was not ____; it came from years of steady, deliberate work.","accidental",["earned","deserved","planned"],"Years of deliberate work means it was not by chance."],
[9,"The professor's explanation was so ____ that even beginners understood it immediately.","lucid",["obscure","vague","complex"],"Beginners understanding at once means it was very clear."],
[9,"Water is ____ in the desert, so every drop is used with care.","scarce",["plentiful","wasted","salty"],"Using every drop carefully means water is scarce."],
[9,"Although he appeared ____, he was actually listening to every word.","indifferent",["attentive","interested","eager"],"'Although' sets up a contrast with listening carefully."]
];
function genSentenceEn(d,L,opts){
  const {item,id}=bpick(SC,d,opts,2),[,s,a,w,why]=item;
  return make(SEC,`Choose the word that best completes the sentence:<br><b>${s.replace("____","<span class=\"gap\">______</span>")}</b>`,null,a,w,why,"text","sc:"+id);
}
reg("sentenceEn",SEC,genSentenceEn,{en:"Sentence completion",ar:"إكمال الجمل (إنجليزي)",min:1,max:9,bank:true,lang:"en"});

/* ================= CONTEXT ERROR (one marked word does not fit the meaning) ================= */
const CE=[
[3,"Sami was [thirsty], so he [drank] a big glass of [sand] to feel [better].","sand","Thirsty people drink water; you cannot drink sand."],
[3,"It was a [sunny] day, so we took our [umbrellas] to stay [dry] in the [rain].","sunny","Umbrellas, staying dry and rain describe a rainy day, not a sunny one."],
[4,"Because the road was [icy], the driver went [slowly] and [carefully] to keep everyone [dangerous].","dangerous","Driving slowly and carefully keeps people safe, not dangerous."],
[4,"Ahmed [studied] hard every night, so he felt [confident] and [worried] when he [sat] the exam.","worried","Hard study leads to feeling ready; 'worried' clashes with 'confident'."],
[4,"Plants [need] sunlight, so we [moved] the pot to a [dark] corner by the [window].","dark","A spot by a window gets light; plants that need sunlight would not go somewhere dark."],
[4,"The [tiny] elephant [lifted] the heavy log with its [strong] [trunk].","tiny","An elephant strong enough to lift a heavy log is huge, not tiny."],
[5,"The library is a [noisy] place where people [read] and [study] in [silence].","noisy","Reading and studying in silence describe a quiet place."],
[5,"After the long [drought], the river was [full] and the fields were [dry] and [cracked].","full","A drought leaves rivers low or empty, matching the dry, cracked fields."],
[5,"The team [celebrated] their [defeat] with cheers, trophies and a [happy] [party].","defeat","Cheers and trophies follow a victory, not a defeat."],
[5,"Water [boils] at 100 °C and [freezes] at 0 °C, so ice [melts] when it gets [colder].","colder","Ice melts when it gets warmer."],
[6,"The [generous] man [refused] to share any of his food with the [hungry] [children].","generous","A man who refuses to share is selfish, not generous."],
[6,"Because she was [honest], she always [hid] the truth and never [told] a [lie].","hid","Honest people tell the truth; they don't hide it."],
[6,"The medicine [worked] [quickly]: within an hour the patient felt much [worse] and [stronger].","worse","A medicine that works makes the patient feel better."],
[6,"The [ancient] castle was built [last year] using [stone] and [wood].","last year","Something ancient was built a very long time ago."],
[7,"Scientists were [certain] of the result, so they [repeated] the experiment to [check] it was [accurate].","certain","Repeating an experiment to check it suggests they were not yet certain."],
[7,"The [remote] village was [easy] to reach, far from any [road] and surrounded by [mountains].","easy","A remote village far from roads and ringed by mountains would be hard to reach."],
[7,"His speech was so [brief] that it [lasted] nearly two [hours] and [bored] the audience.","brief","A speech of nearly two hours is long, not brief."],
[7,"The [cautious] climber [rushed] up the cliff without [checking] his [ropes].","cautious","Rushing without checking ropes is reckless, not cautious."],
[8,"The [scarce] supplies were [enough] for everyone, so the leader [ordered] people to [share] carefully.","enough","Ordering careful sharing means supplies were not enough."],
[8,"The theory was [confirmed] when every new experiment [contradicted] it and [disproved] its [predictions].","confirmed","Experiments that contradict a theory disprove it; they don't confirm it."],
[8,"Being [modest], she [boasted] about her prize to [everyone] she [met].","boasted","Modest people do not boast."],
[9,"The essay was [concise], [rambling] on for pages without [reaching] a clear [point].","concise","Rambling on for pages is the opposite of concise."],
[9,"Her [optimistic] view of the future made her [expect] the [worst] in every [situation].","optimistic","Expecting the worst is pessimistic."],
[9,"The [transparent] glass let [no] light [through], keeping the room [dark].","transparent","Transparent glass lets light through; glass that blocks light is opaque."]
];
function markWords(s){return s.replace(/\[([^\]]+)\]/g,'<u>$1</u>');}
function genContextEn(d,L,opts){
  const {item,id}=bpick(CE,d,opts,3),[,s,ans,why]=item,words=[...s.matchAll(/\[([^\]]+)\]/g)].map(m=>m[1]);
  return make(SEC,`One underlined word does not fit the meaning of the sentence. Which is it?<br><b>${markWords(s)}</b>`,null,ans,words.filter(w=>w!==ans),why,"text","ce:"+id);
}
reg("contextEn",SEC,genContextEn,{en:"Word that doesn't fit",ar:"الخطأ السياقي (إنجليزي)",min:3,max:9,bank:true,lang:"en"});

/* ================= ODD WORD OUT ================= */
const OW=[
[1,["Apple","Banana","Grape"],"Carrot","The others are fruits; a carrot is a vegetable."],
[1,["Red","Blue","Green"],"Circle","The others are colours."],
[1,["Dog","Cat","Horse"],"Rose","The others are animals; a rose is a flower."],
[1,["Car","Bus","Train"],"Chair","The others are things we travel in."],
[2,["Monday","Friday","Sunday"],"March","The others are days; March is a month."],
[2,["Shark","Whale","Dolphin"],"Eagle","The others live in the sea."],
[2,["Spoon","Fork","Knife"],"Pillow","The others are used for eating."],
[2,["Two","Four","Eight"],"Seven","The others are even numbers."],
[2,["Rain","Snow","Hail"],"Sand","The others fall from clouds."],
[3,["Happy","Glad","Joyful"],"Angry","The others mean the same feeling."],
[3,["Ant","Bee","Butterfly"],"Spider","The others are insects with 6 legs; a spider has 8."],
[3,["Square","Triangle","Rectangle"],"Ball","The others are flat shapes."],
[3,["Hammer","Saw","Screwdriver"],"Recipe","The others are tools."],
[3,["Ear","Eye","Nose"],"Knee","The others are on the face."],
[4,["Iron","Copper","Gold"],"Wood","The others are metals."],
[4,["Kilogram","Gram","Tonne"],"Metre","The others measure mass; a metre measures length."],
[4,["Whisper","Mutter","Murmur"],"Scream","The others are quiet ways of speaking."],
[4,["Bat","Whale","Camel"],"Penguin","The others are mammals; a penguin is a bird."],
[4,["Lake","River","Ocean"],"Desert","The others are bodies of water."],
[5,["Ancient","Old","Aged"],"Recent","The others describe something from long ago."],
[5,["Venus","Mars","Jupiter"],"Moon","The others are planets; the Moon goes around the Earth."],
[5,["Author","Poet","Novelist"],"Sculptor","The others create with words."],
[5,["Frog","Toad","Newt"],"Lizard","The others are amphibians; a lizard is a reptile."],
[6,["Brave","Bold","Fearless"],"Timid","The others mean not afraid."],
[6,["Petrol","Coal","Gas"],"Sunlight","The others are fuels that are burned; sunlight is not burned."],
[6,["Lungs","Heart","Liver"],"Skeleton","The others are single organs; the skeleton is a whole system of bones."],
[6,["Biology","Chemistry","Physics"],"History","The others are natural sciences."],
[7,["Delighted","Thrilled","Elated"],"Content","The others mean extremely happy; content means calmly satisfied."],
[7,["Telescope","Microscope","Magnifying glass"],"Stethoscope","The others use lenses to make things look bigger; a stethoscope helps you hear."],
[7,["Melting","Freezing","Boiling"],"Burning","The others are changes of state; burning makes new substances."],
[8,["Abundant","Plentiful","Ample"],"Sparse","The others mean more than enough."],
[8,["Oxygen","Hydrogen","Nitrogen"],"Water","The others are elements; water is a compound."],
[8,["Hurricane","Tornado","Blizzard"],"Earthquake","The others are weather events; an earthquake comes from the ground."],
[9,["Meticulous","Thorough","Careful"],"Negligent","The others mean taking great care."],
[9,["Sonnet","Haiku","Limerick"],"Novel","The others are types of poem."],
[9,["Mercury","Venus","Earth"],"Neptune","The others are rocky inner planets; Neptune is a gas giant far out."]
];
function genOddWordEn(d,L,opts){
  const {item,id}=bpick(OW,d,opts,2),[,g,o,why]=item;
  return make(SEC,"Which word does not belong with the others?",null,o,g,why,"text","ow:"+id);
}
reg("oddWordEn",SEC,genOddWordEn,{en:"Odd word out",ar:"الكلمة المختلفة (إنجليزي)",min:1,max:9,bank:true,lang:"en"});

/* ================= WORD BANKS (Word Coach + vocabulary questions) =================
   opposites: word, word, arabic, arabic, difficulty, type (a adjective, v verb, n other) */
const mkBank=(rows,f)=>rows.map(r=>{const o={};f.forEach((k,i)=>{o[k]=r[i];});return o;});
const OPP=mkBank([
["hot","cold","ساخن","بارد",1,"a"],["big","small","كبير","صغير",1,"a"],["happy","sad","سعيد","حزين",1,"a"],["fast","slow","سريع","بطيء",1,"a"],
["open","closed","مفتوح","مغلق",1,"a"],["up","down","فوق","تحت",1,"n"],["full","empty","ممتلئ","فارغ",1,"a"],["heavy","light","ثقيل","خفيف",1,"a"],
["day","night","نهار","ليل",1,"n"],["young","old","صغير السن","كبير السن",1,"a"],["wet","dry","مبلل","جاف",1,"a"],["clean","dirty","نظيف","متسخ",1,"a"],
["tall","short","طويل","قصير",1,"a"],["thick","thin","سميك","رفيع",1,"a"],["loud","quiet","عالٍ","هادئ",1,"a"],["near","far","قريب","بعيد",1,"a"],
["strong","weak","قوي","ضعيف",1,"a"],["early","late","مبكر","متأخر",1,"a"],["inside","outside","داخل","خارج",1,"n"],["sweet","sour","حلو","حامض",1,"a"],
["cheap","expensive","رخيص","غالٍ",1,"a"],["front","back","أمام","خلف",1,"n"],["first","last","الأول","الأخير",1,"a"],["soft","hard","ناعم","قاسٍ",1,"a"],
["win","lose","يفوز","يخسر",2,"v"],["buy","sell","يشتري","يبيع",2,"v"],["push","pull","يدفع","يسحب",2,"v"],["laugh","cry","يضحك","يبكي",2,"v"],
["remember","forget","يتذكّر","ينسى",2,"v"],["true","false","صحيح","خاطئ",2,"a"],["always","never","دائمًا","أبدًا",2,"n"],["begin","end","يبدأ","ينتهي",2,"v"],
["rich","poor","غني","فقير",2,"a"],["wide","narrow","واسع","ضيّق",2,"a"],["smooth","rough","أملس","خشن",2,"a"],["safe","dangerous","آمن","خطير",2,"a"],
["brave","scared","شجاع","خائف",2,"a"],["friend","enemy","صديق","عدو",2,"n"],["awake","asleep","مستيقظ","نائم",2,"a"],["freeze","melt","يتجمّد","يذوب",2,"v"],
["float","sink","يطفو","يغرق",2,"v"],["same","different","نفسه","مختلف",2,"a"],["healthy","sick","سليم","مريض",2,"a"],["arrive","leave","يصل","يغادر",2,"v"],
["sharp","blunt","حادّ","غير حادّ",3,"a"],["generous","selfish","كريم","أناني",3,"a"],["ancient","modern","قديم جدًا","حديث",3,"a"],["increase","decrease","يزيد","ينقص",3,"v"],
["visible","invisible","ظاهر","غير مرئي",3,"a"],["possible","impossible","ممكن","مستحيل",3,"a"],["polite","rude","مهذّب","وقح",3,"a"],["shallow","deep","ضحل","عميق",3,"a"],
["fresh","stale","طازج","بائت",3,"a"],["lazy","hardworking","كسول","مجتهد",3,"a"],["accept","refuse","يقبل","يرفض",3,"v"],["borrow","lend","يستعير","يُعير",3,"v"],
["temporary","permanent","مؤقت","دائم",4,"a"],["expand","contract","يتمدد","ينكمش",4,"v"],["include","exclude","يشمل","يستثني",4,"v"],["import","export","يستورد","يصدّر",4,"v"],
["vertical","horizontal","رأسي","أفقي",4,"a"],["maximum","minimum","الحد الأقصى","الحد الأدنى",4,"n"],["ascend","descend","يصعد","ينزل",5,"v"],["frequent","rare","متكرر","نادر",5,"a"],
["flexible","rigid","مرن","صلب لا ينثني",5,"a"],["natural","artificial","طبيعي","صناعي",5,"a"],["majority","minority","الأغلبية","الأقلية",5,"n"],["transparent","opaque","شفاف","معتم",6,"a"],
["optimistic","pessimistic","متفائل","متشائم",6,"a"],["voluntary","compulsory","اختياري","إجباري",6,"a"],["simplify","complicate","يبسّط","يعقّد",6,"v"],["reveal","conceal","يكشف","يخفي",6,"v"],
["abundant","scarce","وفير","شحيح",7,"a"],["praise","criticise","يمدح","ينتقد",7,"v"],["humble","arrogant","متواضع","متكبر",7,"a"],["superior","inferior","متفوق","أدنى",7,"a"],
["reckless","cautious","متهور","حذر",8,"a"],["vague","precise","غامض","دقيق",8,"a"],["hostile","friendly","عدائي","ودود",8,"a"],["obscure","famous","مغمور","مشهور",9,"a"],
["concise","wordy","موجز","مطوّل",9,"a"],["diminish","enlarge","يقلّص","يكبّر",9,"v"]
],["a","b","x","y","d","t"]);
const SYN=mkBank([
["big","large","كبير",1,"a"],["little","small","صغير",1,"a"],["happy","glad","سعيد",1,"a"],["fast","quick","سريع",1,"a"],
["begin","start","يبدأ",1,"v"],["end","finish","ينهي",1,"v"],["gift","present","هدية",1,"n"],["kid","child","طفل",1,"n"],
["road","street","طريق",1,"n"],["sick","ill","مريض",1,"a"],["mad","angry","غاضب",1,"a"],["pick","choose","يختار",1,"v"],
["fix","repair","يصلح",1,"v"],["talk","speak","يتكلم",1,"v"],["smart","clever","ذكي",1,"a"],["easy","simple","سهل",1,"a"],
["hard","difficult","صعب",1,"a"],["sofa","couch","أريكة",1,"n"],["rock","stone","حجر",1,"n"],["pretty","beautiful","جميل",1,"a"],
["jump","leap","يقفز",2,"v"],["tired","exhausted","متعب",2,"a"],["wrong","incorrect","خاطئ",2,"a"],["cold","chilly","بارد",2,"a"],
["quiet","silent","هادئ",2,"a"],["help","assist","يساعد",2,"v"],["buy","purchase","يشتري",2,"v"],["reply","answer","يجيب",2,"v"],
["scared","afraid","خائف",2,"a"],["shout","yell","يصرخ",2,"v"],["brave","bold","شجاع",2,"a"],["rich","wealthy","غني",2,"a"],
["strange","odd","غريب",2,"a"],["trip","journey","رحلة",2,"n"],["story","tale","قصة",2,"n"],["forest","woods","غابة",2,"n"],
["build","construct","يبني",2,"v"],
["attempt","try","يحاول",3,"v"],["locate","find","يجد",3,"v"],["depart","leave","يغادر",3,"v"],["obtain","get","يحصل على",3,"v"],
["automobile","car","سيارة",3,"n"],["enough","sufficient","كافٍ",3,"a"],["enemy","foe","عدو",3,"n"],["reveal","show","يكشف",3,"v"],
["observe","watch","يراقب",3,"v"],["terrible","awful","فظيع",3,"a"],["tidy","neat","مرتّب",3,"a"],
["enormous","huge","ضخم",4,"a"],["rapid","swift","سريع جدًا",4,"a"],["purpose","aim","هدف",4,"n"],["vanish","disappear","يختفي",4,"v"],
["ancient","old","قديم",4,"a"],["gather","collect","يجمع",4,"v"],["fragile","delicate","هشّ",5,"a"],["predict","forecast","يتنبأ",5,"v"],
["courage","bravery","شجاعة",5,"n"],["accurate","exact","دقيق",5,"a"],["abundant","plentiful","وفير",6,"a"],["essential","vital","ضروري",6,"a"],
["conceal","hide","يخفي",6,"v"],["rigid","stiff","صلب",6,"a"],["vacant","empty","شاغر",7,"a"],["prohibit","forbid","يمنع",7,"v"],
["eager","keen","متحمس",7,"a"],["candid","frank","صريح",8,"a"],["diligent","hardworking","مجتهد",8,"a"],["benevolent","kind","طيّب",9,"a"],
["meticulous","thorough","دقيق ومتأنٍّ",9,"a"],["ambiguous","unclear","غامض",9,"a"]
],["a","b","x","d","t"]);
const PART=mkBank([
["wheel","car","عجلة","سيارة",1],["page","book","صفحة","كتاب",1],["petal","flower","بتلة","زهرة",1],["branch","tree","غصن","شجرة",1],
["wing","bird","جناح","طائر",1],["finger","hand","إصبع","يد",1],["toe","foot","إصبع القدم","قدم",1],["fin","fish","زعنفة","سمكة",1],
["sleeve","shirt","كمّ","قميص",1],["keyboard","computer","لوحة المفاتيح","حاسوب",1],["chimney","house","مدخنة","بيت",1],["nose","face","أنف","وجه",1],
["eraser","pencil","ممحاة","قلم رصاص",1],
["headlight","car","مصباح أمامي","سيارة",2],["chapter","book","فصل","كتاب",2],["bark","tree","لحاء","شجرة",2],["beak","bird","منقار","طائر",2],
["thumb","hand","إبهام","يد",2],["heel","foot","كعب","قدم",2],["gill","fish","خيشوم","سمكة",2],["collar","shirt","ياقة","قميص",2],
["screen","computer","شاشة","حاسوب",2],["kitchen","house","مطبخ","بيت",2],["cheek","face","خدّ","وجه",2],["bristle","toothbrush","شعيرة","فرشاة أسنان",2],
["string","guitar","وتر","جيتار",2],["player","team","لاعب","فريق",2],
["knuckle","hand","مفصل الإصبع","يد",3],["feather","bird","ريشة","طائر",3],["chin","face","ذقن","وجه",3],["bedroom","house","غرفة نوم","بيت",3],
["mouse","computer","فأرة","حاسوب",3],["classroom","school","فصل دراسي","مدرسة",3],["playground","school","ملعب","مدرسة",3],["engine","car","محرك","سيارة",3],
["ankle","foot","كاحل","قدم",3],["stem","flower","ساق","زهرة",3]
],["a","b","x","y","d"]);
const TOOLJ=mkBank([
["hammer","carpenter","مطرقة","نجّار",1],["stethoscope","doctor","سمّاعة طبيب","طبيب",1],["chalk","teacher","طباشير","معلّم",1],["camera","photographer","كاميرا","مصوّر",1],
["oven","baker","فرن","خبّاز",1],["net","fisherman","شبكة صيد","صيّاد",1],["needle and thread","tailor","إبرة وخيط","خيّاط",1],["hose","firefighter","خرطوم","رجل إطفاء",1],
["tractor","farmer","جرّار","مزارع",1],["paintbrush","painter","فرشاة","رسّام",1],
["microscope","scientist","مجهر","عالِم",2],["telescope","astronomer","تلسكوب","فلكي",2],["whistle","referee","صفّارة","حكم",2],["microphone","announcer","ميكروفون","مذيع",2],
["steering wheel","driver","مقود","سائق",2],
["baton","conductor","عصا قيادة الأوركسترا","قائد أوركسترا",3],["gavel","judge","مطرقة القاضي","قاضٍ",3],["cockpit","pilot","قمرة القيادة","طيّار",3]
],["a","b","x","y","d"]);
const TOOLA=mkBank([
["broom","sweep","مكنسة","يكنس",1],["scissors","cut","مقص","يقصّ",1],["key","unlock","مفتاح","يفتح القفل",1],["ruler","measure","مسطرة","يقيس",1],
["soap","wash","صابون","يغسل",1],["towel","dry","منشفة","ينشّف",1],["ladder","climb","سلّم","يتسلّق",1],["shovel","dig","مجرفة","يحفر",1],
["magnet","attract iron","مغناطيس","يجذب الحديد",2],["fan","cool the air","مروحة","يبرّد الهواء",2],["iron","press clothes","مكواة","يكوي الملابس",2],
["calculator","calculate","آلة حاسبة","يحسب",2],["lamp","give light","مصباح","يعطي ضوءًا",2],
["compass","find directions","بوصلة","يحدد الاتجاهات",3],["stapler","join papers","دباسة","يربط الأوراق",3],["funnel","pour liquid","قمع","يصبّ السوائل",3]
],["a","b","x","y","d"]);
const AMBIG={modern:["old"],ancient:["young","old"],old:["ancient"],sharp:["soft","smooth"],rough:["soft"],fresh:["old"],healthy:["weak"],hard:["difficult"],difficult:["hard"],
  telescope:["scientist"],"steering wheel":["pilot"],whistle:["teacher"],microphone:["teacher","conductor"],hammer:["judge"],hose:["farmer"],
  "needle and thread":["doctor"],chalk:["painter"],camera:["scientist"],microscope:["doctor"],cockpit:["driver"],gavel:["carpenter"],baton:["teacher"],
  kitchen:["school"],obscure:["precise","clear"],vague:["obscure"],reckless:["safe"],rigid:["hard"],stiff:["hard"],courage:["bold","brave"],bravery:["bold","brave"],enormous:["big","large"],huge:["big","large"],rapid:["fast","quick"],swift:["fast","quick"],abundant:["enough","sufficient"],plentiful:["enough","sufficient"],meticulous:["neat","tidy"],thorough:["neat","tidy"],gather:["pick"],collect:["pick"],scarce:["rare"],rare:["scarce"],empty:["vacant"],hide:["conceal"],reveal:["show"],brave:["bold","fearless"],quick:["swift","rapid"],fast:["swift","rapid"]};
function vbPick(bank,d,opts){if(opts&&opts.id!=null&&bank[opts.id])return {e:bank[opts.id],id:opts.id};const p=[];bank.forEach((e,i)=>{if(e.d<=d&&e.d>=d-2)p.push(i);});if(!p.length)bank.forEach((e,i)=>{if(e.d<=d)p.push(i);});const id=pick(p);return {e:bank[id],id};}
function vbWrongs(ans,w,e,bank,both){
  const bad=AMBIG[w]||[],bad2=AMBIG[ans]||[],same=[],rest=[];
  for(const o of bank){if(o===e||o.d>Math.max(e.d,2)+1)continue;for(const v of (both?[o.a,o.b]:[o.b])){if(v===w||v===ans||bad.includes(v)||bad2.includes(v))continue;(!e.t||o.t===e.t?same:rest).push(v);}}
  const out=[];for(const v of [...shuffle(same),...shuffle(rest)]){if(!out.includes(v))out.push(v);if(out.length===3)break;}return out;
}
const an=w=>/^[aeiou]/i.test(w)?"an":"a",cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function genOpposite(d,L,opts){const {e,id}=vbPick(OPP,d,opts),f=Math.random()<.5,w=f?e.a:e.b,ans=f?e.b:e.a;return make(SEC,`Which word is the <b>opposite</b> of <b>${w}</b>?`,null,ans,vbWrongs(ans,w,e,OPP,true),`"${w}" and "${ans}" are opposites.`,"text","opp:"+id);}
function genSynonym(d,L,opts){const {e,id}=vbPick(SYN,d,opts),f=Math.random()<.5,w=f?e.a:e.b,ans=f?e.b:e.a;return make(SEC,`Which word means almost the <b>same</b> as <b>${w}</b>?`,null,ans,vbWrongs(ans,w,e,SYN,true),`"${w}" and "${ans}" mean almost the same thing.`,"text","syn:"+id);}
function genPartWhole(d,L,opts){const {e,id}=vbPick(PART,Math.min(d,3),opts);return make(SEC,`${cap(an(e.a))} <b>${e.a}</b> is a part of ${an(e.b)} ____?`.replace(/ a ____| an ____/," a ____"),null,e.b,vbWrongs(e.b,e.a,e,PART,false),`${cap(an(e.a))} ${e.a} is one part of ${an(e.b)} ${e.b}.`,"text","part:"+id);}
function genToolJob(d,L,opts){const act=opts&&opts.act!=null?opts.act:Math.random()<.4,bank=act?TOOLA:TOOLJ,{e,id}=vbPick(bank,Math.min(d,3),opts),wr=vbWrongs(e.b,e.a,e,bank,false);
  return act?make(SEC,`${cap(an(e.a))} <b>${e.a}</b> is used to ____?`,null,e.b,wr,`${cap(an(e.a))} ${e.a} is used to ${e.b}.`,"text","tool:a"+id)
            :make(SEC,`Who would use ${an(e.a)} <b>${e.a}</b>?`,null,e.b,wr,`${cap(an(e.a))} ${e.a} is used by ${an(e.b)} ${e.b}.`,"text","tool:j"+id);}
reg("oppositeEn",SEC,genOpposite,{en:"Opposites",ar:"الأضداد (إنجليزي)",min:1,max:9,bank:true,lang:"en"});
reg("synonymEn",SEC,genSynonym,{en:"Same meaning",ar:"المترادفات (إنجليزي)",min:1,max:9,bank:true,lang:"en"});
reg("partWholeEn",SEC,genPartWhole,{en:"Parts and wholes",ar:"الجزء والكل (إنجليزي)",min:1,max:4,bank:true,lang:"en"});
reg("toolJobEn",SEC,genToolJob,{en:"Tools and jobs",ar:"الأدوات والمهن (إنجليزي)",min:1,max:4,bank:true,lang:"en"});

/* Word Coach cards (flip to see the Arabic meaning) */
function wordCardEn(cat,d){
  const maxd=Math.max(2,d),ok=o=>o.d<=maxd,f=Math.random()<.5;
  if(cat==="opp"){const e=pick(OPP.filter(ok));return {cat,front:f?e.a:e.b,meaning:f?e.x:e.y,line:`Opposite: <b>${f?e.b:e.a}</b>`,lineAr:f?e.y:e.x,say:f?e.a:e.b};}
  if(cat==="syn"){const e=pick(SYN.filter(ok));return {cat,front:f?e.a:e.b,meaning:e.x,line:`Same meaning: <b>${f?e.b:e.a}</b>`,lineAr:"",say:f?e.a:e.b};}
  if(cat==="part"){const e=pick(PART.filter(ok));return {cat,front:e.a,meaning:e.x,line:`${cap(an(e.a))} ${e.a} is part of ${an(e.b)} <b>${e.b}</b>`,lineAr:e.y,say:e.a};}
  if(Math.random()<.4){const e=pick(TOOLA.filter(ok));return {cat:"tool",front:e.a,meaning:e.x,line:`${cap(an(e.a))} ${e.a} is used to <b>${e.b}</b>`,lineAr:e.y,say:e.a};}
  const e=pick(TOOLJ.filter(ok));return {cat:"tool",front:e.a,meaning:e.x,line:`${cap(an(e.a))} ${e.a} is used by ${an(e.b)} <b>${e.b}</b>`,lineAr:e.y,say:e.a};
}

/* ================= READING ================= */
const P={
 shelf:"Noura keeps her books on three shelves. The top shelf has story books, the middle shelf has science books, and the bottom shelf has drawing books.",
 bus:"The school bus leaves at 7:00 every morning. Ahmed takes 15 minutes to walk to the bus stop. Today he woke up late and left his house at 6:50.",
 camel:"Camels are well suited to life in the desert. Their wide feet stop them from sinking into the sand, and long eyelashes protect their eyes from blowing dust. A camel can go many days without drinking. When it does find water, it can drink a huge amount very quickly. Contrary to what many people think, a camel's hump does not hold water. It stores fat, which the camel's body can use for energy when food is hard to find.",
 bees:"Honeybees live in large groups called colonies. Each colony has one queen, who lays all the eggs. Thousands of worker bees do every other job: they clean the hive, feed the young, guard the entrance and collect nectar from flowers. When a worker finds a good patch of flowers, she returns to the hive and performs a 'waggle dance'. The direction and length of the dance tell the other bees which way to fly and how far to go.",
 recycle:"A class wanted to find out how much paper their school throws away. For one week, they collected all the paper from the classroom bins and weighed it each afternoon. On Monday they collected 2 kg, and the amount stayed about the same until Thursday. On Friday, after a big art project, they collected 5 kg. The class then put a separate recycling box next to every bin. The following week, the amount of paper going into the bins fell by more than half.",
 lighthouse:"For centuries, lighthouses have warned ships away from dangerous rocks. Early lighthouses used wood fires or candles, which were hard to see in storms. In the 1820s, a French scientist named Augustin Fresnel designed a new kind of lens made of many rings of glass. It gathered the light and sent it out in a strong, narrow beam that could be seen many kilometres away. Today most lighthouses run automatically, and satellites help ships find their way. Even so, many lighthouses are kept working, because electronic systems can fail.",
 sleep:"Many people think that sleep is simply a time when the body switches off. In fact, the brain stays busy all night. During sleep it sorts the day's memories, keeping important ones and letting go of others. Scientists have found that students who sleep well after learning something new remember it better the next day than students who stay up late. Sleep also helps the body repair muscles and fight illness. For children aged 6 to 12, doctors usually recommend 9 to 12 hours a night.",
 coral:"Coral reefs look like colourful rocks, but they are built by tiny animals called polyps. Each polyp builds a hard cup of limestone around its soft body. Over thousands of years, millions of these cups form a reef. Most reef-building corals depend on tiny algae living inside them. The algae use sunlight to make food and share it with the coral, which gives the algae shelter in return. When the sea becomes too warm, the coral pushes the algae out and turns white, a change called bleaching. If the water cools soon, the coral can recover; if not, it may die.",
 market:"When a new phone is released, its price is usually high. Only people who really want it, or can easily afford it, buy it straight away. As months pass, the company may lower the price so that more people will buy. Shops also lower prices when they have too many of something in stock, and raise them when an item is hard to find. Economists call this the balance of supply and demand: when supply is low and demand is high, prices tend to rise; when supply is high and demand is low, prices tend to fall."
};
const RD=[
 {d:1,p:"shelf",q:"She is looking for a book about planets. Which shelf should she look at?",a:"The middle shelf",w:["The top shelf","The bottom shelf","None of the shelves"],why:"A book about planets is a science book, and science books are on the middle shelf."},
 {d:2,p:"bus",q:"What most likely happened to Ahmed today?",a:"He missed the bus",w:["He caught the bus","He arrived very early","He walked home"],why:"Leaving at 6:50 and walking 15 minutes means he reached the stop at 7:05, after the bus left."},
 {d:2,p:"camel",q:"What does a camel's hump store?",a:"Fat",w:["Water","Sand","Milk"],why:"The passage says the hump stores fat, not water."},
 {d:3,p:"camel",q:"Why do camels have wide feet?",a:"So they do not sink into the sand",w:["So they can run faster than horses","So they can swim","To keep their feet cool"],why:"The passage says wide feet stop them from sinking into the sand."},
 {d:3,p:"camel",q:"What is the main idea of the passage?",a:"Camels have special features that help them live in the desert",w:["Camels drink water every day","Deserts are full of dust storms","A camel's hump is full of water"],why:"Every detail describes how the camel is suited to desert life."},
 {d:3,p:"bees",q:"Who lays all the eggs in a colony?",a:"The queen",w:["The worker bees","The guard bees","Every bee"],why:"The passage says the queen lays all the eggs."},
 {d:4,p:"bees",q:"Why does a worker bee perform a 'waggle dance'?",a:"To tell other bees where to find flowers",w:["To guard the hive from enemies","To keep warm in winter","To choose a new queen"],why:"The dance shows the direction and distance to the flowers."},
 {d:4,p:"recycle",q:"Why did the class collect more paper on Friday?",a:"There was a big art project",w:["They forgot to empty the bins","More students came to school","It was the last day of the month"],why:"The passage links Friday's 5 kg to the art project."},
 {d:5,p:"recycle",q:"What can we conclude from the second week?",a:"The recycling boxes helped reduce the paper thrown in the bins",w:["The school stopped using paper","The students weighed the paper wrongly","Paper became heavier"],why:"After the boxes were added, paper in the bins fell by more than half."},
 {d:5,p:"lighthouse",q:"What problem did Fresnel's lens solve?",a:"Lighthouse lights were too weak to see from far away",w:["Ships had no maps","Lighthouses kept catching fire","Candles were too expensive"],why:"His lens turned the light into a strong beam visible many kilometres away."},
 {d:6,p:"lighthouse",q:"Why are many lighthouses still kept working today?",a:"In case electronic navigation systems fail",w:["Because ships cannot use satellites","Because candles are cheaper","Because Fresnel asked for them to be kept"],why:"The last sentence gives the reason: electronic systems can fail."},
 {d:6,p:"lighthouse",q:"In the passage, the word 'narrow' is closest in meaning to:",a:"thin",w:["bright","long","wide"],why:"A narrow beam is a thin, focused one."},
 {d:6,p:"sleep",q:"According to the passage, what does the brain do during sleep?",a:"It sorts memories, keeping the important ones",w:["It switches off completely","It forgets everything learned that day","It makes the muscles weaker"],why:"The passage says the brain stays busy sorting memories."},
 {d:7,p:"sleep",q:"Which finding best supports the idea that sleep helps learning?",a:"Students who slept well remembered new material better the next day",w:["Doctors recommend 9 to 12 hours for children","Sleep helps the body fight illness","Many people think the body switches off"],why:"Only this finding connects sleep directly to remembering what was learned."},
 {d:7,p:"sleep",q:"What is the writer's main purpose?",a:"To correct a common belief about sleep and explain why it matters",w:["To sell a new kind of bed","To describe a scientist's life","To argue that children sleep too much"],why:"It opens with a common belief, shows it is wrong, then explains sleep's benefits."},
 {d:7,p:"coral",q:"What are coral reefs built by?",a:"Tiny animals called polyps",w:["Colourful rocks","Algae alone","Sea plants growing on sand"],why:"The passage says reefs are built by polyps."},
 {d:8,p:"coral",q:"Which word best describes the relationship between coral and algae?",a:"Partnership",w:["Competition","Hunting","Disease"],why:"Each gives the other something: food for shelter."},
 {d:8,p:"coral",q:"What can we infer about bleached coral?",a:"It can survive if the water cools again soon",w:["It is always already dead","It has grown new algae","It is healthier than coloured coral"],why:"The passage says bleached coral can recover if the water cools soon."},
 {d:8,p:"market",q:"According to the passage, why might a company lower the price of a phone?",a:"So that more people will buy it",w:["Because the phone has stopped working","Because economists tell it to","Because demand is too high"],why:"The passage says the price may be lowered so more people buy."},
 {d:9,p:"market",q:"A toy suddenly becomes very popular, but factories can only make a few. What would the passage predict?",a:"Its price will tend to rise",w:["Its price will tend to fall","Its price will not change","Shops will give it away"],why:"Low supply with high demand pushes prices up."},
 {d:9,p:"market",q:"Which title fits the passage best?",a:"Why Prices Go Up and Down",w:["How Phones Are Made","The Life of an Economist","Saving Money at School"],why:"The whole passage explains what makes prices change."}
];
function genReadingEn(d,L,opts){
  const {item,id}=bpick(RD,d,opts,2);
  return make(SEC,`<div class="passage" dir="ltr">${P[item.p]}</div>${item.q}`,null,item.a,item.w,item.why,"text","rd:"+id);
}
reg("readingEn",SEC,genReadingEn,{en:"Reading comprehension",ar:"استيعاب المقروء (إنجليزي)",min:1,max:9,bank:true,lang:"en"});

/* ================= SHORT LOGIC STORIES (younger) ================= */
const ST=[
[1,"Sara took her umbrella and put on her boots before going out. What was the weather most likely like?","It was raining",["It was sunny and dry","It was the middle of the night","It was very hot and windy"],"An umbrella and boots are for rain."],
[1,"Omar's ice cream melted very quickly while he sat outside. What is most likely true?","It was a hot day",["It was snowing","It was a cold night","The ice cream was frozen solid"],"Heat makes ice cream melt fast."],
[2,"The plant on a dark shelf turned yellow, but the same plant by the window stayed green. Why?","Plants need sunlight",["Plants like shelves","Windows are cold","Yellow is a nice colour"],"The only difference was the light."],
[2,"All the birds in the cage are yellow. Kiwi is a bird in the cage. What colour is Kiwi?","Yellow",["Green","Blue","We can't tell"],"If all the birds are yellow, Kiwi must be yellow too."],
[2,"Every Friday, Faisal visits his grandmother. Today is Friday. What will Faisal do today?","Visit his grandmother",["Go to school","Stay home all day","Visit his teacher"],"The rule says every Friday."],
[3,"Lina is older than Nora. Nora is 7 years old. Which must be true?","Lina is older than 7",["Lina is 6","Lina is 7","Nora is older than Lina"],"If Lina is older than a 7-year-old, she is more than 7."],
[3,"Noura's pencil got shorter and shorter all week. What was she most likely doing?","Sharpening and using it",["Keeping it in a box","Watering it","Painting it"],"Pencils get shorter when we sharpen and use them."],
[3,"Some of the children in the park are wearing hats. Fahad is in the park. Which is true?","Fahad may or may not be wearing a hat",["Fahad is wearing a hat","Fahad is not wearing a hat","All the children are wearing hats"],"'Some' does not tell us about any one child."]
];
function genStoryEn(d,L,opts){const {item,id}=bpick(ST,d,opts,2),[,q,a,w,why]=item;return make(SEC,q,null,a,w,why,"text","st:"+id);}
reg("storyEn",SEC,genStoryEn,{en:"Logic stories",ar:"قصص الاستنتاج (إنجليزي)",min:1,max:4,bank:true,lang:"en"});

/* ================= LOGIC (both languages) ================= */
const REL={en:[["taller","shortest","tallest"],["faster","slowest","fastest"],["older","youngest","oldest"],["heavier","lightest","heaviest"]],
           ar:[["أطول من","الأقصر","الأطول"],["أسرع من","الأبطأ","الأسرع"],["أكبر سنًّا من","الأصغر سنًّا","الأكبر سنًّا"],["أثقل من","الأخف","الأثقل"]]};
function genOrder(d,L){
  const T=tr(L),n=d>=7?4:d>=4?pick([3,4]):3,ns=people(n,L),r=pick(REL[L]),askLow=Math.random()<.5;
  const st=[];for(let i=0;i<n-1;i++)st.push(L==="ar"?`${ns[i]} ${r[0]} ${ns[i+1]}.`:`${ns[i]} is ${r[0]} than ${ns[i+1]}.`);
  const ans=askLow?ns[n-1]:ns[0],word=askLow?r[1]:r[2];
  if(d>=6&&n===4&&Math.random()<.5){
    const a2=ns[askLow?n-2:1];
    return make(SEC,`${shuffle(st).join(" ")} ${T(`Who is the <b>second ${word}</b>?`,`من يأتي بعد <b>${word}</b> مباشرة؟`)}`,null,a2,ns.filter(x=>x!==a2).slice(0,3),
      T(`In order: ${ns.join(", ")}. So ${a2} is the second ${word}.`,`الترتيب: ${ns.join("، ")}. إذن الذي يأتي بعد ${word} مباشرة: ${a2}.`));
  }
  const opts=ns.filter(x=>x!==ans).slice(0,3);if(opts.length<3)opts.push(T("We can't tell","لا يمكن معرفة ذلك"));
  return make(SEC,`${shuffle(st).join(" ")} ${T(`Who is the <b>${word}</b>?`,`من <b>${word}</b>؟`)}`,null,ans,opts,
    T(`Put them in order: ${ns.join(", ")}. So ${ans} is the ${word}.`,`نرتبهم: ${ns.join("، ")}. إذن ${word}: ${ans}.`));
}
reg("order",SEC,genOrder,{en:"Ordering",ar:"الترتيب المنطقي",min:1,max:9});
const NONS={en:["zips","zaps","bloops","glims","morks","tufts","wibs","quons"],ar:["البلوبات","الكيمات","الفُرقات","الجومات","الهيبات","العوكات","الخوزات","الفيمات"]};
const nal=w=>w.replace(/^ال/,"");
function genSyllogism(d,L){
  const T=tr(L),[A,B,C]=shuffle(NONS[L]).slice(0,3),t=d>=8?rnd(0,3):rnd(0,2);
  const all=(x,y)=>T(`All ${x} are ${y}`,`كل ${x} ${nal(y)}`),no=(x,y)=>T(`No ${x} are ${y}`,`لا شيء من ${x} من ${y}`),some=(x,y)=>T(`Some ${x} are ${y}`,`بعض ${x} ${nal(y)}`),somenot=(x,y)=>T(`Some ${x} are not ${y}`,`بعض ${x} ليست ${nal(y)}`);
  let prem,ans,wr,why;
  if(t===0){prem=[all(A,B),all(B,C)];ans=all(A,C);wr=[all(C,A),no(A,C),all(B,A)];why=T(`Every ${A.slice(0,-1)} is inside the ${B} group, and the whole ${B} group is inside ${C}, so all ${A} are ${C}.`,`كل ${A} داخل مجموعة ${B}، ومجموعة ${B} كلها داخل ${C}، إذن كل ${A} ${nal(C)}.`);}
  else if(t===1){prem=[all(A,B),no(B,C)];ans=no(A,C);wr=[some(A,C),all(C,A),all(B,A)];why=T(`${A} are all ${B}, and nothing that is ${B.slice(0,-1)} can be ${C.slice(0,-1)}, so no ${A} are ${C}.`,`كل ${A} من ${B}، ولا شيء من ${B} من ${C}، إذن لا شيء من ${A} من ${C}.`);}
  else if(t===2){prem=[some(A,B),all(B,C)];ans=some(A,C);wr=[all(A,C),no(A,C),all(C,A)];why=T(`The ${A} that are ${B} must also be ${C}, because all ${B} are ${C}.`,`بعض ${A} من ${B}، وكل ${B} ${nal(C)}، إذن هذا البعض من ${A} ${nal(C)} أيضًا.`);}
  else{prem=[all(A,B),somenot(C,B)];ans=somenot(C,A);wr=[all(C,A),no(C,B),somenot(A,B)];why=T(`Anything that is not ${B.slice(0,-1)} cannot be ${A.slice(0,-1)}, so the ${C} that are not ${B} are not ${A} either.`,`ما ليس من ${B} لا يمكن أن يكون من ${A}، فبعض ${C} التي ليست ${B} ليست ${A} أيضًا.`);}
  return make(SEC,T(`The words are made up, so use only the facts given.<br><b>${prem.join(".<br>")}.</b><br>Which statement <b>must</b> be true?`,`الكلمات مخترعة، فاعتمد على المعطيات فقط.<br><b>${prem.join(".<br>")}.</b><br>أي العبارات <b>صحيحة حتمًا</b>؟`),null,ans,wr,why);
}
reg("syllogism",SEC,genSyllogism,{en:"Logical conclusions",ar:"الاستنتاج المنطقي",min:6,max:9});

NB.VB=NB.VB||{};NB.VB.en=Object.assign(NB.VB.en||{},{SC,CE,P,RD});
NB.WORDS=NB.WORDS||{};NB.WORDS.en={card:wordCardEn,cats:{opp:{en:"Opposites",ar:"الأضداد",ico:"↔️",ex:"hot ↔ cold"},syn:{en:"Same meaning",ar:"المترادفات",ico:"🟰",ex:"big = large"},part:{en:"Parts and wholes",ar:"الجزء والكل",ico:"🧩",ex:"wheel → car"},tool:{en:"Tools and jobs",ar:"الأدوات والمهن",ico:"🛠️",ex:"hammer → carpenter"}},
  quiz:{opp:"oppositeEn",syn:"synonymEn",part:"partWholeEn",tool:"toolJobEn"}};
})();
