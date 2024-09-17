


import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { userTable, connectToDatabase } from './db'; // Adjust path if needed

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ profile }) {
      try {

        await connectToDatabase();
        // Check if the user already exists
        let user = await userTable.findOne({ email: profile.email }).exec();

        if (!user) {
          // Create a new user if not found
          user = new userTable({
            name: profile.name,
            email: profile.email,
            password: '', // Handle password securely
          });
          await user.save();
        }

        // Proceed with sign-in
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false; // Deny sign-in if there's an error
      }
    },
    async session({ session, token }) {
      // console.log(token);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      // console.log(token);
      return token;
    },
  },
});




// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import { redirect } from "next/navigation";
 
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [Google({
//     clientId: process.env.AUTH_GOOGLE_ID || "",
//     clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
//     authorization: {
//       params: {
//         prompt: "consent",
//         access_type: "offline",
//         response_type: "code",
//       },
//     },
//   }),],
//   pages: {
//     signIn: `/login`,
//     error: '/login' 
//   },
//   callbacks: {
//     async signIn({ profile }) {
//       console.log("User profile on sign in:", profile);
//       // You can add custom logic here to determine whether the sign-in is allowed
//       return true; // Return true to allow sign-in
//     },
//     async session({ session, token }) {
//         // console.log("Session callback:", session);
//         // You can modify the session object here if needed
//         return {
//             ...session,
//             user: {
//                 ...session.user,
//                 id: token.id,
//             },
//         };
//     },
//     async jwt({ token, user }) {
//         if (user) {
//             console.log("JWT callback:", user);
//             // You can add custom logic to include user data in the JWT token
           
//             token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
    
// },

// })

// auth.js

// import NextAuth from 'next-auth';
// import Google from 'next-auth/providers/google';
// import { connectToDatabase, getUserModel } from './db'; // Adjust path if needed
// // import User from './app/models/user.model'; // Adjust path if needed

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID || '',
//       clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
//       authorization: {
//         params: {
//           prompt: 'consent',
//           access_type: 'offline',
//           response_type: 'code',
//         },
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/login',
//     error: '/login',
//   },
//   callbacks: {
//     async signIn({ profile }) {
//       try {
//         // Connect to the database
//         await connectToDatabase();

//         // Check if the user already exists
//         let user = await User.findOne({ email: profile.email }).exec();

//         if (!user) {
//           // Create a new user if not found
//           user = new User({
//             name: profile.name,
//             email: profile.email,
//             image: profile.picture,
//           });
//           await user.save();
//         }

//         // Proceed with sign-in
//         return true;
//       } catch (error) {
//         console.error('Error in signIn callback:', error);
//         return false; // Deny sign-in if there's an error
//       }
//     },
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.id,
//         },
//       };
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//   },
// });