import { useEffect, useState,MouseEvent } from "react";


import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {Button} from "@material-ui/core"
import { ToggleButton, ToggleButtonGroup, TextField, Alert  } from '@mui/material';

import { tokens } from "../../theme";

import Header from "../../components/Header";
import { ConstructionOutlined, Margin } from "@mui/icons-material";

import {mockDataTeam} from "../../data/mockData"

import {DataGrid, gridSortColumnLookupSelector} from "@mui/x-data-grid"
import Checkbox from "../../components/CustomCheckBox"



import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import e from "cors";
import styled from "@emotion/styled";


var isAppStart = true
var allExercisesList = []
const waitingExercisesList = []

const SQL = () =>{


 

    //Auto Fetch ALL Exercises When Component Starts
    
    // const [allExercises, setAllExercises] = useState([])
    const getALL = async(event: MouseEvent,
        newAlignment: string
        ) =>{

            // console.log("Info from the front end",exercise)

           

            const newData = await fetch('/getALL',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json()) // parses JSON response into native JavaScript objects
            console.log(newData, 'from GETall function')

            // var tmpList = []
            newData.map((e)=>{
                // console.log([{...e}])
                allExercisesList.push({...e})
                // setAllExercises([...allExercises, e])
            })

            // setAllExercises([...tmpList])
            
      
       

            

            //Update when SQL database is not empty
            // if(newData.length > 0){
            //     setReturnedData(newData[0])
            // }

            //Avoid repeatedly log backend data to frontend
            // if(newData.length !== 0){

            //     for(let e of newData){
            //         let tmp = {...e}
        
            //         setSqlRows((sqlRows) =>[...sqlRows,{Name: tmp.Name, Repe: tmp.Repe, Sets: tmp.Sets, Weight: tmp.Weight, Exercise_ID: tmp.Exercise_ID, Comment: tmp.Comment}])
        
            //         // console.log(tmp)
            //     }

            //     setPrevLen(newData.length)

            // }else{

            //     alert("Databas may be empty")

            // }
        
            // setSqlView(true)
            // renderDiagramContent()


            

    }



    //Front-End Global Variables
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    // *********

    const [prevLen, setPrevLen] = useState(0) //Avoid to log backend data to the frontend repeatedly
    const [sqlView, setSqlView] = useState(false) //Display sql-based chart or not

    const [sqlRows, setSqlRows] = useState([{Name: 'Something', Repe: 3, Sets: 14, Weight: 20, Exercise_ID: 'Test'}])
    
    const [singleRow, setSingleRow] = useState({})
    
    const [test, setTest] = useState([])


    const [btnSelColor, setBtnSelColor] = useState('tmp')
    const [isNEWcalled, SetisNEWcalled] = useState(false)
    const [isDEL_rowsCalled, setIsDEL_rowsCalled] = useState(false)
    
    const [exTypeNow, setExTypeNow] = useState('')

    const [rowsSel, setRowsSel] = useState([]) //State of Multi Row Selected in the data grid

    const[addConfirmCmp, setAddConfirmCmp] = useState() //NEW Exercises Confirmation Message Component

    const [diagramOpList, setDiagramOpList] = useState([]) //Dynamically add Delete button components
    const [chartWarning, setChartWarning] = useState([])//Chart Warning Component
    const [delConfirmCmp, setDelConfirmCmp] = useState() //Chart Deleted Confirm Component
    const [isWarnPopped, setIsWarnPopped] = useState(false) //State to handle second-click on "Delete" Button
    const [cancelBtnComp, setCancelBtnComp] = useState()

    //Back-End Functional Variables (TEST)
    const [returnedData, setReturnedData] = useState(['Hello'])
    // const [exercise, setExercise] = useState({Name: '', Repe: 0, Sets: 0, Weight: 0, Exercise_ID: '', Comment: null}) //For INPUT real-time input
    // const [exercise, setExercise] = useState({Name: 'Do', Repe: 12, Sets: 10, Weight: 10, Exercise_ID: 'U 7', Comment: null}) //For INPUT real-time input

    const [exercise, setExercise] = useState({}) //For INPUT real-time input


    //Component Initialization
    if(isAppStart){
        getALL()
        isAppStart = false

    }
 

    var sqlColumns = [
        {
            field: "Exercise_ID",
            headerName: "Exercise ID",
            flex: 1,
          },
        {
            field: "Name",
            headerName: "Exercise Name",
            flex: 1,
            cellClassName: "name-column--cell",
          },
          {
            field: "Repe",
            headerName: "Repe",
            type: "number",
            headerAlign: "left",
            align: "left",
          },
          {
            field: "Sets",
            headerName: "Set",
            type: "number",
            headerAlign: "left",
            align: "left",
          },
          {
            field: "Weight",
            headerName: "Weight",
            type: "number",
            headerAlign: "left",
            align: "left",
          },
          {
            field: "Comment",
            headerName : "Comment",
            headerAlign: "left",
            align: "left"
          },
        //     { 
        //     field: "Actions",
        //     headerName: "Actions",
        //     width:100,
        //     renderCell: (params) =>{
        //         return(

        //             <Box>
        //                 <button onClick={()=>{{editRow()}}}>
        //                 Edit
        //                 </button>

        //                 <button>
        //                 X
        //                 </button>
        //             </Box>
  
                    
        //         )
        //     }
        //   }
   ,
       
    ]



    //SQL Operations TEST

    const setInput = (event) =>{
        //Destruction
        const{name, value} = event.target
        console.log(name, value)


        //(Early-Return if-else statement)
        // Convert Value to Correct Type
        if(name === 'Repe' || name === "Sets" || name === "Weight"){
            setExercise(prevState => ({
                ...prevState,
                [name]: parseInt(value)
            }))

            return
        }
        setExercise(prevState => ({
            ...prevState,
            [name]: value
        }))
        
        

    }


    const kickSQL = async() => {
        // const config    = require ('../../data/sql/dbConfig')
        // var sql = require('mssql')
        // var sql = require('mssql/msnodesqlv8')
                //sql     = require('mysql')
    
        // const re  = require('../../server')
    
        // console.log(re)
    
        console.log("Info from the front end",exercise)

        const newData = await fetch('/api',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: exercise.Name
            })
        })
        .then(res => res.json()) // parses JSON response into native JavaScript objects
        console.log(newData, 'from KickSQL function')

        //Update when SQL database is not empty
        if(newData.length > 0){
            setReturnedData(newData[0])
        }

        //Avoid repeatedly log backend data to frontend
        if( prevLen !== newData.length){

            for(let e of newData){
                let tmp = {...e}
    
                setSqlRows((sqlRows) =>[...sqlRows,{Name: tmp.Name, Repe: tmp.Repe, Sets: tmp.Sets, Weight: tmp.Weight, Exercise_ID: tmp.Exercise_ID}])
    
                // console.log(tmp)
            }

            setPrevLen(newData.length)

        }else if(newData.length === 0){

            alert("Databas may be empty")

        }
     
        setSqlView(true)
       
   
    
    }

    const upload2SQL = async() => {

        console.log("Upload Request from Client");

        const newData = await fetch('/upload',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                ...exercise
            })
        })
        .then(res => res.json()) // parses JSON response into native JavaScript objects
        console.log(newData, 'from Upload SQL function')

        //Update when SQL database is not empty
        if(newData.length > 0){
            setReturnedData(newData[0])
        }

    }

    const clearSQL = async() =>{

        console.log("Clear Request from Client");

        const newData = await fetch('/clear',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json()) // parses JSON response into native JavaScript objects
        console.log(newData, 'from Delete SQL function')


        
    }

    // **************************
 




    //Component Funtions 
    const btnOnClick_UB = async(event: MouseEvent,
        newAlignment: string
        ) =>{

            setBtnSelColor(newAlignment)

            setExTypeNow("Upper Body")

            setSqlRows([])
            SetisNEWcalled(false)
            setDiagramOpList([]) //Hide Delete Button
            setChartWarning([]) //Hide Warning
            setDelConfirmCmp() //Hide Delete Confirmation Warning
            setCancelBtnComp() //Hide cancel Button
            setIsWarnPopped(false) //Withdraw warning
            console.log("Info from the front end",exercise)

            const newData = await fetch('/api',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json()) // parses JSON response into native JavaScript objects
            console.log(newData, 'from BB_change function')

            //Update when SQL database is not empty
            if(newData.length > 0){
                setReturnedData(newData[0])
            }

            //Avoid repeatedly log backend data to frontend
            if(newData.length !== 0){

                for(let e of newData){
                    let tmp = {...e}
        
                    setSqlRows((sqlRows) =>[...sqlRows,{Name: tmp.Name, Repe: tmp.Repe, Sets: tmp.Sets, Weight: tmp.Weight, Exercise_ID: tmp.Exercise_ID, Comment: tmp.Comment}])
        
                    // console.log(tmp)
                }

                setPrevLen(newData.length)

            }else{

                alert("Databas may be empty")

            }
        
            setSqlView(true)
            // renderDiagramContent()

    }

    const btnOnClick_LB = async(event: MouseEvent
        ) =>{

            SetisNEWcalled(false)
            setExTypeNow("Lower Body")
            setSqlRows([])
            setDiagramOpList([]) //Hide Delete Button
            setChartWarning([]) //Hide Warning
            setDelConfirmCmp() //Hide Delete Confirmation Warning
            setCancelBtnComp() //Hide cancel Button
            setIsWarnPopped(false) //Withdraw warning

            console.log("Info from the front end",exercise)

            const newData = await fetch('/getLBE',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json()) // parses JSON response into native JavaScript objects
            console.log(newData, 'from 123 function')

            //Update when SQL database is not empty
            if(newData.length > 0){
                setReturnedData(newData[0])
            }

            //Avoid repeatedly log backend data to frontend
            if( newData.length !== 0){

                for(let e of newData){
                    let tmp = {...e}
        
                    setSqlRows((sqlRows) =>[...sqlRows,{Name: tmp.Name, Repe: tmp.Repe, Sets: tmp.Sets, Weight: tmp.Weight, Exercise_ID: tmp.Exercise_ID, Comment: tmp.Comment}])
        
                    // console.log(tmp)
                }

                setPrevLen(newData.length)

            }else{

                alert("Databas may be empty")

            }
            
            
            setSqlView(true)

    }

    const btnOnClick_PT = async(event: MouseEvent
        ) =>{

            setExTypeNow("PT")
            setSqlRows([])
            SetisNEWcalled(false)
            setDiagramOpList([]) //Hide Delete Button
            setChartWarning([]) //Hide Warning
            setDelConfirmCmp() //Hide Delete Confirmation Warning
            setCancelBtnComp() //Hide cancel Button
            setIsWarnPopped(false) //Withdraw warning

            console.log("Info from the front end",exercise)

            const newData = await fetch('/getPTE',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json()) // parses JSON response into native JavaScript objects
            console.log(newData, 'from 123 function')

            //Update when SQL database is not empty
            if(newData.length > 0){
                setReturnedData(newData[0])
            }

            //Avoid repeatedly log backend data to frontend
            if(newData.length !== 0){

                for(let e of newData){
                    let tmp = {...e}
        
                    setSqlRows((sqlRows) =>[...sqlRows,{Name: tmp.Name, Repe: tmp.Repe, Sets: tmp.Sets, Weight: tmp.Weight, Exercise_ID: tmp.Exercise_ID, Comment: tmp.Comment}])
        
                    // console.log(tmp)
                }

                setPrevLen(newData.length)

            }else{

                alert("Databas may be empty")

            }
        
            setSqlView(true)

    }

    const btnOnClick_BS = async(event: MouseEvent
        ) =>{

            setExTypeNow("Basketball Skill")
            SetisNEWcalled(false)
            setSqlRows([])
            setDiagramOpList([]) //Hide Delete Button
            setChartWarning([]) //Hide Warning
            setDelConfirmCmp() //Hide Delete Confirmation Warning
            setCancelBtnComp() //Hide cancel Button
            setIsWarnPopped(false) //Withdraw warning
      

            console.log("Info from the front end",exercise)

            const newData = await fetch('/getBSE',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json()) // parses JSON response into native JavaScript objects
            console.log(newData, 'from 123 function')

            //Update when SQL database is not empty
            if(newData.length > 0){
                setReturnedData(newData[0])
            }

            //Avoid repeatedly log backend data to frontend
            // if( prevLen !== newData.length)
            if(newData.length !== 0){

                for(let e of newData){
                    let tmp = {...e}
        
                    setSqlRows((sqlRows) =>[...sqlRows,{Name: tmp.Name, Repe: tmp.Repe, Sets: tmp.Sets, Weight: tmp.Weight, Exercise_ID: tmp.Exercise_ID, Comment: tmp.Comment}])
        
                    // console.log(tmp)
                }

                setPrevLen(newData.length)

            }else{

                alert("Databas may be empty")

            }
   

            setTimeout(()=>setSqlView(true),300)
            

    }

    const btnOnClick_NEW = async() =>{

       
       SetisNEWcalled(!isNEWcalled)
       setSqlView(false)
       setChartWarning([]) //Hide Warning
       setDelConfirmCmp() //Hide Delete Confirmation Warning
       setCancelBtnComp() //Hide cancel Button
       setIsWarnPopped(false) //Withdraw warning
       



    }

    const btnOnClick_UploadTo = async(TargetTable) =>{

        // console.log(TargetTable);


        try {
            console.log("Upload Request from Client");
            console.log(typeof(exercise.Exercise_ID),"ha")

            if(typeof(exercise.Name) !== "string" || typeof(exercise.Repe) !== "number" || typeof(exercise.Sets) !== "number" || typeof(exercise.Weight) !== "number"  || typeof(exercise.Exercise_ID) !== "string" ){
                setAddConfirmCmp([<Alert severity="error" key="newWarnFail" value="rowOpWarn" ><Typography key="newWarnFailFont" >Incorrect Input</Typography></Alert>])
                setTimeout(()=>{
                    setAddConfirmCmp()
                }, 3000)
    
                // console.log(exercise,typeof(exercise.Name),typeof(exercise.Repe),typeof(exercise.Sets),typeof(exercise.Weight), typeof(exercise.Exercise_ID))
    
                return
    
            }

            const newData = await fetch('/uploadTo',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                ...exercise,
                TargetTable
                })
                          
            })
            .then(res => res.json()) // parses JSON response into native JavaScript objects
            console.log(newData, 'from Upload SQL function')

            //Update when SQL database is not empty
            if(newData.length > 0){
                setReturnedData(newData[0])
            }
                
        } catch (error) {

            setAddConfirmCmp([<Alert severity="error" key="newWarnFail" value="rowOpWarn" ><Typography key="newWarnFailFont" >`Fail To Add New Event ${error}`</Typography></Alert>])
            setTimeout(()=>{
                setAddConfirmCmp()
            }, 2000)
        }
        

        setAddConfirmCmp([<Alert severity="success" key="newWarnPass" value="rowOpWarn" ><Typography key="newWarnPassFont" >Event is Added</Typography></Alert>])

        setTimeout(()=>{
            setAddConfirmCmp()
        }, 2000)

        setExercise({}) //Clear State After Upload
    }


    const btnOnClick_Delete = async(targetTable, rows) =>{

        // console.log(targetTable);
        // console.log(rows);
        console.log("Delete Request from Client");

        setIsDEL_rowsCalled(false) //Once the correct rowsSel being parsed into, end the "clicked" session
        setExercise()


        //Fetch specific exercises need operation by ID
        // let tmpList = Object.values(allExercises)

        
        let resList = [] //The Objects'Name Need To Be Deleted
        let resList_obj = []

        
        for(let exe of allExercisesList){
   

            for(let row of rows){


                if(exe.Exercise_ID === row){
                    
                    console.log(exe)
                    resList.push(exe.Name)
                    resList_obj.push(exe)
                   
                   

                }
            }

        }
        
       
        setChartWarning([<Alert severity="error" key="rowOpWarn" value="rowOpWarn" ><Typography key="warnFont" >Confirm to DELETE Exercise [ {resList.join()}] ?</Typography></Alert>])
        if(!isWarnPopped){
            setCancelBtnComp(<ToggleButton key="cancelBtn" onClick={()=>{cmpFun_cacelWarning()}}><Typography key="cancelFont">Cancel</Typography></ToggleButton>)
            setIsWarnPopped(true)
            return
        }



        //If it's second click
        if(isWarnPopped){

            try {
                console.log("Ready to Kill them in SQL")

                for(let i = 0; i < resList_obj.length; i++){

                    
                    console.log("Deleting")
                    console.log(resList_obj[i]);

                    // setExercise(exercise=>({...resList_obj[i]}))
                    



                    
                    
                    //Remove in SQL
                    const newData = await fetch('/clearWcond',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body:JSON.stringify({
                            ...resList_obj[i],
                            targetTable
                            })
                            
                            
                    })
                    .then(res => res.json()) // parses JSON response into native JavaScript objects
                    console.log(newData, 'from Delete SQL function')
            
                    //Update when SQL database is not empty
                    if(newData.length > 0){
                        setReturnedData(newData[0])
                    }  


                    //Update Front-End Data

                    let indexOfTarget = allExercisesList.map(e => e.Name).indexOf(resList_obj[i].Name)
                    console.log(allExercisesList.map(e => e.Name).indexOf(resList_obj[i].Name))
                    allExercisesList = allExercisesList.slice(0, indexOfTarget).concat(allExercisesList.slice(indexOfTarget+1,allExercisesList.length))

                    
                    console.log(allExercisesList,"emm")

                    //UpdateState
                    setIsWarnPopped(false)
                    

                }
                
            } catch (error) {

                setChartWarning([<Alert severity="error" key="rowOpWarn" value="rowOpWarn" ><Typography key="warnFont" >Error Occured When Deleting in SQL</Typography></Alert>])
                
            }






            //Update Warning
            setDelConfirmCmp([<Alert severity="success" key="rowOpWarnPass" value="rowOpWarn" ><Typography key="warnFont" >Deleted, Refresh In Seconds</Typography></Alert>])
            setChartWarning([])

            //Delay to Refresh for Confirmation Displaying
            setTimeout(()=>{

                //Rerender Componnet
                switch(targetTable){
                    case "Upper Body":
                        btnOnClick_UB()
                        break
                    case "Lower Body":
                        btnOnClick_LB()
                        break
                    case "PT":
                        btnOnClick_PT()
                        break
                    case "Basketball Skill":
                        btnOnClick_BS()
                        break
                }


            },2000)


          

        }

        // console.log(allExercises)

        // for(let row of rows){
        //     if(allExercisesList.filter( e => e.Exercise_ID === row).length>0){
        //        console.log(e);
        //     }
           
        // }

        // console.log(tmpList)

      
    }




    function cmpFun_cacelWarning(){
        setCancelBtnComp()
        setChartWarning([])
        setIsWarnPopped(false)
        setDelConfirmCmp() //Hide Delete Confirmation Warning

    }




    // Chart Operations
    const editRow = async() =>{

        
        console.log("Edit Row Request from Client");
        // console.log(document.getElementById('i_EN'))
        // console.log(exercise.Name);

        // console.log(singleRow.Name)
        
        const newData = await fetch('/edit',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Weight: exercise.Weight
                // Weight: 0
            })
        })
    }



    useEffect(()=>{

        if(isDEL_rowsCalled){
            btnOnClick_Delete(exTypeNow, rowsSel)
        }

        // if(exercise !== undefined){
        //     console.log(exercise, "+++")
        // }

        // if(!isAppStart){
        //     console.log(allExercises);
        // }

        
    })

    return(
        
        <Box m="20px">
            
            <Header title="SQL" subtitle="Smash Grind in SQL"/>
  
     
 
            
            {/* <Box display="grid" justifyContent="center" alignContent="center" mb="40px">
                
                <Box mb="40px" display="grid">
                    <button onClick={() => clearSQL()}>Switch</button>
                    <button onClick={() => kickSQL()}>Kick SQL</button>
                    <button onClick={() => testSQL()}>Test SQL</button>
                    <button onClick={() => upload2SQL()}>Upload</button>
                    <button onClick={() => clearSQL()}>Clear SQL</button>
                    <button onClick={() => editRow()}>Edit SQL</button>
                 
                </Box>
                <input id="i_EN" name="Name" placeholder="Exercise Name" onChange={setInput}></input>
                <input type="number" name="Repe" placeholder="Repetition" onChange={setInput}></input>
                <input type="number" name="Sets" placeholder="Set" onChange={setInput}></input>
                <input type="number" name="Weight" placeholder="Weight" onChange={setInput}></input>
                <input name="Exercise_ID" placeholder="Exercise ID" onChange={setInput}></input>

            </Box> */}
            
            {/* Official Page */}
            <Box>
                
                {/* UI */}
                
                
                <Box  display="flex" justifyContent="space-around" alignContent="center" mb="20px">
                    {/* <Button variant="contained">Upper Body</Button>
                    <Button variant="contained">Lower Body</Button>
                    <Button variant="contained">Cardio</Button>
                    <Button variant="contained">Basketball Skill</Button> */}

                    
                    <ToggleButtonGroup
                    color="primary"
                    // value={btnSelColor}
                    exclusive
                    // onChange={handleChange}
                    aria-label="Platform"
                    >
                        <ToggleButton value = "tmp" onClick={btnOnClick_UB}><Typography>Upper Body</Typography></ToggleButton>
                        <ToggleButton value = "tmp" onClick={btnOnClick_LB}><Typography>Lower Body</Typography></ToggleButton>
                        <ToggleButton value = "tmp" onClick={btnOnClick_PT}><Typography>PT</Typography></ToggleButton>
                        <ToggleButton value = "tmp" onClick={btnOnClick_BS}><Typography>Basketball</Typography></ToggleButton>
                    </ToggleButtonGroup>
                    
   

                </Box>

                <Box>

                </Box>

                
                <Box m="40px 0 0 0" height="50vh" 
                        sx = {{
                    
                        "& .MuiDataGrid-root" : {
                            border: "none"
                        },
                        "& .MuiDataGrid-cell" : {
                            borderBottom: "none"
                        }
                        
                    
                }}>
                    {sqlView
                        ? 
                        
                        [                        
                            <ToggleButton key="NEWbutton" value = "tmp" onClick={btnOnClick_NEW}><Typography>NEW </Typography></ToggleButton>,
                            
                            diagramOpList,cancelBtnComp,
                            chartWarning, delConfirmCmp,

                            
                            <DataGrid

                            key="DataGrid"

                            checkboxSelection 
                            disableRowSelectionOnClick 
    
                            rows={sqlRows}
                            columns={sqlColumns}
    
                           
                            getRowId={(row)=>row.Exercise_ID}



                            onRowClick={()=>{
                                console.log("HLEL");
                            }}

                           
    
                            // components={{
                            //     BaseCheckbox: Checkbox
                            // }}

                            
                            
                            onRowSelectionModelChange = {(sel) => {
                                // setRowSel(newSelection.row)
  

                                //Handle the ALL SEL
                                if(sel.length != 0){
                                    // setDiagramOpList([<ToggleButton key="DeleteButton" value = "tmp" onClick={()=>{btnOnClick_Delete(exTypeNow, rowsSel)}}><Typography>Delete</Typography></ToggleButton>])
                                    setDiagramOpList([<ToggleButton key="DeleteButton" value = "tmp" onClick={()=>{setIsDEL_rowsCalled(true)}}><Typography key="font">Delete</Typography></ToggleButton>])

                                }
                                else{
                                    setDiagramOpList([])
                                    setChartWarning([])
                                    setCancelBtnComp()
                                    setIsWarnPopped(false)
                                }

                                // console.log(sel)

                                setRowsSel(sel)
                                
                                
                                
                            }}
                            />
                            
                            ]  
                                                  

                        :
                        <Box/>

                        

                    }

                    {
                        isNEWcalled
                            ?
                            [
                                // <Box key="INPUT">{`${isNEWcalled}`}</Box>
                                addConfirmCmp,
                                
                                <Box display="grid" justifyContent="center" key="InputBox">                                 
                                    <TextField
                                    required
                                    name="Name"
                                    key="NameInput"
                                    id="outlined-required"
                                    label="Exercise Name"
                                    onChange={setInput}
                                    // inputProps={{
                                    //     style: { marginBottom: '20px' }
                                    //   }}
                                />
        
                                    <TextField
                                    required
                                    name="Repe"
                                    key="RepeInput"
                                    id="outlined-number"
                                    label="Repe"
                                    type="number"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={setInput}
                                    
                                />
                                    <TextField
                                    required
                                    name="Sets"
                                    key="SetsInput"
                                    id="outlined-number"
                                    label="Sets"
                                    type="number"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={setInput}
                                    
                                />
                                    <TextField
                                    required
                                    name="Weight"
                                    key="WeightInput"
                                    id="outlined-number"
                                    label="Weight"
                                    type="number"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={setInput}
                                    
                                />
                                    <TextField
                                    name="Exercise_ID"
                                    required
                                    key="ExerciseIDInput"
                                    id="outlined-number"
                                    label="Exercise ID"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={setInput}
                                    
                                />
                                    <TextField
                                    name="Comment"
                                    key="CommentInput"
                                    id="outlined-number"
                                    label="Comment"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={setInput}
                                    
                                />
                                
                                </Box>, 
                                <Box display="grid" justifyContent="center" key="OperationBox">

                                    <ToggleButton key="UploadNew" value = "tmp" onClick={()=>{btnOnClick_UploadTo(exTypeNow)}}><Typography>{`Upload To ${exTypeNow}`}</Typography></ToggleButton>
                                    {/* <ToggleButton value = "tmp" onClick={btnOnClick_UploadTo(`${exTypeNow}`)}><Typography>{`${exTypeNow}`}</Typography></ToggleButton> */}
                                    
                                </Box>



                                  
                              
                            ]
                            :
                            <Box/>
                    }
                    

                    


                    
                    
                </Box>

            </Box>


  
        </Box>
    )

}

export default SQL