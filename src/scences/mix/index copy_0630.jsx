import { useEffect, useState, useRef, MouseEvent } from "react";

import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
} from "@mui/material";

import Select, { SelectChangeEvent } from "@mui/material/Select";

import dayjs, { Dayjs } from "dayjs";


import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

//External Function Variable
var dbFunctions = require("../../data/mixMainPageTestData"); //For Static Data Source

//General Purpose Variables
var FE_id_count = 0; // Mode Details Components Id Source
var CandiList_id_count = 0; // Mode Candidates Components Id Source

//Containers
var ROWS_cand = [];
var ROWS = []; //Event List in ONE MODE (front-end), Mode Details Component
var ROWS_list = []; //Event List for every modes (front-end)

// var outROWS = []; //Event List in ONE MODE after getting called to update

//Rendering Control
var cnt = 0; //Rerendering cmd
// var firstRender = true;
var firstRenderAll = true; //in makeCmpnt()
var firstDataFetch = true;
var sqlIn_Rerender = false; //The var controll that sql single record data is transferred to local, and then asks for a rerender

//Front-End Obj Copy
var drillDetail_JSON_SQL;
var drillDetail_OBJ_SQL;
var MY_Modes_List_OBJ_SQL = [];

var excList_SQL_list = []; //Nested Array, [[ExcList in Mode1], [ExcList in Mode2] ...]

var getSecondMode_SQL;
var excList_SQL;



var selcted = [];//Obtain sel from candidates

var gotAllInput = false

//Var use during development
var mc_monitor = 0;

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
    return false;
  }

  return typeof input[Symbol.iterator] === "function";
}

const Mix = () => {
  //Application Layer Variables
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //   const [firstRender, setFirstRender] = useState(true);

  // const [firstCandRender, setFirstCandRender] = useState(true);

  //Container
  const [rowSelIndex, setRowSelIndex] = useState([]);
  const [rowSelID_Ctnt, setRowSelID_Ctnt] = useState([]);

  // const [ROWS, setROWS] = useState([])

  //Rendering Control
  const [renderROWS, setRenderROWS] = useState([0]);

  // const [ROWS_done, setROWS_done] = useState([0]) //Auto-Rerendering after finish formROWS() (Call makeCmpnt())
  const [ROWS_candi_done, setROWS_candi_done] = useState([0]); //Auto-Rerendering after finish formEC_rows() (Call makeCmpnt())

  // const [cand2ScheProg, setCand2ScheProg] = useState([]);




//**************************************************** */
  //Dialog

  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(0);
  const [value, setValue] = useState(dayjs("2022-04-17"));

  const modeName_Dialog = useRef("")

  const [dialog_ReRender, setDialog_ReRender] = useState([0])

  // const gotAllInput = useRef(false)
 

  const handleChange = (event: SelectChangeEvent<typeof age>) => {
    setAge(Number(event.target.value) || "");
    console.log(event.target.value);
  };


  var recvData_startDate = ""
  var recvData_endDate = ""
  var recvData_repeDialog = ""
  var recvData_setsDialog = ""
  var recvData_weightDialog = ""
  var recvData_durationDialog = ""

  const startDateOnChange = (newValue) => {
    // console.log(Object.values(newValue));
    //[4]-[5]-[6] => MM-DD-YYYY
    var month = ""
    // console.log(Object.values(newValue)[4],Object.values(newValue)[5]+1,Object.values(newValue)[6])
    if(Object.values(newValue)[5]+1 < 10){
      month = `0${Object.values(newValue)[5]+1}`
    }

    recvData_startDate = `${Object.values(newValue)[4]}-${month}-${Object.values(newValue)[6]}`
    console.log(recvData_startDate);

  }

  const endDateOnChange = (newValue) => {

    //[4]-[5]-[6] => MM-DD-YYYY
    var month = ""
    if(Object.values(newValue)[5]+1 < 10){
      month = `0${Object.values(newValue)[5]+1}`
    }

    recvData_endDate = `${Object.values(newValue)[4]}-${month}-${Object.values(newValue)[6]}`
    console.log(recvData_endDate);
  }



  const repeOnChange = (newValue) => {
    recvData_repeDialog += Object.values(newValue)[3].data

    console.log(recvData_repeDialog);
    // console.log(Object.values(newValue)[4],Object.values(newValue)[5]+1,Object.values(newValue)[6])

  }


  const setOnChange = (newValue) => {
    recvData_setsDialog += Object.values(newValue)[3].data

    console.log(recvData_setsDialog);
    // console.log(Object.values(newValue)[4],Object.values(newValue)[5]+1,Object.values(newValue)[6])

  }

 
  const weightOnChange = (newValue) => {
    recvData_weightDialog += Object.values(newValue)[3].data

    console.log(recvData_weightDialog);
    // console.log(Object.values(newValue)[4],Object.values(newValue)[5]+1,Object.values(newValue)[6])

  }


  const durationOnChange = (newValue) => {
    recvData_durationDialog += Object.values(newValue)[3].data

    console.log(recvData_durationDialog);
    // console.log(Object.values(newValue)[4],Object.values(newValue)[5]+1,Object.values(newValue)[6])

  }

  const handleClickOpen = () => {
    setOpen(true);
  };


  // const goNext = useEffect(false)
  const handleDialogClose = (event) =>{

    // console.log("Input Received");
    console.log(recvData_durationDialog);
    console.log(recvData_startDate,
    recvData_endDate,
    recvData_repeDialog ,
    recvData_setsDialog ,
    recvData_weightDialog ,
    recvData_durationDialog);
    
    gotAllInput = true
    console.log("calllllllling",gotAllInput);
    
    setOpen(false)

    return gotAllInput

  }

  const handleDialogNext = ()=>{

    //Close this.dialog
    // clearTimeout(dialog_timer)
    setOpen(false)
    
  }

  const handleClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  function getDialogInput() {

    cnt++
    setRenderROWS([...renderROWS, cnt])
    var counter = 0
    while(!gotAllInput){
      counter++
      console.log(gotAllInput);

      // console.log("Colleting input");

      if(counter > 6000 ){
        return 0
      }

      
    }

    return 0
  }

  //**************************************************** */


  //SQL Data Source
  //SQL Single Record => Front-End Objects => Render on the browser
  async function getSingleRecord() {
    console.log("getSingleRecord() get called");
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

    //Decode Json -> Objects
    drillDetail_OBJ_SQL = JSON.parse(drillDetail_JSON_SQL);

    MY_Modes_List_OBJ_SQL = Object.values(drillDetail_OBJ_SQL);
    // console.log("Distributing ",MY_Modes_List_OBJ_SQL);

    var getMode_SQL_List = [];

    for (let i = 0; i < MY_Modes_List_OBJ_SQL.length; i++) {
      //Get objects in each mode
      var getMode = Object.values(drillDetail_OBJ_SQL)[i];
      var getMode_excList = Object.values(getMode.Events);
      // getMode_SQL_List.push(getMode)
      excList_SQL_list.push(getMode_excList);
    }

    // console.log("getSingleRecord() when init",excList_SQL_list);

    //Get Second Mode to Test
    getSecondMode_SQL = Object.values(drillDetail_OBJ_SQL)[1];

    excList_SQL = Object.values(getSecondMode_SQL.Events);
    console.log("Got data from SQL in getsingle() ", excList_SQL);
    // setRenderROWS([...renderROWS, cnt]);
    // cnt++

    //Async Control in MakeCmpnt()
    //FormRows() gets called if only SQL data transfer gets done
    sqlIn_Rerender = true;

    console.log("Going to Call makeCmpnt in singleRecord");
    makeCmpnt(mc_monitor);

    console.log("getSingleRecord End");
  }

  //************************Static Data Source For Debuging
  // var drillDetail_OBJ_NEW = JSON.parse(
  //   dbFunctions.drillDetail_jsonTemplate_NEW
  // );

  // var MY_Modes_List_OBJ = Object.values(drillDetail_OBJ_NEW);
  // console.log("MODES:", MY_Modes_List_OBJ);

  // var getSecondMode = Object.values(drillDetail_OBJ_NEW)[1];
  // console.log("MODE-Detail:", getSecondMode);

  //All Exercises in ONE mode
  // var excList = Object.values(getSecondMode.Events);
  // console.log("ExcList", excList);

  //********** End Of Static Template Data Object *********/

  //Components, Data, etc. Construction (Back-End Operation)

  function makeCmpnt(inc) {
    //The list storing the Front-End components
    var cmpntList = [];

    console.log("makeCmpnt() called", inc);

    // if(shit){
    //   formRows();
    // }

    // console.log("making out");
    // console.log(MY_Modes_List_OBJ_SQL);

    //Update cand_render_limit
    // cand_render_limit++;

    // console.log("Start to generate Component");

    // console.log(MY_Modes_List_OBJ);

    if (MY_Modes_List_OBJ_SQL.length === 0) {
      console.log("Loading Page", inc);
      //If there is no data in front-end object, loading "loading" page
      var id_sb = "Mix-Sidebar-cmpnt-Loading";
      var id_md = "Mix-Detail-cmpnt-Loading";

      var cmpnt_sb = (
        <Box key={id_sb} className="Mix-Sidebar">
          Mix Sidebar
          <Box className="Mix-Sidebar-Candidates">Loading</Box>
        </Box>
      );

      var cmpnt_md = (
        <Box key={id_md} className="Mix-Detail">
          <Box className="Mix-Detail-Record">
            Status (Running), Mode Created, Last Modified,{" "}
          </Box>

          <Box className="Mix-Detail-Content">Loading</Box>
        </Box>
      );

      cmpntList.push(cmpnt_sb);
      cmpntList.push(cmpnt_md);
    } else {
      //List is not empty && sql data is fully tranferred in

      if (sqlIn_Rerender) {
        formEC_row(); //SQL -> Candidate Front End
        formRows(inc);

        sqlIn_Rerender = false;
      }

      for (let i = 0; i < ROWS_list.length; i++) {
        var id_sb = "Mix-Sidebar-cmpnt-" + i;
        var id_md = "Mix-Detail-cmpnt-" + i;

        var mode_date_msg = "";

        for (let d of MY_Modes_List_OBJ_SQL[i].Schedule_Dates) {
          mode_date_msg += ` ${d}`;
        }

        var cmpnt_sb = (
          <Box key={id_sb} className="Mix-Sidebar">
            Mix Sidebar
            <Box className="Mix-Sidebar-ModeInfo">
              <Box className="Mix-Sidebar-ModeInfo-ID">
                Mode ID: {MY_Modes_List_OBJ_SQL[i].ModeID}
              </Box>
              <Box className="Mix-Sidebar-ModeInfo-Name">
                Mode Name: {MY_Modes_List_OBJ_SQL[i].ModeTitle}
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

              
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                {/* <DialogTitle>Repe</DialogTitle> */}
                <DialogContent>
                  
                  {modeName_Dialog.current}

                  {recvData_repeDialog = ""}
                  {recvData_setsDialog = ""}
                  {recvData_weightDialog = ""}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Schedule Starts On"
                      value={value}
                      onChange={(newValue) => startDateOnChange(newValue)}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Schedule Ends On"
                      value={value}
                      onChange={(newValue) => endDateOnChange(newValue)}
                    />
                  </LocalizationProvider>

                  <TextField
                    id="outlined-multiline-flexible"
                    label="Repetition"
                    multiline
                    onChange={(newValue) => repeOnChange(newValue)}
                  
                  />
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Set"
                    multiline
                    onChange={(newValue) => setOnChange(newValue)}
                  />
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Weight"
                    multiline
                    onChange={(newValue) => weightOnChange(newValue)}
                  />
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Duration"
                    multiline
                    onChange={(newValue) => durationOnChange(newValue)}
                  />
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  {/* {
                    console.log("len", selcted.length)
                  } */}
                  {
                    selcted.length > 1 ?
                    <Button onClick={handleDialogNext}>Next</Button> :
                    <Button onClick={handleDialogClose}>Ok</Button>

                  }
                  
                </DialogActions>
              </Dialog>
             

              <button
                onClick={(ele) => {
                  addCand2Sche_Dialog(ele);
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
              <Box className="Mix-Detail-Record-ID">
                Mode ID: {MY_Modes_List_OBJ_SQL[i].ModeID}
              </Box>
              <Box className="Mix-Detail-Record-Name">
                Mode Name: {MY_Modes_List_OBJ_SQL[i].ModeTitle}
              </Box>
              Status (Running), Mode Created, Last Modified,{" "}
            </Box>

            <Box className="Mix-Detail-Content">
              {/* Handle Empty Mode */}
              {ROWS_list[i].length > 0 ? (
                <DataGrid
                  checkboxSelection
                  key="DataGrid-Mix-Detail"
                  rows={ROWS_list[i]}
                  columns={MixContent_Columns}
                  onRowSelectionModelChange={(sel) => {
                    //  console.log("click",sel);
                    setRowSelID_Ctnt([]);
                    for (let ele in sel) {
                      setRowSelID_Ctnt([...sel, sel]);
                    }
                  }}
                />
              ) : (
                <Box>Schedule in this Mode is Not Found</Box>
              )}
            </Box>

            <Box className="Mix-Detail-Operation">
              <button
                onClick={(ele) => {
                  handleDeletefromShce(ele);
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
    }
    mc_monitor++;
    return cmpntList;
  }

  async function formEC_row() {
    console.log("formEC_row get called");

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

    console.log("formEC done, Rerendering to call makeCmpnt()");

    setROWS_candi_done([...ROWS_candi_done]);

    // setFirstCandRender(false)
  }

  async function formRows(inc) {
    // setROWS([])

    console.log("formRows() Called", inc);
    console.log(excList_SQL_list);

    //Conversion Back->Front
    try {
      //Traverse all modes
      // mode === excList_SQL
      for (let mode of excList_SQL_list) {
        ROWS = [];

        // //Traverse exercises in one mode
        for (let exe of mode) {
          var tmplt = {
            id: FE_id_count++,
            exercise_name: "",
            repe: 0,
            sets: 0,
            weight: 0,
            duration: 0,
          };

          //Check if this is an EMPTY but created Mode
          if (Object.keys(exe.Exercise).length !== 0) {
            // console.log(exe.Exercise);

            tmplt.exercise_name = exe.Exercise.ExerciseTitle;
            tmplt.repe = exe.Schedule[0].SubSchedule.Repe;
            tmplt.sets = exe.Schedule[0].SubSchedule.Sets;
            tmplt.duration = exe.Schedule[0].SubSchedule.Duration;

            ROWS.push(tmplt);
          } else {
          }
        }

        ROWS_list.push(ROWS);
      }

      console.log(ROWS_list);

      // for (let exe of excList_SQL) {
      //   var tmplt = {
      //     id: FE_id_count++,
      //     exercise_name: "",
      //     repe: 0,
      //     sets: 0,
      //     weight: 0,
      //     duration: 0,
      //   };

      //   // console.log(exe.Exercise.ExerciseTitle);
      //   tmplt.exercise_name = exe.Exercise.ExerciseTitle;
      //   tmplt.repe = exe.Schedule[0].SubSchedule.Repe;
      //   tmplt.sets = exe.Schedule[0].SubSchedule.Sets;
      //   tmplt.duration = exe.Schedule[0].SubSchedule.Duration;

      //   ROWS.push(tmplt);
      //   // console.log("FormROWS() done, call makeCmpnt to Rerendering");
      //   // setROWS_done([...ROWS_done])
      // }
    } catch (error) {
      console.log("Error in FormEC_Row()", error);
    }

    // var row = []
    // console.log(++FE_id_count);
    // console.log();

    // var thisID = FE_id_count++

    // console.log(tmplt);

    // return ROWS

    // return tmplt
  }

  //Operation Callback Functions

  var init_addCall = true
  var counter = 0
  var modeIndex

  async function addCand2Sche_Dialog(element) {

    counter ++
    if(counter > 10){
      return
    }


    
   
    if(init_addCall){
      var cmpntText = element.currentTarget.parentNode.parentNode.innerHTML;

    //Get Mode Name
    var MName_startPos = cmpntText.search("Mode Name"); //Find start position of "Mode Name"

    var msg = "";
    for (let i = MName_startPos; i < MName_startPos + 150; i++) {
      //Obtain the following alphabet from the start position
      msg += cmpntText[i];
    }
    var MName_endPos = msg.search("</div><div"); //Find end position

    var thisModeName = "";
    // i = 11 because the title takes on 10 bits
    for (let i = 11; i < MName_endPos; i++) {
      thisModeName += msg[i];
    }

    //Get Mode Id

    var MId_startPos = cmpntText.search("Mode ID");
    msg = "";
    for (let i = MId_startPos; i < MId_startPos + 150; i++) {
      msg += cmpntText[i];
    }

    var MId_endPos = msg.search("</div><div");

    var thisModeID = "";
    for (let i = 9; i < MId_endPos; i++) {
      // i = 9 because the title takes on 8 bits
      thisModeID += msg[i];
    }

        //Get Index in ROWS_list
        modeIndex = thisModeID.match(/\d/)[0] - 1
        // console.log(modeIndex);

    init_addCall = false

    }
    

    // console.log(thisModeName);
    // console.log(thisModeID);

    var dup = false





    //Update Rerender Command


    //Obtain sel from candidates
    var selcted = [];

    // console.log(rowSelIndex);
    // console.log(ROWS_cand);

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



    setOpen(true)


 

    console.log("Promise soon", gotAllInput);

    let p = new Promise((resolve,reject)=>{

      if(gotAllInput){
          resolve("resolve")
      }
      else{
          reject()
      }
    })

      p.then(()=>{
          console.log("Got Input", counter);
          
       
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
      
            //Check if the row is valid to added
            //    for (let row of ROWS){
      
            //     if(evtTmlt.Exercise.ExerciseTitle === row.exercise_name){
            //         console.log("BEEP");
            //     }
      
            //    }
      
            //Start of building object for front-end display
      
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
          
      
            console.log("New FE objects", FE_row_OBJ);
      
            //Check duplicate exercises

            console.log("Can you run this")
            console.log(ROWS_list[modeIndex].length);
           
            for (let i = 0; i < ROWS_list[modeIndex].length; i++) {
      
              if(ROWS_list[modeIndex][i].exercise_name === FE_row_OBJ.exercise_name
                  && ROWS_list[modeIndex][i].repe === FE_row_OBJ.repe 
                  && ROWS_list[modeIndex][i].sets === FE_row_OBJ.sets
                  && ROWS_list[modeIndex][i].weight === FE_row_OBJ.weight
                  && ROWS_list[modeIndex][i].duration === FE_row_OBJ.duration){
                    dup = true
                    alert("Duplicated")
              }
      
                // console.log("Before ",ROWS_list[modeIndex][i]);
              
            }
      
            if(!dup){  
            setOpen(false)
            ROWS_list[modeIndex] = [...ROWS_list[modeIndex], FE_row_OBJ ]}
          
      
            // ROWS = [...ROWS, FE_row_OBJ];
      
            //Output to SQL
      
            // outROWS = [...ROWS];
            // console.log(FE_row_OBJ, "NEW");
          
            console.log(evtTmlt, "??");
      
            //Add NEW Event into SQL template list
            Object.values(drillDetail_OBJ_SQL)[modeIndex].Events.push(evtTmlt);
            console.log("Ready to add to SQL", Object.values(drillDetail_OBJ_SQL)[modeIndex].Events);}

            console.log("Resolve Ends");

      }).catch(()=>{

          setTimeout(()=>{
              console.log("Waiting",counter);
              addCand2Sche_Dialog()
            
              // return 
          },2000)
          
      })


    console.log("After Promise");
    cnt++
    setRenderROWS([...renderROWS, cnt]);

    //Format Schedule

    // console.log(excList);
    // var tmpSche_start = prompt('Schedule Start (YYYY-MM-DD)')
    // var tmpSche_end = prompt('Schedule End')
    // var tmpSche_repe = prompt('Repe')
    // var tmpSche_sets = prompt('Sets')
    // var tmpSche_weight = prompt('Weight')
    // var tmpSche_duration = prompt('Duration')


      //Add updated Mode to SQL template List
      // delete drillDetail_OBJ_NEW.1
      // console.log(drillDetail_OBJ_NEW);
      // drillDetail_OBJ_NEW[1] = {...getSecondMode}



      //SQL
      if(!dup){
        const newData = await fetch("/updateSR", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(drillDetail_OBJ_SQL),
        }).then((res) => res.json()) // parses JSON response into native JavaScript objects

      }


      // console.log(newData, 'from Upload SQL function')

      //Request Rerdering for updated Mix Details
      // sqlIn_Rerender = true
      // makeCmpnt()

    
    

    //Update Database
    // excList.push(evtTmlt)
    // console.log(excList);

    //Display on the front end

    
     
    

    // console.log(ROWS);

    // console.log(excList);
  }

  async function handleDeletefromShce(element) {
    // console.log(rowSelIndex);
    // console.log(ROWS, "Before Delete");
    // console.log("selected",rowSelID_Ctnt);




    var cmpntText = element.currentTarget.parentNode.parentNode.innerHTML;
    //Get Mode Name
    var MName_startPos = cmpntText.search("Mode Name"); //Find start position of "Mode Name"

    var msg = "";
    for (let i = MName_startPos; i < MName_startPos + 150; i++) {
      //Obtain the following alphabet from the start position
      msg += cmpntText[i];
    }
    var MName_endPos = msg.search("</div>"); //Find end position

    var thisModeName = "";
    // i = 11 because the title takes on 10 bits
    for (let i = 11; i < MName_endPos; i++) {
      thisModeName += msg[i];
    }

    //Get Mode Id

    var MId_startPos = cmpntText.search("Mode ID");
    msg = "";
    for (let i = MId_startPos; i < MId_startPos + 150; i++) {
      msg += cmpntText[i];
    }

    var MId_endPos = msg.search("</div><div");

    var thisModeID = "";
    for (let i = 9; i < MId_endPos; i++) {
      // i = 9 because the title takes on 8 bits
      thisModeID += msg[i];
    }

    var targetEle; // The element will be deleted
    var targetEle_List = []; // Elements will be deleted

    //Filter Number Index 
    var modeIndex = thisModeID.match(/\d/)[0] - 1

    var ROWS_tmpCopy = [...ROWS_list[modeIndex]]; //Create a copy of file for filtering

    var thisMode_OBJ = Object.values(drillDetail_OBJ_SQL)[modeIndex]

    for (let i = 0; i < rowSelID_Ctnt.length - 1; i++) {
      //Minus 1 is because of the last element is returned as concluded array

      //Obtain the element is deleting
      targetEle = ROWS_tmpCopy.filter((ele) => ele.id === rowSelID_Ctnt[i]);

      targetEle_List.push(targetEle)

      ROWS_tmpCopy = [...ROWS_list[modeIndex]]

      //Obtain the rest of list (Front-End)
      ROWS_list[modeIndex] = ROWS_list[modeIndex].filter((ele) => ele.id !== rowSelID_Ctnt[i]);

   
    
      

    }

    // console.log(ROWS_list[modeIndex]);
    cnt++;
    setRenderROWS([...renderROWS, cnt]);


   for (let i = 0; i < targetEle_List.length; i++) {
      // console.log(targetEle_List[i][0].exercise_name);
      // console.log( thisMode_OBJ.Events);
      thisMode_OBJ.Events = thisMode_OBJ.Events.filter(
        (ele)=>ele.Exercise.ExerciseTitle !== targetEle_List[i][0].exercise_name )
    
   }

    // console.log(thisMode_OBJ.Events);
    // console.log(drillDetail_OBJ_SQL);

    const newData = await fetch("/updateSR", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(drillDetail_OBJ_SQL),
    }).then((res) => res.json());

    // console.log(targetEle);

    // console.log(ROWS);

    //Rendering Page
 

    //Deleting Element in Local Object List
    // console.log("current in delete", drillDetail_OBJ_SQL);
    


    //Delete Element in SQL
    //In this case, perform UpdateAsDelete

    // console.log(targetEle_List);
    // console.log(ROWS_list[modeIndex]);
    // console.log(Object.values(drillDetail_OBJ_SQL)[modeIndex]);

    // console.log("After Deleted",ROWS);
  }

  //Front-End Data Format
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

  //Page Initialization
  if (firstDataFetch) {
    getSingleRecord();
    firstDataFetch = false;
  }

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

        {/* { shit ?
        makeCmpnt() : <Box> Loading</Box>} */}


        {makeCmpnt(mc_monitor)}

        {/* {console.log(firstCandRender)} */}
        <Box className="Mix-NewMode"> New Mode </Box>
      </Box>
    </Box>
  );
};

export default Mix;
