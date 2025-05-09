
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/Layout/MainLayout';
import FileUpload from '../../components/FileUpload/FileUpload';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

// Form schema
const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  size: z.string().min(1, 'Please select a company size'),
  description: z.string().optional(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { registerCompany } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  
  // Initialize the form
  const form = useForm({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      industry: '',
      size: '',
      description: '',
    },
  });
  
  const handleLogoChange = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedLogo(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('logo-preview').src = e.target.result;
        document.getElementById('logo-preview-container').style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDocumentsChange = (files) => {
    setUploadedDocuments(files);
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    // Validate file uploads
    if (!uploadedLogo) {
      toast.error('Please upload a company logo');
      return;
    }
    
    if (uploadedDocuments.length === 0) {
      toast.error('Please upload verification documents');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add logo and documents to form data
      const companyData = {
        ...data,
        logo: URL.createObjectURL(uploadedLogo),  // In a real app, this would be uploaded to a server
        documents: uploadedDocuments.map(doc => doc.name),
      };
      
      const result = await registerCompany(companyData);
      
      if (result.success) {
        toast.success('Registration submitted successfully');
        navigate('/register-success');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Register as a Company</CardTitle>
              <CardDescription className="text-center">
                Create an account to post internship opportunities
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="Retail">Retail</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="small">Small (50 employees or less)</SelectItem>
                                <SelectItem value="medium">Medium (51-100 employees)</SelectItem>
                                <SelectItem value="large">Large (101-500 employees)</SelectItem>
                                <SelectItem value="corporate">Corporate (500+ employees)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe your company" 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Company Logo</FormLabel>
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1">
                          <FileUpload 
                            maxFiles={1} 
                            acceptedFileTypes=".jpg,.jpeg,.png,.gif"
                            onFilesChange={handleLogoChange}
                          />
                        </div>
                        <div 
                          id="logo-preview-container" 
                          className="w-32 h-32 border rounded-md flex items-center justify-center bg-gray-50 hidden"
                        >
                          <img 
                            id="logo-preview" 
                            src="#" 
                            alt="Logo Preview" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Verification Documents</FormLabel>
                      <FormItem>
                        <FormControl>
                          <FileUpload 
                            maxFiles={3} 
                            acceptedFileTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onFilesChange={handleDocumentsChange}
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-gray-500 mt-1">
                          Upload tax documents or business licenses to verify your company.
                        </div>
                      </FormItem>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Official Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="company@example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Register Company'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <div className="text-center text-sm">
                <span>Already have an account? </span>
                <Link to="/login" className="text-scad-blue hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
