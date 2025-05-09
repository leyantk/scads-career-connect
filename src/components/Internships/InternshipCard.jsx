
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Briefcase } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

const InternshipCard = ({ internship, showApplyButton = true }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg truncate">{internship.title}</CardTitle>
          <Badge variant={internship.isPaid ? "default" : "secondary"}>
            {internship.isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 truncate">{internship.companyName}</div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{internship.duration}</span>
          </div>
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
            <span>{internship.industry}</span>
          </div>
          {internship.isPaid && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span>{internship.salary}</span>
            </div>
          )}
        </div>
        
        <div className="text-sm h-24 overflow-hidden">
          <p className="line-clamp-4">{internship.description}</p>
        </div>
        
        <div className="mt-2">
          <div className="flex flex-wrap gap-1">
            {internship.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-100">
                {skill}
              </Badge>
            ))}
            {internship.skills.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-100">
                +{internship.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="w-full flex justify-end">
          <Link to={`/internships/${internship.id}`}>
            <Button variant={showApplyButton ? "outline" : "default"} size="sm">
              View Details
            </Button>
          </Link>
          
          {showApplyButton && (
            <Link to={`/internships/${internship.id}/apply`} className="ml-2">
              <Button size="sm">Apply</Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InternshipCard;
