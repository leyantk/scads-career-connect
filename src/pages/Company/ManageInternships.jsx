
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Calendar, DollarSign } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useInternships } from '../../contexts/InternshipContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

const ManageInternships = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { getCompanyInternships, deleteInternship, applications } = useInternships();
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);

  useEffect(() => {
    // Redirect if not logged in or not a company
    if (!currentUser || currentUser.role !== 'company') {
      toast.error("You must be logged in as a company to access this page");
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const companyInternships = getCompanyInternships(currentUser.id);
      setInternships(companyInternships);
      setIsLoading(false);
    }, 500);
  }, [currentUser, getCompanyInternships, navigate]);

  const handleDeleteClick = (internship) => {
    setInternshipToDelete(internship);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!internshipToDelete) return;
    
    try {
      const result = await deleteInternship(internshipToDelete.id);
      
      if (result.success) {
        // Update local state after deletion
        setInternships(internships.filter(i => i.id !== internshipToDelete.id));
        toast.success("Internship deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete internship");
    } finally {
      setDeleteDialogOpen(false);
      setInternshipToDelete(null);
    }
  };

  const getApplicationCount = (internshipId) => {
    return applications.filter(app => app.internshipId === internshipId).length;
  };

  // Filter internships based on search
  const filteredInternships = internships.filter(internship => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      internship.title.toLowerCase().includes(term) ||
      internship.description.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Manage Internships</h1>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scad-blue"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Manage Internships</h1>
          <Link to="/post-internship">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Post New Internship
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Internships</CardTitle>
              <CardDescription>Your posted opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{internships.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Internships</CardTitle>
              <CardDescription>Currently accepting applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {internships.filter(i => i.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Applications</CardTitle>
              <CardDescription>Candidates who applied</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {applications.filter(app => 
                  internships.some(i => i.id === app.internshipId)
                ).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4"
            />
          </div>
        </div>
        
        {filteredInternships.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInternships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/internships/${internship.id}`} 
                          className="hover:text-scad-blue"
                        >
                          {internship.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {internship.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        {internship.isPaid ? (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{internship.salary}</span>
                          </div>
                        ) : (
                          <Badge variant="secondary">Unpaid</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/applications?internship=${internship.id}`} 
                          className="hover:text-scad-blue"
                        >
                          <Badge variant="outline">
                            {getApplicationCount(internship.id)} applicants
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={internship.status === 'active' ? 'default' : 'secondary'}
                          className={internship.status === 'inactive' ? 'bg-gray-500' : ''}
                        >
                          {internship.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/edit-internship/${internship.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteClick(internship)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No internships found</h3>
            <p className="text-gray-500 mt-2 mb-6">
              {internships.length === 0 
                ? "You haven't posted any internships yet"
                : "No internships match your search"}
            </p>
            <Link to="/post-internship">
              <Button>Post Your First Internship</Button>
            </Link>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the internship "{internshipToDelete?.title}". 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default ManageInternships;
