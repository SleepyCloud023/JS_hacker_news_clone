// 2021-11-28
const container = document.getElementById('root');
const ul = document.createElement('ul');
const content = document.createElement('div');
const ajax = new XMLHttpRequest();
const HackerNews_URL = 'https://api.hnpwa.com/v0/news/1.json';
const newsItem_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const page_prefix = '#/page/';
const show_prefix = '#/show/';

const store = {
    currentPage : 1,
}

const template = `
<div class="container mx-3 p-3">
    <h1 style="font-size: 30px;">Hacker News</h1>
    <ul>
        {{__news_feed__}}
    </ul>
    <div>
        <a href="{{__prev_page__}}">Prev</a>
        <a href="{{__next_page__}}">Next</a>
    </div>
</div>
`;

function getData(url){
    ajax.open('GET', url, false);
    ajax.send();
    return JSON.parse(ajax.response);
}

function newsMain(){
    let next_template = template;
    const newsFeed = getData(HackerNews_URL);
    const prevPage = store.currentPage > 1 ? store.currentPage-1 : 1;
    const lastPageNumber = 1 + parseInt((newsFeed.length-1)/10);
    const nextPage = store.currentPage < lastPageNumber ? store.currentPage + 1 : store.currentPage;
    let newsList = [];

    for (let i = (store.currentPage-1)*10; i < store.currentPage*10 && i < newsFeed.length; i++) {
        const li = `
        <li>
            <a href="${show_prefix}${newsFeed[i].id}">
                ${newsFeed[i].title} (${newsFeed[i].comments_count})}
            </a>
        </li>
        `;
        newsList.push(li);
    };
    next_template = next_template.replace('{{__news_feed__}}', newsList.join(''));
    next_template = next_template.replace('{{__prev_page__}}', `${page_prefix}${prevPage}`);
    next_template = next_template.replace('{{__next_page__}}', `${page_prefix}${nextPage}`);

    container.innerHTML = next_template;
};

function newsDetail(){
    const id = location.hash.substring(show_prefix.length);
    const newsContent = getData(newsItem_URL.replace('@id', id));
    
    container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <a href='${page_prefix}${store.currentPage}'>목록으로 돌아가기</a>
    `;
};

function router(){
    const routePath = location.hash;
    if (routePath === '') {
        // console.log('start');
        newsMain();
    }
    else if(routePath.indexOf(page_prefix) >= 0){
        store.currentPage = Number(routePath.substring(page_prefix.length));
        console.log(store.currentPage);
        newsMain();
    }
    else{
        newsDetail();
    }
}

router();
window.addEventListener('hashchange', router);

    