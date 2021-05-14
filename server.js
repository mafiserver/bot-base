const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
const prefix = process.env.prefix;
try {
  // GAS(Google Apps Script)からの受信(botの常時起動)
  http.createServer(function(req, res){
   res.write("OK");
   res.end();
  }).listen(8080);
  client.on("ready", message => {
    console.log("Bot準備完了～");
    client.user.setActivity(process.env.activity, { type: process.env.acttype }); 
  });
client.on("message", async message => {
  if (message.author.id == client.user.id || message.author.bot) return;
  if (message.mentions.has(client.user)) {
      message.reply("呼びましたか?");
    }
  if (!message.content.startsWith(prefix)) return; //ボットのプレフィックスからメッセージが始まっているか確認
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "help") { //コマンド名
    message.channel.send({
        embed: {
          title: "ヘルプ",
          description: "全てのコマンドの初めに`" + prefix + "`をつける必要があります。",
          fields: [
            {
              name: "ヘルプ",
              value: "`help`"
            }
          ]
        }
      });
  }
});
  if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
  }

  client.login(process.env.DISCORD_BOT_TOKEN);
} catch (e) {
  console.log(e);
}
