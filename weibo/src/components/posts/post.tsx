import { Component,  h, Prop } from '@stencil/core';
import {WeiboService} from '../../services/weibo.service';
@Component({
  tag: 'weibo-post',
  styleUrl: 'post.css',
  shadow: false
})
export class Post {
  @Prop() text: string = "Loading original text..."
  @Prop() txid: string = ""
  @Prop() downloadFromBlockchain: boolean = false
  
  linkifyHashtags(originalText: string) {
    //todo: use regex to find inline hashtags 
    //link each to the respective search results page
    //return an html string containing the links and original text
    return originalText
  }
  componentDidLoad() {
    if (this.downloadFromBlockchain) {
      WeiboService.getPostByTxid(this.txid).then(p => {
        this.text=this.linkifyHashtags(p.tags["Text"])
      })
    }
  }
  render() {
    return (
        <ion-card>        
          <a target="_blank" href={"https://arweave.net/"+this.txid}>
            <img alt="Screenshot of Weibo post" src={"https://arweave.net/"+this.txid} />
          </a> 

          <ion-card-content>

          {this.text}
          </ion-card-content>

          <ion-item color="light" lines="none">
            <ion-label>
            <p>
              <b><a target="_blank" href={"https://viewblock.io/arweave/tx/"+this.txid}>TX: {this.txid.substr(0, 8)}</a></b>
            </p>
            </ion-label>
              <sharing-utensil linkToShare={'http://weibot.saladface.xyz/post/'+this.txid} text="%23WeiBlocked %23FreeSpeechChina"></sharing-utensil>
          </ion-item>

        </ion-card>

    );
  }

}
