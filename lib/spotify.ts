import fetch from "node-fetch";
import { URLSearchParams } from "url";
import {
    AccessTokenResponse,
    CurrentlyPlayingResponse,
    DataResponse,
    TopTracksResponse,
    TemplateObject,
    EpisodeItem,
    TrackItem,
} from "../models";
import { downloadImage, escapeXML } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const BASIC = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

/**
 * Gets the Spotify access token
 * @returns The object with the access_token property
 */
async function getAccessToken(): Promise<AccessTokenResponse> {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${BASIC}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || "",
        }),
    });

    return await response.json();
}

/**
 * Retrieves information from the Spotify API
 * @param URL The endpoint URL
 * @returns The API response
 */
async function getData<T>(URL: string): Promise<DataResponse<T>> {
    const { access_token } = await getAccessToken();

    const response = await fetch(URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status !== 200) {
        return {
            message: "I'm not listening music right now...",
            error: true,
            data: {} as T,
        };
    }

    const json = await response.json();

    return {
        message: "ok",
        error: false,
        data: json as T,
    };
}

/**
 * Retrieves the currently playing track or episode on Spotify
 * @returns The currently playing object
 */
export async function getNowPlaying() {
    // the default value is "track", added "episode" to get podcasts
    const params = new URLSearchParams({
        additional_types: "track,episode",
    });

    return await getData<CurrentlyPlayingResponse>(
        `${NOW_PLAYING_ENDPOINT}?${params.toString()}`
    );
}

/**
 * Retrieves the top tracks I've listened to on Spotify
 * @returns
 */
export async function getTopTracks() {
    return await getData<TopTracksResponse>(TOP_TRACKS_ENDPOINT);
}

/**
 * Retrieves the parsed data based on the type for use in the template
 * @param data The data to apply to the template
 * @returns The parsed data to use in the template
 */
export async function parseData(
    data: CurrentlyPlayingResponse
): Promise<TemplateObject> {
    return data.currently_playing_type === "episode"
        ? await parseEpisode(data)
        : await parseTrack(data);
}

/**
 * Retrieves a parsed episode
 * @param data The episode to parse
 * @returns The parsed episode
 */
async function parseEpisode(
    data: CurrentlyPlayingResponse
): Promise<TemplateObject> {
    const episode = data.item as EpisodeItem;

    return {
        songName: escapeXML(episode.name),
        artistName: escapeXML(episode.show.name),
        image: await downloadImage(
            episode.show.images[1].url || episode.show.images[0].url
        ),
        songLink: escapeXML(episode.external_urls.spotify),
        artistLink: escapeXML(episode.show.external_urls.spotify),
    };
}

/**
 * Retrieves a parsed track
 * @param data The track to parse
 * @returns The parsed track
 */
async function parseTrack(
    info: CurrentlyPlayingResponse
): Promise<TemplateObject> {
    const track = info.item as TrackItem;

    return {
        songName: escapeXML(track.name),
        artistName: escapeXML(
            track.artists.map((artist) => artist.name).join(", ")
        ),
        image: await downloadImage(
            track.album.images[1].url || track.album.images[0].url
        ),
        songLink: escapeXML(track.external_urls.spotify),
        artistLink: escapeXML(track.artists[0].external_urls.spotify),
    };
}
