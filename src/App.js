import { ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemePro } from "@mui/material";
import {Routes, Route} from 'react-router-dom'


// App Components
import Topbar from "./scences/global/Topbar"
import Sidebar from "./scences/global/Sidebar"
import Dashboard from "./scences/dashboard/index";
import Team from "./scences/team";
import Calendar from "./scences/calendar";
import SQL from "./scences/sql"
import WebStorage from "./scences/webstorage"
import Bar from "./components/BarChart";
import Calendar_Dino from "./scences/calendar_dino"
import Mix from "./scences/mix/index"
// import Invoices from "./scenes/invoices";
// import Contacts from "./scenes/contacts";
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";




function App() {



  const [theme, colorMode] = useMode()



  return (
    <ColorModeContext.Provider value={colorMode}>

      <ThemeProvider theme = {theme}>

        <CssBaseline />

        <div className="app">

          <Sidebar/>
          <main className="content">
            <Topbar/>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/sql" element={<SQL />} />
              <Route path="/webstorage" element={<WebStorage />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/calendar_dino" element={<Calendar_Dino />} />
              <Route path="/mix" element={<Mix />} />

              

              {/* <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
   
              <Route path="/geography" element={<Geography />} /> */}
              
            </Routes>

           
          </main>

        </div>

      </ThemeProvider>


    </ColorModeContext.Provider>
  );
}

export default App;
