import React from 'react';
import SideBar from './SideBar/SideBar';
import TopBar from './TopBar/TopBar';
const Layout = ({ children }) => {
    return (
        <>
            <div>
                <TopBar />
                <SideBar />
            </div>
            <main>{children}</main>
        </>
    );
};

export default Layout;
