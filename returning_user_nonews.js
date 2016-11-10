startup = function(bot, builder, asteroid) {
    bot.dialog('/returning_user_nonews', [
        function (session, results) {
            builder.Prompts.choice(session, "Ok. I also found some companies that might be interesting?", "Yes|No");
            },
            function (session, results) {
                if (results.response.entity === 'Yes') {
                    if (session.userData.type === 'investor') {
                    session.send("66% of the investors like you looked at these companies when you were away.")
                    session.send("Displaying them now.")
                    asteroid.call('setFilter', {meteorId:session.userData.meteorId, filter: {
                                        $or: [
                                            {name : 'GCoreLab Pte Ltd'},
                                            {name : 'Medad Technologies Pte. Ltd.'}
                                            ]
                                        }})
                    session.endDialog();
                    } else {
                    session.send("80% of the startups like you looked at these investors when you were away.")
                    session.send("Displaying them now.")
                    asteroid.call('setInvestor', {meteorId:session.userData.meteorId, filter: {
                                        $or: [
                                            {name : 'Red Dot Ventures'},
                                            {name : 'Michelle Lim'}
                                            ]
                                        }})
                    session.endDialog();
                    }
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
