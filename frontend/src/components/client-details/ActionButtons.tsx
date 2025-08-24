import { Button } from "@/components/ui/button";
import { Plus, DollarSign, SendHorizontal } from "lucide-react";

interface ActionButtonsProps {
  onAddPurchase: () => void;
  onAddPayment: () => void;
  onQuit: () => void;
  onCharge: () => void;
}

export const ActionButtons = ({ 
  onAddPurchase, 
  onAddPayment, 
  onQuit,
  onCharge 
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button className="flex items-center gap-2" onClick={onAddPurchase}>
        <Plus className="w-4 h-4" />
        Nova Compra
      </Button>
      <Button className="flex items-center gap-2" onClick={onAddPayment}>
        <DollarSign className="w-4 h-4" />
        Novo Pagamento
      </Button>
      <Button variant="secondary" className="flex items-center gap-2" onClick={onQuit}>
        <DollarSign className="w-4 h-4" />
        Pagamento Total
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 ml-auto"
        onClick={onCharge}
      >
        <SendHorizontal className="w-4 h-4" />
        Cobrar Cliente
      </Button>
    </div>
  );
};