import { NavoryWebappAngularPage } from './app.po';

describe('navory-webapp-angular App', function() {
  let page: NavoryWebappAngularPage;

  beforeEach(() => {
    page = new NavoryWebappAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
