import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Plus, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

type UserRole = "sales" | "legal" | "finance";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
  avatar: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Dra. Ana Silva",
    email: "ana.silva@company.com",
    role: "legal",
    lastActive: "2 min atrás",
    avatar: "AS",
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos.santos@company.com",
    role: "sales",
    lastActive: "15 min atrás",
    avatar: "CS",
  },
  {
    id: "3",
    name: "Marina Costa",
    email: "marina.costa@company.com",
    role: "finance",
    lastActive: "1 hora atrás",
    avatar: "MC",
  },
];

const getRoleBadgeVariant = (role: UserRole): string => {
  const variants: Record<UserRole, string> = {
    sales: "bg-role-sales/10 text-role-sales border-role-sales/20",
    legal: "bg-role-legal/10 text-role-legal border-role-legal/20",
    finance: "bg-role-finance/10 text-role-finance border-role-finance/20",
  };
  return variants[role];
};

const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    sales: "Vendas",
    legal: "Jurídico",
    finance: "Financeiro",
  };
  return labels[role];
};

export default function UserManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Equipe</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Convidar Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Convidar Novo Usuário</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Adicione um novo membro à equipe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="João Silva"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao.silva@company.com"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">Função</Label>
                <Select>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="sales">Vendas</SelectItem>
                    <SelectItem value="legal">Jurídico</SelectItem>
                    <SelectItem value="finance">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Senha Temporária</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-border text-foreground"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Enviar Convite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Membros da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Usuário</TableHead>
                <TableHead className="text-muted-foreground">Função</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Última Atividade</TableHead>
                <TableHead className="text-muted-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-primary/20">
                        <AvatarFallback className="text-primary text-sm font-medium">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getRoleBadgeVariant(user.role)}
                    >
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
