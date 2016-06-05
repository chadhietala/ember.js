import { moduleFor, RenderingTest } from '../../utils/test-case';

// copied from ember-htmlbars/tests/integration/local-lookup-test.js
function buildResolver() {
  let resolver = {
    resolve() { },
    expandLocalLookup(fullName, sourceFullName) {
      let [sourceType, sourceName ] = sourceFullName.split(':');
      let [type, name ] = fullName.split(':');

      if (type !== 'template' && sourceType === 'template' && sourceName.slice(0, 11) === 'components/') {
        sourceName = sourceName.slice(11);
      }

      if (type === 'template' && sourceType === 'template' && name.slice(0, 11) === 'components/') {
        name = name.slice(11);
      }


      let result = `${type}:${sourceName}/${name}`;

      return result;
    }
  };

  return resolver;
}

moduleFor('Components test: local lookup', class extends RenderingTest {
  getOwnerOptions() {
    return {
      _registryOptions: {
        resolver: buildResolver()
      }
    };
  }

  ['@htmlbars it can lookup a local template']() {
    this.registerComponent('x-outer/x-inner', { template: 'Nested template says: {{yield}}' });
    this.registerComponent('x-outer', { template: '{{#x-inner}}Hi!{{/x-inner}}' });

    this.render('{{x-outer}}');

    this.assertText('Nested template says: Hi!', 'Initial render works');

    this.runTask(() => this.rerender());

    this.assertText('Nested template says: Hi!', 'Re-render works');
  }

  ['@htmlbars it can lookup a local component template']() {
    this.registerTemplate('components/x-outer/x-inner', 'Nested template says: {{yield}}');
    this.registerTemplate('components/x-outer', '{{#x-inner}}Hi!{{/x-inner}}');

    this.render('{{x-outer}}');

    this.assertText('Nested template says: Hi!', 'Initial render works');

    this.runTask(() => this.rerender());

    this.assertText('Nested template says: Hi!', 'Re-render works');
  }

  ['@htmlbars it can lookup a local helper']() {
    this.registerHelper('x-outer/x-helper', () => {
      return 'Who dis?';
    });
    this.registerComponent('x-outer', { template: 'Who dat? {{x-helper}}' });

    this.render('{{x-outer}}');

    this.assertText('Who dat? Who dis?', 'Initial render works');

    this.runTask(() => this.rerender());

    this.assertText('Who dat? Who dis?', 'Re-render works');
  }

  ['@htmlbars it overrides global helper lookup']() {
    this.registerHelper('x-outer/x-helper', () => {
      return 'Who dis?';
    });

    this.registerHelper('x-helper', () => {
      return 'I dunno';
    });

    this.registerComponent('x-outer', { template: 'Who dat? {{x-helper}}' });

    this.render('{{x-outer}} {{x-helper}}');

    this.assertText('Who dat? Who dis? I dunno', 'Initial render works');

    this.runTask(() => this.rerender());

    this.assertText('Who dat? Who dis? I dunno', 'Re-render works');
  }

  ['@htmlbars lookup without match issues standard assertion (with local helper name)']() {
    this.registerComponent('x-outer', { template: '{{#x-inner}}Hi!{{/x-inner}}' });

    expectAssertion(() => {
      this.render('{{x-outer}}');
    }, /A helper named "x-inner" could not be found/);
  }

  ['@htmlbars overrides global lookup']() {
    this.registerComponent('x-outer', { template: '{{#x-inner}}Hi!{{/x-inner}}' });
    this.registerComponent('x-outer/x-inner', { template: 'Nested template says (from local): {{yield}}' });
    this.registerComponent('x-inner', { template: 'Nested template says (from global): {{yield}}' });

    this.render('{{#x-inner}}Hi!{{/x-inner}} {{x-outer}} {{#x-outer/x-inner}}Hi!{{/x-outer/x-inner}}');

    this.assertText('Nested template says (from global): Hi! Nested template says (from local): Hi! Nested template says (from local): Hi!');

    this.runTask(() => this.rerender());

    this.assertText('Nested template says (from global): Hi! Nested template says (from local): Hi! Nested template says (from local): Hi!');
  }
});
