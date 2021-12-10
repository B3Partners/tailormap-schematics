import { render, screen } from '@testing-library/angular';
import { <%= classify(name)%>Component } from './<%= dasherize(name)%>.component';

describe('<%= classify(name)%>Component', () => {

  test('should render', async () => {
    await render(<%= classify(name)%>Component);
    expect(screen.getByText('<%= dasherize(name) %> works!'));
  });

});
