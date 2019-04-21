import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';

@tagName('')
export default class MyClass extends Component {
  @service inViewport

  didInsertElement() {
    const loader = document.getElementById('loader');
    this.inViewport.watchElement(loader);
    this.inViewport.addEnterCallback(loader, this.didEnterViewport.bind(this));
  }

  didEnterViewport() {
    this.infinityLoad();
  }
}
