import Image from 'next/image';
import landing from '../public/landing.png';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';

export default function Widget() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'radial-gradient(circle 72rem at 80% 75%, rgb(226, 80, 55), rgb(113, 40, 27))',
      }}>
      <Navbar />

      <div className="flex text-white px-8 pl-16 p-[0.2rem]">
        <div className="container mx-auto flex flex-col md:flex-row items-center py-13 h-[81.2vh]">
          <div className="md:w-2/3 space-y-6 p-[1.75rem]">
            <h1 className="text-4xl font-bold">Welcome to SAP Synergy: Unveiling Insights, Simplifying Complexity</h1>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Welcome to the future of streamlined collaboration and organizational efficiency.</li>
              <li>Monitor and manage the team's workflow effectively.</li>
              <li>Utilize powerful project cost management and resource planning tools.</li>
              <li>Leverage advanced analytics for data-driven decision making.</li>
            </ul>
            <Link href="/auth/login">
              <button className="bg-[#E25037] text-white px-6 py-3 rounded-lg mt-8">Login Now</button>
            </Link>
          </div>
          <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center pr-[2rem]">
            <Image src={landing} height={400} width={400} alt="landing" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
