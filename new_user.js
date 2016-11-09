startup = function(bot, builder, asteroid) {
    bot.dialog('/new_user', [
            function (session) {
                session.send("I see that you are new so let me get you started.");
                builder.Prompts.text(session, "How should I address you?");
            },
            function (session, results) {
                session.userData.name= results.response;
                session.send("Anyway, type 'back' if you made a mistake and want to go back");
                builder.Prompts.choice(session, "Okay "+session.userData.name+", which of the following are you?", "investor|startup|others|back");
            },
            function (session, results, next) {
                if (results.response) {
                    session.userData.type = results.response.entity;
                    session.send("So you %s huh?", session.userData.type);
                }
                if (results.entity && results.response.entity == "back") {
                    next({ resumed: builder.ResumeReason.back });
                    next({ resumed: builder.ResumeReason.back });
                }
                else {
                    session.send("Which sector are you interested in?");
                    builder.Prompts.choice(session, "Right now, we only have data for the following sectors:", "fintech|cleantech|ict|back");
                }
            },
            function (session, results, next) {
                console.log(results.response);
                if (results.response.entity == "back") {
                    next({ resumed: builder.ResumeReason.back });
                    next({ resumed: builder.ResumeReason.back });
                }
                else {
                    session.userData.started = true;
                    session.userData.interest = results.response.entity;
                    asteroid.call("setUser", session.userData)
                        .catch(function(results) {
                            console.log(results);
                        });
                    session.endDialog();
                }
            }
    ]);
};
module.exports = startup;
