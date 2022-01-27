import * as <%= classify(name) %>Actions from './<%= dasherize(name)%>.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { <%= classify(name) %>State, initial<%= classify(name) %>State } from './<%= dasherize(name)%>.state';

const onSetSomeProp = (
    state: <%= classify(name) %>State,
    payload: ReturnType<typeof <%= classify(name) %>Actions.setSomeProp>,
): <%= classify(name) %>State => ({
    ...state,
    someProp: payload.someProp,
});

const <%= camelize(name) %>ReducerImpl = createReducer<<%= classify(name) %>State>(
    initial<%= classify(name) %>State,
    on(<%= classify(name) %>Actions.setSomeProp, onSetSomeProp),
);
export const <%= camelize(name) %>Reducer = (state: <%= classify(name) %>State | undefined, action: Action) => <%= camelize(name) %>ReducerImpl(state, action);
