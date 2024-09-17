import { connectToDatabase, todoTable, userTable } from '../../../db'; // Adjust the path as needed

export async function GET(req) {
  // Extract email from Authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  
  const email = authHeader.replace('Bearer ', '');
  
  try {
    await connectToDatabase();

    // Find user by email
    const user = await userTable.findOne({ email }).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Fetch todos for the authenticated user
    const todos = await todoTable.find({ userId: user._id }).sort({ order: 1 }).lean();

    return new Response(JSON.stringify({ todos }), { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch todos' }), { status: 500 });
  }
}
