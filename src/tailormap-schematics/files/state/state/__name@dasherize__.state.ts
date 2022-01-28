export const <%= camelize(name) %>StateKey = '<%= camelize(name) %>';

export interface <%= classify(name) %>State {
  someProp: boolean;
}

export const initial<%= classify(name) %>State: <%= classify(name) %>State = {
  someProp: false,
};
