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
import { setToken, getToken } from '@/libs/util'

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
          setToken(data)
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
