
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Create dummy data for different user roles
const dummyUsers = {
  // Student accounts
  'student@example.com': { 
    id: 's1', 
    email: 'student@example.com', 
    password: 'password', 
    role: 'student',
    name: 'John Smith',
    major: 'Computer Science',
    semester: 6,
    interests: ['Software Development', 'AI', 'Data Science'],
    completedInternships: [],
    appliedInternships: []
  },
  
  // PRO Student accounts (completed 3-month internship)
  'prostudent@example.com': { 
    id: 'p1', 
    email: 'prostudent@example.com', 
    password: 'password', 
    role: 'prostudent',
    name: 'Sarah Johnson',
    major: 'Business Administration',
    semester: 8,
    interests: ['Marketing', 'Project Management', 'Finance'],
    completedInternships: [
      { id: 'i1', company: 'TechCorp', position: 'Marketing Intern', duration: '3 months', completed: true }
    ],
    appliedInternships: [],
    isPRO: true
  },
  
  // Company accounts
  'company@example.com': { 
    id: 'c1', 
    email: 'company@example.com', 
    password: 'password', 
    role: 'company',
    name: 'TechCorp',
    industry: 'Technology',
    size: 'large', // small, medium, large, corporate
    verified: true,
    logo: 'https://via.placeholder.com/150',
    description: 'Leading technology company focused on innovation',
    postedInternships: []
  },
  
  // SCAD Office accounts
  'scadoffice@example.com': { 
    id: 'so1', 
    email: 'scadoffice@example.com', 
    password: 'password', 
    role: 'scadoffice',
    name: 'SCAD Admin',
    department: 'Career Services'
  },
  
  // Faculty accounts
  'faculty@example.com': { 
    id: 'f1', 
    email: 'faculty@example.com', 
    password: 'password', 
    role: 'faculty',
    name: 'Dr. Emily Chen',
    department: 'Computer Science',
    position: 'Associate Professor'
  }
};

// Create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('scadUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    const lowercaseEmail = email.toLowerCase();
    const user = dummyUsers[lowercaseEmail];
    
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem('scadUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}`);
      return { success: true, user };
    } else {
      toast.error("Invalid email or password");
      return { success: false, message: "Invalid email or password" };
    }
  };
  
  // Register company function
  const registerCompany = (companyData) => {
    const { email } = companyData;
    const lowercaseEmail = email.toLowerCase();
    
    if (dummyUsers[lowercaseEmail]) {
      toast.error("Email already in use");
      return { success: false, message: "Email already in use" };
    }
    
    // Create new company user (unverified)
    const newCompany = {
      id: `c${Object.keys(dummyUsers).length + 1}`,
      email: lowercaseEmail,
      password: companyData.password,
      role: 'company',
      name: companyData.name,
      industry: companyData.industry,
      size: companyData.size,
      logo: companyData.logo || 'https://via.placeholder.com/150',
      verified: false,
      description: companyData.description || '',
      postedInternships: []
    };
    
    // Add to dummy users
    dummyUsers[lowercaseEmail] = newCompany;
    
    toast.success("Registration submitted. Waiting for approval.");
    return { success: true, user: newCompany };
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('scadUser');
    toast.success("Logged out successfully");
  };
  
  const value = {
    currentUser,
    login,
    logout,
    registerCompany,
    dummyUsers
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
