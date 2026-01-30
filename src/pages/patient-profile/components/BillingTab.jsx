import React from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const BillingTab = ({ billingInfo }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Overdue":
        return "bg-error/10 text-error";
      case "Partial":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalBalance = billingInfo?.invoices?.reduce((sum, invoice) => sum + invoice?.balance, 0);
  const totalPaid = billingInfo?.invoices?.reduce((sum, invoice) => sum + invoice?.amountPaid, 0);
  const totalAmount = billingInfo?.invoices?.reduce((sum, invoice) => sum + invoice?.totalAmount, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="DollarSign" size={20} color="var(--color-error)" />
            </div>
            <p className="text-sm text-muted-foreground">Outstanding Balance</p>
          </div>
          <p className="text-2xl md:text-3xl font-headline font-bold text-foreground">${totalBalance?.toLocaleString()}</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <p className="text-sm text-muted-foreground">Total Paid</p>
          </div>
          <p className="text-2xl md:text-3xl font-headline font-bold text-foreground">${totalPaid?.toLocaleString()}</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="CreditCard" size={20} color="var(--color-primary)" />
            </div>
            <p className="text-sm text-muted-foreground">Total Billed</p>
          </div>
          <p className="text-2xl md:text-3xl font-headline font-bold text-foreground">${totalAmount?.toLocaleString()}</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="FileText" size={20} color="var(--color-secondary)" />
            </div>
            <p className="text-sm text-muted-foreground">Total Invoices</p>
          </div>
          <p className="text-2xl md:text-3xl font-headline font-bold text-foreground">{billingInfo?.invoices?.length}</p>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Receipt" size={20} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Invoice History</h3>
          </div>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Invoice #</th>
                <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-right py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-right py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Paid</th>
                <th className="text-right py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Balance</th>
                <th className="text-center py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center py-3 px-2 text-xs md:text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingInfo?.invoices?.map((invoice, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors duration-base">
                  <td className="py-3 px-2">
                    <p className="text-sm md:text-base font-medium text-foreground">{invoice?.invoiceNumber}</p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(invoice.date)?.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-xs md:text-sm text-foreground">{invoice?.description}</p>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <p className="text-sm md:text-base font-medium text-foreground whitespace-nowrap">
                      ${invoice?.totalAmount?.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <p className="text-sm md:text-base font-medium text-success whitespace-nowrap">
                      ${invoice?.amountPaid?.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <p className="text-sm md:text-base font-medium text-error whitespace-nowrap">${invoice?.balance?.toLocaleString()}</p>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`status-indicator ${getPaymentStatusColor(invoice?.status)} text-xs`}>{invoice?.status}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" iconName="Eye" />
                      <Button variant="ghost" size="icon" iconName="Download" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="CreditCard" size={20} color="var(--color-secondary)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Payment Methods</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {billingInfo?.paymentMethods?.map((method, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="CreditCard" size={18} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-medium text-foreground">{method?.type}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">•••• {method?.last4}</p>
                  </div>
                </div>
                {method?.isDefault && <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">Default</span>}
              </div>
              <p className="text-xs text-muted-foreground">Expires: {method?.expiryDate}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Add Payment Method
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
