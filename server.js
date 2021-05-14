const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
const prefix = process.env.prefix;
try {
  // GAS(Google Apps Script)からの受信(botの常時起動)
  http.createServer(function(req, res){
   if (req.method == 'POST'){
     var data = "";
     req.on('data', function(chunk){
       data += chunk;
     });
     req.on('end', function(){
       if(!data){
         res.end("No post data");
         return;
       }
       var dataObject = querystring.parse(data);
       console.log("post:" + dataObject.type);
       if(dataObject.type == "wake"){
         console.log("Woke up in post");
         res.end();
         return;
       }
       res.end();
     });
   }
   else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
   }
  }).listen(3000);
  client.on("ready", message => {
    console.log("Bot準備完了～");
    client.user.setActivity(process.env.activity, { type: process.env.acttype }); 
  });
client.on("message", async message => {
  if (message.author.id == client.user.id || message.author.bot) return;
  if (!message.content.startsWith(prefix)) return; //ボットのプレフィックスからメッセージが始まっているか確認
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.mentions.has(client.user)) {
      message.reply("呼びましたか?");
    }
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
