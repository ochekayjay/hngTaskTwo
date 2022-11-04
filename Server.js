const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 6000;
const app = express();
const key = process.env.openapi
const bodyParser = require('body-parser');
const {Configuration, OpenAIApi} = require("openai")




app.use(cors());

app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(
    bodyParser.json()
  );


  const configuration = new Configuration({apiKey: "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"})

  const openai = new OpenAIApi(configuration)

  




/*const response = await openai.createCompletion({
  model: "text-davinci-002",
  prompt: "what is 5 times 5",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});*/

  const getAnswer = async(req,res,next)=>{

   
    try{
        
        const response = await openai.createCompletion({
            model:"text-davinci-002",
            prompt: req.body.operation_type,
            temperature: .5,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        const ans = response?.data?.choices;
        
        let lastdg = ans[0]['text'].replace(/[^a-zA-Z0-9- ]/g, "")
      
        lastdg = lastdg.split(" ")
        lastdg = parseInt(lastdg[lastdg.length-1] )
        req.output = lastdg ;

        next()
    }

    catch(error){
        next(error)
    }
  }

  const getOperationType = (req,res,next)=>{
    const addition = ["add","added","summed","addition","sum","plus","summation","+"]
    const subtraction = ["subtract","subtraction","minus","subtracted","-"]
    const multiplication = ["multiply","multiplication","times","product","multiplied","*"]

    const data = req.body.operation_type.split(" ")

    for(let i=0;i<data.length;i++){
          if(addition.includes(data[i])){
            req.operand = 'addition'
            next()
          }
          else if(subtraction.includes(data[i])){
            req.operand = 'subtraction'
            next()
          }
          else if(multiplication.includes(data[i])){
            req.operand = 'multiplication'
            next()
          }
    }
  }
  /*const getOperationType = (req,res,next)=>{
    const dataHolder = [ {'addition':["add","addition","sum","plus","summation"]},
     {'subtraction' :["subtract","subtraction","minus"]},
     {'multiplication' :["multiply","multiplication","times","product"]}]
    const bodyOperation = req.body.operation_type.split(" ")


    for(let i =0; i<bodyOperation.length; i++){
        let indexx = 0;
        let datakeep  = dataHolder[indexx][Object.keys(dataHolder[indexx])]
        for(let j=0; j<datakeep.length; j++){
            if(bodyOperation[i]===datakeep[j]){
                req.func = datakeep[Object.keys(datakeep)]
                console.log('a')
                console.log(Object.keys(dataHolder[indexx]))
            }
            else{
                
                if(j==datakeep.length-1){
                    console.log('b')
                    console.log(indexx)
                    indexx = indexx+1
                    datakeep = dataHolder[indexx][Object.keys(dataHolder[indexx])]
                    console.log(datakeep)
                    
                }
                else{
                    console.log('c')
                }

            }

        }
    }

    next()
  }*/

app.post('/',getAnswer ,getOperationType,(req,res)=>{
    res.json({"slackUsername":"Igoche",
              "operation_type":req.operand,
            "result":req.output})
  
})


app.listen(port, ()=> console.log('in here'))