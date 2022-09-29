describe('change detection', () => {
  it('should returns name property', () => {
    const man = {
      get name() {
        return this._name;
      },
      set name(value: string) {
        let prop = this._changedProperties.find((p) => p.propName === 'name');
        if (!prop) {
          prop = {
            propPrevValue: this._name,
            propName: 'name',
          };
          this._changedProperties.push(prop);
        }

        prop.propValue = value;
        this._name = value;
      },
      _name: 'dimych',
      books: [],
      _changedProperties: [],
      getChangedProperties() {
        return this._changedProperties;
      },
      save() {},
    };

    man.name = 'Dimych';
    man.name = 'Dimych K';

    const props = man.getChangedProperties();
    expect(props[0].propName).toBe('name');
    expect(props[0].propValue).toBe('Dimych K');
    expect(props[0].propPrevValue).toBe('dimych');
  });
});
