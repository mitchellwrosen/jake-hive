import { HiveAppPage } from './app.po';

describe('hive-app App', () => {
  let page: HiveAppPage;

  beforeEach(() => {
    page = new HiveAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
