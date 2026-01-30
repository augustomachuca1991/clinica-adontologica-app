import React, { useState } from "react";
import { Link } from "react-router-dom";
import Image from "@/components/AppImage";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useTranslation } from "react-i18next";

const PatientTable = ({ patients, selectedPatients, onSelectPatient, onSelectAll, onSort, sortConfig }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const { t } = useTranslation();

  const getSortIcon = (column) => {
    if (sortConfig?.column !== column) {
      return <Icon name="ChevronsUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === "asc" ? (
      <Icon name="ChevronUp" size={16} className="text-primary" />
    ) : (
      <Icon name="ChevronDown" size={16} className="text-primary" />
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-50", text: "text-success", label: "active" },
      pending: { bg: "bg-yellow-50", text: "text-warning", label: "pending" },
      inactive: { bg: "bg-muted", text: "text-muted-foreground", label: "inactive" },
    };
    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {t(`patientCard.status.${config?.label}`)}
      </span>
    );
  };

  return (
    <div className="clinical-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={selectedPatients?.length === patients?.length && patients?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  indeterminate={selectedPatients?.length > 0 && selectedPatients?.length < patients?.length}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort("name")}
                  className="flex items-center gap-2 text-xs md:text-sm font-headline font-semibold text-foreground hover:text-primary transition-colors duration-base"
                >
                  {t("patientTable.columns.patient")}
                  {getSortIcon("name")}
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                <button
                  onClick={() => onSort("patientId")}
                  className="flex items-center gap-2 text-xs md:text-sm font-headline font-semibold text-foreground hover:text-primary transition-colors duration-base"
                >
                  {t("patientTable.columns.patientID")}
                  {getSortIcon("patientId")}
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <span className="text-xs md:text-sm font-headline font-semibold text-foreground">{t("patientTable.columns.contact")}</span>
              </th>
              <th className="px-4 py-3 text-left hidden xl:table-cell">
                <button
                  onClick={() => onSort("insurance")}
                  className="flex items-center gap-2 text-xs md:text-sm font-headline font-semibold text-foreground hover:text-primary transition-colors duration-base"
                >
                  {t("patientTable.columns.insurance")}
                  {getSortIcon("insurance")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-xs md:text-sm font-headline font-semibold text-foreground hover:text-primary transition-colors duration-base"
                >
                  {t("patientTable.columns.status")}
                  {getSortIcon("status")}
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <button
                  onClick={() => onSort("nextAppointment")}
                  className="flex items-center gap-2 text-xs md:text-sm font-headline font-semibold text-foreground hover:text-primary transition-colors duration-base"
                >
                  {t("patientTable.columns.nextAppointment")}
                  {getSortIcon("nextAppointment")}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs md:text-sm font-headline font-semibold text-foreground">{t("patientTable.columns.actions")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {patients?.map((patient) => (
              <tr
                key={patient?.id}
                onMouseEnter={() => setHoveredRow(patient?.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-border transition-colors duration-base ${hoveredRow === patient?.id ? "bg-muted/30" : ""} ${selectedPatients?.includes(patient?.id) ? "bg-primary/5" : ""}`}
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedPatients?.includes(patient?.id)}
                    onChange={(e) => onSelectPatient(patient?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/patient-profile/${patient?.id}`}
                    className="flex items-center gap-3 hover:text-primary transition-colors duration-base"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0">
                      <Image src={patient?.avatar} alt={patient?.avatarAlt} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate capitalize">{patient?.name}</div>
                      <div className="text-xs text-muted-foreground truncate md:hidden">{patient?.patientId}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{patient?.patientId}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="text-sm">
                    <div className="text-foreground truncate">{patient?.phone}</div>
                    <div className="text-muted-foreground text-xs truncate">{patient?.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-sm text-foreground">{patient?.insurance}</span>
                </td>
                <td className="px-4 py-3">{getStatusBadge(patient?.status)}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {patient?.nextAppointment ? (
                    <div className="text-sm">
                      <div className="text-foreground">{patient?.nextAppointment}</div>
                      {patient?.appointmentStatus === "overdue" && (
                        <span className="text-xs text-error font-medium lowercase">{t("appointment.overdue")}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No appointment</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Eye"
                      aria-label="View patient"
                      onClick={() => (window.location.href = `/patient-profile/${patient?.id}`)}
                    />
                    {/* <Button variant="ghost" size="icon" iconName="Edit" aria-label="Edit patient" /> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;
