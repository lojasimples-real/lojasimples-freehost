import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ResponsiveTable } from '@/components/layout/Mobile';

const Settings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      setFormData(JSON.parse(savedSettings));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('storeSettings', JSON.stringify(formData));
    
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso",
    });
  };
  
  const supportMessage = encodeURIComponent("Olá! Preciso de ajuda com o sistema LojaSimples.");

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Informações da Loja
              </h2>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input 
                    id="storeName" 
                    placeholder="Digite o nome da sua loja"
                    value={formData.storeName}
                    onChange={(e) => setFormData(prev => ({...prev, storeName: e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Nome do Proprietário</Label>
                  <Input 
                    id="ownerName" 
                    placeholder="Digite seu nome completo"
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({...prev, ownerName: e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    placeholder="Digite seu telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                  />
                </div>
              </div>
            </div>

            <Button className="w-full sm:w-auto" type="submit">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Suporte
              </h2>
              <p className="text-gray-500 mb-4">
                Precisa de ajuda? Entre em contato com nosso suporte.
              </p>
              <a 
                href={`https://wa.me/5598984447900?text=${supportMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chamar Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;