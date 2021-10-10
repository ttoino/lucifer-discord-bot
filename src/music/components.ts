import {} from "@discordjs/builders";
import { QueueRepeatMode } from "discord-player";
import { MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js";
import { SearchResults } from "../util";

export const resumeButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("resume")
        .setEmoji("<:play:894245328386150511>")
        .setStyle("PRIMARY")
        .setDisabled(disabled);

export const pauseButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("pause")
        .setEmoji("<:pause:894245327933165619>")
        .setStyle("PRIMARY")
        .setDisabled(disabled);

export const shuffleButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("shuffle")
        .setEmoji("<:shuffle:894245328298070086>")
        .setStyle("SECONDARY")
        .setDisabled(disabled);

export const nextButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("next")
        .setEmoji("<:skipnext:894245328306454568>")
        .setStyle("PRIMARY")
        .setDisabled(disabled);

export const stopButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("stop")
        .setEmoji("<:stop:894245328298049616>")
        .setStyle("DANGER")
        .setDisabled(disabled);

export const previousPageButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("previouspage")
        .setEmoji("<:chevronleft:894245328411316254>")
        .setStyle("PRIMARY")
        .setDisabled(disabled);

export const nextPageButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("nextpage")
        .setEmoji("<:chevronright:894245328323219466>")
        .setStyle("PRIMARY")
        .setDisabled(disabled);

export const firstPageButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("firstpage")
        .setEmoji("<:pagefirst:894245327840882719>")
        .setStyle("SECONDARY")
        .setDisabled(disabled);

export const lastPageButton = (disabled: boolean = false) =>
    new MessageButton()
        .setCustomId("lastpage")
        .setEmoji("<:pagelast:894245328197414942>")
        .setStyle("SECONDARY")
        .setDisabled(disabled);

const repeatModes = [
    {
        label: "Don't repeat",
        value: QueueRepeatMode.OFF,
    },
    {
        label: "Autoplay",
        value: QueueRepeatMode.AUTOPLAY,
    },
    {
        label: "Repeat track",
        value: QueueRepeatMode.TRACK,
    },
    {
        label: "Repeat queue",
        value: QueueRepeatMode.QUEUE,
    },
];

export const repeatModeMenu = (mode: QueueRepeatMode) =>
    new MessageSelectMenu().setCustomId("repeatmode").addOptions(
        repeatModes.map(({ label, value }) => ({
            label,
            value: value.toString(),
            default: value == mode,
        }))
    );

export const searchMenu = (results: SearchResults) =>
    new MessageSelectMenu().setCustomId("search").addOptions(
        results.tracks.map((track, i) => ({
            value: track.url,
            label: `${track.title}`,
        }))
    );

export const playRow = (
    paused: boolean,
    disableShuffle: boolean,
    disableNext: boolean
) =>
    new MessageActionRow().addComponents(
        shuffleButton(disableShuffle),
        paused ? resumeButton() : pauseButton(),
        nextButton(disableNext),
        stopButton()
    );

export const queueRow = (disablePrevious: boolean, disableNext: boolean) =>
    new MessageActionRow().addComponents(
        firstPageButton(disablePrevious),
        previousPageButton(disablePrevious),
        nextPageButton(disableNext),
        lastPageButton(disableNext)
    );

export const repeatModeMenuRow = (mode: QueueRepeatMode) =>
    new MessageActionRow().addComponents(repeatModeMenu(mode));

export const searchMenuRow = (results: SearchResults) =>
    new MessageActionRow().addComponents(searchMenu(results));
