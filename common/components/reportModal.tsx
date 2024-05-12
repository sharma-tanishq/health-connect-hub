import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import { UsersStateContext } from 'contexts/users-settings';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReportContract from './contract.json';
import { useUser } from '@auth0/nextjs-auth0';

const web3 = new Web3('https://ganache-syzu.onrender.com');

interface ModalProps {
  onClose: () => void;
}

const ReportModal: React.FC<ModalProps> = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isHost } = useContext(UsersStateContext);
  const [fileNames, setFileNames] = useState([{ name: '', url: ''}]);
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
        ReportContract.abi,
        ReportContract.address
      );

      const reportdata = await contract.methods.getReports(patientEmail).call();

      console.log('IPFS URL from blockchain:', reportdata);
      if (reportdata) {
        const fileNames = [];
        for (let i = 0; i < (reportdata[2] as any).length; i++) {
          fileNames.push({
            name: reportdata[2][i],
            url: reportdata[0][i],
          });
        }
        setFileNames(fileNames);
        console.log('fileNames:', fileNames);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setPdfFile(null); //////////////////////to verify
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
          ReportContract.abi,
          ReportContract.address
        );
        const fData = new FormData();
        fData.append('file', pdfFile);
        const fileAdded = await fetch("/api/ipfs", {
          method: "POST",
          body: fData,
        });
        // console.log('fileAdded:', await fileAdded.json());
        const reportdata = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ (await fileAdded.json()).IpfsHash}`;
        console.log('PDF file uploaded to local IPFS:', reportdata);
        await contract.methods
          .saveReport(reportdata, patientEmail, pdfFile.name)
          .send({ from: accounts[0], gas: '5000000' });

        fetchReport();
      }
      setPdfFile(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return mounted
    ? createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-2/3 h-2/3 relative">
        <div className="absolute top-2 right-2 z-10 flex items-center justify-end space-x-2 mr-4">
          <label
            htmlFor="pdf-upload"
            className="py-2 px-3 rounded-xl text-white bg-slate-800 hover:bg-emerald-700"
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
              className="py-2 px-3 rounded-xl text-white bg-slate-800 hover:bg-emerald-700"
            >
              Save
            </button>
          )}
          <button
            onClick={fetchReport}
            className="py-2 px-3 rounded-xl text-white bg-slate-800 hover:bg-emerald-700 "
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
            className="py-2 px-3 rounded-xl text-white bg-slate-800 hover:bg-emerald-700"
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
        <div className="p-4 mt-8 h-full w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="outline-none w-full h-full rounded px-4 py-2 text-lg resize-none flex flex-col">
              <div className="w-full mb-4">
                <input
                  type="text"
                  value={pdfFile ? pdfFile.name : 'No File Selected'}
                  disabled
                  className="w-full bg-gray-200 px-4 py-2 rounded"
                />
              </div>
              <div className={`w-full border-2 rounded-lg mb-8 ${fileNames.length > 9 ? "overflow-y-scroll" : ""}`}>
                {fileNames.length > 0 && fileNames[0].name != "" ? (
                  <ul className="list-disc pl-6">
                    {fileNames.map((file, index) => (
                      <li key={index} className="mb-2">
                        <a
                          href={`http://localhost:8080/ipfs/${file.url}`}
                          target="_blank"
                          className="text-blue-500 hover:underline"
                        >
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reports found.</p>
                )}
              </div>
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