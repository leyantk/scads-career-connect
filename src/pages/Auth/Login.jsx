
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/Layout/MainLayout';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// Form schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('student');
  
  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Autofill email based on role
    let loginEmail = data.email;
    if (data.email === 'demo') {
      switch (activeTab) {
        case 'student':
          loginEmail = 'student@example.com';
          break;
        case 'prostudent':
          loginEmail = 'prostudent@example.com';
          break;
        case 'company':
          loginEmail = 'company@example.com';
          break;
        case 'scad':
          loginEmail = 'scadoffice@example.com';
          break;
        case 'faculty':
          loginEmail = 'faculty@example.com';
          break;
        default:
          loginEmail = data.email;
      }
    }
    
    try {
      const result = await login(loginEmail, data.password);
      
      if (result.success) {
        // Redirect based on user role
        switch (result.user.role) {
          case 'student':
          case 'prostudent':
            navigate('/internships');
            break;
          case 'company':
            navigate('/manage-internships');
            break;
          case 'scadoffice':
            navigate('/company-applications');
            break;
          case 'faculty':
            navigate('/reports-review');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Login to SCAD Career Connect</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="student" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-5 mb-8">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="prostudent">PRO Student</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="scad">SCAD Office</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="text-sm">
                        <Button variant="link" className="p-0" type="button">
                          Forgot password?
                        </Button>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  To quickly test the system, enter "demo" as email and "password" as password.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm">
                <span>Don't have an account? </span>
                <Link to="/register" className="text-scad-blue hover:underline">
                  Register here
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
