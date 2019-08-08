<template>
  <div>

    <Card>
      <Form class="search-form" ref="searchForm" :model="searchForm" inline :label-width="80">
        <FormItem prop="username" label="姓名">
          <Input v-model="searchForm.username" />
        </FormItem>
        <FormItem prop="userId" label="用户ID">
          <Input v-model="searchForm.userId" />
        </FormItem>
        <FormItem prop="role" label="角色">
          <Select v-model="searchForm.roleId" filterable clearable>
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
          </Select>
        </FormItem>
        <FormItem >
          <Button type="primary" @click="getUserList" style="margin-right: 10px">查询</Button>
          <Button type="warning" @click="handleReset('searchForm')" style="margin-right: 10px">重置</Button>
          <Button type="success" @click="showAddModal">添加用户</Button>
        </FormItem>
      </Form>


        <Table size="small" ref="selection" border :columns="columns":data="tableData" ></Table>

      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="page.total" :current="page.current" :page-size="page.pageSize" :page-size-opts="page.sizeOpts" show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
          </Page>
        </div>
      </div>
    </Card>

    <Modal v-model="addModalFlag" title="新增用户" @on-ok="saveAddData" style="text-align: center" :mask-closable="false">
      <Form ref="addModalRef" :model="addFormData" :rules="validateRules" :label-width="80">
        <FormItem label="用户ID" prop="userId">
          <Input v-model="addFormData.userId"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="addFormData.username"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="addFormData.password"></Input>
        </FormItem>
        <FormItem label="电话" prop="mobile">
          <Input v-model="addFormData.mobile"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="addFormData.email"></Input>
        </FormItem>
        <FormItem label="角色" prop="roles">
          <Select v-model="addFormData.roles" filterable multiple clearable>
            <Option v-for="(value, key) in roleIdNameMap" :value="key" :key="key">{{ value }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="editModalFlag" title="编辑用户" @on-ok="saveEditData" style="text-align: center" :mask-closable="false">
      <Form ref="editModalRef" :model="editFormData" :label-width="80">
        <FormItem label="用户ID" prop="userId">
          <Input v-model="editFormData.userId" disabled></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="editFormData.username"></Input>
        </FormItem>
        <FormItem label="电话" prop="mobile">
          <Input v-model="editFormData.mobile"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="editFormData.email"></Input>
        </FormItem>
        <FormItem label="角色" prop="roles">
          <Select v-model="editFormData.roles" filterable multiple clearable>
            <Option v-for="(value, key) in roleIdNameMap" :value="key" :key="key">{{ value }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>


<script>
  import axios from '@/libs/axios_new'
  import api from '@/api/index'

  export default {

    data () {
      return {
        // 搜索框
        searchForm: {
          username: '',
          userId: '',
          roleId: ''
        },
        //表单数据
        page: {
          total: 0,
          current: 1,
          pageSize: 10,
          sizeOpts: [15, 25, 30, 40, 50, 100]
        },
        columns: [
          {
            title: '用户名',
            key: 'username',
            align: 'center'

          },
          {
            title: '用户ID',
            key: 'userId',
            align: 'center'

          },
          {
            title: '邮箱',
            key: 'email',
            align: 'center'
          },
          {
            title: '电话',
            key: 'mobile',
            align: 'center'
          },
          {
            title: '角色',
            key: 'mobile',
            align: 'center',
            render: (h, params) => {
              let roleBtnList = []
              let roleIds = params.row.roles

              for (let i = 0; i < roleIds.length; i++) {
                let tmp = h('Button', {props: {type: 'success', size: 'small'}, style: {marginRight: '1px'}}, this.roleIdNameMap[roleIds[i]])
                roleBtnList.push(tmp)
              }
              return h('div', [
                roleBtnList
              ])
            }
          },
          {
            title: '操作',
            key: 'handle',
            // fixed: 'right',
            width: 180,
            align: 'center',
            render: (h, params) => {

              let editBtn = h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showEditModal(params.row)
                    }
                  }
                },
                '编辑'
              )

              let deleteBtn = h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '温馨提示',
                        content: '确定删除: ' + params.row.username,
                        onOk: () => {
                          this.delete(params.row.userId)
                        }
                      })
                    }
                  }
                },
                '删除'
              )

              return h('div', [
                editBtn, deleteBtn
              ])
            }
          }
        ],
        tableData: [],
        // 增删改查
        addModalFlag: false,
        editModalFlag: false,
        addFormData: {},
        editFormData: {
          roles: []
        },
        roleIdNameMap: {},
        roleList: [],
        validateRules: {
          userId: [
            { type: 'string', pattern: /^[a-z]+$/, required: true, message: '用户ID不能为空, 并且只能使用小写字母', trigger: 'blur' }
          ],
          username: [
            {type: 'string', required: true, message: '用户名称不能为空', trigger: 'blur' },
          ],
          password: [
            {type: 'string', required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          email: [
            { type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blur' }
          ],
          mobile: [
            {type: 'string', required: true, message: '手机号码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 获取用户列表
      getUserList () {
        axios('GET',
          api.system.user.user,
          Object.assign({pageSize: this.page.pageSize, pageNo: this.page.current}, this.searchForm),
          (data) => {
            this.tableData = data.list
            this.page.total = data.total
          })
      },
      // 获取角色列表, 用于编辑用户角色的选项
      getRoleList () {
        axios('GET',
          api.system.role.role,
          {pageSize: 1000, pageNo: 1},
          (data) => {
            this.roleList = data.list
            for (let i = 0; i < data.list.length; i++) {
              this.roleIdNameMap[data.list[i].roleId] = data.list[i].roleName
            }
          })

      },
      // 重置搜索框
      handleReset(name){
        this.$refs[name].resetFields()
      },
      // 翻页相关方法
      changePage (current) {
        this.page.current = current
        this.getUserList()
      },
      // 切换分页
      handlePageSize (value) {
        this.page.pageSize = value
        this.getUserList()
      },
      //新增用户
      showAddModal () {
        this.addModalFlag = true
      },
      saveAddData () {

        this.$refs.addModalRef.validate((valid) => {
          if (valid) {
            axios('POST',
              api.system.user.user,
              this.addFormData,
              (data) => {
                this.$Message.success('用户添加成功')
                this.getUserList()
              })
          } else {
            this.$Message.error('表单校验失败')
          }
        })



      },
      //编辑用户
      showEditModal (row) {
        this.editFormData = row
        this.editModalFlag = true
      },
      saveEditData () {
        axios('PUT',
          api.system.user.user,
          this.editFormData,
          (data) => {
            this.$Message.success('用户修改成功')
            this.getUserList()
          })
      },
      delete (userId) {
        axios('DELETE',
          api.system.user.user,
          {userId: userId},
          (data) => {
            this.$Message.success('用户删除成功')
            this.getUserList()
          })
      }

    },
    watch: {
      searchForm: {
        handler: function(newValue, oldValue){
          this.page.current = 1
          this.getUserList()
        },
        // 跟踪字典的变化, 不管有多深都会触发
        deep: true
      }
    },
    mounted () {
      this.getUserList()
      this.getRoleList()

    }
  }
</script>


<style lang="less" scoped>
  // 为了不污染其他部分样式，我们一般希望这里添加scoped，此时样式作用域不能深入到子组件中，所以可以通过深度作用选择器（ >>> ）来解决
  // less或者sass等预编译，是不支持>>>操作符的，可以使用/deep/来替换>>>
  /deep/ .ivu-modal-footer{
    text-align: center;
  }
</style>
