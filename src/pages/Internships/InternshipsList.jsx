
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import InternshipCard from '../../components/Internships/InternshipCard';
import FilterBar from '../../components/Internships/FilterBar';
import { useInternships } from '../../contexts/InternshipContext';

const InternshipsList = () => {
  const { internships } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    isPaid: '',
  });

  // Filter internships based on search term and filters
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let results = [...internships];
      
      // Apply search filter if any
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          internship => 
            internship.title.toLowerCase().includes(term) || 
            internship.companyName.toLowerCase().includes(term)
        );
      }
      
      // Apply other filters
      if (filters.industry) {
        results = results.filter(
          internship => internship.industry === filters.industry
        );
      }
      
      if (filters.duration) {
        results = results.filter(
          internship => internship.duration.includes(filters.duration)
        );
      }
      
      if (filters.isPaid) {
        if (filters.isPaid === 'paid') {
          results = results.filter(internship => internship.isPaid);
        } else if (filters.isPaid === 'unpaid') {
          results = results.filter(internship => !internship.isPaid);
        }
      }
      
      setFilteredInternships(results);
      setIsLoading(false);
    }, 500);
  }, [internships, searchTerm, filters]);
  
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const clearFilters = () => {
    setFilters({
      industry: '',
      duration: '',
      isPaid: '',
    });
    setSearchTerm('');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Internships</h1>
        
        <FilterBar 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
        
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scad-blue"></div>
            </div>
          ) : filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <InternshipCard 
                  key={internship.id} 
                  internship={internship}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No internships found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or search terms
              </p>
              <button 
                onClick={clearFilters}
                className="mt-4 text-scad-blue hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default InternshipsList;
