import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
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
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  paper: {
    margin: "24px",
    padding: "24px",
    backgroundColor: "white",
    boxShadow: "none",
  },
  title: {
    marginBottom: "40px",
    color: "#046C92",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    fontFamily: "Arial, sans-serif",
  },
  buttonContained: {
    backgroundColor: "#046C92",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#035a74",
    },
    marginBottom: "16px",
  },
  dialogTitle: {
    backgroundColor: "#399BBD",
    color: "white",
  },
  dialogContent: {
    backgroundColor: "#f5f5f5",
  },
  dialogActions: {
    backgroundColor: "#f5f5f5",
  },
}));

const ApprobationTimesheetCollaborateur = () => {
  const [timesheets, setTimesheets] = useState([]);
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

  const handleDetailClick = (timesheet) => {
    navigate(`/feuille/details/${timesheet.timesheetId}/${timesheet.userId}`);
  };

  const handleAccept = async () => {
    console.log("Timesheet accepté");
  };

  const handleReject = async () => {
    console.log("Timesheet refusé");
    setShowCommentField(true);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Id feuille</TableCell>
                <TableCell>Date de la feuille</TableCell>
                <TableCell>Date d'envoi</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.timesheetId}>
                  <TableCell>{timesheet.timesheetId}</TableCell>
                  <TableCell>
                    {format(new Date(timesheet.dateFeuille), "MM/yyyy")}
                  </TableCell>
                  <TableCell>{timesheet.dateEnvoie}</TableCell>
                  <TableCell>{timesheet.statut}</TableCell>
                  <TableCell>{timesheet.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={classes.buttonContained}
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
        <Dialog open={showCommentField} onClose={handleCloseComment}>
          <DialogTitle className={classes.dialogTitle}>Ajouter un commentaire</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <TextField
              label="Commentaire"
              fullWidth
              variant="outlined"
              value={comment}
              onChange={handleCommentChange}
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
        <Dialog open={!!error} onClose={() => setError(null)}>
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
