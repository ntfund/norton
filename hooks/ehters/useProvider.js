import {
	ethers
} from "ethers"

export default function (RPC) {
    // const {ethereum} = window;
    return new ethers.providers.JsonRpcProvider(RPC)
}
