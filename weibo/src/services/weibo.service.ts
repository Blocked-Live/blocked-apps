import  { BehaviorSubject } from 'rxjs';
import { ArweaveService } from './arweave.service';
import { environment } from '../helpers/environment';

class WeiboServiceController {


  public censoredHashtagStrings = []
  public censoredHashtags = []

  public hashtagIndex = []
  public hashtagIndex$ = new BehaviorSubject<any>([])

  public censoredPostIndex = []
  public censoredPostIndex$ = new BehaviorSubject<any>([])


  public postTxids = []
  public posts = []
  public posts$ = new BehaviorSubject<any>([])

  private arweaveService: ArweaveService = ArweaveService.defaultInstance

  constructor() {
  }


  //loads a single post from arweave
  //if the post is currently in memory, we return that instead
  async getPostByTxid(txid: string): Promise<any> {
    var post = this.posts.find(p => p.txid == txid)
    if (!post) {
      post = await this.arweaveService.getItemRaw(txid)
    }
    return post;
  }


  //gets an index of txids, removal type, and last time we checked for all posts
  //in the archive that are deleted or shadowbanned
  async getCensoredPostIndex(offset, limit, forceRefresh = false) {
    if (this.censoredPostIndex.length == 0 || forceRefresh) {
      var searchTags = [
        {name: "App-Name", value: "weibot-censored-posts"},
        {name: "App-Version", value: environment.appVersion}
      ]

      var txids = await this.arweaveService.getTransactionsByTags(searchTags)
      var index = await this.arweaveService.getItemByTxId(txids[0])

      //note that the index is now an array of arrays... [[hashtag, count],[hashtag, count]]
      this.censoredPostIndex = index.data.map((ht) =>{
          return {
            txid: ht[0],
            lastUpdate: ht[1],
            censoredType: ht[2]
          }
        }) //this forces any UI state bound to this array to refresh
    }
    this.censoredPostIndex$.next(this.censoredPostIndex.slice(offset, limit + offset))

  }

  //Loads the selected range of transactions from this.postTxids
  //Useful for paging and other situations where you've already loaded the txids
  //as it lets you avoid making another arql request
  async getPostsForCurrentHashtag(offset, limit) {
    var txToRetrieve = this.postTxids.slice(offset, limit+offset)

    for (var i =0; i< txToRetrieve.length; i++) {
      var tx = await this.arweaveService.getItemRaw(txToRetrieve[i])
      this.posts.push(tx)
      //this.posts$.next(tx)
    }
    this.posts$.next(this.posts)
  }

  //get post txs tagged with an arbitrary string
  async getPostsByHashtag(hashtag, offset, limit) {
    this.posts = []
    this.posts$.next(this.posts)
    var customTags = [
      {name:"App-Name", value: "weibot-search-weibs"},
      {name: hashtag, value: 1}
    ]
    this.postTxids = await this.arweaveService.getTransactionsByTags(customTags)

    var txToRetrieve = this.postTxids.slice(offset, limit+offset)

    for (var i =0; i< txToRetrieve.length; i++) {
      var tx = await this.arweaveService.getItemRaw(txToRetrieve[i])
      this.posts.push(tx)
      //this.posts$.next(tx)
    }
    this.posts$.next(this.posts)
  }

  //searchtxid is the id of, for example, a hashtag in the hashtags[] array
  async getPostsBySearchTxid(txid, offset, limit) {
    this.posts = []
    this.posts$.next(this.posts)
    var customTags = [
      {name:"App-Name", value: "weibot-search-weibs"},
      {name: "Search-Tx", value: txid}
    ]
    this.postTxids = await this.arweaveService.getTransactionsByTags(customTags)

    var txToRetrieve = this.postTxids.slice(offset, limit)

    for (var i =0; i< txToRetrieve.length; i++) {
      var tx = await this.arweaveService.getItemRaw(txToRetrieve[i])
      this.posts.push(tx)
      //this.posts$.next(tx)
    }
    this.posts$.next(this.posts)
  }

  async getCensoredHashtags(forceRefresh=false) {
    if (this.censoredHashtagStrings.length ==0 || forceRefresh) {
      var searchTags = [
        {name: "App-Name", value: "weibot-censored-hashtags"},
        {name: "App-Version", value: environment.appVersion}
      ]

      var txids = await this.arweaveService.getTransactionsByTags(searchTags)
      var index = await this.arweaveService.getItemByTxId(txids[0])

      //note that the index is now an array of arrays... [[hashtag, count],[hashtag, count]]
      this.censoredHashtagStrings = index.data.map(ht =>  ht[0])
      this.censoredHashtags = index.data.map(ht => {return {hashtag: ht[0], count: ht[1], censored: true}}).sort((a, b) => (b.count - a.count))
    }
    return this.censoredHashtagStrings
  }
  async getHashtagIndex(offset, limit, forceRefresh = false) {
    await this.getCensoredHashtags();

    if (this.hashtagIndex.length ==0 || forceRefresh) {
      var searchTags = [
        {name: "App-Name", value: "weibot-search-index"},
        {name: "App-Version", value: environment.appVersion},
        {name: "Search-Type", value: "hashtag"}
      ]

      var txids = await this.arweaveService.getTransactionsByTags(searchTags)
      var index = await this.arweaveService.getItemByTxId(txids[0])

      //note that the index is now an array of arrays... [[hashtag, count],[hashtag, count]]
      this.hashtagIndex = index.data.map((ht) =>{
        return {
          hashtag: ht[0],
          count: ht[1],
          censored: this.censoredHashtagStrings.includes(ht[0])
        }
      } ) //this forces any UI state bound to this array to refresh
    }
    this.hashtagIndex$.next(this.hashtagIndex.slice(offset, limit + offset))
  }
  /* deprecated: use getHashtagIndex
  async getHashtags(offset, limit, forceRefresh = false) {
      //in most use cases, we will only want to get the list of all hashtag txids once per session
      //it is a slow query and triggers the intermitten arql CORS bug
      if (forceRefresh || this.hashtagtxids.length == 0) {  
        var searchTags = [
          {name:"App-Name", value: "weibot-search"},
          {name: "App-Version", value: environment.appVersion},
          {name: "Search-Type", value: "hashtag"}
        ]
        this.hashtagtxids = await this.arweaveService.getTransactionsByTags(searchTags)
        this.hashtags = [] //this forces any UI state bound to this array to refresh
      }

      if (offset >= this.hashtagtxids.length) {
        console.log("offset exceeds hashtag tx count, nothing to retrieve")
        return;
      }
      var txToRetrieve = this.hashtagtxids.slice(offset, limit+offset)

      //get the tx data and tags for each txid, and add to our hashtags array
      //TODO: do this in parallel. And figure out what's slowing down the individual requests
      for (var i =0; i< txToRetrieve.length; i++) {
        if (!this.hashtagIsLoaded(txToRetrieve[i])) {
          var tx = await this.arweaveService.getItemByTxId(txToRetrieve[i])
          this.hashtags.push(tx)
        }
      }

      //after we have the tx data for the requested hashtags we fire the observable 
      //which gives all subscribed clients the latest data, and the chance to update their state
      //ex: WeiboService.hashtags$.subscribe(latestHashtags => doSomethingWithTheData)
      this.hashtags$.next(this.hashtags)
  } */
}

export const WeiboService = new WeiboServiceController();
