import { Angular4AuthPage } from './app.po';

describe('angular4-auth App', () => {
  let page: Angular4AuthPage;

  beforeEach(() => {
    page = new Angular4AuthPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
