# 🚀 تشغيل المشروع محلياً - Local Setup Guide

## المتطلبات - Requirements

- **Node.js** 18+ ([تحميل](https://nodejs.org/))
- **PostgreSQL** 14+ ([تحميل](https://www.postgresql.org/download/))
- **npm** أو **yarn**

---

## خطوات التركيب المحلي

### 1️⃣ استنساخ المشروع

```bash
git clone https://github.com/YOUR_USERNAME/saba-massage.git
cd saba-massage
```

### 2️⃣ تثبيت المكتبات

```bash
npm install
```

### 3️⃣ إعداد قاعدة البيانات

#### A) إنشاء قاعدة البيانات

افتح PostgreSQL وقم بتنفيذ:

```sql
CREATE DATABASE saba_massage;
```

#### B) إنشاء ملف المتغيرات البيئية

انسخ `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

**ثم حرّر `.env` وأضف بيانات اتصالك:**

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/saba_massage
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=saba_massage
SESSION_SECRET=my-super-secret-key-12345
```

> ⚠️ **هام:** استخدم كلمة مرور قوية و SESSION_SECRET عشوائية وآمنة

### 4️⃣ تشغيل هجرة قاعدة البيانات

```bash
npm run db:push
```

هذا سينشئ جميع الجداول تلقائياً ويملأ البيانات الأولية.

### 5️⃣ تشغيل التطبيق

```bash
npm run dev
```

ستظهر رسالة:
```
[express] serving on port 5000
```

افتح المتصفح وتوجه إلى: **http://localhost:5000**

---

## خطوات تشغيل منفصلة (إذا أردت)

```bash
# الخادم الخلفي فقط
npm run server

# الواجهة الأمامية فقط (في terminal منفصل)
npm run client
```

---

## جعل مستخدم مسؤولاً (Admin)

الأول من يسجل دخول يصبح مسؤول تلقائياً.

لتعديل المسؤول يدويًا في قاعدة البيانات:

```bash
# افتح psql
psql -h localhost -U postgres -d saba_massage

# ثم نفذ:
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';

# أو باستخدام معرف المستخدم:
UPDATE users SET is_admin = true WHERE id = 'user-id';
```

---

## استكشاف الأخطاء

### ❌ خطأ: `connection refused`

```bash
# تأكد من تشغيل PostgreSQL
# على Windows: Services → PostgreSQL

# أو على macOS:
brew services start postgresql

# أو على Linux:
sudo service postgresql start
```

### ❌ خطأ: `database does not exist`

```bash
# تأكد من إنشاء قاعدة البيانات
psql -U postgres -c "CREATE DATABASE saba_massage;"
```

### ❌ خطأ: `PORT 5000 already in use`

غير المنفذ في `server/index.ts`:

```typescript
const PORT = 5001; // بدلاً من 5000
```

---

## هيكل المشروع

```
saba-massage/
├── client/              # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── components/  # مكونات React
│   │   ├── pages/       # الصفحات
│   │   └── App.tsx      # تطبيق رئيسي
│   └── index.html
├── server/              # الخادم (Express)
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # طبقة البيانات
│   └── db.ts            # اتصال قاعدة البيانات
├── shared/              # الكود المشترك
│   └── schema.ts        # نماذج البيانات
└── package.json
```

---

## الأوامر المهمة

```bash
# تطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# تحديث قاعدة البيانات
npm run db:push

# عرض قاعدة البيانات (Drizzle Studio)
npm run db:studio

# تحقق من التصحيحات
npm run lint

# اختبار البناء
npm run build && npm start
```

---

## النقاط الهامة للإنتاج

قبل النشر، تأكد من:

1. ✅ تغيير `SESSION_SECRET` إلى قيمة عشوائية آمنة
2. ✅ استخدام كلمة مرور قوية لـ PostgreSQL
3. ✅ تفعيل HTTPS
4. ✅ تعيين متغيرات البيئة الآمنة
5. ✅ عدم حفظ `.env` على GitHub

---

## التواصل والدعم

للمساعدة:
- 📧 البريد الإلكتروني
- 📱 WhatsApp: +966 50 826 5296
- 📘 Facebook: [SabaSpaCenter](https://facebook.com/SabaSpaCenter)

**استمتع بتطويرك!** 🎉
