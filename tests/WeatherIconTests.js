import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return JSON.parse(localStorage.getItem(prop));
});

fixture `Weather Icon Tests`
    .page `localhost:8081`;

test('Weather Icon', async t => {

    
    await t
        .click('#guest-login-btn')
        .wait(500)
        .setNativeDialogHandler(() => true)
        .click('#addStationBtn')
        .wait(500)
        .click('#historyTab')
        .wait(500)
        .click('#searchTab')
        .wait(500)
        
});
