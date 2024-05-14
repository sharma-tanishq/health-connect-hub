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

const Home: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/api/doctorsmanage`);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
  }, []);

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
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-gray-800 xl:inline">
              Meet Our Doctors.
            </span>{' '}
            <span className="block text-emerald-500 xl:inline">
              Connect & Heal.
            </span>
          </h1>
          <div className="my-2">
            <DoctorList doctors={doctors} joinRoom={joinRoom} />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;