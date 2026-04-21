import React from 'react';
import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
  }`;

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      {/* Desktop: una sola fila */}
      <div className="hidden sm:flex max-w-7xl mx-auto px-6 h-14 items-center justify-between">
        <span className="text-white font-bold text-lg tracking-tight">ERC-20 Swap</span>

        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          <NavLink to="/" end className={navLinkClass}>Swap</NavLink>
          <NavLink to="/liquidez" className={navLinkClass}>Liquidez</NavLink>
          <NavLink to="/send" className={navLinkClass}>Enviar</NavLink>
        </div>

        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
      </div>

      {/* Mobile: dos filas */}
      <div className="sm:hidden px-4 pt-2 pb-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-base tracking-tight">ERC-20 Swap</span>
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
        </div>
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1 w-full">
          <NavLink to="/" end className={({ isActive }) => `flex-1 text-center px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Swap</NavLink>
          <NavLink to="/liquidez" className={({ isActive }) => `flex-1 text-center px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Liquidez</NavLink>
          <NavLink to="/send" className={({ isActive }) => `flex-1 text-center px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Enviar</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
