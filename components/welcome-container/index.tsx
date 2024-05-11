export default function WelcomeContainer({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8  w-full ">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-left lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block text-gray-800 xl:inline">
                    Health Connect Hub.
                  </span>{' '}
                  <span className="block text-emerald-500 xl:inline">
                    Connect & Heal.
                  </span>
                </h1>
                
              </div>
              <div className="grid grid-cols-2">
                <div className="col-span-1">
                  <div className="mt-10 text-gray-800 text-left sm:mt-12">
                    <h2 className="text-3xl font-semibold mb-4">Why Choose Health Connect Hub?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Convenience</h3>
                        <p>Access to healthcare professionals from the comfort of your home.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Expertise</h3>
                        <p>Connect with experienced doctors specializing in various fields.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                        <p>Available anytime, anywhere, across the globe.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Security</h3>
                        <p>Your privacy and data security are our top priorities.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 text-gray-800 text-left sm:mt-12">
                    <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
                    <p className="text-lg">
                      1. Sign up and create your account.
                      <br />
                      2. Browse through available doctors and their specialties.
                      <br />
                      3. Schedule an appointment at your convenience.
                      <br />
                      4. Connect via video call and consult with your chosen doctor.
                      <br />
                      5. Get prescriptions and medical advice from the comfort of your home.
                    </p>
                  </div>
                </div>
                <div className="mt-10 p-4 col-span-1 col-start-2">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}