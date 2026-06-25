import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const ErrorState = ({ message, onRetry, fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <Icon name="AlertTriangle" size={32} className="text-error" />
      </div>
      <h3 className="text-lg font-headline font-semibold text-foreground mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {message || "An unexpected error occurred. Please try again."}
      </p>
      {onRetry && (
        <Button variant="default" onClick={onRetry} iconName="RefreshCw" iconPosition="left">
          Try again
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return <div className="min-h-[60vh] flex items-center justify-center p-8">{content}</div>;
  }

  return <div className="py-16">{content}</div>;
};

export default ErrorState;
