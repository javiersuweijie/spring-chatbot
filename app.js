var restify = require('restify');
var builder = require('botbuilder');
var Asteroid = require('asteroid').createClass();
var ws = require('ws');

//=========================================================
//// Bot Setup
////=========================================================
//
//// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
//server.listen(3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

//// Setup asteroid to update database
var asteroid = new Asteroid({
    endpoint: 'ws://128.199.65.211:3000/websocket',
    SocketConstructor: ws
});

/*
asteroid.loginWithPassword({
    email: 'javier_su@spring.gov.sg',
    password: 'password'
}).then(function(result) {console.log(result);});
*/

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "c20ed0f2-619f-4eeb-b121-770a070574b6",
    appPassword: "N269inrXkenPWcqAqnitMRs"
});
var model = 'https://api.projectoxford.ai/luis/v1/application?id=de768df7-e6e5-4b47-a6fe-79c3f286da6e&subscription-key=e01c03755775464e8028a0aab1940872'
var recognizer = new builder.LuisRecognizer(model);
var bot = new builder.UniversalBot(connector);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/login', [
        function (session) {
            builder.Prompts.text(session, "Please give me your email");
        },
        function (session, results) {
            session.userData.email = results.response;
            builder.Prompts.text(session, "I sent a verification code to your email. What is it?");
        },
        function (session, results) {
            asteroid.loginWithPassword({
                email: session.userData.email,
                password: results.response
            }).then(function(result){
                session.send("You are now logged in!");
                session.userData.userId = result
                session.endDialog(); 
            }).catch(function(result){
                console.log(result);
                session.send("Something went wrong... Please try again");
                session.endDialog(); 
                session.beginDialog('/login');
            });
        }
]);

bot.dialog('/profile', [
        function (session) {
            builder.Prompts.text(session, 'Are you an investor or a business?');
        },
        function (session, results) {
            if (results.response === 'investor' || results.response === 'business') {
                session.userData.type = results.response;
                session.send("%s huh?", results.response);
                if (session.userData.type == 'investor')
                    session.send("Cool - are you looking for potential investees, or would you like me to share the latest news?");
                else
                    session.send("Cool okay businesssss");
                session.endDialog();
            }
            else {
                session.send("Come again?");
            }
        }
]);

dialog.matches(/^looking for/, function(session) {
    console.log(session);
    match = session.message.text.match("looking for (.+)(companies)");
    asteroid.call('setFilter', {type: match[1].trim()});
    session.send("Alert sent");
});

dialog.matches(/\/login_info/, function(session) {
    if (session.userData.userId) {
        session.send("You are logged in as: " + session.userData.email);
    }
    else {
        session.send("You are not logged in yet")
    }
});

dialog.matches('hello', function(session) {
    session.send("Hi, I’m Olivia! If you're an investor, I can help you find potential investees. If you’re a start-up, I can connect you with investors and business partners. I can also share with you latest news and insights relevant to your industry. Happy to help! :)");
    session.beginDialog('/login');
});

dialog.matches('swear', function(session) {
    session.send("That is not very nice of you...");
});

dialog.matches('find_industry', function(session, args) {
    var industry = builder.EntityRecognizer.findEntity(args.entities, 'industry');
    session.send("Searching for %s", industry.entity);

});

dialog.matches('add_company', function(session, args) {
    var industry = builder.EntityRecognizer.findEntity(args.entities, 'company_name');
    console.log(industry);
    if (industry != null) {
        session.send("Searching for %s", industry.entity);
        asteroid.call('createCompany', industry.entity);
    }
    else {
        session.send("Adding company but cannot find name");
    }
});

dialog.onDefault(function(session, args) {
    //session.beginDialog('/profile');
    session.send("whut?");
});

//bot.dialog('/', function (session) {
//    session.send("Hello World");
//});
