//To zip, must go into directory and then do zip -r lambdaTestFunction.zip *
const Https = require('https'); //Don't worry about this, this just makes sure that any information that we are getting from the internet is encrypted and secure.

exports.handler = (event, context) => { //Amazon HQ passes us "event" which is an object that has a lot of information that we will extract


  switch (event.request.type) {
    //event.request.type will be equal to some string.  we're basically looking for what Amazon HQ wants from our code.
    // Amazon HQ either wants us to introduce ourselves (i.e. 'Hello, welcome to Political Pundit') *OR* HQ wants us to give specific information (i.e. about Congress).
    //Either a LaunchRequest or an IntentRequest

    case "LaunchRequest":
    //We are introducing ourselves.  This is called a LaunchRequest
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse("Welcome to political pundit.  Feel free to ask me questions about the United States Government!", false),
                    {}
                  )
                );
                break;
                //this code just sends the string to Amazon HQ

    case "IntentRequest":
    //Looks like Amazon HQ wants more specific information.  At this point we know it wants someTHING specific, but we don't know EXACTLY what it wants.
                switch(event.request.intent.name) {
                //We are now checking to see what info HQ wants EXACTLY (in this case,  Congress, President, Goodbye, or Help)

                    
                                case "GetCongressPhoneNumber":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "19855AnnenbergAshburn" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = "";                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        var congressmanName = namesJSON.officials[4].name;
        var congressmanParty = namesJSON.officials[4].party;
        var districtNumber = namesJSON.officials[4].district;
        var congressmanPhone = namesJSON.officials[4].phones[0];
        
        
        var RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +" party, their phone number is " + congressmanPhone ;

       
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        );
      });
    });
    break;
    }

case "GetCongressAddress":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "19855AnnenbergAshburn" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = "";                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        var congressmanName = namesJSON.officials[4].name;
        var congressmanParty = namesJSON.officials[4].party;
        var districtNumber = namesJSON.officials[4].district;
        var congressmanStreet = namesJSON.officials[4].address[0].line1;
        var congressmanCity = namesJSON.officials[4].address[0].city;
        var congressmanState = namesJSON.officials[4].address[0].state;
        var congressmanZip = namesJSON.officials[4].address[0].zip;
        var congressmanAddress = congressmanStreet + " " + congressmanCity + " " + congressmanState + " " + congressmanZip;
        
        var RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +" party, Their office is located at " + congressmanAddress ;

       
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        );
      });
    });
    break;
    }


case "GetCongressFacebookPage":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "19855AnnenbergAshburn" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = "";                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        var congressmanName = namesJSON.officials[4].name;
        var congressmanParty = namesJSON.officials[4].party;
        
        var hasAccount = false; 
        var socialData = namesJSON.officials[4].channels;
        var RepStatement = "";
        for (i = 0; i < socialData.length; i++){
            if (socialData[i].type == "Facebook"){
                 RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, their Facebook page is " + socialData[i].id;
                hasAccount = true;
                break;
            }
        }
        if (!hasAccount){
          RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, they do not have a Facebook Page.";
        }

       
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        );
      });
    });
    break;
    }
    
    
    
    case "GetCongressGooglePlus":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "19855AnnenbergAshburn" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = "";                                         //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        var congressmanName = namesJSON.officials[4].name;
        var congressmanParty = namesJSON.officials[4].party;
        
        var hasAccount = false; 
        var socialData = namesJSON.officials[4].channels;
        var RepStatement = "";
        for (i = 0; i < socialData.length; i++){
            if (socialData[i].type == "GooglePlus"){
                 RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, their GooglePlus account is " + socialData[i].id;
                hasAccount = true;
                break;
            }
        }
        if (!hasAccount){
          RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, they do not have a GooglePlus Account.";
        }

       
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        );
      });
    });
    break;
    }


    case "GetCongressTwitter":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "19855AnnenbergAshburn" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = "";                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        var congressmanName = namesJSON.officials[4].name;
        var congressmanParty = namesJSON.officials[4].party;
        
        var hasAccount = false; 
        var socialData = namesJSON.officials[4].channels;
        RepStatement = "";
        for (i = 0; i < socialData.length; i++){
            if (socialData[i].type == "Twitter"){
                RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, their Twitter account is " + socialData[i].id;
                hasAccount = true;
                break;
            }
        }
        if (!hasAccount){
          RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, they do not have a Twitter Account.";
        }

       
        context.succeed(
          generateResponse(
            buildSpeechletResponse(RepStatement, true),
            {}
          )
        );
      });
    });
    break;
    }


    case "GetCongressYoutube":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "19855AnnenbergAshburn" +"&includeOffices=true&levels=country";
    //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

    body = ""                                            //DON'T TOUCH
    Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk })  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
        var namesJSON = JSON.parse(body);                //DON'T TOUCH. 
            //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
        var congressmanName = namesJSON.officials[4].name;
        var congressmanParty = namesJSON.officials[4].party;
        
        var hasAccount = false; 
        var socialData = namesJSON.officials[4].channels
        for (i = 0; i < socialData.length; i++){
            if (socialData[i].type == "YouTube"){
                var RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, their Youtube channel is " + socialData[i].id;
                hasAccount = true;
                break;
            }
        }
        if (!hasAccount){
          var RepStatement = "Your Congressional representative's name is " + congressmanName +" from the "+ congressmanParty +"party, they do not have a Youtube channel."
        }

       
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









                                case "SessionEndedRequest":{
                                  //Amazon HQ wants us to say goodbye.
                                  // Session Ended Request

                                  context.succeed(
                                    generateResponse(
                                      buildSpeechletResponse("Thanks for using me.  See you later!", true),
                                      {}
                                    )
                                  )
                                  break;
                                }

                                case "GetHelp":{
                                  //Amazon HQ wants us to help the person who is asking the question.

                                  context.succeed(
                                    generateResponse(
                                      buildSpeechletResponse("You are asking for help.", false),
                                      {}
                                    )
                                  )
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
