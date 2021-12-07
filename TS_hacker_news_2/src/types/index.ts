import { View } from "../core";

export interface News {
    readonly id: number;
    readonly user: string;
    readonly time: number;
    readonly time_ago: string;
    readonly comments_count: number;
    readonly type: string;
    readonly url: string;
}

export interface NewsFeed extends News {
    readonly title: string;
    readonly points: number;
    readonly domain: string;
}

export interface NewsDetail extends News {
    readonly title: string;
    readonly points: number;
    readonly content: string;
    readonly comments: NewsComment[];
    readonly domain: string;
}

export interface NewsComment extends News {
    readonly content: string;
    readonly comments: NewsComment[];
    readonly level: number;
}

export interface RouteTable {
    path: string;
    page: View;
}