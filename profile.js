// profile separate file

startup = function(bot, builder, asteroid) {
    bot.dialog('/profile', [
        function (session) {
            builder.Prompts.choice(session, 'Are you investor or startup?', "investor|startup");
        },
        function (session, results) {
            if (results.response.entity === 'investor' || results.response.entity === 'startup') {
                session.userData.type = results.response.entity;
                session.send("%s, huh?", results.response.entity);
                if (session.userData.type == 'investor')
                    builder.Prompts.choice(session, 'What would you like me to help with?', "Recommend companies|Find news and insights");
                else
                    session.send("Are you seeking other startups, investors, or the latest news?");
                    session.endDialog();
            }
            else {
                session.send("I don't understand.")
                session.replaceDialog('/profile');
            }
        }
    ]);
};

module.exports = startup;