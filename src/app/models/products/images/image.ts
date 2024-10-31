export class Image {
    private url: string;

    constructor(url: string){
        this.url = url;
    }

    getUrl(){
        return this.url;
    }
    setUrl(url: string){
        this.url = url;
    }
}
