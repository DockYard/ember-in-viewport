import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyClass extends Component {
  @service inViewport;

  @action
  setupViewport() {
    const loader = document.getElementById('loader');
    const { onEnter } = this.inViewport.watchElement(loader);
    onEnter(this.didEnterViewport.bind(this));
  }

  didEnterViewport() {
    this.infinityLoad();
  }

  willDestroy() {
    super.willDestroy(...arguments);

    const loader = document.getElementById('loader');
    this.inViewport.stopWatching(loader);
  }
}
