
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../ui/sheet';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

const FilterBar = ({ 
  searchTerm = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  onClearFilters,
  filterOptions = {
    industries: ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Other'],
    durations: ['1-2 months', '3 months', '4-6 months', '6+ months'],
    paymentOptions: ['All', 'Paid Only', 'Unpaid Only']
  }
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilters, setLocalFilters] = useState(filters);

  // For mobile filter sheet
  const [mobileFilters, setMobileFilters] = useState(filters);
  
  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };
  
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };
  
  const handleMobileFilterChange = (key, value) => {
    setMobileFilters({ ...mobileFilters, [key]: value });
  };
  
  const applyMobileFilters = () => {
    setLocalFilters(mobileFilters);
    if (onFilterChange) onFilterChange(mobileFilters);
  };
  
  const handleClearFilters = () => {
    const emptyFilters = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    
    setLocalFilters(emptyFilters);
    setMobileFilters(emptyFilters);
    if (onClearFilters) onClearFilters();
  };
  
  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => value && value !== '').length;
  };
  
  return (
    <div className="w-full space-y-4">
      {/* Search bar */}
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by job title or company name"
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        {/* Desktop filters */}
        <div className="hidden md:flex items-center space-x-2">
          <Select 
            value={localFilters.industry || ''}
            onValueChange={(value) => handleFilterChange('industry', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All Industries</SelectItem>
                {filterOptions.industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select 
            value={localFilters.duration || ''}
            onValueChange={(value) => handleFilterChange('duration', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All Durations</SelectItem>
                {filterOptions.durations.map((duration) => (
                  <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select 
            value={localFilters.isPaid || ''}
            onValueChange={(value) => handleFilterChange('isPaid', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All Internships</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="unpaid">Unpaid Only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {getActiveFilterCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" /> Clear Filters
            </Button>
          )}
        </div>
        
        {/* Mobile filter button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-scad-blue text-[10px] font-medium text-white flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Internships</SheetTitle>
                <SheetDescription>
                  Apply filters to narrow down the internship listings.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={mobileFilters.industry || ''}
                    onValueChange={(value) => handleMobileFilterChange('industry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Industries</SelectItem>
                      {filterOptions.industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select
                    value={mobileFilters.duration || ''}
                    onValueChange={(value) => handleMobileFilterChange('duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Durations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Durations</SelectItem>
                      {filterOptions.durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Payment</Label>
                  <Select
                    value={mobileFilters.isPaid || ''}
                    onValueChange={(value) => handleMobileFilterChange('isPaid', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Internships" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Internships</SelectItem>
                      <SelectItem value="paid">Paid Only</SelectItem>
                      <SelectItem value="unpaid">Unpaid Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                  <SheetClose asChild>
                    <Button onClick={applyMobileFilters}>Apply Filters</Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(localFilters).map(([key, value]) => {
            if (!value || value === '') return null;
            
            let displayValue = value;
            if (key === 'isPaid') {
              displayValue = value === 'paid' ? 'Paid Only' : 'Unpaid Only';
            }
            
            return (
              <Badge key={key} variant="secondary" className="px-3 py-1">
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-2 h-4 w-4 rounded-full hover:bg-gray-300 inline-flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          
          {getActiveFilterCount() > 1 && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8">
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
