import { connectToDatabase, todoTable } from '../../../../../db'; // Adjust the path as needed

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    await connectToDatabase();

    // Delete the todo item
    const result = await todoTable.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Todo not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Todo deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete todo' }), { status: 500 });
  }
}
