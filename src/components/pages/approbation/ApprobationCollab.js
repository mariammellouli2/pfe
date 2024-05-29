import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, Typography, Paper } from '@mui/material';
import { red } from '@mui/material/colors';

const ApprobationCollaborateur = () => {
  const navigate = useNavigate(); // Corrected the variable name
  const [feuillesApprobations, setFeuillesApprobations] = useState([]);

  // Fonction pour charger les données des feuilles d'approbation
  const fetchFeuillesApprobations = async () => {
    try {
      const response = await fetch('https://localhost:44352/api/Timesheet/GetTimesheet');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données des feuilles d\'approbation:', error);
      return [];
    }
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
    navigate(`/modifierFeuille/${feuilleId}`);
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
