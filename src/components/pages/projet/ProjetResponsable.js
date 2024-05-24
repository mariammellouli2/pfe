import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, LinearProgress, Typography, Modal, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Box } from "@mui/material";
import { utils as XLSXUtils, writeFile as writeXLSX } from "xlsx";
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  paper: {
    margin: '24px',
    padding: '24px',
    backgroundColor: 'white',
    boxShadow: 'none',
  },
  table: {
    minWidth: 650,
    backgroundColor: 'white',
  },
  tableHead: {
    backgroundColor: 'white', // Gris pour l'en-tête
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f5f5f5',
    },
  },
  title: {
    marginBottom: '40px',
    color: '#046C92',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    fontFamily: 'Arial, sans-serif',
  },
  buttonContained: {
    backgroundColor: '#046C92',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#035a74',
    },
    marginBottom: '16px',
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '32px',
    borderRadius: '8px',
  },
  closeModalButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
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
        const response = await axios.get("https://localhost:44352/api/Project/name");
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
    { field: "totalConsumed", headerName: "Durée consommée", width: 200, headerAlign: "center", align: "center" },
    { field: "estimatedTotal", headerName: "Durée estimée", width: 200, headerAlign: "center", align: "center" },
    { field: "clientName", headerName: "Client", width: 200, headerAlign: "center", align: "center" , valueGetter: (params) => "Proged"},
    { field: "status", headerName: "Statut", width: 150, headerAlign: "center", align: "center" },
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
          sx={{
            width: "100%",
            borderRadius: 4,
            backgroundColor: calculateProgress(row) < 100 ? '#F07304' : '#A1B848', // Orange for in-progress, green for complete
          }}
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
        <Button
          variant="contained"
          className={classes.buttonContained}
          style={{ backgroundColor: '#046C92', color: 'white' }}
          onClick={() => handleDetailsClick(row.id, row.projectName)}
        >
          Voir détails
        </Button>
      ),
    },
  ];

  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Listes des Projets
      </Typography>
      <Paper className={classes.paper}>
        {loading ? (
          <LinearProgress />
        ) : (
          <DataGrid
            rows={projects}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
          />
        )}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box className={classes.modalBox}>
            <Typography variant="h4" gutterBottom>
              Détails du Projet
            </Typography>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell className={classes.tableHeadCell}>ID Tâche</TableCell>
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
            <IconButton className={classes.closeModalButton} onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
            <Button
              variant="contained"
              onClick={handleOnExport}
              className={classes.buttonContained}
              style={{ backgroundColor: '#046C92', color: 'white' }}
            >
              Exporter en Excel
            </Button>
          </Box>
        </Modal>
      </Paper>
    </>
  );
};

export default Projet;
