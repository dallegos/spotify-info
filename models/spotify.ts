export type CurrentlyPlayingType = "track" | "episode" | "ad" | "unknown";

export interface DataResponse<T> {
    message: string;
    error: boolean;
    data: T;
}

export interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export interface CurrentlyPlayingResponse {
    timestamp: number;
    context: Context;
    progress_ms: number;
    item: EpisodeItem | TrackItem;
    currently_playing_type: CurrentlyPlayingType;
    actions: Actions;
    is_playing: boolean;
}

export interface TopTracksResponse {
    items: TrackItem[];
    total: number;
    limit: number;
    offset: number;
    href: string;
    next: string;
    previous?: any;
}

export interface Actions {
    disallows: Disallows;
}

export interface Disallows {
    resuming: boolean;
    skipping_prev: boolean;
}

export interface EpisodeItem {
    audio_preview_url: string;
    description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    html_description: string;
    id: string;
    images: Image[];
    is_externally_hosted: boolean;
    is_playable: boolean;
    language: string;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: string;
    show: Show;
    type: string;
    uri: string;
}

export interface TrackItem {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
}

export interface ExternalIds {
    isrc: string;
}

export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
}

export interface Image {
    height: number;
    url: string;
    width: number;
}

export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface Context {
    external_urls: ExternalUrls;
    href: string;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
}

interface Show {
    available_markets: string[];
    copyrights: any[];
    description: string;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    html_description: string;
    id: string;
    images: Image[];
    is_externally_hosted: boolean;
    languages: string[];
    media_type: string;
    name: string;
    publisher: string;
    total_episodes: number;
    type: string;
    uri: string;
}
