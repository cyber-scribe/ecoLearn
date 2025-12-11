import React from 'react';
import { CheckCircle } from 'lucide-react';

const ActiveTasks = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">{task.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              
              {task.progress && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <span className="flex items-center gap-1 text-green-600 font-medium ml-4">
              <CheckCircle className="w-5 h-5" />
              {task.points} pts
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveTasks;