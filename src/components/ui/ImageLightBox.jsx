import React, { useEffect } from "react";
import Icon from "../../components/AppIcon";

const ImageLightbox = ({ isOpen, onClose, images = [], currentIndex, onNext, onPrev }) => {
  // Manejo de teclado (Esc para cerrar, flechas para navegar)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 transition-all animate-in fade-in">
      {/* Botón Cerrar */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-[110]">
        <Icon name="X" size={32} />
      </button>

      {/* Botón Anterior */}
      <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-3 rounded-full z-[110]">
        <Icon name="ChevronLeft" size={40} />
      </button>

      {/* Imagen Principal */}
      <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
        <img src={currentImage.url} alt={currentImage.alt} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />

        {/* Información de la imagen */}
        <div className="mt-6 text-center text-white">
          <p className="text-lg font-medium">{currentImage.alt || `Imagen ${currentIndex + 1}`}</p>
          <p className="text-sm text-white/60 mt-1">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* Botón Siguiente */}
      <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-3 rounded-full z-[110]">
        <Icon name="ChevronRight" size={40} />
      </button>

      {/* Miniaturas indicadoras */}
      <div className="absolute bottom-8 flex gap-2">
        {images.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
};

export default ImageLightbox;
