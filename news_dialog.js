startup = function(bot, builder, asteroid) {
    bot.dialog('/news', [
            function(session) {
                if (session.userData.interest) {
                    session.send("You stated interests in "+ session.userData.interest);
                    session.send("Here are the latest news for that sector");
                    asteroid.call("getNews",{sector: session.userData.interest})
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
                    builder.Prompts.choice("Which sector are you interested in?","fintech|cleantech|ict");
                }
            },
            function (session, results) {
                session.userData.type = results.response.entity;
                session.replaceDialog('/news');
            }
    ]);
};
module.exports = startup;
