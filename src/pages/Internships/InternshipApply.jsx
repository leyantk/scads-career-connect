
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import FileUpload from '../../components/FileUpload/FileUpload';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '../../components/ui/card';
import { useInternships } from '../../contexts/InternshipContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../components/ui/form';
import { useForm } from 'react-hook-form';

const InternshipApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { internships, applyForInternship, getStudentApplications } = useInternships();
  const { currentUser } = useAuth();
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm({
    defaultValues: {
      coverLetter: '',
    }
  });

  useEffect(() => {
    // Redirect if not logged in or not a student
    if (!currentUser || (currentUser.role !== 'student' && currentUser.role !== 'prostudent')) {
      toast.error("You must be logged in as a student to apply for internships");
      navigate("/login");
      return;
    }
    
    // Find the internship by ID
    const foundInternship = internships.find(item => item.id === id);
    
    if (foundInternship) {
      setInternship(foundInternship);
      
      // Check if student has already applied
      const studentApplications = getStudentApplications(currentUser.id);
      const alreadyApplied = studentApplications.some(app => app.internshipId === id);
      
      if (alreadyApplied) {
        toast.error("You have already applied for this internship");
        navigate(`/internships/${id}`);
        return;
      }
    } else {
      toast.error("Internship not found");
      navigate("/internships");
      return;
    }
    
    setIsLoading(false);
  }, [id, internships, currentUser, navigate, getStudentApplications]);

  const handleUploadChange = (files) => {
    setUploadedFiles(files);
  };
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Create formatted document names
      const documents = uploadedFiles.map(file => file.name);
      
      const applicationData = {
        coverLetter: data.coverLetter,
        documents
      };
      
      const result = await applyForInternship(id, applicationData);
      
      if (result.success) {
        toast.success("Application submitted successfully");
        navigate("/applications");
      } else {
        toast.error("Error submitting application");
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scad-blue"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to={`/internships/${id}`} className="inline-flex items-center text-gray-600 hover:text-scad-blue mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Internship Details
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Apply for Internship</h1>
          <p className="text-gray-600 mb-6">Complete your application for {internship.title} at {internship.companyName}</p>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Documents</CardTitle>
              <CardDescription>
                Upload your resume and any additional documents that showcase your qualifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Explain why you're interested in this position and what makes you a good fit..."
                              className="min-h-[150px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Upload Documents</FormLabel>
                      <div className="text-sm text-gray-500 mb-2">
                        Include your resume, portfolio, certificates, or other relevant documents.
                      </div>
                      <FileUpload
                        maxFiles={5}
                        acceptedFileTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onFilesChange={handleUploadChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Link to={`/internships/${id}`}>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || uploadedFiles.length === 0}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default InternshipApply;
