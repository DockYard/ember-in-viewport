import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyModifier extends Component {
  @service inViewport;

  @action
  setupInViewport(element) {
    const viewportSpy = true;
    const viewportTolerance = {
      bottom: 300,
    };
    const { onEnter } = this.inViewport.watchElement(element, {
      viewportSpy,
      viewportTolerance,
    });
    onEnter(this.didEnterViewport.bind(this));
  }

  constructor() {
    super(...arguments);
  }

  didEnterViewport() {
    this.args.infinityLoad();
  }

  willDestroy() {
    super.willDestroy(...arguments);

    const loader = document.getElementById('loader');
    this.inViewport.stopWatching(loader);
  }
}
