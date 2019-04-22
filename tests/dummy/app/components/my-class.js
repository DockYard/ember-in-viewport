import Component from '@ember/component';
import { get } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';

@tagName('')
export default class MyClass extends Component {
  @service inViewport

  didInsertElement() {
    const loader = document.getElementById('loader');
    const { onEnter } = get(this, 'inViewport').watchElement(loader);
    onEnter(this.didEnterViewport.bind(this));
  }

  didEnterViewport() {
    this.infinityLoad();
  }

  willDestroyElement() {
    const loader = document.getElementById('loader');
    get(this, 'inViewport').stopWatching(loader);
  }
}
