
import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useSCAD } from '../../contexts/SCADContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader, 
  CardTitle,
  CardDescription 
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Check, X, FileText, Building, Search } from 'lucide-react';
import { toast } from 'sonner';

const CompanyApplicationsReview = () => {
  const { currentUser } = useAuth();
  const { companyApplications, reviewCompanyApplication } = useSCAD();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  
  // Redirect if not SCAD Office
  if (currentUser?.role !== 'scadoffice') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </MainLayout>
    );
  }
  
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setViewMode(true);
  };
  
  const handleApproveReject = async (applicationId, approved) => {
    try {
      await reviewCompanyApplication(applicationId, approved);
      setViewMode(false);
      
      const action = approved ? 'approved' : 'rejected';
      toast.success(`Company application ${action} successfully`);
    } catch (error) {
      console.error("Review error:", error);
      toast.error(`Failed to ${approved ? 'approve' : 'reject'} application`);
    }
  };
  
  // Get unique industries from applications
  const industries = [...new Set(companyApplications.map(app => app.industry))];
  
  // Filter applications
  const filteredApplications = companyApplications.filter(app => {
    // Only show pending applications
    if (app.status !== 'pending') return false;
    
    // Apply search filter
    if (searchTerm && !app.companyName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply industry filter
    if (industryFilter && app.industry !== industryFilter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Company Applications Review</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by company name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select 
            value={industryFilter} 
            onValueChange={setIndustryFilter}
          >
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Industries</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filteredApplications.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Pending Company Applications</CardTitle>
              <CardDescription>
                Review and verify company applications to join the SCAD system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.companyName}</TableCell>
                      <TableCell>{application.industry}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {application.size}
                        </Badge>
                      </TableCell>
                      <TableCell>{application.submissionDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {application.documents.length} files
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewApplication(application)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No pending applications</h3>
            <p className="text-gray-500 mt-2">All company applications have been processed</p>
          </div>
        )}
        
        {/* Application Review Dialog */}
        <Dialog open={viewMode} onOpenChange={setViewMode}>
          <DialogContent className="max-w-3xl">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <DialogTitle>Company Application Review</DialogTitle>
                  <DialogDescription>
                    Review the details of this company application
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Company Details</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Name:</span>
                          <span>{selectedApplication.companyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Industry:</span>
                          <span>{selectedApplication.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Size:</span>
                          <span className="capitalize">{selectedApplication.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Email:</span>
                          <span>{selectedApplication.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Submitted:</span>
                          <span>{selectedApplication.submissionDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Documents</h3>
                      <div className="mt-2 space-y-2">
                        {selectedApplication.documents.map((doc, index) => (
                          <div key={index} className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-32 w-32 rounded-md border flex items-center justify-center bg-gray-50 mb-4">
                      <img 
                        src={selectedApplication.logo} 
                        alt={`${selectedApplication.companyName} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Verification Notes</h3>
                      <div className="text-sm text-gray-600 mt-2">
                        <p>
                          Before approving, verify that the company is legitimate and the documents are authentic.
                        </p>
                        <ul className="list-disc list-inside mt-2">
                          <li>Check the company's official website</li>
                          <li>Verify the business registration documents</li>
                          <li>Confirm the company email domain is official</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button 
                    variant="destructive"
                    onClick={() => handleApproveReject(selectedApplication.id, false)}
                  >
                    <X className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  <Button 
                    onClick={() => handleApproveReject(selectedApplication.id, true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" /> Approve
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default CompanyApplicationsReview;
