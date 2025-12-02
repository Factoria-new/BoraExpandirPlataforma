import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { DocumentUpload } from './components/DocumentUpload'
import { DocumentStatus } from './components/DocumentStatus'
import { ProcessTimeline } from './components/ProcessTimeline'
import { Notifications } from './components/Notifications'
import { DocumentModal } from './components/DocumentModal'
import { 
  mockClient, 
  mockDocuments, 
  mockProcess, 
  mockNotifications, 
  mockRequiredDocuments 
} from './lib/mock-data'
import { Document, Notification } from './types'

export function ClienteApp() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  
  const unreadNotifications = notifications.filter(n => !n.read).length

  const handleUpload = (file: File, documentType: string) => {
    // Simulate file upload
    const newDocument: Document = {
      id: Date.now().toString(),
      clientId: mockClient.id,
      name: mockRequiredDocuments.find(req => req.type === documentType)?.name || 'Documento',
      type: documentType,
      status: 'analyzing',
      uploadDate: new Date(),
      fileName: file.name,
      fileSize: file.size,
    }

    setDocuments(prev => {
      // Remove any existing document of the same type
      const filtered = prev.filter(doc => doc.type !== documentType)
      return [...filtered, newDocument]
    })

    // Add notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      clientId: mockClient.id,
      type: 'info',
      title: 'Documento Recebido',
      message: `Seu documento "${newDocument.name}" foi recebido e está sendo analisado.`,
      read: false,
      createdAt: new Date(),
    }

    setNotifications(prev => [newNotification, ...prev])
  }

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsDocumentModalOpen(true)
  }

  const handleUploadFromStatus = (documentType: string) => {
    // Navigate to upload page for specific document type
    setCurrentPage('upload')
    // Scroll to the specific document section
    setTimeout(() => {
      const element = document.getElementById(`upload-${documentType}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    
    // Auto-mark all notifications as read when entering notifications page
    if (page === 'notifications') {
      handleMarkAllAsRead()
    }
  }

  const handleLogout = () => {
    // Simulate logout
    alert('Logout realizado com sucesso!')
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            client={mockClient}
            documents={documents}
            process={mockProcess}
          />
        )
      case 'process':
        return <ProcessTimeline process={mockProcess} />
      case 'documents':
        return (
          <DocumentStatus 
            documents={documents} 
            onUpload={handleUploadFromStatus}
            onView={handleViewDocument}
          />
        )
      case 'upload':
        return (
          <DocumentUpload
            documents={documents}
            requiredDocuments={mockRequiredDocuments}
            onUpload={handleUpload}
            onDelete={handleDeleteDocument}
          />
        )
      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDismiss={handleDismissNotification}
          />
        )
      default:
        return <Dashboard client={mockClient} documents={documents} process={mockProcess} />
    }
  }

  // Check if client has access
  if (!mockClient.accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-card rounded-lg shadow-md p-8 text-center border border-border">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Acesso Pendente</h2>
          <p className="text-muted-foreground mb-4">
            Seu acesso será liberado automaticamente após a confirmação do pagamento.
          </p>
          <div className="text-sm text-muted-foreground">
            Status do pagamento: <span className="font-medium text-warning">
              {mockClient.paymentStatus === 'pending' ? 'Aguardando confirmação' : 'Processando'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        client={mockClient}
        unreadNotifications={unreadNotifications}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      
      <div className="md:ml-80">
        <main className="p-4 md:p-8">
          {renderContent()}
        </main>
      </div>

      <DocumentModal
        document={selectedDocument}
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
      />
    </div>
  )
}
