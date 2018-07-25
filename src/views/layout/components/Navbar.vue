<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
          <img class="user-avatar" src="../../../assets/images/logoadmin.png">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item >
            <span @click="dialogFormVisible = true" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item >
            <span @click="Feedback" style="display:block;">意见反馈</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="changeForm" status-icon :rules="changeRule" ref="changeForm" label-width="70px" >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="changeForm.oldPassword" auto-complete="off" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="changeForm.newPassword" auto-complete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPasswordAgain">
          <el-input type="password" v-model="changeForm.newPasswordAgain" auto-complete="off" placeholder="再次输入原密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword('changeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import ErrorLog from '@/components/ErrorLog';
import Screenfull from '@/components/Screenfull';
import LangSelect from '@/components/LangSelect';
import ThemePicker from '@/components/ThemePicker';
import { Login } from '@/api/login';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'token'])
  },
  data() {
    return {
      dialogFormVisible: false,
      changeForm: {
        oldPassword: null,
        newPassword: null
      },
      newPasswordAgain: null,
      changeRule: {
        newPassword: [
          { validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入密码'));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ],
        newPasswordAgain: [
          { validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.changeForm.newPassword) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ],
        oldPassword: [
          { validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error('原密码不能为空'));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ] }
    };
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
    },
    changePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Login.pceditPassword({
            adminId: this.token,
            ...this.changeForm
          }).then((res) => {
            this.$message({
              message: '密码已修改成功！',
              type: 'success'
            });
            this.dialogFormVisible = false;
          }).catch((error) => {
            console.log(error);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    Feedback() {
      this.$prompt('请输入反馈意见', '意见反馈', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          if (!value.trim()) {
            this.$message({
              type: 'error',
              message: '内容不可为空'
            });
            return false;
          }
          Login.sendMessage({
            adminId: this.token,
            suggestion: value,
            fromSys: 1
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: '感谢您的宝贵意见'
              });
            })
            .catch(error => {
              console(error.message);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
