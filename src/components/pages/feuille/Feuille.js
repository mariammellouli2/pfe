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
} from "@mui/material";
import { Save, Send, Delete, Add } from "@mui/icons-material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { grey } from "@mui/material/colors";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import axios from 'axios';

const Feuille = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [remark, setRemark] = useState("");
  const theme = useTheme();
  const [openAttachmentDialog, setOpenAttachmentDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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
  const [days, setDays] = useState([])
  

  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    fetchWorkItems();
    console.log("you are  ?")

  }, []);



  const calc = (obj) => {
    console.log("hi there", obj);
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
      setCurrentTime(new Date().toLocaleTimeString());
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
            workItemId: row.id,
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

const flattenObject = (obj, nestedKey) => {
  // Create a new object to hold the flattened properties
  const flatObj = {};

  // Iterate over the properties of the original object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // If the key is the nested key, spread its properties into the flat object
      if (key === nestedKey) {
        Object.assign(flatObj, obj[key]);
      } else {
        // Otherwise, copy the property as is
        flatObj[key] = obj[key];
      }
    }
  }

  return flatObj;
};

const fetchWorkItems = async () => {
  setLoading(true);
  try {
    const accounts = await instance.getAllAccounts();
    if (accounts.length > 0) {
      const email = accounts[0].username;
      const response = await axios.get(`https://localhost:44352/api/WorkItem/withtracages?email=${encodeURIComponent(email)}`);
      const workItems = response.data;
      fetchTracages(workItems, email); // pass email as an argument
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
      const response = await axios.get(`https://localhost:44352/api/Tracages`);

      const tracages = response.data;
      console.log("Tracssssage  s+-+:",workItems);
      let total = 0;
      const data = workItems?.map((item, key) => {
        const workItemsEntries = workItems.filter((tracage) => tracage.workItemId === item.id);
        const hoursEntries = tracages.reduce((acc, tracage) => {
          const dayKey = format(new Date(tracage.year, tracage.month - 1, tracage.day), "EEEE dd", { locale: fr });
          acc[dayKey] = tracage.hours;
          return acc;
        }, {});

        console.table("the ITEM : ", item)
        total += calc(item);
        return {
          ...item,
          id: key,
          ...hoursEntries,
          total: calc(item),
        };
      });
      console.log("-+-aaa+-+",data);
      // for (let index = 0; index < data?.length; index++) {
      //   const element = data[index];
      //   data[index]= flattenObject(element,"workItem");
      // }
      console.log("-+-no plz+-+",data);
  
      setDataRows(data);
      setTotalGlobal(total);
    } catch (error) {
      console.error("Error fetching tracages:", error);
    } finally {
      setLoading(false);
    }
  };




  // const calculateTotal1 = (hoursEntries) => {
  //   console.log("787878---",hoursEntries)
  //   return Object.values(hoursEntries).reduce((acc, hours) => acc + (parseFloat(hours) || 0), 0);
  // };



  const weekdays = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  ).filter((day) => day.getDay() !== 0 && day.getDay() !== 6);
  const dayLabels = weekdays.map((day) =>
    format(day, "EEEE dd", { locale: fr })
  );
  const [taskDetails, setTaskDetails] = useState({
    Projet: "",
    Prestation: "",
    Durée_estimée: "",
    Client: "",
    Pieces_jointes: "",
    Facturable: "Non Facturable",
  });

  useEffect(() => {
    setUserName("Admin");
    const intervalId = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setCurrentTime(currentTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    localStorage.setItem("feuilleDataRows", JSON.stringify(dataRows));
    console.log("jjjjj", dataRows)
  }, [dataRows]);

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePreviousWeek = () => {
    setWeekStart((currentWeekStart) => addWeeks(currentWeekStart, -1));
  };

  const handleNextWeek = () => {
    setWeekStart((currentWeekStart) => addWeeks(currentWeekStart, 1));
  };

  // const handlePrestationChange = (event, id) => {
  //   const { value } = event.target;
  //   const updatedRows = dataRows.map((row) => {
  //     if (row.id === id) {
  //       return { ...row, workItemType: value };
  //     }
  //     return row;
  //   });
  //   setDataRows(updatedRows);
  // };

   const handleHourChange = (event, id, day) => {
  const { value } = event.target;
  let totals = 0;
     if (parseFloat(value) >= 0 || value === "") {
       const updatedRows = dataRows.map((row) => {
         if (row.id === id) {
           const newData = { ...row, [day]: value };
          //  const total1 = calculateTotal1(newData);
          //  console.log("ll", total1);
          //  totals+= total1;
           return { ...newData,
            //  total1
             };
        }
         return row;
      });
       setDataRows(updatedRows);
      //setTotalGlobal(prev =>prev + totals);
    }
   };

  const handleTaskDetailsChange = (event) => {
    const { name, value } = event.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
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

  // const handleAddRow = () => {
  //   const newRow = {
  //     id: dataRows.length + 1, // Add id property
  //     belongTo: "",
  //     workItemType: "",
  //     titleDevops: "",
  //     assignedTo: "",
  //     state: "",
  //     descriptionDevops: "",
  //     originalEstimate: 0,
  //     status: "",
  //     facturable: false,
  //     pathPieceJointe: "",
  //     consomee: 0,
  //     total1: 0,
  //   };
  //   setDataRows([...dataRows, newRow]);
  // };

  const saveWorkHours = async (tracageData) => {
    try {
      const response = await axios.post('https://localhost:44352/api/Tracages', tracageData);
      console.log('Data saved successfully:', response.data);
      // Handle successful save (e.g., update state, show success message)
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle error (e.g., show error message)
    }
  };
  // const handleAddTask = (id) => {
  //   const updatedRows = dataRows.map((row) => {
  //     if (row.id === id) {
  //       const taskCount = row.tracages ? row.tracages.length : 0;
  //       const newTask = `Tâche ${taskCount + 1}`;
  //       const updatedTaches = row.tracages ? [...row.tracages, newTask] : [newTask];
  //       return { ...row, tracages: updatedTaches };
  //     }
  //     return row;
  //   });
  //   setDataRows(updatedRows);
  // };

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

  const handleOpenAttachmentDialog = () => {
    setOpenAttachmentDialog(true);
  };

  const handleCloseAttachmentDialog = () => {
    setOpenAttachmentDialog(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAddAttachment = () => {
    console.log("Fichier sélectionné :", selectedFile);
    setSelectedFile(null);
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

  const handleDeleteTimesheet = () => {
    console.log("Suppression de la timesheet...");
    showSuccessSnackbar();
  };

  // const handleSendTimesheet = async () => {
  //   setLoading(true);
  //   try {
  //     const accounts = await instance.getAllAccounts();
  //     const email = accounts.length > 0 ? accounts[0].username : '';
  //     const dateFeuille = new Date();
  //     const tracages = dataRows.flatMap(row =>
  //       weekdays.map(day => {
  //         const dayKey = format(day, "EEEE dd", { locale: fr });
  //         const hours = row[dayKey] ? parseFloat(row[dayKey]) : 0;
  //         if (hours > 0) {
  //           return {
  //             workItemId: row.id,
  //             year: day.getFullYear(),
  //             month: day.getMonth() + 1,
  //             day: day.getDate(),
  //             dayName: format(day, "EEEE", { locale: fr }),
  //             hours: hours
  //           };
  //         }
  //         return null;
  //       }).filter(entry => entry !== null)
  //     );
  
  //     const timesheet = {
  //       dateFeuille: dateFeuille,
  //       dateEnvoie: dateFeuille,
  //       statut: 'New',
  //       email: email,
  //       validatedBy: null,
  //       tracages: tracages
  //     };
  
  //     const response = await axios.post('https://localhost:44352/api/Timesheets/create', timesheet, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     console.log('Réponse de l\'API POST:', response.data);
  //     setShowSuccessMessage(true);
  //   } catch (error) {
  //     if (error.response) {
  //       console.error('Erreur lors de la requête POST:', error.response.data);
  //     } else if (error.request) {
  //       console.error('Aucune réponse reçue:', error.request);
  //     } else {
  //       console.error('Erreur lors de la configuration de la requête:', error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  const handleSaveTimesheet = () => {
    console.log("Enregistrement de la timesheet...");
    showSuccessSnackbar();
  };

  // const handleFacturableChange = (event, id) => {
  //   const { value } = event.target;
  //   const updatedRows = dataRows.map((row) => {
  //     if (row.id === id) {
  //       return { ...row, facturable: value };
  //     }
  //     return row;
  //   });
  //   setDataRows(updatedRows);
  // };

  // const handleAddTaskManually = () => {
  //   const newTask = {
  //     id: dataRows.length + 1, // Add id property
  //     belongTo: taskDetails.Projet,
  //     workItemType: taskDetails.Prestation,
  //     titleDevops: taskDetails.Durée_estimée,
  //     assignedTo: taskDetails.Client,
  //     state: "",
  //     descriptionDevops: "",
  //     originalEstimate: 0,
  //     status: "",
  //     facturable: taskDetails.Facturable,
  //     pathPieceJointe: taskDetails.Pieces_jointes,
  //     consomee: 0,
  //     total1: 0,
  //   };
  //   setDataRows((prevRows) => [...prevRows, newTask]);
  //   handleCloseManualTaskDialog();
  //   setTaskDetails({
  //     Projet: "",
  //     Prestation: "",
  //     Durée_estimée: "",
  //     Client: "",
  //     Pieces_jointes: "",
  //     Facturable: "Non Facturable",
  //   });
  // };


  const columns = [
    {
      field: "belongTo",
      headerName: "Projet",
      width: 150,
      align: "center",
      headerAlign: "center",
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
    },
    {
      field: "titleDevops",
      headerName: "Tache",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "descriptionDevops",
      headerName: "Prestation",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "workItemType",
      headerName: "Type prestation",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "source",
      headerName: "Source",
      width: 90,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => "devops",
    },
    {
      field: "Type",
      headerName: "Type prestation",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Select
          value={params.value || 'Non Facturable'}
          onChange={(event) => handlePrestationChange(event, params.row.id)}
          style={{ width: "100%" }}
        >
          <MenuItem value="Non Facturable">Non Facturable</MenuItem>
          <MenuItem value="Facturable">Facturable</MenuItem>
        </Select>
      ),
    },
    {
      field: "state",
      headerName: "Statut",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <Select
          value={params.value || selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="Doing">Doing</MenuItem>
          <MenuItem value="Terminated">Terminated</MenuItem>
          <MenuItem value="Removed">Removed</MenuItem>
        </Select>
      ),
    },
    {
      field: "originalEstimate",
      headerName: "Estimer",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
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
        <input
          type="number"
          // value={params.row[dayName] || ""}
          onChange={(event) => handleHourChange(event, params.row.id, dayName)}
          style={{ width: "100%" }}
        />
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
  });

  const handleAttachments = (id) => {
    console.log("Adding attachments for row with ID:", id);
  };

  // const handleFileUpload = (event, id) => {
  //   const file = event.target.files[0];
  //   const fileName = file.name;
  //   const updatedRows = dataRows.map((row) => {
  //     if (row.id === id) {
  //       return { ...row, pathPieceJointe: fileName };
  //     }
  //     return row;
  //   });
  //   setDataRows(updatedRows);
  // };

  return (
    <>
      <div>
        <Typography variant="h6" align="center" style={{ marginBottom: "20px" }}>
          Time Sheet - {userName} - {currentDateFormatted} - {currentTime}
        </Typography>
        <Snackbar
          open={showSuccessMessage}
          message="Opération réussie !"
          autoHideDuration={3000}
          onClose={() => setShowSuccessMessage(false)}
        />
        <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
          <DataGrid
            rows={dataRows}
            columns={columns}
            pageSize={10}
            checkboxSelection
            getRowId={(row) => row.id}
            components={{
              Toolbar: () => (
                <Toolbar>
                  <IconButton color="primary" onClick={handlePostData}>
                    <Save style={{ color: "#494A4A" }} />
                  </IconButton>
                  <IconButton color="primary"
              
                  //  onClick={handleSendTimesheet}
                   >
                    <Send style={{ color: "#494A4A" }} />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => { /* Implementer handleDeleteTimesheet */ }}>
                    <Delete style={{ color: "#f44336" }} />
                  </IconButton>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                    Total Global: {totalGlobal}
                  </span>
                  <IconButton color="primary" onClick={() => setOpenAddTaskDialog(true)}>
                    <Add />
                  </IconButton>
                </Toolbar>
              ),
            }}
          />
        </div>
        <Dialog open={openAddTaskDialog} onClose={handleCloseDialog}>
          <DialogTitle>Ajouter une tâche</DialogTitle>
          <DialogContent>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
              <Tab label="Saisie manuelle" />
              <Tab label="Utiliser des données prédéfinies" />
            </Tabs>
            {selectedTab === 0 && (
              <div>
                <TextField
                  margin="dense"
                  label="Projet"
                  fullWidth
                  name="Projet"
                  value={taskDetails.Projet}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Prestation"
                  fullWidth
                  name="Prestation"
                  value={taskDetails.Prestation}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Durée estimée"
                  fullWidth
                  name="Durée_estimée"
                  value={taskDetails.Durée_estimée}
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
                  name="Statut"
                  value={taskDetails.Statut}
                  onChange={handleTaskDetailsChange}
                />
                <TextField
                  margin="dense"
                  label="Source"
                  fullWidth
                  name="Source"
                  value={taskDetails.Source}
                  onChange={handleTaskDetailsChange}
                />
              </div>
            )}
            {selectedTab === 1 && (
              <div>
                <Select
                  value={taskDetails.Prestation}
                  onChange={handleTaskDetailsChange}
                  fullWidth
                >
                  <MenuItem value="donnees1">Donnée prédéfinie 1</MenuItem>
                  <MenuItem value="donnees2">Donnée prédéfinie 2</MenuItem>
                </Select>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button 
            // onClick={handleAddTaskManually} 
            color="primary">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Feuille;
