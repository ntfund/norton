import {
	onMounted,
	ref
} from "vue";

import dbSetting from "@/utils/dbSetting";

export default function() {
	const hasPassword = ref(false);

	onMounted(async () => {
		hasPassword.value = await dbSetting.hasPassword();
	})

	return {
		hasPassword
	}
}