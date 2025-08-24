import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Transaction {
  _id: string;
  date: string;
  description: string;
  type: 'purchase' | 'payment';
  amount: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionsTable = ({ transactions, onDelete }: TransactionsTableProps) => (
  <div className="max-w-[95vw] md:max-w-none">
    <div className="w-full overflow-x-auto md:overflow-visible">
      <Table className="w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell className="whitespace-nowrap">
                {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {transaction.description}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {transaction.type === "purchase" ? "Compra" : "Pagamento"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                R$ {transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(transaction._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);