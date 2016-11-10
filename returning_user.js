startup = function(bot, builder, asteroid) {
    bot.dialog('/returning_user', [
        function (session, results) {
            builder.Prompts.choice(session, "While you were gone, I found some interesting " + session.userData.interest + " news. Would you like to see them?", "Yes|No");
            },
            function (session, results) {
                if (results.response.entity === 'Yes') {
                    session.endDialog();
                    session.userData.return = true;
                    session.beginDialog('/news');
                } else if (results.response.entity === 'No') {
                    session.replaceDialog('/returning_user_nonews');
                } else {
                    console.log(results);
                    session.send("Sorry, I didn't understand that.");
                    session.replaceDialog('/returning_user');
                }
            }
    ]);
};

module.exports = startup;
