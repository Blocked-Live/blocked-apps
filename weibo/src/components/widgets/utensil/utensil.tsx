import { Component, h, Prop } from '@stencil/core';
import { actionSheetController } from '@ionic/core';

@Component({
  tag: 'sharing-utensil',
  styleUrl: 'utensil.css',
  shadow: true
})
export class Utensil {
    @Prop() linkToShare
    @Prop() text = ""
    twitterIntentUrl() {
      var str
      if (this.text != "")
        str = `${this.text} - ${encodeURI(this.linkToShare)}`
      else
        str = encodeURI(this.linkToShare)

        return "https://twitter.com/intent/tweet?text="+str
    }
    async showShareSheet() {
      const actionSheet = await actionSheetController.create({
        header: 'Share On',
        buttons: [
          {  
             text: 'Twitter',
             icon: 'logo-twitter',     
             handler: () => {
                window.open(this.twitterIntentUrl(), "_blank")
                console.log('Share clicked');
              }
          },
          {  
            text: 'Copy To Clipboard',
            icon: 'clipboard',     
            handler: () => {
               navigator.clipboard.writeText(this.linkToShare).then(() => {console.log('copied'); alert('Copied!')})
               console.log('Copied To Clipboard');
             }
         },

          { text: 'Cancel', role: 'cancel' }
        ]
      });

      await actionSheet.present();
    }
  
  render() {
    return (
        <ion-button onClick={(e) => {this.showShareSheet(); e.preventDefault()}} fill="clear" slot="end">
          <ion-icon name="share"></ion-icon>
        </ion-button>
    );
  }

}
