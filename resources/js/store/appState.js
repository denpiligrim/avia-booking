import { makeAutoObservable } from "mobx";

class appState {

  direction = null; // arrival, departure, transit
  iata = null; // IATA code
  searchValue = null;
  snackOpen = false;
  snackSeverity = 'success';
  snackText = '';

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

  openSnackbar(severity, text) {
    this.snackSeverity = severity;
    this.snackText = text;
    this.snackOpen = true;
  }

  closeSnackbar() {
    this.snackOpen = false;
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

  get snackbarOpen() {
    return this.snackOpen;
  }
  get snackbarSeverity() {
    return this.snackSeverity;
  }
  get snackbarText() {
    return this.snackText;
  }

}

export default new appState();