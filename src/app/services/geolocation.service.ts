import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private http: HttpClient
  ) {
  }

  getCurrentPosition(): Observable<any> {
    return this.http.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${environment.mapsApiKey}`,
      {
        homeMobileCountryCode: 308,
      })
  }
}
