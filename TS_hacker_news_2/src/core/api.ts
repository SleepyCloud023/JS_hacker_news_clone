import {NewsFeed, NewsDetail} from '../types';
import {NewsItem_URL, HackerNews_URL} from '../config';

class Api {
    protected url: string;
    protected ajax: XMLHttpRequest;

    constructor(url: string){
        this.url = url;
        this.ajax = new XMLHttpRequest();
    }

    protected getRequest<AjaxResponse>(): AjaxResponse {
        this.ajax.open('GET', this.url, false);
        this.ajax.send();
        return JSON.parse(this.ajax.response);
    }
}

export class NewsFeedApi extends Api {
    constructor() {
        super(HackerNews_URL);
    }
    getData(): NewsFeed[]{
        return this.getRequest<NewsFeed[]>();
    }
}

export class NewsDetailApi extends Api {
    constructor(id: number) {
        const FullNewsItem_URL = NewsItem_URL.replace('@id', String(id));
        super(FullNewsItem_URL);
    }
    getData(): NewsDetail{
        return this.getRequest<NewsDetail>();
    }
}