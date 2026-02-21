# Instrukcja wdrożenia aplikacji Ignis Events

## Spis treści
1. [Wymagania wstępne](#wymagania-wstępne)
2. [Wdrożenie na Vercel](#vercel)
3. [Wdrożenie na Netlify](#netlify)
4. [Wdrożenie na Surge](#surge)
5. [Rozwiązywanie problemów](#problemy)

---

## Wymagania wstępne

### Zmienne środowiskowe
Utwórz plik `.env` w katalogu głównym projektu z następującymi zmiennymi:

```
VITE_BASE44_APP_ID=twoj_app_id
VITE_BASE44_ACCESS_TOKEN=twoj_access_token
VITE_BASE44_FUNCTIONS_VERSION=v1
VITE_BASE44_APP_BASE_URL=https://api.base44.com
```

**Jak zdobyć te zmienne:**
- Zaloguj się do panelu Base44
- Przejdź do ustawień aplikacji
- Skopiuj App ID i Access Token

---

## Wdrożenie na Vercel

### Opcja 1: Przez GitHub (zalecana)

1. **Przejdź do Vercel**
   - Otwórz https://vercel.com
   - Zaloguj się przez GitHub

2. **Dodaj projekt**
   - Kliknij "Add New..." → "Project"
   - Wybierz repozytorium `ignisevents` z GitHub

3. **Konfiguracja projektu**
   - Framework Preset: `Vite` (wykryje automatycznie)
   - Build Command: `npm run build` (lub pozostaw puste)
   - Output Directory: `dist` (domyślnie dla Vite)

4. **Zmienne środowiskowe**
   - W sekcji "Environment Variables" dodaj (każda w osobnym wierszu):
     - `VITE_BASE44_APP_ID` = `6989edde65063fc06a55765d`
     - `VITE_BASE44_ACCESS_TOKEN` = `062e5cf56d324c539922ea2aa2ee05a3`
     - `VITE_BASE44_FUNCTIONS_VERSION` = `v1`
     - `VITE_BASE44_APP_BASE_URL` = `https://api.base44.com`

5. **Wdróż**
   - Kliknij "Deploy"
   - Poczekaj na zakończenie budowania

### Opcja 2: Przez Vercel CLI

```
bash
# 1. Zainstaluj Vercel CLI
npm i -g vercel

# 2. Zaloguj się
vercel login

# 3. Przejdź do projektu i wdróż
cd ignisevents
vercel --prod
```

### Konfiguracja dodatkowa (dla React Router)

Jeśli używasz React Router i otrzymujesz błędy 404 po odświeżeniu strony, utwórz plik `vercel.json`:

```
json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## Wdrożenie na Netlify

### Przez GitHub

1. Otwórz https://netlify.com
2. Kliknij "Add new site" → "Import an existing project"
3. Wybierz repozytorium z GitHub
4. Konfiguracja:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Dodaj zmienne środowiskowe (takie same jak dla Vercel)
6. Kliknij "Deploy site"

### Przez Netlify CLI

```
bash
# 1. Zainstaluj Netlify CLI
npm i -g netlify-cli

# 2. Zbuduj projekt
npm run build

# 3. Wdróż
netlify deploy --prod --dir=dist
```

---

## Wdrożenie na Surge

### Instalacja i wdrożenie

```
bash
# 1. Zainstaluj Surge
npm i -g surge

# 2. Zbuduj projekt
npm run build

# 3. Wdróż (zostaniesz poproszony o zalogowanie)
surge dist twoja-domena.surge.sh
```

**Uwaga:** Domena musi być unikalna. Możesz użyć dowolnej nazwy.

---

## Wdrożenie na Cloudflare Pages

1. Przejdź do https://pages.cloudflare.com
2. Dodaj projekt z GitHub
3. Konfiguracja:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Dodaj zmienne środowiskowe z prefiksem `VITE_`
5. Wdróż

---

## Rozwiązywanie problemów

### Błąd 404 po odświeżeniu strony
- Dodaj plik konfiguracyjny dla swojego hostingu (vercel.json, netlify.toml)
- Upewnij się, że używasz `<BrowserRouter basename="/">` w React Router

### Problemy z Base44 API
- Sprawdź czy zmienne środowiskowe mają prefiks `VITE_`
- Zweryfikuj w panelu hostingu, czy zmienne są poprawnie ustawione
- Sprawdź czy App ID i Access Token są poprawne

### Błędy budowania
- Uruchom `npm run build` lokalnie, aby zobaczyć błędy
- Sprawdź wersję Node.js (wymagane Node.js 18+)
- Upewnij się, że wszystkie zależności są zainstalowane (`npm install`)

### Problem z CORS
- Jeśli masz problemy z CORS, sprawdź ustawienia w panelu Base44
- Dodaj domenę swojego hostingu do dozwolonych źródeł w Base44

---

## Dostęp do panelu admina

### Dane logowania
- **Login:** `ignis_admin`
- **Hasło:** `IgnisEvents2026!`

### Jak wejść do panelu admina?
1. Po wdrożeniu aplikacji, przejdź pod adres: `twoja-domena.vercel.app/AdminDashboard`
2. Zaloguj się używając powyższych danych
3. Po zalogowaniu będziesz miał dostęp do:
   - Panel główny (AdminDashboard)
   - Zarządzanie wydarzeniami (AdminEvents)
   - Zarządzanie usługami (AdminServices)
   - Zarządzanie galerią (AdminGallery)
   - Zarządzanie opiniami (AdminTestimonials)
   - Wiadomości (AdminMessages)
   - Ustawienia strony (AdminSettings)

**Uwaga:** Dane logowania są zakodowane w pliku `src/lib/adminAuth.js`. Po wdrożeniu upewnij się, że hasło jest bezpieczne i rozważ jego zmianę przed publicznym udostępnieniem aplikacji.

---

## Lista komend do zapamiętania

```
bash
# Budowanie projektu
npm run build

# Podgląd lokalny
npm run preview

# Testowanie deweloperskie
npm run dev
```

---

## Wdrożenie aktualizacji

Po wprowadzeniu zmian w kodzie:

1. **Vercel:** Automatycznie wdroży po push do GitHub
2. **Netlify:** Automatycznie wdroży po push do GitHub
3. **Surge:** Uruchom `surge dist` ponownie

---

## Własna domena

Po wdrożeniu możesz podłączyć własną domenę w panelu wybranego hostingu:
- Vercel: Settings → Domains
- Netlify: Domain management → Custom domains
- Cloudflare: Custom domains → Add domain

**Ważne:** Po dodaniu domeny zaktualizuj ustawienia DNS zgodnie z instrukcjami hostingu.
