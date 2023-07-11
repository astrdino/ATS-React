


var gotAllInput = false

var getOneDialogInput = 0


const button = document.getElementById("btn");


var cmpntAmt = 3

function addPlusNext(){
    if(cmpntAmt > 1){

        const nextButton = document.createElement('NextBtn')
        nextButton.innerText = "Next"
        document.body.appendChild(nextButton)
        nextButton.addEventListener('click', ()=>{nextBtnFunciton()})


    }
    else{
        const okButton = document.createElement('OkBtn')
        okButton.innerText = "OK"
        document.body.appendChild(okButton)
        okButton.addEventListener('click', ()=>{okBtnFunction()})

    }

    add()

}


async function add(){

    // for (let index = 0; index < 3; index++) {

    //     inti_contrl = 0 //Control for another element


    // }


    // console.log("Add started",gotAllInput);

    let p = new Promise((resolve,reject)=>{

        if(getOneDialogInput === cmpntAmt){
            gotAllInput = true
            resolve()
        }
        else{
            reject()
        }
    })

    p.then(()=>{

        console.log("Got All Input");




    }).catch(()=>{

        // setTimeout(()=>{
        //     add()
        // },1000)

        if(!gotAllInput)
        {
            // console.log("Got one But not all");
            console.log(`"Got ${getOneDialogInput} But not all"`);
            // inti_contrl = 0
            setTimeout(()=>{
                add()
            },10)
        }
        else{
            console.log("Got Input");

        }

    })

    // console.log("Add Ends");



}

function okBtnFunction(){

    // gotAllInput = true
    console.log("Ok button clicked",gotAllInput);
}

function nextBtnFunciton(){

    getOneDialogInput++
    console.log("Next button called");

}

function collectInput(){

    // while(!gotAllInput){
    //
    //     console.log(gotAllInput);



    // }



    if(!gotAllInput){
        console.log("in");
        setTimeout(()=>{
            console.log("No Input and keep collecting");


        }, 3000)

    }else{
        return
    }

    collectInput()


}
