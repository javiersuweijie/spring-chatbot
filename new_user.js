startup = function(bot, builder, asteroid) {
    bot.dialog('/new_user', [
            function (session) {
                session.send("I see that you are new so let me get you started.");
                builder.Prompts.text(session, "How should I address you?");
            },
            function (session, results) {
                session.userData.name= results.response;
                session.send("Anyway, type 'back' if you made a mistake and want to go back");
                builder.Prompts.choice(session, "Okay "+session.userData.name+", which of the following are you?", "investor|startup|others");
            },
            function (session, results) {
                session.userData.type = results.response.entity;
                session.send("%s huh?", session.userData.type);
                session.send("What would you like me to help you with?");
                session.userData.started = true;
                console.log(session.userData);
                asteroid.call("setUser", session.userData)
                    .catch(function(results) {
                        console.log(results)
                    });
                session.endDialog();
            }
    ]);
};
module.exports = startup;
