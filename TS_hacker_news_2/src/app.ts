// 2021-12-06
import { Store } from "./types";
import NewsMainView from "./page/news-feed-view";
import NewsDetailView from "./page/news-detail-view";
import { Router } from "./core";
import { page_prefix, show_prefix } from "./config";

const store: Store = {
    currentPage : 1,
    feeds: [],
    feed_history: new Map(),
};

declare global {
    interface Window{
        store: Store;
    }
}

window.store = store;

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

    