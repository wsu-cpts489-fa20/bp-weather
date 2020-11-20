import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return localStorage.getItem(prop);
});

fixture `Search`
    .page `http://127.0.0.1:8081`;

test('Search Location', async t => {
    await t

        .click('#guest-login-btn')
        .wait(500)
        .typeText('#inputStation', 'Seattle')
        .pressKey('enter')
        .wait(500)
});
