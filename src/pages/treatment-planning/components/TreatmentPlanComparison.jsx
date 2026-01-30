import React from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const TreatmentPlanComparison = ({ plans, onSelectPlan, selectedPlanId }) => {
  const getFeatureIcon = (included) => {
    return included ? (
      <Icon name="CheckCircle2" size={18} className="text-success" />
    ) : (
      <Icon name="XCircle" size={18} className="text-muted-foreground" />
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base md:text-lg font-headline font-semibold text-foreground">Compare Treatment Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {plans?.map((plan) => (
          <div
            key={plan?.id}
            className={`bg-card border rounded-lg overflow-hidden transition-all duration-base ${
              selectedPlanId === plan?.id
                ? "border-primary shadow-clinical-lg ring-2 ring-primary/20"
                : "border-border hover:border-primary/50 hover:shadow-clinical-md"
            }`}
          >
            <div className={`p-4 md:p-6 ${plan?.recommended ? "bg-primary/5" : "bg-muted/30"}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base md:text-lg font-headline font-semibold text-foreground">{plan?.name}</h4>
                {plan?.recommended && (
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">Recommended</span>
                )}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{plan?.description}</p>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div>
                <div className="text-2xl md:text-3xl font-headline font-bold text-foreground">${plan?.totalCost?.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{plan?.duration} treatment duration</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs md:text-sm font-medium text-foreground">Included Procedures:</div>
                <div className="space-y-2">
                  {plan?.procedures?.map((procedure, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {getFeatureIcon(procedure?.included)}
                      <span className="text-xs md:text-sm text-foreground flex-1">{procedure?.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Insurance Coverage</span>
                  <span className="font-medium text-foreground">${plan?.insuranceCoverage?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Out of Pocket</span>
                  <span className="font-semibold text-primary">${plan?.outOfPocket?.toLocaleString()}</span>
                </div>
              </div>

              <Button
                variant={selectedPlanId === plan?.id ? "default" : "outline"}
                fullWidth
                onClick={() => onSelectPlan(plan?.id)}
                iconName={selectedPlanId === plan?.id ? "Check" : "ArrowRight"}
                iconPosition="right"
              >
                {selectedPlanId === plan?.id ? "Selected" : "Select Plan"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentPlanComparison;
