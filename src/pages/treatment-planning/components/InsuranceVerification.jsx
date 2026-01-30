import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const InsuranceVerification = ({ patientInsurance, onVerify }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResult({
        status: "active",
        coveragePercentage: 80,
        annualMaximum: 2000,
        remainingBenefit: 1450,
        deductible: 50,
        deductibleMet: 50,
        effectiveDate: "2025-01-01",
        expirationDate: "2025-12-31",
        coveredProcedures: [
          { code: "D0150", name: "Comprehensive Oral Evaluation", coverage: 100 },
          { code: "D1110", name: "Prophylaxis - Adult", coverage: 100 },
          { code: "D2391", name: "Resin-based Composite - One Surface", coverage: 80 },
          { code: "D2740", name: "Crown - Porcelain/Ceramic", coverage: 50 },
        ],
      });
      setIsVerifying(false);
      onVerify();
    }, 2000);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-headline font-semibold text-foreground">Insurance Verification</h3>
        {verificationResult && (
          <span className="flex items-center gap-2 text-xs md:text-sm text-success">
            <Icon name="CheckCircle2" size={16} />
            Verified
          </span>
        )}
      </div>
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Insurance Provider" type="text" value={patientInsurance?.provider} disabled />
          <Input label="Policy Number" type="text" value={patientInsurance?.policyNumber} disabled />
          <Input label="Group Number" type="text" value={patientInsurance?.groupNumber} disabled />
          <Input label="Subscriber Name" type="text" value={patientInsurance?.subscriberName} disabled />
        </div>

        <Button variant="outline" fullWidth onClick={handleVerify} loading={isVerifying} iconName="RefreshCw" iconPosition="left">
          {isVerifying ? "Verifying Coverage..." : "Verify Insurance Coverage"}
        </Button>

        {verificationResult && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${verificationResult?.status === "active" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
              >
                {verificationResult?.status === "active" ? "Active Coverage" : "Inactive"}
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">
                Valid: {verificationResult?.effectiveDate} - {verificationResult?.expirationDate}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Coverage</div>
                <div className="text-lg md:text-xl font-headline font-bold text-foreground">{verificationResult?.coveragePercentage}%</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Annual Max</div>
                <div className="text-lg md:text-xl font-headline font-bold text-foreground">${verificationResult?.annualMaximum}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Remaining</div>
                <div className="text-lg md:text-xl font-headline font-bold text-primary">${verificationResult?.remainingBenefit}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Deductible</div>
                <div className="text-lg md:text-xl font-headline font-bold text-foreground">
                  ${verificationResult?.deductibleMet}/${verificationResult?.deductible}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm md:text-base font-medium text-foreground mb-3">Covered Procedures</h4>
              <div className="space-y-2">
                {verificationResult?.coveredProcedures?.map((procedure, index) => (
                  <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-muted/30 rounded-md">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm font-medium text-foreground">{procedure?.name}</div>
                      <div className="text-xs text-muted-foreground">Code: {procedure?.code}</div>
                    </div>
                    <div className="text-sm md:text-base font-semibold text-primary">{procedure?.coverage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceVerification;
