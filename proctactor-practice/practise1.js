var webdriver = require('selenium-webdriver');
var By = webdriver.By;

var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

var window1 = null;

try {
    driver.get('http://facebook.com').then(function() {
        return driver.findElement(By.name("email"));
    }).then(function(q) {
        return q.sendKeys("nnafriends@gmail.com");
    }).then(function () {
        return driver.findElement(By.name('pass'));
    }).then(function (p) {
        return p.sendKeys("******")
    }).then(function () {
        return driver.findElement(By.id("u_0_l"));
    }).then(function (btnG) {
        return btnG.click();
    }).then(function () {
        return driver.get('https://www.facebook.com/muralikrishna8811');
    }).then(function () {
        return driver.findElements(By.className("_4-u2"));
    }).then(function (elems) {
        console.log('length of elements ', elems.length);
    });

}catch (er){
    //swallow it
}
