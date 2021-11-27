// document.getElementById('root').innerHTML=
// '<ul><li>하나</li><li>셋</li></ul>'

const ajax = new XMLHttpRequest();
const HackerNews_URL = 'https://api.hnpwa.com/v0/news/1.json';
ajax.open('GET', HackerNews_URL, false);
ajax.send();

// console.log(ajax.response)
const newsFeed = JSON.parse(ajax.response);
// console.log(newsFeed)

const ul = document.createElement('ul');

for (let i = 0; i < newsFeed.length; i++) {
    const li = document.createElement('li');
    li.innerHTML = newsFeed[i].title;
    ul.appendChild(li);
}
 
document.getElementById('root').appendChild(ul);