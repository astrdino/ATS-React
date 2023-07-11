const config                    = require ('./dbConfig')
        sql                     = require('mssql')



const getExercises = async() =>{
    try{
        let pool = await sql.connect(config)
        let exercises = await pool.request().query("SELECT * from ATS_Upper_Exercise")

        console.log(exercises, "From dbOeration")
        // console.log("shit")
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const getALLExercises = async() =>{
    try{
        let pool = await sql.connect(config)
        let exercises = await pool.request().query("SELECT * from ATS_Upper_Exercise")
        // let exercises_UB = await pool.request().query("SELECT * from ATS_Upper_Exercise")
        let exercises_LB = await pool.request().query("SELECT * from ATS_Lower_Exercise")
        let exercises_PT = await pool.request().query("SELECT * from ATS_PT_Exercise")
        let exercises_BS = await pool.request().query("SELECT * from ATS_BasketballSkill_Exercise")


        // console.log(exercises.recordset.concat(exercises_LB.recordset,   
        //                                         exercises_PT.recordset, 
        //                                         exercises_BS.recordset),"ollala")
        const result = exercises.recordset.concat(exercises_LB.recordset,   
                                                    exercises_PT.recordset, 
                                                    exercises_BS.recordset)

        // console.log(exercises, "From dbOeration")
        // console.log("shit")
        // return [exercises_UB, exercises_LB, exercises_PT, exercises_BS]
        // console.log(result)
        return result
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const getLBExercises = async() =>{
    try{
        let pool = await sql.connect(config)
        let exercises = await pool.request().query("SELECT * from ATS_Lower_Exercise")

        console.log(exercises, "From dbOeration")
        // console.log("shit")
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const getPTExercises = async() =>{
    try{
        let pool = await sql.connect(config)
        let exercises = await pool.request().query("SELECT * from ATS_PT_Exercise")

        console.log(exercises, "From dbOeration")
        // console.log("shit")
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}


const getBSExercises = async() =>{
    try{
        let pool = await sql.connect(config)
        let exercises = await pool.request().query("SELECT * from ATS_BasketballSkill_Exercise")

        console.log(exercises, "From dbOeration")
        // console.log("shit")
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const getDrillMode = async() =>{
    try{
        let pool = await sql.connect(config)
        let dm = await pool.request().query("SELECT * from DrillMode")

        // console.log(dm, "From dbOeration")
        // console.log("shit")
        return dm
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}


const getSingleRecord = async() => {
    try {
        let pool = await sql.connect(config)
        let singleRecord = await pool.request().query("SELECT * from ATS_Single_Record")

        return singleRecord
        
    } catch (error) 
    {
        console.log("ASYNC ERROR:",error)
    }
}




const createExercises = async(Exercise) =>{
    try{
        let pool = await sql.connect(config)
        let exercises = await pool.request().query(`
        INSERT INTO ATS_Upper_Exercise VALUES
        ('${Exercise.Name}',${Exercise.Repe},${Exercise.Sets},${Exercise.Weight}, '${Exercise.Exercise_ID}');
        `)
        
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}



const createExerciseTo = async(Exercise, TargetTable) =>{
    try{
        let server_Root = "ATS_"
        let server_Tail = "_Exercise"
        let server_Target = ""

        switch(TargetTable){
            case "Upper Body":
                server_Target = "Upper"
                break
            case "Lower Body":
                server_Target = "Lower"
                break
            case "PT":
                server_Target = "PT"
                break
            case "Basketball Skill":
                server_Target = "BasketballSkill"
                break
        }

        let server_TargetTable = (server_Root.concat(server_Target)).concat(server_Tail)

        console.log(server_TargetTable)

        let pool = await sql.connect(config)
        let exercises = await pool.request().query(`
        INSERT INTO ${server_TargetTable} VALUES
        ('${Exercise.Name}',${Exercise.Repe},${Exercise.Sets},${Exercise.Weight}, '${Exercise.Exercise_ID}','${Exercise.Comment}' );
        `)

        
        
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const createDrillModeTo = async(drillmode) =>{
    try{

        let formated_allday = 0 

        if(drillmode.allDay){
            formated_allday = 1
        }

        let pool = await sql.connect(config)
        let dm = await pool.request().query(`
        INSERT INTO DrillMode VALUES
        ('${drillmode.id}','${drillmode.title}','${drillmode.start}','${drillmode.end}', ${formated_allday} );
        `)

        
        
        return dm
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}



const updateExercises = async(ex_condition) =>{

    console.log(ex_condition, "***")
    try{

        

        let pool = await sql.connect(config)
        let exercises = pool.request().query(
        `UPDATE ATS_Upper_Exercise SET Weight = 2 WHERE Weight = ${ex_condition}`)
        
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const updateIndvRecrd = async(dt) => {
    try {
        let pool = await sql.connect(config)
        let details = pool.request().query(
            `UPDATE ATS_Single_Record SET Details = '${dt}' WHERE User_Name = 'Dino'`

        )

        return details
        
    } catch (error) {
        console.log("ASYNC ERROR:",error);
    }

}

const condDeleteExercises = async(e_Name, e_ID, TargetTable) =>{


    
    try{
        
        console.log("inininin", e_Name, e_ID, TargetTable)
        //Set Target Table Command
        let server_Root = "ATS_"
        let server_Tail = "_Exercise"
        let server_Target = ""

        switch(TargetTable){
            case "Upper Body":
                server_Target = "Upper"
                break
            case "Lower Body":
                server_Target = "Lower"
                break
            case "PT":
                server_Target = "PT"
                break
            case "Basketball Skill":
                server_Target = "BasketballSkill"
                break
        }

        let server_TargetTable = (server_Root.concat(server_Target)).concat(server_Tail)

        //Set Conditons Command
        let cc = `WHERE Name = '${e_Name}' AND Exercise_ID = '${e_ID}'`
        let message = (`Delete FROM ${server_TargetTable} `).concat(cc)

        let pool = await sql.connect(config)
        let exercises = pool.request().query(
        message)


        console.log(message)
        
        return exercises
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const condDeleteDrillMode = async(dm_Title, dm_ID) =>{


    
    try{
        

        //Set Conditons Command
        let cc = `WHERE Title = '${dm_Title}' AND Mode_ID = '${dm_ID}'`
        let message = ("Delete FROM DrillMode ").concat(cc)



        let pool = await sql.connect(config)
        let dm = pool.request().query(
        message)

        
        return dm
    }

    catch(error){
        console.log("ASYNC ERROR:",error);
    }
}

const clearExercises = () => {
    return 0

}

module.exports = {
    clearExercises,
    condDeleteDrillMode,
    condDeleteExercises,
    createDrillModeTo,
    createExercises,
    createExerciseTo,
    getALLExercises,
    getBSExercises,
    getDrillMode,
    getExercises,
    getLBExercises,
    getPTExercises,
    getSingleRecord,
    updateExercises,
    updateIndvRecrd
    
}