import React, { useRef } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";

const AvatarUploader = ({ preview, imageFile, onFileChange, t }) => {
  const ref = useRef(null);
  return (
    <div className="flex items-center gap-5">
      <div
        onClick={() => ref.current.click()}
        className="relative w-24 h-24 rounded-2xl cursor-pointer group flex-shrink-0 overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors"
      >
        {preview ? (
          <Image src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted/30 flex items-center justify-center">
            <Icon name="Camera" size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Icon name="Upload" size={18} className="text-white" />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">{t("patient.avatarUploader.title")}</p>
        <p className="text-xs text-muted-foreground">{t("patient.avatarUploader.meta")}</p>
        <Button variant="outline" size="sm" type="button" onClick={() => ref.current.click()}>
          <Icon name={preview ? "RefreshCw" : "Upload"} size={13} className="mr-2" />
          {preview ? t("patient.avatarUploader.change") : t("patient.avatarUploader.upload")}
        </Button>
        {imageFile && <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{imageFile.name}</p>}
      </div>
      <input type="file" ref={ref} onChange={onFileChange} className="hidden" accept="image/*" />
    </div>
  );
};

export default AvatarUploader;
