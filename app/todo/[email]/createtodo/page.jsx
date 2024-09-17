// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';

// export default function CreateTodoPage() {
//   const [todo, setTodo] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();
//   const { data: session, status } = useSession();
  
//   // Check if the session is loading or not
//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Check if session or session user email is available
//       if (!session || !session.user || !session.user.email) {
//         console.error('User email is not available.');
//         return;
//       }

//       // Prepare data to send to the API route
//       const data = {
//         todo,
//         email: session.user.email,
//       };
//       console.log(data);

//       // Send the request to the API route
//       const response = await fetch('/api/todo/createtodo', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         // Redirect to the todos page
//         // router.push(`/todo/${session.user.email}`);


//         // i implemented time stamping to force browser fetch new data from server niceee
//         router.push(`/todo/${session.user.email}?timestamp=${Date.now()}`);
//       } else {
//         // Handle error
//         console.error('Failed to create todo:', result.error);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Create New Todo</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={todo}
//           onChange={(e) => setTodo(e.target.value)}
//           placeholder="Enter new todo"
//           required
//         />
//         <button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Adding...' : 'Add Todo'}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateTodoPage() {
  const [todo, setTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check if the session is loading or not
  if (status === 'loading') {
    return <div className="text-gray-500">Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!session || !session.user || !session.user.email) {
        console.error('User email is not available.');
        return;
      }

      const data = {
        todo,
        email: session.user.email,
      };
      console.log(data);

      const response = await fetch('/api/todo/createtodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/todo/${session.user.email}?timestamp=${Date.now()}`);
      } else {
        console.error('Failed to create todo:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Create New Todo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              placeholder="Enter new todo"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Todo'}
          </button>
        </form>
      </div>
    </div>
  );
}
