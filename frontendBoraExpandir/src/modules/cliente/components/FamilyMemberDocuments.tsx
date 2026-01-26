import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { DocumentUpload } from './DocumentUpload'
import { Document, RequiredDocument } from '../types'

interface FamilyMember {
    id: string
    name: string
    type: string
}

interface FamilyMemberDocumentsProps {
    member: FamilyMember
    onBack: () => void
    clienteId: string
    documents: Document[] // All documents, we filter inside or pass filtered
    requiredDocuments: RequiredDocument[]
    onUploadSuccess?: (data: any) => void
    onDelete: (documentId: string) => void
}

export function FamilyMemberDocuments({
    member,
    onBack,
    clienteId,
    documents,
    requiredDocuments,
    onUploadSuccess,
    onDelete
}: FamilyMemberDocumentsProps) {

    // Filter documents for this member (mock logic: assuming documents have memberId or we simulate it)
    // modifying mock logic: for now showing the common list but ideally filtered.
    // In a real app, `requiredDocuments` would be fetched for this specific `member.id`

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documentos: {member.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.type}</p>
                </div>
            </div>

            <DocumentUpload
                clienteId={clienteId}
                documents={documents}
                requiredDocuments={requiredDocuments}
                onUploadSuccess={onUploadSuccess}
                onDelete={onDelete}
            />
        </div>
    )
}
