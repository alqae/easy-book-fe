export class City {
  geonameid: string;

  name: string;

  asciiname: string;

  alternatenames: string[];

  latitude: string;

  longitude: string;

  feature_class: string;

  feature_code: string;

  country_code: string;

  cc2: string;

  admin1_code: string;

  admin2_code: string;

  admin3_code: string;

  admin4_code: string;

  population: string;

  elevation: string;

  dem: string;

  timezone: string;

  modification_date: string;

  constructor(
    geonameid: string,
    name: string,
    asciiname: string,
    alternatenames: string[],
    latitude: string,
    longitude: string,
    feature_class: string,
    feature_code: string,
    country_code: string,
    cc2: string,
    admin1_code: string,
    admin2_code: string,
    admin3_code: string,
    admin4_code: string,
    population: string,
    elevation: string,
    dem: string,
    timezone: string,
    modification_date: string,
  ) {
    this.geonameid = geonameid;
    this.name = name;
    this.asciiname = asciiname;
    this.alternatenames = alternatenames;
    this.latitude = latitude;
    this.longitude = longitude;
    this.feature_class = feature_class;
    this.feature_code = feature_code;
    this.country_code = country_code;
    this.cc2 = cc2;
    this.admin1_code = admin1_code;
    this.admin2_code = admin2_code;
    this.admin3_code = admin3_code;
    this.admin4_code = admin4_code;
    this.population = population;
    this.elevation = elevation;
    this.dem = dem;
    this.timezone = timezone;
    this.modification_date = modification_date;
  }
}
