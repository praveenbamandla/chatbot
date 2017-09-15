// spec.js
describe('Chatbot functional tests', function() {
  browser.ignoreSynchronization = true;
  it('should have a title', function() {
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('Chat Bot');
  });
});