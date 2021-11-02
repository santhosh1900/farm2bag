import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-world',
  templateUrl: './explore-world.component.html',
  styleUrls: ['./explore-world.component.css']
})
export class ExploreWorldComponent implements OnInit {

  FarmerSection         = true;
  explore               = false;
  Location              : String;
  Delay                 : String;
  constructor() { }

  ngOnInit(): void {
    this.explore = true;
  }

  receiveAd(event){
    event == "Wholesale" ? this.FarmerSection = false : this.FarmerSection = true;
  }

  receiveLoaction(event){
    this.Location = event;
  }

  receiveDelay(event){
    this.Delay = event;
  }

}
