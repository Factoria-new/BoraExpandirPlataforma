import { useState } from 'react'
import { FamilyFolders } from './FamilyFolders'
import { FamilyMemberModal } from './FamilyMemberModal'
import { mockFamilyMembers } from '../lib/mock-data'
import { Document, RequiredDocument } from '../types'

interface DocumentUploadFlowProps {
    clienteId: string
    documents: Document[]
    requiredDocuments: RequiredDocument[]
    onUploadSuccess?: (data: any) => void
    onDelete: (documentId: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function DocumentUploadFlow({
    clienteId,
    documents,
    requiredDocuments,
    onUploadSuccess,
    onDelete
}: DocumentUploadFlowProps) {
    const [selectedMember, setSelectedMember] = useState<{ id: string, name: string, type: string } | null>(null)

    const handleUpload = async (file: File, documentType: string, memberId: string) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('clienteId', clienteId)
        formData.append('documentType', documentType)
        formData.append('memberId', memberId)

        const response = await fetch(`${API_BASE_URL}/cliente/uploadDoc`, {
            method: 'POST',
            body: formData
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Erro ao enviar documento')
        }

        onUploadSuccess?.({ ...result.data, memberId })
    }

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Envio de Documentos</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Selecione a pasta do familiar para enviar os documentos solicitados.
                    </p>
                </div>

                <FamilyFolders
                    members={mockFamilyMembers}
                    documents={documents}
                    requiredDocuments={requiredDocuments}
                    onSelectMember={setSelectedMember}
                />
            </div>

            {selectedMember && (
                <FamilyMemberModal
                    isOpen={!!selectedMember}
                    onClose={() => setSelectedMember(null)}
                    member={selectedMember}
                    documents={documents}
                    requiredDocuments={requiredDocuments}
                    onUpload={handleUpload}
                    onDelete={onDelete}
                />
            )}
        </>
    )
}
