
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
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

const RegisterSuccess = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg text-center">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription className="text-base">
                Your company registration has been submitted for review
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p>
                  Thank you for registering with SCAD Career Connect. Your application has been received and will be reviewed by our team.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                  <ul className="list-disc list-inside text-blue-700 text-sm">
                    <li>The SCAD Office will review your application</li>
                    <li>You will receive an email notification once a decision is made</li>
                    <li>If approved, you can log in and start posting internship opportunities</li>
                    <li>The review process typically takes 1-2 business days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center gap-4">
              <Link to="/login">
                <Button variant="outline">Go to Login</Button>
              </Link>
              <Link to="/">
                <Button>Back to Home</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterSuccess;
