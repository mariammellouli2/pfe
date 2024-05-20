import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, LinearProgress, Typography, Modal, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { utils as XLSXUtils, writeFile as writeXLSX } from "xlsx";
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { Box } from "@mui/material";

const useStyles = makeStyles(() => ({
  tableHead: {
    backgroundColor: '#bdbdbd', // Gris pour l'en-tête
  },
  tableHeadCell: {
    color: '#333', // Gris foncé pour le texte de l'en-tête
    fontWeight: 'bold',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f5f5f5', // Gris clair pour les lignes impaires
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#e0e0e0', // Gris moyen pour les lignes paires
    },
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    backgroundColor: '#fafafa', // Gris très clair pour la boîte modale
    boxShadow: '24px', // Correction de la valeur
    padding: 4,
  },
  closeModalButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  buttonContained: {
    backgroundColor: '#1976d2', // Bleu pour les boutons
    color: '#fff',
    '&:hover': {
      backgroundColor: '#115293', // Bleu foncé pour les boutons au survol
    },
  },
}));

const Projet = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("https://localhost:44352/api/Project/GetProjectsWithWorkItems");
        if (response.data && Array.isArray(response.data)) {
          const projectsWithId = response.data.map((project, index) => ({ ...project, id: index + 1 }));
          setProjects(projectsWithId);
        } else {
          console.error("Format de données incorrect : les projets ne sont pas un tableau");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
      } finally {
        setLoading(false);
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

  const fetchWorkItems = async (projectId, projectName) => {
    try {
      const response = await axios.get(`https://localhost:44352/api/Project/GetWorkItems?id=${projectId}&projectName=${encodeURIComponent(projectName)}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des éléments de travail :", error);
      return [];
    }
  };

  const handleDetailsClick = async (projectId, projectName) => {
    setLoading(true);
    const workItems = await fetchWorkItems(projectId, projectName);
    setSelectedProject(projectId);
    setWorkItems(workItems);
    setOpenModal(true);
    setLoading(false);
  };

  const handleOnExport = () => {
    try {
      const selectedRows = workItems.map((workItem) => ({
        ID: workItem.id,
        "Appartenant à": workItem.belongTo,
        "Type de Travail": workItem.workItemType,
        "Titre Devops": workItem.titleDevops,
        "Assigné à": workItem.assignedTo,
        Statut: workItem.state,
        "Description Devops": workItem.descriptionDevops,
        "Estimation d'Origine": workItem.originalEstimate,
      }));
      console.log(selectedRows); // Ajoutez cette ligne pour vérifier les données exportées
      
      const wb = XLSXUtils.book_new();
      const ws = XLSXUtils.json_to_sheet(selectedRows);
      XLSXUtils.book_append_sheet(wb, ws, "MySelectedSheet");
      writeXLSX(wb, "SelectedWorkItems.xlsx");
      console.log("Export successful!");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setWorkItems([]);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100, headerAlign: "center", align: "center" },
    { field: "projectName", headerName: "Nom Projet", width: 250, headerAlign: "center", align: "center" },
    { field: "serviceType", headerName: "Type de prestation", width: 250, headerAlign: "center", align: "center" },
    { field: "totalConsumed", headerName: "Durée consommée", width: 200, headerAlign: "center", align: "center" },
    { field: "estimatedTotal", headerName: "Durée estimée", width: 200, headerAlign: "center", align: "center" },
    { field: "client.clientName", headerName: "Client", width: 200, headerAlign: "center", align: "center" },
    { field: "serviceType", headerName: "Statut", width: 150, headerAlign: "center", align: "center" },
    {
      field: "progress",
      headerName: "Progression",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <LinearProgress
          variant="determinate"
          value={calculateProgress(row)}
          sx={{ width: "100%", borderRadius: 4 }}
          color={calculateProgress(row) === 100 ? "success" : "primary"}
        />
      ),
    },
    {
      field: "details",
      headerName: "Détails",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Button variant="contained" onClick={() => handleDetailsClick(row.id, row.projectName)} className={classes.buttonContained}>Voir les détails</Button>
      ),
    },
  ];

  return (
    <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Liste des Projets
      </Typography>
      <Row>
        <Col md={12}>
          <Button onClick={handleOnExport} className={classes.buttonContained}>Exporter la sélection</Button>
        </Col>
      </Row>
      {loading ? (
        <LinearProgress />
      ) : (
        <DataGrid rows={projects} columns={columns} pageSize={10} checkboxSelection />
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className={classes.modalBox}>
          <Typography variant="h5" gutterBottom>
            Éléments de travail du projet sélectionné
          </Typography>
          {workItems.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell className={classes.tableHeadCell}>ID</TableCell>
                    <TableCell className={classes.tableHeadCell}>Appartenant à</TableCell>
                    <TableCell className={classes.tableHeadCell}>Type de Travail</TableCell>
                    <TableCell className={classes.tableHeadCell}>Titre Devops</TableCell>
                    <TableCell className={classes.tableHeadCell}>Assigné à</TableCell>
                    <TableCell className={classes.tableHeadCell}>Statut</TableCell>
                    <TableCell className={classes.tableHeadCell}>Description Devops</TableCell>
                    <TableCell className={classes.tableHeadCell}>Estimation d'Origine</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workItems.map((workItem) => (
                    <TableRow key={workItem.id} className={classes.tableRow}>
                      <TableCell>{workItem.id}</TableCell>
                      <TableCell>{workItem.belongTo}</TableCell>
                      <TableCell>{workItem.workItemType}</TableCell>
                      <TableCell>{workItem.titleDevops}</TableCell>
                      <TableCell>{workItem.assignedTo}</TableCell>
                      <TableCell>{workItem.state}</TableCell>
                      <TableCell>{workItem.descriptionDevops}</TableCell>
                      <TableCell>{workItem.originalEstimate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Aucun élément de travail à afficher.</Typography>
          )}
          <IconButton onClick={handleCloseModal} className={classes.closeModalButton}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </div>
  );
};

export default Projet;
