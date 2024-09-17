// components/Nav.js

import { signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const Nav = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login'); // Redirect to login page after sign out
  };

  return (
    <nav>
      <button onClick={handleLogout}>Sign Out</button>
    </nav>
  );
};

export default Nav;
