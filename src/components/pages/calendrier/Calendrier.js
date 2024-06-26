/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import {
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Divider,
  Paper,
  Drawer,
  IconButton,
  List,
  ListItem,
  Select,
  MenuItem,
} from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import { css } from "@emotion/react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const apiEndpoint = "https://localhost:44352/api/Events";

let eventGuid = 0;

function createEventId() {
  return String(eventGuid++);
}

function SidebarEvent({ event, onEdit, onDelete }) {
  return (
    <ListItem key={event.id} css={css`margin-bottom: 8px; display: flex; justify-content: space-between;`}>
      <div>
        <Typography variant="subtitle1" css={css`color: #348AAB;`}>
          {formatDate(event.start, { year: "numeric", month: "short", day: "numeric" })}
        </Typography>
        <Typography variant="body2">{event.title}</Typography>
      </div>
      <div>
        <IconButton onClick={() => onEdit(event)} css={css`color: #A1B848;`}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(event)} css={css`color: #F07304;`}>
          <DeleteIcon />
        </IconButton>
      </div>
    </ListItem>
  );
}

const Calendrier = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({ selectInfo: null, title: "", id: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data } = await axios.get(apiEndpoint);
      setCurrentEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error.response ? error.response.data : error.message);
    }
  }

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    setDialogInfo({ selectInfo, title: "", id: null });
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  async function handleDialogSubmit() {
    const { selectInfo, title, id } = dialogInfo;

    if (title) {
      const newEvent = {
        id: id || createEventId(),
        title,
        start: selectInfo ? new Date(selectInfo.startStr).toISOString() : new Date().toISOString(),
        end: selectInfo ? new Date(selectInfo.endStr).toISOString() : new Date().toISOString(),
        allDay: selectInfo ? selectInfo.allDay : true,
        category: "General", // Default category if none is provided
      };

      console.log("Event data before sending:", newEvent);

      try {
        if (id) {
          // Update existing event
          await axios.put(`${apiEndpoint}/${id}`, newEvent);
          setCurrentEvents(currentEvents.map(event => event.id === id ? newEvent : event));
        } else {
          // Add new event
          const { data } = await axios.post(apiEndpoint, newEvent);
          setCurrentEvents([...currentEvents, data]);
        }
      } catch (error) {
        console.error("Error sending event data:", error.response ? error.response.data : error.message);
      }
    }
    setDialogOpen(false);
  }

  function handleEventClick(clickInfo) {
    setSelectedEvent(clickInfo.event);
    setDrawerOpen(true);
  }

  async function handleDeleteEvent(event) {
    if (window.confirm(`Are you sure you want to delete the event '${event.title}'`)) {
      try {
        await axios.delete(`${apiEndpoint}/${event.id}`);
        setCurrentEvents(currentEvents.filter(e => e.id !== event.id));
      } catch (error) {
        console.error("Error deleting event:", error.response ? error.response.data : error.message);
      }
    }
  }

  function handleEditEvent(event) {
    setDialogInfo({
      selectInfo: { startStr: new Date(event.start).toISOString(), endStr: event.end ? new Date(event.end).toISOString() : null, allDay: event.allDay },
      title: event.title,
      id: event.id
    });
    setDialogOpen(true);
  }

  function filteredEvents() {
    if (filterCategory === "All") {
      return currentEvents;
    }
    return currentEvents.filter(event => event.category === filterCategory);
  }

  function handleAddEvent() {
    setDialogInfo({
      selectInfo: {
        startStr: new Date().toISOString(),
        endStr: new Date().toISOString(),
        allDay: true
      },
      title: "",
      id: null
    });
    setDialogOpen(true);
  }

  return (
    <>
      <Stack direction="row" spacing={2} css={css`padding: 20px;`}>
        <Paper elevation={3} css={css`padding: 20px; width: 300px;`}>
          <Typography variant="h6" gutterBottom>Événements sélectionnés</Typography>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            fullWidth
          >
            <MenuItem value="All">Tous</MenuItem>
            <MenuItem value="Work">Travail</MenuItem>
            <MenuItem value="Personal">Personnel</MenuItem>
          </Select>
          <List css={css`list-style-type: none; padding: 0; margin: 0;`}>
            {filteredEvents().map((event, index) => (
              <React.Fragment key={event.id}>
                <SidebarEvent event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
                {index !== currentEvents.length - 1 && <Divider css={css`margin: 8px 0;`} />}
              </React.Fragment>
            ))}
          </List>
          <Button
            variant="contained"
            css={css`margin-top: 16px; background-color: #348AAB; color: white; &:hover { background-color: #c36203; }`}
            startIcon={<AddIcon />}
            onClick={handleAddEvent}
          >
            Ajouter un événement
          </Button>
        </Paper>

        <div className="demo-app-main" css={css`flex-grow: 1;`}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={frLocale}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            height="85vh"
            select={handleDateSelect}
            eventClick={handleEventClick}
            events={currentEvents}
            eventColor="#348AAB"
            eventBackgroundColor="#348AAB"
            css={css`
              .fc-toolbar-title {
                font-size: 1.5rem;
              }
              .fc-daygrid-event {
                font-size: 1rem;
                background-color: #348AAB;
                border-color: #348AAB;
              }
              .fc-button {
                background-color: #348AAB !important;
                border-color: #348AAB !important;
                color: white !important;
              }
              .fc-button:hover {
                background-color: #2b6f8c !important;
                border-color: #2b6f8c !important;
              }
              .fc-button-primary {
                background-color: #399BBD !important;
                border-color: #399BBD !important;
                color: white !important;
              }
              .fc-button-primary:hover {
                background-color: #3182CE !important;
                border-color: #3182CE !important;
              }
              .fc-today-button {
                background-color: #A1B848 !important;
                border-color: #A1B848 !important;
                color: white !important;
              }
              .fc-today-button:hover {
                background-color: #8a9e3b !important;
                border-color: #8a9e3b !important;
              }
              .fc-icon-chevron-left,
              .fc-icon-chevron-right {
                color: #F07304 !important;
              }
            `}
          />
        </div>
      </Stack>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogInfo.id ? "Modifier un événement" : "Créer un événement"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez entrer un titre pour votre {dialogInfo.id ? "événement modifié" : "nouvel événement"}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Titre de l'événement"
            type="text"
            fullWidth
            value={dialogInfo.title}
            onChange={(e) => setDialogInfo({ ...dialogInfo, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} css={css`color: #A1B848;`}>
            Annuler
          </Button>
          <Button
            css={css`background-color: #A1B848; color: white; &:hover { background-color: #8a9e3b; }`}
            onClick={handleDialogSubmit}
          >
            {dialogInfo.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div css={css`width: 300px; padding: 16px;`}>
          {selectedEvent && (
            <>
              <Typography variant="h6">{selectedEvent.title}</Typography>
              <Typography variant="body2">
                {formatDate(selectedEvent.start, { year: "numeric", month: "short", day: "numeric" })} - {formatDate(selectedEvent.end, { year: "numeric", month: "short", day: "numeric" })}
              </Typography>
              <Button
                variant="contained"
                css={css`margin-top: 16px; background-color: #348AAB; color: white; &:hover { background-color: #2b6f8c; }`}
                startIcon={<EditIcon />}
                onClick={() => handleEditEvent(selectedEvent)}
              >
                Modifier
              </Button>
              <Button
                variant="contained"
                css={css`margin-top: 16px; background-color: #F07304; color: white; &:hover { background-color: #c36203; }`}
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteEvent(selectedEvent)}
              >
                Supprimer
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Calendrier;
