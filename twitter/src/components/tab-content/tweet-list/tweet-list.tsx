import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'tweet-list',
  styleUrl: 'tweet-list.css',
  shadow: true
})
export class List implements ComponentInterface {
  @Prop() t = "title"
  @Prop() tweets = []

  render() {
    return (
        <ion-list>
          <ion-list-header>
            Recent Conversations
          </ion-list-header>

          <ion-item>
            <ion-avatar slot="start">
              <img src="http://placekitten.com/200/300" />
            </ion-avatar>
            <ion-label>
              <h2>Sam Rahimi</h2>
              <h3>@2020WriteIn</h3>
              <p>#coronachan is coming for you! beware the coronachan, a teenage meme come to life as a deadly virus</p>
            </ion-label>
          </ion-item>

          <ion-item lines="full">
            <ion-avatar slot="start">
              <img src="http://placekitten.com/300/300" />
            </ion-avatar>
            <ion-label>
              <h2>Han</h2>
              <h3>Look, kid...</h3>
              <p>Man the stencil documentation is horrible... too bad, because it is actually very simple to do things like routing, tabs, both... but first you gotta figure out how to 
                use Ionic in Stencil, which sometimes follows Ionic naming conventions for Angular, React, or plain JS, depending on the component.
              </p>
            </ion-label>
          </ion-item>
        </ion-list>

    );
  }

}
