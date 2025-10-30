import React from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const ClassDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Class Detail</h1>
            <p className="text-gray-600">Class ID: {id}</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <p className="text-gray-600">
          Class detail view is coming soon! This will show class information, 
          assignments, and student management features.
        </p>
      </div>
    </div>
  );
};

export default ClassDetail;