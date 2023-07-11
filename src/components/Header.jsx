// This is a shared component that used in everywhere
import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme"


const Header = ({title, subtitle}) => {

    const theme = useTheme()
    const color = tokens(theme.palette.mode)

    return(
        <Box mb="30px">
            <Typography
                variant="h2"
                color={color.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}>
                {title}
            </Typography>
            <Typography variant="h5" color={color.greenAccent[400]}>
                {subtitle}
            </Typography>

        </Box>
    )

}

export default Header
