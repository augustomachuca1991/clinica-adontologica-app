import React from "react";

const PrintableMedicalRecord = React.forwardRef(({ record, treatmentHistory }, ref) => {
  return (
    <div ref={ref} className="hidden print:block p-8 bg-white text-black min-h-screen">
      {/* CABECERA PROFESIONAL */}
      <div className="flex justify-between border-b-2 border-primary pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase text-primary">Ficha Clínica Odontológica</h1>
          <p className="text-sm">Registro generado el: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold">CLÍNICA DENTAL GEMINI</h2>
          <p className="text-xs">Calle Salud 123 • +34 900 000 000</p>
        </div>
      </div>

      {/* DATOS DEL PACIENTE */}
      <div className="grid grid-cols-2 gap-4 mb-8 bg-muted/30 p-4 rounded-lg">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase">Paciente</label>
          <p className="text-lg font-semibold">{record?.patientName}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase">ID Historial</label>
          <p className="text-lg">{record?.patientId}</p>
        </div>
      </div>

      {/* DETALLES DEL TRATAMIENTO ACTUAL */}
      <div className="mb-8">
        <h3 className="text-lg font-bold border-b mb-3">Detalle del Procedimiento</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <p>
            <strong>Tratamiento:</strong> {record?.treatmentName}
          </p>
          <p>
            <strong>Fecha:</strong> {record?.date}
          </p>
          <p>
            <strong>Doctor:</strong> {record?.provider}
          </p>
          <p>
            <strong>Pieza Dental:</strong> {record?.toothNumber}
          </p>
          <p>
            <strong>Tipo:</strong> {record?.treatmentType}
          </p>
          <p>
            <strong>Costo:</strong> ${record?.cost?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* NOTAS CLÍNICAS (Lo más importante para el dentista) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold border-b mb-3">Notas de Evolución</h3>
        <p className="text-sm italic leading-relaxed bg-white border p-4 rounded shadow-sm">{record?.notes}</p>
      </div>

      {/* HISTORIAL LOG (La línea de tiempo) */}
      <div>
        <h3 className="text-lg font-bold border-b mb-3">Historial de Cambios</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Profesional</th>
            </tr>
          </thead>
          <tbody>
            {treatmentHistory.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.date}</td>
                <td className="p-2 border capitalize">{item.status}</td>
                <td className="p-2 border">{item.provider.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FIRMAS PIE DE PÁGINA */}
      <div className="mt-20 grid grid-cols-2 gap-20 text-center">
        <div className="border-t border-black pt-2 text-xs">Firma del Profesional</div>
        <div className="border-t border-black pt-2 text-xs">Firma del Paciente / Tutor</div>
      </div>
    </div>
  );
});

export default PrintableMedicalRecord;
