import { createContext, useState } from 'react';

import Room from '@app/index';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Lobby } from '@components/index';
import { useMediaStream } from '@hooks/index';
import { NextPage, GetServerSidePropsContext, PreviewData } from 'next';

import { LoaderError } from '@common/components';
import { FAILURE_MSG, LOADER_STREAM_MSG } from '@common/constants';

export const MeetContext = createContext<any>({});

const Meet: NextPage = () => {
  const [isLobby, setIsLobby] = useState(true);
  const { stream, isLoading } = useMediaStream();

  if (isLoading) return <LoaderError msg={LOADER_STREAM_MSG} />;
  if (!stream) return <LoaderError msg={FAILURE_MSG} />;

  if (isLobby)
    return <Lobby stream={stream} onJoinRoom={() => setIsLobby(false)} />;

  return <Room stream={stream} />;
};

export default Meet;

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<any, PreviewData>
) =>
  await withPageAuthRequired({
    returnTo: '/meet/' + ctx.query.meetId,
  })(ctx);
