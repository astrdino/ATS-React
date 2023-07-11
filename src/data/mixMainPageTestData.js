export const drillDetail_jsonTemplate = JSON.stringify({
    
    ModeName1:{
        ModeTitle: "ModeName1",
        ModeID : "M1",
        Schedule_Dates: [],
        Events: [
            {Exercise:{},
            Schedule: [],
            CompletedHistory:[]},

            {Exercise:{},
            Schedule: [],
            CompletedHistory:[]},]

        

    },
    ModeName2:{
        Event1: {Exercise:{
            ExerciseID: "UB-1",
            ExerciseTitle: "Bench Press"

        },
        Schedule: [
            {
                SubSchedule:{
                    StartDate: "2023-05-08",
                    EndDate: "2023-06-10",
                    Repe: 8,
                    Sets: 3,
                    Weight: 30,
                    Duration: 0,
                    Completed_Freq: 3,
                    Completed_Date: [
                        {c_date: '2023-05-20'},
                        {c_date: '2023-05-25'},
                        {c_date: '2023-05-27'}

                    ]
           
                }
            }

        ],
        CompletedHistory:[
            {
                CompletedRecord: {
                    Date: "2023-05-20",
                    A_Finished_Repe: 8, //Actual Finished Amount
                    S_Finished_Repe: 8, //Scheduled Finished Amount
                    A_S_Repe_Gap: 0, //The Gamp
                    A_Finished_Sets: 3, 
                    S_Finished_Sets: 3, 
                    A_S_Sets_Gap: 0, 
                    A_Finished_Weight: 30, 
                    S_Finished_Weight: 30, 
                    A_S_Weight_Gap: 0, 
                    A_Finished_Duration: 0, 
                    S_Finished_Duration: 0, 
                    A_S_Duration_Gap: 0, 
                }
            }
                ]},
        
        Event2:  

                {Exercise:{
                        ExerciseID: "UB-2",
                        ExerciseTitle: "Incline Bench Press"

                    },
                    Schedule: [
                        {
                            SubSchedule:{
                                StartDate: "2023-05-08",
                                EndDate: "2023-06-10",
                                Repe: 8,
                                Sets: 3,
                                Weight: 30,
                                Duration: 0,
                                Completed_Freq: 3,
                                Completed_Date: [
                                    {c_date: '2023-05-20'},
                                    {c_date: '2023-05-25'},
                                    {c_date: '2023-05-27'}

                                ]
                       
                            }
                        }

                    ],
                    CompletedHistory:[
                        {
                            CompletedRecord: {
                                Date: "2023-05-20",
                                A_Finished_Repe: 8, //Actual Finished Amount
                                S_Finished_Repe: 8, //Scheduled Finished Amount
                                A_S_Repe_Gap: 0, //The Gamp
                                A_Finished_Sets: 3, 
                                S_Finished_Sets: 3, 
                                A_S_Sets_Gap: 0, 
                                A_Finished_Weight: 30, 
                                S_Finished_Weight: 30, 
                                A_S_Weight_Gap: 0, 
                                A_Finished_Duration: 0, 
                                S_Finished_Duration: 0, 
                                A_S_Duration_Gap: 0, 
                            }
                        }
                    ]}


                    
    }

})
export const drillDetail_jsonTemplate_NEW = JSON.stringify({
    
    ModeName1:{
        ModeTitle: "ModeName1",
        ModeID : "M1",
        Schedule_Dates: [],
        Events: [
            {Exercise:{},
            Schedule: [],
            CompletedHistory:[]},
            
            {Exercise:{},
            Schedule: [],
            CompletedHistory:[]},]

        

    },
    ModeName2:{
        ModeTitle: "Upper Body",
        ModeID : "M2",
        Schedule_Dates: ["2023-05-01","2023-05-08"],
        Events: [
            {Exercise:{
                ExerciseID: "UB-1",
                ExerciseTitle: "Bench Press"

            },
                Schedule: [
                    {
                        SubSchedule:{
                            StartDate: "2023-05-08",
                            EndDate: "2023-06-10",
                            Repe: 8,
                            Sets: 3,
                            Weight: 30,
                            Duration: 0,
                            Completed_Freq: 3,
                            Completed_Date: [
                                {c_date: '2023-05-20'},
                                {c_date: '2023-05-25'},
                                {c_date: '2023-05-27'}
        
                            ]
                   
                        }
                    }
        
                ],
                CompletedHistory:[
                    {
                        CompletedRecord: {
                            Date: "2023-05-20",
                            A_Finished_Repe: 8, //Actual Finished Amount
                            S_Finished_Repe: 8, //Scheduled Finished Amount
                            A_S_Repe_Gap: 0, //The Gamp
                            A_Finished_Sets: 3, 
                            S_Finished_Sets: 3, 
                            A_S_Sets_Gap: 0, 
                            A_Finished_Weight: 30, 
                            S_Finished_Weight: 30, 
                            A_S_Weight_Gap: 0, 
                            A_Finished_Duration: 0, 
                            S_Finished_Duration: 0, 
                            A_S_Duration_Gap: 0, 
                        }
                    }
                        ]},

            {Exercise:{
                ExerciseID: "UB-2",
                ExerciseTitle: "Incline Bench Press"

            },
            Schedule: [
                {
                    SubSchedule:{
                        StartDate: "2023-05-08",
                        EndDate: "2023-06-10",
                        Repe: 8,
                        Sets: 3,
                        Weight: 30,
                        Duration: 0,
                        Completed_Freq: 3,
                        Completed_Date: [
                            {c_date: '2023-05-20'},
                            {c_date: '2023-05-25'},
                            {c_date: '2023-05-27'}

                        ]
                
                    }
                }

            ],
            CompletedHistory:[
                {
                    CompletedRecord: {
                        Date: "2023-05-20",
                        A_Finished_Repe: 8, //Actual Finished Amount
                        S_Finished_Repe: 8, //Scheduled Finished Amount
                        A_S_Repe_Gap: 0, //The Gamp
                        A_Finished_Sets: 3, 
                        S_Finished_Sets: 3, 
                        A_S_Sets_Gap: 0, 
                        A_Finished_Weight: 30, 
                        S_Finished_Weight: 30, 
                        A_S_Weight_Gap: 0, 
                        A_Finished_Duration: 0, 
                        S_Finished_Duration: 0, 
                        A_S_Duration_Gap: 0, 
                    }
                }
            ]}

            

        ]

    
        
   

                


                    
    },
    ModeName3:{
        ModeTitle: "ModeName3",
        ModeID : "M3",
        Schedule_Dates: [],
        Events: [
            {Exercise:{
                ExerciseID: "UB-3",
                ExerciseTitle: "OverHead Press"

            },
                Schedule: [
                    {
                        SubSchedule:{
                            StartDate: "2023-05-08",
                            EndDate: "2023-06-10",
                            Repe: 8,
                            Sets: 3,
                            Weight: 30,
                            Duration: 0,
                            Completed_Freq: 3,
                            Completed_Date: [
                                {c_date: '2023-04-20'},

        
                            ]
                   
                        }
                    }
        
                ],
                CompletedHistory:[
                    {
                        CompletedRecord: {
                            Date: "2023-04-20",
                            A_Finished_Repe: 8, //Actual Finished Amount
                            S_Finished_Repe: 8, //Scheduled Finished Amount
                            A_S_Repe_Gap: 0, //The Gamp
                            A_Finished_Sets: 3, 
                            S_Finished_Sets: 3, 
                            A_S_Sets_Gap: 0, 
                            A_Finished_Weight: 30, 
                            S_Finished_Weight: 30, 
                            A_S_Weight_Gap: 0, 
                            A_Finished_Duration: 0, 
                            S_Finished_Duration: 0, 
                            A_S_Duration_Gap: 0, 
                        }
                    }
                        ]},

            {Exercise:{
                ExerciseID: "UB-5",
                ExerciseTitle: "Bicep Curls"

            },
            Schedule: [
                {
                    SubSchedule:{
                        StartDate: "2023-05-08",
                        EndDate: "2023-06-10",
                        Repe: 8,
                        Sets: 3,
                        Weight: 30,
                        Duration: 0,
                        Completed_Freq: 3,
                        Completed_Date: [
                            {c_date: '2023-06-26'},

                        ]
                
                    }
                }

            ],
            CompletedHistory:[
                {
                    CompletedRecord: {
                        Date: "2023-06-26",
                        A_Finished_Repe: 8, //Actual Finished Amount
                        S_Finished_Repe: 8, //Scheduled Finished Amount
                        A_S_Repe_Gap: 0, //The Gamp
                        A_Finished_Sets: 3, 
                        S_Finished_Sets: 3, 
                        A_S_Sets_Gap: 0, 
                        A_Finished_Weight: 30, 
                        S_Finished_Weight: 30, 
                        A_S_Weight_Gap: 0, 
                        A_Finished_Duration: 0, 
                        S_Finished_Duration: 0, 
                        A_S_Duration_Gap: 0, 
                    }
                }
            ]}

            

        ]

    
        
   

                


                    
    }

})

export const exercise_candidate = [
    {
        id: 1,
        ExerciseID: "UB-1",
        ExerciseTitle: "Bench Press"
    },
    {   id: 2,
        ExerciseID: "UB-2",
        ExerciseTitle: "Incline Bench Press"
    },
    {   id: 3,
        ExerciseID: "LB-1",
        ExerciseTitle: "Squat"
    },
    {   
        id: 4,
        ExerciseID: "LB-2",
        ExerciseTitle: "Hacker"
    }
]


//Functions 


//How many exercises in one Mode
export function getMode_Event_Amt(DB){
    console.log(Object.keys(DB).length)
}

export function getMode_Event(DB, ModeName){

    return Object.keys(DB)

}

// module.exports = {
//     getMode_Event
// }

