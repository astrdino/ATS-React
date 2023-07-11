import { useEffect, useState, MouseEvent } from "react";

import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Button } from "@material-ui/core";
import {
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Alert,
} from "@mui/material";

import { tokens } from "../../theme";

import Header from "../../components/Header";
import { ConstructionOutlined, Margin } from "@mui/icons-material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { DataGrid, gridSortColumnLookupSelector } from "@mui/x-data-grid";

//Data
import { mockDataTeam } from "../../data/mockData";
import { drillDetail_jsonTemplate } from "../../data/mixMainPageTestData";
import { exercise_candidate } from "../../data/mixMainPageTestData";

//External Function
var dbFunctions = require("../../data/mixMainPageTestData");

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

var FE_id_count = 0;

var ROWS = []; //Event List in ONE MODE (front-end)


var cnt = 0; //Rerender cmd 

const Mix = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [firstRender, setFirstRender] = useState(true);

  const [rowSelIndex, setRowSelIndex] = useState([]);
  const [rowSelID_Ctnt, setRowSelID_Ctnt] = useState([]);

  // const [ROWS, setROWS] = useState([])

  const [renderROWS, setRenderROWS] = useState([0]);

  const [cand2ScheProg, setCand2ScheProg] = useState([]);

  // var jsFile = JSON.stringify(drillDetail_jsonTemplate)

  // console.log(myFunctions.getMode_Event())
  // dbFunctions.getMode_Event_Amt(drillDetail_jsonTemplate)

  // var exercises = dbFunctions.getMode_Event(drillDetail_jsonTemplate, "ModeName2")
  // console.log(drillDetail_jsonTemplate.ModeName2);

  // console.log(drillDetail_jsonTemplate);
  var drillDetail_OBJ = JSON.parse(drillDetail_jsonTemplate);
  var drillDetail_OBJ_NEW = JSON.parse(
    dbFunctions.drillDetail_jsonTemplate_NEW
  );

  // console.log(drillDetail_OBJ.ModeName2.Event1.Exercise.ExerciseTitle);

  //Front-End Data Variables
  var MY_Modes_List_OBJ = [];

  //Functions
  //Obtain information outside then construct a list of objects to display on front-end

  //Mode List
  for (let i = 0; i < Object.keys(drillDetail_OBJ).length; i++) {
    // var pre = "ModeName"
    // pre += `${i+1}`

    MY_Modes_List_OBJ.push(Object.values(drillDetail_OBJ));
    // console.log(Object.values(drillDetail_OBJ));
  }

  for (let i = 0; i < Object.keys(drillDetail_OBJ_NEW).length; i++) {
    console.log();
  }

  // console.log(Object.keys(drillDetail_OBJ));

  //In A Mode
  // console.log(Object.values(drillDetail_OBJ)[1]);

  var getSecondMode = Object.values(drillDetail_OBJ_NEW)[1];
  // console.log(getSecondMode);

  //All Exercises in ONE mode
  var excList = Object.values(getSecondMode.Events);

  // console.log(excList);


  function makeCmpnt(){
    var cmpntList = []
    for(let i = 0; i < MY_Modes_List_OBJ.length; i++){



    }

    return cmpntList
  }

  // Mode-Level Front End Operation
  console.log(MY_Modes_List_OBJ.length);
  console.log(drillDetail_OBJ_NEW);

  


  // Exercise-Level Front End Operation
  async function formRows() {
    if (firstRender) {
      ROWS = [];
      // setROWS([])

      for (let exe of excList) {
        var tmplt = {
          id: FE_id_count++,
          exercise_name: "",
          repe: 0,
          sets: 0,
          weight: 0,
          duration: 0,
        };

        // console.log(exe.Exercise.ExerciseTitle);
        tmplt.exercise_name = exe.Exercise.ExerciseTitle;
        tmplt.repe = exe.Schedule[0].SubSchedule.Repe;
        tmplt.sets = exe.Schedule[0].SubSchedule.Sets;
        tmplt.duration = exe.Schedule[0].SubSchedule.Duration;

       

        ROWS.push(tmplt);
      }

      setFirstRender(false);
    }

    // var row = []
    // console.log(++FE_id_count);
    // console.log();

    // var thisID = FE_id_count++

    // console.log(tmplt);

    // return ROWS

    // return tmplt
  }

  function addCand2Sche() {
    //rowSelIndex [1,...]
    for (let ind of rowSelIndex) {
      console.log();

      var news = exercise_candidate[ind - 1];
    }
    console.log(ROWS);
  }

  function addCand2Sche_Dialog() {
    cnt++;

    //Obtain sel from candidates

    var selcted = [];

    console.log(rowSelIndex);

    for (let ind of rowSelIndex) {
      if (Number.isInteger(ind)) {
        selcted.push({
          ExerciseID: exercise_candidate[ind - 1].ExerciseID,
          ExerciseTitle: exercise_candidate[ind - 1].ExerciseTitle,
        });
        console.log();
      }
    }

    // console.log(selcted);

    //Format Message

    // console.log(excList);
    // var tmpSche_start = prompt('Schedule Start')
    // var tmpSche_end = prompt('Schedule End')
    // var tmpSche_repe = prompt('Repe')
    // var tmpSche_sets = prompt('Sets')
    // var tmpSche_weight = prompt('Weight')
    // var tmpSche_duration = prompt('Duration')
    var tmpSche_start = "2023-05-16";
    var tmpSche_end = "2023-05-16";
    var tmpSche_repe = 14;
    var tmpSche_sets = 4;
    var tmpSche_weight = 0;
    var tmpSche_duration = 0;

    var msg = "";
    for (let evt of selcted) {
      var evtTmlt = {
        Exercise: {
          ExerciseID: "",
          ExerciseTitle: "",
        },
        Schedule: [],
        CompletedHistory: [],
      };

      evtTmlt.Exercise.ExerciseID = evt.ExerciseID;
      evtTmlt.Exercise.ExerciseTitle = evt.ExerciseTitle;
      // evtTmlt.Schedule.push({evtTmlt})

      var sbSchTmlt = {
        StartDate: tmpSche_start,
        EndDate: tmpSche_end,
        Repe: tmpSche_repe,
        Sets: tmpSche_sets,
        Weight: tmpSche_weight,
        Duration: tmpSche_duration,
        Completed_Freq: 3,
        Completed_Date: [],
      };

      evtTmlt.Schedule = { sbSchTmlt };

      //End of building object for database

      //Start of building object for front-end display

      //Check if the row is valid to added
      //    for (let row of ROWS){

      //     if(evtTmlt.Exercise.ExerciseTitle === row.exercise_name){
      //         console.log("BEEP");
      //     }

      //    }

      var FE_row_OBJ = {
        id: FE_id_count,
        exercise_name: evtTmlt.Exercise.ExerciseTitle,
        repe: Object.values(evtTmlt.Schedule)[0].Repe,
        sets: Object.values(evtTmlt.Schedule)[0].Sets,
        weight: Object.values(evtTmlt.Schedule)[0].Weight,
        duration: Object.values(evtTmlt.Schedule)[0].Duration,
      };

      FE_id_count++;

      // console.log(FE_row_OBJ);

      // console.log(ROWS);

      // setROWS([...ROWS, FE_row_OBJ])

      ROWS = [...ROWS, FE_row_OBJ];
      console.log(FE_row_OBJ,"NEW");

      // ROWS.push(FE_row_OBJ)

      // console.log(evtTmlt);
    }

    //Update Database
    // excList.push(evtTmlt)
    // console.log(excList);

    //Display on the front end

    setRenderROWS([...renderROWS, cnt]);

    console.log(ROWS);

    // console.log(excList);
  }


  function handleDeletefromShce(){

   
    // console.log(rowSelIndex);
    // console.log(ROWS, "Before Delete");
    // console.log("selected",rowSelID_Ctnt);

    for(let i = 0; i < rowSelID_Ctnt.length - 1; i++){
      //Minus 1 is because of the last element is returned as concluded array

        // console.log(ROWS[rowSelID_Ctnt[i]]);
        // console.log(rowSelID_Ctnt[i],"lol");
        // console.log(typeof(ROWS[rowSelIndex[i]]));
        ROWS  = ROWS.filter(ele => ele.id !== rowSelID_Ctnt[i])
        // console.log(sdw);

        // var newROWS_pre = ROWS.slice(0, rowSelID_Ctnt[i])
        // var newROWS_post = ROWS.slice(rowSelID_Ctnt[i]+1,ROWS.length)

        // ROWS = newROWS_pre.concat(newROWS_post)

        //Modify Order Index for modified ROWS

        // for(let ad = i + 1; ad < rowSelID_Ctnt.length - 1; ad++){

        //   console.log("?");

       
        //   if(ad > i){
        //     console.log("Change From",rowSelID_Ctnt[ad] );
        //     rowSelID_Ctnt[ad] -= 1
        //     console.log("Change To",rowSelID_Ctnt[ad] );

        //   }
          
        // }

        
        
       
    }

    //Render
    cnt++
    setRenderROWS([...renderROWS, cnt]);
    // console.log("After Deleted",ROWS);

}



  const test = [
    {
      id: 1,
      exercise_name: "Jon Snow",
      repe: 8,
      sets: 35,
      weight: 30,
      duration: 0,
    },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    // {
    //   field: "accessLevel",
    //   headerName: "Access Level",
    //   flex: 1,
    //   renderCell: ({ row: { access } }) => {
    //     return (
    //       <Box
    //         width="60%"
    //         m="0 auto"
    //         p="5px"
    //         display="flex"
    //         justifyContent="center"
    //         backgroundColor={
    //           access === "admin"
    //             ? colors.greenAccent[600]
    //             : access === "manager"
    //             ? colors.greenAccent[700]
    //             : colors.greenAccent[700]
    //         }
    //         borderRadius="4px"
    //       >
    //         {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
    //         {access === "manager" && <SecurityOutlinedIcon />}
    //         {access === "user" && <LockOpenOutlinedIcon />}
    //         <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
    //           {access}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
  ];

  const MixContent_Columns = [
    {
      field: "exercise_name",
      headerName: "Exercise Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "repe",
      headerName: "Repe",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true
    },
    {
      field: "sets",
      headerName: "Sets",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true
    },
    {
      field: "weight",
      headerName: "Weight",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true
    },
    {
      field: "duration",
      headerName: "Duration",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true
    },
    // {
    //     field: "actions",
    //     type: "actions",
    //     headerName: "Actions",
    //     renderCell: (cellValues) =>{
    //         return(
    //             <Button>
    //                 Delete
    //             </Button>
    //         )
    //     }
        
    // }
  ];

  const columns_candidates = [
    {
      field: "ExerciseTitle",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
  ];

  formRows();

  useEffect(() => {
    // console.log("1");
    if (renderROWS) {
      console.log("RE");
    }
  });

  return (
    <Box m="20px">
      <Header title="Drill Mix" subtitle="Mixing Drill Mode" />

      <Box className="Mix-Container">
        <Box className="Mix-Sidebar">
          Mix Sidebar
          <Box className="Mix-Sidebar-ModeInfo">          
          <Box className="Mix-Sidebar-ModeInfo-ID">Mode ID: </Box>
          <Box className="Mix-Sidebar-ModeInfo-Name">Mode Name: </Box>
          <Box className="Mix-Sidebar-ModeInfo-ScheduledDate">Shchedule on: </Box></Box>

          <Box className="Mix-Sidebar-Candidates">
            <DataGrid
              checkboxSelection
              key="DataGrid-Mix-Candidates"
              editMode = "row"
              rows={exercise_candidate}
              columns={columns_candidates}
              onRowSelectionModelChange={(sel) => {
                setRowSelIndex([]);
                for (let ele in sel) {
                  setRowSelIndex([...sel, sel]);
                }
              }}
            //   isCellEditable={(params)=>{

            //     console.log(params);

            //   }}
            // onCellEditStart={()=>{
            //     console.log("lol");
            // }}
              hideFooterPagination
            />
          </Box>
          <Box className="Mix-Sidebar-Operations">
            <button
              onClick={() => {
                addCand2Sche_Dialog();
              }}
            >
              Add
            </button>
            <button>Delete</button>
          </Box>
        </Box>

        <Box className="Mix-Detail">
          <Box className="Mix-Detail-Record">
            Status (Running), Mode Created, Last Modified,{" "}
          </Box>

          <Box className="Mix-Detail-Content">
            <DataGrid
              checkboxSelection
              key="DataGrid-Mix-Detail"
              rows={ROWS}
              columns={MixContent_Columns}
              onRowSelectionModelChange={(sel)=>{

              //  console.log("click",sel);
                setRowSelID_Ctnt([])
                for (let ele in sel){
                  setRowSelID_Ctnt([...sel,sel])
                }
              }}
            />

            <button onClick={()=>{
                handleDeletefromShce();
            }}>Delete</button>
          </Box>
        </Box>

        <Box className="Mix-Sidebar">
          Mix Sidebar
          <Box className="Mix-Sidebar-ModeName">Mode Name</Box>
          <Box className="Mix-Sidebar-Candidates">
            <DataGrid
              key="DataGrid-Mix-Candidates"
              rows={mockDataTeam}
              columns={columns_candidates}
              hideFooterPagination
            />
          </Box>
          <Box className="Mix-Sidebar-Operations">
            <button
              onClick={() => {
                console.log("whtf");
              }}
            >
              Add
            </button>
            <button>Delete</button>
          </Box>
        </Box>

        <Box className="Mix-Detail">
          Mode Detail
          <DataGrid
            key="DataGrid-Mix-Detail"
            rows={mockDataTeam}
            columns={columns}
          />
        </Box>

        <Box className="Mix-NewMode"> New Mode </Box>
      </Box>
    </Box>
  );
};

export default Mix;
