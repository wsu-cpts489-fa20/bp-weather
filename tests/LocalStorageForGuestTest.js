import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return JSON.parse(localStorage.getItem(prop));
});

fixture `Local Storage Tests`
    .page `localhost:8081`;

test('Local Storage for Guests', async t => {

    
    await t
        .click('#guest-login-btn')
        .wait(500)
        .setNativeDialogHandler(() => true)
        .click('#historyTab')
        .wait(500)
        .click('#searchTab')
        .wait(500)
        .click('#menuBtnIcon')
        .wait(500)
        .click('#logOutBtn')
        .wait(1000)
        .click('#guest-login-btn');

        let data = await getLocalStorageItem("guest@mail.com");
        

        await t
            .expect(data.weatherStations[1].latitude).eql(47.6062)
            .expect(data.weatherStations[1].longitude).eql(-122.3321)        
});
