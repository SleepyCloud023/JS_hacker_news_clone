import { Store } from "../store";

export default abstract class View {
    template: string;
    nextViewTemplate: string;
    container: HTMLElement;
    htmlList: string[];
    store: Store;
    
    constructor(containerID: string, template: string, store: Store) {
        const containerElement = document.getElementById(containerID);
        
        if (!containerElement) {
            throw('containerID에 해당하는 요소를 찾을 수 없습니다. (UI error)');
        }
        
        this.container = containerElement;
        this.template = template;
        this.nextViewTemplate = template;
        this.htmlList = [];
        this.store = store;
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
    
    abstract render(store: Store): void
}