import React,  { useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme"

import Checkbox from "@mui/material/Checkbox";
import CircleCheckedFilled from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";

// a wrapper class for material ui checkbox
// Since you are just using the mui checkbox, simply pass all the props through to restore functionality.
function CheckboxWrapper(props) {


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [checked, setChecked] = useState(false)

    if (checked){
        return (


            <Checkbox
            icon={<CircleUnchecked />}
            checkedIcon={<CircleCheckedFilled />}
            style={{ backgroundColor: colors.redAccent[600] }}

            {...props}
            />
    
        )

    }
    else{
        return (


            <Checkbox
            icon={<CircleUnchecked />}
            checkedIcon={<CircleCheckedFilled />}
            style={{ backgroundColor: colors.redAccent[100] }}
            {...props}
            />
    
        );
    }


}

export default CheckboxWrapper;
