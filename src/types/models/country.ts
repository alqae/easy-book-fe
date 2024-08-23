export class Country {
  ISO: string;

  ISO3: string;

  ISO_Numeric: string;

  fips: string;

  country: string;

  capital: string;

  area: string;

  Population: string;

  Continent: string;

  tld: string;

  CurrencyCode: string;

  CurrencyName: string;

  Phone: string;

  Postal_Code_Format: string;

  Postal_Code_Regex: string;

  Languages: string;

  geonameid: string;

  neighbours: string;

  EquivalentFipsCode: string;

  constructor(
    ISO: string,
    ISO3: string,
    ISO_Numeric: string,
    fips: string,
    country: string,
    capital: string,
    area: string,
    Population: string,
    Continent: string,
    tld: string,
    CurrencyCode: string,
    CurrencyName: string,
    Phone: string,
    Postal_Code_Format: string,
    Postal_Code_Regex: string,
    Languages: string,
    geonameid: string,
    neighbours: string,
    EquivalentFipsCode: string,
  ) {
    this.ISO = ISO;
    this.ISO3 = ISO3;
    this.ISO_Numeric = ISO_Numeric;
    this.fips = fips;
    this.country = country;
    this.capital = capital;
    this.area = area;
    this.Population = Population;
    this.Continent = Continent;
    this.tld = tld;
    this.CurrencyCode = CurrencyCode;
    this.CurrencyName = CurrencyName;
    this.Phone = Phone;
    this.Postal_Code_Format = Postal_Code_Format;
    this.Postal_Code_Regex = Postal_Code_Regex;
    this.Languages = Languages;
    this.geonameid = geonameid;
    this.neighbours = neighbours;
    this.EquivalentFipsCode = EquivalentFipsCode;
  }
}
