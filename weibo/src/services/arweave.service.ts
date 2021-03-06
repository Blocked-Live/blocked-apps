import  { BehaviorSubject } from 'rxjs';
import carrierPigeon from './carrier-pigeon';

// import {environment} from '../helpers/environment';

//this library is awesome, highly recommend it! https://www.npmjs.com/package/arql-ops
import {and, equals} from 'arql-ops'; 
import  retry  from 'async-retry';

//import Arweave from '../lib/arweaveSdk.js';

export class Tag {
  name: any
  value: any

  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}
export class ArweaveService {
  //the npm module didn't play nice with Angular, so we loaded the bundle version in angular.json scripts[]
  public arweaveSdk = window["Arweave"].init({
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 300000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
  })


  
  public _currentWallet = {address: '', balance: 0, keystore: null, rawJson: ''}
  public currentWallet$; 

  public _allChannels = []
  public allChannels$

  public _currentChannel = {}
  public currentChannel$


  //all we had to do to port this service from ANGULAR to STENCIL 
  //is to write some singleton-management code (I heard stencil has DI but it's horribly implemented)
  //perhaps we can even use the Arweave SDK in it's intended modular form!!
  private static _instance: ArweaveService = null

  public static get defaultInstance() {
    if (ArweaveService._instance == null) {
        ArweaveService._instance = new ArweaveService()
    }
    return ArweaveService._instance;
  }


  constructor() {
    console.log("ArweaveServiceService constructor")
    this.getNetworkStatus(info => console.log(info))
    this.currentWallet$ = new BehaviorSubject(this._currentWallet)
    this.allChannels$ = new BehaviorSubject(this._allChannels)
    this.currentChannel$ = new BehaviorSubject(this._currentChannel)
  }

  //Main wallet decryption function
  async loadWallet(walletJson: any) {
    try {
       var wallet = JSON.parse(walletJson)
       this.arweaveSdk.wallets.jwkToAddress(wallet).then((address) => {
           this.arweaveSdk.wallets.getBalance(address).then((balance)=> {
            this._currentWallet = {address: address, balance: balance, keystore: wallet, rawJson: JSON.stringify(wallet, null, 2)}
            this.currentWallet$.next(this._currentWallet)
      
            if (balance < 100000) {
              console.log("Balance extremely low, app may not work. Visit tokens.arweave.org and get a new wallet + 1.00000 AR in free tokens")
            }      
          })
       })
    } catch (err) {
      console.log(JSON.stringify(err, null, 2))
      alert("Not an Arweave wallet file! Visit tokens.arweave.org and get a new wallet + 1.00000 AR in free tokens")
    }
  }

  //returns the tx as is, no decoding
  async getItemRaw(txid) {
    var tx = await this.arweaveSdk.transactions.get(txid)
    var rawData = tx.get('data', {decode: true})
    //get and parse the tags,
    var tags = {}

    tx.get('tags').forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      console.log(`${key} : ${value}`);
      tags[key]=value
    });

    var element = {id: txid, data: rawData, tags: tags}
    return element
  }

  //returns the tx as is, no decoding
  async getTagsOnly(txid) {
    var tags={}
    var encodedTags = await carrierPigeon.getTags(txid)
    encodedTags.forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      console.log(`${key} : ${value}`);
      tags[key]=value
    });

    var element = {id: txid, data: null, tags: tags}
    return element
  }



  async getItemByTxId(txid) {
    //utility funciton to get the data and tags corresponding to an arweave transaction
    //var tx = await this.arweaveSdk.transactions.get(txid)
    var tx = await carrierPigeon.getTransaction(txid)

    //the data only - not the tags
    var rawData = JSON.parse(tx.get('data', {decode: true, string: true}))

    //get and parse the tags,
    var tags = {}

    tx.get('tags').forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      console.log(`${key} : ${value}`);
      tags[key]=value
    });

    var element = {id: txid, data: rawData, tags: tags}
    return element
  }

  //like getcollection but allows arbitrary number of tag name / value pairs, 
  //and only returns txids (which you can then query individually to get the data)
  async getTransactionsByTags(arrayOfCustomTags) {
    var txids = []
    await retry(async() => {
      var query = and(
        ...arrayOfCustomTags.map(tag => equals(tag.name, tag.value.toString()))
      )

      //txids = await this.arweaveSdk.arql(query)
      txids = await carrierPigeon.arql(query)

      console.log("retrieved "+txids.length+" transaction ids matching your query")
      /*
      if (txids.length == 0)
        throw new Error(); */

      //console.log(JSON.stringify(txids))

    }, {retries: 10})
    return txids
  }

  //Main wallet decryption function
  loginWithWalletString(walletJson: any) {
    try {
       var wallet = JSON.parse(walletJson)
       this.arweaveSdk.wallets.jwkToAddress(wallet).then((address) => {
           this.arweaveSdk.wallets.getBalance(address).then((balance)=> {
            this._currentWallet = {address: address, balance: balance, keystore: wallet, rawJson: JSON.stringify(wallet, null, 2)}
            this.currentWallet$.next(this._currentWallet)
      
            if (balance < 100000) {
              console.log("Balance extremely low, app may not work. Visit tokens.arweave.org and get a new wallet + 1.00000 AR in free tokens")
            }      
          })
       })
    } catch (err) {
      console.log(JSON.stringify(err, null, 2))
      alert("Not an Arweave wallet file! Visit tokens.arweave.org and get a new wallet + 1.00000 AR in free tokens")
    }
  }

  //If the user has uploaded their wallet using an HTML file input
  loginWithWalletFile(jsonFile: File) {
    const reader = new FileReader()
    reader.readAsText(jsonFile)
    reader.onloadend = () => {
        this.loginWithWalletString(reader.result)
    }
  }

  getNetworkStatus(callback) {
    this.arweaveSdk.network.getInfo().then(info => callback(info))
  }
}

  /* old hackathon code, snippets may be useful

  async getCollection(collectionId, customTags?) {
    var results = []

    var query;
    
    if (customTags) {
      query = and(
      equals(customTags.appName.tag, customTags.appName.value),
      equals(customTags.version.tag, customTags.version.value),
      equals(customTags.collection.tag, customTags.collection.value),
      )
    } else {
      query = and(
        equals('AR_APP_ID', environment.AR_APP_ID),
        equals('AR_COLLECTION_ID', collectionId),
        equals('API_VERSION', environment.API_VERSION)
      )
    }
    var txids = await this.arweaveSdk.arql(query)
    console.log("step 1: get all transaction ids tagged with AR_COLLECTION_ID == "+collectionId)
    console.log(JSON.stringify(txids))
    
    //todo: use DATE as unique key if desired, and de-dupe
    
    console.log("step 2: each transaction points to an element's contents - retrieve it and insert into our array")
    if (txids.length > 100)
      txids = txids.slice(0,100) //todo: make parameter
    for (var i =0; i < txids.length; i++) {
          //utility funciton to get the data and tags corresponding to an arweave transaction
          var txid = txids[i]
          var tx = await this.arweaveSdk.transactions.get(txid)

          //the data only - not the tags
          var rawData = JSON.parse(tx.get('data', {decode: true, string: true}))

          //get and parse the tags,
          var tags = {}

          tx.get('tags').forEach(tag => {
            let key = tag.get('name', {decode: true, string: true});
            let value = tag.get('value', {decode: true, string: true});
            console.log(`${key} : ${value}`);
            tags[key]=value
            tags["txid"]= txid
          });

        var element = {data: rawData, tags: tags}
        //bundle it into our standard element format, and add to the results array 
        results.push(element)
    }

    console.log("success: the collection has been downloaded from the blockchain")

    return results
  } */

  /*
  async getAllChannels() {
    this._allChannels= []

    const query = and(  
      equals('AR_APP_ID', environment.AR_APP_ID),
      equals('type', 'channel')
    )

    const txids = await this.arweaveSdk.arql(query)
    console.log("get all channels - step 1")
    console.log(JSON.stringify(txids))

    txids.forEach(async(txid) => {
      var tx = await this.arweaveSdk.transactions.get(txid)
      this._allChannels.push(JSON.parse(tx.get('data', {decode: true, string: true})))
    })

    console.log("get all channels - step 2")
    console.log(JSON.stringify(this._allChannels))

    this.allChannels$.next(this._allChannels)
    return this._allChannels;
  }*/
  /*
  async getOrCreateChannel(channelName, creatorName) {
    var allChannels = await this.getAllChannels()
    if (allChannels.filter(channel => channel.name == channelName).length > 0) {
      console.log("returning existing channel "+channelName)
      this._currentChannel = allChannels.filter(channel => channel.name == name)[0]
      this.currentChannel$.next(this._currentChannel) 
    } else {
      
      var newChannel = {name: channelName, creator: creatorName, createdAt: (new Date()).getTime()}
      this._currentChannel = newChannel
      this.currentChannel$.next(this._currentChannel)

      console.log("created new channel "+channelName+", submitting in background")
      var tx = await this.arweaveSdk.createTransaction({data: JSON.stringify(newChannel)}, this._currentWallet.keystore)

      tx.addTag('Content-Type', 'text/plain')
      tx.addTag('AR_APP_ID', environment.AR_APP_ID)
      tx.addTag('type', 'channel')

      await this.arweaveSdk.transactions.sign(tx, this._currentWallet.keystore)
      console.log(JSON.stringify(tx))
      var response = await this.arweaveSdk.transactions.post(tx)
      console.log(JSON.stringify(response))
    }
  }*/
