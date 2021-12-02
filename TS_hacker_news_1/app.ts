// 2021-11-28
const container = document.getElementById('root');
const ul = document.createElement('ul');
const content = document.createElement('div');
const ajax = new XMLHttpRequest();
const HackerNews_URL = 'https://api.hnpwa.com/v0/news/1.json';
const newsItem_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const page_prefix = '#/page/';
const show_prefix = '#/show/';

type News = {
    id: number;
    user: string;
    time: number;
    time_ago: string;
    comments_count: number;
    type: string;
    url: string;
}

type NewsFeed = News & {
    title: string;
    points: number;
    domain: string;
}

type NewsDetail = News & {
    title: string;
    points: number;
    content: string;
    comments: NewsComment[];
    domain: string;
}

type NewsComment = News & {
    content: string;
    comments: NewsComment[];
    level: number;
}

type Store = {
    currentPage: number;
    feeds: NewsFeed[];
    feed_history: Map<number, boolean>;
}

const store: Store = {
    currentPage : 1,
    feeds: [],
    feed_history: new Map(),
}

const template = `
    <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
            <div class="mx-auto px-4">
                <div class="flex justify-between items-center py-6">
                    <div class="flex justify-start">
                        <a href="${page_prefix}${store.currentPage}">
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
`

function getData<AjaxResponse>(url: string): AjaxResponse {
    ajax.open('GET', url, false);
    ajax.send();
    return JSON.parse(ajax.response);
}

function init_history(feeds: NewsFeed[]): void {
    for (let i = 0; i < feeds.length; i++) {
        store.feed_history.set(feeds[i].id, false);
    }
};

function check_empty(container: HTMLElement | null, replaceHTML: string): void {
    if (container) {
        container.innerHTML = replaceHTML;
    }
    else {
        console.log('컨테이너 Element를 찾을 수 없습니다.');
    }
}

function newsMain(): void {
    let next_template = template;
    let newsFeed = store.feeds;
    
    if (newsFeed.length === 0){
        store.feeds = newsFeed = getData<NewsFeed[]>(HackerNews_URL);
        // store.feeds = newsFeed = getData(HackerNews_URL);
        init_history(newsFeed);
    }
    
    const prevPage = store.currentPage > 1 ? store.currentPage-1 : 1;
    const lastPageNumber = 1 + Math.floor((newsFeed.length-1)/10);
    const nextPage = store.currentPage < lastPageNumber ? store.currentPage + 1 : store.currentPage;
    let newsList = [];

    console.log(lastPageNumber);

    for (let i = (store.currentPage-1)*10; i < store.currentPage*10 && i < newsFeed.length; i++) {
        const id = newsFeed[i].id;
        const is_read = store.feed_history.get(id);
        console.log(is_read);
        const news_color = is_read? 'text-blue-600' : '';
        const newsTitle = `
        <div class="${news_color} p-6 mt-6 bg-white rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
            <div class="flex items-center">
                <div class="flex-auto">
                    <a href=${show_prefix}${newsFeed[i].id}>
                        ${newsFeed[i].title};
                    </a>
                </div>
                <div class="text-center text-sm">
                    <div class="w-8 px-0 py-1 text-white bg-green-300 rounded-lg">
                        ${newsFeed[i].comments_count}
                    </div>
                </div>
            </div>
            <div class"flex mt-3>
                <div class="grid grid-cols-3 text-sm text-gray-500">
                    <div><i class="fas fa-user mr-1"> ${newsFeed[i].user}</i></div>
                    <div><i class="fas fa-heart mr-1"> ${newsFeed[i].points}</i></div>
                    <div><i class="far fa-clock mr-1"> ${newsFeed[i].time_ago}</i></div>
                </div>
            </div>
        </div>
        `;
        newsList.push(newsTitle);
    };
    next_template = next_template.replace('{{__news_feed__}}', newsList.join(''));
    next_template = next_template.replace('{{__prev_page__}}', `${page_prefix}${prevPage}`);
    next_template = next_template.replace('{{__next_page__}}', `${page_prefix}${nextPage}`);

    check_empty(container, next_template);
};

function newsDetail(){
    const id = Number(location.hash.substring(show_prefix.length));
    const newsContent = getData<NewsDetail>(newsItem_URL.replace('@id', String(id)));

    store.feed_history.set(id, true);
    console.log(`디테일 페이지 id: ${id}`);
    console.log(`히스토리: ${store.feed_history}`);
    
    let detail_template = `
        <div class="bg-gray-600 min-h-screen pb-8">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <a href="${page_prefix}${store.currentPage}">
                                <h1 class="font-extrabold text-4xl">Hacker News</h1>
                            </a>
                        </div>
                        <div class="items-center justify-end">
                            <a href="${page_prefix}${store.currentPage}" class="text-gray-500">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full border rounded-xl bg-white m-6 p-4">
                <h2>${newsContent.title}</h2>
                <div class="text-gray-400 h-20">
                    Content is Empty in JSON response
                    ${newsContent.content}
                </div>
                {{__comments__}}
            </div>
        </div>
    `;

    const next_template = detail_template.replace('{{__comments__}}', makeComment(newsContent.comments));
    check_empty(container, next_template);
    // container.innerHTML = detail_template;
};

function makeComment(comments: NewsComment[], called = 0): string {
    const indent = 40 * called;
    let comment_list = [];

    for (let i = 0; i < comments.length; i++) {
        const comment = `
        <div style="padding-left: ${indent}px;" class="mt-4">
            <div class="text-gray-400">
                <i class="fa fa-sort-up mr-2"></i>
                <strong>${comments[i].user}</strong> ${comments[i].time_ago}
            </div>
            <p class="text-gray-700">${comments[i].content}</p>
        </div>
        `;
        
        const nested_comments = comments[i].comments;
        if (nested_comments.length > 0) {
            comment_list.push(makeComment(nested_comments, called + 1));
        }

        comment_list.push(comment);
    }
    return comment_list.join('');
};

function router(){
    const routePath = location.hash;
    if (routePath === '') {
        newsMain();
    }
    else if(routePath.indexOf(page_prefix) >= 0){
        store.currentPage = Number(routePath.substring(page_prefix.length));
        newsMain();
    }
    else{
        newsDetail();
    }
}

router();
window.addEventListener('hashchange', router);

    