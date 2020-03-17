import { Component, Host, h, Prop } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'censored-filter',
  styleUrl: 'censored-filter.css',
  shadow: true
})
export class OnlyFilter {
    @Prop() censored = false
    @Prop() label="Censored Only"
    @Event({
      eventName: 'toggle',
      composed: true,
      cancelable: true,
      bubbles: true,
    }) toggle: EventEmitter;

    toggleCensoredFilter(event) {
      this.censored = !this.censored
      this.toggle.emit(this.censored);
    }


  render() {
    return (
      <ion-toolbar>
        <ion-toggle checked={this.censored} slot="start" onIonChange={(e) => {this.toggleCensoredFilter(e); e.preventDefault()}}></ion-toggle> 

        <ion-title>
        {this.label}
        </ion-title>
      </ion-toolbar>
    );
  }

}
