import React from "react";
import { useTranslation } from "react-i18next";

const PrintableMedicalRecord = React.forwardRef(({ record, treatmentHistory }, ref) => {
  const { t } = useTranslation();

  const { VITE_CLINIC_NAME, VITE_CLINIC_ADDRESS, VITE_CLINIC_PHONE } = import.meta.env;

  return (
    <div ref={ref} className="hidden print:block p-8 bg-white text-black min-h-screen">
      {/* CABECERA PROFESIONAL */}
      <div className="flex justify-between border-b-2 border-primary pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase text-primary">{t("printableRecord.title")}</h1>
          <p className="text-sm">
            {t("printableRecord.generatedAt")}: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <h2 className="font-bold">{t("printableRecord.clinicName", { clinicalName: VITE_CLINIC_NAME })}</h2>
          <p className="text-xs">{t("printableRecord.clinicAddress", { address: VITE_CLINIC_ADDRESS, phone: VITE_CLINIC_PHONE || "-" })}</p>
        </div>
      </div>

      {/* DATOS DEL PACIENTE */}
      <div className="grid grid-cols-2 gap-4 mb-8 bg-muted/30 p-4 rounded-lg">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase">{t("printableRecord.patientData.label")}</label>
          <p className="text-lg font-semibold">{record?.patientName}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase">{t("printableRecord.patientData.historyId")}</label>
          <p className="text-lg">{record?.patientId}</p>
        </div>
      </div>

      {/* DETALLES DEL TRATAMIENTO ACTUAL */}
      <div className="mb-8">
        <h3 className="text-lg font-bold border-b mb-3">{t("printableRecord.procedureDetails.title")}</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <p>
            <strong>{t("printableRecord.procedureDetails.treatment")}:</strong> {record?.treatmentName}
          </p>
          <p>
            <strong>{t("printableRecord.procedureDetails.date")}:</strong> {record?.date}
          </p>
          <p>
            <strong>{t("printableRecord.procedureDetails.doctor")}:</strong> {record?.provider}
          </p>
          <p>
            <strong>{t("printableRecord.procedureDetails.tooth")}:</strong> {record?.toothNumber}
          </p>
          <p>
            <strong>{t("printableRecord.procedureDetails.type")}:</strong> {record?.treatmentType}
          </p>
          <p>
            <strong>{t("printableRecord.procedureDetails.cost")}:</strong> ${record?.cost?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* NOTAS CLÍNICAS */}
      <div className="mb-8">
        <h3 className="text-lg font-bold border-b mb-3">{t("printableRecord.evolutionNotes")}</h3>
        <p className="text-sm italic leading-relaxed bg-white border p-4 rounded shadow-sm">{record?.notes}</p>
      </div>

      {/* HISTORIAL LOG */}
      <div>
        <h3 className="text-lg font-bold border-b mb-3">{t("printableRecord.historyLog.title")}</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">{t("printableRecord.historyLog.date")}</th>
              <th className="p-2 border">{t("printableRecord.historyLog.status")}</th>
              <th className="p-2 border">{t("printableRecord.historyLog.professional")}</th>
            </tr>
          </thead>
          <tbody>
            {treatmentHistory?.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.date}</td>
                <td className="p-2 border capitalize">{item.status}</td>
                <td className="p-2 border">{item.provider?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FIRMAS PIE DE PÁGINA */}
      <div className="mt-20 grid grid-cols-2 gap-20 text-center">
        <div className="border-t border-black pt-2 text-xs">{t("printableRecord.signatures.professional")}</div>
        <div className="border-t border-black pt-2 text-xs">{t("printableRecord.signatures.patient")}</div>
      </div>
    </div>
  );
});

export default PrintableMedicalRecord;
