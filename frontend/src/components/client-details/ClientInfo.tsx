import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ClientInfoProps {
  client: {
    name: string;
    address: string;
    phone: string;
    totalPurchases: number;
    currentDebt: number;
  };
}

export const ClientInfo = ({ client }: ClientInfoProps) => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {client.name}
        </h1>
        <div className="mt-2 text-gray-600">
          <p>{client.address}</p>
          <p>{client.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              R$ {client.totalPurchases ? client.totalPurchases.toFixed(2) : '0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dívida Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              R$ {client.currentDebt ? client.currentDebt.toFixed(2) : '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};