
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Create the context
const InternshipContext = createContext();

// Sample data
const initialInternships = [
  {
    id: 'int1',
    companyId: 'c1',
    companyName: 'TechCorp',
    title: 'Frontend Developer Intern',
    description: 'Work on developing user interfaces for web applications using React.',
    duration: '3 months',
    isPaid: true,
    salary: '$15/hour',
    industry: 'Technology',
    skills: ['JavaScript', 'React', 'HTML/CSS'],
    status: 'active',
    applications: []
  },
  {
    id: 'int2',
    companyId: 'c1',
    companyName: 'TechCorp',
    title: 'Data Analyst Intern',
    description: 'Analyze large datasets and create visualizations to inform business decisions.',
    duration: '6 months',
    isPaid: true,
    salary: '$18/hour',
    industry: 'Technology',
    skills: ['Python', 'SQL', 'Data Visualization'],
    status: 'active',
    applications: []
  },
  {
    id: 'int3',
    companyId: 'c2',
    companyName: 'Marketing Solutions',
    title: 'Marketing Intern',
    description: 'Assist with social media campaigns and content creation.',
    duration: '2 months',
    isPaid: false,
    salary: '',
    industry: 'Marketing',
    skills: ['Social Media', 'Content Creation', 'Communication'],
    status: 'active',
    applications: []
  },
  {
    id: 'int4',
    companyId: 'c3',
    companyName: 'Finance Plus',
    title: 'Financial Analyst Intern',
    description: 'Assist with financial modeling and reporting.',
    duration: '3 months',
    isPaid: true,
    salary: '$20/hour',
    industry: 'Finance',
    skills: ['Excel', 'Financial Modeling', 'Data Analysis'],
    status: 'active',
    applications: []
  },
  {
    id: 'int5',
    companyId: 'c4',
    companyName: 'Health Innovations',
    title: 'Healthcare Administration Intern',
    description: 'Support administrative functions in a healthcare setting.',
    duration: '4 months',
    isPaid: true,
    salary: '$16/hour',
    industry: 'Healthcare',
    skills: ['Organization', 'Communication', 'Microsoft Office'],
    status: 'active',
    applications: []
  }
];

const initialApplications = [
  {
    id: 'app1',
    internshipId: 'int1',
    studentId: 'p1',
    studentName: 'Sarah Johnson',
    status: 'pending',
    appliedDate: '2025-04-15',
    documents: ['resume.pdf', 'cover-letter.pdf']
  }
];

export function InternshipProvider({ children }) {
  const { currentUser } = useAuth();
  const [internships, setInternships] = useState(initialInternships);
  const [applications, setApplications] = useState(initialApplications);
  
  // Function to create a new internship
  const createInternship = (internshipData) => {
    if (currentUser?.role !== 'company') {
      toast.error('Only companies can post internships');
      return { success: false };
    }
    
    const newInternship = {
      id: `int${internships.length + 1}`,
      companyId: currentUser.id,
      companyName: currentUser.name,
      ...internshipData,
      status: 'active',
      applications: []
    };
    
    setInternships([...internships, newInternship]);
    toast.success('Internship posted successfully');
    return { success: true, internship: newInternship };
  };
  
  // Function to update an internship
  const updateInternship = (id, updateData) => {
    if (currentUser?.role !== 'company') {
      toast.error('Only companies can update internships');
      return { success: false };
    }
    
    const updatedInternships = internships.map(internship => {
      if (internship.id === id && internship.companyId === currentUser.id) {
        return { ...internship, ...updateData };
      }
      return internship;
    });
    
    setInternships(updatedInternships);
    toast.success('Internship updated successfully');
    return { success: true };
  };
  
  // Function to delete an internship
  const deleteInternship = (id) => {
    if (currentUser?.role !== 'company') {
      toast.error('Only companies can delete internships');
      return { success: false };
    }
    
    const filteredInternships = internships.filter(
      internship => !(internship.id === id && internship.companyId === currentUser.id)
    );
    
    if (filteredInternships.length === internships.length) {
      toast.error('Internship not found or you do not have permission to delete it');
      return { success: false };
    }
    
    setInternships(filteredInternships);
    toast.success('Internship deleted successfully');
    return { success: true };
  };
  
  // Function to apply for an internship
  const applyForInternship = (internshipId, applicationData) => {
    if (currentUser?.role !== 'student' && currentUser?.role !== 'prostudent') {
      toast.error('Only students can apply for internships');
      return { success: false };
    }
    
    // Check if already applied
    const existingApplication = applications.find(
      app => app.internshipId === internshipId && app.studentId === currentUser.id
    );
    
    if (existingApplication) {
      toast.error('You have already applied for this internship');
      return { success: false };
    }
    
    const newApplication = {
      id: `app${applications.length + 1}`,
      internshipId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      documents: applicationData.documents || []
    };
    
    setApplications([...applications, newApplication]);
    toast.success('Application submitted successfully');
    return { success: true, application: newApplication };
  };
  
  // Function to update application status
  const updateApplicationStatus = (applicationId, status) => {
    if (currentUser?.role !== 'company') {
      toast.error('Only companies can update application status');
      return { success: false };
    }
    
    const updatedApplications = applications.map(app => {
      if (app.id === applicationId) {
        // Check if company owns the internship
        const internship = internships.find(int => int.id === app.internshipId);
        if (internship && internship.companyId === currentUser.id) {
          return { ...app, status };
        }
      }
      return app;
    });
    
    setApplications(updatedApplications);
    toast.success(`Application marked as ${status}`);
    return { success: true };
  };
  
  // Function to get company internships
  const getCompanyInternships = (companyId) => {
    return internships.filter(internship => internship.companyId === companyId);
  };
  
  // Function to get student applications
  const getStudentApplications = (studentId) => {
    return applications.filter(app => app.studentId === studentId);
  };
  
  // Function to get applications for an internship
  const getInternshipApplications = (internshipId) => {
    return applications.filter(app => app.internshipId === internshipId);
  };
  
  const value = {
    internships,
    applications,
    createInternship,
    updateInternship,
    deleteInternship,
    applyForInternship,
    updateApplicationStatus,
    getCompanyInternships,
    getStudentApplications,
    getInternshipApplications
  };
  
  return (
    <InternshipContext.Provider value={value}>
      {children}
    </InternshipContext.Provider>
  );
}

export function useInternships() {
  return useContext(InternshipContext);
}
