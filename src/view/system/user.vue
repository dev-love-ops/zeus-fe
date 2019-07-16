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
          <Button type="warning" @click="handleReset('searchForm')">重置</Button>
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

    <Modal v-model="editModalFlag" title="用户编辑" @on-ok="saveEditData">
      <Form ref="editModalRef" :model="editFormData" :label-width="80">
        <FormItem label="ID" prop="id">
          <Input v-model="editFormData.id"></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="editFormData.name"></Input>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Input v-model="editFormData.status"></Input>
        </FormItem>
        <FormItem label="IP" prop="intra_ip">
          <Input v-model="editFormData.intra_ip"></Input>
        </FormItem>
        <FormItem label="主机组" prop="group">
          <Input v-model="editFormData.group"></Input>
        </FormItem>
        <FormItem label="主机型号" prop="model">
          <Input v-model="editFormData.model"></Input>
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
        searchForm: {
          username: '',
          userId: ''
        },
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
            title: '操作',
            key: 'handle',
            fixed: 'right',
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
                        content: '确定删除: ' + params.row.name,
                        onOk: () => {
                          this.delete(params.row.id)
                        }
                      })
                    }
                  }
                },
                '删除'
              )

              let showBtn = h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/cmdb/server/detail' })
                    }
                  }
                },
                '查看'
              )

              return h('div', [
                editBtn, deleteBtn, showBtn
              ])
            }
          }
        ],
        tableData: [],
        editModalFlag: false,
        editFormData: {}
      }
    },
    methods: {
      // 获取主机信息
      getUserList () {
        axios('GET',
          api.system.user.list,
          {},
          (data) => {
            this.tableData = data
          })
      },
      handleReset(name){
        this.$refs[name].resetFields()
      },
      // 翻页
      changePage (current) {
        this.page.current = current
        this.getUserList()
      },
      // 切换分页
      handlePageSize (value) {
        this.page.pageSize = value
        this.getUserList()
      },
      showEditModal (row) {
        this.editFormData = row
        this.editModalFlag = true
      },
      saveEditData () {

      },
      delete (id) {
      }

    },
    watch: {
      searchForm: {
        handler: function(newValue, oldValue){
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

</style>
