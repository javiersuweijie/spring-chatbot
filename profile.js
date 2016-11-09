// profile separate file

startup = function(bot, builder, asteroid) {
    bot.dialog('/profile', [
        function (session, results) {
            builder.Prompts.choice(session, 'What would you like me to help with?', "Recommend companies|Find news and insights");
            }
    ]);
};

module.exports = startup;
