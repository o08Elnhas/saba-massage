# مركز سبأ للمساج - Saba Massage Center

تطبيق ويب متكامل لمركز سبأ للمساج مع لوحة تحكم إدارية لإدارة العروض والمحتوى.

## المميزات

- **صفحة رئيسية جذابة** - عرض العروض والباقات المتاحة
- **نظام حجز تفاعلي** - مع خريطة لتحديد الموقع وإرسال عبر WhatsApp
- **لوحة تحكم إدارية** - لإدارة العروض والإعدادات بالكامل
- **تصميم عربي (RTL)** - واجهة مستخدم احترافية بالعربية
- **نظام مصادقة آمن** - باستخدام Replit Auth
- **قاعدة بيانات PostgreSQL** - لحفظ البيانات بشكل دائم

---

## التركيب على سيرفر محلي

### المتطلبات

- Node.js 18 أو أحدث
- PostgreSQL 14 أو أحدث
- npm أو yarn

### خطوات التركيب

#### 1. استنساخ المشروع

```bash
git clone https://github.com/YOUR_USERNAME/saba-massage.git
cd saba-massage
```

#### 2. تثبيت المكتبات

```bash
npm install
```

#### 3. إعداد قاعدة البيانات

أنشئ قاعدة بيانات PostgreSQL جديدة:

```sql
CREATE DATABASE saba_massage;
```

#### 4. إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي:

```env
# قاعدة البيانات
DATABASE_URL=postgresql://username:password@localhost:5432/saba_massage

# الجلسات
SESSION_SECRET=your-secure-secret-key-here

# للتطوير المحلي (اختياري - يمكن تجاهله للتشغيل المحلي)
REPL_ID=local-dev
ISSUER_URL=https://replit.com/oidc
```

#### 5. تهيئة قاعدة البيانات

```bash
npm run db:push
```

#### 6. تشغيل التطبيق

```bash
# للتطوير
npm run dev

# للإنتاج
npm run build
npm start
```

التطبيق سيعمل على: `http://localhost:5000`

---

## الرفع على GitHub

### 1. إنشاء مستودع جديد

1. اذهب إلى [github.com/new](https://github.com/new)
2. أنشئ مستودع جديد باسم `saba-massage`
3. لا تضف README أو .gitignore (سنرفع الموجودين)

### 2. ربط المشروع بـ GitHub

```bash
# تهيئة Git (إذا لم يكن موجوداً)
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "Initial commit - Saba Massage Center"

# ربط المستودع
git remote add origin https://github.com/YOUR_USERNAME/saba-massage.git

# رفع الكود
git push -u origin main
```

### 3. حماية المعلومات الحساسة

تأكد من أن `.gitignore` يحتوي على:

```
.env
node_modules/
dist/
```

---

## هيكل المشروع

```
├── client/                 # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── components/     # المكونات المشتركة
│   │   ├── hooks/          # React Hooks
│   │   ├── lib/            # الأدوات المساعدة
│   │   ├── pages/          # صفحات التطبيق
│   │   │   ├── admin/      # صفحات لوحة التحكم
│   │   │   ├── landing.tsx # الصفحة الرئيسية للزوار
│   │   │   ├── home.tsx    # الصفحة الرئيسية للمسجلين
│   │   │   └── booking.tsx # صفحة الحجز
│   │   └── App.tsx         # المكون الرئيسي
│   └── index.html
├── server/                 # الخادم (Express)
│   ├── db.ts               # اتصال قاعدة البيانات
│   ├── routes.ts           # مسارات API
│   ├── storage.ts          # طبقة البيانات
│   └── replitAuth.ts       # نظام المصادقة
├── shared/                 # الكود المشترك
│   └── schema.ts           # نماذج البيانات (Drizzle)
└── package.json
```

---

## API Endpoints

### العروض

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/offers` | جلب جميع العروض |
| GET | `/api/offers/:id` | جلب عرض محدد |
| POST | `/api/offers` | إضافة عرض (مسؤول) |
| PUT | `/api/offers/:id` | تعديل عرض (مسؤول) |
| DELETE | `/api/offers/:id` | حذف عرض (مسؤول) |
| PATCH | `/api/offers/:id/toggle` | تفعيل/تعطيل عرض (مسؤول) |

### الإعدادات

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/settings` | جلب جميع الإعدادات |
| POST | `/api/settings/bulk` | تحديث الإعدادات (مسؤول) |

### المصادقة

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/login` | بدء تسجيل الدخول |
| GET | `/api/logout` | تسجيل الخروج |
| GET | `/api/auth/user` | معلومات المستخدم الحالي |

---

## جعل مستخدم مسؤولاً

للوصول للوحة التحكم، يجب جعل المستخدم مسؤولاً:

```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

أو باستخدام معرف المستخدم:

```sql
UPDATE users SET is_admin = true WHERE id = 'user-id-here';
```

---

## التقنيات المستخدمة

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect)
- **Maps**: Leaflet, React-Leaflet

---

## الترخيص

هذا المشروع للاستخدام الخاص. جميع الحقوق محفوظة.

---

## الدعم

للمساعدة أو الاستفسارات، تواصل عبر:
- WhatsApp: +966 50 826 5296
- Facebook: [SabaSpaCenter](https://facebook.com/SabaSpaCenter)
