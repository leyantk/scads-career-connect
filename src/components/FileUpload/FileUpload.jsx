
import React, { useState } from 'react';
import { Upload, X, File, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const FileUpload = ({ 
  maxFiles = 5, 
  acceptedFileTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  onFilesChange = () => {},
  className = ''
}) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleFileChange = (e) => {
    const fileList = e.target.files;
    processFiles(fileList);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const fileList = e.dataTransfer.files;
    processFiles(fileList);
  };
  
  const processFiles = (fileList) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const newFiles = Array.from(fileList);
    
    // Check if exceeding max number of files
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    // Process each file
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxSizeBytes) {
        toast.error(`${file.name} is too large. Maximum file size is ${maxSizeMB}MB.`);
        return false;
      }
      
      // Check file type
      const fileType = `.${file.name.split('.').pop()}`;
      if (!acceptedFileTypes.includes(fileType)) {
        toast.error(`${file.name} has an invalid file type. Accepted types: ${acceptedFileTypes}`);
        return false;
      }
      
      return true;
    });
    
    // Add valid files to list
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      toast.success(`${validFiles.length} file(s) added successfully.`);
    }
  };
  
  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    toast.info('File removed.');
  };
  
  return (
    <div className={className}>
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragOver ? 'border-scad-blue bg-blue-50' : 'border-gray-300'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload className="h-10 w-10 text-gray-400" />
          <div className="text-gray-600">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {acceptedFileTypes.split(',').join(', ')} (Max: {maxSizeMB}MB)
          </p>
          <input
            type="file"
            multiple
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button type="button" variant="outline">
              Select Files
            </Button>
          </label>
          <p className="text-xs text-gray-500">
            {files.length} of {maxFiles} files uploaded
          </p>
        </div>
      </div>
      
      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="flex items-center">
                <File className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
