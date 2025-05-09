
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import ApplicationCard from '../../components/Applications/ApplicationCard';
import FilterBar from '../../components/Internships/FilterBar';
import { useInternships } from '../../contexts/InternshipContext';
import { useAuth } from '../../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { toast } from 'sonner';

const CompanyApplications = () => {
  const { currentUser } = useAuth();
  const { internships, applications, updateApplicationStatus, getCompanyInternships } = useInternships();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInternshipId, setSelectedInternshipId] = useState('all');
  const [companyInternships, setCompanyInternships] = useState([]);
  
  const statusMap = {
    all: 'All Applications',
    pending: 'Pending Applications',
    finalized: 'Finalized Candidates',
    accepted: 'Accepted Candidates',
    rejected: 'Rejected Applications',
    current: 'Current Interns',
    completed: 'Completed Internships'
  };

  // Load company internships and applications
  useEffect(() => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const companyInternshipsList = getCompanyInternships(currentUser.id);
      setCompanyInternships(companyInternshipsList);
      setIsLoading(false);
    }, 500);
  }, [currentUser, getCompanyInternships]);

  // Get applications for this company
  const getCompanyApplications = () => {
    // Get all internship IDs for this company
    const companyInternshipIds = companyInternships.map(internship => internship.id);
    
    // Filter applications by company's internships
    return applications.filter(app => companyInternshipIds.includes(app.internshipId));
  };
  
  // Filter applications
  const filteredApplications = getCompanyApplications().filter(app => {
    // Apply tab filter (status)
    if (activeTab !== 'all' && app.status !== activeTab) {
      return false;
    }
    
    // Apply internship filter
    if (selectedInternshipId !== 'all' && app.internshipId !== selectedInternshipId) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return app.studentName.toLowerCase().includes(term);
    }
    
    return true;
  });
  
  // Get applications with internship details
  const getApplicationsWithInternships = () => {
    return filteredApplications.map(app => {
      const internship = internships.find(i => i.id === app.internshipId) || {};
      return { application: app, internship };
    });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const result = await updateApplicationStatus(applicationId, newStatus);
      
      if (result.success) {
        toast.success(`Application status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update application status");
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Applications Management</h1>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scad-blue"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const applicationCount = filteredApplications.length;
  const pendingCount = getCompanyApplications().filter(app => app.status === 'pending').length;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Applications Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Applications</CardTitle>
              <CardDescription>All applications received</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{getCompanyApplications().length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Review</CardTitle>
              <CardDescription>Applications awaiting your action</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{pendingCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Interns</CardTitle>
              <CardDescription>Active internships in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {getCompanyApplications().filter(app => app.status === 'current').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:max-w-[80%]">
            <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="finalized">Finalized</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="w-full md:w-72">
            <Select 
              value={selectedInternshipId} 
              onValueChange={setSelectedInternshipId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select internship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Internships</SelectItem>
                {companyInternships.map(internship => (
                  <SelectItem key={internship.id} value={internship.id}>
                    {internship.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-6">
          <FilterBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filterOptions={{}}
            placeholder="Search applicants by name"
          />
          
          <TabsContent value={activeTab} className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              {statusMap[activeTab]} ({applicationCount})
            </h2>
            
            {applicationCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getApplicationsWithInternships().map(({ application, internship }) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    internship={internship}
                    viewType="company"
                    onUpdateStatus={handleStatusUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700">No applications found</h3>
                <p className="text-gray-500 mt-2">
                  {activeTab === 'all' 
                    ? "You don't have any applications yet" 
                    : `You don't have any ${activeTab} applications`}
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyApplications;
