import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, Typography, Paper } from '@mui/material';
import { red } from '@mui/material/colors';

const ApprobationCollaborateur = () => {
  const history = useNavigate();
  const [feuillesApprobations, setFeuillesApprobations] = useState([
    { id: 1, reference: 'REF001', nom: 'Feuille 1', heures: 40, statut: 'Acceptée', dateEnvoi: '2024-04-01', dateApprobation: '2024-04-05' },
    { id: 2, reference: 'REF002', nom: 'Feuille 2', heures: 35, statut: 'En cours', dateEnvoi: '2024-04-02', dateApprobation: null },
    { id: 3, reference: 'REF003', nom: 'Feuille 3', heures: 42, statut: 'Rejetée', dateEnvoi: '2024-04-03', dateApprobation: '2024-04-07' },
    { id: 4, reference: 'REF004', nom: 'Feuille 4', heures: 38, statut: 'Acceptée', dateEnvoi: '2024-04-04', dateApprobation: '2024-04-08' },
    { id: 5, reference: 'REF005', nom: 'Feuille 5', heures: 45, statut: 'Rejetée', dateEnvoi: '2024-04-05', dateApprobation: '2024-04-09' },
  ]);

  // Fonction pour charger les données des feuilles d'approbation
  const fetchFeuillesApprobations = async () => {
    // Logique pour récupérer les données des feuilles d'approbation depuis l'API ou une source de données
    // Exemple :
    const response = await fetch('url_de_votre_api/feuillesApprobations');
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const loadFeuillesApprobations = async () => {
      const feuillesApprobationsData = await fetchFeuillesApprobations();
      setFeuillesApprobations(feuillesApprobationsData);
    };

    loadFeuillesApprobations();
  }, []);

  // Fonction pour modifier une feuille rejetée
  const handleModifierFeuille = (feuilleId) => {
    history.push(`/modifierFeuille/${feuilleId}`);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Liste des Approbations
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Référence</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Heures travaillées</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date d'envoi</TableCell>
              <TableCell>Date d'approbation</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feuillesApprobations.map((feuille) => (
              <TableRow key={feuille.id} style={{ backgroundColor: feuille.statut === 'Rejetée' ? red[100] : 'inherit' }}>
                <TableCell>{feuille.reference}</TableCell>
                <TableCell>{feuille.nom}</TableCell>
                <TableCell>{feuille.heures}</TableCell>
                <TableCell>{feuille.statut}</TableCell>
                <TableCell>{feuille.dateEnvoi}</TableCell>
                <TableCell>{feuille.dateApprobation || '-'}</TableCell>
                <TableCell>
                  {feuille.statut !== 'En cours' && (
                    <Button onClick={() => handleModifierFeuille(feuille.id)}>Modifier</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default ApprobationCollaborateur;
