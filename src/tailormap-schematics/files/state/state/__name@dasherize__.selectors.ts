import { <%= classify(name) %>State, <%= camelize(name) %>StateKey } from './<%= dasherize(name)%>.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const select<%= classify(name) %>State = createFeatureSelector<<%= classify(name) %>State>(<%= camelize(name) %>StateKey);

export const selectSomeProp = createSelector(select<%= classify(name) %>State, state => state.someProp);
