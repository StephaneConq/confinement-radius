import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GeocoderService} from "../../services/geocoder.service";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  autocomplete: google.maps.places.Autocomplete;
  @Output() searchEvent = new EventEmitter<google.maps.GeocoderResult[]>();

  constructor(
    private geocoderService: GeocoderService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      <HTMLInputElement>document.getElementById('search-input'),
      { types: ["geocode"] }
    );
    this.autocomplete.setFields(["address_component"]);
    this.autocomplete.addListener("place_changed", this.selectAddress);
  }

  onInput(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      document.getElementById('search-input').blur();
    }
  }

  selectAddress = () =>{
    this.loadingService.loadingBS.next(true);
    const place = this.autocomplete.getPlace();
    const numberComponent = place.address_components.find(a => a.types.indexOf('street_number') > -1);
    const routeComponent = place.address_components.find(a => a.types.indexOf('route') > -1);
    const cityComponent = place.address_components.find(a => a.types.indexOf('locality') > -1);
    if (numberComponent && routeComponent && cityComponent) {
      const completeAddress = `${numberComponent.long_name} ${routeComponent.long_name}, ${cityComponent.long_name}`;
      this.geocoderService.reverseGeocode(completeAddress).then(res => {
        this.searchEvent.emit(res);
        document.getElementById('search-input').blur();
      })
    }
  }
}
