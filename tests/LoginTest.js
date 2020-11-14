import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return localStorage.getItem(prop);
});

fixture `Local Storage Tests`
    .page `http://127.0.0.1:8081`;

test('Logging In', async t => {
    await t
        .typeText('#emailInput', 'asd@gmail.com')
        .typeText('#passwordInput', 'ASDasd123')
        .click('#login-btn-icon')
        .wait(500)
        .click('#menuBtnIcon')
        .expect(Selector('#userID').textContent).notEql("test@gmail.com")
});

