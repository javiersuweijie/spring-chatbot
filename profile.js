// profile separate file

startup = function(bot, builder, asteroid) {
    bot.dialog('/profile', [
        function (session, results) {
            session.send('What would you like me to help with? Recommend companies or Find news and insights');
            session.endDialog();
            }
    ]);
};

module.exports = startup;
