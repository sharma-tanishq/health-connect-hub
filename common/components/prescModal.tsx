import axios from 'axios';
import Web3 from 'web3';
import { UsersStateContext } from 'contexts/users-settings';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PrescriptionContract from "./contract.json"

const web3 = new Web3('http://127.0.0.1:7545');

interface ModalProps {
  onClose: () => void;
  userId: string;
}

const PrescModal: React.FC<ModalProps> = ({ onClose, userId }) => {
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isHost } = useContext(UsersStateContext);
  const { streams, names } = useContext(UsersStateContext);

  // Assuming userId is the patient's email
  const usersEntries = Object.entries(streams);

  useEffect(() => {
    fetchPrescription();
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchPrescription = () => {
    setIsLoading(true);
    if (!isHost) {
      axios
        .post('/api/prescription', {
          userId,
        })
        .then((response) => {
          setInputValue(response.data.prescription);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsLoading(false);
        });
    }
    if (isHost) {
      const docId = localStorage.getItem('docId');
      const token = localStorage.getItem('token');
      if (docId && token) {
        const patientEmail = names[usersEntries[0][0]];
        const change = false;
        axios
          .post('/api/prescription', {
            docId,
            token,
            change,
            patientEmail,
          })
          .then((response) => {
            setInputValue(response.data.prescription);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            setIsLoading(false);
          });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const fetchBlockchainPrescription = async (docId: string) => {
    try {
      const contract = new web3.eth.Contract(
        PrescriptionContract.abi,
        PrescriptionContract.address
      );
      const prescription = await contract.methods.getPrescription(docId).call();
      console.log('Prescription from blockchain:', prescription);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isHost) {
        const docId = localStorage.getItem('docId');
        const token = localStorage.getItem('token');

        if (docId && token) {
          const change = editMode ? true : false;
          const prescription = editMode ? inputValue : '';
          const patientEmail = names[usersEntries[0][0]]; // Assuming userId is the patient's email

          const response = await axios.post('/api/prescription', {
            docId,
            token,
            change,
            prescription,
            patientEmail,
          });

          const accounts = await web3.eth.getAccounts();
          const contract = new web3.eth.Contract(
            PrescriptionContract.abi,
            PrescriptionContract.address
          );
          await contract.methods
            .savePrescription(docId, prescription, patientEmail)
            .send({ from: accounts[0], gas: "1000000" });

          console.log('Response:', response.data);
          fetchBlockchainPrescription(docId);
        } else {
          console.error('docId or token not found in localStorage');
        }
      }
      setEditMode(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return mounted
    ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-2/3 h-2/3 relative">
            <div className="absolute top-2 right-2 flex z-10">
              {isHost ? (
                editMode ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                )
              ) : null}
              <button
                onClick={fetchPrescription}
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
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  className="outline-none w-full h-full rounded px-4 py-2 text-lg resize-none"
                  disabled={!editMode}
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default PrescModal;
