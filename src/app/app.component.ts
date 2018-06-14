import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public users: any[] = [];
  public serverMessage = '';
  public firstNameControl = new FormControl();
  public lastNameControl = new FormControl();
  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.refreshUsers();
  }

  public contactServer(): void {
    this._http.get('http://192.168.1.5:3000', { responseType: 'text' }).subscribe(
      res => {
        console.log('success:', res);
        console.log('=============');
      },
      err => {
        console.error('error:', err);
      }
    );
  }

  public refreshUsers(): void {
    this._http.get<any[]>('http://localhost:3000/users').subscribe(users => (this.users = users));
  }

  public addUser() {
    this.serverMessage = '';
    this._http
      .post<any>('http://localhost:3000/users', {
        firstName: this.firstNameControl.value,
        lastName: this.lastNameControl.value
      })
      .subscribe(
        res => {
          console.log('success:', res);
          this.serverMessage = res.message;
          this.refreshUsers();
        },
        err => {
          this.serverMessage = err.error;
        }
      );
  }
}
