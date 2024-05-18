import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles"; // Ajout de l'import pour makeStyles

const useStyles = makeStyles(() => ({
  paper: {
    margin: '24px',
    padding: '24px',
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: '#bdbdbd', // Gris pour l'en-tête
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
    marginBottom: '24px',
  },
}));

const ApprobationTimesheetCollaborateur = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [comment, setComment] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);
  const [error, setError] = useState(null); // Définir l'état error
  const classes = useStyles();

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await axios.get("https://localhost:44352/api/Timesheet");
        setTimesheets(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des timesheets");
        console.error("Erreur lors de la récupération des timesheets :", error);
      }
    };

    fetchTimesheets();
  }, []);

  const handleDetailClick = async (timesheet) => {
    setSelectedTimesheet(timesheet);
    try {
      const response = await axios.get(
        `https://localhost:44352/api/Timesheet/${timesheet.timesheetId}?email=${timesheet.email}`
      );
      setSelectedTimesheet({
        ...response.data,
        consommation: response.data.TotalConsumed,
      });
      setOpenDetails(true);
    } catch (error) {
      setError("Erreur lors de la récupération des détails du timesheet");
      console.error(
        "Erreur lors de la récupération des détails du timesheet :",
        error
      );
    }
  };

  const handleAccept = async () => {
    // Logique pour accepter le timesheet
    console.log("Timesheet accepté");
  };

  const handleReject = async () => {
    // Logique pour refuser le timesheet
    console.log("Timesheet refusé");
    setShowCommentField(true); // Affiche le champ de commentaire
  };

  const handleCommentChange = (value) => {
    setComment(value); // Mettre à jour le commentaire
  };

  const handleCommentSubmit = () => {
    // Logique pour soumettre le commentaire
    console.log("Commentaire soumis :", comment);
    setShowCommentField(false); // Cache le champ de commentaire
    setComment(""); // Efface le commentaire après soumission
  };

  const handleCloseComment = () => {
    setShowCommentField(false); // Cache le champ de commentaire
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom className={classes.title}>
        Liste des Timesheets à Approuver
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Id feuille</TableCell>
              <TableCell>Date de la feuille</TableCell>
              <TableCell>Date d'envoi</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Email</TableCell>
          
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timesheets.map((timesheet) => (
              <TableRow key={timesheet.timesheetId} className={classes.tableRow}>
                <TableCell>{timesheet.timesheetId}</TableCell>
                <TableCell>{timesheet.dateFeuille}</TableCell>
                <TableCell>{timesheet.dateEnvoie}</TableCell>
                <TableCell>{timesheet.statut}</TableCell>
                <TableCell>{timesheet.email}</TableCell>
              
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDetailClick(timesheet)}
                  >
                    Voir détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Détails du Timesheet</DialogTitle>
        <DialogContent dividers>
          {/* Autres en-têtes */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Tâche</TableCell>
                  <TableCell>Belong To</TableCell>
                  <TableCell>Work Item Type</TableCell>
                  <TableCell>Title Devops</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Description Devops</TableCell>
                  <TableCell>Original Estimate</TableCell>
                  <TableCell>Consomee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTimesheet?.workItems.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.belongTo}</TableCell>
                    <TableCell>{task.workItemType}</TableCell>
                    <TableCell>{task.titleDevops}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>{task.state}</TableCell>
                    <TableCell>{task.descriptionDevops}</TableCell>
                    <TableCell>{task.originalEstimate}</TableCell>
                    <TableCell>{task.consomee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleAccept}>
            Accepter
          </Button>
          <Button variant="contained" color="secondary" onClick={handleReject}>
            Refuser
          </Button>
          <Button variant="contained" onClick={() => setOpenDetails(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      {/* Champ de commentaire séparé */}
      <Dialog
        open={showCommentField}
        onClose={handleCloseComment}
        maxWidth="md" // Taille de la boîte de dialogue
        fullWidth
      >
        <DialogTitle>Ajouter un commentaire</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={8} // Augmentation du nombre de lignes
            fullWidth
            variant="outlined"
            placeholder="Ajouter un commentaire"
            value={comment} // Utilisation de la valeur du commentaire
            onChange={(e) => handleCommentChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
            Soumettre
          </Button>
          <Button variant="contained" onClick={handleCloseComment}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApprobationTimesheetCollaborateur;
