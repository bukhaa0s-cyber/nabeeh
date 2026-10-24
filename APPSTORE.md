# نشر نبيه في App Store

المشروع جاهز تقنيًا: نسخة الآيفون تُبنى على جهاز ماك سحابي من GitHub (ما تحتاج ماك)، وفيها شاشة شراء من داخل التطبيق بحساب Apple، وزر «استعادة المشتريات». الباقي خطوات تحتاج حسابك الشخصي في Apple.

## ١. حساب المطوّر (أنت، مرة واحدة)
1. ادخل developer.apple.com/programs/enroll بحساب Apple ID حقك، وسجّل كفرد (Individual).
2. الرسوم ٩٩ دولارًا سنويًا، والموافقة عادةً من يوم إلى يومين.
3. بعد الموافقة سجّل في **App Store Small Business Program** لتصير عمولة Apple ١٥٪ بدل ٣٠٪.
4. أكمل في App Store Connect: الاتفاقيات (Paid Apps Agreement) والحساب البنكي والضرائب، وبدونها لا تظهر عمليات الشراء.

## ٢. إنشاء التطبيق في App Store Connect
1. Apps ← New App: المنصة iOS، الاسم «نبيه - تدريب مقياس موهبة» أو «نبيه»، اللغة الأساسية Arabic، والـ Bundle ID: `com.bukhari.nabeeh` (أنشئه أولًا من developer.apple.com ← Identifiers).
2. Monetization ← In-App Purchases ← أنشئ منتجًا:
   - النوع: **Non-Consumable**
   - Product ID: `nabeeh.full` (يجب أن يطابق الكود)
   - السعر: Tier ٧٩٫٩٩ ريال تقريبًا
   - فعّل **Family Sharing** لتشمل الشراء أجهزة العائلة
   - أضف الاسم والوصف بالعربي والإنجليزي، وصورة لشاشة الشراء للمراجعة
3. App Privacy: اختر **Data Not Collected**، لأن نسخة الآيفون تحفظ كل شيء على الجهاز.
4. التصنيف العمري: 4+، والفئة: Education.

## ٣. مفتاح البناء الآلي
1. App Store Connect ← Users and Access ← Integrations ← App Store Connect API ← أنشئ مفتاحًا بصلاحية Admin ونزّل ملف `.p8`.
2. في مستودع nabeeh على GitHub ← Settings ← Secrets and variables ← Actions، أضف:
   - `APPLE_TEAM_ID`: من developer.apple.com ← Membership
   - `ASC_KEY_ID` و`ASC_ISSUER_ID`: من صفحة المفتاح
   - `ASC_KEY_P8_BASE64`: محتوى ملف `.p8` بعد تحويله إلى Base64
3. Actions ← «iOS build to TestFlight» ← Run workflow. بعد ٢٠ دقيقة تقريبًا تظهر النسخة في TestFlight.

## ٤. التجربة ثم الإرسال للمراجعة
1. جرّب التطبيق على جوالك من TestFlight، واشترِ بحساب Sandbox (Users and Access ← Sandbox).
2. أضف صور الشاشة (٦٫٧ إنش) والوصف، ثم Submit for Review.
3. المراجعة تأخذ عادةً من يوم إلى ثلاثة أيام.

## ما الفرق بين الويب والآيفون؟
| | الموقع | تطبيق الآيفون |
| --- | --- | --- |
| الدفع | كود تفعيل من Payhip | شراء من App Store بحساب Apple |
| العمولة | رسوم Payhip وPayPal | ١٥٪ لـ Apple |
| الحفظ | حساب ومزامنة عبر Firebase | على الجهاز، ومشاركة الشراء عبر Family Sharing |
| الاسترجاع | خلال ٢٤ ساعة إذا لم يُستخدم الكود | عن طريق Apple وفق سياستها |

تنبيه: شروط Apple تمنع وضع رابط شراء خارجي داخل تطبيق الآيفون، لذلك لا تظهر فيه صفحة البيع ولا خانة الكود.
