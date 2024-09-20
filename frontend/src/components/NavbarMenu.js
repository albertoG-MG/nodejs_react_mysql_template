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

export default function NavbarMenu() {
    return (
      <Navbar fluid className="bg-gradient-to-r from-orange-400 to-red-500 px-6">
        <span className="self-center text-3xl font-bold text-white font-inter">
          INTRANET
        </span>
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
    );
}
  
  
