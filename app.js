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

require('./news_dialog')(bot, builder, asteroid);

require('./find_investees')(bot, builder, asteroid);

require('./profile')(bot, builder, asteroid);

const greetingMsg = require('./greeting');

const welcomeMsg = require('./welcome');

// dialogs to check backend

dialog.matches(/^looking for/, function(session) {
    console.log(session);
    match = session.message.text.match("looking for (.+)(companies)");
    asteroid.call('setFilter', {user_id:"", type: match[1].trim()});
    session.send("Alert sent");
});

dialog.matches(/\/login_info/, function(session) {
    if (session.userData.userId) {
        session.send("You user id is " + session.userData.userId);
    }
    else {
        session.send("You are not logged in.")
    }
});

dialog.matches(/what am i\?/, function(session){
    session.send("%s",session.userData.type);
});

// concept test dialogs

dialog.matches('find_industry', function(session, args) {
    var industry = builder.EntityRecognizer.findEntity(args.entities, 'industry');
    session.userData.sector = industry.entity;
    session.send("Searching for %s", industry.entity);

});

dialog.matches(/.*?news.*?/, function(session) {
    session.beginDialog('/news');
});

// main bot dialogs

dialog.matches('hello', function(session) {
<<<<<<< HEAD
    session.send("Hi, I'm Olivia! If you're an investor, I can help you find potential investees. If you're a start-up, I can connect you with investors and business partners. I can also share with you latest news and insights relevant to your industry. Happy to help! :)");
    if (session.message.sourceEvent && session.message.sourceEvent.userId) session.userData.userId = session.message.sourceEvent.userId
=======
//    session.send("Hi, I'm Olivia. I can help you find investment and business partners. I can also share the latest startup news and insights!");
// replaced the long hi introduction with the opening statement of the bot, so that olivia can properly say hi to the user!
    session.send(greetingMsg());
>>>>>>> trying a lot of different things
    session.beginDialog('/profile');
});

dialog.matches('find_investees', function(session) {
    session.beginDialog('/investees');
});

// competition criteria and small talk dialogs

dialog.matches(/.*?(problem|solve)?.*?/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/.*?improve.*?(lives|citizens).*?/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/.*?impact.*?users\?/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/.*?working\?/, function(session){
    session.send("You bet. I work, hard! When I'm not working, I'm training. Talk about lifelong learning!");
});

dialog.matches(/.*?vision.*?use case.*?/, function(session){
    session.send("From what I've been taught, a vision is not something that can be achieved in 4 days, but something that I continually work towards.");
});

dialog.matches(/.*?fleshed out.*?/, function(session){
    session.send("Yucks, there's not a pound of flesh in me!");
    session.send("This is my first week at work, but I'm continually learning so I can better assist you.");
});

dialog.matches(/.*?haha.*?/, function(session){
    session.send("You laughed! I wish I knew how to laugh...");
});

dialog.matches(/.*?thank.*?/, function(session){
//    session.send("You're welcome. Glad to help!");
    session.send(welcomeMsg());
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
