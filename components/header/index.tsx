import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import { UserIcon } from '../../assets/icons';
import { useRouter } from 'next/router';
const Header = () => {
  const userMetadata = useUser();
  const router = useRouter();

  return (
    <nav className="bg-gray-800 fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-white text-xl font-bold hover:cursor-pointer">Health Connect Hub</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {!userMetadata.user ? (
                  <Link href="/api/auth/login">
                    <button className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Login to Meet
                    </button>
                  </Link>
                ) : (
                  <Link href="/api/auth/logout">
                    <button className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Logout
                    </button>
                  </Link>
                )}
                <Link href={router.pathname ==="/doctorlogin"?"/":"/doctorlogin"}>
                  <button className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    {router.pathname ==="/doctorlogin"?"Meet as Patient":"Meet as Doctor"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <button
                  type="button"
                  className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {userMetadata.user?.picture ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={userMetadata.user.picture}
                      alt=""
                    />
                  ) : (
                    <UserIcon className="h-10 w-10" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;