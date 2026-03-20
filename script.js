const languages = {
    "af": "Afrikaans", "sq": "Shqip", "am": "አማርኛ", "ar": "العربية", "hy": "Հայերեն", "az": "Azərbaycanca", "eu": "Euskara", "be": "Беларуская", "bn": "বাংলা", "bs": "Bosanski", "bg": "Български", "ca": "Català", "ceb": "Cebuano", "ny": "Chichewa", "zh-CN": "简体中文", "zh-TW": "繁體中文", "co": "Corsu", "hr": "Hrvatski", "cs": "Čeština", "da": "Dansk", "nl": "Nederlands", "en": "English", "eo": "Esperanto", "et": "Eesti", "tl": "Filipino", "fi": "Suomi", "fr": "Français", "fy": "Frysk", "gl": "Galego", "ka": "ქართული", "de": "Deutsch", "el": "Ελληνικά", "gu": "ગુજરાતી", "ht": "Kreyòl Ayisyen", "ha": "Hausa", "haw": "Ōlelo Hawaiʻi", "iw": "עברית", "hi": "हिन्दी", "hmn": "Hmong", "hu": "Magyar", "is": "Íslenska", "ig": "Igbo", "id": "Bahasa Indonesia", "ga": "Gaeilge", "it": "Italiano", "ja": "日本語", "jw": "Basa Jawa", "kn": "ಕನ್ನಡ", "kk": "Қазақ тілі", "km": "ខ្មែរ", "ko": "한국어", "ku": "Kurdî", "ky": "Кыргызча", "lo": "ລາວ", "la": "Latina", "lv": "Latviešu", "lt": "Lietuvių", "lb": "Lëtzebuergesch", "mk": "Македонски", "mg": "Malagasy", "ms": "Bahasa Melayu", "ml": "മലയാളം", "mt": "Malti", "mi": "Māori", "mr": "मराठी", "mn": "Монгол", "my": "ဗမာ", "ne": "नेपाली", "no": "Norsk", "ps": "پښتو", "fa": "فارسی", "pl": "Polski", "pt": "Português", "pa": "ਪੰਜਾਬੀ", "ro": "Română", "ru": "Русский", "sm": "Gagana Sāmoa", "gd": "Gàidhlig", "sr": "Српски", "st": "Sesotho", "sn": "Chishona", "sd": "سنڌي", "si": "සිංහල", "sk": "Slovenčina", "sl": "Slovenščina", "so": "Soomaali", "es": "Español", "su": "Basa Sunda", "sw": "Kiswahili", "sv": "Svenska", "tg": "Тоҷикӣ", "ta": "தமிழ்", "te": "తెలుగు", "th": "ไทย", "tr": "Türkçe", "uk": "Українська", "ur": "اردو", "uz": "Oʻzbekcha", "vi": "Tiếng Việt", "cy": "Cymraeg", "xh": "isiXhosa", "yi": "ייִדיש", "yo": "Yorùbá", "zu": "isiZulu"
};

const srcS = document.getElementById('srcLang'),
tgtS = document.getElementById('tgtLang'),
inp = document.getElementById('input'),
out = document.getElementById('output'),
go = document.getElementById('go'),
oA = document.getElementById('outActions');

const synth = window.speechSynthesis;

Object.entries(languages).forEach(([c, n]) => {
    srcS.add(new Option(n, c));
    tgtS.add(new Option(n, c));
});
tgtS.value = 'ru';

document.body.addEventListener('touchstart', () => {
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    synth.speak(u);
}, { once: true });

function fastSpeak(text, lang) {
    if (!text) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (lang !== 'auto') u.lang = lang;
    u.rate = 1.05;
    synth.speak(u);
}

document.getElementById('speakIn').onclick = () => fastSpeak(inp.value, srcS.value);
document.getElementById('speakOut').onclick = () => fastSpeak(out.innerText, tgtS.value);

document.getElementById('swapBtn').onclick = () => {
    let c = srcS.value === 'auto' ? 'en' : srcS.value;
    srcS.value = tgtS.value;
    tgtS.value = c;
};

document.getElementById('clearBtn').onclick = () => {
    inp.value = '';
    out.innerText = '';
    oA.classList.add('hidden');
    synth.cancel();
};

document.getElementById('copyBtn').onclick = () => {
    navigator.clipboard.writeText(out.innerText);
    document.getElementById('copyBtn').innerText = "Готово";
    setTimeout(() => document.getElementById('copyBtn').innerText = "Копировать", 2000);
};

go.onclick = async () => {
    const t = inp.value.trim();
    if (!t) return;

    go.innerText = "● ● ●";

    try {
        const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcS.value}&tl=${tgtS.value}&dt=t&q=${encodeURIComponent(t)}`);
        const d = await r.json();
        out.innerText = d[0].map(i => i[0]).join('');
        oA.classList.remove('hidden');
    } catch (e) {
        out.innerText = "Ошибка сети";
    } finally {
        go.innerText = "Перевести";
    }
};