"use client";

import { useState } from 'react';

export default function ToggleButton({ todoId, completed, onTodoToggled }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleToggle = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/todo/toggle/${todoId}`, {
        method: 'PATCH',  // PATCH method to match the API route
      });

      if (response.ok) {
        setIsCompleted(prev => !prev);
        if (onTodoToggled) onTodoToggled();
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`ml-4 px-2 py-1 ${isCompleted ? 'bg-green-600' : 'bg-yellow-600'} text-white rounded-md hover:${isCompleted ? 'bg-green-700' : 'bg-yellow-700'} focus:outline-none focus:ring-2 focus:ring-green-500`}
    >
      {isUpdating ? (isCompleted ? 'Completing...' : 'Uncompleting...') : (isCompleted ? 'Undo' : 'Complete')}
    </button>
  );
}
