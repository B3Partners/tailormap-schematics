import { createAction, props } from '@ngrx/store';

const <%= camelize(name) %>ActionsPrefix = '[<%= classify(name) %>]';

export const setSomeProp = createAction(
  `${<%= camelize(name) %>ActionsPrefix} Set Some Prop`,
  props<{ someProp: boolean }>(),
);
