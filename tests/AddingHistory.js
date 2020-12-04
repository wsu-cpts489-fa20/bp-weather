import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return localStorage.getItem(prop);
});

fixture `Favorites`
    .page `http://127.0.0.1:8081`;

test('Adding Locations to Favorite', async t => {
    await t
        .click('#guest-login-btn')
        .wait(500)
        .typeText('#inputStation', 'Seattle')
        .pressKey('enter')
        .wait(500)
        .click('#history-icon-btn')
        .wait(500)
        .click('#historyTab')
        .wait(500)
});
