const {PaymentContractABI,TVKABI,add}=require('./ABI')
require("dotenv").config();


const Web3 = require('web3');
const url = process.env.URL;
const accountAddress=process.env.ACCOUNT_ADDRESS;
const privateKey=process.env.PRIVATE_KEY;
const PaymentContractAddress = "0x008C155ac642E49ab8805E20F4f3636806c72F66";
const TVKAddress = "0x5E1Ce3a4F0D3Bb0b64289E948c317b96481acCFF";
const web3 = new Web3(url);
const PaymentContract = new web3.eth.Contract(PaymentContractABI,PaymentContractAddress);
const TVKContract = new web3.eth.Contract(TVKABI,TVKAddress);

const request = require("request");

const url2 = "https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=2000000000&apikey=7N13F63MRTXKACIKGGYEGG3SZ314XV4G51";
const url3 = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=7N13F63MRTXKACIKGGYEGG3SZ314XV4G51";

request(url3, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        console.log("success")
        let res=JSON.parse(body)
        console.log(res.result.FastGasPrice);

    }
    else
    {
        console.log("falil")
        console.log(error)
    }
})
  
const init1=async ()=>{
const networkId=await web3.eth.net.getId();
const tx=TVKContract.methods.approve("0x2760e501577471e561b1835186845F0114C35Beb",1000000000);
const gas=await tx.estimateGas({from:accountAddress});
const gasPrice=await web3.eth.getGasPrice();
/**
 * encoded abi of approve function that is a hexa decimal string that bascialy call smart 
 * contract which function to call and with which argument.
 */
const data=tx.encodeABI();
// nonce is an integer that is encremented after each transcation.
const nonce=await web3.eth.getTransactionCount(accountAddress);
const signedTx=await web3.eth.accounts.signTransaction(
    {
        to:TVKContract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId:networkId
    },
    privateKey

)
const receipt=await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
console.log(`TVK APPROVE FUNCTION Transaction hash:${receipt.transactionHash}`);
}

const init2=async ()=>{
    const networkId=await web3.eth.net.getId();
    const tx=PaymentContract.methods.buyLandWithEth("SMALL",705);
    // const gas=await tx.estimateGas({from:accountAddress});
    // console.log(gas);
    const gasPrice=await web3.eth.getGasPrice();
    /**
     * encoded abi of approve function that is a hexa decimal string that bascialy call smart 
     * contract which function to call and with which argument.
     */
    const data=tx.encodeABI();
    // nonce is an integer that is encremented after each transcation.
    const nonce=await web3.eth.getTransactionCount(accountAddress);
    const value=web3.utils.toWei("1","ether");
    const signedTx=await web3.eth.accounts.signTransaction(
        {
            to:PaymentContract.options.address,
            value:value,
            data,
            gas:4000000,
            gasPrice,
            nonce,
            chainId:networkId
        },
        privateKey
    
    )
    const receipt=await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Payment contract FUNCTION Transaction hash:${receipt.transactionHash}`);
    }
    
async function TVKallowance(owner,spender) {
    allowance = await TVKContract.methods.allowance(owner, spender).call()
    await console.log(`allowance function of TVK smart contract is called value:${allowance}`);
}
 



     


// TVKallowance("0x4f7959a3191e2505275c8b16c6228A64D3178bbE","0x2760e501577471e561b1835186845F0114C35Beb");

// init1();
// init2();
 