import ytdl from "ytdl-core";

export const numberEmoji = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
];

export const like = "👍";
export const dislike = "👎";
export const play = "<:play:894245328386150511>";
export const pause = "<:pause:894245327933165619>";
export const previousSong = "<:skipprevious:894245328423903272>";
export const nextSong = "<:skipnext:894245328306454568>";
export const shuffle = "<:shuffle:894245328298070086>";
export const stop = "<:stop:894245328298049616>";
export const previousPage = "<:chevronleft:894245328411316254>";
export const nextPage = "<:chevronright:894245328323219466>";
export const firstPage = "<:pagefirst:894245327840882719>";
export const lastPage = "<:pagelast:894245328197414942>";

export const botColor = "#F03A17";

export const songsPerPage = 10;

export const botPrefix = process.env.BOT_PREFIX || "!";

export const ytdlOptions: ytdl.downloadOptions = {
    quality: "highest",
    filter: "audioonly",
    highWaterMark: 1 << 25,
    dlChunkSize: 0,
};
