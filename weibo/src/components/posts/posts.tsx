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
  componentWillLoad() {
    this.decodedHashtag = decodeURIComponent(this.hashtag)

  }
  componentDidLoad() {

    this.setLoading(true)
    //this.hashtag = WeiboService.getHashtagByTxid(this.searchTxId).data.query
    WeiboService.getPostHashtagIndex(this.decodedHashtag,this.offset, pageSize).subscribe((postsForHashtag) => {

      this.posts = [...this.posts.concat(postsForHashtag)];
      console.log("displaying "+this.posts.length+" posts")
      if (this.posts.length > 0)
        this.setLoading(false)
    })
  }
  getNextPage() {
    this.setLoading(true)
    this.offset += pageSize;
    WeiboService.getPostHashtagIndex(this.decodedHashtag,this.offset, pageSize)  
  }
  viewMoreDisplayState() {
    if (this.posts.length > 0 && this.posts.length <= WeiboService.postHashtagIndex[this.decodedHashtag].posts.length)
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
        <ion-toolbar>
        {this.posts.length > 0 ? 
                  <ion-title>Loaded {this.posts.length} of {WeiboService.postHashtagIndex[this.decodedHashtag].posts.length} Posts</ion-title>
                  :
                  <ion-title>Loading... Please Wait</ion-title>
        }
        </ion-toolbar>
      </ion-header>,
  
      <ion-content  class="ion-padding">

      {
      this.posts.length>0 ?   
      <div class="posts-container">
        {
        this.posts.map((post) => {
          return (
            <weibo-post censored={post.isCensored} downloadFromBlockchain={false} displayMode="thumbnail" txid={post.txid} />
          )
        })
      }
      </div>
      :""
      }

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
