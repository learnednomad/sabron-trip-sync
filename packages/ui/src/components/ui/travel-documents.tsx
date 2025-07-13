import * as React from 'react';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  CreditCard, 
  Shield, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Plane,
  Car,
  Building,
  MapPin,
  Clock,
  Share
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const travelDocumentsVariants = cva(
  'relative w-full bg-background border rounded-lg',
  {
    variants: {
      preset: {
        default: 'border-border',
        travel: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
        minimal: 'border-0 shadow-none bg-transparent',
        compact: 'border-border p-3',
      },
      size: {
        small: 'p-3',
        default: 'p-4',
        large: 'p-6',
      },
      layout: {
        list: 'space-y-3',
        grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        compact: 'space-y-2',
      },
    },
    defaultVariants: {
      preset: 'travel',
      size: 'default',
      layout: 'list',
    },
  }
);

export interface TravelDocument {
  id: string;
  type: 'passport' | 'visa' | 'driver-license' | 'insurance' | 'vaccination' | 'flight' | 'hotel' | 'rental' | 'other';
  title: string;
  description?: string;
  issueDate?: Date;
  expiryDate?: Date;
  documentNumber?: string;
  issuingAuthority?: string;
  country?: string;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
  category: 'identity' | 'travel' | 'health' | 'booking' | 'insurance' | 'other';
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  tags?: string[];
  notes?: string;
  isRequired?: boolean;
  reminderDays?: number;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  required?: boolean;
}

export interface TravelDocumentsProps
  extends VariantProps<typeof travelDocumentsVariants> {
  // Documents
  documents?: TravelDocument[];
  categories?: DocumentCategory[];
  
  // Trip context
  destination?: string;
  departureDate?: Date;
  returnDate?: Date;
  
  // Events
  onDocumentAdd?: (type: TravelDocument['type']) => void;
  onDocumentEdit?: (document: TravelDocument) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentView?: (document: TravelDocument) => void;
  onDocumentUpload?: (file: File, type: TravelDocument['type']) => void;
  onDocumentDownload?: (document: TravelDocument) => void;
  onDocumentShare?: (document: TravelDocument) => void;
  
  // Features
  showUpload?: boolean;
  showExpiry?: boolean;
  showReminders?: boolean;
  showCategories?: boolean;
  showRequiredOnly?: boolean;
  enableSharing?: boolean;
  
  // Labels
  addDocumentTx?: string;
  noDocumentsTx?: string;
  
  // Styling
  className?: string;
  
  // States
  loading?: boolean;
  error?: string;
  
  // Custom renderers
  renderDocument?: (document: TravelDocument) => React.ReactNode;
  renderCategory?: (category: DocumentCategory, documents: TravelDocument[]) => React.ReactNode;
  renderCustomUploadArea?: () => React.ReactNode;
}

export const TravelDocuments = React.forwardRef<HTMLDivElement, TravelDocumentsProps>(
  ({
    preset,
    size,
    layout,
    documents = [],
    categories,
    destination,
    departureDate,
    returnDate,
    onDocumentAdd,
    onDocumentEdit,
    onDocumentDelete,
    onDocumentView,
    onDocumentUpload,
    onDocumentDownload,
    onDocumentShare,
    showUpload = true,
    showExpiry = true,
    showCategories = true,
    showRequiredOnly = false,
    enableSharing = false,
    addDocumentTx = 'documents.add',
    noDocumentsTx = 'documents.empty',
    className,
    loading = false,
    error,
    renderDocument,
    renderCategory,
    renderCustomUploadArea,
  }, ref) => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAddMenu, setShowAddMenu] = useState(false);
    
    const defaultCategories: DocumentCategory[] = [
      {
        id: 'identity',
        name: 'Identity',
        icon: <CreditCard className="w-4 h-4" />,
        color: 'blue',
        required: true,
      },
      {
        id: 'travel',
        name: 'Travel',
        icon: <Plane className="w-4 h-4" />,
        color: 'green',
        required: true,
      },
      {
        id: 'health',
        name: 'Health',
        icon: <Shield className="w-4 h-4" />,
        color: 'red',
        required: false,
      },
      {
        id: 'booking',
        name: 'Bookings',
        icon: <Calendar className="w-4 h-4" />,
        color: 'purple',
        required: false,
      },
      {
        id: 'insurance',
        name: 'Insurance',
        icon: <Shield className="w-4 h-4" />,
        color: 'orange',
        required: false,
      },
    ];
    
    const documentCategories = categories || defaultCategories;
    
    const getDocumentIcon = (type: TravelDocument['type']) => {
      const iconMap = {
        passport: <CreditCard className="w-4 h-4 text-blue-600" />,
        visa: <FileText className="w-4 h-4 text-green-600" />,
        'driver-license': <Car className="w-4 h-4 text-gray-600" />,
        insurance: <Shield className="w-4 h-4 text-orange-600" />,
        vaccination: <Shield className="w-4 h-4 text-red-600" />,
        flight: <Plane className="w-4 h-4 text-blue-600" />,
        hotel: <Building className="w-4 h-4 text-purple-600" />,
        rental: <Car className="w-4 h-4 text-green-600" />,
        other: <FileText className="w-4 h-4 text-gray-600" />,
      };
      
      return typeof type === 'string' && type in iconMap 
        ? iconMap[type as keyof typeof iconMap] 
        : <FileText className="w-4 h-4 text-gray-600" />;
    };
    
    const getStatusIcon = (status: TravelDocument['status']) => {
      switch (status) {
        case 'valid':
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'expiring':
          return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
        case 'expired':
          return <XCircle className="w-4 h-4 text-red-500" />;
        case 'missing':
          return <XCircle className="w-4 h-4 text-gray-400" />;
        default:
          return null;
      }
    };
    
    const getStatusColor = (status: TravelDocument['status']) => {
      switch (status) {
        case 'valid':
          return 'text-green-600 bg-green-50 border-green-200';
        case 'expiring':
          return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'expired':
          return 'text-red-600 bg-red-50 border-red-200';
        case 'missing':
          return 'text-gray-600 bg-gray-50 border-gray-200';
        default:
          return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    };
    
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const isExpiringSoon = (expiryDate: Date) => {
      if (!expiryDate) return false;
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };
    
    const isExpired = (expiryDate: Date) => {
      if (!expiryDate) return false;
      return expiryDate.getTime() < new Date().getTime();
    };
    
    const getDocumentStatus = (document: TravelDocument): TravelDocument['status'] => {
      if (document.status === 'missing') return 'missing';
      if (!document.expiryDate) return 'valid';
      if (isExpired(document.expiryDate)) return 'expired';
      if (isExpiringSoon(document.expiryDate)) return 'expiring';
      return 'valid';
    };
    
    const filteredDocuments = showRequiredOnly 
      ? documents.filter(doc => doc.isRequired) 
      : documents;
    
    const documentsByCategory = selectedCategory
      ? filteredDocuments.filter(doc => doc.category === selectedCategory)
      : filteredDocuments;
    
    const renderDocumentItem = (document: TravelDocument) => {
      if (renderDocument) return renderDocument(document);
      
      const status = getDocumentStatus(document);
      
      return (
        <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getDocumentIcon(document.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-foreground truncate">{document.title}</h4>
                {document.isRequired && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                )}
              </div>
              
              {document.description && (
                <p className="text-sm text-muted-foreground truncate">{document.description}</p>
              )}
              
              <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                {document.documentNumber && (
                  <span>#{document.documentNumber}</span>
                )}
                {document.expiryDate && showExpiry && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Expires {document.expiryDate.toLocaleDateString()}</span>
                  </div>
                )}
                {document.fileSize && (
                  <span>{formatFileSize(document.fileSize)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={cn('flex items-center space-x-1 px-2 py-1 rounded-full text-xs border', getStatusColor(status))}>
              {getStatusIcon(status)}
              <span className="capitalize">{status}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {onDocumentView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentView(document)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              
              {onDocumentDownload && document.fileUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentDownload(document)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              
              {enableSharing && onDocumentShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentShare(document)}
                >
                  <Share className="w-4 h-4" />
                </Button>
              )}
              
              {onDocumentEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentEdit(document)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              
              {onDocumentDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentDelete(document.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    };
    
    const renderCategoryFilter = () => {
      if (!showCategories) return null;
      
      return (
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          
          {documentCategories.map((category) => {
            const categoryDocs = documents.filter(doc => doc.category === category.id);
            
            if (renderCategory) {
              return renderCategory(category, categoryDocs);
            }
            
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                {category.icon}
                <span>{category.name}</span>
                <span className="text-xs bg-muted text-muted-foreground px-1 rounded">
                  {categoryDocs.length}
                </span>
              </Button>
            );
          })}
        </div>
      );
    };
    
    const renderAddDocumentMenu = () => {
      if (!showAddMenu) return null;
      
      const documentTypes = [
        { type: 'passport', label: 'Passport', icon: <CreditCard className="w-4 h-4" /> },
        { type: 'visa', label: 'Visa', icon: <FileText className="w-4 h-4" /> },
        { type: 'driver-license', label: 'Driver License', icon: <Car className="w-4 h-4" /> },
        { type: 'insurance', label: 'Insurance', icon: <Shield className="w-4 h-4" /> },
        { type: 'vaccination', label: 'Vaccination', icon: <Shield className="w-4 h-4" /> },
        { type: 'flight', label: 'Flight Ticket', icon: <Plane className="w-4 h-4" /> },
        { type: 'hotel', label: 'Hotel Booking', icon: <Building className="w-4 h-4" /> },
        { type: 'rental', label: 'Car Rental', icon: <Car className="w-4 h-4" /> },
      ];
      
      return (
        <div className="absolute top-full right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 min-w-48">
          <div className="p-2 space-y-1">
            {documentTypes.map((docType) => (
              <button
                key={docType.type}
                onClick={() => {
                  onDocumentAdd?.(docType.type as TravelDocument['type']);
                  setShowAddMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-muted rounded transition-colors"
              >
                {docType.icon}
                <span>{docType.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    };
    
    const renderUploadArea = () => {
      if (!showUpload) return null;
      
      if (renderCustomUploadArea) return renderCustomUploadArea();
      
      return (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag and drop documents here, or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF, JPG, PNG files up to 10MB
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(file => onDocumentUpload?.(file, 'other'));
            }}
          />
        </div>
      );
    };

    if (loading) {
      return (
        <div className={cn(travelDocumentsVariants({ preset, size, layout }), className)} ref={ref}>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading documents...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn(travelDocumentsVariants({ preset, size, layout }), className)} ref={ref}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-foreground">Travel Documents</h3>
            {destination && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{destination}</span>
              </div>
            )}
          </div>
          
          {onDocumentAdd && (
            <div className="relative">
              <Button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t(addDocumentTx)}</span>
              </Button>
              {renderAddDocumentMenu()}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        {/* Trip info */}
        {(departureDate || returnDate) && (
          <div className="flex items-center space-x-4 mb-4 p-3 bg-muted rounded-lg text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Trip:</span>
            </div>
            {departureDate && (
              <span>{departureDate.toLocaleDateString()}</span>
            )}
            {departureDate && returnDate && <span>-</span>}
            {returnDate && (
              <span>{returnDate.toLocaleDateString()}</span>
            )}
          </div>
        )}
        
        {/* Category filter */}
        {renderCategoryFilter()}
        
        {/* Documents list */}
        {documentsByCategory.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t(noDocumentsTx)}</p>
            {renderUploadArea()}
          </div>
        ) : (
          <div className={cn(layout === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-3')}>
            {documentsByCategory.map(renderDocumentItem)}
          </div>
        )}
        
        {/* Upload area for existing documents */}
        {documentsByCategory.length > 0 && showUpload && (
          <div className="mt-6">
            {renderUploadArea()}
          </div>
        )}
        
        {/* Summary stats */}
        {documents.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">
                {documents.filter(d => getDocumentStatus(d) === 'valid').length}
              </div>
              <div className="text-xs text-green-600">Valid</div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-semibold text-yellow-600">
                {documents.filter(d => getDocumentStatus(d) === 'expiring').length}
              </div>
              <div className="text-xs text-yellow-600">Expiring</div>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-600">
                {documents.filter(d => getDocumentStatus(d) === 'expired').length}
              </div>
              <div className="text-xs text-red-600">Expired</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-600">
                {documents.filter(d => d.isRequired && getDocumentStatus(d) === 'missing').length}
              </div>
              <div className="text-xs text-gray-600">Missing</div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TravelDocuments.displayName = 'TravelDocuments';

export { travelDocumentsVariants };