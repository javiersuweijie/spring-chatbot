startup = function(bot, builder, asteroid) {
    bot.dialog('/change_userdata', [
            function (session) {
                builder.Prompts.confirm(session, "Are you sure you want to modify your user profile?");
            },
            function (session, results) {
                if (results.response) {
                session.send("Ok, let's run through your profile again.");
                builder.Prompts.text(session, "Your current name is "+session.userData.name+". How should I address you instead?");
                } else {
                    session.send("Alright, no changes made, "+session.userData.name+"!");
                    session.endDialog();
                }
            },
            function (session, results, next) {
                session.userData.name = results.response;
                builder.Prompts.choice(session, "Got it, "+session.userData.name+"! Your current entity type is "+session.userData.type+". Please re-select your entity type.", "investor|startup");
            },
            function(session, results, next) {
                session.userData.type = results.response.entity;
                var a = session.userData.type=="investor" ? 'an' : 'a';
                session.send("So you are %s %s huh?", a, session.userData.type);
                if (session.userData.type === 'investor') {
                    session.send("You are currently interested in "+session.userData.interest+". Please re-select the industry of your interest.");
                } else {
                    session.send("Your business is currently in the "+session.userData.interest+" sector. Please re-select your sector.");
                }
                builder.Prompts.choice(session, "", "fintech|cleantech|ict");
            },
            function (session, results, next) {
                console.log(results.response);
                session.userData.started = true;
                session.userData.interest = results.response.entity;
                asteroid.call("setUser", session.userData)
                    .catch(function(results) {
                        console.log(results);
                    });
                session.send("All set, %s! I will remember your new profile details.", session.userData.name);
                if (session.userData.type === 'investor') {
                    session.send("I can help you find potential investees.\nI can also share the latest news.");
                    session.send("So how can I help?");
                    session.endDialog();
                } else {
                    session.send("I can help you find potential investors.\nI can also share the latest news.");
                    session.send("So how can I help?");
                    session.endDialog();                    
                }
            }
    ]);
};
module.exports = startup;
