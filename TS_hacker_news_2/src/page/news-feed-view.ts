import { View, NewsFeedApi } from "../core";
import { NewsFeed } from "../types";
import { page_prefix, show_prefix } from "../config";
import { Store } from "../store";

const originTemplate = `
        <div class="bg-gray-600 min-h-screen">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <a href="${page_prefix}1">
                                <h1 class="font-extrabold text-4xl">Hacker News</h1>
                            </a>
                        </div>
                        <div class="justify-end items-center">
                            <a href="{{__prev_page__}}" class="text-gray-500">
                                Prev
                            </a>
                            <a href="{{__next_page__}}" class="text-gray-500 ml-4">
                                Next
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 text-2xl text-gray-700">
                {{__news_feed__}}
            </div>
        </div>
        `;

export default class NewsMainView extends View {
    feeds: NewsFeed[];
    api: NewsFeedApi;

    constructor(containerId: string, store: Store) {
        super(containerId, originTemplate, store);
        this.api = new NewsFeedApi();
        this.feeds = store.allFeeds;
    }
    
    async render(): Promise<void>{
        if (this.feeds.length === 0){
            const response = await this.api.getData();
            this.store.setFeeds(response);
            this.feeds = this.store.allFeeds
        }

        this.store.currentPage = Number(location.hash.substring(page_prefix.length) || 1) ;
        const prevPage = this.store.prevPage;
        const nextPage = this.store.nextPage;
        
    
        for (let i = (this.store.currentPage-1)*10; i < this.store.currentPage*10 && i < this.feeds.length; i++) {
            const {id, title, comments_count, user, points, time_ago} = this.feeds[i];
            const is_read = this.store.isRead(id);
            // console.log(is_read);
            const news_color = is_read? 'text-blue-600' : '';
            const newsTitle = `
            <div class="${news_color} p-6 mt-6 bg-white rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <div class="flex items-center">
                    <div class="flex-auto">
                        <a href=${show_prefix}${id}>
                            ${title};
                        </a>
                    </div>
                    <div class="text-center text-sm">
                        <div class="w-8 px-0 py-1 text-white bg-green-300 rounded-lg">
                            ${comments_count}
                        </div>
                    </div>
                </div>
                <div class"flex mt-3>
                    <div class="grid grid-cols-3 text-sm text-gray-500">
                        <div><i class="fas fa-user mr-1"> ${user}</i></div>
                        <div><i class="fas fa-heart mr-1"> ${points}</i></div>
                        <div><i class="far fa-clock mr-1"> ${time_ago}</i></div>
                    </div>
                </div>
            </div>
            `;
            this.addHtml(newsTitle);
        };
        
        this.replaceHtml('news_feed', this.getHtml());
        this.replaceHtml('prev_page', `${page_prefix}${prevPage}`);
        this.replaceHtml('next_page', `${page_prefix}${nextPage}`);
        this.replaceHtml('current_page', `${this.store.currentPage}`);
        this.updateView();
    }
}
