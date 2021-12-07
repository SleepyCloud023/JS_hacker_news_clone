import {NewsFeed, NewsDetail} from '../types';
import {NewsItem_URL, HackerNews_URL} from '../config';

class Api {
    protected url: string;
    protected xhr: XMLHttpRequest;

    constructor(url: string){
        this.url = url;
        this.xhr = new XMLHttpRequest();
    }

    protected getRequestWithXHR<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
        this.xhr.open('GET', this.url);
        this.xhr.addEventListener('load', () =>{
            const response_ajax = JSON.parse(this.xhr.response);
            cb(response_ajax);
        })
        this.xhr.send();
    }
    protected getRequestWithPromise <AjaxResponse>(cb: (data: AjaxResponse) => void): void {
        fetch(this.url)
            .then(response => response.json())
            .then(cb)
            .catch(() => {
                console.log('데이터를 불러오지 못했습니다.');
            })
    }

}

export class NewsFeedApi extends Api {
    constructor() {
        super(HackerNews_URL);
    }
    getDataWithXHR(cb: (data: NewsFeed[]) =>void): void{
        this.getRequestWithXHR<NewsFeed[]>(cb);
    }
    getDataWithPromise(cb: (data: NewsFeed[]) =>void): void{
        this.getRequestWithPromise<NewsFeed[]>(cb);
    }
}

export class NewsDetailApi extends Api {
    constructor(id: number) {
        const FullNewsItem_URL = NewsItem_URL.replace('@id', String(id));
        super(FullNewsItem_URL);
    }
    getDataWithXHR(cb: (data: NewsDetail ) => void): void{
        this.getRequestWithXHR<NewsDetail>(cb);
    }
    getDataWithPromise(cb: (data: NewsDetail ) => void): void{
        this.getRequestWithPromise<NewsDetail>(cb);
    }
}