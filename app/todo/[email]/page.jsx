"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import ToggleButton from '../../components/ToggleButton';
import DeleteButton from '../../components/DeleteButton';
import { useSession } from 'next-auth/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaGripLines } from 'react-icons/fa'; // Import drag handle icon

const ItemType = 'TODO_ITEM';

const TodoItem = ({ todo, index, moveTodo }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveTodo(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <li
      ref={(node) => ref(drop(node))}
      className="bg-gray-700 p-4 rounded-md flex items-center"
    >
      {/* Drag handle */}
      <button
        className="mr-2 p-2 text-gray-400 hover:text-white"
        style={{ cursor: 'grab' }}
        onMouseDown={(e) => e.preventDefault()} // Prevent default drag behavior on button
      >
        <FaGripLines />
      </button>
      <span className={`text-lg flex-grow ${todo.completed ? 'line-through text-gray-400' : ''}`}>
        {todo.todo}
      </span>
      <ToggleButton todoId={todo._id} completed={todo.completed} />
      <DeleteButton todoId={todo._id} onTodoDeleted={() => router.refresh()} />
    </li>
  );
};

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
        router.push('/login');
        return;
    }

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todo', {
                headers: {
                    'Authorization': `Bearer ${session.user.email}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTodos(Array.isArray(data.todos) ? data.todos : []);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };

    fetchTodos();
}, [session, status, router]);

const moveTodo = async (fromIndex, toIndex) => {
  const reorderedTodos = [...todos];
  const [movedTodo] = reorderedTodos.splice(fromIndex, 1);
  reorderedTodos.splice(toIndex, 0, movedTodo);
  setTodos(reorderedTodos);

  try {
      const response = await fetch('/api/todo/reorder', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.user.email}`,
          },
          body: JSON.stringify({ todos: reorderedTodos }),
      });

      if (!response.ok) {
          throw new Error('Failed to reorder todos');
      }
  } catch (error) {
      console.error('Failed to reorder todos:', error);
      // Optionally, revert the UI changes on error
      // setTodos(todos);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold mb-4">My Todos</h1>
          <Button session= {session} />
          {todos.length === 0 ? (
            <p className="text-lg text-gray-400">No todos found.</p>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo, index) => (
                <TodoItem key={todo._id} todo={todo} index={index} moveTodo={moveTodo} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </DndProvider>
  );
}











// "use client";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Button from '../../components/Button';
// import ToggleButton from '../../components/ToggleButton';
// import DeleteButton from '../../components/DeleteButton';
// import { useSession } from 'next-auth/react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// const ItemType = 'TODO_ITEM';

// const TodoItem = ({ todo, index, moveTodo }) => {
//   const [, ref] = useDrag({
//     type: ItemType,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemType,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveTodo(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   return (
//     <li
//       ref={(node) => ref(drop(node))}
//       className="bg-gray-700 p-4 rounded-md flex items-center"
//     >
//       <span className={`text-lg flex-grow ${todo.completed ? 'line-through text-gray-400' : ''}`}>
//         {todo.todo}
//       </span>
//       <ToggleButton todoId={todo._id} completed={todo.completed} />
//       <DeleteButton todoId={todo._id} onTodoDeleted={() => router.refresh()} />
//     </li>
//   );
// };

// export default function TodosPage() {
//   const [todos, setTodos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === 'loading') return; // Wait for session to be resolved

//     if (!session) {
//       router.push('/login');
//       return;
//     }

//     const fetchTodos = async () => {
//       try {
//         const response = await fetch('/api/todo', {
//           headers: {
//             'Authorization': `Bearer ${session.user.email}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setTodos(Array.isArray(data.todos) ? data.todos : []);
//       } catch (error) {
//         console.error('Failed to fetch todos:', error);
//         setTodos([]); // Ensure todos is always an array
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTodos();
//   }, [session, status, router]);

//   const moveTodo = async (fromIndex, toIndex) => {
//     const reorderedTodos = [...todos];
//     const [movedTodo] = reorderedTodos.splice(fromIndex, 1);
//     reorderedTodos.splice(toIndex, 0, movedTodo);
//     setTodos(reorderedTodos);

//     try {
//       await fetch('/api/todo/reorder', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.user.email}`,
//         },
//         body: JSON.stringify({ todos: reorderedTodos }),
//       });
//     } catch (error) {
//       console.error('Failed to reorder todos:', error);
//       // Optionally, revert the UI changes on error
//       // setTodos(todos);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//         <p className="text-lg">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
//           <h1 className="text-3xl font-semibold mb-4">My Todos</h1>
//           <Button />
//           {todos.length === 0 ? (
//             <p className="text-lg text-gray-400">No todos found.</p>
//           ) : (
//             <ul className="space-y-3">
//               {todos.map((todo, index) => (
//                 <TodoItem key={todo._id} todo={todo} index={index} moveTodo={moveTodo} />
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </DndProvider>
//   );
// }









// import { redirect } from 'next/navigation';

// import { auth } from '../../../auth'; // Adjust the path as needed
// import { connectToDatabase, userTable, todoTable } from '../../../db'; // Adjust the path as needed
// import Button from '../../components/Button';

// export default async function TodosPage() {
//   // Connect to the database
//   await connectToDatabase();

//   // Fetch session on server-side
//   const session = await auth();

//   // Check if session exists and user is authenticated
//   if (!session || !session.user) {
//     // Redirect to login page if session is not available
//     redirect('/login');
//     return; // Ensure nothing else is rendered after redirection
//   }

//   try {
//     // Find the user by email from the session
//     const user = await userTable.findOne({ email: session.user.email }).lean();

//     if (!user) {
//       // Handle case where user is not found
//       console.error("User not found");
//       return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//           <p className="text-lg">User not found. Please try again later.</p>
//         </div>
//       );
//     }

//     // Fetch todos for the authenticated user using the user's _id
//     const todos = await todoTable.find({ userId: user._id }).lean();
    
//     // Convert MongoDB documents to JSON
//     const todosJson = JSON.parse(JSON.stringify(todos));

//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//         <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
//           <h1 className="text-3xl font-semibold mb-4">My Todos</h1>
//           <Button session={session} />
//           {todosJson.length === 0 ? (
//             <p className="text-lg text-gray-400">No todos found.</p>
//           ) : (
//             <ul className="space-y-3">
//               {todosJson.map(todo => (
//                 <li key={todo._id} className="bg-gray-700 p-4 rounded-md">
//                   <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : ''}`}>
//                     {todo.todo}
//                   </span>
//                   <span className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-green-400'} ml-2`}>
//                     {todo.completed ? 'Completed' : 'Pending'}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//         <p className="text-lg">Failed to load todos. Please try again later.</p>
//       </div>
//     );
//   }
// }


























// // app/todo/[email]/page.jsx

// import { redirect } from 'next/navigation';

// import { auth } from '../../../auth'; // Adjust the path as needed
// import { connectToDatabase, userTable, todoTable } from '../../../db'; // Adjust the path as needed
// import Button from '../../components/Button';

// export default async function TodosPage() {
//   // Connect to the database
//   await connectToDatabase();

//   // Fetch session on server-side
//   const session = await auth();

//   // Check if session exists and user is authenticated
//   if (!session || !session.user) {
//     // Redirect to login page if session is not available
//     redirect('/login');
//     return; // Ensure nothing else is rendered after redirection
//   }
  

//   try {
//     // Find the user by email from the session
//     const user = await userTable.findOne({ email: session.user.email }).lean();

//     if (!user) {
//       // Handle case where user is not found
//       console.error("User not found");
//       return <p>User not found. Please try again later.</p>;
//     }

//     // Fetch todos for the authenticated user using the user's _id
//     const todos = await todoTable.find({ userId: user._id }).lean();
    
//     // Convert MongoDB documents to JSON
//     const todosJson = JSON.parse(JSON.stringify(todos));

//     return (
//       <div>
//         <h1>My Todos</h1>
//         <Button session = {session}/>
//         {todosJson.length === 0 ? (
//           <p>No todos found.</p>
//         ) : (
//           <ul>
//             {todosJson.map(todo => (
//               <li key={todo._id}>
//                 <span>{todo.todo}</span> - {todo.completed ? 'Completed' : 'Pending'}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//     return <p>Failed to load todos. Please try again later.</p>;
//   }
// }