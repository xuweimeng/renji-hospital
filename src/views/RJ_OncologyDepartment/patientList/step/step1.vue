<template>
<div>
	<el-upload
	  class="upload-demo"
	  ref="uploademo"
	  drag
	  name="upfile"
		:action="upload.patientUrl"
	  :data="{adminId:sendData.adminId}"
	  :before-upload="beforeUpload"
	  :on-success="onSuccess"
	  :on-error="onError">
	  <i class="el-icon-upload"></i>
	  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
	  <div class="el-upload__tip" slot="tip"><a href="/assets/templatedoc/cologyTemp.xls">下载Excel模板</a></div>
	</el-upload>
	<!-- <el-button type="primary" @click="testBtn">test</el-button> -->
	</div>
</template>

<script>
	import { upload } from 'RJZL_API/patientList';
	export default {
	  name: 'step2',
	  data() {
	    return {
	      upload: upload,
	      sendData: {
	        adminId: sessionStorage.getItem('userId') // userid
	      }
	    };
	  },
	  methods: {
	    /** @description */
	    beforeUpload(file) {
	      console.log(this.$refs.uploademo.data);
	      const extension = file.name.split('.')[1] === 'xls';
	      const extension1 = file.name.split('.')[1] === 'xlsx';
	      if (!extension && !extension1) {
	        this.$message.error('上传格式只能为xls或者xlsx!');
	      }
	    },
	    /**
			 * [onSuccess description]
			 * @description 上传成功
			 * @DateTime    2018-04-19
			 */
	    onSuccess(response) {
	      response = JSON.parse(response);
	      if (response.code == 3) {
	        this.$message.error(response.message);
	      } else {
	        this.$message.success('上传成功!');
	        this.$store.dispatch('getUploadNum', response);
	        this.$emit('stepFun', 1);
	      }
	    },
	    /**
			 * [onError description]
			 * @description 上传失败
			 * @DateTime    2018-04-19
			 */
	    onError(response) {
	      this.$message.error(JSON.parse(response.message));
	    }
	  }
	};
</script>

<style lang="scss">
	.upload-demo {
			margin: 50px auto;
			width: 360px;
			a{
				display: block;
				border-radius: 5px;
				height: 35px;
				line-height: 35px;
				text-align: center;
				background-color: #f80;
				color: #fff;
				font-size: 13px;
				width: 100px;
				margin: 15px auto;
			}
		}
</style>