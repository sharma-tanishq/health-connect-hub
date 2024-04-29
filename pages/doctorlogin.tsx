import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { createHost } from '@common/utils';
import { ROOM_NAME } from 'common/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    //clear local storage
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
      //check status ok
      if (response.status !== 200) {
        throw new Error('An error occurred. Please try again.');
      }
      if (response.data.status === "ok") {
        // Handle successful login
        createRoom(response.data.docId);
      }
      // Handle successful login
      console.log('Login successful!', response.data);
    } catch (error) {
      // Handle login error
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
