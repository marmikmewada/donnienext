import { connectToDatabase, todoTable } from '../../../../../db'; // Adjust the path as needed

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    await connectToDatabase();

    // Find the todo item
    const todo = await todoTable.findOne({ _id: id });
    if (!todo) {
      return new Response(JSON.stringify({ error: 'Todo not found' }), { status: 404 });
    }

    // Update the todo item's completion status
    await todoTable.updateOne(
      { _id: id },
      { $set: { completed: !todo.completed } }
    );

    return new Response(JSON.stringify({ message: 'Todo updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return new Response(JSON.stringify({ error: 'Failed to update todo' }), { status: 500 });
  }
}
