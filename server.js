const { ConstructionOutlined } = require('@mui/icons-material')
const express           = require('express')
        UppBd_Exercise  = require('../ats-admin/src/data/upp_exercise')
        dbOperation     = require('../ats-admin/src/data/sql/dbOperation')
        cors            = require('cors')



const API_PORT = process.env.PORT || 5000
const app = express()

let overHead = new UppBd_Exercise('Overhead Press', 8, 3, 25, 'U1')

//Varables for mongoDB
let client;
let session

//Front-End to Server
app.use(express.json())
app.use(express.urlencoded())
app.use(cors()) //cross-original data sharing



//Get All Exercises
app.post(
    '/api',
    async  (req, res) => {
        console.log('called')

        const result = await dbOperation.getExercises()

        // console.log(result,"++")
        // console.log(result.recordset,"++-")
        
 
        res.send(result.recordset) 

    }
)

//Get UB Exercises
app.post(
    '/getALL',
    async  (req, res) => {
        console.log('get ALL called')

        const result = await dbOperation.getALLExercises()

        // console.log(result, "~~")
 
        res.send(result) 

    }
)

//Get LB Exercises
app.post(
    '/getLBE',
    async  (req, res) => {
        console.log('called')

        const result = await dbOperation.getLBExercises()
 
        res.send(result.recordset) 

    }
)

//Get PT Exercises
app.post(
    '/getPTE',
    async  (req, res) => {
        console.log('called')

        const result = await dbOperation.getPTExercises()
 
        res.send(result.recordset) 

    }
)

//Get Basketball Exercises
app.post(
    '/getBSE',
    async  (req, res) => {
        console.log('called')

        const result = await dbOperation.getBSExercises()
 
        res.send(result.recordset) 

    }
)

//Obsoleted
app.post(
    '/upload',
    async (req, res) => {

        console.log('Get Called (Server Msg)')
   

        
        //Don't upload default exercise (which is null)
        if(req.body.Name !== '' && req.body.Repe !== 0 && req.body.Sets !== 0){
            await dbOperation.createExercises(req.body)
        }

        // await dbOperation.createExercises()

        const result = await dbOperation.getExercises()

        res.send(result.recordset)

    }
)


//Upload new exercise
app.post(
    '/uploadTo',
    async (req, res) => {

        console.log('Get Called (Server Msg)')
        console.log(req.body.Comment)

        if(typeof(req.body.Comment) === 'undefined'){
            req.body.Comment = ""
        }
        
        //Don't upload default exercise (which is null)
        if(req.body.Name !== '' && req.body.Repe !== 0 && req.body.Sets !== 0){
            
            await dbOperation.createExerciseTo(req.body,req.body.TargetTable)
        }


        // await dbOperation.createExercises()

        const result = await dbOperation.getExercises()

        res.send(result.recordset)

    }
)

//Upload new mode
app.post(
    '/uploadDMTo',
    async (req, res) => {

        console.log('Get Called (Server Msg)')


        await dbOperation.createDrillModeTo(req.body)

        const result = await dbOperation.getDrillMode()

        res.send(result.recordset)

    }
)

//Delete Exercise
app.post(
    '/clearWcond',
    async (req, res) => {

        console.log('Get Called (Server Msg)')
        console.log(req.body);
        
        dbOperation.condDeleteExercises(req.body.Name, req.body.Exercise_ID, req.body.targetTable)

        const result = await dbOperation.getDrillMode()

        res.send(result.recordset)

    }
)

//Delete Drill Mode
app.post(
    '/clearDrillModeWcond',
    async (req, res) => {

        console.log('clear drill mode Called (Server Msg)')
        // console.log(req.body);
        
        dbOperation.condDeleteDrillMode(req.body.title, req.body.id)

        const result = await dbOperation.getDrillMode()

        res.send(result.recordset)

    }
)

//Clear all exercises
app.post(
    '/clear',
    async (req, res) => {

        console.log('Get Called (Server Msg)')
        
        dbOperation.clearExercises()

        const result = await dbOperation.getExercises()

        res.send(result.recordset)

    }
)


//Edit Exercise
app.post(
    '/edit',
    async (req, res) => {

        console.log('Get Called (Server Msg)')
     

        await dbOperation.updateExercises(req.body.Weight)

            //Don't upload default exercise (which is null)
        if(req.body.Name !== '' && req.body.Repe !== 0 && req.body.Sets !== 0){
           
        }
        
        // dbOperation.updateExercises()

        const result = await dbOperation.getExercises()

        res.send(result.recordset)

    }
)


//Get Drill Mode
app.post(
    '/getDrillMode',
    async  (req, res) => {
        console.log('get Drill Mode called')

        const result = await dbOperation.getDrillMode()

        // console.log(result, "~~")
 
        res.send(result) 

    }
)

//Get Single Record
app.post(
    '/getSingleRecord',
    async  (req, res) => {
        console.log('get Single Record called')

        const result = await dbOperation.getSingleRecord()

        // console.log(result, "~~")
 
        res.send(result.recordset) 

    }

)

//Update Single Record
app.post(
    '/updateSR',
    async (req, res) => {

        await dbOperation.updateIndvRecrd(JSON.stringify(req.body))

        // const result = await dbOperation.getDrillMode()

        // res.send(result.recordset)

    }
    
)







var result =[]
// dbOperation.getExercises().then(res=>{
//     result +=res.recordset
//     console.log(res.recordset);
// })

// module.exports = result





app.listen(API_PORT, ()=> console.log(`listening on port ${API_PORT}`))


