import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import msalInstance from './msalInstance';
import SideBar from './components/SideBar/SideBar';
import TopBar from './components/TopBar/TopBar';
import Feuille from './components/pages/feuille/Feuille';
import Projet from './components/pages/projet/Projet';
import ProjetResponsable from './components/pages/projet/ProjetResponsable';
import Dashboard from './components/pages/dashboard/Dashboard';
import Approbation from './components/pages/approbation/Approbation';
import ApprobationCollab from './components/pages/approbation/ApprobationCollab';
import Parametrage from './components/pages/parametrage/Parametrage';
import Calendrier from './components/pages/calendrier/Calendrier';
import Auth from './components/authentification/Auth';
import Client from './components/pages/client/Client';
import NotFound from './NotFound';
import RoleProtectedRoute from './RoleProtectedRoute';
import { AuthProvider } from './AuthContext';

const App = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <MsalProvider instance={msalInstance}>
            <AuthProvider>
                <Router>
                    <TopBar onMenuClick={toggleDrawer} />
                    <div style={{ display: 'flex' }}>
                        <SideBar open={openDrawer} onClose={toggleDrawer} />
                        <div style={{ marginTop: "64px", width: "100%", padding: "20px" }}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/Authentification" replace />} />
                                <Route path="/Authentification" element={<Auth />} />
                                <Route path="/feuille" element={<Feuille />} />
                                <Route path="/projet/Collaborateur" element={<Projet /> }/>
                                <Route path="/projet/Responsable" element={<ProjetResponsable /> }/>
                                <Route path="/client/Collaborateur" element={<Client /> }/>
                                <Route path="/client/Responsable" element={<Client /> }/>
                                <Route path="/dashboard" element={<Dashboard /> }/>
                                <Route path="/approbation/Responsable" element={<Approbation /> }/>
                                <Route path="/approbation/collaborateur" element={<ApprobationCollab /> } />
                                <Route path="/calendrier" element={<Calendrier /> } />
                                <Route path="/parametrage" element={<Parametrage /> } />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                    </div>
                </Router>
            </AuthProvider>
        </MsalProvider>
    );
};

export default App;
