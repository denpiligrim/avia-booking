import { makeAutoObservable } from "mobx";

class appState {

  direction = null; // arrival, departure, transit
  iata = null; // IATA code
  searchValue = null;

  constructor() {
    makeAutoObservable(this);
  }

  changeDirection(val) {
    this.direction = val;
  }

  changeIata(val) {
    this.iata = val;
  }

  changeSearchVal(val) {
    this.searchValue = val;
  }

  get directionVal() {
    return this.direction;
  }

  get iataVal() {
    return this.iata;
  }

  get searchVal() {
    return this.searchValue;
  }

}

export default new appState();