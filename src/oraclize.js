var $ = require('jquery')
var ethJSABI = require('ethereumjs-abi')
var request = require('request')
var bs58 = require('bs58')
var cbor = require('cbor') //requires babel-polyfill

var generateOraclize = function (vmInstance,account) {
  vmInstance.executionContext.event.register('contextChanged', this, function (context) {
    if(context!='vm'){
      $('#oraclizeView').css("background-color","#FF9393")
      $('#oraclizeNotAvailable').show()
      $('#oraclizeVM').hide()
      $('#queryNotification').hide()
      $('#oraclizeWarning').show()
      $('#oraclizeImg').addClass("blackAndWhite")
    } else {
      $('#oraclizeWarning').hide()
      $('#oraclizeView').css("background-color","#F4F6FF")
      $('#oraclizeNotAvailable').hide()
      $('#oraclizeVM').show()
      generateOraclize(vmInstance,"0x265a5c3dd46ec82e2744f1d0e9fb4ed75d56132a")
    }
  })
  if(!vmInstance.executionContext.isVM()){
    $('#oraclizeView').css("background-color","#FF9393")
    $('#oraclizeNotAvailable').show()
    $('#oraclizeVM').hide()
    $('#queryNotification').hide()
    $('#oraclizeWarning').show()
    $('#oraclizeImg').addClass("blackAndWhite")
    return;
  } else {
    $('#oraclizeWarning').hide()
    $('#oraclizeView').css("background-color","#F4F6FF")
    $('#oraclizeNotAvailable').hide()
    $('#oraclizeVM').show()
  }

  if(typeof(vmInstance.accounts)=='undefined') return

  // remove oraclize account from the transaction tab
  $('#txorigin option[value="'+account+'"]').remove()

  var oar = ''
  var oraclizeConn = ''
  console.log('Deploying with account: '+account)

  // https://github.com/oraclize/ethereum-bridge/blob/d89b6a2dbedae586517ec7bc95ee0b02446eb5ed/contracts/ethereum-api/connectors/oraclizeConnector.sol
  var oraclizeConnector = '0x606060405260018054600160a060020a0319167326588a9301b0428d95e6fc3a5024fce8bec12d511790556404a817c80060055534610000575b60028054600160a060020a0319166c01000000000000000000000000338102041790555b5b61250f8061006c6000396000f36060604052361561018a5760e060020a60003504630f82567381146101d157806323dc42e7146102265780632ef3accc146102c4578063453629781461032b578063480a434d146103c8578063524f3889146103e75780635c242c591461044c57806360f66701146104ec57806362b3b8331461054157806368742da614610596578063688dcfd7146105a857806375700437146105ba578063772286591461065a5780637d242ae5146107355780637e1c42051461078b57806380325b2d1461086857806381ade3071461032b57806383eed3d5146109a557806385dee34c14610a4357806398cf6f2214610b205780639bb5148714610bbd578063a2ec191a14610bcf578063adf59f9914610226578063ae815843146105ba578063b5bfdd7314610d64578063bf1fe42014610dc0578063c281d19e14610dd2578063c51be90f14610dfb578063c55c1cb614610e9b578063ca6ad1e414610f3b578063d959701614610f4d578063db37e42f14610fd7578063de4b326214611061578063e839e65e14611073575b34610000576101cf5b60025433600160a060020a039081169116148015906101c1575060015433600160a060020a03908116911614155b156101cb57610000565b5b5b565b005b34610000576101cf600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965061114d95505050505050565b005b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b018035918201839004830284018301909452808352979998810197919650918201945092508291508401838280828437509496506111eb95505050505050565b60408051918252519081900360200190f35b34610000576102b2600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843750949650509335935061120692505050565b60408051918252519081900360200190f35b6102b2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965061121c95505050505050565b60408051918252519081900360200190f35b34610000576102b2611237565b60408051918252519081900360200190f35b34610000576102b2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965061123d95505050505050565b60408051918252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b01803591820183900483028401830190945280835297999881019791965091820194509250829150840183828082843750949650509335935061125192505050565b60408051918252519081900360200190f35b34610000576101cf600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965061157f95505050505050565b005b34610000576101cf600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437509496506115b995505050505050565b005b34610000576101cf600435611657565b005b34610000576101cf6004356116bd565b005b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965050933593506116e992505050565b60408051918252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965061170295505050505050565b60408051918252519081900360200190f35b346100005760408051602060046024803582810135601f81018590048502860185019096528585526101cf958335959394604494939290920191819084018382808284375094965061171f95505050505050565b005b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965050933593506117e392505050565b60408051918252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b018035918201839004830284018301909452808352979998810197919650918201945092508291508401838280828437509496505093359350611b7292505050565b60408051918252519081900360200190f35b6102b2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965061121c95505050505050565b60408051918252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b01803591820183900483028401830190945280835297999881019791965091820194509250829150840183828082843750949650611ebb95505050505050565b60408051918252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375050604080516020601f89358b018035918201839004830284018301909452808352979998810197919650918201945092508291508401838280828437509496505093359350611ed692505050565b60408051918252519081900360200190f35b6102b2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b01803591820183900483028401830190945280835297999881019791965091820194509250829150840183828082843750949650611ef195505050505050565b60408051918252519081900360200190f35b34610000576101cf600435611f0c565b005b34610000576101cf600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437509496505093359350611f6692505050565b005b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b018035918201839004830284018301909452808352979998810197919650918201945092508291508401838280828437509496506111eb95505050505050565b60408051918252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965050933593506116e992505050565b60408051918252519081900360200190f35b34610000576101cf600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965050843594602001359350611fab92505050565b005b34610000576101cf6004356120a8565b005b3461000057610ddf6120ea565b60408051600160a060020a039092168252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965050933593506120f992505050565b60408051918252519081900360200190f35b60408051602060046024803582810135601f81018590048502860185019096528585526102b2958335959394604494939290920191819084018382808284375050604080516020601f89358b01803591820183900483028401830190945280835297999881019791965091820194509250829150840183828082843750949650509335935061211292505050565b60408051918252519081900360200190f35b34610000576101cf60043561212b565b005b34610000576101cf600480803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843750506040805187358901803560208181028481018201909552818452989a99890198929750908201955093508392508501908490808284375094965061214a95505050505050565b005b34610000576101cf600480803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843750506040805187358901803560208181028481018201909552818452989a9989019892975090820195509350839250850190849080828437509496506121eb95505050505050565b005b34610000576101cf6004356122a4565b005b6102b2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965061236795505050505050565b60408051918252519081900360200190f35b60025433600160a060020a0390811691161480159061117b575060015433600160a060020a03908116911614155b1561118557610000565b60006003600083604051808280519060200190808383829060006004602084601f0104600302600f01f150604080519190930181900390208552506020840194909452505001600020805460ff191660f860020a928302929092049190911790555b5b50565b60006111fc84848462030d40611251565b90505b9392505050565b6000611213838333612384565b90505b92915050565b60006112136000848462030d40611251565b90505b92915050565b60085481565b600061124982336124ee565b90505b919050565b60006000848360006000611266848433612384565b91503482901061156c57813403905060008111156112a457604051600160a060020a0333169082156108fc029083906000818181858888f150505050505b42624f1a00018a11806112b657504587115b156112c057610000565b60006112df732bd2326c993dfaef84f696526064ff22eba5b362612507565b111561134a57732bd2326c993dfaef84f696526064ff22eba5b362600160a060020a03166316c727216000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100005760325a03f115610000575050604051519550505b8430336000600033600160a060020a03168152602001908152602001600020546040518085151560f860020a02815260010184600160a060020a0316606060020a02815260140183600160a060020a0316606060020a028152601401828152602001945050505050604051809103902095506000600033600160a060020a03168152602001908152602001600020600081548092919060010191905055507fb76d0edd90c6a07aa3ff7a222d7f5933e29c6acc660c059c97837f05c4ca1a8433878c8c8c8c6006600033600160a060020a0316815260200190815260200160002060009054906101000a900460f860020a026007600033600160a060020a03168152602001908152602001600020546040518089600160a060020a0316815260200188600019168152602001878152602001806020018060200186815260200185600160f860020a03191681526020018481526020018381038352888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156114f85780820380516001836020036101000a031916815260200191505b508381038252878181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156115515780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390a15b611571565b610000565b5b5050505050949350505050565b80604051808280519060200190808383829060006004602084601f0104600302600f01f15060405192018290039091206004555050505b50565b60025433600160a060020a039081169116148015906115e7575060015433600160a060020a03908116911614155b156115f157610000565b60016003600083604051808280519060200190808383829060006004602084601f0104600302600f01f150604080519190930181900390208552506020840194909452505001600020805460ff191660f860020a928302929092049190911790555b5b50565b60025433600160a060020a03908116911614801590611685575060015433600160a060020a03908116911614155b1561168f57610000565b604051600160a060020a0380831691309091163180156108fc02916000818181858888f150505050505b5b50565b33600160a060020a03166000908152600660205260409020805460ff191660f860020a83041790555b50565b60006116f785858585611251565b90505b949350505050565b60006116f78585858562030d406117e3565b90505b949350505050565b60025460009033600160a060020a03908116911614801590611750575060015433600160a060020a03908116911614155b1561175a57610000565b50600882905560005b600b548110156117dc57600a6000600b83815481101561000057906000526020600020900160005b505460001916815260200190815260200160002054830260096000600b84815481101561000057906000526020600020900160005b505481526020810191909152604001600020555b600101611763565b5b5b505050565b600060008583600060006117f8848433612384565b91503482901061156c578134039050600081111561183657604051600160a060020a0333169082156108fc029083906000818181858888f150505050505b42624f1a00018b118061184857504587115b1561185257610000565b6000611871732bd2326c993dfaef84f696526064ff22eba5b362612507565b11156118dc57732bd2326c993dfaef84f696526064ff22eba5b362600160a060020a03166316c727216000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100005760325a03f115610000575050604051519550505b8430336000600033600160a060020a03168152602001908152602001600020546040518085151560f860020a02815260010184600160a060020a0316606060020a02815260140183600160a060020a0316606060020a028152601401828152602001945050505050604051809103902095506000600033600160a060020a03168152602001908152602001600020600081548092919060010191905055507faf30e4d66b2f1f23e63ef4591058a897f67e6867233e33ca3508b982dcc4129b33878d8d8d8d8d6006600033600160a060020a0316815260200190815260200160002060009054906101000a900460f860020a026007600033600160a060020a0316815260200190815260200160002054604051808a600160a060020a031681526020018960001916815260200188815260200180602001806020018060200187815260200186600160f860020a031916815260200185815260200184810384528a8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015611a8f5780820380516001836020036101000a031916815260200191505b508481038352898181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015611ae85780820380516001836020036101000a031916815260200191505b508481038252888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015611b415780820380516001836020036101000a031916815260200191505b509c5050505050505050505050505060405180910390a15b611b63565b610000565b5b505050505095945050505050565b60006000848360006000611b87848433612384565b91503482901061156c5781340390506000811115611bc557604051600160a060020a0333169082156108fc029083906000818181858888f150505050505b42624f1a00018a1180611bd757504587115b15611be157610000565b6000611c00732bd2326c993dfaef84f696526064ff22eba5b362612507565b1115611c6b57732bd2326c993dfaef84f696526064ff22eba5b362600160a060020a03166316c727216000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100005760325a03f115610000575050604051519550505b8430336000600033600160a060020a03168152602001908152602001600020546040518085151560f860020a02815260010184600160a060020a0316606060020a02815260140183600160a060020a0316606060020a028152601401828152602001945050505050604051809103902095506000600033600160a060020a03168152602001908152602001600020600081548092919060010191905055507f3af7d71c651d8670228b02a0b636ffa73a7f759ef99ff9c024bc3b044a72443833878c8c8c8c6006600033600160a060020a0316815260200190815260200160002060009054906101000a900460f860020a026007600033600160a060020a03168152602001908152602001600020546040518089600160a060020a0316815260200188600019168152602001878152602001806020018060200186815260200185600160f860020a03191681526020018481526020018381038352888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156114f85780820380516001836020036101000a031916815260200191505b508381038252878181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156115515780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390a15b611571565b610000565b5b5050505050949350505050565b60006112136000848462030d40611251565b90505b92915050565b60006111fc84848462030d40611b72565b90505b9392505050565b6000611ee586868686866117e3565b90505b95945050505050565b60006112136000848462030d40611b72565b90505b92915050565b60025433600160a060020a039081169116141580611f315750600160a060020a038116155b15611f3b57610000565b6001805473ffffffffffffffffffffffffffffffffffffffff1916606060020a838102041790555b50565b611f7282600083611fab565b5b5050565b60006111fc84848462030d40611251565b90505b9392505050565b60006116f785858585611251565b90505b949350505050565b60025460009033600160a060020a03908116911614801590611fdc575060015433600160a060020a03908116911614155b15611fe657610000565b8383604051808380519060200190808383829060006004602084601f0104600302600f01f15090500182600160f860020a0319168152600101925050506040518091039020905080600b600b8054809190600101815481835581811511612072576000838152602090206120729181019083015b8082111561206e576000815560010161205a565b5090565b5b505050815481101561000057906000526020600020900160005b50556000818152600a602052604090208290555b5b50505050565b60025433600160a060020a039081169116148015906120d6575060015433600160a060020a03908116911614155b156120e057610000565b60058190555b5b50565b600154600160a060020a031681565b60006116f7858585856116e9565b90505b949350505050565b60006116f785858585611b72565b90505b949350505050565b600160a060020a03331660009081526007602052604090208190555b50565b60025460009033600160a060020a0390811691161480159061217b575060015433600160a060020a03908116911614155b1561218557610000565b5060005b81518110156117dc5782818151811015610000579060200190602002015160076000848481518110156100005790602001906020020151600160a060020a03168152602001908152602001600020819055505b600101612189565b5b5b505050565b60025460009033600160a060020a0390811691161480159061221c575060015433600160a060020a03908116911614155b1561222657610000565b5060005b81518110156117dc5782818151811015610000579060200190602002015160f860020a02600660008484815181101561000057602090810291909101810151600160a060020a03168252810191909152604001600020805460ff191660f860020a9092049190911790555b60010161222a565b5b5b505050565b60025460009033600160a060020a039081169116148015906122d5575060015433600160a060020a03908116911614155b156122df57610000565b50600881905560005b600b54811015611f7257600a6000600b83815481101561000057906000526020600020900160005b505460001916815260200190815260200160002054820260096000600b84815481101561000057906000526020600020900160005b505481526020810191909152604001600020555b6001016122e8565b5b5b5050565b60006111fc600085858562030d406117e3565b90505b9392505050565b600160a060020a03811660009081526007602052604081205462030d4084118015906123c65750600160a060020a038316600090815260208190526040902054155b80156123d457506005548111155b80156123ef575060015432600160a060020a03908116911614155b156123fd57600091506124e6565b80151561240957506005545b60045415801590612430575060045460009081526003602052604090205460ff1615156001145b1561243e57600091506124e6565b60096000866006600087600160a060020a0316815260200190815260200160002060009054906101000a900460f860020a02604051808380519060200190808383829060006004602084601f0104600302600f01f1507fff000000000000000000000000000000000000000000000000000000000000009094169190930190815260408051918290036001019091208552602085019590955250505001600020548482020191505b509392505050565b60006112138362030d4084612384565b90505b92915050565b803b5b91905056'
  
  // https://github.com/oraclize/ethereum-bridge/blob/d89b6a2dbedae586517ec7bc95ee0b02446eb5ed/contracts/ethereum-api/connectors/addressResolver.sol
  var oraclizeAddressResolver = '0x606060405260018054600160a060020a0319163317905560f3806100236000396000f3606060405260e060020a600035046338cc483181146038578063767800de146062578063a6f9dae1146073578063d1d80fdf146091575b005b600054600160a060020a03165b60408051600160a060020a03929092168252519081900360200190f35b6045600054600160a060020a031681565b603660043560015433600160a060020a0390811691161460af576002565b603660043560015433600160a060020a0390811691161460d1576002565b6001805473ffffffffffffffffffffffffffffffffffffffff19168217905550565b6000805473ffffffffffffffffffffffffffffffffffffffff1916821790555056'

  if(vmInstance.executionContext.isVM()){
    vmInstance.txRunner.rawRun({"from":account,"data":oraclizeConnector,"gasLimit":3000000}, function (err, result) {
      if(err) console.log(err);
      result = result.result
      var contractAddr = Buffer.from(result.createdAddress).toString('hex')
      oraclizeConn = "0x"+contractAddr
      console.log("Generated connector: "+oraclizeConn)
      var setCbAddress = "0x9bb51487000000000000000000000000"+account.replace('0x','')
      vmInstance.txRunner.rawRun({"from":account,"to":oraclizeConn,"data":setCbAddress,"gasLimit":3000000}, function (err, result) {
        if(err) console.log(err);
        // OAR generate
        vmInstance.txRunner.rawRun({"from":account,"data":oraclizeAddressResolver,"gasLimit":3000000}, function (err, result) {
          if(err) console.log(err);
          result = result.result
          var resultAddr = Buffer.from(result.createdAddress).toString('hex')
          oar = "0x"+resultAddr
          console.log("Generated oar: "+oar)
          var setAddr = "0xd1d80fdf000000000000000000000000"+(oraclizeConn.replace('0x',''))
          vmInstance.txRunner.rawRun({"from":account,"to":oar,"data":setAddr,"gasLimit":3000000}, function (err, result) {
            if(err) console.log(err);
            $('#oraclizeStatus').html('<span class="green">READY</span>')
            $('#oraclizeImg').removeClass("blackAndWhite")
            runLog(vmInstance, oraclizeConn, account)
          })
        })
      })
    })

    $('.oraclizeView').on('click', function(e){
      e.preventDefault()
      $('#queryNotification').hide()
      $('#queryNotification').html('0')
    })

    $('.clearQueries').on('click', function(e){
      e.preventDefault()
      $('#queryHistoryContainer').html('')
    })

  }
}

function runLog(vmInstance, connectorAddr, account){
  vmInstance.vm.on('afterTx', function (response) {
    for (var i in response.vm.logs) {
      var log = response.vm.logs[i]
      processLog(vmInstance, log, connectorAddr, account)
    }
  })
}

function oraclizeCallback(vmInstance, mainAccount, gasLimit, myid, result, proof, contractAddr){
  if(proof==null){
    var callbackData = ethJSABI.rawEncode(["bytes32","string"],[myid,result]).toString('hex')
    vmInstance.txRunner.rawRun({"from":mainAccount,"to":contractAddr,"gasLimit":gasLimit,"value":0,"data":"0x27dc297e"+callbackData}, function(e, tx){
      var resultTx = tx
      tx = tx.result
      if(e || tx.vm.exceptionError){
        var error = e || tx.vm.exceptionError
        var $button = $('<div class="debugTx"><button title="Launch Debugger" class="debug"><i class="fa fa-bug"></i></div></div>');
        result = '<span style="color:#F00;">'+error+'</span>'
        $button.click(function(){
          vmInstance.event.trigger("debugRequested",[resultTx])
        })
        console.log(error)
      }
      $('#query_'+myid).append('<span class="queryResult">=</span> '+result)
      if($button) $('#query_'+myid).append($button)
    })
  } else {
    var inputProof = (proof.length==46) ? bs58.decode(proof) : proof
    var callbackData = ethJSABI.rawEncode(["bytes32","string","bytes"],[myid,result,inputProof]).toString('hex')
    vmInstance.txRunner.rawRun({"from":mainAccount,"to":contractAddr,"gasLimit":gasLimit,"value":0,"data":"0x38BBFA50"+callbackData}, function(e, tx){
      var resultTx = tx
      tx = tx.result
      if(e || tx.vm.exceptionError){
        var error = e || tx.vm.exceptionError
        var $button = $('<div class="debugTx"><button title="Launch Debugger" class="debug"><i class="fa fa-bug"></i></div></div>');
        result = '<span style="color:#F00;">'+error+'</span>'
        $button.click(function(){
          vmInstance.event.trigger("debugRequested",[resultTx])
        })
        console.log(error)
      }
      $('#query_'+myid).append('<span class="queryResult">=</span> '+result+'<br><span style="color:#666;">Proof:</span> '+proof)
      if($button) $('#query_'+myid).append($button)
    })
      console.log('proof: '+proof)
  }
  updateQueryNotification(1)
  console.log('myid: '+myid)
  console.log('result: '+result)
  console.log('Contract '+contractAddr+ ' __callback called')
}

function updateQueryNotification(count){
  var activeTab = $('#optionViews').attr('class')
  $('#oraclizeWarning, #oraclizeAdditionalWarning').hide()
  if(activeTab!='oraclizeView'){
    $('#queryNotification').show()
    $('#queryNotification').html(count+parseInt($('#queryNotification').text()))
  }
}

function processLog(vmInstance, log, connectorAddr, account) {
  var decoded
  if("0x"+log[0].toString('hex')==connectorAddr){
    var eventSignature = log[1][0].toString('hex')
    if(eventSignature=="b76d0edd90c6a07aa3ff7a222d7f5933e29c6acc660c059c97837f05c4ca1a84"){ // Log1 signature
      var types = ["address","bytes32","uint256","string","string","uint256","bytes1","uint256"] // event Log1
      decoded = ethJSABI.rawDecode(types, log[2])
      decoded = ethJSABI.stringify(types, decoded)
      decoded = {"sender":decoded[0],"cid":decoded[1],"timestamp":decoded[2],"datasource":decoded[3],"arg":decoded[4],"gaslimit":decoded[5],"proofType":decoded[6],"gasPrice":decoded[7]}
    } else if(eventSignature=="af30e4d66b2f1f23e63ef4591058a897f67e6867233e33ca3508b982dcc4129b"){ // Log2 signature
      var types = ["address","bytes32","uint256","string","string","string","uint256","bytes1","uint256"] // event Log2
      decoded = ethJSABI.rawDecode(types, log[2])
      decoded = ethJSABI.stringify(types, decoded)
      decoded = {"sender":decoded[0],"cid":decoded[1],"timestamp":decoded[2],"datasource":decoded[3],"arg1":decoded[4],"arg2":decoded[5],"gaslimit":decoded[6],"proofType":decoded[7],"gasPrice":decoded[8]}
    } else if(eventSignature=="3af7d71c651d8670228b02a0b636ffa73a7f759ef99ff9c024bc3b044a724438"){ // LogN signature
      var types = ["address","bytes32","uint256","string","bytes","uint256","bytes1","uint256"] // event LogN
      decoded = ethJSABI.rawDecode(types, log[2])
      decoded = ethJSABI.stringify(types, decoded)
      decoded = {"sender":decoded[0],"cid":decoded[1],"timestamp":decoded[2],"datasource":decoded[3],"args":decoded[4],"gaslimit":decoded[5],"proofType":decoded[6],"gasPrice":decoded[7]}
    }
    if(!$('#queryHistoryContainer').find('.datasource').length) $('#queryHistoryContainer').html('');
    console.log(decoded)
    var myid = decoded['cid']
    var myIdInitial = myid
    var cAddr = decoded['sender']
    var ds = decoded['datasource']
    if(typeof(decoded['arg']) != 'undefined'){
      var formula = decoded['arg']
    } else if(typeof(decoded['args']) != 'undefined') {
      var formula = cbor.decodeAllSync(Buffer.from(decoded['args'].substr(2), 'hex'))[0]
    } else {
      var arg2formula = decoded['arg2']
      var formula = [decoded['arg1'],arg2formula]
    }
    if($('#query_'+myIdInitial).length!=0){
      return
    }
    var dateQuery = new Date()
    dateQuery = dateQuery.getHours()+":"+dateQuery.getMinutes()+":"+dateQuery.getSeconds()
    var queryInfoTitle = "Time: "+dateQuery+"\n"+"myid: "+myIdInitial
    var queryHtml = "<div id='query_"+myIdInitial+"' title='"+queryInfoTitle+"' style='margin-bottom:4px;'><span><span class='datasource'>"+ds+"</span> "+formula+"</span><br></div>"
    $('#queryHistoryContainer').append(queryHtml)

    var time = parseInt(decoded['timestamp'])
    var gasLimit = parseInt(decoded['gaslimit'])
    var proofType = decoded['proofType']
    var query = {
        when: time,
        datasource: ds,
        query: formula,
        proof_type: parseInt(proofType)
    }
    console.log(formula)
    console.log(JSON.stringify(query))
    createQuery(query, function(data){
      console.log("Query : "+data)
      data = JSON.parse(data)
      myid = data.result.id
      console.log("New query created, id: "+myid)
      console.log("Checking query status every 5 seconds..")
      updateQueryNotification(1);
      var interval = setInterval(function(){
        // check query status
        checkQueryStatus(myid, function(data){
          data = JSON.parse(data)
          console.log("Query result: "+JSON.stringify(data))
          if(data.result.checks==null) return;
          var last_check = data.result.checks[data.result.checks.length-1]
          var query_result = last_check.results[last_check.results.length-1]
          var dataRes = query_result
          var dataProof = data.result.checks[data.result.checks.length-1]['proofs'][0]
          if (!last_check.success) return;
          else clearInterval(interval)
          if(dataProof==null && proofType!='0x00'){
            dataProof = Buffer.from('')
          } else if(typeof dataProof == 'object' && proofType!='0x00'){
            if(typeof dataProof.type != 'undefined' && typeof dataProof.value != 'undefined'){
              dataProof = Buffer.from(dataProof.value)
            }
          }
          oraclizeCallback(vmInstance, account, gasLimit, myIdInitial, dataRes, dataProof, cAddr)
        })

      }, 5*1000)
    })
  }
}

function createQuery(query, callback){
  request.post('https://api.oraclize.it/v1/query/create', {body: JSON.stringify(query), headers:{"X-User-Agent":"browser-solidity","Content-Type":"application/json"} }, function (error, response, body) {
    if (error) console.log(error)
    if (response.statusCode == 200) {
      callback(body)
    } else {
      $('#oraclizeAdditionalWarning').show()
      $('#oraclizeWarning').show()
      $('#queryNotification').hide()
    }
  })
}

function checkQueryStatus(query_id, callback){
  request.get('https://api.oraclize.it/v1/query/'+query_id+'/status', { headers:{"X-User-Agent":"browser-solidity","Content-Type":"application/json"} }, function (error, response, body) {
    if (error) console.log(error)
    if (response.statusCode == 200) {
      callback(body)
    } else {
      $('#oraclizeAdditionalWarning').show()
      $('#oraclizeWarning').show()
      $('#queryNotification').hide()
    }
  })
}


module.exports = {
  'generateOraclize': generateOraclize
}
