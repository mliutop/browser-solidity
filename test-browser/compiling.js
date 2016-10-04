module.exports = {
  'Compile Simple Contract': function (browser) {
    browser
      .url('http://127.0.0.1:8080')
      // It compiles the default contract
      .waitForElementPresent('.contract .create', 3000000)
      // Change the text and wait for recompile
      .clearValue('#input textarea')
      .setValue('#input textarea', `
      pragma solidity ^0.4.0;
      contract TestContract { function f() returns (uint) { return 8; } }
      `)
      .pause(3000)
      .assert.containsText('.contract .title', 'TestContract')
      .click('.create .constructor .call')
      .waitForElementPresent('.instance .call[title="f"]')
      .click('.instance .call[title="f"]')
      .waitForElementPresent('.output .returned')
      .assert.containsText('.output .returned', '0x0000000000000000000000000000000000000000000000000000000000000008')
      .assert.containsText('.output .decoded li', 'uint256: 8')
      .end()
  }
}