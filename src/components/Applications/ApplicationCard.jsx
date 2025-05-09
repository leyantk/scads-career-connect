
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, Building, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

const getStatusBadgeProps = (status) => {
  switch(status) {
    case 'pending':
      return { variant: 'secondary', label: 'Pending' };
    case 'finalized':
      return { variant: 'outline', label: 'Finalized' };
    case 'accepted':
      return { variant: 'default', className: 'bg-green-600', label: 'Accepted' };
    case 'rejected':
      return { variant: 'destructive', label: 'Rejected' };
    case 'current':
      return { variant: 'default', className: 'bg-blue-600', label: 'Current Intern' };
    case 'completed':
      return { variant: 'default', className: 'bg-amber-600', label: 'Completed' };
    default:
      return { variant: 'secondary', label: status };
  }
};

const ApplicationCard = ({ 
  application, 
  internship, 
  viewType = 'student', // 'student' or 'company'
  onUpdateStatus 
}) => {
  const statusBadge = getStatusBadgeProps(application.status);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">
              {viewType === 'student' ? internship.title : application.studentName}
            </div>
            <div className="text-sm text-gray-500">
              {viewType === 'student' ? internship.companyName : internship.title}
            </div>
          </div>
          <Badge variant={statusBadge.variant} className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>Applied on: {application.appliedDate}</span>
          </div>
          
          {viewType === 'student' && (
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-500" />
              <span>{internship.industry}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{internship.duration}</span>
          </div>
          
          {application.documents && application.documents.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Submitted documents:</div>
              <div className="flex flex-wrap gap-1">
                {application.documents.map((doc, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        {viewType === 'student' ? (
          <Link to={`/applications/${application.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Application
            </Button>
          </Link>
        ) : (
          <div className="w-full space-y-2">
            <Link to={`/applications/${application.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            
            {onUpdateStatus && application.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={() => onUpdateStatus(application.id, 'finalized')}
                >
                  Finalize
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => onUpdateStatus(application.id, 'rejected')}
                >
                  Reject
                </Button>
              </div>
            )}
            
            {onUpdateStatus && application.status === 'finalized' && (
              <Button 
                size="sm" 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => onUpdateStatus(application.id, 'accepted')}
              >
                Accept
              </Button>
            )}
            
            {onUpdateStatus && application.status === 'accepted' && (
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => onUpdateStatus(application.id, 'current')}
              >
                Mark as Current Intern
              </Button>
            )}
            
            {onUpdateStatus && application.status === 'current' && (
              <Button 
                size="sm" 
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={() => onUpdateStatus(application.id, 'completed')}
              >
                Mark as Completed
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
