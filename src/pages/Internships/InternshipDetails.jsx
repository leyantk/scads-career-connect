
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, DollarSign, Briefcase, Building, ArrowLeft, CheckCircle } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { useInternships } from '../../contexts/InternshipContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { internships, getStudentApplications } = useInternships();
  const { currentUser } = useAuth();
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // Find the internship by ID
    const foundInternship = internships.find(item => item.id === id);
    
    if (foundInternship) {
      setInternship(foundInternship);
      
      // Check if student has already applied
      if (currentUser && (currentUser.role === 'student' || currentUser.role === 'prostudent')) {
        const studentApplications = getStudentApplications(currentUser.id);
        const alreadyApplied = studentApplications.some(app => app.internshipId === id);
        setHasApplied(alreadyApplied);
      }
    }
    
    setIsLoading(false);
  }, [id, internships, currentUser, getStudentApplications]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scad-blue"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!internship) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Internship Not Found</h2>
          <p>The internship you're looking for doesn't exist or has been removed.</p>
          <Link to="/internships">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Internships
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const handleApply = () => {
    if (!currentUser) {
      toast.error("Please login to apply for this internship");
      navigate("/login");
      return;
    }
    
    if (currentUser.role !== 'student' && currentUser.role !== 'prostudent') {
      toast.error("Only students can apply for internships");
      return;
    }
    
    navigate(`/internships/${id}/apply`);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/internships" className="inline-flex items-center text-gray-600 hover:text-scad-blue mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Internships
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{internship.title}</h1>
                  <div className="text-gray-600 mt-1">{internship.companyName}</div>
                </div>
                <div>
                  <Badge variant={internship.isPaid ? "default" : "secondary"} className="text-sm">
                    {internship.isPaid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">{internship.duration}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Industry</div>
                    <div className="font-medium">{internship.industry}</div>
                  </div>
                </div>
                
                {internship.isPaid && (
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Salary</div>
                      <div className="font-medium">{internship.salary}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Apply for this Internship</CardTitle>
                {hasApplied && (
                  <CardDescription className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" /> You have already applied
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start mb-4">
                    <Building className="h-10 w-10 text-gray-500 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{internship.companyName}</div>
                      <div className="text-sm text-gray-500">{internship.industry}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium">What You'll Need:</div>
                    <ul className="mt-2 list-disc list-inside text-gray-600">
                      <li>Updated resume</li>
                      <li>Cover letter (optional)</li>
                      <li>Relevant certificates (optional)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleApply}
                  disabled={hasApplied}
                >
                  {hasApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium mb-1">About {internship.companyName}</div>
                    <p className="text-sm text-gray-600">
                      {/* This would come from the company profile in a real app */}
                      A leading company in the {internship.industry} industry focused on innovation and growth.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="font-medium mb-1">Other Internships</div>
                    <Link to={`/companies/${internship.companyId}`} className="text-scad-blue text-sm hover:underline">
                      View all internships from this company
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InternshipDetails;
