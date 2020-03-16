import { Component,  h, Prop } from '@stencil/core';
import {WeiboService} from '../../services/weibo.service';
import {UI} from '../../services/ui-util.service';

const txurl = 'https://viewblock.io/arweave/tx/'
const posturl = location.href+"/"
const hturl = 'https://weibo-uncensored.github.io/#/weibo-viewer/search-results/'

@Component({
  tag: 'weibo-post',
  styleUrl: 'post.css',
  shadow: false
})

export class Post {
  @Prop() text: string = "Loading original text..."
  @Prop() txid: string = ""
  @Prop() displayMode: string = "normal"
  @Prop() downloadFromBlockchain: boolean = false
  @Prop() censored = false
  @Prop() censorshipStatus = null

  linkifyHashtags(originalText: string) {
    return UI.linkifyHashtags(originalText, hturl)
  }
  componentDidLoad() {
    if (this.downloadFromBlockchain) {
      WeiboService.getPostByTxid(this.txid).then(p => {
        this.text=p.tags["Text"]
      })
    }
  }
  render() {
    if (this.displayMode != "thumbnail")
      return (
          
          <ion-card>        
            <a target="_blank" href={"https://arweave.net/"+this.txid}>
              <img alt="Screenshot of Weibo post" src={"https://arweave.net/"+this.txid} />
            </a> 
            {
            this.displayMode == 'normal' ? 
              <ion-card-content innerHTML={this.linkifyHashtags(this.text)}></ion-card-content> :
              ''
            }
            <ion-item color="light" lines="none">
              <ion-label>
              <p>

                {this.censored ? 
                <ion-chip color="danger">
                    <ion-label>CENSORED!</ion-label>
                </ion-chip>
                :''  
                }
                <b><a target="_blank" href={txurl+this.txid}>TX: {this.txid.substr(0, 8)}</a></b>
              </p>
              </ion-label>
                <sharing-utensil linkToShare={'http://weibot.saladface.xyz/post/'+this.txid} text="%23WeiBlocked %23FreeSpeechChina"></sharing-utensil>
            </ion-item>

          </ion-card>

      );
  else
      return (
        <ion-card>        
        <a href={"#/censored-posts/"+this.txid}>
          <img alt="Screenshot of Weibo post" src={"https://arweave.net/"+this.txid} />
        </a> 

        <ion-item color="light" lines="none">
              <ion-label>
              <p>
                {this.censored ? 
                <ion-chip color="danger">
                    <ion-label>CENSORED!</ion-label>
                </ion-chip>
                :''  
                }

                <b><a target="_blank" href={txurl+this.txid}>TX: {this.txid.substr(0, 8)}</a></b>
              </p>
              </ion-label>
              <sharing-utensil linkToShare={'http://weibot.saladface.xyz/post/'+this.txid} text="%23WeiBlocked %23FreeSpeechChina"></sharing-utensil>
        </ion-item>

      </ion-card>)      
  }

}
