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
        <div></div>
      </WelcomeContainer>
      <div className='mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>

        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block text-gray-800 xl:inline">
            Meet Our Doctors.
          </span>{' '}
          <span className="block text-emerald-500 xl:inline">
            Connect & Heal.
          </span>
        </h1>
        <div className='my-2'>

      <DoctorList doctors={doctors} joinRoom={joinRoom} />
        </div>
      </div>
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