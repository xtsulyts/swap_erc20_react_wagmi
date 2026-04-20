import React from 'react';
import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-white font-bold text-lg tracking-tight">ERC-20 Swap</span>

        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            Swap
          </NavLink>
          <NavLink
            to="/liquidez"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            Liquidez
          </NavLink>
          <NavLink
            to="/send"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            Enviar
          </NavLink>
        </div>

        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="avatar"
        />
      </div>
    </nav>
  );
};

export default Navbar;
