<template>
  <div>
    <div class="top-bar">
      <div class="main-container">
        <div class="logo" @click="backHomePage">
          金泰驾考理论学习系统
        </div>
        <div v-if="userName" style="float:right">
          <div class="user-info">
            <Icon type="md-contact" size="20" />&nbsp{{userName}}&nbsp&nbsp
          </div>
          <div class="logout">
            <Button size="large" type="default" icon="md-log-out" ghost @click="Logout">登出</Button>
          </div>
        </div>
      
        <div v-else class="login-button">
          <Button size="large" type="default" icon="ios-log-in" ghost  @click="openLoginModal">登录</Button>
        </div>
      
       
      </div>
    </div>
    <!--<div class="middle-bar">-->
    <!---->
    <!--</div>-->
  
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 Home！ -->
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">

    </router-view>
    <div class="layout-footer">
    </div>
    <!--登录弹框-->
    <Modal v-model="loginModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>用户登录</span>
      </p>
      <div style="text-align:center">
        <Form ref="loginForm" :model="loginForm" :label-width="0"  >
          <Form-item prop="mobile" :rules="{required: true, message: '必填,请输入合法手机号',min:1,max:11, trigger:'blur',type:'string',pattern:/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/}" >
            <Input prefix="ios-contact" v-model="loginForm.mobile" max="11"  placeholder="请输入手机号"></Input>
          </Form-item>
          <!--<Form-item prop="userName" :rules="{required: true, message: '必填,合法手机号',min:1,max:11, trigger:'blur',type:'string'}">-->
            <!--<Input prefix="ios-contact" v-model="loginForm.userName" max="50"  placeholder="请输入手机号"></Input>-->
          <!--</Form-item>-->
          <Form-item prop="password" :rules="{required: true, message: '密码必填',min:1,max:11, trigger:'blur',type:'string'}">
            <Input prefix="md-lock" v-model="loginForm.password" max="50" type="password"  placeholder="请输入密码"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button  size="large" class="operate-btn" long :loading="isLoging" @click="submitLogin">登录</Button>
      </div>
    </Modal>
    
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {login,logout} from '@/api/user';
export default {
  data () {
    return {
      loginModal: false,
      btnLoading:false,
      isLoging:false,
      loginForm:{
        mobile: '18627774450',
        password: '123456',
        login_type:2
      }
    }
  },
  computed: {
    ...mapState({
      'isVip': state => state.user.isVip,
      'userName':state => state.user.userName,
      'userAvator':state => state.user.avatorImgPath,
   }),
  },
  created(){
    this.$store.commit('updateUserState');
    this.$store.commit('setCurrentSubject');
  },
  methods: {
    openLoginModal() {
      this.loginModal = true;
    },
    backHomePage(){
      this.$router.push({
        name: 'home'
      })
    },
    async Logout(){
      let result = await logout({});
      if (result.status ===0) {
        sessionStorage.clear();
        this.$Message.success('登出成功!');
        this.$store.commit('updateUserState');
        this.$router.push({
              name: 'home'
            });
      }else{
        this.$Message.error("服务器异常,稍后再试");
      }
    },
    async submitLogin(){
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.loginForm));
          this.isLoading=true;
          this.$Loading.start();
          let result = await login(params);
          if (result.status ===0) {
            this.isLoading=false;
            this.$Loading.finish();
            this.$Message.success('登录成功!');
            this.loginModal=false;
            this.$store.commit('handleLogin', result.data)
//            this.$router.push({
//              name: 'home'
//            })
          }else{
            this.isLoading=false;
            this.$Loading.error();
            this.$Message.error("服务器异常,稍后再试");
          }

        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "./../assets/styles/common";
@import "Main.less";
.ivu-btn-ghost.ivu-btn-dashed:hover, .ivu-btn-ghost.ivu-btn-default:hover{
  color: #e5e9fd;;
  border-color: #e5e9fd;
}
</style>
