
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, User, Building, GraduationCap, BookOpen } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { currentUser } = useAuth();
  
  // Get CTA based on user state
  const getCallToAction = () => {
    if (!currentUser) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Register Company <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Log In
            </Button>
          </Link>
        </div>
      );
    }
    
    // User-specific CTA based on role
    switch (currentUser.role) {
      case 'student':
      case 'prostudent':
        return (
          <Link to="/internships">
            <Button size="lg">
              Browse Internships <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        );
      case 'company':
        return (
          <Link to="/post-internship">
            <Button size="lg">
              Post an Internship <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        );
      case 'scadoffice':
        return (
          <Link to="/company-applications">
            <Button size="lg">
              Review Applications <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        );
      case 'faculty':
        return (
          <Link to="/reports-review">
            <Button size="lg">
              Review Reports <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        );
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <span className="text-scad-blue">Connect</span> with Career Opportunities
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              SCAD Career Connect bridges students with companies to provide valuable internship experiences
            </p>
            
            {getCallToAction()}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto rounded-full bg-blue-100 p-3 w-16 h-16 flex items-center justify-center mb-2">
                  <Building className="h-8 w-8 text-scad-blue" />
                </div>
                <CardTitle>Companies</CardTitle>
                <CardDescription>Register and post internship openings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Register your company, get verified, and post internship opportunities to attract talented students.
                </p>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <Link to="/register">
                  <Button variant="outline">Register Now</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto rounded-full bg-blue-100 p-3 w-16 h-16 flex items-center justify-center mb-2">
                  <GraduationCap className="h-8 w-8 text-scad-blue" />
                </div>
                <CardTitle>Students</CardTitle>
                <CardDescription>Find and apply to internships</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Browse relevant internships based on your interests and skills, and track your application status.
                </p>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <Link to="/internships">
                  <Button variant="outline">Explore Internships</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto rounded-full bg-blue-100 p-3 w-16 h-16 flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-scad-blue" />
                </div>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Document and evaluate experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create meaningful reports about your internship experience and receive feedback from faculty.
                </p>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <Link to="/resources">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SCAD Career Connect?</h2>
            <p className="text-gray-600">
              Our platform offers unique benefits to all stakeholders in the internship process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">For Companies</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Access to qualified student talent</li>
                <li>Streamlined application management</li>
                <li>Detailed student profiles and evaluations</li>
                <li>Build your employer brand on campus</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">For Students</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Discover relevant internship opportunities</li>
                <li>Build professional experience</li>
                <li>Receive guidance from faculty</li>
                <li>Connect with industry professionals</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">For Faculty</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Monitor student progress</li>
                <li>Review internship reports</li>
                <li>Access insightful statistics</li>
                <li>Provide valuable student feedback</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">For SCAD Office</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Centralized internship management</li>
                <li>Verify company legitimacy</li>
                <li>Generate comprehensive reports</li>
                <li>Track student internship progress</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
