<template>
	<com-nav-bar title="Api" :border="true" backgroundColor="#fff"></com-nav-bar>
	<view class="text-sm" v-if="show">
		<view class="bg-white p-4">
			<view class="text-md font-medium">请选择交易平台</view>
			<view class="flex justify-start mt-2">
				<view class="flex flex-row p-1.5 px-2 border border-solid border-blue-400 bg-blue-100 items-center">
					<!--        <view class="bg-blue-300">-->
					<!--          <img src="https://static.coinall.ltd/cdn/assets/imgs/221/187957948BD02D97.png" alt="40" width="40">-->
					<!--        </view>-->
					<view class="">
						<img src="/static/img/okx.png" alt="" width="40" class="relative">
					</view>
					<view class="ml-2">
						欧易OKX
					</view>
				</view>
			</view>
			<view class="flex justify-between mt-2">
				<view class="w-1/2">
					账户类型
				</view>
				<view class="w-1/2">
					<label class="radio flex items-center">
						<radio style="transform:scale(0.8)" value="r1" checked="true" />v5
					</label>
				</view>
			</view>
		</view>

		<view class="bg-white p-4 mt-1.5">
			<view class="">
				<view class="text-md font-medium">1.申请V5 API时设置的PassPhrase</view>
			</view>
			<view class="mt-2">
				<u--input v-model="formState.pass_phrase" placeholder="请输入您在创建此API时所设置的PassPhrase" class="py-2" />
			</view>

			<view class="mt-4">
				<view class="text-md font-medium">2.填写 <span class="font-bold">只读API</span> 信息</view>
			</view>
			<view class="mt-2">
				<u--input v-model="formState.api_key" placeholder="在此填入ApiKey" class="py-2" />
			</view>
			<view class="mt-4">
				<u--input v-model="formState.secret_key" placeholder="在此填入SecretKey" class="py-2" />
			</view>

			<view class="flex justify-between mt-6">
				<view class="w-1/2 text-md font-medium">
					统计范围
				</view>
				<view class="w-1/2">
					<label class="radio flex items-center">
						<radio style="transform:scale(0.8)" value="r1" checked="true" />合约
					</label>
				</view>
			</view>

			<view class="text-gray-400 mt-2">
				注：该交易所目前仅支持统计合约+现货+期权
			</view>


			<view class="text-gray-400 mt-6">
				-仅支持<span class="text-orange-300">只读权限</span>的API接入
			</view>
			<view class="text-gray-400 mt-2">
				-您的API将被多次加密， 请放心提交
			</view>
			<view class="text-gray-400 mt-2">
				-数据仅自己可见
			</view>

			<button type="button" class="bg-blue-600 rounded-full  text-base py-2 text-white border-0  mt-10"
				@click="onSubmit">授权接入</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import { getApiList } from "../../config/api.js";
	import tools from '../../utils/tools.js'


	const props = defineProps(['add']);
	const http = uni.$u.http
	const show = ref(false)
	if (props.add) {
		console.log('props.add', props.add)
		show.value = true;
	}

	const apiList = ref([])
	const selectedItem = ref({ id: 0 });
	getApiList().then((data : []) => {
		apiList.value = data
		if (apiList.value.length > 0 && !props.add) {
			selectedItem.value = apiList.value[0]
			toDetail(selectedItem.value);
		} else {
			show.value = true
		}
	})

	let formState = reactive({
		pass_phrase: '',
		api_key: '',
		secret_key: ''
	})

	const onSubmit = () => {
		// console.log('submit!', toRaw(formState));
		if (formState.pass_phrase == '') {
			uni.$u.toast('请填写pass_phrase')
			return;
		}
		if (formState.api_key == '') {
			uni.$u.toast('请填写api_key')
			return;
		}
		if (formState.secret_key == '') {
			uni.$u.toast('请填写secret_key')
			return;
		}
		http.post('/userApi', formState).then(res => {
			// router.push({ name: 'analystDetail', query: { 'cycle': 7, apiCount: 1 } })
			apiList.value.push(res)
			selectedItem.value = res;
			toDetail(selectedItem.value)
			uni.$u.toast('设置成功')
		})
	};

	const toDetail = (api) => {
		tools.redirectToEncode('/pages/api/detail', { api, apiList: apiList.value })
	}
</script>

<style lang="less" scoped>

</style>