import { NavoryWebappPage } from './app.po';

describe('navory-webapp App', function() {
  let page: NavoryWebappPage;

  beforeEach(() => {
    page = new NavoryWebappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
