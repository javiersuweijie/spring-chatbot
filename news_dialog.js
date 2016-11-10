startup = function(bot, builder, asteroid) {
    bot.dialog('/news', [
            function(session, args) {
                var interest = null;
                if (args && args.industry) interest = args.industry;
                else if (session.userData.interest) interest = session.userData.interest
                if (interest) {
                    session.send("You stated interests in "+ interest);
                    session.send("Here are the latest news for that sector");
                    asteroid.call("getNews",{sector: interest})
                        .then(function(data) {
                            for (var i in data) {
                                news = data[i];
                                session.send(news.title+"\n"+news.url);
                                session.endDialog();
                            }
                        })
                        .catch(function(data) {
                            session.send("Opps. Something is not right");
                        });
                }
                else {
                    builder.Prompts.choice(session,"Which sector are you interested in?","fintech|cleantech|ict");
                }
            },
            function (session, results) {
                var interest = results.response.entity;
                session.send("Here are the latest news for that sector");
                asteroid.call("getNews",{sector: interest})
                    .then(function(data) {
                        for (var i in data) {
                            news = data[i];
                            session.send(news.title+"\n"+news.url);
                            session.endDialog();
                        }
                    })
                    .catch(function(data) {
                        session.send("Opps. Something is not right");
                    });
            }
    ]);
};
module.exports = startup;
