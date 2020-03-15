//post arql query or get transaction data via a carrier-pigeon caching server 
//reconstructs a transaction object from attributes data 
//BaseObject and Transaction classes are not directly exported via the arweave sdk
//so their code is pasted below :) 

import {environment} from '../helpers/environment'

//don't ask... there's an issue importing arweave sdk from browser-side TS apps
const arweaveSdk = window["Arweave"].init({
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 300000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
  })
const ArweaveUtils = arweaveSdk.utils


class BaseObject {
  [key: string]: any;


  public get(
    field: string,
    options?: {
      string?: boolean;
      decode?: boolean;
    }
  ): any {
    if (!Object.getOwnPropertyNames(this).includes(field)) {
      throw new Error(
        `Field "${field}" is not a property of the Arweave Transaction class.`
      );
    }

    if (options && options.decode == true) {
      if (options && options.string) {
        return ArweaveUtils.b64UrlToString(this[field]);
      }

      return ArweaveUtils.b64UrlToBuffer(this[field]);
    }

    return this[field];
  }
}

export class Tag extends BaseObject {
  readonly name: string;
  readonly value: string;

  public constructor(name: string, value: string, decode = false) {
    super();
    this.name = name;
    this.value = value;
  }
}

export interface TransactionInterface {
  id: string;
  last_tx: string;
  owner: string;
  tags: Tag[];
  target: string;
  quantity: string;
  data: string;
  reward: string;
  signature: string;
}

class Transaction extends BaseObject
  implements TransactionInterface {
  public id: string = "";
  public readonly last_tx: string = "";
  public readonly owner: string = "";
  public readonly tags: Tag[] = [];
  public readonly target: string = "";
  public readonly quantity: string = "0";
  public readonly data: string = "";
  public readonly reward: string = "0";
  public signature: string = "";

  public constructor(attributes: Partial<TransactionInterface> = {}) {
    super();
    Object.assign(this, attributes);

    if (attributes.tags) {
      this.tags = attributes.tags.map(
        (tag: { name: string; value: string }) => {
          return new Tag(tag.name, tag.value);
        }
      );
    }
  }

  public addTag(name: string, value: string) {
    this.tags.push(
      new Tag(
        ArweaveUtils.stringToB64Url(name),
        ArweaveUtils.stringToB64Url(value)
      )
    );
  }

  public toJSON() {
    return {
      id: this.id,
      last_tx: this.last_tx,
      owner: this.owner,
      tags: this.tags,
      target: this.target,
      quantity: this.quantity,
      data: this.data,
      reward: this.reward,
      signature: this.signature
    };
  }

  public setSignature({ signature, id }: { signature: string; id: string }) {
    this.signature = signature;
    this.id = id;
  }

  public getSignatureData(): Uint8Array {
    let tagString = this.tags.reduce((accumulator: string, tag: Tag) => {
      return (
        accumulator +
        tag.get("name", { decode: true, string: true }) +
        tag.get("value", { decode: true, string: true })
      );
    }, "");

    return ArweaveUtils.concatBuffers([
      this.get("owner", { decode: true, string: false }),
      this.get("target", { decode: true, string: false }),
      this.get("data", { decode: true, string: false }),
      ArweaveUtils.stringToBuffer(this.quantity),
      ArweaveUtils.stringToBuffer(this.reward),
      this.get("last_tx", { decode: true, string: false }),
      ArweaveUtils.stringToBuffer(tagString)
    ]);
  }
}
  
export default {
    async arql(arqlQuery){
        try {
            var response = await fetch(environment.endpoints.carrierPigeonUrl+"/arql", {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arqlQuery),
            })

            var json = response.json()
            return json
        }
        catch(e) {
            console.log("carrier piegon: fail on /arql: "+e)
        }
    },
    async getTransaction(txid, partToGet="all") {
        try {
            var response = await fetch(`${environment.endpoints.carrierPigeonUrl}/tx/${txid}?part=${partToGet}`, {
                method: 'GET'
            })
            var json = await response.json()
            return new Transaction(json)
        }
        catch(e) {
            console.log("carrier piegon: fail on /tx: "+e)
        }
    }
    
}