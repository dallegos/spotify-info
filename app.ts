import express, { Express, Request, Response } from "express";
import { getNowPlaying, getTopTracks } from "./lib/spotify";
import { downloadImage, getTemplate } from "./lib/utils";

const etag = require("etag");

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/top-tracks", async (req: Request, res: Response) => {
    const topTracks = await getTopTracks();
    res.json(topTracks);
});

app.get("/now-playing", async (req: Request, res: Response) => {
    const nowPlaying = await getNowPlaying();

    console.log(nowPlaying.data.item.external_urls.spotify);

    const template = getTemplate("currently-playing.html", {
        songName: nowPlaying.data.item.name,
        artistName: nowPlaying.data.item.artists
            .map((artist) => artist.name)
            .join(", "),
        image: await downloadImage(
            nowPlaying.data.item.album.images[1].url ||
                nowPlaying.data.item.album.images[0].url
        ),
        songLink: nowPlaying.data.item.external_urls.spotify,
        artistLink: nowPlaying.data.item.artists[0].external_urls.spotify,
    });

    res.set({
        "Content-type": "image/svg+xml; charset=utf-8",
        "Cache-Control":
            "no-cache, no-store, must-revalidate, proxy.revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        ETag: etag(template),
    });

    res.send(Buffer.from(template));
});

const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
