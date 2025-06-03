// "use client";

// import { api } from '@/convex/_generated/api';
// import { useUser } from '@clerk/nextjs';
// import { useMutation } from 'convex/react';
// import React, { useState, useEffect } from 'react';
// import { UserContext } from './_context/UserContext';

// export default function AuthProvider({ children }) {

//   const { user, isSignedIn, isLoaded } = useUser();
//   const createUser = useMutation(api.users.CreateUser);
//   const [userData, setUserData] = useState()
// ;
//   useEffect(() => {
//     if (isSignedIn && isLoaded && user) {
//       const result = {
//         name: user.fullName,
//         email: user.primaryEmailAddress.emailAddress,
//       };
//       createUser(result);

//       console.log(result);
//       setUserData(result);
//     }
//   }, [isSignedIn, isLoaded, user]);

//   return (
//         <div>
//             <UserContext.Provider value={{userData, setUserData}}>
//               {children}
//             </UserContext.Provider>
//         </div>  
//         );
// }
"use client";

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation, useConvex } from 'convex/react';
import React, { useState, useEffect } from 'react';
import { UserContext } from './_context/UserContext';

export default function AuthProvider({ children }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const createUser = useMutation(api.users.CreateUser);
  const convex = useConvex();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      if (isSignedIn && isLoaded && user) {
        const email = user.primaryEmailAddress.emailAddress;
        const name = user.fullName;

        // 1. Try to get existing user from Convex
        const existingUser = await convex.query(api.users.getUserByEmail, {
          email,
        });

        if (existingUser) {
          setUserData(existingUser); // ✅ includes _id
        } else {
          // 2. If not found, create new user
          const newUserId = await createUser({ name, email });

          // 3. Refetch full user (because `createUser` only returns `_id`)
          const newUser = await convex.query(api.users.getUserByEmail, {
            email,
          });

          setUserData(newUser);
        }
      }
    };

    initUser();
  }, [isSignedIn, isLoaded, user]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
