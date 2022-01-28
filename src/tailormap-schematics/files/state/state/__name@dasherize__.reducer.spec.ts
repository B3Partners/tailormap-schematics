import * as <%= classify(name) %>Actions from './<%= dasherize(name)%>.actions';
import { <%= classify(name) %>State, initial<%= classify(name) %>State } from './<%= dasherize(name)%>.state';
import { <%= camelize(name) %>Reducer } from './<%= dasherize(name)%>.reducer';

describe('<%= classify(name) %>Reducer', () => {

  test('sets some prop', () => {
    const initialState: <%= classify(name) %>State = { ...initial<%= classify(name) %>State };
    const action = <%= classify(name) %>Actions.setSomeProp({ someProp: true });
    expect(initialState.someProp).toEqual(false);
    const updatedState = <%= camelize(name) %>Reducer(initialState, action);
    expect(updatedState.someProp).toEqual(true);
  });

});
