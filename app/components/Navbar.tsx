'use client';
import Image from 'next/image';
import logo from '../../public/logo.png';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  function hasCookie(cookieName: string): boolean {
    if (typeof window === 'undefined') {
      return false; // Return false or handle accordingly for server-side rendering
    }
    return document.cookie
      .split(';')
      .map((entry) => entry.split('='))
      .some(([name, value]) => name.trim() === cookieName && !!value);
  }
  const cookieExists = hasCookie('token');

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
          <p className="mt-3 ml-2 text-[10px]">Beta v0.0.2</p>
        </div>
        {cookieExists ? (
          <ul className="flex space-x-4 ml-16">
            <li>
              <Link href="/" className="hover:text-zinc-400">
                Home
              </Link>
            </li>
            {/* <li>
  <Link href="/dashboard" className="hover:text-zinc-400">
    Dashboard
  </Link>
</li>
<li>
  <Link href="/profile" className="hover:text-zinc-400">
    Profile
  </Link>
</li> */}
          </ul>
        ) : (
          <ul className="flex space-x-4 ml-16">
            <li>
              <Link href="/" className="hover:text-zinc-400">
                Home
              </Link>
            </li>
            {/* <li>
  <Link href="/about" className="hover:text-zinc-400">
    About
  </Link>
</li>
<li>
  <Link href="/contact" className="hover:text-zinc-400">
    Contact Us
  </Link>
</li> */}
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
    </nav>
  );
};

export default Navbar;
