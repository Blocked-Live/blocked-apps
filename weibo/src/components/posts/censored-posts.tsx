import { Component, State, h} from '@stencil/core';
//import {loadingController} from '@ionic/core';
import {WeiboService} from '../../services/weibo.service';
const pageSize = 20 

@Component({
  tag: 'weibo-censored-posts',
  styleUrl: 'censored-posts.css',
  shadow: false
})
export class WeiboPostsCensored {
  @State() postIndex = []
  @State() loading = false
  
  @State() postCount = 0
  @State() offset = 0; //start index for sequential paging

  _loadingController = null

  componentDidLoad() {
    this.setLoading(true)
    //this.hashtag = WeiboService.getHashtagByTxid(this.searchTxId).data.query
    WeiboService.censoredPostIndex$.subscribe((censoredPostIndex) => {

      this.postIndex = [...censoredPostIndex];
      console.log("displaying "+this.postIndex.length+" posts")
      if (this.postIndex.length > 0)
        this.setLoading(false)
    })
    WeiboService.getCensoredPostIndex(this.offset, pageSize)
  }
  getNextPage() {
    this.setLoading(true)
    this.offset += pageSize;
    WeiboService.getCensoredPostIndex(this.offset, pageSize)
  }
  viewMoreDisplayState() {
    if (this.postIndex.length > 0 && this.postIndex.length < WeiboService.censoredPostIndex.length)
      return ""
    else
      return "viewMoreHidden"
  }
  async setLoading(isLoading: boolean) {
    this.loading = isLoading
    /*
    if (this._loadingController == null) {
      this._loadingController = await loadingController.create({
        message: 'Retrieving from PermaWeb...'
      });
    }
    if (isLoading)
    {
      await this._loadingController.present();
    } else {
      this._loadingController.dismiss()
    } */
  }
  render() {
    return ([
      <ion-header translucent>
        <ion-toolbar color="light">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/" />
          </ion-buttons>
          <ion-buttons slot="end">
            <sharing-utensil linkToShare='http://weibot.saladface.xyz/censored-posts' text="Censored and shadow-banned posts from the %23WeiBlocked archive"></sharing-utensil>

          </ion-buttons>
          <ion-title>Censored Posts</ion-title>
        </ion-toolbar>

        <ion-toolbar class={this.postIndex.length > 0 ? "" : "hidden"}>
          <ion-title>Loaded {this.postIndex.length} of {WeiboService.censoredPostIndex.length} Posts</ion-title>
        </ion-toolbar>
        <ion-toolbar class={this.postIndex.length > 0 ? "hidden" : ""}>
          <ion-title>Loading... Please Wait</ion-title>
        </ion-toolbar>

      </ion-header>,
  
      <ion-content  class="ion-padding">
        
      <div class="posts-container">
        {
        this.postIndex.map((post) => {
          return (
            <weibo-post censored={true} downloadFromBlockchain={false} displayMode="thumbnail" txid={post.txid} />
          )
        })
      }
      </div>
      <ion-button disabled={this.loading} 
      class={this.viewMoreDisplayState()} 
      onClick={(e) => {this.getNextPage(); console.log(e); return false}} 
      expand="block" 
      fill="outline">View More...</ion-button>

      </ion-content>     
      ]
    );
  }

}
