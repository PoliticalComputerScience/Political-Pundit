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
                )
                break;
                //this code just sends the string to Amazon HQ

    case "IntentRequest":
    //Looks like Amazon HQ wants more specific information.  At this point we know it wants someTHING specific, but we don't know EXACTLY what it wants.
                switch(event.request.intent.name) {
                //We are now checking to see what info HQ wants EXACTLY (in this case,  Congress, President, Goodbye, or Help)

                                case "GetCongress":{
                                // Amazon HQ wants info about Congress
                                  context.succeed(
                                    generateResponse(
                                      buildSpeechletResponse("Congress is awesome.", true),
                                      {}
                                    )
                                  )
                                  //this code just sends the string to Amazon HQ.  Notice it's the same format as the LaunchRequest.  This will always be the same, except obviously the string will be different

                                break;
                                }

                                case "GetPresident":{
                                // Amazon HQ wants info about Congress
                                  context.succeed(
                                    generateResponse(
                                      buildSpeechletResponse("Trump is President.", true),
                                      {}
                                    )
                                  )
                                  //this code just sends the string to Amazon HQ.  Notice it's the same format as the LaunchRequest.  This will always be the same, except obviously the string will be different

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
