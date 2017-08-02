import { ForschungsprojektPage } from './app.po';

describe('forschungsprojekt App', () => {
  let page: ForschungsprojektPage;

  beforeEach(() => {
    page = new ForschungsprojektPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
