import { modalController } from '@ionic/core';

//random UI helpers, mostly wrappers of Ionic functionality
class UIController {
    public currentModal;
    constructor() {

    }
    /*
    customElements.define('modal-content', class ModalContent extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
        <about-us></about-us>
        `;
      }
    }); */

    async showModal(title: string, content: string) {
        const modal = await modalController.create({
          component: 'dialog-container',
          componentProps: {'dialogTitle': title, 'dialogContent': content}
        });
    
        await modal.present();
        this.currentModal = modal;
    
      }
    
    dismissModal() {
        if (this.currentModal) {
        this.currentModal.dismiss().then(() => { this.currentModal = null; });
        }
    }

    linkifyHashtags(text, baseUrl) {
      let hashTagRegex = /#(.*?)#/gum;
      let hashTags = text.match(hashTagRegex) || []
      hashTags.forEach(hashtag => {
        text = text.replace(hashtag, `<a href=${baseUrl}${hashtag}>${hashtag}</a>`)
      })
      return text
    }
}

export const UI = new UIController()
