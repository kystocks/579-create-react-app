import App from '../../src/App';
import { mount } from 'cypress/react18'
import 'cypress-react-selector'


describe('component tests', () => {
  beforeEach(() => {
    mount(<App />);
    cy.waitForReact(1000, '#root');
  });

  it('App has a single <TestComponent> Component', () => {
    cy.react('TestComponent').should('have.length', 1 )
  })
})
