import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return localStorage.getItem(prop);
});

fixture `Search Location`
    .page `http://127.0.0.1:8081`;

test('Logging In', async t => {
    await t
        .typeText('#emailInput', 'asd@gmail.com')
        .typeText('#passwordInput', 'ASDasd123')
        .click('#login-btn-icon')
        .wait(500)
        .typeText('#inputStation', 'Seattle')
        .pressKey('enter')
        .wait(500)
});
