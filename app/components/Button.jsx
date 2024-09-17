// src/components/Button.js
"use client";

import { useRouter } from 'next/navigation';
import React from 'react';
import { useStore } from '../store/store'; // Adjust the path to your store

const Button = ({ session }) => {
  const router = useRouter();
  const { setSession } = useStore(); // Access Zustand store

  // Store the session in Zustand when the button is clicked
  const handleCreateTodoClick = () => {
    if (session) {
      setSession(session); // Store session in Zustand
      router.push(`/todo/${session.user.email}/createtodo`);
    } else {
      console.error('Session is not available.');
    }
  };

  return (
    <button onClick={handleCreateTodoClick}>Create New Todo</button>
  );
};

export default Button;
