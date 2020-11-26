import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingService} from "./services/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,
              private changeDetection: ChangeDetectorRef,
              private loadingService: LoadingService) {
  }

  center;
  home: {
    position: google.maps.LatLng;
    options: google.maps.MarkerOptions;
  };
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false,
    streetViewControl: false
  };
  circleOptions: google.maps.CircleOptions = {
    radius: 20000,
    fillColor: '#e91e63',
    fillOpacity: 0.5,
    strokeColor: '#e91e63',
    strokeOpacity: 0.6
  };
  myPositionMarkerOption: google.maps.MarkerOptions = {
    icon: 'assets/car-placeholder.png'
  };
  @ViewChild('googleMap') map: google.maps.Map;
  loading: boolean;


  ngOnInit(): void {
    this.loadingService.loadingBS.subscribe(loading => {
      this.loading = loading;
      this.changeDetection.detectChanges();
    });
    navigator.geolocation.getCurrentPosition(position => {
        this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.loadingService.loadingBS.next(false);
      },
      (err) => console.error(err),
      {enableHighAccuracy: true}
    );
  }

  setCircle(position: { latitude: number, longitude: number }): void {
    this.home = null;
    this.home = {
      position: new google.maps.LatLng(position.latitude, position.longitude),
      options: {
        icon: 'assets/home.png'
      }
    };
    setTimeout(() => {
      this.loadingService.loadingBS.next(false);
      this.changeDetection.detectChanges();
    }, 500);
  }

  search(event: google.maps.GeocoderResult[]) {
    if (event.length === 0) {
      this.snackBar.open('No result found', 'Dismiss', {duration: 2000});
      return;
    }
    const chosen = event[0];
    this.setCircle({latitude: chosen.geometry.location.lat(), longitude: chosen.geometry.location.lng()});
  }

}
