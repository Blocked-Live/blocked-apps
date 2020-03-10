import { Component, h, Prop, Host } from '@stencil/core';
import { UI } from '../../services/ui-util.service';


@Component({
  tag: 'dialog-container',
  styleUrl: 'dialog-container.css',
  shadow: false
})
export class DialogContainer {
  @Prop() dialogTitle="Modal Dialog"
  @Prop() dialogContent="<p>An HTML string that will be rendered as the body of the dialog</p>"
  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar>
            <ion-title>{this.dialogTitle}</ion-title>
            <ion-buttons slot="primary">
              <ion-button onClick={(e) => {UI.dismissModal(); e.preventDefault()}}>
                <ion-icon slot="icon-only" name="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content innerHTML={this.dialogContent} class="ion-padding"></ion-content>
      </Host>
    );
  }

}
