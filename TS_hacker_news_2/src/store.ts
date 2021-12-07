import {NewsFeed} from './types';

export class Store {
    private _currentPage: number;
    private _feeds: NewsFeed[];
    private _feed_history: Map<number, boolean>;

    constructor(){
        this._currentPage = 1;
        this._feeds = [];
        this._feed_history = new Map();
    }

    get allFeeds() {
        return this._feeds;
    }

    get currentPage(): number {
        return this._currentPage;
    }

    set currentPage(pageNumber) {
        this._currentPage = pageNumber;
    }

    get nextPage(): number {
        let next_page = 1;
        if (this._feeds.length > 0){
            let lastPage: number = 1 + Math.floor((this._feeds.length-1)/10);
            next_page = this._currentPage < lastPage ? this.currentPage + 1 : lastPage;
        }
        return next_page;
    }
    
    get prevPage(): number {
        let prev_page = this._currentPage > 1 ? this.currentPage - 1 : 1;
        return prev_page;
    }

    setFeeds(feeds: NewsFeed[]): void {
        this._feeds = feeds;
        this._feeds.forEach( (feed) => {
            this._feed_history.set(feed.id, false);
        });
    }

    readFeed(feed: NewsFeed): void {
        this._feed_history.set(feed.id, true);
    }

    isRead(id: number): boolean {
        const _isRead = this._feed_history.get(id);
        if (_isRead){
            return true;
        } else {
            return false;
        }
    }
}