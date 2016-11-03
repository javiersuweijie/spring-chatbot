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
    endpoint: 'ws://localhost:3000/websocket',
    SocketConstructor: ws
});

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

dialog.matches('identity', function(session) {
    session.send("I am a SPRING bot");
});

dialog.matches('hello', function(session) {
    session.send("Hello! Ask me about myself.");
});

dialog.matches('swear', function(session) {
    session.send("That is not very nice of you...");
});

dialog.matches('find_industry', function(session, args) {
    var industry = builder.EntityRecognizer.findEntity(args.entities, 'industry');
    console.log(industry);
    session.send("Searching for %s", industry.entity);
    asteroid.call('createCompany', "new company");
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

dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

//bot.dialog('/', function (session) {
//    session.send("Hello World");
//});
