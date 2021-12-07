import {NewsFeed, NewsDetail} from '../types';
import {NewsItem_URL, HackerNews_URL} from '../config';

class Api {
    protected url: string;
    protected xhr: XMLHttpRequest;

    constructor(url: string){
        this.url = url;
        this.xhr = new XMLHttpRequest();
    }
    protected async request<AjaxResponse>(): Promise<AjaxResponse> {
        const response = await fetch(this.url);
        return await response.json() as AjaxResponse;
    }
}

export class NewsFeedApi extends Api {
    constructor() {
        super(HackerNews_URL);
    }
    getData(): Promise<NewsFeed[]> {
        return this.request<NewsFeed[]>();
    }
}

export class NewsDetailApi extends Api {
    constructor(id: number) {
        const FullNewsItem_URL = NewsItem_URL.replace('@id', String(id));
        super(FullNewsItem_URL);
    }
    getData(): Promise<NewsDetail> {
        return this.request<NewsDetail>();
    }
}