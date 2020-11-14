import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return localStorage.getItem(prop);
});

fixture `Local Storage Tests`
    .page `http://127.0.0.1:8081`;

test('Switching Tabs', async t => {
    await t
        .typeText('#emailInput', 'asd@gmail.com')
        .typeText('#passwordInput', 'ASDasd123')
        .click('#login-btn-icon')
        .wait(500)
        .click('#favoritesTab')
        .wait(500)
        .click('#historyTab')
        .wait(500)
        .click('#searchTab')
});

