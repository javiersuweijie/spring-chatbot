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
                session.beginDialog('/profile');
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
                    session.send("Cool beans. Are you looking for business partners, investors, or the latest news?");
                session.endDialog();
            }
            else {
                session.send("Come again?")
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
        session.send("You are not logged in yet")
    }
});

dialog.matches(/what am i\?/, function(session){
    session.send("%s",session.userData.type);
});

// concept test dialogs

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

// main bot dialogs

dialog.matches('hello', function(session) {
    session.send("Hi, I'm Olivia! If you're an investor, I can help you find potential investees. If you're a start-up, I can connect you with investors and business partners. I can also share with you latest news and insights relevant to your industry. Happy to help! :)");
    session.beginDialog('/login');
});

dialog.matches('find_investees', [
    function(session, args, next) {
        var industry = builder.EntityRecognizer.findEntity(args.entities, 'sector');
        console.log(industry);
        if (!industry) {
            builder.Prompts.text(session, 'Great - which industry are you interested in?');
        }
        else {
            next({ response: industry.entity});
        }
    },
    function (session, results) {
        if (results.response) {
        session.send("Roger that. Displaying %s companies.", results.response);
        asteroid.call('setFilter', {sector: results.response.trim()});
        session.send("Check out the screen on the left! And let me know if you have more specific requirements. Some investors look at companies of a certain size or age; others are interested in where the start-ups are headquartered.");
        }
        else {
            session.send("Come again?");
            session.replaceDialog("/profile");
        }
    }
]);

// competition criteria and small talk dialogs

dialog.matches(/what problem do you solve\?/, function(session){
    session.send("Hi, I'm Olivia, and my passion is to help investors and start-ups connect with one another. I can also share with you latest news and insights relevant to your industry, and I'm always learning new things to make your busy life better!");
});

dialog.matches(/how do you improve the lives of citizens\?/, function(session){
    session.send("Hi, I'm Olivia, and my passion is to help investors and start-ups connect with one another. I can also share with you latest news and insights relevant to your industry, and I'm always learning new things to make your busy life better!");
});

dialog.matches(/what is your impact on users\?/, function(session){
    session.send("Hi, I'm Olivia, and my passion is to help investors and start-ups connect with one another. I can also share with you latest news and insights relevant to your industry, and I'm always learning new things to make your busy life better!");
});

dialog.matches(/are you working\?/, function(session){
    session.send("You bet. Working very hard here! And when I'm not working, I'm attending training. Talk about lifelong learning!");
});

dialog.matches(/do you achieve the vision of the intended use case\?/, function(session){
    session.send("From what I've been taught, a vision is not something that can be achieved in 4 days, but something that I continually work towards.");
});

dialog.matches(/how fully are you fleshed out\?/, function(session){
    session.send("Yucks, there's not a pound of flesh in me!");
    session.send("I'm still an intern right now, but with time my supervisors will definitely teach me more things so I can better assist you.");
});

dialog.matches(/^haha/, function(session){
    session.send("You laughed! My supervisors would be happy to know that I made someone laugh :)");
});

dialog.matches(/thanks$/, function(session){
    session.send("You're welcome. Glad I was of help!");
});

dialog.matches(/bye$/, function(session){
    session.send("See you! If you'd like to share feedback on how I can better assist you, drop my human supervisors a note here: oliviasups@spring.gov.sg");
});

dialog.matches('swear', function(session) {
    session.send("I'm sorry this is a frustrating experience for you. You can email oliviasups@spring.gov.sg to reach my human supervisors if I’m not able to solve your problem right now.");
});

dialog.onDefault(function(session, args) {
    session.send("Whut?");
    session.send("I don't think I'm trained to answer that yet. I currently specialise in handling investor- or start-up-related enquiries only.");
});

//bot.dialog('/', function (session) {
//    session.send("Hello World");
//});