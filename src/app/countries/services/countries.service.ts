import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {

    private apiUrl: string = 'https://restcountries.com/v3.1';

    public cacheStore: CacheStore = {
      byCapital:   { term: '', countries: [] },
      byCountries: { term: '', countries: [] },
      byRegion:    { region: '', countries: [] }
    }

    constructor(private http: HttpClient) { }

    private getCountriesRequest( url: string ): Observable<Country[]>{
      return this.http.get<Country[]>( url )
      .pipe( catchError( () => of([]) ) ,
            //delay(2000)
      );
    }

    searchCountryByAlphaCode( code: string ) : Observable<Country | null>{
      return this.http.get<Country[]>( `${this.apiUrl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null),
        catchError( () => of(null) ) )
      ;
    }

    searchCapital( term: string ) : Observable<Country[]>{
        return this.getCountriesRequest(`${this.apiUrl}/capital/${term}`)
        .pipe(
          tap( countries => this.cacheStore.byCapital = { term, countries })
        );
    }

    searchCountry( term: string ) : Observable<Country[]>{
        return this.getCountriesRequest(`${this.apiUrl}/name/${term}`)
        .pipe(
          tap( countries => this.cacheStore.byCountries = { term, countries } )
        );
    }

    searchRegion( term: string ) : Observable<Country[]>{
        return this.getCountriesRequest(`${this.apiUrl}/region/${term}`);
    }

}
