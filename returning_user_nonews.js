startup = function(bot, builder, asteroid) {
    bot.dialog('/returning_user_nonews', [
        function (session, results) {
            builder.Prompts.choice(session, "Ok. How about looking at some companies similar to your previous search?", "Yes|No");
            },
            function (session, results) {
                if (results.response.entity === 'Yes') {
// this part is still static now, we can figure out how to code it later
                    session.send("Displaying companies. 66% of investors with similar interests as you looked at these.")
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