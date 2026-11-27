# ⚿ CryptoPlayground

منصة تفاعلية مفتوحة المصدر لتعليم علم التشفير بالتجربة — كله بيشتغل جوه المتصفح، من غير سيرفر ولا تسجيل.

**Learn cryptography by doing.** An open-source, browser-only interactive playground: classical ciphers, symmetric encryption (AES), hashing, and (soon) public-key, signatures, post-quantum crypto and an attacks lab. Arabic-first explanations with English technical terms, self-graded challenges, and a 3D interactive design.

## المسارات (Roadmap)

| # | Module | Status |
|---|--------|--------|
| 1 | Classical ciphers (Caesar, Vigenère, frequency analysis) | ✅ متاح |
| 2 | Symmetric encryption (XOR, AES, ECB vs CBC) | ✅ متاح |
| 3 | Hash functions (SHA-256, avalanche, password hashing) | ✅ متاح |
| 4 | Public-key (RSA, DH, ECC) | ✅ متاح |
| 5 | Digital signatures (ECDSA, Dilithium) | ✅ متاح |
| 6 | Post-quantum (Kyber, lattices, Shor) | ✅ متاح |
| 7 | Attacks lab (padding oracle, weak keys, nonce reuse) | ✅ متاح |

## التشغيل محلياً (Run locally)

موقع static بالكامل — أي static server يكفي:

```bash
# Python
python3 -m http.server 8000

# أو Node
npx serve .
```

ثم افتح `http://localhost:8000`.

## التقنيات

- HTML/CSS/JS خالص، بدون أي build step
- [Three.js](https://threejs.org) لمشهد الـ lattice ثلاثي الأبعاد في الصفحة الرئيسية
- Web Crypto API (`crypto.subtle`) لحساب SHA-256 وتصحيح التحديات (الإجابات مخزنة كـ hashes، مش نصوص)
- `localStorage` لحفظ النقاط والتقدم على جهاز المستخدم فقط

## المساهمة

المشروع معمول عشان يكبر بالمجتمع: أضف مسار جديد، حسّن شرح، أو اقترح تحدي. كل مسار عبارة عن صفحة واحدة في `modules/` بنفس الستايل.

## License

MIT
