import fetch from "node-fetch";
import { CurrentlyPlayingResponse, TopTracksResponse } from "../models/spotify";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN || "";

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

async function getAccessToken() {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });

    const responseJson = await response.json();
    console.log(responseJson);

    return responseJson;
}

interface Response<T> {
    message: string;
    data: T;
}

async function getData<T>(URL: string): Promise<Response<T>> {
    const { access_token } = (await getAccessToken()) as any;

    const response = await fetch(URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!response.body) {
        return {
            message: "I'm not playing anything right now...",
            data: {} as T,
        };
    }

    const json = await response.json();

    return {
        message: "ok",
        data: json as T,
    };
}

export async function getNowPlaying() {
    return await getData<CurrentlyPlayingResponse>(NOW_PLAYING_ENDPOINT);
}

export const getTopTracks = async () => {
    return await getData<TopTracksResponse>(TOP_TRACKS_ENDPOINT);
};
