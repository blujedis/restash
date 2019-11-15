import React, { FC } from 'react';
import { Link } from 'wouter';

const ul = {
  padding: '0',
  margin: '12px 0',
  listStyle: 'none'
};

const li = {
  display: 'inline-block',
  marginRight: '8px'
};

const Menu: FC = () => {

  return (
    <div>
      <img src="/logo.png" width="175" style={{ marginBottom: '12px' }} />
      <ul style={ul}>
        <li style={li}><Link href="/" >Store</Link></li>
        <li style={li}><Link href="/storeat" >StoreAt</Link></li>
      </ul>
    </div>

  );

};

export default Menu;
