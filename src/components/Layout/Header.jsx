
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSCAD } from '../../contexts/SCADContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { getUserNotifications, markNotificationRead } = useSCAD();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const userNotifications = currentUser ? getUserNotifications(currentUser.id) : [];
  const unreadCount = userNotifications.filter(n => !n.isRead).length;
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-scad-blue">SCAD</span>
            <span className="text-xl font-medium">CareerConnect</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {currentUser && (
              <>
                {/* Dynamic navigation based on user role */}
                {currentUser.role === 'student' || currentUser.role === 'prostudent' ? (
                  <>
                    <Link to="/internships" className="text-gray-700 hover:text-scad-blue">Internships</Link>
                    <Link to="/applications" className="text-gray-700 hover:text-scad-blue">My Applications</Link>
                    <Link to="/reports" className="text-gray-700 hover:text-scad-blue">My Reports</Link>
                    {currentUser.role === 'prostudent' && (
                      <>
                        <Link to="/workshops" className="text-gray-700 hover:text-scad-blue">Workshops</Link>
                        <Link to="/assessments" className="text-gray-700 hover:text-scad-blue">Assessments</Link>
                      </>
                    )}
                  </>
                ) : currentUser.role === 'company' ? (
                  <>
                    <Link to="/post-internship" className="text-gray-700 hover:text-scad-blue">Post Internship</Link>
                    <Link to="/manage-internships" className="text-gray-700 hover:text-scad-blue">Manage Internships</Link>
                    <Link to="/applications" className="text-gray-700 hover:text-scad-blue">Applications</Link>
                    <Link to="/interns" className="text-gray-700 hover:text-scad-blue">Interns</Link>
                  </>
                ) : currentUser.role === 'scadoffice' ? (
                  <>
                    <Link to="/company-applications" className="text-gray-700 hover:text-scad-blue">Company Applications</Link>
                    <Link to="/manage-students" className="text-gray-700 hover:text-scad-blue">Students</Link>
                    <Link to="/reports-review" className="text-gray-700 hover:text-scad-blue">Reports</Link>
                    <Link to="/statistics" className="text-gray-700 hover:text-scad-blue">Statistics</Link>
                    <Link to="/manage-workshops" className="text-gray-700 hover:text-scad-blue">Workshops</Link>
                  </>
                ) : currentUser.role === 'faculty' ? (
                  <>
                    <Link to="/reports-review" className="text-gray-700 hover:text-scad-blue">Reports</Link>
                    <Link to="/statistics" className="text-gray-700 hover:text-scad-blue">Statistics</Link>
                  </>
                ) : null}
              </>
            )}
          </nav>
          
          {/* User Menu & Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="notification-badge">{unreadCount}</span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {userNotifications.length > 0 ? (
                        userNotifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem 
                            key={notification.id} 
                            className="flex flex-col items-start py-2"
                            onClick={() => markNotificationRead(notification.id)}
                          >
                            <div className="font-semibold">{notification.subject}</div>
                            <div className="text-sm text-gray-600">{notification.message}</div>
                            <div className="text-xs text-gray-500 mt-1">{notification.date}</div>
                            {!notification.isRead && (
                              <div className="h-2 w-2 rounded-full bg-blue-500 absolute top-2 right-2"></div>
                            )}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                      )}
                      {userNotifications.length > 5 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/notifications" className="w-full text-center text-scad-blue">
                              View all notifications
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-scad-blue flex items-center justify-center">
                        <span className="text-white text-sm">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="hidden sm:block mr-1 max-w-[100px] truncate">
                          {currentUser.name}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {currentUser.name}
                      {currentUser.role === 'prostudent' && (
                        <span className="pro-badge ml-2">PRO</span>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full flex items-center">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button>Register</Button>
                </Link>
              </>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t mt-3">
            <nav className="flex flex-col space-y-3">
              {currentUser ? (
                <>
                  {/* Dynamic navigation based on user role */}
                  {currentUser.role === 'student' || currentUser.role === 'prostudent' ? (
                    <>
                      <Link to="/internships" className="text-gray-700 hover:text-scad-blue">Internships</Link>
                      <Link to="/applications" className="text-gray-700 hover:text-scad-blue">My Applications</Link>
                      <Link to="/reports" className="text-gray-700 hover:text-scad-blue">My Reports</Link>
                      {currentUser.role === 'prostudent' && (
                        <>
                          <Link to="/workshops" className="text-gray-700 hover:text-scad-blue">Workshops</Link>
                          <Link to="/assessments" className="text-gray-700 hover:text-scad-blue">Assessments</Link>
                          <Link to="/appointments" className="text-gray-700 hover:text-scad-blue">Appointments</Link>
                        </>
                      )}
                    </>
                  ) : currentUser.role === 'company' ? (
                    <>
                      <Link to="/post-internship" className="text-gray-700 hover:text-scad-blue">Post Internship</Link>
                      <Link to="/manage-internships" className="text-gray-700 hover:text-scad-blue">Manage Internships</Link>
                      <Link to="/applications" className="text-gray-700 hover:text-scad-blue">Applications</Link>
                      <Link to="/interns" className="text-gray-700 hover:text-scad-blue">Interns</Link>
                    </>
                  ) : currentUser.role === 'scadoffice' ? (
                    <>
                      <Link to="/company-applications" className="text-gray-700 hover:text-scad-blue">Company Applications</Link>
                      <Link to="/manage-students" className="text-gray-700 hover:text-scad-blue">Students</Link>
                      <Link to="/reports-review" className="text-gray-700 hover:text-scad-blue">Reports</Link>
                      <Link to="/statistics" className="text-gray-700 hover:text-scad-blue">Statistics</Link>
                      <Link to="/manage-workshops" className="text-gray-700 hover:text-scad-blue">Workshops</Link>
                      <Link to="/appointments" className="text-gray-700 hover:text-scad-blue">Appointments</Link>
                    </>
                  ) : currentUser.role === 'faculty' ? (
                    <>
                      <Link to="/reports-review" className="text-gray-700 hover:text-scad-blue">Reports</Link>
                      <Link to="/statistics" className="text-gray-700 hover:text-scad-blue">Statistics</Link>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-scad-blue">Log in</Link>
                  <Link to="/register" className="text-gray-700 hover:text-scad-blue">Register</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
