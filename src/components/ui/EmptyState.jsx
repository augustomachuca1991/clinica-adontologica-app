import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const EmptyState = ({ icon = "Inbox", title, description, actionLabel, onAction, actionIcon = "Plus" }) => (
  <div className="clinical-card p-12 text-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon name={icon} size={32} className="text-muted-foreground" />
    </div>
    {title && (
      <h3 className="text-lg font-headline font-semibold text-foreground mb-2">{title}</h3>
    )}
    {description && (
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
    )}
    {actionLabel && onAction && (
      <Button variant="default" onClick={onAction} iconName={actionIcon} iconPosition="left">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
