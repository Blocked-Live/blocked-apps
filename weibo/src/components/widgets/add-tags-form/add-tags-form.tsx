import { Component,  h, Prop, State} from '@stencil/core';
import { API } from '../../../services/api.service';
import { UI } from '../../../services/ui-util.service';

@Component({
  tag: 'user-add-tags',
  styleUrl: 'add-tags-form.css',
  shadow: false
})
export class AddTags {
  @Prop() prompt = "Enter Weibo hashtags (e.g. #新型冠状病毒#) or search queries (e.g. 新型冠状病毒) that you would like to be monitored for censorship and regularly archived!"
  @State() submitInProgress = false

  suggestions = ""

  async submitSuggestions(e) {
    this.submitInProgress = true
    try
    {
      var result = await API.submitSuggestions(this.suggestions)
      this.submitInProgress = false

      if (result.status == "success") {
        alert("Thank you! Your suggestions have been received and will appear in the index shortly.")
        UI.dismissModal()
      }
      else {
        alert(result.error)
      }
    }
    catch (e) {
      alert("Server error. Please try again later.")
      UI.dismissModal()
    }
    e.preventDefault()
  }
  
  render() {
    return ([
        <ion-list>
          <ion-item>
            <p>{this.prompt}</p>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Enter Topics Below</ion-label>
            <ion-textarea class="tall" disabled={this.submitInProgress} placeholder="Enter 1 item per line. Max 1000 lines" onInput={(e) => {this.suggestions = e["target"]["value"];}}></ion-textarea>
          </ion-item>
        </ion-list>,

        <div class="ion-padding">
          <ion-button disabled={this.submitInProgress} onClick={(e) => {this.submitSuggestions(e); e.preventDefault()}} expand="block" type="submit" class="ion-no-margin">Add Search Terms</ion-button>
        </div>

    ]);
  }

}
