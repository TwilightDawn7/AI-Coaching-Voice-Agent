import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';

function AppHeader(){
  return (
    <div className='p-3 shadow-sm flex justify-between items-center'>
      <Image src={"/logo.svg"} alt="logo"
        width={100}
        height={40}
      />

      <UserButton />
    </div>
  );
}

export default AppHeader;
