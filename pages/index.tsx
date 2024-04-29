import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ROOM_NAME } from 'common/constants';
import { createRoomId, createHost } from '@common/utils';

import { Header, WelcomeContainer } from '../components';

import DoctorList from '../components/DoctorList';
import axios from 'axios';

interface Doctor {
  email: string;
  fullName: string;
  specialization: string;
  hospital: string;
  docId: string;
  photo: string;
}

interface DoctorListProps {
  doctors: Doctor[];
}

const Home: React.FC<DoctorListProps> = ({ doctors }) => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const handleRouteChange = () => {
      router.reload();
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
  useEffect(() => {
    //clear local storage
    window.localStorage.clear();
  });

  function createRoom() {
    const roomId = createRoomId();
    createHost("1");
    router.push(`/${ROOM_NAME}/${1}`);
  }

  function joinRoom(roomId: string) {
    router.push(`/${ROOM_NAME}/${roomId}`);
  }

  function joinRoom2() {
    router.push(`/${ROOM_NAME}/${roomId}`);
  }

  return (
    <>
      <Header />
      <WelcomeContainer>
        <button
          onClick={createRoom}
          className="p-3 bg-emerald-300 hover:bg-indigo-200 rounded-md text-emerald-800 text-sm founded-medium"
        >
          Create Meet
        </button>
        <input
          onChange={(e: any) => setRoomId(e.target.value)}
          placeholder="Enter or paste room id"
          className="px-4 py-1 w-80 rounded-md"
        />
        <button
          onClick={joinRoom2}
          disabled={roomId.length === 0}
          className="p-3 bg-emerald-500 hover:bg-indigo-300 rounded-md text-emerald-800 text-sm founded-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Join
        </button>
      </WelcomeContainer>
      <DoctorList doctors={doctors} joinRoom={joinRoom} />
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/doctorsmanage');
    const doctors: Doctor[] = response.data;

    return {
      props: {
        doctors,
      },
    };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return {
      props: {
        doctors: [],
      },
    };
  }
};

export default Home;