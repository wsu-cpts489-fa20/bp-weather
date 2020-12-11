import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return JSON.parse(localStorage.getItem(prop));
});

fixture `login facebook tests`
    .page `localhost:8081`;

test('login facebook tests', async t => {

    
    const username = 'bpweather489@gmail.com';
    const password = 'GoCougs!';


    
    await t
        .click('#facebook-login-btn')
        .wait(3000)
        .typeText('#email', username)
        //.pressKey('enter')
        .wait(3000)
        .typeText(Selector('input')
        .withAttribute('type', 'password'),password)
        .pressKey('enter')
        .wait(1500)


    
        .setNativeDialogHandler(() => true)
        
        .click('#menuBtnIcon')
        .wait(250)
        .expect(Selector('#userID').textContent).contains("bpweather")

});