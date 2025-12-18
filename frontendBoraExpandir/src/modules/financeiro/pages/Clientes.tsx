
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../adm/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../adm/components/ui/card";
import { Button } from "../../adm/components/ui/button";
import { Input } from "../../adm/components/ui/input";
import { Search, Plus, Filter, FileSpreadsheet } from "lucide-react";

interface Cliente {
    id: string;
    nomeCompleto: string;
    cpf: string;
    passaporte: string;
    lugarNascimento: string;
    nacionalidade: string;
    estadoCivil: string;
    profissao: string;
    paisNascimento: string;
    dataNascimento?: string;
}

const mockClientes: Cliente[] = [
    {
        id: "1",
        nomeCompleto: "Açucena da Anunciação Queiroz",
        cpf: "862.326.915-20",
        passaporte: "GH128749",
        lugarNascimento: "Salvador/BA",
        nacionalidade: "Brasileira",
        estadoCivil: "Casada",
        profissao: "Atendente de Farmácia",
        paisNascimento: "Brasil",
    },
    {
        id: "2",
        nomeCompleto: "Alba Moreira Fontenele",
        cpf: "935.663.522-68",
        passaporte: "GK148186",
        lugarNascimento: "Fortaleza/CE",
        nacionalidade: "Brasileira",
        estadoCivil: "Casada",
        profissao: "Biomédica",
        paisNascimento: "Brasil",
    },
    {
        id: "3",
        nomeCompleto: "Ana Paula Lima Dos Santos",
        cpf: "293.515.648-00",
        passaporte: "Não consta no cadastro",
        lugarNascimento: "São Paulo/SP",
        nacionalidade: "brasileira",
        estadoCivil: "Casada",
        profissao: "supervisora",
        paisNascimento: "Brasil",
    },
    {
        id: "4",
        nomeCompleto: "Andeecleebson Xeineeclee Fabiano Roques M",
        cpf: "053.544.589-00",
        passaporte: "GM170017",
        lugarNascimento: "São Ludgero/SC",
        nacionalidade: "Brasileira",
        estadoCivil: "Casado",
        profissao: "Analista",
        paisNascimento: "Brasil",
    },
    {
        id: "5",
        nomeCompleto: "Antônio Marcos Viana Antunes",
        cpf: "967.798.100-53",
        passaporte: "FS872755",
        lugarNascimento: "Belo Horizonte/MG",
        nacionalidade: "brasileiro",
        estadoCivil: "Divorciado",
        profissao: "eletrotécnico",
        paisNascimento: "Brasil",
    },
    {
        id: "6",
        nomeCompleto: "Camile Khristime Souza Da Silva",
        cpf: "116.270.896.40",
        passaporte: "FP336629",
        lugarNascimento: "Rio de Janeiro/RJ",
        nacionalidade: "Brasileira",
        estadoCivil: "Solteira",
        profissao: "ajudante de cozinha",
        paisNascimento: "Brasil",
    },
    {
        id: "7",
        nomeCompleto: "Clistenes Fernandes Dos Reis",
        cpf: "268.159.822-20",
        passaporte: "Não consta no cadastro",
        lugarNascimento: "Goiania/GO",
        nacionalidade: "brasileiro",
        estadoCivil: "Casado",
        profissao: "empresário",
        paisNascimento: "Brasil",
    },
    {
        id: "8",
        nomeCompleto: "Cristiane Germano Paes",
        cpf: "008.517.340-14",
        passaporte: "FW632787",
        lugarNascimento: "Curitiba/PR",
        nacionalidade: "Brasileira",
        estadoCivil: "Solteira",
        profissao: "Fisioterapeuta e Maquiadora",
        paisNascimento: "Brasil",
    },
    {
        id: "9",
        nomeCompleto: "Daniel Breves Nogueirol",
        cpf: "101.584.377-80",
        passaporte: "RG nº 13.115.629",
        lugarNascimento: "Porto Alegre/RS",
        nacionalidade: "brasileiro",
        estadoCivil: "casado",
        profissao: "arquiteto",
        paisNascimento: "Brasil",
    },
    {
        id: "10",
        nomeCompleto: "Débora França de Mendonça Silva",
        cpf: "223.185.538-07",
        passaporte: "GF495851",
        lugarNascimento: "Recife/PE",
        nacionalidade: "Brasileira",
        estadoCivil: "casada",
        profissao: "Designer de jóias",
        paisNascimento: "Brasil",
    },
    {
        id: "11",
        nomeCompleto: "Diego Campos Fontenele",
        cpf: "112.971.637-61",
        passaporte: "GK439212",
        lugarNascimento: "Manaus/AM",
        nacionalidade: "Brasileiro",
        estadoCivil: "casado",
        profissao: "empresário",
        paisNascimento: "Brasil",
    },
    {
        id: "12",
        nomeCompleto: "Elsie Barros Vales",
        cpf: "567.782.952.87",
        passaporte: "GC908964",
        lugarNascimento: "Belem/PA",
        nacionalidade: "Brasileiro",
        estadoCivil: "Casado",
        profissao: "Tec. em Radiologia",
        paisNascimento: "Brasil",
    },
    {
        id: "13",
        nomeCompleto: "Erenildo Pereira de Souza",
        cpf: "449.426.458-08",
        passaporte: "GL586209",
        lugarNascimento: "Salvador/BA",
        nacionalidade: "Brasileiro",
        estadoCivil: "Casado",
        profissao: "Operador de Logística",
        paisNascimento: "Brasil",
    }
];

export function Clientes() {
    const [searchTerm, setSearchTerm] = useState("");
    const [clientes] = useState<Cliente[]>(mockClientes);

    const filteredClientes = clientes.filter(cliente =>
        cliente.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf.includes(searchTerm) ||
        cliente.passaporte.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Base de Clientes</h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie as informações detalhadas de todos os clientes
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrar
                    </Button>
                    <Button variant="outline">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Cliente
                    </Button>
                </div>
            </div>

            <Card className="border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Tabela de Clientes</CardTitle>
                    <div className="relative max-w-sm mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por nome, CPF ou passaporte..."
                            className="pl-9 bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold text-foreground">Nome Completo</TableHead>
                                    <TableHead className="font-semibold text-foreground">CPF</TableHead>
                                    <TableHead className="font-semibold text-foreground">Passaporte</TableHead>
                                    <TableHead className="font-semibold text-foreground">Lugar de Nascimento</TableHead>
                                    <TableHead className="font-semibold text-foreground">Nacionalidade</TableHead>
                                    <TableHead className="font-semibold text-foreground">Estado Civil</TableHead>
                                    <TableHead className="font-semibold text-foreground">Profissao</TableHead>
                                    <TableHead className="font-semibold text-foreground">País de Nascimento</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClientes.map((cliente) => (
                                    <TableRow key={cliente.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium text-foreground">{cliente.nomeCompleto}</TableCell>
                                        <TableCell className="text-muted-foreground">{cliente.cpf}</TableCell>
                                        <TableCell className="text-muted-foreground">{cliente.passaporte}</TableCell>
                                        <TableCell className="text-muted-foreground">{cliente.lugarNascimento || "-"}</TableCell>
                                        <TableCell className="text-muted-foreground capitalize">{cliente.nacionalidade}</TableCell>
                                        <TableCell className="text-muted-foreground capitalize">{cliente.estadoCivil}</TableCell>
                                        <TableCell className="text-muted-foreground capitalize">{cliente.profissao}</TableCell>
                                        <TableCell className="text-muted-foreground">{cliente.paisNascimento}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground text-center">
                        Mostrando {filteredClientes.length} de {clientes.length} registros
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
