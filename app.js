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

require('./new_user')(bot, builder, asteroid);
require('./news_dialog')(bot, builder, asteroid);
require('./returning_user')(bot, builder, asteroid);
require('./returning_user_nonews')(bot, builder, asteroid);
require('./debug_commands')(bot, builder, asteroid, dialog);

const greetingMsg = require('./greeting');
const welcomeMsg = require('./welcome');
const thanksMsg = require('./thanks');
const investeeSearch = require('./investee_search');
const investorSearch = require('./investor_search');
var investeeCount = require('./investee_count');
var investorCount = require('./investor_count');

// concept test dialogs

dialog.matches('find_industry', function(session, args) {
    var industry = builder.EntityRecognizer.findEntity(args.entities, 'industry');
    session.userData.sector = industry.entity;
    session.send("Searching for %s", industry.entity);

});

// main bot dialogs

dialog.matches('news', function(session, args) {
    var industry = builder.EntityRecognizer.findEntity(args.entities, 'start-up_industry');
    session.beginDialog('/news',{industry: industry.entity});
});

dialog.matches('hello', function(session) {
    if (session.message.sourceEvent) {
        session.userData.meteorId = session.message.sourceEvent.userId;
        console.log("User detected: "+ session.userData);
    }
    if (session.userData.meteorId) {
        asteroid.call("getUser", session.userData.meteorId)
            .then(function(data) {
                for (var key in data) {
                    session.userData[key] = data[key];
                }
                console.log('User data', session.userData);
                if (!session.userData.started) session.beginDialog('/new_user');
                else {
                    session.send("Welcome back, %s", session.userData.name);
                    session.beginDialog('/returning_user');
                }
            })
            .catch(function(data) {
                console.log("error", data);
            });
    }
    else session.send("You have not registered. Please create an account on the left");
});

dialog.matches('find_investees', [
    function(session, args) {
            var industry = builder.EntityRecognizer.findEntity(args.entities, 'start-up_industry');
            var yearIncorp = builder.EntityRecognizer.findEntity(args.entities, 'start-up_year_incorporated');
            var location = builder.EntityRecognizer.findEntity(args.entities, 'builtin.geography.country');
            var businessType = builder.EntityRecognizer.findEntity(args.entities, 'start-up_business_type');
            var fundingStage = builder.EntityRecognizer.findEntity(args.entities, 'start-up_funding_stage');
            var grant = builder.EntityRecognizer.findEntity(args.entities, 'start-up_grant_type');
            console.log(industry, yearIncorp, location, businessType, fundingStage, grant);
        if (!industry && !yearIncorp && !location && !businessType && !fundingStage && !grant) {
            session.send(investeeSearch());
            session.endDialog();
        } else {
                industry = industry ? industry.entity.trim() : null;
                yearIncorp = yearIncorp ? parseInt(yearIncorp.entity) : null;
                location = location ? location.entity.trim() : null;
                businessType = businessType ? businessType.entity.trim() : null,
                fundingStage = fundingStage ? fundingStage.entity.trim() : null,
                grant = grant ? grant.entity.trim() : null,
// have not figured out how to filter grant because there is grant1 and grant2 in the database
                asteroid.call('setFilter', {meteorId:session.userData.meteorId, filter: {
                                        sector: industry,
                                        year_i: yearIncorp,
                                        country: location,
                                        b2_: businessType,
                                        funding: fundingStage}})
                    .then(function(result){
                        var count = parseInt(result);                        
                        var company_s = count==1 ? "company" : "companies";
                        if (count) session.send(investeeCount(result, company_s));
                        else session.send("I did not find any companies that you were looking for.");
                    })
                    .catch(function(error) {
                        console.log(error);
                        session.send("Bugs and more bugs. They never end do they?"); 
                    });
                session.endDialog();
            }
        }
]);

dialog.matches('find_investors', [
    function(session, args) {
            var industry = builder.EntityRecognizer.findEntity(args.entities, 'start-up_industry');
            var location = builder.EntityRecognizer.findEntity(args.entities, 'builtin.geography.country');
            var businessType = builder.EntityRecognizer.findEntity(args.entities, 'start-up_business_type');
            var fundingStage = builder.EntityRecognizer.findEntity(args.entities, 'start-up_funding_stage');
            console.log(industry, location, businessType, fundingStage);
        if (!industry && !location && !businessType && !fundingStage) {
            session.send(investorSearch());
            session.endDialog();
        } else {
                industry = industry ? industry.entity.trim() : null;
                location = location ? location.entity.trim() : null;
                businessType = businessType ? businessType.entity.trim() : null,
                fundingStage = fundingStage ? fundingStage.entity.trim() : null,
                asteroid.call('setInvestor', {meteorId:session.userData.meteorId, filter: {
                                        sector: industry,
                                        country: location,
                                        b2_: businessType,
                                        funding: fundingStage}})
                    .then(function(result){
                        var count = parseInt(result);                        
                        var investor_s = count==1 ? "investor" : "investors";
                        if (count) session.send(investorCount(result, investor_s));
                        else session.send("I did not find any investors that you were looking for.");
                    })
                    .catch(function(error) {
                        console.log(error);
                        session.send("Bugs and more bugs. They never end do they?"); 
                    });
                session.endDialog();
            }
        }
]);

// competition criteria and small talk dialogs

dialog.matches(/.*?(problem|solve).*/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/.*?(improve|impact).*(life|lives|citizen|user).*/, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/.*?working.*/, function(session){
    session.send("You bet. I work, hard! When I'm not working, I'm training. Talk about lifelong learning!");
});

dialog.matches(/.*?vision.*use case.*/, function(session){
    session.send("From what I've been taught, a vision is not something that can be achieved in 4 days, but something that I continually work towards.");
});

dialog.matches(/.*?fleshed out.*/, function(session){
    session.send("Yucks, there's not a pound of flesh in me!");
    session.send("This is my first week at work, but I'm continually learning so I can better assist you.");
});

dialog.matches(/.*?haha.*/i, function(session){
    session.send("You laughed! I wish I knew how to laugh...");
});

dialog.matches(/.*?grant.*?/i, function(session){
    session.send("Grants are for the weak...I know you're better than that!");
});

dialog.matches(/.*?what do you do.*?/i, function(session){
    session.send("I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches(/who are you\?/i, function(session){
    session.send("Hi, I'm Olivia. I am passionate about connecting start-ups and investors. I can also share the latest startup news and insights. I'm always learning new things to make your busy life better :)");
});

dialog.matches('thanks', function(session){
    session.send(welcomeMsg());
});

dialog.matches(/(wow|great|good|awesome|pretty|cool|neat|nice|amaz)/i, function(session){
    session.send(thanksMsg());
});

dialog.matches(/.*?bye.*?/i, function(session){
    session.send(greetingMsg());
    session.send("If you have feedback, please drop my human supervisors a note at olivia_seow@spring.gov.sg :)");
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
