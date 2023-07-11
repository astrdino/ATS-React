import { useEffect, useState,MouseEvent } from "react";


import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {Button} from "@material-ui/core"
import { ToggleButton, ToggleButtonGroup, TextField  } from '@mui/material';

import { tokens } from "../../theme";

import Header from "../../components/Header";
import { ConstructionOutlined, Margin } from "@mui/icons-material";

import {mockDataTeam} from "../../data/mockData"

import {DataGrid} from "@mui/x-data-grid"
import Checkbox from "../../components/CustomCheckBox"



import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import e from "cors";
import styled from "@emotion/styled";




const SQL = () =>{

    


    //Front-End Global Variables
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [prevLen, setPrevLen] = useState(0) //Avoid to log backend data to the frontend repeatedly
    const [sqlView, setSqlView] = useState(false)

    const [sqlRows, setSqlRows] = useState([{Name: 'Something', Repe: 3, Sets: 14, Weight: 20, Exercise_ID: 'Test'}])
    
    const [singleRow, setSingleRow] = useState({})
    
    const [test, setTest] = useState([])


    const [btnSelColor, setBtnSelColor] = useState('tmp')
    const [isNEWcalled, SetisNEWcalled] = useState(false)
    const [exTypeNow, setExTypeNow] = useState('')

    const [rowSel, setRowSel] = useState(false)

    //Back-End Functional Variables (TEST)
    const [returnedData, setReturnedData] = useState(['Hello'])
    // const [exercise, setExercise] = useState({Name: '', Repe: 0, Sets: 0, Weight: 0, Exercise_ID: '', Comment: null}) //For INPUT real-time input
    const [exercise, setExercise] = useState({Name: 'Do', Repe: 12, Sets: 10, Weight: 10, Exercise_ID: 'U 7', Comment: null}) //For INPUT real-time input





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



    //SQL Operations

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


 




    //Component Funtions 
    const btnOnClick_UB = async(event: MouseEvent,
        newAlignment: string
        ) =>{

            setBtnSelColor(newAlignment)
            setExTypeNow("Upper Body")

            setSqlRows([])
            SetisNEWcalled(false)
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

    }

    const btnOnClick_LB = async(event: MouseEvent
        ) =>{

            SetisNEWcalled(false)
            setExTypeNow("Lower Body")
            setSqlRows([])
            console.log("Info from the front end",exercise)

            const newData = await fetch('/getLBE',{
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
            console.log("Info from the front end",exercise)

            const newData = await fetch('/getPTE',{
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
      

            console.log("Info from the front end",exercise)

            const newData = await fetch('/getBSE',{
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
       



    }

    const btnOnClick_UploadTo = async(TargetTable) =>{

        console.log(TargetTable);
        console.log("Upload Request from Client");

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

    }


    const btnOnClick_Delete = async(targetTable) =>{

        console.log(targetTable);
        console.log("Delete Request from Client");

        const newData = await fetch('/clearWcond',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                ...exercise,
                targetTable
                })
                
                
        })
        .then(res => res.json()) // parses JSON response into native JavaScript objects
        console.log(newData, 'from Delete SQL function')

        //Update when SQL database is not empty
        if(newData.length > 0){
            setReturnedData(newData[0])
        }        
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
            <ToggleButton value = "tmp" onClick={()=>{btnOnClick_Delete(exTypeNow)}}><Typography>Delete</Typography></ToggleButton>
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
                            <ToggleButton key={"content-nav-NEW"} value = "tmp" onClick={btnOnClick_NEW}><Typography>NEW </Typography></ToggleButton>,
                             
                            <DataGrid

                            key={"UniqueID"}

                            checkboxSelection 
                            disableRowSelectionOnClick 
    
                            rows={sqlRows}
                            columns={sqlColumns}
    
                           
                            getRowId={(row)=>row.Exercise_ID}
                            // onRowClick={(row)=>{setSingleRow(row)}}

                            onRowClick={()=>{
                                console.log("HLEL");
                            }}

                           
    
                            // components={{
                            //     BaseCheckbox: Checkbox
                            // }}

                            
                            
                            onRowSelectionModelChange = {(sel) => {
                                // setRowSel(newSelection.row)
                                
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
                                
                                <Box display="grid" justifyContent="center">                                 
                                    <TextField
                                    required
                                    name="Name"
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
                                    id="outlined-number"
                                    label="Exercise ID"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={setInput}
                                    
                                />
                                    <TextField
                                    name="Comment"
                                    id="outlined-number"
                                    label="Comment"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={setInput}
                                    
                                />
                                
                                </Box>, 
                                <Box display="grid" justifyContent="center">

                                    <ToggleButton value = "tmp" onClick={()=>{btnOnClick_UploadTo(exTypeNow)}}><Typography>{`${exTypeNow}`}</Typography></ToggleButton>
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