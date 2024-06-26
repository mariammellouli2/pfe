import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  TextField,
  Snackbar,
  SnackbarContent,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Chip,
} from "@mui/material";
import { Save, Send, Add } from "@mui/icons-material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import axios from 'axios';

const Feuille = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const theme = useTheme();
  const [remark, setRemark] = useState("");
  const [openAttachmentDialog, setOpenAttachmentDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [openManualTaskDialog, setOpenManualTaskDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [weekStart, setWeekStart] = useState(new Date());
  const [tracages, setTracages] = useState([]);
  const [totalGlobal, setTotalGlobal] = useState(0);
  const [myUserInfo, setMyUserInfo] = useState(null);

  const [days, setDays] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    setMyUserInfo(JSON.parse(localStorage.getItem("currentUser"))); 
    console.log("787-+-878",JSON.parse(localStorage.getItem("currentUser")));
    fetchWorkItems();
  }, []);

  const calc = (obj) => {
    let sum = 0;
    for (let i = 0; i < obj.tracages.length; i++) {
      if (Number(obj.tracages[i].hours)) {
        sum += obj.tracages[i].hours;
      }
    }
    return sum;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm", { locale: fr }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePostData = async () => {
    setLoading(true);
    try {
      const tracages = dataRows.flatMap(row =>
        weekdays.map(day => {
          const dayKey = format(day, "EEEE dd", { locale: fr });
          const hours = row[dayKey] ? parseFloat(row[dayKey]) : 0;
          if (hours > 0) {
            return {
              workItemId: row.workItemId,
              year: day.getFullYear(),
              month: day.getMonth() + 1,
              day: day.getDate(),
              dayName: format(day, "EEEE", { locale: fr }),
              hours: hours
            };
          }
          return null;
        }).filter(entry => entry !== null)
      );

      console.log("tracages", tracages);
      const response = await axios.post('https://localhost:44352/api/Tracages', tracages, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse de l\'API POST:', response.data);
      setShowSuccessMessage(true);
    } catch (error) {
      if (error.response) {
        console.error('Erreur lors de la requête POST:', error.response.data);
      } else if (error.request) {
        console.error('Aucune réponse reçue:', error.request);
      } else {
        console.error('Erreur lors de la configuration de la requête:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkItems = async () => {
    setLoading(true);
    try {
      const accounts = await instance.getAllAccounts();
      if (accounts.length > 0) {
        const email = accounts[0].username;
        const response = await axios.get(`https://localhost:44352/api/WorkItem/withtracages?email=${encodeURIComponent(email)}`);
        const workItems = response.data;
        fetchTracages(workItems, email);
      }
    } catch (error) {
      console.error("Error fetching work items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracages = async (workItems) => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:44352/api/Tracages');
      const tracages = response.data;

      let total = 0;
      const data = workItems.map((item, key) => {
        const workItemsEntries = tracages.filter(tracage => tracage.workItemId === item.id);

        const hoursEntries = workItemsEntries.reduce((acc, tracage) => {
          const dayKey = format(new Date(tracage.year, tracage.month - 1, tracage.day), "EEEE dd", { locale: fr });
          acc[dayKey] = tracage.hours;
          return acc;
        }, {});

        total += calc(item);

        return {
          ...item,
          id: key,
          workItemId: item.id,
          ...hoursEntries,
          total: calc(item),
        };
      });

      setDataRows(data);
      setTotalGlobal(total);
    } catch (error) {
      console.error("Error fetching tracages:", error);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  ).filter((day) => day.getDay() !== 0 && day.getDay() !== 6);
  const dayLabels = weekdays.map((day) =>
    format(day, "EEEE dd", { locale: fr })
  );
  const [taskDetails, setTaskDetails] = useState({
    TitleDevops: "",
    BelongTo: "",
    DescriptionDevops: "",
    OriginalEstimate: "",
    Client: "",
    State: "Nouveau",
    Facturable: false,
    AssignedTo: myUserInfo?.email || "", 
  });

  useEffect(() => {
    localStorage.setItem("feuilleDataRows", JSON.stringify(dataRows));
  }, []);

  const currentDateFormatted = format(new Date(), "EEEE, dd MMMM yyyy", { locale: fr });

  const handlePreviousWeek = () => {
    setWeekStart((currentWeekStart) => addWeeks(currentWeekStart, -1));
  };

  const handleNextWeek = () => {
    setWeekStart((currentWeekStart) => addWeeks(currentWeekStart, 1));
  };

  const handleHourChange = (event, id, day) => {
    const { value } = event.target;
    if (parseFloat(value) >= 0 || value === "") {
      const updatedRows = dataRows.map((row) => {
        if (row.id === id) {
          return { ...row, [day]: value };
        }
        return row;
      });
      setDataRows(updatedRows);
    }
  };

  const handleTaskDetailsChange = (event) => {
    const { name, value } = event.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFacturableTaskChange = (event) => {
    const { checked } = event.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      Facturable: checked,
    }));
  };

  const handleStatusChange = (event, id) => {
    const { value } = event.target;
    const updatedRows = dataRows.map((row) => {
      if (row.id === id) {
        return { ...row, state: value };
      }
      return row;
    });
    setDataRows(updatedRows);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenAddTaskDialog = () => {
    setOpenAddTaskDialog(true);
  };

  const handleCloseAddTaskDialog = () => {
    setOpenAddTaskDialog(false);
  };

  const handleOpenManualTaskDialog = () => {
    setOpenManualTaskDialog(true);
  };

  const handleCloseManualTaskDialog = () => {
    setOpenManualTaskDialog(false);
  };

  const handleOpenAttachmentDialog = (rowId) => {
    setSelectedRowId(rowId);
    setOpenAttachmentDialog(true);
  };

  const handleCloseAttachmentDialog = () => {
    setOpenAttachmentDialog(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAddAttachment = () => {
    if (selectedFile && selectedRowId !== null) {
      const updatedRows = dataRows.map(row => {
        if (row.id === selectedRowId) {
          return { ...row, attachment: selectedFile.name, remark: remark };
        }
        return row;
      });
      setDataRows(updatedRows);
    }
    setSelectedFile(null);
    setRemark("");
    handleCloseAttachmentDialog();
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setOpenAddTaskDialog(false);
    if (method === "saisie") {
      handleOpenManualTaskDialog();
    }
  };

  const showSuccessSnackbar = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleSendTimesheet = async () => {
    setLoading(true);
    try {
      const accounts = await instance.getAllAccounts();
      const email = accounts.length > 0 ? accounts[0].username : '';
      const dateFeuille = new Date();

      const tracages = dataRows.flatMap(row =>
        weekdays.map(day => {
          const dayKey = format(day, "EEEE dd", { locale: fr });
          const hours = row[dayKey] ? parseFloat(row[dayKey]) : 0;
          if (hours > 0) {
            return {
              workItemId: row.workItemId,
              year: day.getFullYear(),
              month: day.getMonth() + 1,
              day: day.getDate(),
              dayName: format(day, "EEEE", { locale: fr }),
              hours: hours
            };
          }
          return null;
        }).filter(entry => entry !== null)
      );

      const timesheet = {
        dateFeuille: dateFeuille.toISOString(),
        dateEnvoie: dateFeuille.toISOString(),
        statut: 'Nouveau',
        email: email,
        validatedBy: null,
        tracages: tracages
      };

      const response = await axios.post('https://localhost:44352/api/Timesheet/create', timesheet, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse de l\'API POST:', response.data);
      setShowSuccessMessage(true);
    } catch (error) {
      if (error.response) {
        console.error('Erreur lors de la requête POST:', error.response.data);
      } else if (error.request) {
        console.error('Aucune réponse reçue:', error.request);
      } else {
        console.error('Erreur lors de la configuration de la requête:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimesheet = async (timesheetId) => {
    try {
      await axios.delete(`https://localhost:44352/api/WorkItem/${timesheetId}`);
      console.log(`Timesheet avec l'ID ${timesheetId} a été supprimé.`);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const handleAddTaskManually = async () => {
    console.log("Adding task manually:", taskDetails);
    try {
      const response = await axios.post('https://localhost:44352/api/WorkItem', taskDetails, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Task added successfully:', response.data);

      const newTask = {
        ...taskDetails,
        id: dataRows.length,
        workItemId: response.data.id,
        total: 0,
        AssignedTo: myUserInfo.email, 
      };
      setDataRows([...dataRows, newTask]);

      handleCloseAddTaskDialog();
    } catch (error) {
      console.error('Error adding task:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  const handleFacturableChange = (event, id) => {
    const { value } = event.target;
    const updatedRows = dataRows.map((row) => {
      if (row.id === id) {
        return { ...row, facturable: value };
      }
      return row;
    });
    setDataRows(updatedRows);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Nouveau":
        return <Chip label="Nouveau" style={styles.chipNew} />;
      case "A Faire":
        return <Chip label="A Faire" style={styles.chipToDo} />;
      case "En Cours":
        return <Chip label="En Cours" style={styles.chipDoing} />;
      case "Terminée":
        return <Chip label="Terminée" style={styles.chipTerminated} />;
      case "Removed":
        return <Chip label="Removed" style={styles.chipRemoved} />;
      default:
        return <Chip label={status} />;
    }
  };

  const getFacturableChip = (facturable) => {
    switch (facturable) {
      case "Facturable":
        return <Chip label="Facturable" style={styles.chipFacturable} />;
      case "Non Facturable":
        return <Chip label="Non Facturable" style={styles.chipNonFacturable} />;
      default:
        return <Chip label={facturable} />;
    }
  };

  const columns = [
    {
      field: "titleDevops",
      headerName: "Tâche",
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
    },
    {
      field: "belongTo",
      headerName: "Projet",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>{params.value}</Typography>
          {params.row.taches &&
            params.row.taches.map((task) => (
              <Typography key={task}>{task}</Typography>
            ))}
          {params.row.attachment && (
            <a
              href={params.row.attachment}
              target="_blank"
              rel="noopener noreferrer"
            >
              {params.row.attachment}
            </a>
          )}
        </div>
      ),
    },
    {
      field: "clientName",
      headerName: "Client",
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
      valueGetter: (params) => "Proged"
    },
    {
      field: "descriptionDevops",
      headerName: "Prestation",
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
    },
    {
      field: "facturable",
      headerName: "Type prestation",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Type prestation</InputLabel>
          <Select
          defaultValue=''
            value={params.value || "Facturable"}
            onChange={(event) => handleFacturableChange(event, params.row.id)}
            fullWidth
            renderValue={(value) => getFacturableChip(value)}
          >
            <MenuItem value="Non Facturable">Non Facturable</MenuItem>
            <MenuItem value="Facturable">Facturable</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: "source",
      headerName: "Source",
      width: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
     
    },
    {
      field: "state",
      headerName: "Statut",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Statut</InputLabel>
          <Select
            defaultValue=""
            value={params.value || "Nouveau"}
            onChange={(event) => handleStatusChange(event, params.row.id)}
            fullWidth
            renderValue={(value) => getStatusChip(value)}
          >
            <MenuItem value="New">Nouveau</MenuItem>
            <MenuItem value="A Faire">A Faire</MenuItem>
            <MenuItem value="En Cours">En Cours</MenuItem>
            <MenuItem value="Terminée">Terminé</MenuItem>
            <MenuItem style={{display: "none"}} value="Terminé">Terminé</MenuItem>
            <MenuItem value="Removed">Removed</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: "originalEstimate",
      headerName: "Estimée",
      width: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: 'custom-header',
    },
    {
      field: "back",
      headerName: "Précédent",
      renderHeader: () => (
        <IconButton style={{ color: theme.palette.text.primary }} onClick={handlePreviousWeek}>
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
      ),
      width: 80,
      sortable: false,
      headerClassName: 'custom-header',
    },
  ];

  weekdays.forEach((day) => {
    const dayName = format(day, "EEEE dd", { locale: fr });
    columns.push({
      field: dayName,
      headerName: dayName,
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: "5px", borderRadius: "4px", padding: "4px" }}>
          <input
            type="number"
            value={params.row[dayName] || ""}
            onChange={(event) => handleHourChange(event, params.row.id, dayName)}
            style={{ width: "50px", padding: "0px", fontSize: "14px", border: "1px solid", borderColor: theme.palette.text.primary, outline: "none", color: theme.palette.text.primary, backgroundColor: theme.palette.background.default }}
          />
          <IconButton onClick={() => handleOpenAttachmentDialog(params.row.id)}>
            <InfoTwoToneIcon style={{ color: "grey" }} />
          </IconButton>
        </div>
      ),
    });
  });

  columns.push({
    field: "next",
    headerName: "Suivant",
    renderHeader: () => (
      <IconButton onClick={handleNextWeek} style={{ color: theme.palette.text.primary }}>
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
        <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px' }}>
          Timesheet envoyé avec succès !
        </div>
      )}
      <div style={styles.container(theme)}>
        <Typography variant="h6" align="center" style={{ marginBottom: "20px" }}>
          Time Sheet - {myUserInfo?.name} - {currentDateFormatted} - {currentTime}
        </Typography>
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
        <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
          <DataGrid
            rows={dataRows}
            columns={columns}
            pageSize={10}
            checkboxSelection
            getRowId={(row) => row.id}
            components={{
              Toolbar: () => (
                <Toolbar style={{ justifyContent: "flex-end" }}>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                    Total Global: {totalGlobal}
                  </span>
                  <IconButton color="primary" onClick={handlePostData}>
                    <Save style={{ color: "#494A4A" }} />
                  </IconButton>
                  <IconButton color="primary" onClick={handleSendTimesheet}>
                    <Send style={{ color: "#494A4A" }} />
                  </IconButton>
                  <IconButton color="primary" onClick={() => setOpenAddTaskDialog(true)}>
                    <Add />
                  </IconButton>
                </Toolbar>
              ),
            }}
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
        <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog}>
          <DialogTitle>Ajouter une tâche</DialogTitle>
          <DialogContent>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
              <Tab label="Saisie manuelle" />
            </Tabs>
            {selectedTab === 0 && (
              <div>
                <TextField
                  margin="dense"
                  label="Titre Devops"
                  fullWidth
                  name="TitleDevops"
                  value={taskDetails.TitleDevops}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Projet"
                  fullWidth
                  name="BelongTo"
                  value={taskDetails.BelongTo}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Description"
                  fullWidth
                  name="DescriptionDevops"
                  value={taskDetails.DescriptionDevops}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Durée estimée"
                  fullWidth
                  name="OriginalEstimate"
                  value={taskDetails.OriginalEstimate}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Client"
                  fullWidth
                  name="Client"
                  value={taskDetails.Client}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Statut"
                  fullWidth
                  name="State"
                  value={taskDetails.State}
                  onChange={handleTaskDetailsChange}
                />
                
                
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddTaskDialog} sx={{ backgroundColor: '#046C92', color: 'white' }}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddTaskManually} 
              color="primary"
              sx={{ backgroundColor: '#046C92', color: 'white' }}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAttachmentDialog} onClose={handleCloseAttachmentDialog}>
          <DialogTitle>Ajouter une pièce jointe et une remarque</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Remarque"
              fullWidth
              value={remark}
              onChange={(event) => setRemark(event.target.value)}
            />
            <input
              type="file"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAttachmentDialog}>Annuler</Button>
            <Button onClick={handleAddAttachment} color="primary">
              Ajouter
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
  chipNew: {
    backgroundColor: "#E0F7FA",
    color: "#036B91",
  },
  chipToDo: {
    backgroundColor: "#FFF3E0",
    color: "#EF7304",
  },
  chipDoing: {
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
  },
  chipTerminated: {
    backgroundColor: "#E8F5E9",
    color: "#A1B848",
  },
  chipRemoved: {
    backgroundColor: "#FFEBEE",
    color: "#D32F2F",
  },
  chipFacturable: {
    backgroundColor: "#E8F5E9",
    color: "#A1B848",
  },
  chipNonFacturable: {
    backgroundColor: "#FFF3E0",
    color: "#EF7304",
  },
};

export default Feuille;
