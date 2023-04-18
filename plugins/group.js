const { Module, isPublic } = require("../lib/");
const { isAdmin, parsedJid, isUrl } = require("../lib");
const { cron, saveSchedule } = require("../lib/scheduler");
let {
getString
} = require("../lib/lang");
let Lang = getString('group');

Module({
    pattern: "add",
  fromMe: isPublic,
  desc: "Adds a person to group",
  type: "group",

}, async (message, match, m) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    match = match || message.reply_message.jid;
    if (!match) return await message.reply(Lang.ADD_USER);
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply(Lang.NOT_ADMIN);
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.reply(`@${jid[0].split("@")[0]} 𝙰𝙳𝙳𝙴𝙳`, {
      mentions: jid,
    });
  }
);





    Module({
    pattern: "kick",
      fromMe: isPublic,
      desc: "kicks a person from group",
      type: "group",
    
    }, async (message, match, m) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    match = match || message.reply_message.jid;
    if (!match) return await message.reply(Lang.KICK_USER);
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply(Lang.NOT_ADMIN);
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} 𝙺𝙸𝙲𝙺𝙴𝙳`, {
      mentions: jid,
    });
  }
);




    Module({
    pattern: "promote",
      fromMe: isPublic,
      desc: "promote a member",
      type: "group",
    
    }, async (message, match, m) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    match = match || message.reply_message.jid;
    if (!match) return await message.reply(Lang.PROMOTE_USER);
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply(Lang.NOT_ADMIN);
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 𝙰𝚂 𝙰𝙳𝙼𝙸𝙽`, {
      mentions: jid,
    });
  }
);



    Module({
    pattern: "demote",
      fromMe: isPublic,
      desc: "demote a member",
      type: "group",
    
    }, async (message, match, m) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    match = match || message.reply_message.jid;
    if (!match) return await message.reply(Lang.DEMOTE_USER);
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply(Lang.NOT_ADMIN);
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} 𝙳𝙴𝙼𝙾𝚃𝙴𝙳 𝙵𝚁𝙾𝙼 𝙰𝙳𝙼𝙸𝙽`, {
      mentions: jid,
    });
  }
);




    Module({
    pattern: "mute",
      fromMe: isPublic,
      desc: "mute group",
      type: "group",
    
    }, async (message, match, client, m) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply(Lang.NOT_ADMIN);
    await message.reply(Lang.MUTE);
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);



Module({
    pattern: "unmute",
  fromMe: isPublic,
  desc: "unmute group",
  type: "group",

}, async (message, client, match, m) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply(Lang.NOT_ADMIN);
    await message.reply(Lang.UNMUTE);
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);


Module({
    pattern: "amute",
    fromMe: true,
    desc: "auto mutes group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    if (!match) return message.reply(Lang.AMUTE);

    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply(Lang.NOT_ADMIN);
    message.reply(`_Group will mute at ${match}_`);
    await saveSchedule(message.jid, match, async () => {
      await message.reply(Lang.MUTE);
      return await client.groupSettingUpdate(message.jid, "announcement");
    });
    return cron(match, async () => {
      await message.reply(Lang.MUTE);
      return await client.groupSettingUpdate(message.jid, "announcement");
    });
  }
);


Module({
    pattern: "aunmute",
    fromMe: true,
    desc: "auto unmutes group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply(Lang.IS_GROUP);
    if (!match)
      return message.reply(Lang.AUNMUTE);

    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("_I'm not admin_");
    message.reply(`_Group will unmute at ${match}_`);
    await saveSchedule(message.jid, match, async () => {
      await message.reply(Lang.AUN_MUTE);
      return await client.groupSettingUpdate(message.jid, "not_announcement");
    });
    return cron(match, async () => {
      await message.reply(Lang.AUN_MUTE);
      return await client.groupSettingUpdate(message.jid, "not_announcement");
    });
  }
);

Module({
    pattern: "tagall ?(.*)",
    fromMe: true,
    desc: "mention all users in group",
    type: "group",
  }, async (message, match, m) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = match;
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.reply(teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);

Module({
    pattern: "poll ?(.*)",
    fromMe: true,
    desc: "create poll",
    type: "group",
  }, async (message, match, m) => {
    let [poll,opt] = match.split(";");
    if (match.split(";") < 2)
      return await message.reply(
        `poll question;option1,option2,option3.....`
      );
    
    let options = [];

    for (let i of opt.split(',')) {
      options.push({ optionName: i });
    }
    return await message.client.relayMessage(
      message.jid,
      {
        pollCreationMessage: {
          name: poll,
          options,
          selectableOptionsCount: 0,
        },
      },
      {}
    );
  }
);
