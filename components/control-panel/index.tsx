import { useContext } from 'react';

import {
  ChatAltIcon as ChatIcon,
  ArrowsExpandIcon,
  ClipboardCopyIcon,
  ViewListIcon,
} from '@heroicons/react/outline';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneMissedCallIcon as HangUpIcon,
  UploadIcon as ShareScreenIcon,
  ClipboardIcon,
} from '@heroicons/react/solid';
import { UsersConnectionContext } from 'contexts/users-connection';
import { UsersStateContext } from 'contexts/users-settings';
import Tooltip from 'react-tooltip';

import CrossLineDiv from '@common/components/cross-line-div';

const ControlPanel = ({
  togglePrescription,
  prescription,
  muted,
  visible,
  chat,
  status,
  screenTrack,
  screen,
  onToggle,
  onLeave,
}: any) => {
  const { sharedScreenTrack: shared, streams } = useContext(UsersStateContext);
  const { users } = useContext(UsersConnectionContext);

  return (
    <>
      {(screenTrack || shared) && (
        <button
          onClick={() => onToggle('fullscreen')}
          className={`${common} bg-slate-800 hover:bg-emerald-700`}
        >
          <ArrowsExpandIcon className="w-6 h-6" />
        </button>
      )}

      <div className="flex flex-auto gap-6 place-content-center items-center">
        <button
          onClick={() => onToggle('video', Object.values(users))}
          data-for="visibility"
          data-tip={`${!visible ? 'switch on' : 'switch off'}`}
          className={`${common} bg-slate-800 hover:bg-emerald-700 relative`}
        >
          <VideoCameraIcon className="h-6 w-6" />
          {!visible && <CrossLineDiv />}
        </button>
        <Tooltip id="visibility" effect="solid" />

        <button
          onClick={() => onToggle('audio')}
          data-for="audio"
          data-tip={`${muted ? 'unmute' : 'mute'}`}
          className={`${common} bg-slate-800 hover:bg-emerald-700 relative`}
        >
          <MicrophoneIcon className="h-6 w-6" />
          {muted && <CrossLineDiv />}
        </button>
        <Tooltip id="audio" effect="solid" />

        <button
          onClick={onLeave}
          data-for="hangUp"
          data-tip="hang up"
          className={`${common} bg-red-600 hover:bg-red-500`}
        >
          <HangUpIcon className="h-7 w-7" />
        </button>
        <Tooltip id="hangUp" effect="solid" />

        <button
          onClick={() => onToggle('screen')}
          disabled={shared}
          className={`${common} ${screen
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-slate-800 hover:bg-emerald-700'
            }`}
          data-for="shareScreen"
          data-tip="share your screen"
        >
          <ShareScreenIcon className="h-6 w-6" />
        </button>
        <Tooltip id="shareScreen" effect="solid" />

        <button
          data-for="chat"
          data-tip="chat with everyone"
          onClick={() => onToggle('chat')}
          className={`${common} ${chat
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-slate-800 hover:bg-emerald-700'
            }`}
        >
          <ChatIcon className="w-6 h-6" />
        </button>
        <Tooltip id="chat" effect="solid" />
        <button
          data-for="prescription"
          data-tip="Add prescription for your patient"
          onClick={togglePrescription}
          className={`${common} ${prescription
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-slate-800 hover:bg-emerald-700'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>

        </button>
        <Tooltip id="prescription" effect="solid" />
      </div>
      <ParticipantsCount
        onClick={() => onToggle('users')}
        count={Object.keys(streams).length + 1}
      />
    </>
  );
};

export default ControlPanel;

const common = 'p-3 rounded-xl text-white';

const ParticipantsCount = ({ count, onClick }: any) => {
  return (
    <div className="inline-block relative">
      <button
        onClick={onClick}
        className="inline-block h-10 w-10 rounded-xl overflow-hidden bg-gray-100"
      >
        <svg
          className="h-full w-full text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      </button>
      <span className="place-content-center absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-amber-300 text-xs text-center text-black">
        {count}
      </span>
    </div>
  );
};
