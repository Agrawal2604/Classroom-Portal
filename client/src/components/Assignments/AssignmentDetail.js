import React from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';

const AssignmentDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignment Detail</h1>
            <p className="text-gray-600">Assignment ID: {id}</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <p className="text-gray-600">
          Assignment detail view is coming soon! This will show assignment information, 
          submissions, and grading features.
        </p>
      </div>
    </div>
  );
};

export default AssignmentDetail;