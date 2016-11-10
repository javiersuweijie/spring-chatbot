startup = function(bot, builder, asteroid) {
    bot.dialog('/new_user', [
            function (session) {
                session.send("I see that you are new so let me get you started.");
                builder.Prompts.text(session, "How should I address you?");
            },
            function (session, results) {
                session.userData.name= results.response;
                builder.Prompts.choice(session, "Okay "+session.userData.name+", which of the following are you?", "investor|startup");
            },
            function (session, results, next) {
                session.userData.type = results.response.entity;
                var a = session.userData.type=="investor" ? 'an' : 'a';
                session.send("So you are %s %s huh?", a, session.userData.type);
                if (session.userData.type === 'investor') {
                    session.send("Which sector are you interested in?");
                } else {
                    session.send("Which sector is your business in?");
                }
                builder.Prompts.choice(session, "Right now, I have data for these sectors:", "fintech|cleantech|ict");
            },
            function (session, results, next) {
                console.log(results.response);
                session.userData.started = true;
                session.userData.interest = results.response.entity;
                asteroid.call("setUser", session.userData)
                    .catch(function(results) {
                        console.log(results);
                    });
                session.send("All set, %s! I definitely won't forget you.", session.userData.name);
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
