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

var LoginDialog = require('./login');
LoginDialog(bot, builder, asteroid);

<<<<<<< 42f8e539c1c1bdd2c0988c2324892e31a5c13984
bot.dialog('/login', [
        function (session) {
            builder.Prompts.text(session, "Please enter your email.");
        },
        function (session, results) {
            session.userData.email = results.response;
            builder.Prompts.text(session, "Please verify your password.");
        },
        function (session, results) {
            asteroid.loginWithPassword({
                email: session.userData.email,
                password: results.response
            }).then(function(result){
                session.send("Success!");
                session.userData.userId = result
                session.endDialog();
                session.beginDialog('/profile');
            }).catch(function(result){
                console.log(result);
                session.send("Wrong login. Try again?");
                session.endDialog(); 
                session.beginDialog('/login');
            });
        }
]);

require('./news_dialog')(bot, builder, asteroid);

bot.dialog('/profile', [
        function (session) {
            builder.Prompts.text(session, 'Are you investor or startup?');
        },
        function (session, results) {
            if (results.response === 'investor' || results.response === 'startup') {
                session.userData.type = results.response;
                session.send("%s, huh?", results.response);
                if (session.userData.type == 'investor')
                    session.send("Are you seeking investees or the latest news?");
                else
                    session.send("Are you seeking other startups, investors, or the latest news?");
                session.endDialog();
            }
            else {
                session.send("I don't understand.")
                session.replaceDialog('/profile');
            }
        }
]);

// dialogs to check backend

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
        session.send("You are not logged in.")
    }
});

dialog.matches(/what am i\?/, function(session){
    session.send("%s",session.userData.type);
});

// concept test dialogs

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
        session.send("Cannot find name, adding company.");
    }
});

// main bot dialogs

dialog.matches('hello', function(session) {
    session.send("Hi, I'm Olivia. Happy to help. I can help you find investment and business partners. I can also share the latest startup news and insights.");
    session.beginDialog('/login');
});

dialog.matches('find_investees', [
    function(session, args, next) {
        var industry = builder.EntityRecognizer.findEntity(args.entities, 'sector');
        console.log(industry);
        if (!industry) {
            builder.Prompts.text(session, 'Which industry are you interested in?');
        }
        else {
            next({ response: industry.entity});
        }
    },
    function (session, results) {
        if (results.response) {
        session.send("Roger that. Displaying %s entities on your screen.", results.response);
        asteroid.call('setFilter', {sector: results.response.trim()});
        session.send("Do you have more requirements (e.g. company age, investment till date)?");
        }
        else {
            session.send("I don't understand.");
            session.replaceDialog("/profile");
        }
    }
]);

// competition criteria and small talk dialogs

dialog.matches(/what problem do you solve\?/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/how do you improve the lives of citizens\?/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/what is your impact on users\?/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/are you working\?/, function(session){
    session.send("You bet. I work, hard! When I'm not working, I'm training. Talk about lifelong learning!");
});

dialog.matches(/do you achieve the vision of the intended use case\?/, function(session){
    session.send("From what I've been taught, a vision is not something that can be achieved in 4 days, but something that I continually work towards.");
});

dialog.matches(/how fully are you fleshed out\?/, function(session){
    session.send("Yucks, there's not a pound of flesh in me!");
    session.send("I'm currently an intern, but I'm continually learning so I can better assist you.");
});

dialog.matches(/.*?haha.*?/, function(session){
    session.send("You laughed! I wish I knew how to laugh...");
});

dialog.matches(/.*?thank.*?/, function(session){
    session.send("You're welcome. Glad to help!");
});

dialog.matches(/.*?bye.*?/, function(session){
    session.send("See you soon! To share feedback on my service, drop my human supervisors a note at olivia_seow@spring.gov.sg");
});

dialog.matches('swear', function(session) {
    session.send("I'm sorry this is frustrating. You can email olivia_seow@spring.gov.sg and a human will get back to you as soon as possible.");
});

dialog.onDefault(function(session, args) {
    session.send("Whut?");
    session.send("I'm not trained to answer that yet. Please let me know if you have investor- or startup-related queries!");
});

//bot.dialog('/', function (session) {
//    session.send("Hello World");
//});
