import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "danger";
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
}: StatsCardProps) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    warning: "bg-warning text-warning-foreground",
    danger: "bg-danger text-danger-foreground",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${variants[variant]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};