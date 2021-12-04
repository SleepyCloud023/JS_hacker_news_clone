// 2021-11-28
const container = document.getElementById('root');
const ul = document.createElement('ul');
const content = document.createElement('div');
const HackerNews_URL = 'https://api.hnpwa.com/v0/news/1.json';
const NewsItem_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const page_prefix = '#/page/';
const show_prefix = '#/show/';

interface News {
    readonly id: number;
    readonly user: string;
    readonly time: number;
    readonly time_ago: string;
    readonly comments_count: number;
    readonly type: string;
    readonly url: string;
}

interface NewsFeed extends News {
    readonly title: string;
    readonly points: number;
    readonly domain: string;
}

interface NewsDetail extends News {
    readonly title: string;
    readonly points: number;
    readonly content: string;
    readonly comments: NewsComment[];
    readonly domain: string;
}

interface NewsComment extends News {
    readonly content: string;
    readonly comments: NewsComment[];
    readonly level: number;
}

interface Store {
    currentPage: number;
    feeds: NewsFeed[];
    feed_history: Map<number, boolean>;
}

interface RouteTable {
    path: string;
    page: View;
}

const store: Store = {
    currentPage : 1,
    feeds: [],
    feed_history: new Map(),
}

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

class NewsFeedApi extends Api {
    constructor() {
        super(HackerNews_URL);
    }
    getData(): NewsFeed[]{
        return this.getRequest<NewsFeed[]>();
    }
}

class NewsDetailApi extends Api {
    constructor(id: number) {
        const FullNewsItem_URL = NewsItem_URL.replace('@id', String(id));
        super(FullNewsItem_URL);
    }
    getData(): NewsDetail{
        return this.getRequest<NewsDetail>();
    }
}

abstract class View {
    template: string;
    nextViewTemplate: string;
    container: HTMLElement;
    htmlList: string[];
    
    constructor(containerID: string, template: string) {
        const containerElement = document.getElementById(containerID);
        
        if (!containerElement) {
            throw('containerID에 해당하는 요소를 찾을 수 없습니다. (UI error)');
        }
        
        this.container = containerElement;
        this.template = template;
        this.nextViewTemplate = template;
        this.htmlList = [];
    }

    updateView() {
        this.container.innerHTML = this.nextViewTemplate;
        this.nextViewTemplate = this.template;
    }

    addHtml(html: string) {
        this.htmlList.push(html);
    }

    getHtml(): string {
        const joinedHtml = this.htmlList.join('');
        this.htmlList = [];
        return joinedHtml;
    }

    replaceHtml(marker: string, html: string){
        this.nextViewTemplate = this.nextViewTemplate.replace(`{{__${marker}__}}`, html);
    }
    
    abstract render(): void
}

class NewsMainView extends View {
    feeds: NewsFeed[];
    api: NewsFeedApi;

    constructor(containerId: string) {
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

        super(containerId, originTemplate);
        this.api = new NewsFeedApi();
        this.feeds = store.feeds;
        
        if (this.feeds.length === 0){
            store.feeds = this.feeds = this.api.getData();
            this.init_history();
        }
    }

    init_history(): void {
        for (let i = 0; i < this.feeds.length; i++) {
            store.feed_history.set(this.feeds[i].id, false);
        }
    }

    render() {
        store.currentPage = Number(location.hash.substring(page_prefix.length) || 1) ;
        const newsLength = this.feeds.length;
        const prevPage = store.currentPage > 1 ? store.currentPage-1 : 1;
        const lastPageNumber = 1 + Math.floor((newsLength-1)/10);
        const nextPage = store.currentPage < lastPageNumber ? store.currentPage + 1 : store.currentPage;
    
        for (let i = (store.currentPage-1)*10; i < store.currentPage*10 && i < newsLength; i++) {
            const {id, title, comments_count, user, points, time_ago} = this.feeds[i];
            const is_read = store.feed_history.get(id);
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
        this.replaceHtml('current_page', `${store.currentPage}`);
        this.updateView();
    }

}

class NewsDetailView extends View{

    constructor(containerId: string) {
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
        super(containerId, originTemplate);
    }

    render() {
        const id = Number(location.hash.substring(show_prefix.length));
        const newsDetailApi = new NewsDetailApi(id);
        const newsContent: NewsDetail = newsDetailApi.getData();
        const {title, content, comments} = newsContent;

        store.feed_history.set(id, true);
        // console.log(`디테일 페이지 id: ${id}`);
        // console.log(`히스토리: ${store.feed_history}`);
        
        this.replaceHtml('comments', this.makeComment(comments));
        this.replaceHtml('title', title);
        this.replaceHtml('content', content);
        this.replaceHtml('current_page', `${store.currentPage}`);
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

class Router {
    protected routeTable: RouteTable[];
    protected defaultPage: View | null;

    constructor() {
        this.routeTable = [];
        this.defaultPage = null;
        // 이벤트 핸들러로 context 넘기기 중요
        // window.addEventListener('hashchange', this.route.bind(this));
    }

    setDefaultPage(page: View) {
        this.defaultPage = page;
    }

    addRouteInfo(path: string, page: View) {
        if (this.routeTable.indexOf({path, page}) >= 0) {
            throw new Error("라우팅 테이블에 이미 존재하는 경로입니다.");
        }
        else {
            this.routeTable.push({path, page});
        }
    }

    route() {
        const routePath = location.hash;
        let route_err = true;

        if (routePath === '' && this.defaultPage) {
            this.defaultPage.render();
            route_err = false;
        }
        
        try {
            for (const routeInfo of this.routeTable) {
                if (routePath.indexOf(routeInfo.path) >= 0) {
                    routeInfo.page.render();
                    route_err = false;
                    break;
                }
            }
        } catch (error) {
            console.log(this.routeTable);
        }
        
        if (route_err) throw new Error("라우팅 테이블에 존재하지 않는 경로입니다.");
    }
}

// 2021-12-05
// routePath === '' 케이스에 해당하면
// 전역변수로 저장하고 있는 데이터들이 모두 초기화된다.
// hash값과 관련하여 이슈가 발생하는 것인지 알아볼 필요가 있어보인다.

const newsMainView = new NewsMainView('root');
const newsDetailView = new NewsDetailView('root');
const router = new Router();

router.setDefaultPage(newsMainView);
router.addRouteInfo(page_prefix, newsMainView);
router.addRouteInfo(show_prefix, newsDetailView);

router.route();
window.addEventListener('hashchange', router.route.bind(router));
console.log('arrival test');

    