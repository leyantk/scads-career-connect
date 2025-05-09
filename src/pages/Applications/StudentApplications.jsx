
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import ApplicationCard from '../../components/Applications/ApplicationCard';
import FilterBar from '../../components/Internships/FilterBar';
import { useInternships } from '../../contexts/InternshipContext';
import { useAuth } from '../../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const StudentApplications = () => {
  const { currentUser } = useAuth();
  const { internships, getStudentApplications } = useInternships();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const statusMap = {
    all: 'All Applications',
    pending: 'Pending',
    finalized: 'Finalized',
    accepted: 'Accepted',
    rejected: 'Rejected',
    current: 'Current Internships',
    completed: 'Completed Internships'
  };

  // Load student applications
  useEffect(() => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const studentApplications = getStudentApplications(currentUser.id);
      setApplications(studentApplications);
      setIsLoading(false);
    }, 500);
  }, [currentUser, getStudentApplications]);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Apply tab filter
    if (activeTab !== 'all' && app.status !== activeTab) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const internship = internships.find(i => i.id === app.internshipId);
      if (!internship) return false;
      
      const term = searchTerm.toLowerCase();
      return (
        internship.title.toLowerCase().includes(term) || 
        internship.companyName.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  // Get internship details for each application
  const getApplicationsWithInternships = () => {
    return filteredApplications.map(app => {
      const internship = internships.find(i => i.id === app.internshipId) || {};
      return { application: app, internship };
    });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Applications</h1>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scad-blue"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Applications</h1>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-8 sm:max-w-3xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="finalized">Finalized</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{statusMap[activeTab]}</h2>
              
              <FilterBar 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterOptions={{}}
              />
              
              {getApplicationsWithInternships().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {getApplicationsWithInternships().map(({ application, internship }) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      internship={internship}
                      viewType="student"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 mt-6">
                  <h3 className="text-xl font-medium text-gray-700">No applications found</h3>
                  <p className="text-gray-500 mt-2">
                    {activeTab === 'all' 
                      ? "You haven't applied to any internships yet"
                      : `You don't have any ${activeTab} applications`}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudentApplications;
