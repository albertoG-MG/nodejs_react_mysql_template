import React from 'react';
import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";

export default function NavbarMenu({ onToggleSidebar }) {
    return (
      <>
      <Navbar fluid className="relative z-10 bg-gradient-to-r from-orange-400 to-red-500 px-6 shadow-lg z-50">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar}  name="hamburger" className="px-4 md:hidden">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
          </button>
          <span className="self-center text-3xl font-bold text-white font-inter">
            INTRANET
          </span>
        </div>
        <div className="flex items-center md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold text-gray-800">Bonnie Green</span>
              <span className="block truncate text-sm text-gray-600">name@flowbite.com</span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
      </>
    );
}
  
  
