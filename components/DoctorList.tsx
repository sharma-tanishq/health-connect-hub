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
    joinRoom: (roomId:string) => void;
  }

const DoctorList: React.FC<DoctorListProps> = ({ doctors, joinRoom }) => {
  const handleDoctorClick = (doctor: Doctor) => {
    console.log(`Clicked doctor: ${doctor.fullName}`);
    joinRoom(doctor.docId);
    // Add any additional logic here, such as navigating to the doctor's profile page
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {doctors.map((doctor) => (
        <div
          key={doctor.docId}
          className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleDoctorClick(doctor)}
        >
          <div className="h-48 overflow-hidden">
            <img
              src={`${doctor.photo}`}
              alt={doctor.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{doctor.fullName}</h3>
            <p className="text-gray-600">{doctor.specialization}</p>
            <p className="text-gray-600">{doctor.hospital}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;