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
                session.send("Which sector are you interested in?");
                builder.Prompts.choice(session, "Right now, we only have data for the following sectors:", "fintech|cleantech|ict");
            },
            function (session, results, next) {
                console.log(results.response);
                session.userData.started = true;
                session.userData.interest = results.response.entity;
                asteroid.call("setUser", session.userData)
                    .catch(function(results) {
                        console.log(results);
                    });
                session.send("I will try to remember you.");
                session.send("I can help you find investment and business partners.\nI can also share the latest news.");
                session.send("So how can I help?");
                session.endDialog();
            }
    ]);
};
module.exports = startup;
