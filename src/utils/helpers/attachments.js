import { supabase } from "../../lib/supabase";

/**
 * Sube un archivo a Storage y devuelve su URL pública
 */
export const uploadFileToStorage = async (file) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `clinical_records/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("clinical_attachments") // Asegurate de que este bucket exista en Supabase
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("clinical_attachments").getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Actualiza el registro en la DB agregando la nueva URL al array existente
 */
export const saveAttachmentToDB = async (recordId, currentAttachments, newUrl) => {
  const updatedAttachments = [...(currentAttachments || []), newUrl];

  const { data, error } = await supabase.from("clinical_records").update({ attachments: updatedAttachments }).eq("id", recordId);

  if (error) throw error;
  return data;
};
