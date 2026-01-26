import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { FileDown, Search } from 'lucide-react'
import { Input } from '../components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import { mockDocuments, mockClient } from '../../cliente/lib/mock-data'
import { formatDate } from '../../cliente/lib/utils'

export function AdminApostilamento() {
    const [searchTerm, setSearchTerm] = useState('')

    // Filter documents with status 'sent_for_apostille'
    // In a real app, this would fetch from backend
    const documents = mockDocuments.filter(doc =>
        doc.status === 'sent_for_apostille' &&
        (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mockClient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleDownload = (docId: string, docName: string) => {
        // Simulate download
        console.log(`Downloading document ${docId}: ${docName}`)
        alert(`Iniciando download de: ${docName}`)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Enviar para Apostilagem</h1>
                <p className="text-muted-foreground">
                    Gerencie e baixe documentos enviados pelos clientes para apostilamento.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Documentos Pendentes de Envio para Cartório</CardTitle>
                    <div className="flex items-center space-x-2 mt-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente ou documento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Data Envio</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        Nenhum documento pendente para apostilagem.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{mockClient.name}</TableCell>
                                        <TableCell>{doc.name}</TableCell>
                                        <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300">
                                                Pendente Envio
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-2"
                                                onClick={() => handleDownload(doc.id, doc.name)}
                                            >
                                                <FileDown className="h-4 w-4" />
                                                Baixar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
