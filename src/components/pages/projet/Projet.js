import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, LinearProgress, Typography } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import { utils as XLSXUtils, writeFile as writeXLSX } from 'xlsx';

const Projet = () => {
  const [projects, setProjects] = useState([]);
  const [sheetData, setSheetData] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://localhost:7288/api/Project/name');
        const projectsWithId = response.data.map((project, index) => ({ ...project, id: index + 1 }));
        setProjects(projectsWithId);
        setSheetData(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const calculateProgress = (project) => {
    if (project?.estimatedTotal && project?.totalConsumed) {
      return (project.totalConsumed / project.estimatedTotal) * 100;
    }
    return 0;
  };

  const handleOnExport = () => {
    try {
      const wb = XLSXUtils.book_new();
      const ws = XLSXUtils.json_to_sheet(sheetData);
      XLSXUtils.book_append_sheet(wb, ws, 'MySheet1');
      writeXLSX(wb, 'MyExcel.xlsx');
      console.log('Export successful!');
    } catch (error) {
      console.error('Error exporting data:', error);
      // Affichez un message d'erreur à l'utilisateur ou effectuez une action appropriée
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' }, // Utilisation de 'id'
    { field: 'projectName', headerName: 'Nom Projet', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'serviceType', headerName: 'Type de prestation', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'totalConsumed', headerName: 'Durée totale consommée', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'estimatedTotal', headerName: 'Durée estimée totale', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'client.clientName', headerName: 'Client', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'status', headerName: 'Statut', width: 150, headerAlign: 'center', align: 'center' },
    // Autres colonnes...

    {
      field: 'progress',
      headerName: 'Progression',
      width: 400,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <LinearProgress
          variant="determinate"
          value={calculateProgress(row)}
          sx={{ width: '100%', borderRadius: 4 }}
          color={calculateProgress(row) === 100 ? 'success' : 'primary'}
        />
      ),
    },
    {
      field: 'tasks', // Assurez-vous que le backend renvoie les tâches associées au projet
      headerName: 'Tâches',
      width: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        // Logique de rendu pour les tâches
      },
    },
  ];

  return (
    <div style={{ height: 'calc(100vh - 250px)', width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Liste des Projets
      </Typography>
      <Row>
        <Col md={12}>
          <Button onClick={handleOnExport}> Export </Button>
        </Col>
      </Row>

      <DataGrid rows={projects} columns={columns} pageSize={10} checkboxSelection />
    </div>
  );
};

export default Projet;
