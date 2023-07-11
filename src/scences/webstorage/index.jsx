import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const WebStorage = () =>{

    
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return(
        <Box m="20px">
            <Header title="Web Storage" subtitle="Smash Grind in Web Storage">

            </Header>
        </Box>

    )

}

export default WebStorage