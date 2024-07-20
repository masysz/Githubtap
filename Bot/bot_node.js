const { Telegraf } = require("telegraf");
const TOKEN = "7390776943:AAGvJKezEPGBmKlVdRqGHx1DMlIM-geVguQ";
const bot = new Telegraf(TOKEN);

const web_link = "https://tgame-chi.vercel.app";
const community_link = "https://t.me/geto_spirit_announcement"; 
const how_to_earn = `How to play Geto Spirit 🤑

💰 Tap to earn
Tap the screen and collect coins.

🚀 Booster
Use booster and other tools to increase your coins faster.

📈 Level
The more coins you have on your balance, the higher the level of your geto is and the faster you can earn more coins.

👥 Friends
Invite your friends and you’ll get bonuses. Help a friend move to the next level and you'll get even more bonuses.

🪙 Token listing
At the end of the season, a token will be released and distributed among the players.
Dates will be announced in our announcement channel. Stay tuned!`;


bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const urlSent = `${web_link}?ref=${startPayload}`;
  const user = ctx.message.from;
  const userName = user.username ? `@${user.username}` : user.first_name;
  ctx.replyWithMarkdown(`*Hey, ${userName}! Welcome to Geto Spirit!*
Tap on the geto and see your balance rise.

*Geto Spirit* is a Special Telegram App on the TON Blockchain. The biggest part of Geto Spirit GETO Token distribution will occur among the players here.

Got friends, relatives, co-workers?
Bring them all into the game.
More friends, more coins.`, {
      reply_markup: {
          inline_keyboard: [
            [{ text: "👋 Play Geto!", web_app: { url: urlSent } }],
            [{ text: "Join Community", url: community_link }],
            [{ text: "How to earn?", callback_data: "how_to_earn" }]
          ],
      },
  });
});

bot.action("how_to_earn", (ctx) => {
  ctx.reply(how_to_earn);
});

bot.launch();
