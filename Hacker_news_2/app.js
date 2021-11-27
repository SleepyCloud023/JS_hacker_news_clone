// 화면을 표시할 최상단 영역(root)
const container = document.getElementById('root');
const ul = document.createElement('ul');
const content = document.createElement('div');
const ajax = new XMLHttpRequest();
const HackerNews_URL = 'https://api.hnpwa.com/v0/news/1.json';
const newsItem_URL = 'https://api.hnpwa.com/v0/item/@id.json';

container.appendChild(ul);
container.appendChild(content);

ajax.open('GET', HackerNews_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);

window.addEventListener('hashchange', function() {
    const id = location.hash.substring(1);
    
    ajax.open('GET', newsItem_URL.replace('@id', id), false);
    ajax.send();

    const newsContent = JSON.parse(ajax.response);
    const content_title = this.document.createElement('h1');
    
    content_title.innerHTML = newsContent.title;
    content.appendChild(content_title);
});


for (let i = 0; i < newsFeed.length && i < 10; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a')
    const NewsItem_ID = newsFeed[i].id;

    a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;
    a.href = `#${NewsItem_ID}`;

    li.appendChild(a);
    ul.appendChild(li);
}
 
