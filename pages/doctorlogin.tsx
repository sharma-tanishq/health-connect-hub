import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { createHost } from '@common/utils';
import { ROOM_NAME } from 'common/constants';
import Layout from './layout';

const DoctorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Clear local storage
    window.localStorage.clear();
  });

  function createRoom(roomId: string) {
    createHost(roomId);
    router.push(`/${ROOM_NAME}/${roomId}`);
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/doctorauth', {
        email,
        password
      });
      
      if (response.status !== 200) {
        throw new Error('An error occurred. Please try again.');
      }

      if (response.data.status === "ok") {
        // Handle successful login
        localStorage.setItem('docId', response.data.docId);
        localStorage.setItem('token', response.data.token);
        createRoom(response.data.docId);
      }

      console.log('Login successful!', response.data);
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="bg-gray-300 shadow-xl rounded-lg flex justify-center items-center h-full">
        <div className="rounded px-8 text-emerald-500 font-bold pt-6 pb-8 my-4">
          <h2 className="text-3xl mb-4">Login as Doctor</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="px-8 pt-6 pb-8 mb-4 w-full max-w-md">
            <div className="mb-4">
              <label className="block text-gray-700  font-bold mb-2">Hospital Provided Email:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700  font-bold mb-2">Password:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="p-3 rounded-lg text-white bg-slate-800 hover:bg-emerald-700 focus:outline-none focus:shadow-outline" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorLoginPage;
