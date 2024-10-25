export class Image {
    url: string;

    constructor(url: string){
        this.url = url;
    }

    get(){
        return this.url;
    }
    set(url: string){
        this.url = url;
    }
}
