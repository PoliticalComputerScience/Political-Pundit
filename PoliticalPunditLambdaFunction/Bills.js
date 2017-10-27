//To zip, must go into directory and then do zip -r lambdaTestFunction.zip *
const Https = require('https'); //Don't worry about this, this just makes sure that any information that we are getting from the internet is encrypted and secure.

exports.handler = (event, context) => { //Amazon HQ passes us "event" which is an object that has a lot of information that we will extract


  switch (event.request.type) {
    //event.request.type will be equal to some string.  we're basically looking for what Amazon HQ wants from our code.
    // Amazon HQ either wants us to introduce ourselves (i.e. 'Hello, welcome to Political Pundit') *OR* HQ wants us to give specific information (i.e. about Congress).
    //Either a LaunchRequest or an IntentRequest
    
    case "LaunchRequest":
    //We are introducing ourselves.  This is called a LaunchRequest
    //comment
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse("Welcome to political pundit.  Feel free to ask me questions about the United States Government!", false),
                    {}
                  )
                )
                break;
                //this code just sends the string to Amazon HQ

    case "IntentRequest":
    //Looks like Amazon HQ wants more specific information.  At this point we know it wants someTHING specific, but we don't know EXACTLY what it wants.
                switch(event.request.intent.name) {
                //We are now checking to see what info HQ wants EXACTLY (in this case,  Congress, President, Goodbye, or Help)

                                case "getWebsite":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "5150MoccasinAntioch" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = ""                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk })  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        
        var congressmanName = namesJSON.officials[4].name;
        var website = namesJSON.officials[4].urls;
        
       
        var webStatement = congressmanName + "'s wbsite is " + website;
        
        var RepStatement = webStatement;

       
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        )
      })
    })
    break;
    }

    
    case "socialMedia":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "5150MoccasinAntioch" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = ""                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk })  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        
        var congressmanName = namesJSON.officials[4].name;
        var website = namesJSON.officials[4].urls;
        var facebook = namesJSON.officials[4].channels[0].id;
        var twitter = namesJSON.officials[4].channels[1].id;
       
         
        var fbStatement = congressmanName + "'s facebook is " + facebook;
        var twitStatement = "His twitter is " + twitter;
        
        var RepStatement = fbStatement + ". " + twitStatement;
        
        console.log("Testing print");
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        )
      })
    })
    break;
    }
                                
                                case "myRep":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "5150MoccasinAntioch" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = ""                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk })  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        var congressmanName = namesJSON.officials[4].name;
        var congressmanParty = namesJSON.officials[4].party;
        var districtNumber = namesJSON.officials[4].district;

        var RepStatement = "Your Congressional representative's name is " + congressmanName +", and is of the " + congressmanParty + " party!  ";

       
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        )
      })
    })
    break;
    }

                                



                                default:
                                //If Amazon HQ wacks out and asks something we don't know, we'll just say 'Invalid Intent'
                                throw "Invalid intent";
                              }


                            break;
                default:
                context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

              }

} //catch(error) { context.fail(`Exception: ${error}`) }



// These functions help us format the information we send to Amazon HQ.  Don't touch any of it.

buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}

getRequestOptions = (path, consentToken) => {
  return {
    hostname: "api.amazonalexa.com",
    path: path,
    method: 'GET',
    'headers': {
      'Authorization': 'Bearer ' + consentToken}
    }
  }