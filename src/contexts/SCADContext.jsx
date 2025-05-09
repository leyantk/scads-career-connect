
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Create the context
const SCADContext = createContext();

// Initial data
const initialCompanyApplications = [
  {
    id: 'ca1',
    companyName: 'NextGen Software',
    industry: 'Technology',
    size: 'medium',
    email: 'info@nextgensoftware.com',
    logo: 'https://via.placeholder.com/150',
    documents: ['tax_documents.pdf', 'business_license.pdf'],
    status: 'pending',
    submissionDate: '2025-04-01'
  },
  {
    id: 'ca2',
    companyName: 'Global Marketing',
    industry: 'Marketing',
    size: 'small',
    email: 'contact@globalmarketing.com',
    logo: 'https://via.placeholder.com/150',
    documents: ['tax_documents.pdf'],
    status: 'pending',
    submissionDate: '2025-03-28'
  },
  {
    id: 'ca3',
    companyName: 'Financial Advisors Inc',
    industry: 'Finance',
    size: 'large',
    email: 'hr@financialadvisors.com',
    logo: 'https://via.placeholder.com/150',
    documents: ['tax_documents.pdf', 'business_license.pdf'],
    status: 'pending',
    submissionDate: '2025-04-04'
  }
];

const initialInternshipReports = [
  {
    id: 'ir1',
    studentId: 'p1',
    studentName: 'Sarah Johnson',
    companyName: 'TechCorp',
    title: 'My Experience as a Marketing Intern',
    content: 'This report details my 3-month internship experience...',
    status: 'pending',
    submissionDate: '2025-03-15',
    courses: ['MKT301', 'MKT405'],
    comments: []
  }
];

const initialWorkshops = [
  {
    id: 'ws1',
    title: 'Resume Building Workshop',
    description: 'Learn how to create an effective resume that stands out to employers.',
    speaker: 'Jane Smith, Career Coach',
    speakerBio: 'Jane Smith has 15+ years of experience in career counseling and HR.',
    agenda: '1. Introduction to resume formats\n2. Highlighting your achievements\n3. Tailoring your resume for specific roles\n4. Common mistakes to avoid',
    startDate: '2025-05-15',
    endDate: '2025-05-15',
    startTime: '14:00',
    endTime: '16:00',
    isLive: true,
    recordingUrl: '',
    registrants: []
  },
  {
    id: 'ws2',
    title: 'Interview Skills Masterclass',
    description: 'Master the art of interviewing with practical tips and mock scenarios.',
    speaker: 'David Wong, Hiring Manager',
    speakerBio: 'David Wong has conducted over 1,000 interviews for top tech companies.',
    agenda: '1. Preparing for interviews\n2. Answering common questions\n3. Behavioral interviewing techniques\n4. Following up after interviews',
    startDate: '2025-05-20',
    endDate: '2025-05-20',
    startTime: '10:00',
    endTime: '12:00',
    isLive: true,
    recordingUrl: '',
    registrants: []
  },
  {
    id: 'ws3',
    title: 'LinkedIn Profile Optimization',
    description: 'Learn how to optimize your LinkedIn profile to attract recruiters.',
    speaker: 'Maria Garcia, LinkedIn Specialist',
    speakerBio: 'Maria Garcia is a certified LinkedIn trainer and career strategist.',
    agenda: '1. Profile best practices\n2. Building a professional network\n3. Engaging with content\n4. Using LinkedIn for job search',
    startDate: '2025-04-10',
    endDate: '2025-04-10',
    startTime: '15:00',
    endTime: '16:30',
    isLive: false,
    recordingUrl: 'https://example.com/recording/linkedin-workshop',
    registrants: []
  }
];

const initialInternshipCycle = {
  current: {
    id: 'cycle2025',
    name: 'Summer 2025',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    status: 'active'
  },
  previous: [
    {
      id: 'cycle2024',
      name: 'Summer 2024',
      startDate: '2024-05-01',
      endDate: '2024-08-31',
      status: 'completed'
    }
  ]
};

const initialAssessments = [
  {
    id: 'a1',
    title: 'Python Programming Skills',
    description: 'Test your Python programming knowledge and abilities with this comprehensive assessment.',
    duration: '60 minutes',
    questions: 30,
    category: 'Programming'
  },
  {
    id: 'a2',
    title: 'Digital Marketing Fundamentals',
    description: 'Assess your understanding of core digital marketing concepts and strategies.',
    duration: '45 minutes',
    questions: 25,
    category: 'Marketing'
  },
  {
    id: 'a3',
    title: 'Business Communication',
    description: 'Evaluate your business communication skills across various professional scenarios.',
    duration: '30 minutes',
    questions: 20,
    category: 'Business Skills'
  }
];

export function SCADProvider({ children }) {
  const { currentUser } = useAuth();
  const [companyApplications, setCompanyApplications] = useState(initialCompanyApplications);
  const [internshipReports, setInternshipReports] = useState(initialInternshipReports);
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [internshipCycle, setInternshipCycle] = useState(initialInternshipCycle);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Company registration review functions
  const reviewCompanyApplication = (applicationId, approved) => {
    if (currentUser?.role !== 'scadoffice') {
      toast.error('Only SCAD Office can review company applications');
      return { success: false };
    }
    
    const updatedApplications = companyApplications.map(app => {
      if (app.id === applicationId) {
        return { 
          ...app, 
          status: approved ? 'approved' : 'rejected',
          reviewDate: new Date().toISOString().split('T')[0]
        };
      }
      return app;
    });
    
    setCompanyApplications(updatedApplications);
    toast.success(`Company application ${approved ? 'approved' : 'rejected'} successfully`);
    
    // In a real app, this would trigger an email
    addNotification({
      to: updatedApplications.find(app => app.id === applicationId).email,
      subject: `Company Registration ${approved ? 'Approved' : 'Rejected'}`,
      message: `Your company registration has been ${approved ? 'approved' : 'rejected'}.`,
      type: 'company_application'
    });
    
    return { success: true };
  };
  
  // Internship cycle functions
  const setInternshipCycleDates = (startDate, endDate) => {
    if (currentUser?.role !== 'scadoffice') {
      toast.error('Only SCAD Office can set internship cycle dates');
      return { success: false };
    }
    
    const newCycle = {
      ...internshipCycle.current,
      startDate,
      endDate,
      name: `Internship Cycle ${startDate.split('-')[0]}`
    };
    
    setInternshipCycle({
      ...internshipCycle,
      current: newCycle
    });
    
    toast.success('Internship cycle dates updated successfully');
    
    // Notify students
    addNotification({
      to: 'all_students',
      subject: 'New Internship Cycle Dates',
      message: `The new internship cycle will run from ${startDate} to ${endDate}.`,
      type: 'cycle_update'
    });
    
    return { success: true };
  };
  
  // Workshop functions
  const createWorkshop = (workshopData) => {
    if (currentUser?.role !== 'scadoffice') {
      toast.error('Only SCAD Office can create workshops');
      return { success: false };
    }
    
    const newWorkshop = {
      id: `ws${workshops.length + 1}`,
      ...workshopData,
      registrants: []
    };
    
    setWorkshops([...workshops, newWorkshop]);
    toast.success('Workshop created successfully');
    return { success: true, workshop: newWorkshop };
  };
  
  const registerForWorkshop = (workshopId) => {
    if (currentUser?.role !== 'prostudent') {
      toast.error('Only PRO students can register for workshops');
      return { success: false };
    }
    
    const updatedWorkshops = workshops.map(workshop => {
      if (workshop.id === workshopId) {
        // Check if already registered
        if (workshop.registrants.includes(currentUser.id)) {
          toast.error('You are already registered for this workshop');
          return workshop;
        }
        
        return {
          ...workshop,
          registrants: [...workshop.registrants, currentUser.id]
        };
      }
      return workshop;
    });
    
    setWorkshops(updatedWorkshops);
    toast.success('Registered for workshop successfully');
    
    // Add notification for upcoming workshop
    const workshop = updatedWorkshops.find(w => w.id === workshopId);
    if (workshop) {
      addNotification({
        to: currentUser.id,
        subject: `Workshop: ${workshop.title}`,
        message: `Don't forget your upcoming workshop on ${workshop.startDate} at ${workshop.startTime}.`,
        type: 'workshop_reminder',
        scheduledFor: workshop.startDate
      });
    }
    
    return { success: true };
  };
  
  // Report functions
  const submitInternshipReport = (reportData) => {
    if (currentUser?.role !== 'student' && currentUser?.role !== 'prostudent') {
      toast.error('Only students can submit internship reports');
      return { success: false };
    }
    
    const newReport = {
      id: `ir${internshipReports.length + 1}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: 'pending',
      submissionDate: new Date().toISOString().split('T')[0],
      comments: [],
      ...reportData
    };
    
    setInternshipReports([...internshipReports, newReport]);
    toast.success('Internship report submitted successfully');
    return { success: true, report: newReport };
  };
  
  const reviewInternshipReport = (reportId, status, comment) => {
    if (currentUser?.role !== 'faculty' && currentUser?.role !== 'scadoffice') {
      toast.error('Only faculty or SCAD Office can review reports');
      return { success: false };
    }
    
    const updatedReports = internshipReports.map(report => {
      if (report.id === reportId) {
        const newComment = comment ? {
          id: `comment${report.comments.length + 1}`,
          author: currentUser.name,
          authorRole: currentUser.role,
          text: comment,
          date: new Date().toISOString().split('T')[0]
        } : null;
        
        return { 
          ...report, 
          status,
          comments: newComment ? [...report.comments, newComment] : report.comments,
          reviewDate: new Date().toISOString().split('T')[0]
        };
      }
      return report;
    });
    
    setInternshipReports(updatedReports);
    toast.success(`Report ${status} successfully`);
    
    // Notify student
    const report = updatedReports.find(r => r.id === reportId);
    if (report) {
      addNotification({
        to: report.studentId,
        subject: `Report Status Update: ${status}`,
        message: `Your internship report has been marked as ${status}.${comment ? ` Comment: ${comment}` : ''}`,
        type: 'report_status'
      });
    }
    
    return { success: true };
  };
  
  // Assessment functions
  const takeAssessment = (assessmentId) => {
    if (currentUser?.role !== 'prostudent') {
      toast.error('Only PRO students can take assessments');
      return { success: false };
    }
    
    // In a real app, this would load the actual assessment
    // For this prototype, we'll simulate completing the assessment with a random score
    const score = Math.floor(Math.random() * 41) + 60; // Score between 60-100
    
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      toast.error('Assessment not found');
      return { success: false };
    }
    
    toast.success(`Assessment completed! Your score: ${score}%`);
    return { success: true, score };
  };
  
  // Appointment functions
  const requestAppointment = (appointmentData) => {
    if (currentUser?.role !== 'prostudent' && currentUser?.role !== 'scadoffice') {
      toast.error('Only PRO students or SCAD Office can request appointments');
      return { success: false };
    }
    
    const newAppointment = {
      id: `apt${appointments.length + 1}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.role,
      recipientRole: currentUser.role === 'prostudent' ? 'scadoffice' : 'prostudent',
      recipientId: appointmentData.recipientId || null,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      scheduledDate: appointmentData.scheduledDate,
      scheduledTime: appointmentData.scheduledTime,
      purpose: appointmentData.purpose,
      notes: appointmentData.notes || ''
    };
    
    setAppointments([...appointments, newAppointment]);
    toast.success('Appointment request sent successfully');
    
    // Notify recipient
    addNotification({
      to: appointmentData.recipientId || currentUser.role === 'prostudent' ? 'all_scadoffice' : 'all_prostudents',
      subject: 'New Appointment Request',
      message: `${currentUser.name} has requested a video call appointment on ${appointmentData.scheduledDate} at ${appointmentData.scheduledTime}.`,
      type: 'appointment_request'
    });
    
    return { success: true, appointment: newAppointment };
  };
  
  const respondToAppointment = (appointmentId, approved) => {
    if (currentUser?.role !== 'prostudent' && currentUser?.role !== 'scadoffice') {
      toast.error('Only PRO students or SCAD Office can respond to appointments');
      return { success: false };
    }
    
    const updatedAppointments = appointments.map(apt => {
      if (apt.id === appointmentId) {
        return { 
          ...apt, 
          status: approved ? 'approved' : 'rejected',
          responseDate: new Date().toISOString().split('T')[0]
        };
      }
      return apt;
    });
    
    setAppointments(updatedAppointments);
    toast.success(`Appointment ${approved ? 'approved' : 'declined'} successfully`);
    
    // Notify requestor
    const appointment = updatedAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      addNotification({
        to: appointment.requesterId,
        subject: `Appointment ${approved ? 'Approved' : 'Declined'}`,
        message: `Your appointment request for ${appointment.scheduledDate} has been ${approved ? 'approved' : 'declined'}.`,
        type: 'appointment_response'
      });
    }
    
    return { success: true };
  };
  
  // Notification functions
  const addNotification = (notificationData) => {
    const newNotification = {
      id: `notif${notifications.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      ...notificationData
    };
    
    setNotifications([...notifications, newNotification]);
    return newNotification;
  };
  
  const markNotificationRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif => {
      if (notif.id === notificationId) {
        return { ...notif, isRead: true };
      }
      return notif;
    });
    
    setNotifications(updatedNotifications);
  };
  
  const getUserNotifications = (userId) => {
    // Filter notifications for specific user or role
    return notifications.filter(notif => 
      notif.to === userId || 
      (notif.to === `all_${currentUser?.role}s`) ||
      (notif.to === 'all_students' && (currentUser?.role === 'student' || currentUser?.role === 'prostudent'))
    );
  };
  
  // Stats and reporting
  const getSystemStatistics = () => {
    if (currentUser?.role !== 'scadoffice' && currentUser?.role !== 'faculty') {
      return null;
    }
    
    // In a real app, these would be calculated from actual data
    return {
      reports: {
        accepted: 24,
        rejected: 5,
        flagged: 3,
        pending: 8
      },
      reviewTime: {
        average: '3.2 days',
        median: '2 days'
      },
      topCourses: [
        { name: 'BUS301 - Business Communications', count: 15 },
        { name: 'CS401 - Software Engineering', count: 12 },
        { name: 'MKT305 - Digital Marketing', count: 10 }
      ],
      topCompanies: [
        { name: 'TechCorp', rating: 4.8, count: 8 },
        { name: 'Global Marketing', rating: 4.5, count: 6 },
        { name: 'Finance Plus', rating: 4.3, count: 5 }
      ],
      internshipsByIndustry: {
        Technology: 35,
        Marketing: 18,
        Finance: 15,
        Healthcare: 12,
        Education: 8,
        Other: 12
      }
    };
  };
  
  const value = {
    companyApplications,
    internshipReports,
    workshops,
    internshipCycle,
    assessments,
    appointments,
    notifications,
    
    reviewCompanyApplication,
    setInternshipCycleDates,
    createWorkshop,
    registerForWorkshop,
    submitInternshipReport,
    reviewInternshipReport,
    takeAssessment,
    requestAppointment,
    respondToAppointment,
    addNotification,
    markNotificationRead,
    getUserNotifications,
    getSystemStatistics
  };
  
  return (
    <SCADContext.Provider value={value}>
      {children}
    </SCADContext.Provider>
  );
}

export function useSCAD() {
  return useContext(SCADContext);
}
