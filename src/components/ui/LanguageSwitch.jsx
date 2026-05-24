import { useTranslation } from "react-i18next";

const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLang = (lang) => {
    if (lang !== currentLang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLang("es")}
        className={`flex items-center gap-1.5 border-none bg-transparent cursor-pointer transition-opacity duration-150 ${
          currentLang === "es" ? "opacity-100" : "opacity-35 hover:opacity-60"
        }`}
        aria-label="Cambiar a español"
      >
        <span className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 block">
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" fill="#AA151B" />
            <rect y="5" width="20" height="10" fill="#F1BF00" />
          </svg>
        </span>
        <span className={`text-sm font-medium ${currentLang === "es" ? "text-foreground" : "text-muted-foreground"}`}>
          ES
        </span>
      </button>

      <div className="w-px h-4 bg-border" />

      <button
        onClick={() => changeLang("en")}
        className={`flex items-center gap-1.5 border-none bg-transparent cursor-pointer transition-opacity duration-150 ${
          currentLang === "en" ? "opacity-100" : "opacity-35 hover:opacity-60"
        }`}
        aria-label="Switch to English"
      >
        <span className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 block">
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" fill="#012169" />
            <line x1="0" y1="0" x2="20" y2="20" stroke="#fff" strokeWidth="3.5" />
            <line x1="20" y1="0" x2="0" y2="20" stroke="#fff" strokeWidth="3.5" />
            <line x1="0" y1="0" x2="20" y2="20" stroke="#C8102E" strokeWidth="1.8" />
            <line x1="20" y1="0" x2="0" y2="20" stroke="#C8102E" strokeWidth="1.8" />
            <rect x="8.5" y="0" width="3" height="20" fill="#fff" />
            <rect x="0" y="8.5" width="20" height="3" fill="#fff" />
            <rect x="9" y="0" width="2" height="20" fill="#C8102E" />
            <rect x="0" y="9" width="20" height="2" fill="#C8102E" />
          </svg>
        </span>
        <span className={`text-sm font-medium ${currentLang === "en" ? "text-foreground" : "text-muted-foreground"}`}>
          EN
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitch;
