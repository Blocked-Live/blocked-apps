import { environment } from '../helpers/environment';

//random UI helpers, mostly wrappers of Ionic functionality
class APIController {
    constructor() {

    }

    async submitSuggestions(rawText) {
      try {
        //some very basic validation
        if (rawText.length > environment.limits.maxSubmissionLengthInBytes)
          return {status: 'error', error: 'Maximum submission length exceeded'}
        
        var lines = rawText.split('\n').map(item => item.trim())
        if (lines.length == 0) 
          return {status: 'error', error: 'Please enter at least one hashtag or search term to add to the index.'}
        
        if (lines.length > environment.limits.maxItemsPerSubmission) 
          return {status: 'error', error:`Please submit fewer than ${environment.limits.maxItemsPerSubmission} items at a time.`}
        
        //todo: extract URLS and separate into searches and urls.
        //the weibot backend doesn't support url submission, but to support the twitter app we must implement this 
        var urls = [] 
        
        var req = {searches:lines, urls: urls}
        console.log(JSON.stringify(req))

        const response = await fetch(environment.endpoints.userSuggestionApi, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req) // body data type must match "Content-Type" header
        });

        var resp =  await response.json()
        console.log(JSON.stringify(resp))
        return {status: 'success', response: resp}
      } catch (ex) {
        return {status: 'error', error: ex}
      }
    }
    /*
    customElements.define('modal-content', class ModalContent extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
        <about-us></about-us>
        `;
      }
    }); */

}

export const API = new APIController()
