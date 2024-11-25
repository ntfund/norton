<template>
</template>

<script setup>
	import {
		inject,
		ref
	} from 'vue';
	import project from '@/utils/project';
	import s3Helper from '@/utils/s3Helper';
	const props = defineProps(["data"])
	const isUpload = ref(props.data.msg.status && props.data.msg.status == "uploading");
	const percent = ref(0)
	const room_id = inject('room_id')

	if (isUpload.value) {

		let file = props.data.msg.file;
		let content = props.data.msg.content

		s3Helper.upload({
			file: file,
			success: res => {
				const url = res.fullPath
				let msg = {
					url: url,
					length: content.length,
					uuid: content.uuid
				};

				project.sendMsg(room_id, msg, 'voice')
			},
			progress: (value) => {
				percent.value = value;
			}
		}, 'voices')
	}
</script>


<style>
</style>