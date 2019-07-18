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

    <Modal v-model="addModalFlag" title="新增用户" @on-ok="saveAddData" style="text-align: center">
      <Form ref="addModalRef" :model="addFormData" :label-width="80">
        <FormItem label="用户ID" prop="userId">
          <Input v-model="addFormData.userId"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="addFormData.username"></Input>
        </FormItem>
        <FormItem label="电话" prop="mobile">
          <Input v-model="addFormData.mobile"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="addFormData.email"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="editModalFlag" title="新增用户" @on-ok="saveEditData" style="text-align: center">
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
          mobile: ''
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
        editFormData: {}
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
        axios('POST',
          api.system.user.user,
          this.addFormData,
          (data) => {
            this.getUserList()
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
            this.getUserList()
          })
      },
      delete (userId) {

        axios('DELETE',
          api.system.user.user,
          {userId: userId},
          (data) => {
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
