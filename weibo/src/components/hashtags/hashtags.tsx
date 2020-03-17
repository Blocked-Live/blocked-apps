import { Component, Prop, State, h} from '@stencil/core';
import {WeiboService} from '../../services/weibo.service';
import {UI} from '../../services/ui-util.service';

const pageSize = 50

@Component({
  tag: 'weibo-viewer',
  styleUrl: 'hashtags.css',
  shadow: false
})
export class WeiboViewer {
  @State() offset = 0; //start index for sequential paging
  @State() posts = []
  @State() hashtags = []
  @State() onlyShowCensored = false
  @State() hideViewMore = false
  @State() loading = false

  @Prop() currentSearchTxid = ''

  about() {
    UI.showModal("About WeiBlocked", "<about-us></about-us>")
  }
  addHashtags() {
    UI.showModal("Add New Topics", "<user-add-tags></user-add-tags>")
  }
  componentDidLoad() {
    this.loading = true
    WeiboService.hashtagIndex$.subscribe((hashes) => {
      if (hashes.length > 0) 
        this.loading = false
      //hashes.forEach(hash => this.hashtags.push(hash))
      this.hashtags = [...this.hashtags.concat(hashes)]

      console.log(JSON.stringify(hashes, null, 2))
    })
    WeiboService.getHashtagIndex(this.offset, pageSize)
  }
  toggleCensoredFilter() {
    if (this.onlyShowCensored) {
      this.onlyShowCensored = false
      this.hashtags.length = 0
      this.offset = 0
      WeiboService.getHashtagIndex(this.offset, pageSize)
    }
    else {
      this.onlyShowCensored = true
      var censoredHashtags = WeiboService.censoredHashtags
      this.hashtags=[...censoredHashtags]
    }
  }
  getNextPage() {
    this.offset += pageSize;
    WeiboService.getHashtagIndex(this.offset, pageSize)
  }

  //called whenever user edits the contents of the search box
  handleSearchEvent(event) {
    console.log(JSON.stringify(event))
    var query = event.target.value.toLowerCase();
    if (query == "") {
      this.offset = 0
      this.hideViewMore=false
      this.hashtags=[...WeiboService.hashtagIndex.slice(this.offset, pageSize)]
      return;
    }

    if (!query.startsWith('#'))
      query = '#'+query
   
      var filtered = WeiboService.hashtagIndex.filter(ht => ht.hashtag.startsWith(query)).slice(0, pageSize)
      this.hideViewMore=true
      this.hashtags = [...filtered]
    
  }
  showViewMore() {
    return (this.hashtags.length > 0 && !this.hideViewMore && !this.onlyShowCensored) ? "" : "viewMoreHidden"
  }

  render() {
    return ([
      <ion-header>
        <ion-toolbar color="medium">
          <ion-title>{this.onlyShowCensored ? "BANNED" : "All "} Hashtags</ion-title>
          <ion-buttons slot="end">
            <ion-button onClick={(e) => {this.about(); e.preventDefault()}}><ion-icon slot="icon-only" name="information-circle"></ion-icon></ion-button>
            <ion-button onClick={(e) => {this.addHashtags(); e.preventDefault()}}><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>

          </ion-buttons>

        </ion-toolbar>
        <ion-toolbar color="light" class={!this.loading ? "viewMoreHidden" : ""}>
          <ion-title>Loading... Please Wait</ion-title>
        </ion-toolbar>
        <ion-toolbar color="light" class={this.loading ? "viewMoreHidden" : ""}>
          <ion-input disabled={this.onlyShowCensored} class="ion-padding" debounce={200} placeholder="Type to Search" type="text"  onInput={(event) => this.handleSearchEvent(event)} ></ion-input>
        </ion-toolbar>

      </ion-header>,
  
      <ion-content class={"ion-padding "+ (this.loading ? "viewMoreHidden" : "")}>


        <ion-list>
                <ion-list-header color="light">
                  <p>Showing {this.hashtags.length} of {this.onlyShowCensored ? WeiboService.censoredHashtags.length : WeiboService.hashtagIndex.length} Hashtags</p>

                </ion-list-header>
          {
                this.hashtags.map((tag) => {
                  return (                
                    <ion-item>
                          <ion-label>
                            {
                              (tag.censored) ? 
                              <ion-chip color="danger">
                                <ion-label>CENSORED!</ion-label>
                              </ion-chip>
                              : ""
                            }

                            <ion-router-link href={`weibo-viewer/${tag.hashtag}/posts`}>{tag.hashtag}</ion-router-link><br />
                            {tag.english}
                          </ion-label>
                          <ion-badge slot="end">{tag.count}</ion-badge>
                    </ion-item>
                  
                    )
                })
            }
        </ion-list>
   
        <ion-button class={this.hashtags.length > 0 && !this.hideViewMore && !this.onlyShowCensored ? "" : "viewMoreHidden"} onClick={(e) => {this.getNextPage(); console.log(e); return false}} expand="block" fill="outline">View More...</ion-button>

      </ion-content>    
      ,
      <ion-footer color="light">
        <censored-filter label="Censored Topics" censored={this.onlyShowCensored} onToggle={(e) => this.toggleCensoredFilter()}>
        </censored-filter>
      </ion-footer>

      ]
    );
  }

}
