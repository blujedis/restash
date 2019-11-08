import React, { FC } from 'react';
import { Link, useRouter } from 'wouter';
import useLocation from "wouter/use-location";

const Menu: FC = () => {

  return (
    <div>
      <Link href="/" >Default</Link>
    </div>
  );
  
};

export default Menu;
