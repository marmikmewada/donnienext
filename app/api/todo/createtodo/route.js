import { connectToDatabase, userTable, todoTable } from '../../../../db'; // Adjust the path as needed

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse JSON body
    const { todo, email } = await req.json();

    // Log received data
    console.log('Received data:', { todo, email });

    if (!todo || !email) {
      console.error('Missing data:', { todo, email });
      return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }

    // Find the user by email
    const user = await userTable.findOne({ email }).lean();
    console.log("User found:", user);
    if (!user) {
      console.error('User not found:', email);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    console.log("Extracted user ID:", user._id);

    // Find the current maximum order value for the user
    const maxOrderTodo = await todoTable
      .findOne({ userId: user._id })
      .sort({ order: -1 })
      .lean();
    console.log("Max order todo:", maxOrderTodo);

    // Calculate the next order value
    const maxOrder = maxOrderTodo && typeof maxOrderTodo.order === 'number' ? maxOrderTodo.order : 0;
    const nextOrder = maxOrder + 1; // Corrected calculation for next order

    console.log("Next order value:", nextOrder);

    // Create a new todo with the calculated order
    const newTodo = await todoTable.create({
      todo: todo,
      userId: user._id,
      completed: false,
      order: nextOrder,
    });

    // Log successful creation
    console.log('Todo created successfully:', newTodo);

    // Verify that the order field is in the saved document
    const savedTodo = await todoTable.findById(newTodo._id).lean();
    console.log('Saved Todo:', savedTodo);

    return new Response(JSON.stringify({ newTodo: savedTodo }), { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return new Response(JSON.stringify({ error: 'Error creating todo' }), { status: 500 });
  }
}





// import { connectToDatabase, userTable, todoTable } from '../../../../db'; // Adjust the path as needed

// export async function POST(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Parse JSON body
//     const { todo, email } = await req.json(); // Use req.json() to parse JSON body

//     // Log received data
//     console.log('Received data:', { todo, email });

//     if (!todo || !email) {
//       console.error('Missing data:', { todo, email });
//       return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
//     }

//     // Find the user by email
//     const user = await userTable.findOne({ email }).lean();
//     console.log("User found", user);
//     if (!user) {
//       console.error('User not found:', email);
//       return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//     }
//     console.log("Extracted user ID", user._id);

//     // Create a new todo
//     const newTodo = await todoTable.create({
//       todo: todo, // The todo text
//       userId: user._id, // The user's _id
//       completed: false, // Default value
//     });

//     // Log successful creation
//     console.log('Todo created successfully:', newTodo);

//     return new Response(JSON.stringify({ newTodo }), { status: 201 });
//   } catch (error) {
//     console.error('Error creating todo:', error);
//     return new Response(JSON.stringify({ error: 'Error creating todo' }), { status: 500 });
//   }
// }
