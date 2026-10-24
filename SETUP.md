# تشغيل نبيه وبيعه

دليل الإعداد مرة واحدة. يأخذ قرابة ساعة. المشروع منفصل تمامًا عن تطبيق العائلة (mawhiba-quest)، وله مستودعه ومشروع Firebase الخاص به.

## ١. النشر على GitHub Pages
1. أنشئ مستودعًا جديدًا باسم `nabeeh` (عامًا).
2. ارفع كل ملفات هذا المجلد إلى الفرع `main`.
3. من Settings ← Pages اختر Deploy from a branch، ثم `main` و`/ (root)`.
4. بعد دقيقة يصبح الموقع على `https://<اسم-المستخدم>.github.io/nabeeh/`، والتطبيق على `.../app.html`.

قبل ضبط Firebase يعمل التطبيق كاملًا على الجهاز فقط، وكود التجربة `NABEEH-DEMO` يفتح النسخة الكاملة للمعاينة.

## ٢. Firebase (الحسابات والمزامنة وأكواد التفعيل)
1. أنشئ مشروعًا **جديدًا** في console.firebase.google.com باسم `nabeeh`، ولا تستخدم مشروع العائلة.
2. Build ← Authentication ← Get started، وفعّل **Email/Password** و**Google**.
3. Authentication ← Settings ← Authorized domains: أضف `<اسم-المستخدم>.github.io`.
4. Build ← Firestore Database ← Create database، واختر Production mode وأقرب منطقة متاحة.
5. Project settings ← Your apps ← أضف تطبيق Web، وانسخ كائن `firebaseConfig` إلى `js/config.js` في الحقل `firebase`.
6. Firestore ← Rules: الصق محتوى `firestore.rules` واضغط Publish.

## ٣. حساب المدير وإنشاء الأكواد
1. افتح `admin.html`، وسجّل الدخول (أنشئ الحساب أولًا من التطبيق نفسه).
2. ستظهر لك رسالة فيها **معرّف حسابك (uid)**. ضعه في:
   - `js/config.js` ← `adminUids: ["المعرّف"]`
   - `firestore.rules` ← مكان `ADMIN_UID`، ثم Publish مرة أخرى.
3. ارفع `js/config.js` المعدّل، ثم افتح `admin.html` من جديد وأنشئ مثلًا ١٠٠ كود.

صيغة الكود: `NB-XXXX-XXXX-XXXX`. كل كود يُستخدم لحساب عائلي واحد فقط، وقواعد Firestore تمنع استخدامه في حساب آخر.

## ٤. البيع على Payhip (يحوّل الأرباح إلى PayPal)
1. أنشئ حسابًا في payhip.com واربطه بحساب PayPal.
2. Add product ← Digital product، والاسم: «نبيه: كود تفعيل النسخة الكاملة».
3. ارفع ملف PDF صغيرًا فيه رابط التطبيق وطريقة التفعيل (لأن Payhip يطلب ملفًا).
4. Advanced options ← Software License Keys ← **From a list**: الصق الأكواد من زر «نسخ الأكواد المتاحة» في لوحة الإدارة، كل كود في سطر.
5. فعّل «Limit the number of products sold» واجعله مساويًا لعدد الأكواد، حتى لا يشتري أحد بعد نفادها.
6. انسخ رابط المنتج وضعه في `js/config.js` ← `buyUrl`، ثم ارفع الملف.

عندما تقل الأكواد، أنشئ دفعة جديدة من لوحة الإدارة وأضفها في Payhip.

## ٥. قبل الإطلاق
- ضع بريد الدعم أو رقم واتساب في `supportEmail` و`whatsapp` داخل `js/config.js`.
- غيّر الرقم `VERSION` في `sw.js` بعد كل تحديث، حتى تصل التحديثات للجوالات.
- راجع سياسة العمل الخارجي وتعارض المصالح في جهة عملك قبل البيع.
- لا تستخدم شعار موهبة ولا تكتب «موهبة» في اسم المنتج. الاسم «نبيه»، و«مقياس موهبة» يرد في الوصف فقط.

## فحص الأسئلة
`node tests/check-generators.js 40` يولّد عشرات الآلاف من الأسئلة بكل الأنواع والمستويات واللغتين، ويتأكد أن لكل سؤال إجابة صحيحة واحدة وأربعة خيارات مختلفة وشرحًا. افتح `tests/gallery.html?L=ar` لترى نموذجًا من كل نوع.
