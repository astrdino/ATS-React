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

var FE_id_count = 0;
var CandiList_id_count = 0;

var ROWS_cand = [];
var ROWS = []; //Event List in ONE MODE (front-end)
var outROWS = []; //Event List in ONE MODE after getting called to update

var cnt = 0; //Rerender cmd

var cand_render_limit = 0;

var firstRenderAll = true;

var firstDataFetch = true;

//Function use during development
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function isIterable(input) {  
  if (input === null || input === undefined) {
    return false
  }

  return typeof input[Symbol.iterator] === 'function'
}

const Mix = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //   const [firstRender, setFirstRender] = useState(true);
  var firstRender = true;
  const [firstCandRender, setFirstCandRender] = useState(true);

  // const [modeRendered, setModeRende]

  const [rowSelIndex, setRowSelIndex] = useState([]);
  const [rowSelID_Ctnt, setRowSelID_Ctnt] = useState([]);

  // const [ROWS, setROWS] = useState([])

  const [renderROWS, setRenderROWS] = useState([0]);
  const [ROWS_candi_done, setROWS_candi_done] = useState([0]);

  const [cand2ScheProg, setCand2ScheProg] = useState([]);

  //Function to get "Single Record" data from sql

  var drillDetail_JSON_SQL;
  var drillDetail_OBJ_SQL
  var MY_Modes_List_OBJ_SQL
  var getSecondMode_SQL
  var excList_SQL

  async function getSingleRecord() {
    //Fetch from SQL
    const newData = await fetch("/getSingleRecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json()); // parses JSON response into native JavaScript objects
    // console.log(newData, "get single record");

    // console.log(newData[0].Details)
    drillDetail_JSON_SQL = newData[0].Details;

    // if(drillDetail_JSON_SQL === newData[0].Details){
    //   console.log("YEP");
    // }
  }

  const buildData = async () => {
    await getSingleRecord();
    // console.log(isJson(drillDetail_JSON_SQL));

    //Decode Json -> Objects
    drillDetail_OBJ_SQL = JSON.parse(drillDetail_JSON_SQL);

    MY_Modes_List_OBJ_SQL = Object.values(drillDetail_OBJ_SQL);
    // console.log(MY_Modes_List_OBJ_SQL);


    //Get Second Mode to Test
    getSecondMode_SQL = Object.values(drillDetail_OBJ_SQL)[1]

    excList_SQL = Object.values(getSecondMode_SQL.Events)
    console.log(isIterable(excList_SQL));
  };

  if (firstDataFetch) {
    buildData();
    firstDataFetch = false;
  }

  //Decode Json -> Objects
  var drillDetail_OBJ_NEW = JSON.parse(
    dbFunctions.drillDetail_jsonTemplate_NEW
  );

  var MY_Modes_List_OBJ = Object.values(drillDetail_OBJ_NEW);
  // console.log("MODES:", MY_Modes_List_OBJ);

  var getSecondMode = Object.values(drillDetail_OBJ_NEW)[1];
  // console.log("MODE-Detail:", getSecondMode);

  //All Exercises in ONE mode
  var excList = Object.values(getSecondMode.Events);
  console.log("ExcList", excList);

  function makeCmpnt() {
    // var cmpntList = []
    if (firstRenderAll) {
      formRows();
      formEC_row(); //SQL -> Candidate Front End

      firstRenderAll = false;
    }

    //Update cand_render_limit
    cand_render_limit++;

    var cmpntList = [];

    // console.log("Start to generate Component");

    // console.log(MY_Modes_List_OBJ);

    for (let i = 0; i < MY_Modes_List_OBJ.length; i++) {
      var id_sb = "Mix-Sidebar-cmpnt-" + i;
      var id_md = "Mix-Detail-cmpnt-" + i;

      var mode_date_msg = "";

      for (let d of MY_Modes_List_OBJ[i].Schedule_Dates) {
        mode_date_msg += ` ${d}`;
      }

      var cmpnt_sb = (
        <Box key={id_sb} className="Mix-Sidebar">
          Mix Sidebar
          <Box className="Mix-Sidebar-ModeInfo">
            <Box className="Mix-Sidebar-ModeInfo-ID">
              Mode ID: {MY_Modes_List_OBJ[i].ModeID}
            </Box>
            <Box className="Mix-Sidebar-ModeInfo-Name">
              Mode Name: {MY_Modes_List_OBJ[i].ModeTitle}
            </Box>
            <Box className="Mix-Sidebar-ModeInfo-ScheduledDate">
              Shchedule on: {mode_date_msg}
            </Box>
          </Box>
          <Box className="Mix-Sidebar-Candidates">
            <DataGrid
              checkboxSelection
              key="DataGrid-Mix-Candidates"
              editMode="row"
              rows={ROWS_cand}
              columns={columns_candidates}
              onRowSelectionModelChange={(sel) => {
                setRowSelIndex([]);
                for (let ele in sel) {
                  setRowSelIndex([...sel, sel]);
                }
              }}
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
          </Box>
        </Box>
      );

      var cmpnt_md = (
        <Box key={id_md} className="Mix-Detail">
          <Box className="Mix-Detail-Record">
            Status (Running), Mode Created, Last Modified,{" "}
          </Box>

          <Box className="Mix-Detail-Content">
            <DataGrid
              checkboxSelection
              key="DataGrid-Mix-Detail"
              rows={ROWS}
              columns={MixContent_Columns}
              onRowSelectionModelChange={(sel) => {
                //  console.log("click",sel);
                setRowSelID_Ctnt([]);
                for (let ele in sel) {
                  setRowSelID_Ctnt([...sel, sel]);
                }
              }}
            />

            <button
              onClick={() => {
                handleDeletefromShce();
              }}
            >
              Delete
            </button>
          </Box>
        </Box>
      );

      cmpntList.push(cmpnt_sb);
      cmpntList.push(cmpnt_md);
    }

    return cmpntList;
  }

  async function formEC_row() {
    // console.log("formEC_row get called");

    var resultList = [];

    //Fetch from SQL
    const newData = await fetch("/getALL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json()); // parses JSON response into native JavaScript objects
    // console.log(newData, "formingCandidate");

    //Return Objects
    for (let ele of newData) {
      var tmpObj = {
        id: CandiList_id_count,
        ExerciseID: ele.Exercise_ID.trim(),
        ExerciseTitle: ele.Name.trim(),
      };

      ROWS_cand = [...ROWS_cand, tmpObj];

      //Render
      // setRenderROWS_cand([...renderROWS_cand])

      // console.log(ROWS_cand);
      CandiList_id_count++;
    }

    setROWS_candi_done([...ROWS_candi_done]);

    // setFirstCandRender(false)
  }

  async function formRows() {
    if (firstRender) {
      ROWS = [];
      // setROWS([])

      console.log("I got", excList_SQL);

      //Conversion Back->Front
      for (let exe of excList_SQL) {
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

      // firstRender = false
    }

    // var row = []
    // console.log(++FE_id_count);
    // console.log();

    // var thisID = FE_id_count++

    // console.log(tmplt);

    // return ROWS

    // return tmplt
  }

  // function addCand2Sche() {
  //   //rowSelIndex [1,...]
  //   for (let ind of rowSelIndex) {
  //     console.log();

  //     var news = ROWS_cand[ind - 1];
  //   }
  //   console.log(ROWS);
  // }

  function addCand2Sche_Dialog() {
    //Update Rerender Command
    cnt++;

    //Obtain sel from candidates

    var selcted = [];

    console.log(rowSelIndex);
    console.log(ROWS_cand);

    for (let ind of rowSelIndex) {
      //Filter the last array that is returned in the last element
      if (Number.isInteger(ind)) {
        //Find object
        var tarObj = ROWS_cand.filter((ele) => ele.id === ind)[0];

        selcted.push({
          ExerciseID: tarObj.ExerciseID,
          ExerciseTitle: tarObj.ExerciseTitle,
        });
      }
    }

    console.log(selcted);

    //Format Schedule

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

    //Generate JSON-like object for back end data
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

      //Object for Schedule
      var SubSchedule = {
        StartDate: tmpSche_start,
        EndDate: tmpSche_end,
        Repe: tmpSche_repe,
        Sets: tmpSche_sets,
        Weight: tmpSche_weight,
        Duration: tmpSche_duration,
        Completed_Freq: 3,
        Completed_Date: [],
      };

      evtTmlt.Schedule = [{ SubSchedule }];
      // evtTmlt.Schedule['SubSchedule']  = evtTmlt.Schedule['sbSchTmlt']

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
        repe: Object.values(evtTmlt.Schedule[0])[0].Repe,
        sets: Object.values(evtTmlt.Schedule[0])[0].Sets,
        weight: Object.values(evtTmlt.Schedule[0])[0].Weight,
        duration: Object.values(evtTmlt.Schedule[0])[0].Duration,
      };

      FE_id_count++;

      // console.log(FE_row_OBJ);

      // console.log(ROWS);

      // setROWS([...ROWS, FE_row_OBJ])

      ROWS = [...ROWS, FE_row_OBJ];

      //Output to SQL

      outROWS = [...ROWS];
      // console.log(FE_row_OBJ, "NEW");
      console.log(evtTmlt, "??");

      //Add NEW Event into SQL template list
      getSecondMode.Events.push(evtTmlt);
      console.log(getSecondMode.Events);

      //Add updated Mode to SQL template List
      // delete drillDetail_OBJ_NEW.1
      console.log(drillDetail_OBJ_NEW);
      // drillDetail_OBJ_NEW[1] = {...getSecondMode}
      console.log("Updated", JSON.stringify(drillDetail_OBJ_NEW));

      // console.log("Back to Back", outROWS);

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

  function handleDeletefromShce() {
    // console.log(rowSelIndex);
    // console.log(ROWS, "Before Delete");
    // console.log("selected",rowSelID_Ctnt);

    for (let i = 0; i < rowSelID_Ctnt.length - 1; i++) {
      //Minus 1 is because of the last element is returned as concluded array

      // console.log(ROWS[rowSelID_Ctnt[i]]);
      // console.log(rowSelID_Ctnt[i],"lol");
      // console.log(typeof(ROWS[rowSelIndex[i]]));
      ROWS = ROWS.filter((ele) => ele.id !== rowSelID_Ctnt[i]);
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
    cnt++;
    setRenderROWS([...renderROWS, cnt]);
    // console.log("After Deleted",ROWS);
  }

  const columns_candidates = [
    {
      field: "ExerciseTitle",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
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
      editable: true,
    },
    {
      field: "sets",
      headerName: "Sets",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true,
    },
    {
      field: "weight",
      headerName: "Weight",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true,
    },
    {
      field: "duration",
      headerName: "Duration",
      type: "number",
      headerAlign: "left",
      align: "left",
      editable: true,
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

  // useEffect(() => {
  //   // console.log("1");
  //   if (renderROWS) {
  //     console.log("RE");
  //   }

  // });

  return (
    <Box m="20px">
      <Header title="Drill Mix" subtitle="Mixing Drill Mode" />

      <Box className="Mix-Container">
        {/* <Box className="Mix-Sidebar">
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
            </Box> */}

        {/* {   cand_render_limit > 2 ?
            foo(): makeCmpnt()  } */}

        {makeCmpnt()}

        {/* {console.log(firstCandRender)} */}
        <Box className="Mix-NewMode"> New Mode </Box>
      </Box>
    </Box>
  );
};

export default Mix;
