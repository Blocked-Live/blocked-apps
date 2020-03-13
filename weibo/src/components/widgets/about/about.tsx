import { Component, h } from '@stencil/core';

@Component({
  tag: 'about-us',
  styleUrl: 'about.css',
  shadow: false
})
export class Data {
  render() {
    return (
      <div>
        <h3>What is this?</h3>
        <p>
        WeiBlocked is an archive of Weibo content that is likely to be censored. It indexes these posts and search criteria, and decentralizes them in the storage of hundreds of Arweave nodes operated around the world. WeiBlocked later checks back to see if the content or hashtag has been censored, and then highlights the item.
        </p>
        <p>
          What you see in this app is an exact copy of the content at the time it was archived. 
          Each archived post is permanently stored on the Arweave blockchain. This means that if 
          the post is later removed by Weibo staff or censored by government officials (the "50 cent army"),
          it will remain safe and available on WeiBlocked at this address. 
        </p>

        <h3>Blocked.Live</h3>
        <p>WeiBlocked is one part of the Blocked.Live platform, a full stack decentralized archiving and censorship monitoring platform that 
        will soon provide similar tools and content from Twitter. In the beginning of 2020, a deadly new coronavirus emerged in China, 
        causing a global pandemic that currently (just 2 months later) is already a major disaster that will have historical implications.</p>
        
        <p>Governments and the WHO have responded by asking social media platforms to remove content related to the virus that does not 
        align with the official statements made by politicians and health authorities around the world. The Blocked Twitter archive aims to capture a 
        definitive history of these crazy times - and to save lives by ensuring that information flows freely in spite of misguided attempts 
        to prevent this. Please follow us below for early access!</p>

        <p>This is an open source project and we welcome new collaborators! <a target="_blank" href="https://github.com/Blocked-Live/blocked-apps">https://github.com/Blocked-Live/blocked-apps</a></p>
        
        <h3>Learn More</h3>
        
        <p>
          For updates on WeiBlocked and an honest perspective on free speech and the coronavirus, please follow <a target="_blank" href="https://twitter.com/2020WriteIn">@2020WriteIn</a> on Twitter. To learn about the Arweave permanent web, which hosts the WeiBlocked archive, visit <a target="_blank" href="https://arweave.orgh">Arweave.org</a>. 

        </p>
      </div>
    );
  }

}
