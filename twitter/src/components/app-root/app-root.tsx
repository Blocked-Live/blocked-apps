import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
        <ion-route url="/tabs" component="app-tabs"> 
          <ion-route url="/home" component="first-tab"></ion-route>
          <ion-route url="/a" component="second"></ion-route>
          <ion-route url="/b" component="third"></ion-route>

        </ion-route>
      </ion-router>
      <ion-nav />
    </ion-app>
      );
  }
}
