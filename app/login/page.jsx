
// import { signIn, signOut, auth } from "../../auth"
// import { redirect } from 'next/navigation';
// export default async function SignIn() {
//     const session = await auth();
//     // console.log(session);
//     // if (session && session.user) {
//     //       redirect(`/todo/${session.user.email}`);
//     //       return null; // Ensure nothing else is rendered after redirect
//     //     }else{
//     //       console.log("session not found");
//     //     }
      
//   return (
//     <form
//       action={async () => {
//         "use server"
//          await signIn("google", {redirect:true});
//          const updatedSession = await auth();

//                  // Redirect after sign-in
//                  if (updatedSession && updatedSession.user) {
//                    redirect(`/todo/${updatedSession.user.email}`);
//                  } else {
//                    // Handle case where session is still not available
//                    // This should not typically occur, but handle it gracefully
//                    // Optionally show an error or redirect to an error page
//                    console.log("no session found");
//                  }
//       }}
//     >
//       <button type="submit">Signin with Google</button>
//     </form>
//   )
// } 



import { signIn, auth } from "../../auth";
import { redirect } from 'next/navigation';

export default async function SignIn() {
  // Fetch the session on server render
  const session = await auth();
  console.log("Initial session:", session);

  // If a session exists, redirect to the user's dashboard
  if (session && session.user) {
    console.log("User is already authenticated. Redirecting...");
    redirect(`/todo/${session.user.email}`);
    return null; // Prevent rendering of the sign-in form if already authenticated
  }

  // Render the sign-in form if no session is found
  return (
    <form
      action={async () => {
        "use server";
        console.log("Sign-in form submitted.");

        // Perform sign-in action
        await signIn("google", { redirect: true });

        // After sign-in, fetch the updated session
        const updatedSession = await auth();
        console.log("Updated session:", updatedSession);

        // Redirect after sign-in
        if (updatedSession && updatedSession.user) {
          console.log("Redirecting to dashboard after sign-in...");
          redirect(`/todo/${updatedSession.user.email}`);
        } else {
          // Handle case where session is still not available
          console.error("Sign-in failed: session not available after sign-in");
        }
      }}
    >
      <button type="submit">Sign In with Google</button>
    </form>
  );
}
