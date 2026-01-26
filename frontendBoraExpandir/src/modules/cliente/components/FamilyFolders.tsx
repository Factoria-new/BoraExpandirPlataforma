import { Folder, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Document, RequiredDocument } from '../types'

interface FamilyMember {
    id: string
    name: string
    type: string
}

interface FamilyFoldersProps {
    members: FamilyMember[]
    documents: Document[]
    requiredDocuments: RequiredDocument[]
    onSelectMember: (member: FamilyMember) => void
}

export function FamilyFolders({ members, documents, requiredDocuments, onSelectMember }: FamilyFoldersProps) {

    const getMemberStats = (memberId: string) => {
        // Filter docs for this member
        const memberDocs = documents.filter(d => d.clientId === '1') // TODO: Filter by memberId when available in mock
        // For now we map all to the main client or we need to update mock data structure better.
        // Assuming documents have memberId or we mock it. 
        // Let's use a mock strategy: if doc has memberId use it, else if member.type is 'Titular' use valid ones.

        // BETTER STRATEGY FOR MOCK: 
        // Let's iterate required docs. 
        // If we don't have memberIds on docs yet, I will simulate stats for demonstration based on the user request.
        // User wants to see "1 Rejeitado", etc.
        // I will mock the stats calculation for now until we have memberId on Document type fully populated.

        const memberSpecificDocs = documents.filter(doc => doc.memberId === memberId)

        const rejected = memberSpecificDocs.filter(d => d.status === 'rejected').length
        const pending = memberSpecificDocs.filter(d => d.status === 'analyzing' || d.status === 'pending').length
        const approved = memberSpecificDocs.filter(d => d.status === 'approved').length

        return { rejected, pending, approved }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {members.map((member) => {
                const stats = getMemberStats(member.id)
                const hasRejected = stats.rejected > 0

                return (
                    <Card
                        key={member.id}
                        className={`cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden border-2
              ${hasRejected ? 'border-red-200 bg-red-50/30' : 'border-blue-100 dark:border-blue-900 bg-white dark:bg-gray-800'}
            `}
                        onClick={() => onSelectMember(member)}
                    >
                        {hasRejected && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                                Ação Necessária
                            </div>
                        )}

                        <CardContent className="p-5 flex flex-col items-center text-center space-y-4">
                            <div className={`p-3 rounded-full ${hasRejected ? 'bg-red-100' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                <Folder className={`h-12 w-12 ${hasRejected ? 'text-red-500' : 'text-blue-500'}`} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.type}</p>
                            </div>

                            {/* Mini Dashboard on Card */}
                            <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                                        {stats.rejected}
                                    </span>
                                    <span className="text-[10px] text-gray-400">Rejeitados</span>
                                </div>
                                <div className="flex flex-col items-center border-l border-r border-gray-100 dark:border-gray-700">
                                    <span className="text-xs font-bold text-yellow-600">
                                        {stats.pending}
                                    </span>
                                    <span className="text-[10px] text-gray-400">Análise</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-green-600">
                                        {stats.approved}
                                    </span>
                                    <span className="text-[10px] text-gray-400">Aprovados</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
