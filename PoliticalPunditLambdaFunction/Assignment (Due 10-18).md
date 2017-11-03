# PoliticalPundit

### Great job this week guys! These are the things that you'll need to do by next meeting.  Please let me know if you have *any* questions!  You might get stuck up on something.  If you do, don't spend too much time and just ask me :)

## Tasks due by next meeting (10/18):
* Create your own **NEW** skill from the beginning:
  * Go to developer.amazon.com
    * Email: glennparham725@gmail.com
    * Password: g*************g  (sorry, I don't want my log-in public on the internet)
  * Click on 'Alexa' in the menu 
  * This should bring you to the _Get Started with Alexa_ page.  Click on the **Alexa Skills Kit** _Get Started_ button.
  * Click on the _Add a New Skill_ button in the top right corner
    * This should bring you to a page that looks familiar to what we did at the last project meeting
  * To access YOUR CODE, go here: https://console.aws.amazon.com/lambda/
    * Click on *Create Function*, then *Author from Scratch*
      * For 'Role', select 'choose an existing role', and then for 'Existing Role' select 'service-role/lambda_s3_exec_role
* Make a skill that does something (has to be different from what you created today) regarding government/politics AND **uses Google Civic API**
  * Skill must return information about your home address (you can hard code in your address).  You will not be accessing the device's address.  You will just be using your own address.
  * For example, the URL I use to get information about _MY_ representatives in Irvine, I use https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=40HoneyLocustIrvine&includeOffices=true&levels=country
  * Notice the structure: googleapis.com + civicinfo + v2 + representatives + key + address + includeOffices + levels
  * Address, includeOffices, and levels are the only 3 that can be changed
  * Examples of potential skills:
    * Tell us the address of your local representative's office
    * Give us the 'photoURL' of your local congressman
    * Anything else that pulls data from the Google Civic API
  
# You can use THIS WEBSITE: https://echosim.io to test out your skill! You just log in with my account, and you should be able to interact with your skill immediately!
 
## I have provided an example of code that gets the name, party, and district number of my House Representative.  Your code can look really similar to this, but you must change the *google_API_Link* to get information from your own address.  

*Make sure you have the right amount of brackets and parentheses! Also remember to SAVE YOUR CODE!!!!! I predict that may the reason for a lot of your issues*


```javascript

case "GetRepresentative":{

    google_API_Link = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + "40HoneyLocustIrvine" +"&includeOffices=true&levels=country";
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
    }

```

# This must be fully functional by next week's meeting.  I'll be bringing Alexa back and we'll be testing out all of your skills!
