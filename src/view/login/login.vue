<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false" style="text-align: center">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import axios from '@/libs/axios_new'
import api from '@/api/index'
import { setStorage, getStorage } from '@/libs/storage'

export default {
  components: {
    LoginForm
  },
  methods: {

    handleSubmit ({ userName, password }) {
      axios('POST',
        api.login,
        {username: userName, password: password},
        (data) => {
          //将token放入localstorage中
          setStorage('token' ,data.token)
          //将该用户的基本信息/角色/权限放入到localstorage中

          this.$router.push({
            name: this.$config.homeName
          })
        })
    }

  }
}
</script>

<style>

</style>
