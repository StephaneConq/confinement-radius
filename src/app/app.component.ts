import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingService} from "./services/loading.service";
import {GeolocationService} from "./services/geolocation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,
              private changeDetection: ChangeDetectorRef,
              private geolocationService: GeolocationService,
              private loadingService: LoadingService) {
  }

  currentRadius: number | 'custom' = 10000;
  customRadius = 10;
  usingCustomRadius = false;

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
    radius: 10000,
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

    this.geolocationService.getCurrentPosition().subscribe(res => {
      console.log(res);
      this.center = new google.maps.LatLng(res.location.lat, res.location.lng);
      this.loadingService.loadingBS.next(false);
    });

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
    this.fitBoundsToCircle();
  }

  changedRadius(radius: number | 'custom', isFromCustom=false): void {
    if (!radius) {
      return;
    }
    if (radius === 'custom') {
      this.currentRadius = radius;
      this.circleOptions.radius = this.customRadius * 1000;
    } else {
      if (isFromCustom) {
        this.circleOptions.radius = this.customRadius * 1000;
      } else {
        this.currentRadius = radius;
        this.circleOptions.radius = parseInt(radius.toString());
      }
    }

    if (!this.home) {
      return;
    }
    const copyHome = JSON.parse(JSON.stringify(this.home));
    this.home = null;
    setTimeout(() => {
      this.home = copyHome;
      this.fitBoundsToCircle();
    });
  }

  fitBoundsToCircle(): void {
    const circle = new google.maps.Circle({radius: this.circleOptions.radius, center: this.home.position});
    this.map.fitBounds(circle.getBounds());
  }

  loseFocus(): void {
    document.getElementById("search-input").blur();
  }

}
