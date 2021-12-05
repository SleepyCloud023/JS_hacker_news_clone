 import View from './view';
 import { RouteTable } from '../types';

 export default class Router {
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
