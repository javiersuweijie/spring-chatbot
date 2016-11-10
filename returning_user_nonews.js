startup = function(bot, builder, asteroid) {
    bot.dialog('/returning_user_nonews', [
        function (session, results) {
            builder.Prompts.choice(session, "Ok. I also found some companies that might be interesting. Take a look?", "Yes|No");
            },
            function (session, results) {
                if (results.response.entity === 'Yes') {
// this part is still static now, we can figure out how to code it later
                    session.send("66% of the investors like you looked at these companies when you were away.")
                    session.send("Displaying them now.")
                    session.userData.return = false;
                    session.endDialog();
                } else if (results.response.entity === 'No') {
                    session.send("Ok. What would you like to find out today?");
                    session.endDialog();
                } else {
                    console.log(results);
                    session.send("Sorry, I didn't understand that.");
                    session.replaceDialog('/returning_user_nonews');
                }
            }
    ]);
};

module.exports = startup;
