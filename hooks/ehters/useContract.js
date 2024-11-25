import useProvider from "@/hooks/ehters/useProvider.js";
import {Contract} from "ethers";
import TokenData from "@/Data/TokenData.js";
import tokenData from "@/Data/TokenData.js";

export default async function (address = tokenData.usdtAddress, abi = TokenData.abi) {
    let signer = await useProvider().getSigner();
    return new Contract(address, abi, signer);
}
