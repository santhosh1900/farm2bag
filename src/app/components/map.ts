export interface IGeometry {
    type : string;
    coordinates : number[];
}

export interface IGeoJson {
    type : string;
    geomentry : IGeometry;
    properties? : any;
    $key? : string
}

export class GeoJson implements IGeoJson {
    type : "Feature";
    geomentry : IGeometry;

    constructor(coordinates , public properties?){
        this.geomentry = {
            type : "Point",
            coordinates : coordinates
        }
    }
}

export class FeatureCollection {
    type : "FeatureCollection"
    constructor(public features : Array<GeoJson>){}
}