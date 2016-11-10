startup = function(bot, builder, asteroid) {
    bot.dialog('/news', [
            function(session, args) {
                var interest = null;
                if (args && args.industry) interest = args.industry;
                else if (session.userData.interest) interest = session.userData.interest
                if (interest) {
                    session.send("You stated interests in "+ interest);
                    asteroid.call("getNews",{meteorId:session.userData.meteorId,filter:{sector: interest}})
                        .then(function(data) {
                            var count = parseInt(data);
                            if (count) {
                                var article_s = count == 1 ? "article" : "articles"
                                session.send("Found %s %s related to %s",data ,article_s, interest);
                                session.send("Showing you only 3 articles");
                            }
                            else {
                                session.send("Sorry I did not find any relevant articles");
                            }
                            session.endDialog();
                        })
                        .catch(function(data) {
                            session.send("Opps. Something is not right");
                            session.endDialog();
                        });
                }
                else {
                    builder.Prompts.choice(session,"Which sector are you interested in?","fintech|cleantech|ict");
                }
            },
            function (session, results) {
                var interest = results.response.entity;
                asteroid.call("getNews",{meteorId:session.userData.meteorId,filter:{sector: interest}})
                    .then(function(data) {
                        var count = parseInt(data);
                        if (count) {
                            var article_s = count == 1 ? "article" : "articles"
                            session.send("Found %s %s related to %s",data ,article_s, interest);
                            session.send("Showing you only 3 articles");
                        }
                        else {
                            session.send("Sorry I did not find any relevant articles");
                        }
                        session.endDialog();
                    })
                    .catch(function(data) {
                        session.send("Opps. Something is not right");
                        session.endDialog();
                    });
            }
    ]);
};
module.exports = startup;
