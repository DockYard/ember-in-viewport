import Component from '@ember/component';
import { get } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';

@tagName('')
class MyRafClass extends Component {
  @service inViewport

  didInsertElement() {
    const loader = document.getElementById('loader');
    get(this, 'inViewport').addEnterCallback(loader, this.didEnterViewport.bind(this));
    get(this, 'inViewport').watchElement(loader);
  }

  didEnterViewport() {
    this.infinityLoad();
  }
}

export default MyRafClass;
