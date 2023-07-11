import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";

import { TransitionProps } from "@mui/material/transitions";

import { tokens } from "../../theme";
import Header from "../../components/Header";

import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { eventTupleToStore } from "@fullcalendar/core/internal";

var isPageStart = true;
var isHistoryUpdate = false; // component will be rendered only when all history from sql has been updated

var scheduledDrillMode = [
  // {
  //   title: "Event 1",
  //   date: "2023-05-24",
  //   id: "1"
  // },
  // {
  //     title: "Event 2",
  //     date: "2023-05-25",
  //     id: "2"
  //   },
];

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  //Drill Mode
  const [drillMode, setDrillMode] = useState(); //For DropDown List Name
  // const [dm, setDm] = useState({}) //For Drill Mode Object
  const [showModeChangePrompt, setShowModeChangePrompt] = useState(false);

  //Side Bar
  const [isHistoryUpdate, setIsHistoryUpdate] = useState(false);
  const [displayHistory, setDisplayHistory] = useState(false); //The state of side bar
  const [historyAdded, setHistoryAdded] = useState(false); //SQL data in FULLCALENDAR already

  //Full Calendar
  const [selDate, setSelDate] = useState({}); //Clicked date grid
  const [openDiaLog, setOpenDialog] = React.useState(false); //SideBar Display Dialog

  // const [scheduledDrillMode, setScheduledDrillMode] = useState([
  //     {
  //       title: "Event 1",
  //       date: "2023-05-24",
  //       id: "1"
  //     },
  //     {
  //         title: "Event 2",
  //         date: "2023-05-25",
  //         id: "2"
  //       },

  //   ])

  // const [scheduledDrillMode, setScheduledDrillMode] = useState([])

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleClose_YES = () => {
    setDisplayHistory(true);
    setOpenDialog(false);
  };
  const handleClose_NO = () => {
    setOpenDialog(false);
  };

  const handleDateClick = (selected) => {
    //const title = prompt("Please enter a new title for your event")
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    // console.log(selected)
    // console.log(selected.view)
    console.log(selected.view.calendar);

    setShowModeChangePrompt(true); //Display Sel and Prompt
    // setTimeout(()=>{
    //     setShowModeChangePrompt(false)
    // }, 2000)
    setSelDate({ ...selected });

    // console.log(currentEvents,"~~~")
    setIsHistoryUpdate(true);

    //Display History

    //Add History First Then Display

    if (!historyAdded) {
      sqlToHistory(calendarApi); //Parse drill mode in sql to FULLCALENDAR
      setHistoryAdded(true);
    }

    // setDisplayHistory(true)

    // setTimeout(()=>{
    //     setShowModeChangePrompt(false)
    // }, 2000)
  };

  const handleEventClick = (selected) => {

    console.log(selected.event.title.trim())
    console.log(selected.event.id.trim());
   


    //Delete evnet in Fullcalendar data source

    //Delete event in SQL
    delDMfromSQL(selected.event.id,selected.event.title)

    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}`
      )
    ) {
      selected.event.remove();
    }
  };

  const handleDrillModeChange = (event: SelectChangeEvent) => {
    setDrillMode(event.target.value); //Key value controlled in the dropdown list

    setShowModeChangePrompt(false);
    add2Calendar(event.target.value);

    //Ask To Display History
    setOpenDialog(true);

    // console.log(event.target.value);
  };

  // *********

  //Functions

  const add2Calendar = (drillmode) => {
    //Format id
    let formated_id = "";

    switch (drillmode) {
      case "Upper Body":
        formated_id = "UB-";
        break;
      case "Lower Body":
        formated_id = "LB-";
        break;
      case "Physical Therapy":
        formated_id = "PT-";
        break;
      case "Basketball Skill":
        formated_id = "BS-";
        break;
    }

    formated_id +=
      selDate.startStr.split("-")[1] + selDate.startStr.split("-")[2];

    let tmp = {
      id: formated_id,

      title: drillmode,
      start: selDate.startStr,
      end: selDate.startStr, //!!! Modify here if working on hour-event
      allDay: selDate.allDay,
    };

    //Add to SQL
    uploadDM2SQL(tmp);

    //Add to FULLCALENDAR
    selDate.view.calendar.addEvent(tmp);

    // scheduledDrillMode[0].title = "HI"

    // console.log(scheduledDrillMode)
    // console.log(selDate);
    // console.log(selDate.view);
    // console.log(selDate.view.calendar);
  };

  const getDrillMode = async () => {
    const newData = await fetch("/getDrillMode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json()); // parses JSON response into native JavaScript objects
    console.log(newData, "from getDrillMode function");

    for (let m of newData.recordset) {
      let tmp = {
        id: m.Mode_ID,
        title: m.Title,
        date: m.Start,
      };
      scheduledDrillMode.push(tmp);
      // setScheduledDrillMode([...scheduledDrillMode, tmp])
    }

    // console.log('!!!');
    console.log(scheduledDrillMode);

    // console.log("2");
  };

  const uploadDM2SQL = async (dm) => {
    console.log("Upload DM Request from Client");
    console.log("current", dm);

    const newData = await fetch("/uploadDMTo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...dm,
      }),
    }).then((res) => res.json()); // parses JSON response into native JavaScript objects
    console.log(newData, "from Upload SQL function");

    //Update when SQL database is not empty
    // if(newData.length > 0){
    //     setReturnedData(newData[0])
    // }
  };

  const sqlToHistory = (calendarSource) => {
    //Add SQL event to FULLCALENDAR data source
    for (let e of scheduledDrillMode) {
      calendarSource.addEvent({
        id: e.id,
        title: e.title,
        start: e.date.trim(),
        end: e.date.trim(), //Blank Space Sensitive
        allDay: true,
      });
    }
  };

  const delDMfromSQL = async (dmId, dmTitle) => {
    try {

      //Remove in SQL
      const newData = await fetch("/clearDrillModeWcond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: dmId,
          title: dmTitle

        }),
      }).then((res) => res.json()); // parses JSON response into native JavaScript objects
      console.log(newData, "from Delete SQL function");

      //Update when SQL database is not empty
      // if (newData.length > 0) {
      //   setReturnedData(newData[0]);
      // }

    } catch (error) {
      // setChartWarning([
      //   <Alert severity="error" key="rowOpWarn" value="rowOpWarn">
      //     <Typography key="warnFont">
      //       Error Occured When Deleting in SQL
      //     </Typography>
      //   </Alert>,
      // ]);
    }
  };

  if (isPageStart) {
    // setTimeout(()=>{ getDrillMode()},1000)
    getDrillMode();

    // console.log("1");
    isPageStart = false;
    // console.log(scheduledDrillMode)
    // console.log(currentEvents)
    // setCurrentEvents([ {name:"shit"}])
  }

  // useEffect(()=>{
  //     console.log("change fired",scheduledDrillMode)
  // })

  const displayScheduledDrillMode = () => {
    console.log(calendar);

    // calendar.addEvent({
    //     id: "123",
    //     title:"bs",
    //     start: calendar.startStr,
    //     end: calendar.endStr,
    //     allDay: calendar.allDay,
    // });
  };

  //Component
  var calendar = (
    <FullCalendar
      height="75vh"
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      headerToolbar={{
        left: "prev,next,today",
        center: "title",
        right: "dayGridMonth, timeGridWeek, timeGridDay, listMonth",
      }}
      initialView="dayGridMonth"
      editable={true}
      selectable={true}
      select={handleDateClick}
      eventClick={handleEventClick}
      initialEvents={scheduledDrillMode}
      // initialEvents={getDrillMode}
      eventsSet={(events) => setCurrentEvents(events)}
      // customButtons={
      //   listMonth={
      //     click: function() {
      //                 alert('clicked custom button 1!'); }

      //           }
      //   }

      // customButtons={
      //     please={
      //         text: 'custom 1',
      //         click: function() {
      //           alert('clicked custom button 1!'); }

      //     }
      // }

      // eventsSet={(events) => console.log(events)}

      // initialEvents={[
      //     {id: "UB-0524", title: "Upper Body", date: "2023-05-22"},
      //     {id: "2", title: "Inclined Bench Press", date: "2023-05-21"},
      // ]}
    />
  );

  return (
    <Box m="20px">
      <Header title="GRILL TIME" subtitle="Schedule Your Grind" />
      {displayHistory ? (
        <Box />
      ) : (
        <Dialog
          open={openDiaLog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          // aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography>{"Display Drill Mode History On the Side?"}</Typography>
          </DialogTitle>
          {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
          <DialogActions>
            <Button onClick={handleClose_YES} autoFocus>
              <Typography color={colors.grey[100]}>YES</Typography>
            </Button>
            <Button onClick={handleClose_NO}>
              <Typography color={colors.grey[100]}>NO</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showModeChangePrompt ? (
        [
          <Box display="flex" alignContent="center" key="prompSel">
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                <Typography>Drill Mode</Typography>
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={drillMode}
                onChange={handleDrillModeChange}
                label="Drill Mode"
              >
                <MenuItem value={"Upper Body"}>Upper Body</MenuItem>
                <MenuItem value={"Lower Body"}>Lower Body</MenuItem>
                <MenuItem value={"Physical Therapy"}>Physical Therapy</MenuItem>
                <MenuItem value={"Basketball Skill"}>Basketball Skill</MenuItem>
              </Select>
            </FormControl>
          </Box>,
          <Alert severity="warning" key="prompMsg">
            {" "}
            Select the mode you want to add
          </Alert>,
        ]
      ) : (
        <Box />
      )}



      <Box display="flex" justifyContent="space-between">
        {/* EVENT SIDE BAR */}

        {displayHistory ? (
          <Box
            flex="1 1 20%"
            backgroundColor={colors.primary[400]}
            p="15px"
            borderRadius="4px"
          >
            <Typography variant="h5"> Scheduled Drills </Typography>
            <List>
              {currentEvents.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Typography>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box />
        )}

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          {calendar}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
