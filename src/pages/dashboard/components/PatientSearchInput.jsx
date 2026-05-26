import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/Input";
import Image from "@/components/AppImage";
import Icon from "@/components/AppIcon";
import { usePatients } from "@/hooks/PatientsHooks";

const PatientSearchInput = ({ value: selectedPatient, onChange, error }) => {
  const { t } = useTranslation();
  const { searchPatients } = usePatients();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  // ── Cierre al click fuera ──────────────────────────────────────────────────
  useEffect(() => {
    if (results.length === 0) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [results]);

  // ── Debounce search ────────────────────────────────────────────────────────
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchPatients(searchTerm);
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchPatients]);

  const handleSelect = useCallback(
    (patient) => {
      onChange(patient);
      setSearchTerm("");
      setResults([]);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange(null);
    setSearchTerm("");
    setResults([]);
  }, [onChange]);

  // ── Paciente seleccionado ──────────────────────────────────────────────────
  if (selectedPatient) {
    return (
      <div className="flex items-center justify-between p-3 border border-primary/30 bg-primary/5 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <Image src={selectedPatient.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <span className="font-semibold text-sm text-foreground">{selectedPatient.name}</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {t("appointment.changePatient")}
        </button>
      </div>
    );
  }

  // ── Buscador ───────────────────────────────────────────────────────────────
  return (
    <div className="relative" ref={containerRef}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <Icon name="Search" size={18} className="text-muted-foreground" />
      </div>

      <Input
        type="text"
        placeholder={t("appointment.patientPlaceholder")}
        className={`pl-10 bg-white ${error ? "border-red-400 focus:ring-red-200" : ""}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Spinner */}
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Dropdown */}
      {results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-auto">
          {results.map((p) => (
            <li
              key={p.id}
              onClick={() => handleSelect(p)}
              className="p-3 hover:bg-muted cursor-pointer flex items-center gap-3 transition-colors border-b border-border last:border-0"
            >
              <Image src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-medium text-foreground">
                {p.name} — {p.patient_id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientSearchInput;
