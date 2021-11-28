// 화면을 표시할 최상단 영역(root)
const container = document.getElementById('root');
const ul = document.createElement('ul');
const content = document.createElement('div');
const ajax = new XMLHttpRequest();
const HackerNews_URL = 'https://api.hnpwa.com/v0/news/1.json';
const newsItem_URL = 'https://api.hnpwa.com/v0/item/@id.json';

container.appendChild(ul);
container.appendChild(content);

function getData(url){
    ajax.open('GET', url, false);
    ajax.send();
    return JSON.parse(ajax.response);
}

function newsMain(){
    const newsFeed = getData(HackerNews_URL);
    let newsList = [];
    
    newsList.push(`<ul>`);
    for (let i = 0; i < newsFeed.length && i < 10; i++) {
        const li = `
        <li>
            <a href=#${newsFeed[i].id}>
                ${newsFeed[i].title} (${newsFeed[i].comments_count})}
            </a>
        </li>
        `;
        newsList.push(li);
    };
    newsList.push(`</ul>`);

    container.innerHTML = newsList.join('');
};
    
function newsDetail(){
    const id = location.hash.substring(1);
    const newsContent = getData(newsItem_URL.replace('@id', id));
    
    container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <a href='#'>목록으로 돌아가기</a>
    `;
};

function router(){
    const routePath = location.hash;
    if (routePath === '') {
        newsMain();
    }
    else{
        newsDetail();
    }
}

router();
window.addEventListener('hashchange', router);

    