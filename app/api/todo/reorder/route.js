// import { connectToDatabase, todoTable, userTable } from '../../../../db'; // Adjust the path as needed

// export async function POST(req) {
//   const authHeader = req.headers.get('Authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
//   }

//   const email = authHeader.replace('Bearer ', '');
  
//   try {
//     await connectToDatabase();

//     const user = await userTable.findOne({ email }).lean();
//     if (!user) {
//       return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//     }

//     const { todos } = await req.json();
//     if (!todos || !Array.isArray(todos)) {
//       return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
//     }

//     for (let i = 0; i < todos.length; i++) {
//       await todoTable.updateOne(
//         { _id: todos[i]._id },
//         { $set: { order: i } }
//       );
//     }

//     return new Response(JSON.stringify({ message: 'Todos reordered successfully' }), { status: 200 });
//   } catch (error) {
//     console.error('Error reordering todos:', error);
//     return new Response(JSON.stringify({ error: 'Failed to reorder todos' }), { status: 500 });
//   }
// }

// pages/api/todo/reorder.js

import { connectToDatabase, todoTable, userTable } from '../../../../db'; // Adjust the path as needed

export async function POST(req) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const email = authHeader.replace('Bearer ', '');

    try {
        await connectToDatabase();

        const user = await userTable.findOne({ email }).lean();
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        const { todos } = await req.json();
        if (!todos || !Array.isArray(todos)) {
            return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
        }

        for (let i = 0; i < todos.length; i++) {
            const result = await todoTable.updateOne(
                { _id: todos[i]._id },
                { $set: { order: i } }
            );
            if (result.modifiedCount === 0) {
                console.log(`Failed to update todo with id ${todos[i]._id}`);
            }
        }

        return new Response(JSON.stringify({ message: 'Todos reordered successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error reordering todos:', error);
        return new Response(JSON.stringify({ error: 'Failed to reorder todos' }), { status: 500 });
    }
}
