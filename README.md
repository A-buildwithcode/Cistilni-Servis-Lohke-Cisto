# Lohke Čisto - Spletna stran

Profesionalna spletna stran za čistilni servis Lohke Čisto.

## Funkcionalnosti

- ✅ Moderna, uglajena spletna stran z animacijami
- ✅ Responsive dizajn za vse naprave
- ✅ Kontaktna forma za povpraševanja
- ✅ Avtomatsko pošiljanje emailov preko EmailJS
- ✅ Profesionalen dizajn z gradienti in animacijami

## Nastavitev

### 1. Telefonska številka

Odprite `index.html` in zamenjajte telefonsko številko na dveh mestih:

```html
<!-- Vrstica 138 in 192 -->
<a href="tel:+386XXXXXXXXX" class="phone-link">+386 XX XXX XXX</a>
```

Zamenjajte `+386XXXXXXXXX` in `+386 XX XXX XXX` z vašo telefonsko številko.

### 2. EmailJS nastavitev (za kontaktno formo)

Kontaktna forma uporablja EmailJS za pošiljanje emailov. Vaš email naslov ne bo viden na spletni strani.

#### Korak 1: Ustvarite EmailJS račun
1. Pojdite na https://www.emailjs.com/
2. Ustvarite brezplačen račun (200 emailov/mesec)
3. Prijavite se v svoj račun

#### Korak 2: Dodajte Email Service
1. V EmailJS dashboardu pojdite na "Email Services"
2. Kliknite "Add New Service"
3. Izberite svoj email provider (Gmail, Outlook, itd.)
4. Sledite navodilom za povezavo
5. Zapišite si **Service ID**

#### Korak 3: Ustvarite Email Template
1. Pojdite na "Email Templates"
2. Kliknite "Create New Template"
3. Uporabite naslednji template:

**Subject:** Novo povpraševanje - Lohke Čisto

**Content:**
```
Novo povpraševanje preko spletne strani

Ime in priimek: {{from_name}}
Vrsta prostora: {{property_type}}
Kvadratura: {{area}}
Dodatno sporočilo: {{message}}

---
To sporočilo je bilo poslano preko kontaktne forme na spletni strani.
```

4. V "Settings" nastavite:
   - **To Email:** Vaš email naslov
   - **From Name:** {{from_name}}
   - **Reply To:** (pustite prazno ali dodajte polje za email, če ga želite)

5. Zapišite si **Template ID**

#### Korak 4: Pridobite Public Key
1. Pojdite na "Account" → "General"
2. Zapišite si **Public Key**

#### Korak 5: Nastavite v JavaScript
Odprite `script.js` in zamenjajte naslednje vrednosti (vrstice 25-28):

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Vaš Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Vaš Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Vaš Public Key
const YOUR_EMAIL = 'your-email@example.com'; // Vaš email (ne bo viden)
```

### 3. Testiranje

1. Odprite `index.html` v brskalniku
2. Izpolnite kontaktno formo
3. Preverite, ali ste prejeli email

## Struktura datotek

```
.
├── index.html      # Glavna HTML datoteka
├── styles.css      # Stilizacija in animacije
├── script.js       # JavaScript funkcionalnost
└── README.md       # Ta datoteka
```

## Funkcionalnosti forme

Kontaktna forma zbira:
- Ime in priimek (obvezno)
- Vrsta prostora: Stanovanjski ali Poslovni (obvezno)
- Kvadratura v m² (obvezno)
- Dodatno vprašanje ali opomba (neobvezno)

Vsi podatki se pošljejo na vaš email preko EmailJS.

## Podpora

Če imate težave z nastavitvijo EmailJS, si oglejte:
- EmailJS dokumentacijo: https://www.emailjs.com/docs/
- EmailJS video navodila: https://www.emailjs.com/docs/examples/

## Licenca

© 2024 Lohke Čisto. Vse pravice pridržane.