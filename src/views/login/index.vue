<template>
  <div class="login-container">
    <div class="top">
      <img src="../../assets/login/business.png" alt="">
      <img :src="currentimg" alt="">
    </div>
    <img src="../../assets/background.png" alt="" >
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">欢迎登录</h3>
        <!-- 语言选择 -->
        <!-- <lang-select class="set-language"></lang-select> -->
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入用户密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class="tips">
        <span>{{$t('login.username')}} : admin</span>
        <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;">{{$t('login.username')}} : editor</span>
        <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
      </div>

      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{$t('login.thirdparty')}}</el-button> -->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate';
import LangSelect from '@/components/LangSelect';
import SocialSign from './socialsignin';

export default {
  components: { LangSelect, SocialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入正确的用户密码'));
      } else {
        callback();
      }
    };
    return {
      currentimg: '',
      // 登录数据
      loginForm: {
        username: '',
        password: ''
      },
      // 登录验证规则
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then((res) => {
              this.loading = false;
              this.$router.push({ path: '/' });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    this.$store.dispatch('GetHospital').then(res => { // 拉取user_info
      console.log(res);
      this.currentimg = res;
    }).catch((err) => {
      console.log(err);
    });
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

.login-container {
  
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #333 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background:#fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  >.top{
    height: 85px;
    position: relative;
    &:after{
      content:"";
      display: block;
      width:1px;
      height: 55px;
      background:#dadada;
      left:227px;
      top:15px;
      position: absolute;
    }
    >img{
      display: inline-block;
      height: 55px;
      margin:15px 20px;
    }
  }
  >img{
    min-width: 1600px;
    width: 100%;
    position: absolute;
    right: 0;
    top: 85px;
  }
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #fff;
  .login-form {
    position: absolute;
    top:300px;
    right: 250px;
    width: 400px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
