
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
export interface IB {
  id: number;
  image: string;
  description?: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IB> = [];
  params: '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.bikes = await this.loadBikes();
  }

  async loadBikes() {
    let bikes = JSON.parse(localStorage.getItem('bike'));
    if (bikes && bikes.length > 0) {
    } else {
      bikes = await this.loadBikesFromJson();
    }
    this.bikes = bikes;
    return bikes;
  }

  async loadBikesFromJson() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }

   saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  addB1() {
    const bike: IB = {
      id: null,
      image: '../../assets/bike1.jpeg',
      description: null,
      price: null,
      quantity: 1

    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  addB2() {
    const bike: IB = {
      id: null,
      image: '../../assets/bike2.jpeg',
      description: null,
      price: null,
      quantity: 1

    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  addB3() {
    const bike: IB = {
      id: null,
      image: '../../assets/bike3.jpeg',
      description: null,
      price: null,
      quantity: 1

    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  delete(index: number) {
    this.bikes.splice(index, 1);
    this.saveToLocalStorage();
  }
  
  computeTotal() {
    const data = this.calculate();
    this.router.navigate(['invoice', data]);
  }

  calculate() {
    let owed = 0;
    let firstName = '';
    let lastName = '';
    let fullName = '';
    const name = this.params;

    const commaIndex = name.indexOf(', ');
    let error = false;
    if (commaIndex === -1) {
      this.toastService.showToast('WARNING', 5000, 'Name must have a comma and a space!');
      error = true;
    } else if (name === '') {
      this.toastService.showToast('WARNING', 5000, 'Name must not be empty!');
      error = true;
    }
    if (!error) {
      firstName = name.slice(commaIndex + 1, name.length);
      lastName = name.slice(0, commaIndex);
      fullName = firstName + ' ' + lastName;
      for (let i = 0; i < this.bikes.length; i++) {
        owed += this.bikes[i].price * this.bikes[i].quantity;
      }
      return {
        subTotal: owed,
        taxAmount: owed * .1,
        total: owed + (owed * .1),
        firstName: firstName,
        lastName: lastName,
        fullName: fullName,
      };
    }
  }

  saveItem() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
    this.toastService.showToast('success', 3000, 'Success the items were saved!');
  }

}
