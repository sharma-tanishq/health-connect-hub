import { Header, WelcomeContainer } from '../components';
import React, { ReactNode } from 'react';
type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {

    return (
        <>
            <Header />
            <WelcomeContainer>
                <main>
                    {children}
                </main>
            </WelcomeContainer>
        </>
    )
}
export default Layout;