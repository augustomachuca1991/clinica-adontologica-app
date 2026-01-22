import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// Supongamos que tienes un set de iconos como Lucide o Heroicons
// import { UserPlus, Shield, Stethoscope, Mail, MoreVertical } from 'lucide-react';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Mock de datos basado en lo que tenemos en Supabase
  const users = [
    { id: 1, full_name: "Tu Nombre (Admin)", email: "admin@clinic.com", roles: ["admin", "dentist"], status: "active" },
    { id: 2, full_name: "Dr. Prueba Uno", email: "prueba1@dent.com", roles: ["dentist"], status: "active" },
    { id: 3, full_name: "Dr. Prueba Dos", email: "prueba2@dent.com", roles: ["dentist"], status: "active" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 fade-in-up">
      {/* HEADER DEL PANEL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Control de Personal</h1>
          <p className="text-muted-foreground mt-1">Gestiona los roles, accesos y permisos de la clínica.</p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="relative flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium transition-all duration-base hover:scale-105 active:scale-95 shadow-md"
        >
          {isFormOpen ? "Cerrar Registro" : "Registrar Nuevo Usuario"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LISTADO DE USUARIOS (OCUPA MÁS ESPACIO) */}
        <section className={`${isFormOpen ? "lg:col-span-8" : "lg:col-span-12"} transition-all duration-slow`}>
          <div className="clinical-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuario</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Roles Asignados</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.full_name}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {user.roles.map((role) => (
                          <span key={role} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="status-indicator status-active">
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                        Activo
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110">
                        {/* <MoreVertical size={16} /> */}
                        ...
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FORMULARIO DE REGISTRO (CON EFECTO HALO) */}
        {isFormOpen && (
          <aside className="lg:col-span-4 fade-in-up">
            <div className="clinical-card p-6 data-halo sticky top-6 border-primary/20">
              <h2 className="text-xl font-bold text-foreground mb-4">Nuevo Registro</h2>
              <form className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nombre Completo</label>
                  <input type="text" placeholder="Ej. Dr. Smith" className="w-full p-2.5 bg-background border border-border rounded-md focus-clinical" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Email Profesional</label>
                  <input type="email" placeholder="email@clinica.com" className="w-full p-2.5 bg-background border border-border rounded-md focus-clinical" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Asignar Roles Iniciales</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["admin", "dentist", "staff"].map((r) => (
                      <label key={r} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/10 transition-colors">
                        <input type="checkbox" className="accent-primary" />
                        <span className="text-xs capitalize">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                  Enviar Invitación
                </button>
                <p className="text-[11px] text-center text-muted-foreground italic">Se enviará un email para que el usuario configure su contraseña.</p>
              </form>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
