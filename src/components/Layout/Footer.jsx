
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-scad-blue">SCAD</span>
              <span className="text-xl font-medium">CareerConnect</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Connecting students with career opportunities to build a brighter future.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-scad-blue">Home</Link></li>
              <li><Link to="/internships" className="text-gray-600 hover:text-scad-blue">Internships</Link></li>
              <li><Link to="/companies" className="text-gray-600 hover:text-scad-blue">Companies</Link></li>
              <li><Link to="/resources" className="text-gray-600 hover:text-scad-blue">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-scad-blue">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-scad-blue">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-scad-blue">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-scad-blue">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@scadcareerconnect.edu</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 University Way, College Town, CT 12345</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-center text-gray-600">
          <p>&copy; {currentYear} SCAD Career Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
