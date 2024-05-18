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
                                <Route path="/projet" element={<Projet /> }/>
                                <Route path="/projet/responsable" element={<ProjetResponsable /> }/>
                                <Route path="/client" element={<RoleProtectedRoute allowedRoles={["responsable"]}><Client /></RoleProtectedRoute>} />
                                <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={["responsable"]}><Dashboard /></RoleProtectedRoute>} />
                                <Route path="/approbation" element={<RoleProtectedRoute allowedRoles={["responsable"]}><Approbation /></RoleProtectedRoute>} />
                                <Route path="/approbation/collab" element={<RoleProtectedRoute allowedRoles={["collaborateur"]}><ApprobationCollab /></RoleProtectedRoute>} />
                                <Route path="/calendrier" element={<RoleProtectedRoute allowedRoles={["collaborateur", "responsable"]}><Calendrier /></RoleProtectedRoute>} />
                                <Route path="/parametrage" element={<RoleProtectedRoute allowedRoles={["collaborateur", "responsable"]}><Parametrage /></RoleProtectedRoute>} />
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
