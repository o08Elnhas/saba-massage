# 🚀 رفع المشروع على GitHub - GitHub Deployment Guide

## الخطوة 1️⃣: إنشاء مستودع على GitHub

1. اذهب إلى [github.com/new](https://github.com/new)
2. **اسم المستودع:** `saba-massage` (أو أي اسم تختاره)
3. **الوصف:** Saba Massage Center - Full Stack Web Application
4. **الخصوصية:** Public (عام) أو Private (خاص) حسب تفضيلك
5. ❌ **لا تختر** "Add README", "Add .gitignore", أو "Choose a license" (موجودة بالفعل)
6. انقر **Create repository**

---

## الخطوة 2️⃣: ربط المستودع المحلي بـ GitHub

بعد إنشاء المستودع، ستظهر تعليمات. تابع هذه الخطوات:

```bash
# في مجلد المشروع
cd ~/path/to/saba-massage

# إذا كان Git مهيأ بالفعل، استخدم:
git remote set-url origin https://github.com/YOUR_USERNAME/saba-massage.git

# أو إذا لم يكن مهيأ:
git init
git add .
git commit -m "Initial commit - Saba Massage Center application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/saba-massage.git
```

---

## الخطوة 3️⃣: رفع الكود على GitHub

```bash
git push -u origin main
```

> 📝 **ملاحظة:** سيطلب منك كلمة مرور أو token. استخدم Personal Access Token:
> - اذهب إلى [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
> - اختر "Tokens (classic)"
> - انقر "Generate new token"
> - اختر scopes: `repo`, `workflow`
> - انسخ الـ token واستخدمه كـ password

---

## الخطوة 4️⃣: التحقق من الرفع

```bash
git remote -v
git log --oneline -5
git push origin main --dry-run  # اختياري: تحقق قبل الرفع النهائي
```

---

## ملفات مهمة في المشروع

```
📦 saba-massage/
├── 📄 README.md              ← اقرأ هذا أولاً
├── 📄 SETUP_LOCAL.md         ← تشغيل محلي
├── 📄 GITHUB_DEPLOYMENT.md   ← هذا الملف
├── 📄 .env.example           ← متغيرات البيئة (المثال)
├── 📄 .gitignore             ← ملفات مخفية من GitHub
├── 📄 package.json           ← المكتبات
├── 📄 tsconfig.json          ← إعدادات TypeScript
├── 📄 tailwind.config.ts     ← إعدادات Tailwind CSS
│
├── 📁 client/                ← الواجهة الأمامية (React)
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
│
├── 📁 server/                ← الخادم الخلفي (Express)
│   ├── routes.ts             ← API endpoints
│   ├── storage.ts            ← قاعدة البيانات
│   └── index.ts              ← نقطة البداية
│
└── 📁 shared/                ← كود مشترك
    └── schema.ts             ← نماذج البيانات
```

---

## ✅ قائمة التحقق قبل الرفع

تأكد من:

- ✅ ملف `.env` **لا يوجد** في المشروع (استخدم `.env.example` بدلاً منه)
- ✅ ملف `node_modules` **لا يوجد** في المشروع (موجود في `.gitignore`)
- ✅ ملف `.git` موجود وفيه commits
- ✅ جميع الملفات الأساسية موجودة (README, SETUP_LOCAL, schema.ts, routes.ts)

### تحقق برمياً:

```bash
# تأكد من أن .env لا تُرفع
git check-ignore .env
# يجب أن يطبع: .env

# تأكد من أن node_modules لا تُرفع
git check-ignore node_modules
# يجب أن يطبع: node_modules

# شاهد ما سيتم رفعه
git ls-files | head -20
```

---

## 🔒 حماية البيانات الحساسة

**⚠️ خطير: لا تُرفع هذه الملفات أبداً:**

```
❌ .env (يحتوي على DATABASE_URL, SESSION_SECRET)
❌ node_modules/
❌ .local/
❌ أي ملفات بكلمة مرور أو API keys
```

**✅ بدلاً منها، استخدم:**

```
✅ .env.example (بدون قيم حقيقية)
✅ SETUP_LOCAL.md (شرح كيفية الإعداد)
✅ README.md (التوثيق العام)
```

---

## 🌐 نشر التطبيق على الإنترنت

بعد رفع الكود، يمكنك نشره على:

### الخيار 1: **Replit** (سهل جداً)
1. اذهب إلى [replit.com](https://replit.com)
2. اختر "Import from GitHub"
3. اختر `YOUR_USERNAME/saba-massage`
4. اضف متغيرات البيئة
5. اضغط "Deploy"

### الخيار 2: **Heroku** (مجاني محدود)
```bash
heroku create saba-massage
git push heroku main
```

### الخيار 3: **Railway** (سهل وموثوق)
1. اذهب إلى [railway.app](https://railway.app)
2. اختر "Deploy from GitHub"
3. اختر المستودع
4. أضف PostgreSQL
5. Deploy!

### الخيار 4: **DigitalOcean App Platform**
1. اذهب إلى [digitalocean.com](https://digitalocean.com)
2. App Platform → Create App
3. اختر GitHub
4. اتبع الخطوات

---

## 📋 متطلبات النشر

جميع الخدمات أعلاه تحتاج:

```env
# متغيرات البيئة المطلوبة
DATABASE_URL=postgresql://user:pass@host:port/db
SESSION_SECRET=secure-random-string-here
REPL_ID=your-replit-id (لـ Replit فقط)
ISSUER_URL=https://replit.com/oidc (لـ Replit فقط)
```

---

## 🐛 استكشاف الأخطاء

### ❌ خطأ: `fatal: not a git repository`

```bash
cd ~/path/to/saba-massage
git init
git add .
git commit -m "Initial commit"
```

### ❌ خطأ: `Permission denied (publickey)`

استخدم SSH key أو Personal Access Token:

```bash
# استخدم HTTPS بدلاً من SSH
git remote set-url origin https://github.com/YOUR_USERNAME/saba-massage.git
```

### ❌ خطأ: `node_modules` أو `.env` تُرفع

```bash
# احذفها من Git
git rm -r --cached node_modules
git rm --cached .env
git add .gitignore
git commit -m "Remove sensitive files"
git push
```

---

## 📚 موارد مفيدة

- [GitHub Documentation](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)

---

## ✨ الخطوات التالية بعد الرفع

1. ✅ اضف README.md وصورة للمشروع
2. ✅ أضف GitHub Actions لـ CI/CD
3. ✅ أضف نظام اختبارات
4. ✅ وثّق الـ API
5. ✅ انشر على الإنترنت

---

## 🎉 تم بنجاح!

مشروعك الآن على GitHub وجاهز للعالم! 🌍

**استمتع بتطويرك!** 💚
