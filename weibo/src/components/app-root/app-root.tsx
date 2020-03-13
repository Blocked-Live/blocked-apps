import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  render() {
    return (
      <ion-app>
      <ion-menu content-id="content" side="start">
      <ion-header>
        <ion-toolbar>
          <ion-title>WeiBlocked Archive</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>

        </ion-list>
      </ion-content>
    </ion-menu>


        <ion-router useHash={true}>
          <ion-route url="/" component="weibo-viewer" />
          <ion-route url="/weibo-viewer" component="weibo-viewer" />
          <ion-route url="/weibo-viewer/search-results/:hashtag" component="weibo-posts" />

          <ion-route url="/weibo-viewer/:hashtag/posts" component="weibo-posts" />
          <ion-route url="/weibo-viewer/post/:txid" component="single-post-viewer" />
          <ion-route url="/censored-posts" component="weibo-censored-posts" />
          <ion-route url="/censored-posts/:txid" component="single-post-viewer" />


        </ion-router>
        <ion-nav id="content" />
      </ion-app>
    );
  }
}
