/*
* Interfaz para simplificar los datos del Country
* Originariamente la interfaz Country ya era enorme
*/
export interface SmallCountry {
    name:         string;
    cca3:         string;
    borders?:     string[];
}

export interface Country {
    name:         Name;
    cca3:         string;
    region:       string;
    subregion:    Subregion;
    borders?:     string[];
}

export enum Region {
    Africa   = "Africa",
    Americas = "Americas",
    Asia     = "Asia",
    Europe   = "Europe",
    Oceania  = "Oceania"
}

export interface Name {
    common:     string;
    official:   string;
    nativeName: { [key: string]: Translation };
}

export interface Translation {
    official: string;
    common:   string;
}

export enum Subregion {
    CentralEurope = "Central Europe",
    EasternEurope = "Eastern Europe",
    NorthernEurope = "Northern Europe",
    SoutheastEurope = "Southeast Europe",
    SouthernEurope = "Southern Europe",
    WesternEurope = "Western Europe",
}
