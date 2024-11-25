import {
	onMounted,
	ref
} from 'vue';

export default function() {
	const status = ref(true)
	const windowHeight = ref('');

	onMounted(() => {
		uni.getSystemInfo({
			success: (res) => {
				windowHeight.value = res.windowHeight;
			}
		});
		uni.onWindowResize((res) => {
			console.log(res.size.windowHeight, windowHeight.value)
			if (res.size.windowHeight < windowHeight.value) {
				status.value = false
			} else {
				status.value = true
			}
		})
	})

	const showTabbar = () => {
		status.value = true;
	}
	const hideTabbar = () => {
		status.value = false;
	}

	return {
		status,
		showTabbar,
		hideTabbar
	};
}