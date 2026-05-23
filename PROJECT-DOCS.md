# 🛵 طلباتك مكانك - دليل المشروع الحالي

هذا المشروع يحتوي على واجهة ثابتة وواجهة خلفية API قائمة على Node.js و Express.

---

## 📁 هيكل المجلدات (Folder Structure)

```
طلباتك مكانك/
│
├── admin-dashboard.html          # صفحة لوحة التحكم الإدارية الثابتة
├── index.html                    # صفحة الهبوط الثابتة
├── backend/                      # Node.js + Express API
│   ├── app.js                    # إعدادات Express وmiddlewares
│   ├── server.js                 # نقطة بدء التطبيق وSocket.IO
│   ├── .env                      # إعدادات البيئة (غير مدرج في التحكم بالمصدر)
│   ├── .env.example              # مثال إعدادات البيئة
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # تكوين MySQL وpool
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── customersController.js
│   │   │   ├── ordersController.js
│   │   │   ├── paymentsController.js
│   │   │   ├── restaurantsController.js
│   │   │   ├── reportsController.js
│   │   │   └── ridersController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validators.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── customers.routes.js
│   │   │   ├── orders.routes.js
│   │   │   ├── payments.routes.js
│   │   │   ├── reports.routes.js
│   │   │   ├── restaurants.routes.js
│   │   │   └── riders.routes.js
│   │   ├── services/
│   │   │   └── socketService.js
│   │   └── utils/
│   │       ├── helpers.js
│   │       └── validators.js
│
├── database/
│   └── schema.sql                # تعريف قاعدة البيانات
└── README.md
```

## 📌 حالة المشروع الحالية

- الواجهة الحالية عبارة عن صفحات HTML ثابتة (`index.html`, `admin-dashboard.html`).
- الـ backend يعمل كـ API ويدعم مسارات للمستخدمين، العملاء، المطاعم، الطلبات، المناديب، المدفوعات، والتقارير.
- أضفنا مسار لوحة قيادة جديد `GET /api/dashboard/overview` لعرض الإحصائيات وطلبات اليوم في `admin-dashboard.html`.
- أضفنا إمكانية تصدير التقارير:
  - `GET /api/reports/export/excel`
  - `GET /api/reports/export/pdf`
- تم إنشاء بيانات تجريبية في قاعدة البيانات لعرض الطلبات، العملاء، المطاعم، والمناديب على لوحة التحكم.
- الوثائق الأصلية كانت تشير إلى تطبيق React وملفات غير موجودة. هذه الوثائق تم تحديثها لتطابق الكود الفعلي.
- ملف `backend/.env.example` موجود ويحدد متغيرات البيئة اللازمة للاتصال بقاعدة البيانات وJWT.

## 🚀 تشغيل المشروع

### 1. إعداد قاعدة البيانات

- استخدم `database/schema.sql` لإنشاء الجداول.
- إذا كنت تستخدم Docker:
  ```bash
  docker compose -p talabatk up -d
  ```
- يمكن استيراد المخطط باستخدام Adminer أو CLI.

  إذا كنت تستخدم Docker Compose، استخدم الأمر التالي لاستيراد الملف:
  ```bash
  docker compose -p talabatk exec -T db sh -c 'mysql -u talabatk_user -ptalabatk_pass talabatk_db' < database/schema.sql
  ```

  وتأكد من ضبط `DB_HOST=db` في `backend/.env` عندما يعمل التطبيق مع خدمة MySQL داخل Docker.

### 2. إعداد بيئة الـ backend

- انسخ `backend/.env.example` إلى `backend/.env`
- عدّل القيم إذا لزم الأمر.

### 3. تشغيل السيرفر

```bash
cd backend
npm install
npm run dev
```

### 4. فتح الواجهة

- افتح `http://localhost:5000`
- صفحتا الويب الثابتة تُخدم تلقائياً من مجلد المشروع.
- للوصول إلى لوحة التحكم: `http://localhost:5000/admin-dashboard.html`

### 5. بيانات دخول الإدارة الافتراضية

- الهاتف: `01015819017`
- كلمة المرور: `Admin@123`

> هذا المستخدم يتم إنشاؤه بواسطة `backend/scripts/seed.js` إذا لم يكن موجوداً.

## ⚠️ ملاحظات حول التكامل

- الـ backend يعالج الطلبات الثابتة فقط، لكنه لا يتضمن واجهة React أو لوحة تحكم ديناميكية جاهزة.
- إذا كنت تريد استكمال المشروع عملياً، فيمكن العمل على:
  1. بناء واجهة مستخدم ديناميكية (React / Vue / Angular) بدلاً من الصفحات الثابتة.
  2. ربط `admin-dashboard.html` بـ API حقيقي باستخدام fetch أو Axios.
  3. إضافة طبقة صلاحيات أمامية وأدوار للمستخدمين.
  4. تنفيذ تصدير PDF/Excel في `reportsController`.

## 📌 ما تم تحديثه

- وثّقت البنية الحالية بدقة.
- أزلت الإشارة إلى ملفات ومجلدات غير موجودة في المشروع.
- حافظت على وصف يعتمد على الكود الفعلي الموجود في المستودع.

## ✅ اختبارات وCI

- تم إضافة اختبارات تكاملية بسيطة باستخدام `jest` و `supertest` في مجلد `backend/test`.
- لتشغيل الاختبارات محلياً:

```bash
cd backend
npm install
npm test
```

- تم إضافة Workflow لGitHub Actions في `.github/workflows/ci.yml` لتشغيل MySQL كخدمة، استيراد الـ schema، تنفيذ سكربتات الـ seed، ثم تشغيل الاختبارات عند كل `push`/`PR` لمجلد `backend`.

