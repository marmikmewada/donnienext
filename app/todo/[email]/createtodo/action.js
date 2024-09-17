// app/todo/[email]/createtodo/action.js

"use server";

import { connectToDatabase, userTable, todoTable } from '../../../../db'; // Adjust the path as needed

export async function createTodoAction(formData) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Convert FormData to an object
    const input = Object.fromEntries(formData.entries()); // Convert FormData to a plain object
    const { todo, email } = input;

    // Log received data
    console.log('Received data:', { todo, email });

    if (!todo || !email) {
      console.error('Missing data:', { todo, email });
      return { error: 'Missing data', status: 400 };
    }

    // Find the user by email
    const user = await userTable.findOne({ email }).lean();

    if (!user) {
      console.error('User not found:', email);
      return { error: 'User not found', status: 404 };
    }

    // Create a new todo
    const newTodo = await todoTable.create({
      data: {
        todo, // The todo text
        userId: user._id, // The user's _id
        completed: false, // Default value
      },
    });

    // Log successful creation
    console.log('Todo created successfully:', newTodo);

    return { newTodo, status: 201 };
  } catch (error) {
    console.error('Error creating todo:', error);
    return { error: 'Error creating todo', status: 500 };
  }
}
