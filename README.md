# Școala Voluntarilor

Curs online pentru voluntarii corului și ai evenimentelor pentru tineri din Timișoara: lecții scurte, teste și certificat.

**Site:** https://corneluu.github.io/voluntari/

## Cum modifici
- **Lecțiile și testele** sunt în `modules.js`.
- **Login și rezultate (Supabase):** urmează pașii din `config.js` și rulează `supabase.sql`.
- Faci push pe `main`, iar site-ul se actualizează în ~1 minut (GitHub Pages).

## Login cu Google
În Supabase → Authentication → Providers → Google, pui Client ID și Secret din Google Cloud Console.
În Google Cloud, adaugi ca redirect URI adresa de callback afișată de Supabase.
În Supabase → Authentication → URL Configuration, Site URL = `https://corneluu.github.io/voluntari/`.
