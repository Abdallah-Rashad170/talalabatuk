# طلباتك مكانك

مشروع واجهة موقع تسليم الطلبات مع لوحة تحكم إدارية.

## المجلدات الحالية
- `index.html` — صفحة الهبوط الرئيسية
- `admin-dashboard.html` — واجهة لوحة تحكم إدارية
- `backend/` — هيكل مشروع Node.js + Express API
- `database/schema.sql` — تعريف قاعدة البيانات

## تشغيل المشروع
### تشغيل الواجهة الثابتة
يمكنك فتح `index.html` و `admin-dashboard.html` مباشرة في المتصفح.

### تشغيل الـ backend
من الجذر:
```bash
npm install
npm run backend:dev
```

أو من داخل مجلد `backend`:
1. افتح terminal في مجلد `backend`
2. نفذ:
   ```bash
   npm install
   ```
3. أنشئ ملف `.env` بناءً على `.env.example`
4. شغل السيرفر:
   ```bash
   npm run dev
   ```
5. افتح متصفحك على `http://localhost:5000` لعرض صفحة الهبوط.
6. للوصول إلى لوحة التحكم جرب `http://localhost:5000/admin-dashboard.html`.
7. متاحة أيضاً واجهات تقرير الإدارة:
   - `GET /api/reports/export/excel`
   - `GET /api/reports/export/pdf`

### تشغيل قاعدة بيانات محلياً باستخدام Docker
إذا ليس لديك MySQL محلياً، يمكنك تشغيل حاوية جاهزة عبر Docker Compose.

1. ابدأ Docker Desktop على جهازك.
2. ثم شغل الأمر:

```bash
docker compose -p talabatk up -d
```
إذا فشل هذا الأمر بسبب أن المنفذ `3306` مشغولاً، فقد يكون لديك خدمة MySQL محلية أو XAMPP تعمل. أوقف تلك الخدمة أولاً، ثم أعد تشغيل الأمر.

3. افتح `http://localhost:8080` للوصول إلى Adminer (واجهة إدارة قواعد البيانات)،
   واتصل بـ:

   - System: MySQL
   - Server: db
   - Username: talabatk_user
   - Password: talabatk_pass
   - Database: talabatk_db

> ملاحظة: إذا كنت تستخدم Docker Compose من الجهاز المضيف، استخدم `DB_HOST=127.0.0.1` و `DB_PORT=3307` في `backend/.env` لأن خدمة MySQL داخل Compose تُحجب عن طريق المنفذ المحلي `3307`.
>
> إذا كان لديك خادم MySQL محلي آخر على `3306` (مثل XAMPP)، فهذا يمنع Docker من استخدام ذلك المنفذ مباشرة.
>
> إذا كنت تريد تشغيل الـ backend داخل Docker نفسها، فاستخدم `DB_HOST=db` و `DB_PORT=3306` بدلاً من ذلك.

4. بعد تشغيل القاعدة، استورد الملف `database/schema.sql` من داخل Adminer أو باستخدام CLI.

   إذا كنت تستخدم Docker Compose، يمكنك استيراد الملف مباشرة بالأمر التالي:

   ```bash
   docker compose -p talabatk exec -T db sh -c 'mysql -u talabatk_user -ptalabatk_pass talabatk_db' < database/schema.sql
   ```

إذا ظهرت رسالة خطأ تتعلق بعدم وجود Docker daemon أو الاتصال بـ `docker API`، فافتح Docker Desktop أولاً ثم أعد تنفيذ الأمر.

## بنية الـ backend
- `backend/app.js` — إعدادات Express ووسطائها
- `backend/server.js` — نقطة بدء التطبيق
- `backend/src/routes` — مسارات API
- `backend/src/controllers` — منطق التحكم
- `backend/src/config` — إعدادات قاعدة البيانات
- `backend/src/middleware` — حماية التوكن

## ملاحظة
الواجهة الحالية تعمل كصفحات ثابتة، والـ backend يوفر البنية الأساسية لإضافة REST API لاحقاً.

## اختبارات وCI

- لتشغيل اختبارات الـ backend محلياً من داخل مجلد `backend`:

```bash
npm install
npm test
```

- تم إضافة ملف GitHub Actions لتشغيل الاختبارات تلقائياً عند كل `push`/`PR` على مجلد `backend`.
   - Workflow: `.github/workflows/ci.yml`
   - يقوم بتشغيل MySQL كخدمة، يستورد الـ schema ويشغل سكربتات الـ seed ثم ينفذ `npm test`.

- حالة CI: شغّل التغييرات محلياً ونجحت جميع الاختبارات. بعد دفع هذا الفرع سيتنفّذ الـ workflow تلقائياً.

![CI status](https://github.com/Abdallah-Rashad170/talalabatuk/actions/workflows/ci.yml/badge.svg)


