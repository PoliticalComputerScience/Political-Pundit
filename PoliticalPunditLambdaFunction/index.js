const Https = require('https');

//To zip, must go into directory and then do zip -r lambdaTestFunction.zip *
exports.handler = (event, context) => {

  var options = null;
  var state ="";
  var city = "";
  var addressLine1 = "";
  var zipCode = "";
  var addressJSON =null


  var deviceId= null
  var consentToken= null
  var path= null
  var request = null
  var stateNameJSON = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
  }


  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
      // Launch Request
      console.log(`LAUNCH REQUEST`)
      context.succeed(
        generateResponse(
          buildSpeechletResponse("Welcome to political pundit.  Feel free to ask me questions about the United States Government!", false),
          {}
        )
      )

      break;

      case "IntentRequest":
      // Intent Request

      switch(event.request.intent.name) {
        case "GetHouse":{
          try{


            deviceId = event.context.System.device.deviceId;
            consentToken = event.context.System.user.permissions.consentToken
            path = "/v1/devices/" + deviceId + "/settings/address";
            request = getRequestOptions(path, consentToken);

            Https.get(request, (response) => {
              response.on('data', (data) => {
                addressJSON  = JSON.parse(data); //when this is "let" then it results in error

                state = addressJSON.stateOrRegion;
                city = addressJSON.city;
                addressLine1 = addressJSON.addressLine1;
                zipCode = addressJSON.postalCode;

                endpoint2 = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +"%20"+ city +"&includeOffices=true&levels=country";


                body = ""
                Https.get(endpoint2, (response) => {
                  response.on('data', (chunk) => { body += chunk })
                  response.on('end', () => {
                    var namesJSON = JSON.parse(body);
                    var congressmanName = namesJSON.officials[4].name;
                    var congressmanParty = namesJSON.officials[4].party;
                    var districtNumber = namesJSON.officials[4].district;
                    var RepStatement = "Your Congressional representative's name is " + congressmanName +", and is of the " + congressmanParty + " party!  There are 435 representatives in the House of Representatives.";

                    context.succeed(
                      generateResponse(
                        buildSpeechletResponse(RepStatement, true),
                        {}
                      )
                    )
                  })
                })


              })
            })

          }
          catch(err){

            getLocationError(context)

          }

          break;
        }

        case "GetNYT":{
          // var url = "https://api.nytimes.com/svc/topstories/v2/politics.json?api-key=80c203fa7d394f7eb35de7b3a96c31db";
try{
          var request = require('request');
          var names = event.request.intent.slots.Name;
          if(names.value != undefined) {
            request('https://api.nytimes.com/svc/topstories/v2/politics.json?api-key=80c203fa7d394f7eb35de7b3a96c31db', function (error, response, body) {
              var nytimesJSON = JSON.parse(body);
              var results = nytimesJSON.results;
              var value = names.value.toLowerCase();
              var statement = "Here are the top political headlines about " + value + ": ";
              var count = 1;
              for (i = 0; i < results.length; i++) {
                if (count > 3) {
                  break;
                }
                var contains = false;
                var des_facet = results[i].des_facet;
                var per_facet = results[i].per_facet;
                for (d = 0; d < des_facet.length; d++) {
                  if (des_facet[d] != undefined && des_facet[d].toLowerCase().includes(value)) {
                    contains = true;
                  }
                }
                for (p = 0; p < per_facet.length; p++) {
                  if (per_facet[p] != undefined && per_facet[p].toLowerCase().includes(value)) {
                    contains = true;
                  }
                }
                if (contains && results[i].subsection == "Politics") {
                  statement += count + ". " + results[i].title + ". Abstract: " + results[i].abstract + " ";
                  count += 1;
                }
              }
              if (count == 1) {
                statement = "Sorry, I couldn't find any articles about " + value + ".";
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(statement, true),
                    {}
                  )
                )
              }
              context.succeed(
                generateResponse(
                  buildSpeechletResponse(statement, true),
                  {}
                )
              )
            });
          }
          else {
            request('https://api.nytimes.com/svc/topstories/v2/politics.json?api-key=80c203fa7d394f7eb35de7b3a96c31db', function (error, response, body) {
              var nytimesJSON = JSON.parse(body);
              var results = nytimesJSON.results;
              var statement = "Here are the top three political headlines of today: ";
              for (i = 0; i <= 2; i++) {
                statement += (i + 1) + ". " + results[i].title + ". Abstract: " + results[i].abstract + " ";
              }
              context.succeed(
                generateResponse(
                  buildSpeechletResponse(statement, true),
                  {}
                )
              )
            });
          }
        }
        catch(err){

      getLocationError(context)

    }
          break;
        }

        case 'GetCongressmanBio':{
          deviceId = event.context.System.device.deviceId;
          consentToken = event.context.System.user.permissions.consentToken
          path = "/v1/devices/" + deviceId + "/settings/address";
          request = getRequestOptions(path, consentToken);

          Https.get(request, (response) => {
            response.on('data', (data) => {
              addressJSON  = JSON.parse(data); //when this is "let" then it results in error

              state = addressJSON.stateOrRegion;
              city = addressJSON.city +"%20";
              addressLine1 = addressJSON.addressLine1;
              zipCode = addressJSON.postalCode;
              console.log("2")
              endpoint2 = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +"&includeOffices=true&levels=country";
              var request = require('request');
              request(endpoint2, function (error, response, body) {
                var namesJSON = JSON.parse(body);
                var reptype = event.request.intent.slots.RepType.value;
                if (reptype != undefined) {
                  var type = reptype.toLowerCase();
                  var name;
                  var name1;
                  if (type == "president") {
                    name = namesJSON.officials[0].name;
                  }
                  else if (type == "vice president") {
                    name = namesJSON.officials[1].name;
                  }
                  else if (type == "senator" || type == "senators") {
                    name = namesJSON.officials[2].name;
                    name1 = namesJSON.officials[3].name;
                  }
                  else if (type == "representative" || type == "congressional representative") {
                    name = namesJSON.officials[4].name;
                  }
                  //https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Donald_J._Trump&redirects=1
                  var namesplit = name.split(" ");
                  var firstname;
                  var lastname;
                  if (namesplit.length == 2) {
                    firstname = namesplit[0];
                    lastname = namesplit[1];
                  }
                  else if (namesplit.length == 3) {
                    firstname = namesplit[0];
                    lastname = namesplit[2];
                  }
                  var title = firstname + "_" + lastname;
                  var wiki = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + title + "&redirects=1"
                  if (type == "senator" || type == "senators") {
                    var namesplit1 = name1.split(" ");
                    var firstname1;
                    var lastname1;
                    if (namesplit1.length == 2) {
                      firstname1 = namesplit1[0];
                      lastname1 = namesplit1[1];
                    }
                    else if (namesplit1.length == 3) {
                      firstname1 = namesplit1[0];
                      lastname1 = namesplit1[2];
                    }
                    var title1 = firstname1 + "_" + lastname1;
                    var wiki1 = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + title + "|" + title1 + "&redirects=1"
                    request(wiki1, function (error, response, body) {
                      var wikiJSON = JSON.parse(body);
                      var pages = wikiJSON.query.pages
                      var page = pages[Object.keys(pages)[0]]
                      var page1 = pages[Object.keys(pages)[1]]
                      var extract = page.extract
                      var extract1 = page1.extract
                      var statement = "Your senators are " + name + " and " + name1 + ". " + extract + " " + extract1;
                      context.succeed(
                        generateResponse(
                          buildSpeechletResponse(statement, true),
                          {}
                        )
                      )
                    })
                  }
                  else {
                    request(wiki, function (error, response, body) {
                      var wikiJSON = JSON.parse(body);
                      var pages = wikiJSON.query.pages
                      var page = pages[Object.keys(pages)[0]]
                      var extract = page.extract
                      // for (var i in pages) {
                      //   console.log(i)
                      //   console.log(wikiJSON.query.pages.i.extract)
                      //   extract = wikiJSON.query.pages.i.extract
                      // }
                      var statement = "Your " + type + " is " + name + ". " + extract;
                      context.succeed(
                        generateResponse(
                          buildSpeechletResponse(statement, true),
                          {}
                        )
                      )
                    })
                  }
                }

              })
            })
          })
          break;
        }

        case 'GetMissedVotes':
        {
          //how to use ProPublica API: https://github.com/notioncollective/propublica-congress-node
          var Congress = require( 'propublica-congress-node-master' );
          var client = new Congress( "Gcn3mmNmmpMX8p9XnnL9S03PM8DZT983u7HeV7cP" );

          client.memberLists({
            congressNumber: '114',
            chamber: 'house'
          }).then(function(res) {

            context.succeed(
              generateResponse(
                buildSpeechletResponse("Your congressman was present at Congress "+ res.results[0].members[1].missed_votes_pct+ "percent of the time.", true),
                {}
              )
            )
            console.log(res);
          });
          break;
        }

        case 'educationBills':
        {
          //how to use ProPublica API: https://github.com/notioncollective/propublica-congress-node
          var Congress = require( 'propublica-congress-node-master' );
          var client = new Congress( "Gcn3mmNmmpMX8p9XnnL9S03PM8DZT983u7HeV7cP" );

          client.billsSubjects({
            congressNumber: '115',
            chamber: 'house',
            billType: 'updated'
          }).then(function(res) {

            //var actionDate = ;

            context.succeed(
              generateResponse(
                buildSpeechletResponse("The most recent bill is "+ res.results[0].bills[0].short_title, true),
                {}
              )
            )
            console.log(res);
          });
          break;
        }


        case "GetGDP":{
          var Fred = require('fred-api');

          apiKey = process.env.FRED_KEY;
          fred   = new Fred("2a90fe274878fbce8ae5660935beac8a");

          fred.getSeries({series_id: 'GNPCA'}, function(error, result) {
            console.log(result)
          });

          break;
        }



        case "GetCongressAddress":{
try{
          google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=19855%20Annenberg%20Ashburn&includeOffices=true&levels=country";
          //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

          body = "";                                            //DON'T TOUCH
          Https.get(google_API_Link, (response) => {           //DON'T TOUCH
          response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
          response.on('end', () => {                         //DON'T TOUCH
          var namesJSON = JSON.parse(body);                //DON'T TOUCH.
          //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
          var congressmanName = namesJSON.officials[3].name;
          var congressmanParty = namesJSON.officials[3].party;
          var districtNumber = namesJSON.officials[3].district;
          var congressmanStreet = namesJSON.officials[3].address[0].line1;
          var congressmanCity = namesJSON.officials[3].address[0].city;
          var congressmanState = namesJSON.officials[3].address[0].state;
          var congressmanZip = namesJSON.officials[3].address[0].zip;
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
    }
    catch(err){

      getLocationError(context)

    }
      break;
    }



    case "GetCongressFacebookPage":{
try{
      google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=19855%20Annenberg%20Ashburn&includeOffices=true&levels=country";
      //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

      body = "";                                            //DON'T TOUCH
      Https.get(google_API_Link, (response) => {           //DON'T TOUCH
      response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
      response.on('end', () => {                         //DON'T TOUCH
      var namesJSON = JSON.parse(body);                //DON'T TOUCH.
      //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
      var congressmanName = namesJSON.officials[3].name;
      var congressmanParty = namesJSON.officials[3].party;

      var hasAccount = false;
      var socialData = namesJSON.officials[3].channels;
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
}
catch(err){

      getLocationError(context)

    }

  break;
}

case "GetCongressGooglePlus":{
try{
  google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=19855%20Annenberg%20Ashburn&includeOffices=true&levels=country";
  //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

  body = "";                                         //DON'T TOUCH
  Https.get(google_API_Link, (response) => {           //DON'T TOUCH
  response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
  response.on('end', () => {                         //DON'T TOUCH
  var namesJSON = JSON.parse(body);                //DON'T TOUCH.
  //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
  var congressmanName = namesJSON.officials[3].name;
  var congressmanParty = namesJSON.officials[3].party;

  var hasAccount = false;
  var socialData = namesJSON.officials[3].channels;
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
}
catch(err){

      getLocationError(context)

    }
break;
}


case "GetCongressTwitter":{
try{
  google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=19855%20Annenberg%20Ashburn&includeOffices=true&levels=country";
  //CHANGE THIS LINK to include your OWN address (aka switch out 40HoneyLocustIrvine for your address)

  body = "";                                            //DON'T TOUCH
  Https.get(google_API_Link, (response) => {           //DON'T TOUCH
  response.on('data', (chunk) => { body += chunk });  //DON'T TOUCH
  response.on('end', () => {                         //DON'T TOUCH
  var namesJSON = JSON.parse(body);
  console.log(namesJSON);            //DON'T TOUCH.
  //Think of namesJSON as an OBJECT that has a bunch of data in it.  It's basically a bunch of nested dictionaries and arrays.  Access it as such (using "[]" and .)
  var congressmanName = namesJSON.officials[3].name;
  var congressmanParty = namesJSON.officials[3].party;

  var hasAccount = false;
  var socialData = namesJSON.officials[3].channels;
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
}
catch(err){

      getLocationError(context)

    }
    break;
}


case "GetCustomCongressmanPhoneNumber":{


  var Congress = require( 'propublica-congress-node-master' );
  var client = new Congress( "Gcn3mmNmmpMX8p9XnnL9S03PM8DZT983u7HeV7cP" );

  client.memberLists({
    congressNumber: '114',
    chamber: 'house'
  }).then(function(res) {
    console.log(res);
  });

  var congressList = res.results[0].members;
  var congressLastName = event.request.intent.slots.value;
  var congressman = null;

  for(i = 0; i < congressList.length; i++){
    if (congressList[i].last_name == congressLastName){
      congressman = congressList[i];
    }
  }

  var RepStatement = "";
  if (congressman == null){
    RepStatement = "We could not find information on this congressman.";
  } else {
    var congressmanPhone = congressman.phone;
    var congressmanParty = congressman.party;
    RepStatement = "The phone number of" + congressLastName +" from the "+ congressmanParty +" party is " + congressmanPhone ;
  }


  context.succeed(
    generateResponse(
      buildSpeechletResponse(RepStatement, true),
      {}
    )
  );
  break;
}




case 'GetNode':
{
  //how to use ProPublica API: https://github.com/notioncollective/propublica-congress-node
  var Congress = require( 'propublica-congress-node-master' );
  var client = new Congress( "Gcn3mmNmmpMX8p9XnnL9S03PM8DZT983u7HeV7cP" );

  client.memberLists({
    congressNumber: '114',
    chamber: 'house'
  }).then(function(res) {
    console.log(res);
  });

  break;
}


case "GetCongress":{

  try{
    deviceId = event.context.System.device.deviceId;

    consentToken = event.context.System.user.permissions.consentToken;
    path = "/v1/devices/" + deviceId + "/settings/address";
    request = getRequestOptions(path, consentToken);

    Https.get(request, (response) => {
      response.on('data', (data) => {
        addressJSON  = JSON.parse(data); //when this is "let" then it results in error
        state = addressJSON.stateOrRegion;
        city = addressJSON.city;
        addressLine1 = addressJSON.addressLine1;
        zipCode = addressJSON.postalCode;

        endpoint2 = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +"%20"+ city+"&includeOffices=true&levels=country";


        body = ""
        Https.get(endpoint2, (response) => {
          response.on('data', (chunk) => { body += chunk })
          response.on('end', () => {
            var namesJSON = JSON.parse(body);
            var congressmanName = namesJSON.officials[4].name;
            var congressmanParty = namesJSON.officials[4].party;
            var districtNumber = namesJSON.officials[4].district;

            var RepStatement = "Your Congressional representative's name is " + congressmanName +", and is of the " + congressmanParty + " party!  ";

            var senate1Name = namesJSON.officials[2].name;
            var senate1Party = namesJSON.officials[2].party;
            var senate2Name = namesJSON.officials[3].name;
            var senate2Party = namesJSON.officials[3].party;

            var stateFullName  = stateNameJSON[state]


            var SenateStatement = stateFullName + "'s U.S. senators are " + senate1Name + " of the " + senate1Party+ " party, as well as " + senate2Name + " of the " + senate2Party + " party.";
            context.succeed(
              generateResponse(
                buildSpeechletResponse(RepStatement + SenateStatement, true),
                {}
              )
            )
          })
        })



      })
    })

  }
  catch(err){

    getLocationError(context)

  }

  break;
}


case "GetUnemploymentRate":{
  var apiKey = "c7b588404722445b9215590c467e8dcb";
  break;}

  case "GetPollingPrecinct":{


    try{


      deviceId = event.context.System.device.deviceId;
      consentToken = event.context.System.user.permissions.consentToken
      path = "/v1/devices/" + deviceId + "/settings/address";
      request = getRequestOptions(path, consentToken);

      Https.get(request, (response) => {
        response.on('data', (data) => {
          addressJSON  = JSON.parse(data); //when this is "let" then it results in error

          state = addressJSON.stateOrRegion;
          city = addressJSON.city ;
          addressLine1 = addressJSON.addressLine1;
          zipCode = addressJSON.postalCode;


          //var endpoint2 = "https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=40%20Honey%20Locust%20Irvine%20CA&electionId=2000"
          var endpoint2 = "https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +"%20"+ city +"%20"+ state+"&electionId=2000";


          body = ""
          Https.get(endpoint2, (response) => {
            response.on('data', (chunk) => { body += chunk })
            response.on('end', () => {
              var namesJSON = JSON.parse(body);

              var addressLinePoll = namesJSON.pollingLocations[0].address.line1;
              var cityPoll = namesJSON.pollingLocations[0].address.city;
              var statePoll = stateNameJSON[namesJSON.pollingLocations[0].address.state];
              var zipPoll = namesJSON.pollingLocations[0].address.zip;
              var from = addressLine1 + "," + city + "," + state;

              var to = addressLinePoll+ "," + cityPoll+ "," +statePoll;

              var endpoint3 = "https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from="+ from+ "&to=" + to + "&routeType=fastest"
              //var endpoint3= "https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from=40 Honey Locust,Irvine,CA&to=1 Civic Center Plz,Irvine,CA&routeType=fastest"
              //var endpoint3 ="https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from=2425 Blake Street,Berkeley,CA&to=40 Honey Locust,Irvine,CA&routeType=fastest" //DON'T FORGET THE S IN HTTPS LMAOOO
              var  secondBody=""
              Https.get(endpoint3, (response) => {
                response.on('data', (chunk1) => { secondBody += chunk1 }     )
                response.on('end', () => {
                  var mapquestAPI = JSON.parse(secondBody)

                  var time = mapquestAPI.route.realTime;
                  var minuteConversion = Math.trunc((parseInt(time)/60))


                  context.succeed(
                    generateResponse(
                      buildSpeechletResponse("Your designated polling precinct is located at: " + addressLinePoll + " in " + cityPoll + ", " + statePoll + ".  The precinct is only a " + minuteConversion+ " minute drive away from your house!", true),
                      {}
                    )
                  )
                })
              })
            })
          })
        })
      })


    }
    catch(err){

      getLocationError(context)

    }
    break;

  }

  case "GetPresident":{
    context.succeed(
      generateResponse(
        buildSpeechletResponse("Donald J. Trump is the 45th President of the United States.", true),
        {}
      )
    )
    break;

  }
  case "GetVicePresident":{
    context.succeed(
      generateResponse(
        buildSpeechletResponse("Michael Richard Pence is the Vice President of the United States.", true),
        {}
      )
    )
    break;

  }

  case "GetNationalDebt":{
    try{
    var nationalDebtLink = "https://www.treasurydirect.gov/NP_WS/debt/current?format=json"

    Https.get(nationalDebtLink, (response) => {
      response.on('data', (data) => {
        var natDebtJSON = JSON.parse(data)
        var debt = natDebtJSON.totalDebt


        context.succeed(
          generateResponse(
            buildSpeechletResponse("As of today, The United States collectively owes: $" +debt, true),
            {}
          )
        )
      })
    })
}
    catch(err){
      getLocationError(context)
    }
    break;

  }


  case "GetCongressStructure":{

    context.succeed(
      generateResponse(
        buildSpeechletResponse("Congress is the head of the legislative branch of the United States Federal Government.  Congress is comprised of the Senate and the House of Representatives.  Together, the two houses of Congress work together to pass bills that can then be sent to the President's desk to either be signed or vetoed.", true),
        {}
      )
    )
    break;

  }

  case "GetSenateStructure":{

    context.succeed(
      generateResponse(
        buildSpeechletResponse("The U.S. Senate is comprised of 100 senators, 2 from each state.  The Vice President of the United States is the President of the Senate.  Under him or her is the President Pro Tempore, the most senior member of the Senate's majority party.", true),
        {}
      )
    )
    break;

  }

  case "GetHouseStructure":{

    context.succeed(
      generateResponse(
        buildSpeechletResponse("The U.S. House of Representatives is comprised of 435 Representatives, with each one representing approximately 711,000 people.  The Speaker of the House is the leader of the House.  Under him or her is the Majority Leader, Whip, and so on and so forth.", true),
        {}
      )
    )
    break;

  }



  case "GetVote":{
    //  var voteSmart = "https://api.votesmart.org/Votes.getBill?&key=8357d7f39e61304dbdeebd2e1772a40f&billId=23500"
    //  var voteSmart = "https://api.votesmart.org/Officials.getByLastname?&key=8357d7f39e61304dbdeebd2e1772a40f&lastName=mccain"
    //var candidateId=  26772
    //var voteSmart = "https://api.votesmart.org/Votes.getBillActionVoteByOfficial?&key=8357d7f39e61304dbdeebd2e1772a40f&actionId=60869&candidateId=53270"


    try{

      deviceId = event.context.System.device.deviceId;
      consentToken = event.context.System.user.permissions.consentToken
      path = "/v1/devices/" + deviceId + "/settings/address";
      request = getRequestOptions(path, consentToken);

      Https.get(request, (response) => {
        response.on('data', (data) => {
          addressJSON  = JSON.parse(data); //when this is "let" then it results in error

          var addressLine1 = addressJSON.addressLine1;
          var state = addressJSON.stateOrRegion;
          var city = addressJSON.city ;
          //  var addressLine1 = "40 Honey Locust"

          console.log(addressLine1)



          endpoint2 = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +city+state+"&includeOffices=true&levels=country";


          body = ""
          Https.get(endpoint2, (response) => {
            response.on('data', (chunk) => { body += chunk })
            response.on('end', () => {

              var namesJSON = JSON.parse(body);
              //var congressmanFullName = namesJSON.officials[4].name;
              var senate1Name = namesJSON.officials[2].name;
              //var senate2Name = namesJSON.officials[3].name;

              var lastNameIndex = senate1Name.lastIndexOf(" ");
              var senator1LastName = senate1Name.substring(lastNameIndex+1)
              console.log("Senator's Last name : " +senator1LastName)



              var link = "https://api.votesmart.org/Officials.getByLastname?&key=8357d7f39e61304dbdeebd2e1772a40f&lastName="+ senator1LastName

              //Step 1: Get candidate ID
              Https.get(link, (response) => {
                response.on('data', (data) => {
                  console.log("got votesmart last name")

                  //console.log(data)
                  var parseString = require('xml2js').parseString;
                  var xml = data
                  var xmlToJSONstring = null
                  var JSONstringToJSON = null
                  parseString(xml, function (err, result) {

                    xmlToJSONstring = JSON.stringify(result)
                    JSONstringToJSON = JSON.parse(xmlToJSONstring)


                  }); //close of parseString



                  var candidateId= JSONstringToJSON.candidateList.candidate[0].candidateId[0]
                  var office = JSONstringToJSON.candidateList.candidate[0].title[0]
                  var firstName =  JSONstringToJSON.candidateList.candidate[0].firstName[0]
                  var lastName = JSONstringToJSON.candidateList.candidate[0].lastName[0]
                  console.log(office)
                  var actionID = 60869

                  var voteSmart = "https://api.votesmart.org/Votes.getBillActionVoteByOfficial?&key=8357d7f39e61304dbdeebd2e1772a40f&actionId="+ actionID+"&candidateId=" + candidateId



                  //If you want to work on other bills later, you must request the action ID of a given bill

                  var yay_nay= null
                  var billRawName = null
                  var billShortName = null
                  Https.get(voteSmart, (response) => {
                    response.on('data', (data) => {
                      var parseString = require('xml2js').parseString;
                      var xml = data
                      parseString(xml, function (err, result) {
                        console.dir(result);

                        var xmlToJSONstring = JSON.stringify(result)
                        var JSONstringToJSON = JSON.parse(xmlToJSONstring)
                        yay_nay = JSONstringToJSON.votes.vote[0].action[0]
                        billRawName = JSONstringToJSON.votes.generalInfo[0].title[0]




                        console.log(yay_nay)


                      });

                      if(yay_nay == "yay"){
                        yay_nay = "for"
                      }
                      else{
                        yay_nay= "against"
                      }

                      var indexOfBillName = billRawName.lastIndexOf("- ")
                      billShortName = billRawName.substring(indexOfBillName+2)

                      var finalText = office +" " + firstName  +" "+ lastName+ " voted " + yay_nay +" the " + billShortName
                      context.succeed(
                        generateResponse(
                          buildSpeechletResponse(finalText, true),
                          {}
                        )
                      )
                    })
                  })
                })
              })
            })
          })
        })
      })

    }
    catch(err){

      getLocationError(context)

    }


    break;
  }

  case "GetTest":
  {
    break;
  }

  case "SessionEndedRequest":{
    // Session Ended Request

    context.succeed(
      generateResponse(
        buildSpeechletResponse("Thanks for using me.  See you later!", true),
        {}
      )
    )
    console.log(`SESSION ENDED REQUEST`)

    break;
  }

  case "GetHelp":{
    context.succeed(
      generateResponse(
        buildSpeechletResponse("You can ask me about things pertaining to the United States government and economy.  For example, you can ask 'who represents me in congress?' or 'how large is the US national debt?'  Now, what would you  like to know?", false),
        {}
      )
    )


    break;
  }



  default:
  throw "Invalid intent";
}

break;



default:
context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

}

} catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
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



  function getLocationError(context){
    context.succeed(
      generateResponse(
        buildSpeechletResponse("In order to tell you this information, you'll need to enable location services in the Amazon Alexa App.", true),
        {}
      )
    )
  }
