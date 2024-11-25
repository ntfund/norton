import {ref} from "vue";
import TokenData from "@/Data/TokenData.js";
import ethersTools from "@/utils/ethersTools.js";
import tools from "@/utils/tools.js";
import useAccount from "@/hooks/ehters/useAccount.js";

export default function (tokenAddress = TokenData.usdtAddress) {
    const balance = ref(0);
    useAccount( async account => {
        const amount =  await ethersTools.getBalance(account, tokenAddress);
        balance.value = tools.floorAmount(amount)
    })

    return balance;
}
