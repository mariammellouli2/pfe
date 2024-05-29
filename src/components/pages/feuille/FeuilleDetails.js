import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  TextField,
  Snackbar,
  SnackbarContent,
  Box,
} from "@mui/material";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const FeuilleDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { timesheetId, userId } = useParams();

  const [comment, setComment] = useState("");
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [totalGlobal, setTotalGlobal] = useState(0);
  const [myUserInfo, setMyUserInfo] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setMyUserInfo(JSON.parse(currentUser));
    }
    fetchTimesheetDetails();
    setUserRole(localStorage.getItem("role"));
  }, [timesheetId, userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm", { locale: fr }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTimesheetDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:44352/api/Timesheet/GetTimesheet?id=${timesheetId}&userId=${userId}`);
      const timesheet = response.data;
      if (timesheet && timesheet.tracages) {
        const workItems = timesheet.tracages.map((tracage, index) => ({
          ...tracage.workItem,
          id: index,
          tracages: [tracage]
        }));

        setDataRows(workItems);
        setTotalGlobal(calcTotal(workItems));
      }
    } catch (error) {
      console.error("Error fetching timesheet details:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcTotal = (workItems) => {
    return workItems.reduce((total, item) => {
      return total + (item.tracages ? item.tracages.reduce((sum, tracage) => sum + tracage.hours, 0) : 0);
    }, 0);
  };

  const handlePreviousWeek = () => {
    setWeekStart((currentWeekStart) => addWeeks(currentWeekStart, -1));
  };

  const handleNextWeek = () => {
    setWeekStart((currentWeekStart) => addWeeks(currentWeekStart, 1));
  };

  const handleStatusChange = async (status, comment, userId, timesheetId) => {
    console.log({timesheetId})
    if (!userId) {
      console.error('UserId est requis.');
      return;
    }

    if (status === 'Rejected' && !comment) {
      console.error('Comment est requis pour le refus.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`https://localhost:44352/api/Timesheet/UpdateStatus`, {
        timesheetId: timesheetId,
        status: status,
        comment: comment,
        userId: userId
      });

      if (response.status === 200) {
        console.log(`Timesheet ${timesheetId} status updated to ${status}`);

        const messageContent = status === 'Accepted'
          ? 'Votre timesheet a été accepté.'
          : `Votre timesheet a été refusé. Commentaire : ${comment || 'Aucun commentaire'}`;

        console.log('Message de notification généré:', messageContent);

        if (userRole === 'responsable') {
          console.log("yeahh")
          await axios.post(`https://localhost:44352/api/Notification`, {
            id: "1",
            content: messageContent,
            recipient: "collaborateur"
          });
        }

        setShowSuccessMessage(true);
        navigate("/approbation/Responsable");
      } else {
        console.error('Réponse inattendue:', response);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Erreur de validation:', error.response.data.errors);
      } else {
        console.error('Erreur lors de la mise à jour du statut du timesheet:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    handleStatusChange('Accepted', 'cha7 ba7', userId, timesheetId);
  };

  const handleAnuule = () => {
    navigate(-1);
    console.log('Bouton Annuler cliqué !');
};
  const handleReject = () => {
    setOpenCommentDialog(true);
  };

  const handleCommentSubmit = () => {
    handleStatusChange('Rejected', comment, userId, timesheetId);
    setOpenCommentDialog(false);
    setComment("");
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
  };

  const columns = [
    { field: "titleDevops", headerName: "Tâche", width: 150, align: "center", headerAlign: "center" },
    { field: "belongTo", headerName: "Projet", width: 150, align: "center", headerAlign: "center" },
    { field: "clientName", headerName: "Client", width: 150, align: "center", headerAlign: "center", valueGetter: () => "Proged" },
    { field: "descriptionDevops", headerName: "Prestation", width: 150, align: "center", headerAlign: "center" },
    { field: "facturable", headerName: "Type prestation", width: 150, align: "center", headerAlign: "center" },
    { field: "source", headerName: "Source", width: 150, align: "center", headerAlign: "center", valueGetter: () => "devops" },
    { field: "state", headerName: "Statut", width: 150, align: "center", headerAlign: "center" },
    { field: "originalEstimate", headerName: "Estimée", width: 150, align: "center", headerAlign: "center" },
    { field: "total", headerName: "Total", width: 150, align: "center", headerAlign: "center" },
    {
      field: "back",
      headerName: "Précédent",
      renderHeader: () => (
        <IconButton style={{ color: "black" }} onClick={handlePreviousWeek}>
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
      ),
      width: 80,
      sortable: false,
      headerClassName: 'custom-header',
    },
  ];

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  ).filter((day) => day.getDay() !== 0 && day.getDay() !== 6);
  const dayLabels = weekdays.map((day) =>
    format(day, "EEEE dd", { locale: fr })
  );

  dayLabels.forEach((day) => {
    columns.push({
      field: day,
      headerName: day,
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography>
          {params.row.tracages.find(tracage => format(new Date(tracage.year, tracage.month - 1, tracage.day), "EEEE dd", { locale: fr }) === day)?.hours || ""}
        </Typography>
      ),
    });
  });

  columns.push({
    field: "next",
    headerName: "Suivant",
    renderHeader: () => (
      <IconButton onClick={handleNextWeek} style={{ color: "black" }}>
        <KeyboardDoubleArrowRightIcon />
      </IconButton>
    ),
    width: 100,
    sortable: false,
    headerClassName: 'custom-header',
  });

  return (
    <>
      {showSuccessMessage && (
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={3000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SnackbarContent
            message="Opération réussie !"
            style={{ backgroundColor: 'green', color: 'white' }}
          />
        </Snackbar>
      )}
      <div style={styles.container(theme)}>
        <Typography variant="h6" align="center" style={{ marginBottom: "20px" }}>
          Time Sheet details - {format(new Date(), "EEEE, dd MMMM yyyy", { locale: fr })} - {currentTime}
        </Typography>
        <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
          <DataGrid
            rows={dataRows}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.id}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
                color: theme.palette.text.primary,
              },
            }}
          />
        </div>
        <Box display="flex" justifyContent="flex-start" mt={2}>
          <Button
            variant="contained"
            color="primary"
            style={styles.button}
            onClick={handleAccept}
          >
            Accepter
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={styles.button}
            onClick={handleReject}
          >
            Refuser
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={styles.button}
            onClick={handleAnuule}
          >
            Annuler 
          </Button>
        </Box>
        <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog}>
          <DialogTitle>Ajouter un commentaire</DialogTitle>
          <DialogContent>
            <TextField
              label="Commentaire"
              fullWidth
              variant="outlined"
              value={comment}
              onChange={handleCommentChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCommentDialog} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleCommentSubmit} color="primary">
              Soumettre
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

const styles = {
  container: (theme) => ({
    fontFamily: "Arial, sans-serif",
    margin: "20px",
    padding: "20px",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }),
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "20px",
  },
  button: {
    marginLeft: "10px",
    backgroundColor: '#046C92',
    color: 'white',
  },
};

export default FeuilleDetails;
