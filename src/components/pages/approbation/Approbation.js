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
  IconButton,
  Box,
  Modal
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  paper: {
    margin: '24px',
    padding: '24px',
    backgroundColor: 'white',
    boxShadow: 'none',
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
  buttonPrimary: {
    backgroundColor: '#A1B848',
    color: 'white',
    '&:hover': {
      backgroundColor: '#8a9e3b',
    },
  },
  buttonSecondary: {
    backgroundColor: '#F07304',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c36203',
    },
  },
  dialogTitle: {
    backgroundColor: '#399BBD',
    color: 'white',
  },
  dialogContent: {
    backgroundColor: '#f5f5f5',
  },
  dialogActions: {
    backgroundColor: '#f5f5f5',
  },
}));

const ApprobationTimesheetCollaborateur = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [comment, setComment] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();

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
    navigate('/feuille/details')
    // setSelectedTimesheet(timesheet);
    // try {
    //   const response = await axios.get(
    //     `https://localhost:44352/api/Timesheet/GetTimesheet?id=${timesheet.timesheetId}&email=${encodeURIComponent(timesheet.UserId)}`
    //   );
    //   setSelectedTimesheet({
    //     ...response.data,
    //     consommation: response.data.TotalConsumed,
    //   });
    //   setOpenDetails(true);
    // } catch (error) {
    //   setError("Erreur lors de la récupération des détails du timesheet");
    //   console.error("Erreur lors de la récupération des détails du timesheet :", error);
    // }
  };

  const handleAccept = async () => {
    console.log("Timesheet accepté");
  };

  const handleReject = async () => {
    console.log("Timesheet refusé");
    setShowCommentField(true);
  };

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleCommentSubmit = () => {
    console.log("Commentaire soumis :", comment);
    setShowCommentField(false);
    setComment("");
  };

  const handleCloseComment = () => {
    setShowCommentField(false);
  };
  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Liste des Timesheets à Approuver
      </Typography>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="centre">Id feuille</TableCell>
                <TableCell>Date de la feuille</TableCell>
                <TableCell>Date d'envoi</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell >Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.timesheetId}>
                  <TableCell>{timesheet.timesheetId}</TableCell>
                  <TableCell>{timesheet.dateFeuille}</TableCell>
                  <TableCell>{timesheet.dateEnvoie}</TableCell>
                  <TableCell>{timesheet.statut}</TableCell>
                  <TableCell>{timesheet.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={classes.buttonContained}
                      style={{ backgroundColor: '#046C92', color: 'white' }}
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
        <Modal open={openDetails} onClose={() => setOpenDetails(false)}>
          <Box className={classes.modalBox}>
            <Typography variant="h4" gutterBottom>
              Détails du Timesheet
            </Typography>
            <TableContainer>
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
                    <TableCell>Tracages</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedTimesheet?.workItems?.map((task) => (
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
                      <TableCell>
                        {task.tracages.map((tracage) => (
                          <div key={tracage.id}>
                            {tracage.date} - {tracage.hours} hours
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog open={showCommentField} onClose={handleCloseComment}>
              <DialogTitle className={classes.dialogTitle}>Ajouter un commentaire</DialogTitle>
              <DialogContent className={classes.dialogContent}>
                <TextField
                  label="Commentaire"
                  fullWidth
                  variant="outlined"
                  value={comment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                />
              </DialogContent>
              <DialogActions className={classes.dialogActions}>
                <Button onClick={handleCloseComment} color="secondary" variant="contained">
                  Annuler
                </Button>
                <Button onClick={handleCommentSubmit} color="primary" variant="contained">
                  Soumettre
                </Button>
              </DialogActions>
            </Dialog>
            <IconButton className={classes.closeModalButton} onClick={() => setOpenDetails(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Modal>
        <Dialog open={error !== null} onClose={() => setError(null)}>
          <DialogTitle className={classes.dialogTitle}>Erreur</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Typography>{error}</Typography>
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={() => setError(null)} color="primary" variant="contained">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default ApprobationTimesheetCollaborateur;