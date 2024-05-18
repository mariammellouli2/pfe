import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { makeStyles } from '@mui/styles';

// Styles
const useStyles = makeStyles((theme) => ({
    root: {
        height: "calc(100vh - 64px)",
        width: "100%",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: theme.spacing(2),
    },
    addButton: {
        marginRight: theme.spacing(2),
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        marginBottom: theme.spacing(2),
        "& .MuiTextField-root": {
            marginBottom: theme.spacing(1),
        },
    },
    button: {
        marginLeft: theme.spacing(2),
    },
}));

const Tache = () => {
    const classes = useStyles();
    const [tasks, setTasks] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({
        name: "",
        description: "",
        EstimatedTotal: "", // Corrected field name
        TotalConsumed: "", // Corrected field name
        clientId: 0,
        status: "",
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    // Fonction pour récupérer les tâches depuis l'API
    const fetchTasks = async () => {
        try {
            const response = await fetch("https://localhost:7288/api/Task");
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error("Error fetching tasks:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Fonction pour gérer le changement de valeur dans les champs de saisie
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    // Fonction pour ouvrir le dialogue d'ajout de tâche
    const handleAddTask = () => {
        setOpenDialog(true);
    };

    // Fonction pour ouvrir le dialogue de modification de tâche
    const handleOpenEditDialog = (task) => {
        setSelectedTask(task);
        setEditDialog(true);
    };

    // Fonction pour fermer le dialogue d'ajout/modification de tâche
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditDialog(false);
        setNewTask({
            name: "",
            description: "",
            EstimatedTotal: "",
            TotalConsumed: "",
            clientId: 0,
            status: "",
        });
        setSelectedTask(null);
    };

    // Fonction pour soumettre le formulaire d'ajout de tâche
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://localhost:7288/api/Task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });
            if (response.ok) {
                const addedTask = await response.json(); // Récupérer la tâche ajoutée depuis la réponse
                setTasks([...tasks, addedTask]); // Ajouter la nouvelle tâche à la liste des tâches
                handleCloseDialog(); // Fermer le dialogue
            } else {
                console.error("Error adding task:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Fonction pour mettre à jour une tâche
    const handleUpdateTask = async () => {
        try {
            const response = await fetch(`https://localhost:7288/api/Task/${selectedTask.taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedTask),
            });
            if (response.ok) {
                fetchTasks(); // Rafraîchir la liste des tâches après la mise à jour
                handleCloseDialog(); // Fermer le dialogue
            } else {
                console.error("Error updating task:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Fonction pour supprimer une tâche
    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`https://localhost:7288/api/Task/${taskId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchTasks(); // Rafraîchir la liste des tâches après la suppression
            } else {
                console.error("Error deleting task:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Définition des colonnes du tableau de données
    const columns = [
        { field: "taskId", headerName: "ID", width: 80, headerAlign: "center", align: "center" },
        { field: "name", headerName: "Nom de la tâche", width: 250, headerAlign: "center", align: "center" },
        { field: "description", headerName: "Description", width: 300, headerAlign: "center", align: "center" },
        { field: "EstimatedTotal", headerName: "Durée estimée", width: 180, headerAlign: "center", align: "center" },
        { field: "TotalConsumed", headerName: "Durée consommée", width: 180, headerAlign: "center", align: "center" },
        { field: "status", headerName: "Statut", width: 150, headerAlign: "center", align: "center" },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <>
                    <div
                        onClick={() => handleOpenEditDialog(params.row)}
                        style={{ cursor: "pointer", display: "inline-block", marginRight: 8 }}
                    >
                        <ModeEditOutlineOutlinedIcon
                            style={{ fontSize: 24, transform: "scale(1)", transition: "transform 0.2s" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        />
                    </div>
                    <div
                        onClick={() => handleDeleteTask(params.row.taskId)}
                        style={{ cursor: "pointer", display: "inline-block" }}
                    >
                        <DeleteOutlineOutlinedIcon
                            style={{ fontSize: 24, transform: "scale(1)", transition: "transform 0.2s" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        />
                    </div>
                </>
            ),
        },
    ];

    return (
        <Box className={classes.root}>
            <Box className={classes.buttonContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTask}
                    className={classes.addButton}
                >
                    Ajouter Tâche
                </Button>
            </Box>
            <DataGrid
                rows={tasks}
                columns={columns}
                pageSize={10}
                autoHeight
                disableColumnMenu
                disableColumnSelector
                getRowId={(row) => row.taskId} // Utiliser l'identifiant unique "taskId"
                components={{
                    Toolbar: () => (
                        <Box display="flex" justifyContent="flex-end" alignItems="center" pr={2}>
                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}></Typography>
                        </Box>
                    )
                }}
            />

            {/* Dialogue de modification de tâche */}
            <Dialog open={editDialog} onClose={handleCloseDialog}>
                <DialogTitle>Modifier la tâche</DialogTitle>
                <DialogContent>
                    <form className={classes.formContainer} onSubmit={handleSubmit}>
                        <TextField
                            label="Nom de la tâche"
                            name="name"
                            value={selectedTask ? selectedTask.name : ""}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={selectedTask ? selectedTask.description : ""}
                            onChange={(e) => handleChange(e)}
                        />
                        <TextField
                            label="Durée estimée"
                            name="EstimatedTotal"
                            type="number"
                            value={selectedTask ? selectedTask.EstimatedTotal : ""}
                            onChange={(e) => handleChange(e)}
                        />
                        <TextField
                            label="Durée consommée"
                            name="TotalConsumed"
                            type="number"
                            value={selectedTask ? selectedTask.TotalConsumed : ""}
                            onChange={(e) => handleChange(e)}
                        />
                        <TextField
                            label="Statut"
                            name="status"
                            value={selectedTask ? selectedTask.status : ""}
                            onChange={(e) => handleChange(e)}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleUpdateTask} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Tache;
