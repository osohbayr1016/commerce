# 🔐 Google нэвтрэх идэвхжүүлэх заавар

**Алдаа:** `Unsupported provider: provider is not enabled`

**Шалтгаан:** Supabase төсөлд Google OAuth идэвхгүй байна.

---

## 1️⃣ Google OAuth credentials авах (Google Cloud Console)

### 1.1 Төсөл үүсгэх / сонгох

1. **[Google Cloud Console](https://console.cloud.google.com/)** нээнэ
2. Дээд талын төсөл сонгогчоос төслөө сонгох эсвэл **"New Project"** дарж шинэ үүсгэнэ
3. Төслийн нэр өгөөд **Create** дарна

### 1.2 OAuth consent screen тохируулах

1. Зүүн цэс: **APIs & Services** → **OAuth consent screen**
2. **External** (хэрэглэгчид гаднаас нэвтрэх) эсвэл **Internal** (зөвхөн байгууллага) сонгоно
3. **Create** дарна
4. Дараах талбаруудыг бөглөнө:
   - **App name:** Жишээ: `My E-Commerce`
   - **User support email:** Таны имэйл
   - **Developer contact:** Таны имэйл
5. **Save and Continue** дарна
6. **Scopes** хэсэгт **Add or Remove Scopes** → `email`, `profile`, `openid` нэмээд **Update** → **Save and Continue**
7. **Test users** (External сонгосон бол) хэсэгт шаардлагатай бол нэмнэ
8. **Back to Dashboard** дарна

### 1.3 OAuth 2.0 Client ID үүсгэх

1. Зүүн цэс: **APIs & Services** → **Credentials**
2. **+ Create Credentials** → **OAuth client ID**
3. **Application type:** **Web application**
4. **Name:** Жишээ: `My E-Commerce Web`
5. **Authorized JavaScript origins** – **Add URI**:
   - Local: `http://localhost:3000`
   - Production: `https://your-domain.com` (таны вэбсайтын URL)
6. **Authorized redirect URIs** – **Add URI**:
   - Supabase-ийн Redirect URL-ийг **дараагийн алхамд** авч ирээд энд оруулна
7. **Create** дарна
8. **Client ID** болон **Client Secret**-ийг хуулж хадгална (дараа Supabase дээр оруулна)

---

## 2️⃣ Supabase дээр Google идэвхжүүлэх

### 2.1 Authentication → Providers

1. **[Supabase Dashboard](https://supabase.com/dashboard)** нээнэ
2. Төслөө сонгоно
3. Зүүн цэснээс **Authentication** → **Providers** руу орно

### 2.2 Google идэвхжүүлэх

1. **Providers** жагсаалтаас **Google**-ийг олно
2. **Google** дээр дарж нээнэ
3. **Enable Sign in with Google**-ийг **ON** болгоно
4. **Client ID** (Google-аас авсан) оруулна
5. **Client Secret** (Google-аас авсан) оруулна
6. **Save** дарна

### 2.3 Redirect URL шалгах

1. Supabase: **Authentication** → **URL Configuration**
2. **Site URL:** вэбсайтын үндсэн URL, жишээ: `https://your-site.com` эсвэл `http://localhost:3000`
3. **Redirect URLs** хэсэгт:
   - `http://localhost:3000/**`
   - `https://your-domain.com/**`
   гэх мэт зөвшөөрөгдсөн URL-ууд байгаа эсэхийг шалгана

Supabase Google provider дээр **Redirect URL** гэж харуулсан байдаг. Энэ URL-ийг **Google Cloud Console** → Credentials → OAuth client → **Authorized redirect URIs** дээр нэмсэн байх ёстой.

Ерөнхий хэлбэр:

```
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

`<PROJECT_REF>`-ийг Supabase Dashboard → Settings → General → **Reference ID**-аас харна.

---

## 3️⃣ Вэбсайт дээр Google товч хаана байдаг вэ?

- **Login:** `/auth/login` – доор нь "Google-ээр нэвтрэх" товч
- **Signup:** `/auth/signup` – доор нь "Google-ээр нэвтрэх" товч

Имэйл/нууц үг оруулах форм доор, "эсвэл" тусгаарлагчийн доор байрлана.

---

## 4️⃣ Шалгах

1. `npm run dev` ажиллуулна
2. **http://localhost:3000/auth/login** нээнэ
3. Доош scroll хийж **"Google-ээр нэвтрэх"** товчийг харна
4. Товч дарж Google-аар нэвтрэхийг оролдоно

Хэрэв алдаа гарсаар байвал:
- Supabase → **Authentication** → **Providers** → **Google** идэвхтэй эсэх
- **Client ID** / **Client Secret** зөв хуулсан эсэх
- Google Console → **Authorized redirect URIs**-д Supabase `.../auth/v1/callback` URL нэмэгдсэн эсэх
- **Site URL** болон **Redirect URLs** зөв тохируулагдсан эсэхийг дахин шалгана.

---

## 📋 Товч жагсаалт

| Алхам | Хийх зүйл |
|-------|-----------|
| 1 | Google Cloud Console → OAuth consent screen тохируулах |
| 2 | Credentials → OAuth client ID (Web) үүсгэх |
| 3 | Authorized redirect URIs-д `https://<PROJECT_REF>.supabase.co/auth/v1/callback` нэмэх |
| 4 | Supabase → Authentication → Providers → Google идэвхжүүлэх |
| 5 | Client ID, Client Secret оруулах, Save |
| 6 | Login / Signup хуудсаар Google-ээр нэвтрэж турших |

---

**Асуудал үргэлжилбэл:** Supabase **Logs** → **Auth** хэсгээс алдааны дэлгэрэнгүйг шалгаарай.
