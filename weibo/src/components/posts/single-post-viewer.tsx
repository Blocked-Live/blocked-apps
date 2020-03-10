import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'single-post-viewer',
  styleUrl: 'single-post-viewer.css',
  shadow: false
})
export class PostViewer {
  @Prop() txid

  componentDidLoad() {

  }
  render() {
    return ([
      <ion-header translucent>

        <ion-toolbar color="light">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/" />
          </ion-buttons>
          <ion-buttons slot="end">
          <sharing-utensil linkToShare={'http://weibot.saladface.xyz/post/'+this.txid} text="%23WeiBlocked %23FreeSpeechChina"></sharing-utensil>
          </ion-buttons>
          <ion-title>WeiBlocked Viewer</ion-title>
        </ion-toolbar>
        </ion-header>,

        <ion-content  class="ion-padding">
          <div class="posts-container">
          <weibo-post downloadFromBlockchain={true} txid={this.txid}></weibo-post>
          <about-us></about-us>
          </div>
        </ion-content>
    ]);
  }

}
