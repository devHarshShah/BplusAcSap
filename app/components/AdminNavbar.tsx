'use client';
import Image from 'next/image';
import logo from '../../public/logo.png';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';

const AdminNavbar = () => {
  const router = useRouter();
  // Initialize cookieExists state as null to indicate "not yet checked"
  const [cookieExists, setCookieExists] = useState<boolean | null>(null);

  function hasCookie(cookieName: string): boolean {
    if (typeof window === 'undefined') {
      return false; // Return false or handle accordingly for server-side rendering
    }
    return document.cookie
      .split(';')
      .map((entry) => entry.split('='))
      .some(([name, value]) => name.trim() === cookieName && !!value);
  }

  useEffect(() => {
    // Update state after component mounts, ensuring consistent server/client content initially
    setCookieExists(hasCookie('token'));
  }, []);

  function deleteCookie(event: React.MouseEvent<HTMLButtonElement>): void {
    const name = 'token';
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  }

  return (
    <nav className="text-white p-4 bg-[#0101272d] px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold flex flex-row justify-center items-center">
          <Image src={logo} alt="logo" width={40} height={40} />
          <p className="mt-2">BPlusAC</p>
          <p className="mt-3 ml-2 text-[10px]">Beta v0.3.0</p>
        </div>
        {cookieExists ? (
          <ul className="flex space-x-4 ml-16">
            <li>
              <Link href="/" className="hover:text-zinc-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-zinc-400">
                Dashboard
              </Link>
            </li>
            {/* Dropdown Menu with select */}
            <li>
              <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="text-white hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 pl-3 pr-4 py-2 md:p-0 flex items-center justify-between w-full md:w-auto">
                Dropdown{' '}
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="dropdownNavbar" className="hidden bg-white text-base z-10 list-none divide-y divide-gray-100 rounded shadow my-4 w-44">
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
            <Link href="/">
              <button onClick={deleteCookie} className="bg-[#E25037] text-white px-4 py-2 rounded-lg">
                Logout
              </button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <button className="bg-[#E25037] text-white px-4 py-2 rounded-lg">Login</button>
            </Link>
          )}
        </div>
      </div>
      <Script src="https://unpkg.com/@themesberg/flowbite@1.1.1/dist/flowbite.bundle.js" strategy="afterInteractive" />
    </nav>
  );
};

export default AdminNavbar;
