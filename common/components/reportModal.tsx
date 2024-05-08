import axios from 'axios';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import { UsersStateContext } from 'contexts/users-settings';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PrescriptionContract from './contract.json';
import { useUser } from '@auth0/nextjs-auth0';

const web3 = new Web3('http://127.0.0.1:7545');
const ipfshost = '/ip4/127.0.0.1/tcp/5001';
const ipfs = create({
  url: ipfshost,
});

interface ModalProps {
  onClose: () => void;
}

const ReportModal: React.FC<ModalProps> = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isHost } = useContext(UsersStateContext);
  const [fileNames, setFileNames] = useState([{ name: '', url: '' }]);
  const { streams, names } = useContext(UsersStateContext);
  const userEmail = useUser().user?.email;
  // Assuming userId is the patient's email
  const usersEntries = Object.entries(streams);

  useEffect(() => {
    fetchReport();
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchReport = async () => {
    const patientEmail = isHost ? names[usersEntries[0][0]] : userEmail;
    setIsLoading(true);
    try {
      const contract = new web3.eth.Contract(
        PrescriptionContract.abi,
        PrescriptionContract.address
      );
      const ipfsUrl = await contract.methods
        .getPrescriptions(patientEmail)
        .call();
      console.log('IPFS URL from blockchain:', ipfsUrl);
      console.log(ipfsUrl);
      if (ipfsUrl) {
        const fileNames = [];
        for (let i = 0; i < (ipfsUrl[1] as any).length; i++) {
          fileNames.push({ name: ipfsUrl[2][i], url: (ipfsUrl[0][i] as string).replace(`${ipfshost}/ipfs/`, '') });
        }
        setFileNames(fileNames);
        console.log('fileNames:', fileNames);
        // Download the PDF file from your local IPFS node

        // Extract the IPFS path from the URL
        // if (ipfsUrl.length > 0 && typeof ipfsUrl[0] === 'string') {
        //   const ipfsPath = (ipfsUrl[0] as string).replace(
        //     `${ipfshost}/ipfs/`,
        //     ''
        //   );
        // }
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPdfFile(file || null);
  };

  const handleSave = async () => {
    try {
      if (pdfFile) {
        const patientEmail = names[usersEntries[0][0]]; // Assuming userId is the patient's email

        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
          PrescriptionContract.abi,
          PrescriptionContract.address
        );

        const fileAdded = await ipfs.add(pdfFile);
        const ipfsUrl = `${ipfshost}/ipfs/${fileAdded.path}`;
        console.log('PDF file uploaded to local IPFS:', ipfsUrl);
        await contract.methods
          .savePrescription(ipfsUrl, patientEmail, pdfFile.name)
          .send({ from: accounts[0], gas: '5000000' });

        fetchReport();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return mounted
    ? createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg w-2/3 h-2/3 relative">
          <div className="absolute top-2 right-2 flex z-10">
            <label
              htmlFor="pdf-upload"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
            {pdfFile && (
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
            )}
            <button
              onClick={fetchReport}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-2 h-full w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="outline-none w-full h-full rounded px-4 py-2 text-lg resize-none flex items-center justify-center">
                {fileNames.map((file, index) => (
                  <>
                    <a
                      key={index}
                      href={`http://localhost:8080/ipfs/${file.url}`}
                      target="_blank"
                      className="text-blue-500"
                    >
                      {file.name}
                    </a>
          
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    )
    : null;
};

export default ReportModal;
