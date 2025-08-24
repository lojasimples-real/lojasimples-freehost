import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    name: string;
    phone: string;
    currentDebt: number;
  };
}

export function ChargeModal({ isOpen, onClose, client }: ChargeModalProps) {
  const [message, setMessage] = useState('');
  const maxLength = 200;

  const insertTemplate = (template: string) => {
    let newMessage = message;
    switch(template) {
      case 'name':
        newMessage += `${client.name}`;
        break;
      case 'debt':
        newMessage += `R$ ${client.currentDebt.toFixed(2)}`;
        break;
    }
    setMessage(newMessage);
  };

  const handleSend = () => {
    const formattedPhone = client.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/55${formattedPhone}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Enviar Cobrança</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Digite sua mensagem</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem de cobrança..."
              className="mt-2"
              maxLength={maxLength}
            />
            <div className="flex justify-between mt-2">
              <div className="text-sm text-gray-500">
                {message.length}/{maxLength} caracteres
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="text-sm text-gray-500 w-full mb-2">
              Inserir no texto:
            </div>
            <Badge 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => insertTemplate('name')}
            >
              Nome do Cliente
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => insertTemplate('debt')}
            >
              Valor da Dívida
            </Badge>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSend}
            disabled={!message.trim()}
          >
            Enviar por WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}