'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [changePassword, setChangePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [Cpassword, setCPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleChange = (value: string, index: number): void => {
    const newOtp: string[] = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleLogin = async () => {
    const response = await fetch('/api/generateotp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail: email }),
    });

    const data = await response.json();

    // Inside an async function
    if (response.ok) {
      console.log(data.message)
      setIsOtpSent(true);
      alert("Sent otp to your mail.")
    } else {
      console.error(data.message);
    }
  };

  const handleOTP = async () => {
    const response = await fetch('/api/verifyotp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enteredOtp: otp.join(''), userEmail: email }),
    });

    const data = await response.json();

    // Inside an async function
    if (response.ok) {
      setChangePassword(true);
    } else {
      console.error(data.message);
    }
  };

  const handleChangePassword = async () => {
    if (password === Cpassword) {
      const response = await fetch('/api/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: password, userEmail: email }),
      });
      if (response.ok) {
        router.push('/auth/login');
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 ">
      <div className="bg-zinc-800 text-white rounded-lg p-8 shadow-lg border border-[#E25037]">
        <div className="flex">
          <div className="flex items-center justify-center flex-col p-5 m-5">
            <Image src={logo} alt="logo" width={200} height={200} />
            <h1 className="text-3xl text-center font-bold mt-4 mr-2">BPlusAC</h1>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Hello!
              <br />
              Welcome Back...
            </h2>
            {!changePassword ? (
              <>
                <div className="mb-4">
                  <label className="block text-zinc-400 mb-2" htmlFor="email">
                    Your email address
                  </label>
                  <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                    <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="text" id="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <button onClick={handleLogin} disabled={isOtpSent} className="mb-4 w-full bg-[#E25037] text-white py-2 rounded-lg hover:bg-[#71281B] transition duration-200">
                  Send OTP
                </button>
                <div className="otp flex flex-col gap-1 mb-2 lg:mb-4">
                  <label className="block text-zinc-400 mb-2" htmlFor="email">
                    Enter OTP
                  </label>
                  <div className="flex items-center gap-2 mb-4">
                    {otp.map((digit, index) => (
                      <React.Fragment key={index}>
                        <input type="text" maxLength={1} value={digit} onChange={(e) => handleChange(e.target.value, index)} className="bg-[#282A2F] px-2 py-2 w-12 h-12 text-center border-[1px] border-stroke text-sm rounded-lg" required />
                        {index < otp.length - 1 && <p>-</p>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <button onClick={handleOTP} className="mb-4 w-full bg-[#E25037] text-white py-2 rounded-lg hover:bg-[#71281B] transition duration-200">
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-zinc-400 mb-2" htmlFor="email">
                    New Password
                  </label>
                  <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                    <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="password" id="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-zinc-400 mb-2" htmlFor="email">
                    Confirm New Password
                  </label>
                  <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                    <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="password" id="password" placeholder="Confirm New Password" value={Cpassword} onChange={(e) => setCPassword(e.target.value)} />
                  </div>
                </div>
                <button onClick={handleChangePassword} className="mb-4 w-full bg-[#E25037] text-white py-2 rounded-lg hover:bg-[#71281B] transition duration-200">
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
