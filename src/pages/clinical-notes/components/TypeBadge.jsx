import React from "react";
import { TYPE_CONFIG } from "@/utils/notesUtils/notes";

const TypeBadge = ({ type }) => {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.observation;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

export default TypeBadge;
