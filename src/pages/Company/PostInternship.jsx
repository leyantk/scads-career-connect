
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MainLayout from '../../components/Layout/MainLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useInternships } from '../../contexts/InternshipContext';
import { toast } from 'sonner';
import { X } from 'lucide-react';

// Schema for form validation
const internshipFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  duration: z.string().min(1, 'Duration is required'),
  isPaid: z.boolean(),
  salary: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

const PostInternship = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createInternship } = useInternships();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // Initialize form
  const form = useForm({
    resolver: zodResolver(internshipFormSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: '',
      isPaid: false,
      salary: '',
      industry: '',
      skills: [],
    },
  });
  
  const isPaid = form.watch('isPaid');
  
  // Skills Management
  const addSkill = () => {
    if (!skillInput.trim()) return;
    
    const currentSkills = form.getValues('skills');
    if (!currentSkills.includes(skillInput.trim())) {
      form.setValue('skills', [...currentSkills, skillInput.trim()]);
    }
    setSkillInput('');
  };
  
  const removeSkill = (skillToRemove) => {
    const currentSkills = form.getValues('skills');
    form.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    // Validate company user
    if (!currentUser || currentUser.role !== 'company') {
      toast.error('You must be logged in as a company to post internships');
      return;
    }
    
    // Additional validation for paid internship
    if (data.isPaid && !data.salary) {
      form.setError('salary', {
        type: 'manual',
        message: 'Salary is required for paid internships',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createInternship(data);
      
      if (result.success) {
        toast.success('Internship posted successfully');
        navigate('/manage-internships');
      } else {
        toast.error('Failed to post internship');
      }
    } catch (error) {
      console.error('Error posting internship:', error);
      toast.error('An error occurred while posting the internship');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Post New Internship</h1>
        
        <div className="max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Internship Details</CardTitle>
              <CardDescription>
                Fill in the details about the internship opportunity you're offering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internship Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Frontend Developer Intern"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-2 months">1-2 months</SelectItem>
                              <SelectItem value="3 months">3 months</SelectItem>
                              <SelectItem value="4-6 months">4-6 months</SelectItem>
                              <SelectItem value="6+ months">6+ months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isPaid"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Paid Internship</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Is this a paid internship position?
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {isPaid && (
                      <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary/Stipend</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $15/hour or $1500/month"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the responsibilities, expectations, and learning opportunities for this internship..."
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="e.g., JavaScript"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                          />
                          <Button type="button" onClick={addSkill}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.watch('skills').map((skill, index) => (
                            <div 
                              key={index}
                              className="bg-scad-blue/10 text-scad-blue px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-2 h-4 w-4 rounded-full hover:bg-gray-300 inline-flex items-center justify-center"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <CardFooter className="px-0 pt-6 flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/manage-internships')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Posting...' : 'Post Internship'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostInternship;
