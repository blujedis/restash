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
        <li style={li}><Link href="/" >Default</Link></li>
        <li style={li}><Link href="/nested" >Nested</Link></li>
        <li style={li}><Link href="/any" >Any</Link></li>
        <li style={li}><Link href="/theme" >Theme</Link></li>
      </ul>
    </div>

  );

};

export default Menu;
