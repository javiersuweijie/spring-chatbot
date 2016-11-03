var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
//// Bot Setup
////=========================================================
//
//// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "c20ed0f2-619f-4eeb-b121-770a070574b6",
    appPassword: "N269inrXkenPWcqAqnitMRs"
});
var model = 'https://api.projectoxford.ai/luis/v1/application?id=45e40ce1-29d7-42cb-9c11-5785f9eefbd4&subscription-key=8f04842c92b84e25940c3fa2cea35472'
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
});

dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

//bot.dialog('/', function (session) {
//    session.send("Hello World");
//});
