// import Controller from 'ember-runtime/controllers/controller';
import { moduleFor, ApplicationTest } from 'ember-glimmer/tests/utils/test-case';
// import { strip } from '../../utils/abstract-test-case';
import Route from 'ember-routing/system/route';


moduleFor('Basic Routing: Glimmer', class extends ApplicationTest {
  ['@test if error occurs in setup it invokes the error action'](assert) {

    this.registerRoute('index', Route.extend({
      setup() {
        throw 'Setup error';
      },
      actions: {
        error(reason) {
          assert.equal(reason, 'Setup error', 'ApplicationRoute#error received the error thrown from setup');
          return true;
        }
      }
    }));

    this.registerTemplate('index', 'WAT');

    return this.visit('/');
  }
});

// QUnit.test('The Special page returning an error invokes SpecialRoute\'s error handler', function() {

//   Router.map(function() {
//     this.route('home', { path: '/' });
//     this.route('special', { path: '/specials/:menu_item_id' });
//   });

//   var menuItem, promise, resolve;

//   App.MenuItem = EmberObject.extend();
//   App.MenuItem.reopenClass({
//     find(id) {
//       menuItem = App.MenuItem.create({ id: id });
//       promise = new RSVP.Promise(function(res) {
//         resolve = res;
//       });

//       return promise;
//     }
//   });

//   App.SpecialRoute = Route.extend({
//     setup() {
//       throw 'Setup error';
//     },
//     actions: {
//       error(reason) {
//         equal(reason, 'Setup error', 'SpecialRoute#error received the error thrown from setup');
//         return true;
//       }
//     }
//   });

//   bootApplication();

//   handleURLRejectsWith('/specials/1', 'Setup error');

//   run(function() {
//     resolve(menuItem);
//   });
// });
