import { Component, Prop, State, h} from '@stencil/core';
//import {loadingController} from '@ionic/core';
import {WeiboService} from '../../services/weibo.service';
const pageSize = 20 

@Component({
  tag: 'weibo-posts',
  styleUrl: 'posts.css',
  shadow: false
})
export class WeiboPosts {
  @State() posts = []
  @State() loading = false
  
  @Prop() hashtag = ''

  @State() decodedHashtag='' //the hashtag passed in the URL, after decoding
  @State() postCount = 0
  @State() offset = 0; //start index for sequential paging

  _loadingController = null

  componentDidLoad() {
    this.setLoading(true)
    //this.hashtag = WeiboService.getHashtagByTxid(this.searchTxId).data.query
    WeiboService.posts$.subscribe((postsForHashtag) => {

      this.posts = [...postsForHashtag];
      console.log("displaying "+this.posts.length+" posts")
      if (this.posts.length > 0)
        this.setLoading(false)
    })
    this.decodedHashtag = decodeURIComponent(this.hashtag)
    WeiboService.getPostsByHashtag(this.decodedHashtag, this.offset, pageSize)
  }
  getNextPage() {
    this.setLoading(true)
    this.offset += pageSize;
    WeiboService.getPostsForCurrentHashtag(this.offset, pageSize)
  }
  viewMoreDisplayState() {
    if (this.posts.length > 0 && this.posts.length < WeiboService.postTxids.length)
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
            <sharing-utensil linkToShare={'http://weibot.saladface.xyz/search-results/'+encodeURIComponent(this.decodedHashtag.replace('#', '')).replace('%23', '')} text="%23WeiBlocked %23FreeSpeechChina"></sharing-utensil>

          </ion-buttons>
          <ion-title>{this.decodedHashtag}</ion-title>
        </ion-toolbar>

        <ion-toolbar class={this.posts.length > 0 ? "" : "hidden"}>
          <ion-title>Loaded {this.posts.length} of {WeiboService.postTxids.length} Posts</ion-title>
        </ion-toolbar>
        <ion-toolbar class={this.posts.length > 0 ? "hidden" : ""}>
          <ion-title>Loading... Please Wait</ion-title>
        </ion-toolbar>

      </ion-header>,
  
      <ion-content  class="ion-padding">


      <div class="posts-container">
        {
        this.posts.map((post) => {
          return (
            <weibo-post censored={post.tags["CENSORSHIP"] != null} downloadFromBlockchain={false} text={post.tags["Text"]} txid={post.id} />
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
