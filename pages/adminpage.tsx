import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Layout from './layout';

interface FormData {
  email: string;
  docId: string;
  fullName: string;
  hospital: string;
  specialization: string;
  photo: string | null;
  password: string;
}

const AdminPage: React.FC = () => {
  const [adminKey, setAdminKey] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    docId: '',
    fullName: '',
    hospital: '',
    specialization: '',
    photo: null,
    password: '',
  });

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'adminKey') {
      setAdminKey(value);
      return;
    }
    if (name === 'photo') {
      const file = files ? files[0] : null;
      if (file) {
        getBase64(file).then((base64String) => {
          setFormData((prevState) => ({ ...prevState, [name]: base64String }));
        });
      } else {
        setFormData((prevState) => ({ ...prevState, [name]: null }));
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataToSend = { ...formData };
      const response: AxiosResponse<any> = await axios.post('/api/doctorsmanage', formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
          adminkey: adminKey,
        },
      });

      console.log(response.data);
      // Reset the form after successful submission
      setFormData({
        email: '',
        docId: '',
        hospital: '',
        fullName: '',
        specialization: '',
        photo: null,
        password: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-300 shadow-xl rounded-lg flex flex-col justify-center items-center">
      <div className="text-3xl my-2 text-emerald-500 font-bold mb-8">Register Your Doctors</div>
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="adminKey">
                Admin Key
              </label>
              <input
                className="shadow bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="adminKey"
                type="text"
                name="adminKey"
                value={adminKey}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="hospital">
                Hospital Name
              </label>
              <input
                className="shadow bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="hospital"
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="docId">
                Doctor ID
              </label>
              <input
                className="shadow bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="docId"
                type="text"
                name="docId"
                value={formData.docId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="specialization">
                Specialization
              </label>
              <input
                className="shadow bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="specialization"
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="shadow bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="photo">
               Profile Photo
              </label>
              <input
                className=" appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="photo"
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="px-5 py-3 rounded-lg text-white bg-slate-800 hover:bg-emerald-700 m-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminPage;