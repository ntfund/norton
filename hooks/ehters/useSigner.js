import useProvider from "@/hooks/ehters/useProvider.js";

export default async function () {
    return await useProvider().getSigner();
}
