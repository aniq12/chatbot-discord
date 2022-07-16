const Discord = require('discord.js')
const client = new Discord.Client({
  shards: "auto",
  //BY: "Tomato#6966",
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: 32767
});
const config = require("./config.js");

client.on('ready', () => {
  client.user.setActivity(`Stupid People`, { type: "LISTENING" })
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) return
  if (message.content === '#join') {
    client.emit('guildMemberAdd', message.member)
  }
  if (config.channelid.includes(message.channel.id)) {
    await message.channel.sendTyping()

    const fetch = require('node-fetch');
    fetch(`https://api-sv2.simsimi.net/v2/?text=${encodeURIComponent(message.content || message.stickers.first().name || '')}&lc=id&cf=false`)
      .then(res => res.json())
      .then(data => {
        message.reply(data.success);
      })

      .catch(e => message.reply('An error occured.'));
    console.log(`Message: ${message.content || message.stickers.first().name}`)
  }
})

client.on("guildMemberAdd", async member => {
      //If not in a guild return
      if(!member.guild) return;
      const welcomeembed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setFooter({ text: "Welcome", iconURL: member.guild.iconURL({ dynamic: true })})
            .setDescription(`**Welcome to ${member.guild.name}!**
      Hi <@${member.id}>!, Thanks to join the server,
      You are the **${member.guild.memberCount}th** Member`)
      //send the welcome embed to there
      member.guild.channels.cache.get(config.CHANNEL_WELCOME).send({ embeds: [welcomeembed] });
      //member roles add on welcome every single role
    })

require('./antiCrash')(client)

client.login(config.token).catch(() => console.log("Invalid token."))
