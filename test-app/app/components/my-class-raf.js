import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyRafClass extends Component {
  @service inViewport;

  @action
  setupViewport() {
    const loader = document.getElementById('loader');
    const { onEnter } = this.inViewport.watchElement(loader);
    onEnter(this.didEnterViewport.bind(this));
  }

  didEnterViewport() {
    this.args.infinityLoad();
  }
}
