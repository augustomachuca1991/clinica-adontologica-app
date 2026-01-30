import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const PatientPresentationMode = ({ treatmentPlan, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Your Treatment Overview",
      content: `We've created a comprehensive treatment plan designed specifically for your dental health needs. This plan addresses your current concerns and helps prevent future issues.`,
      icon: "FileText",
    },
    {
      title: "Recommended Procedures",
      content: treatmentPlan?.procedures?.map((p) => p?.name)?.join(", "),
      icon: "Clipboard",
    },
    {
      title: "Treatment Timeline",
      content: `Your treatment will be completed over ${treatmentPlan?.duration}. We'll schedule appointments at convenient times to minimize disruption to your daily routine.`,
      icon: "Calendar",
    },
    {
      title: "Investment in Your Health",
      content: `Total treatment cost: $${treatmentPlan?.totalCost?.toLocaleString()}\nInsurance coverage: $${treatmentPlan?.insuranceCoverage?.toLocaleString()}\nYour responsibility: $${treatmentPlan?.outOfPocket?.toLocaleString()}`,
      icon: "DollarSign",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides?.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
        <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">Treatment Plan Presentation</h2>
        <Button variant="ghost" size="icon" onClick={onClose} iconName="X" aria-label="Close presentation" />
      </div>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl w-full">
          <div className="bg-card border border-border rounded-lg p-6 md:p-12 shadow-clinical-xl">
            <div className="text-center space-y-6 md:space-y-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={slides?.[currentSlide]?.icon} size={32} color="var(--color-primary)" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground">{slides?.[currentSlide]?.title}</h3>

              <p className="text-base md:text-lg lg:text-xl text-muted-foreground whitespace-pre-line max-w-2xl mx-auto">
                {slides?.[currentSlide]?.content}
              </p>

              {currentSlide === slides?.length - 1 && (
                <div className="bg-muted/50 rounded-lg p-4 md:p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-semibold text-foreground">${treatmentPlan?.totalCost?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">Insurance Coverage</span>
                    <span className="font-semibold text-success">-${treatmentPlan?.insuranceCoverage?.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between text-base md:text-lg">
                      <span className="font-medium text-foreground">Your Investment</span>
                      <span className="text-xl md:text-2xl font-headline font-bold text-primary">
                        ${treatmentPlan?.outOfPocket?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 md:mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentSlide === 0} iconName="ChevronLeft" iconPosition="left">
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {slides?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-base ${index === currentSlide ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant={currentSlide === slides?.length - 1 ? "default" : "outline"}
              onClick={currentSlide === slides?.length - 1 ? onClose : handleNext}
              iconName={currentSlide === slides?.length - 1 ? "Check" : "ChevronRight"}
              iconPosition="right"
            >
              {currentSlide === slides?.length - 1 ? "Accept Plan" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPresentationMode;
