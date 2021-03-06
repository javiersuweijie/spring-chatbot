// find investees old version - no longer in use

startup = function(bot, builder, asteroid) {
    bot.dialog('/investees', [
        function(session, args, next) {
            var industry = builder.EntityRecognizer.findEntity(args.entities, 'sector');
            console.log(industry);
            if (!industry) {
                builder.Prompts.text(session, 'Which industry are you interested in?');
            }
            else {
                next({ response: industry.entity});
            }
        },
        function (session, results) {
            if (results.response) {
    // note to self: should do a filter, then do a count.
    // if count = 0, need to say that there are no results found. if count > 0, can display number of entries as well
            session.send("Roger that. Displaying %s entities on your screen.", results.response);
            asteroid.call('setFilter', {meteorId:session.userData.meteorId, filter:{sector: results.response.trim()}});
            session.send("Do you have more requirements (e.g. company age, investment till date)?");
            }
            else {
                session.send("I don't understand.");
                session.endDialog();
            }
        }
    ]);
};

module.exports = startup;