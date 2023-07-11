import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header"
import FullCalendar from "@fullcalendar/react";

const Dashboard = ()=>{



    const today = () =>{

        const currDate = new Date()
        console.log(currDate.getDate(), "DD")
        console.log(currDate.getMonth()+1, "MM")
        console.log(currDate.getFullYear())

        return currDate.getDate()


    }

    today()

    return (    
    
    <Box m="20px">
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to the Dashboard"/>
        </Box>

        <Box className="Main-Container">

            <Box className="Block"> {today()} </Box>
            <Box className="Block">Last-Time Exercise</Box>
            <Box className="Block">
                Drill Mode
                <Box className="subBlock"> Drill Mode Details</Box>
            </Box>
           
            <Box className="Block">Pending Exercise</Box>


        </Box>

   
    </Box>
)


}

export default Dashboard

