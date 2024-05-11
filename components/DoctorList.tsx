import React from 'react';

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
  joinRoom: (roomId: string) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, joinRoom }) => {
  const handleDoctorClick = (doctor: Doctor) => {
    console.log(`Clicked doctor: ${doctor.fullName}`);
    joinRoom(doctor.docId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {doctors.map((doctor) => (
        <div
          key={doctor.docId}
          className="bg-gray-800 shadow-lg rounded-lg overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300 "
          onClick={() => handleDoctorClick(doctor)}
        >
          <div className="h-56 overflow-hidden bg-gray-800">
            <div className='p-2'>

            <img
              src={`${doctor.photo}`}
              alt={doctor.fullName}
              className="w-full h-full object-cover"
              />
              </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 text-white">
              Name: {doctor.fullName}
            </h3>
            <div className="mb-2">
              <span className="font-semibold text-white">
                Specialization:
              </span>{' '}
              <span className="text-white">{doctor.specialization}</span>
            </div>
            <div>
              <span className="font-semibold text-white">Hospital:</span>{' '}
              <span className="text-white">{doctor.hospital}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;