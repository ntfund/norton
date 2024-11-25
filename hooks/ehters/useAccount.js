import {showToast} from "vant/es";
import store from "@/store/index.js";
import tools from "@/utils/tools.js";
import ethersTools from "@/utils/ethersTools.js";

export default async function (callBack) {
    let {ethereum} = window;

    if (typeof ethereum === "undefined") {
        ethereum = await ethersTools.waitUntilEthereum().catch(error => {
            console.log(error)
        });
    }

    if (typeof ethereum === "undefined") {
        //没安装MetaMask钱包进行弹框提示
        console.log("MetaMask not installed; using read-only defaults")
        showToast("请安装MetaMask")
        return;
    }
    const onGetAccount = async (account) => {
        await store.commit('setAddress', account);
        await store.commit('setHideAccount', tools.hideAccount(account, 4, 3));
        // localStorage.setItem('account', account);

        if (callBack) {
            callBack(account)
        }
    }

    function handleChainChanged(_chainId) {
        // We recommend reloading the page, unless you must do otherwise
        // window.location.reload();
        console.log('_chainId', _chainId)
    }

    function handleAccountsChanged(accounts) {
        // console.log('handleAccountsChanged', accounts)
        // message.info('account:'+accounts[0])
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            showToast('Please connect to MetaMask.');
        }
        // console.log(accounts)
        onGetAccount(accounts[0])
    }

    ethereum.request({method: 'eth_requestAccounts'})
        .then(handleAccountsChanged)
        .catch((err) => {
            if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                console.log('Please connect to MetaMask.');
            } else {
                console.error(err);
            }
        });

    ethereum.on('accountsChanged', handleAccountsChanged);

    // provider = new ethers.BrowserProvider(ethereum)

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    // signer = await provider.getSigner();

    // console.log(signer.address)

    // console.log(await provider.getBlockNumber())
    // let balance = await provider.getBalance(signer.address);

    // console.log(formatEther(balance))

    // let tx = await signer.sendTransaction({
    //     to: '0x2C0aA0817A59095A54E3149CB96E86A694052444',
    //     value: parseEther('0.001')
    // })

    // let sig = await signer.signMessage("send");
}
