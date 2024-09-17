"use client";

import { useState } from 'react';

export default function DeleteButton({ todoId, onTodoDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/todo/delete/${todoId}`, {
        method: 'DELETE',  // DELETE method to match the API route
      });

      if (response.ok) {
        if (onTodoDeleted) onTodoDeleted();
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="ml-4 px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
