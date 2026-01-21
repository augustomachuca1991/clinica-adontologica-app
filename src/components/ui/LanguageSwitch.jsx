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
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted border border-border">
      {/* Español */}
      <button
        onClick={() => changeLang("es")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all duration-200
          ${currentLang === "es" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted-foreground/10 text-muted-foreground"}`}
        aria-label="Cambiar a español"
      >
        {/* <span className="text-base">🇪🇸</span> */}
        <span className="hidden sm:inline">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18">
            <defs>
              <clipPath id="circleView">
                <circle cx="50" cy="50" r="50" />
              </clipPath>
            </defs>
            <g clipPath="url(#circleView)">
              <rect width="100" height="25" fill="#AA151B" />
              <rect y="25" width="100" height="50" fill="#F1BF00" />
              <rect y="75" width="100" height="25" fill="#AA151B" />
              <circle cx="30" cy="50" r="8" fill="#AA151B" />
              <rect x="26" y="46" width="8" height="10" fill="#8d1318" opacity="0.5" />
            </g>
          </svg>
        </span>
      </button>

      {/* Inglés */}
      <button
        onClick={() => changeLang("en")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all duration-200
          ${currentLang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted-foreground/10 text-muted-foreground"}`}
        aria-label="Switch to English"
      >
        {/* <span className="text-base">🇺🇸</span> */}
        <span className="hidden sm:inline">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18">
            <defs>
              <clipPath id="circleViewUK">
                <circle cx="50" cy="50" r="50" />
              </clipPath>
            </defs>
            <g clipPath="url(#circleViewUK)">
              <rect width="100" height="100" fill="#012169" />
              <line x1="0" y1="0" x2="100" y2="100" stroke="#FFF" strokeWidth="10" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#FFF" strokeWidth="10" />
              <line x1="0" y1="0" x2="100" y2="100" stroke="#C8102E" strokeWidth="4" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#C8102E" strokeWidth="4" />
              <rect x="40" y="0" width="20" height="100" fill="#FFF" />
              <rect x="0" y="40" width="100" height="20" fill="#FFF" />
              <rect x="44" y="0" width="12" height="100" fill="#C8102E" />
              <rect x="0" y="44" width="100" height="12" fill="#C8102E" />
            </g>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitch;
