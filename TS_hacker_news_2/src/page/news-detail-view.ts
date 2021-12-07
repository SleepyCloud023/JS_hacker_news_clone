import { View, NewsDetailApi, NewsFeedApi } from '../core';
import { page_prefix, show_prefix } from '../config';
import { NewsDetail, NewsComment } from '../types';
import {Store} from '../store';

export default class NewsDetailView extends View{

    constructor(containerId: string, store: Store) {
        const originTemplate = `
            <div class="bg-gray-600 min-h-screen pb-8">
                <div class="bg-white text-xl">
                    <div class="mx-auto px-4">
                        <div class="flex justify-between items-center py-6">
                            <div class="flex justify-start">
                                <a href="${page_prefix}1">
                                    <h1 class="font-extrabold text-4xl">Hacker News</h1>
                                </a>
                            </div>
                            <div class="items-center justify-end">
                                <a href="${page_prefix}{{__current_page__}}" class="text-gray-500">
                                    <i class="fa fa-times"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-full border rounded-xl bg-white m-6 p-4">
                    <h2>{{__title__}}</h2>
                    <div class="text-gray-400 h-20">
                        Content is Empty in JSON response
                        {{__content__}}
                    </div>
                    {{__comments__}}
                </div>
            </div>
        `;
        super(containerId, originTemplate, store);
    }

    async render(): Promise<void> {
        const id = Number(location.hash.substring(show_prefix.length));
        const newsDetailApi = new NewsDetailApi(id);
        const newsContent: NewsDetail = await newsDetailApi.getData();
        const {title, content, comments} = newsContent;

        this.store.readFeed(newsContent);
        // console.log(`디테일 페이지 id: ${id}`);
        // console.log(`히스토리: ${store.feed_history}`);
        
        this.replaceHtml('comments', this.makeComment(comments));
        this.replaceHtml('title', title);
        this.replaceHtml('content', content);
        this.replaceHtml('current_page', `${this.store.currentPage}`);
        this.updateView();
        // container.innerHTML = detail_template;
    }

    makeComment(newsComments: NewsComment[], called = 0): string {
        const indent = 40 * called;
        
        for (let i = 0; i < newsComments.length; i++) {
            const {user, time_ago, content, comments} = newsComments[i];

            const comment_element = `
            <div style="padding-left: ${indent}px;" class="mt-4">
                <div class="text-gray-400">
                    <i class="fa fa-sort-up mr-2"></i>
                    <strong>${user}</strong> ${time_ago}
                </div>
                <p class="text-gray-700">${content}</p>
            </div>
            `;
            
            if (comments.length > 0) {
                this.addHtml(this.makeComment(comments, called + 1));
            }
    
            this.addHtml(comment_element);
        }
        return this.getHtml();
    };
}
