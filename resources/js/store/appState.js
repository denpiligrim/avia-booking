import { makeAutoObservable } from "mobx";

class appState {

  direction = null; // arrival, departure, transit
  iata = null; // IATA code

  constructor() {
    makeAutoObservable(this);
  }

  changeDirection(val) {
    this.direction = val;
  }

  changeIata(val) {
    this.iata = val;
  }

  get directionVal() {
    return this.direction;
  }

  get iataVal() {
    return this.iata;
  }

}

export default new appState();