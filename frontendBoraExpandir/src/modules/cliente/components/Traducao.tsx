import { useState } from 'react'
import { FamilyFolders } from './FamilyFolders'
// import { TraducaoModal } from './TraducaoModal'
import { TraducaoModal } from './TraducaoModal'
import { mockFamilyMembers, mockDocuments, mockRequiredDocuments } from '../lib/mock-data'
import type { ApprovedDocument, TranslatedDocument } from '../types'

interface TraduzaoProps {
    approvedDocuments: ApprovedDocument[]
    translatedDocuments: TranslatedDocument[]
    onUploadTranslation: (file: File, approvedDocumentId: string, targetLanguage: string) => void
    onRequestQuote: (documentIds: string[], targetLanguages: string[]) => void
}

export function Traducao({
    approvedDocuments,
    translatedDocuments,
    onUploadTranslation,
    onRequestQuote,
}: TraduzaoProps) {
    const [selectedMember, setSelectedMember] = useState<{ id: string, name: string, type: string } | null>(null)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tradução de Documentos</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Gerencie a tradução dos seus documentos apostilados. Selecione uma pasta para ver os detalhes.
                </p>
            </div>

            <FamilyFolders
                members={mockFamilyMembers}
                documents={mockDocuments} // Fixed: Passing documents
                requiredDocuments={mockRequiredDocuments} // Fixed: Passing requiredDocuments
                onSelectMember={setSelectedMember}
            />

            {selectedMember && (
                <TraducaoModal
                    isOpen={!!selectedMember}
                    onClose={() => setSelectedMember(null)}
                    member={selectedMember}
                    approvedDocuments={approvedDocuments}
                    translatedDocuments={translatedDocuments}
                    onUploadTranslation={onUploadTranslation}
                    onRequestQuote={onRequestQuote}
                />
            )}
        </div>
    )
}
