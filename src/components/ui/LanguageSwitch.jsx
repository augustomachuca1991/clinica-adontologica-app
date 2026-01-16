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
        <span className="text-base">🇪🇸</span>
        <span className="hidden sm:inline">☀</span>
      </button>

      {/* Inglés */}
      <button
        onClick={() => changeLang("en")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all duration-200
          ${currentLang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted-foreground/10 text-muted-foreground"}`}
        aria-label="Switch to English"
      >
        <span className="text-base">🇺🇸</span>
        <span className="hidden sm:inline">🌚</span>
      </button>
    </div>
  );
};

export default LanguageSwitch;
