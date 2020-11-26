import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  geocoder: google.maps.Geocoder;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  reverseGeocode(address: string): Promise<google.maps.GeocoderResult[]> {
    return new Promise(resolve => {
      this.geocoder.geocode({address}, results => {
        resolve(results);
      })
    })
  }
}
