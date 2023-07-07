// eslint-disable-next-line @typescript-eslint/no-var-requires
const etag = require("etag");

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import express, { Express, NextFunction, Response } from "express";
import { getNowPlaying, getTopTracks, getTemplate, parseData } from "./lib";

const app: Express = express();
const port = process.env.PORT || 3000;

/**
 * since we are going to return an image, we need to prevent any
 * caching to avoid the image being the same all the time or until the cache is refreshed
 */
app.use(function (_, res: Response, next: NextFunction): void {
    res.set({
        "Cache-Control":
            "no-cache, no-store, must-revalidate, proxy-revalidate",
        "Surrogate-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
    });

    next();
});

/**
 * TODO: Process and create view for top tracks
 */
app.get("/top-tracks", async (_, res: Response) => {
    const topTracks = await getTopTracks();
    res.json(topTracks);
});

app.get("/now-playing", async (_, res: Response) => {
    const nowPlaying = await getNowPlaying();

    const template = getTemplate(
        "currently-playing.html",
        await parseData(nowPlaying.data)
    );

    // This is not on the middleware because I've decided to use the template as the ETag
    res.set("ETag", etag(template));

    // Force to return the parsed template as an SVG file
    res.set("Content-type", "image/svg+xml; charset=utf-8");

    res.send(Buffer.from(template));
});

const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
