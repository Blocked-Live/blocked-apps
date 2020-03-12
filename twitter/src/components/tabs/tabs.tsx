import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'app-tabs',
  styleUrl: 'tabs.css',
  shadow: true
})
export class Tabs implements ComponentInterface {

  render() {
    return (
      <ion-tabs>

        <ion-tab tab="first-tab" component="app-home"></ion-tab>
  
        <ion-tab tab="second">
          <p>Second</p>
        </ion-tab>
  
        <ion-tab tab="third">
          <ion-nav />
        </ion-tab>
  
        <ion-tab-bar slot="bottom">
          <ion-tab-button href="/tabs/home" tab="first-tab">
            <ion-label>first</ion-label>
            <ion-icon name="musical-note"></ion-icon>
          </ion-tab-button>
          <ion-tab-button href="/profile/sam" tab="second">
            <ion-label>second</ion-label>
            <ion-icon name="videocam"></ion-icon>
          </ion-tab-button>
          <ion-tab-button href="/tweets" tab="third">
            <ion-label>third</ion-label>
            <ion-icon name="game-controller"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    );
  }

}
