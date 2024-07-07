'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '../../public/logo.png';
import { useRouter } from 'next/navigation'; // Corrected from 'next/navigation'
import Link from 'next/link';
import Script from 'next/script';

const Navbar = () => {
  const router = useRouter();
  const [cookieExists, setCookieExists] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Event handler to toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  function hasCookie(cookieName: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return document.cookie
      .split(';')
      .map((entry) => entry.split('='))
      .some(([name, value]) => name.trim() === cookieName && !!value);
  }

  useEffect(() => {
    setCookieExists(hasCookie('token'));
    (async () => {
      // Declare an asynchronous IIFE (Immediately Invoked Function Expression)
      const response = await fetch('/api/fetchEmployeeId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json(); // Use await to wait for the JSON response
        if (data.employeeId === '1' || data.employeeId === '101' || data.employeeId === '11') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false); // Redirect to the homepage if the user is not an admin
        }
      }
    })();
  }, []);

  function deleteCookie(event: React.MouseEvent<HTMLButtonElement>): void {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  }

  return (
    <nav className="text-white p-4 bg-[#0101272d] px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold flex flex-row justify-center items-center">
          <Image src={logo} alt="logo" width={40} height={40} />
          <p className="mt-2">BPlusAC</p>
          <p className="mt-3 ml-2 text-[10px]">Beta v0.0.3</p>
        </div>
        {cookieExists ? (
          isAdmin ? (
            <ul className="flex space-x-4 ml-16">
              {/* Admin-specific links */}
              <li>
                <Link href="/dashboard" className="hover:text-zinc-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/timesheet/admin" className="hover:text-zinc-400">
                  Approve Timesheets
                </Link>
              </li>
              <li>
                <Link href="/timesheet/user" className="hover:text-zinc-400">
                  Add Timesheets
                </Link>
              </li>
              <li style={{ position: 'relative' }}> {/* Add relative positioning here */}
                <button
                  id="dropdownNavbarLink"
                  data-dropdown-toggle="dropdownNavbar"
                  className="text-white hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 pl-3 pr-4 py-2 md:p-0 flex items-center justify-between w-full md:w-auto"
                  onClick={toggleDropdown} // Attach the event handler here
                >
                  Add{' '}
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
                <div id="dropdownNavbar" className={`${isDropdownOpen ? '' : 'hidden'} bg-white text-base z-10 list-none divide-y divide-gray-100 rounded shadow my-4 w-44 absolute`} style={{ top: '100%' }}> {/* Add absolute positioning and set top to 100% */}
                  <ul className="py-1" aria-labelledby="dropdownLargeButton">
                    <li>
                      <Link href="/addemployee" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">
                        Add Employee
                      </Link>
                    </li>
                    <li>
                      <Link href="/addproject" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">
                        Add Project
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          ) : (
            <ul className="flex space-x-4 ml-16">
              {/* User-specific links */}
              <li>
                <Link href="/" className="hover:text-zinc-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-zinc-400">
                  Profile
                </Link>
              </li>
            </ul>
          )
        ) : (
          <ul className="flex space-x-4 ml-16">
            {/* Public links */}
            <li>
              <Link href="/" className="hover:text-zinc-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-zinc-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-zinc-400">
                Contact Us
              </Link>
            </li>
          </ul>
        )}
        <div className="flex space-x-4 items-center">
          {cookieExists ? (
            <button onClick={deleteCookie} className="bg-[#E25037] text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          ) : (
            <Link href="/auth/login" className="bg-[#E25037] text-white px-4 py-2 rounded-lg">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
