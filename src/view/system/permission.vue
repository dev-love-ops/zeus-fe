<template>
  <div>

    <Card>

      <Form class="search-form" ref="searchForm" :model="searchForm" inline :label-width="80">
        <FormItem prop="name" label="角色名称">
          <Input v-model="searchForm.roleName" />
        </FormItem>
        <FormItem >
          <Button type="primary" @click="getRoleList" style="margin-right: 10px">搜索</Button>
          <Button type="success" @click="showAddModal">添加角色</Button>
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

    <Modal v-model="addModalFlag" title="新增角色" @on-ok="saveAddData" style="text-align: center">
      <Form ref="addModalRef" :model="addFormData" :label-width="80">
        <FormItem label="角色ID" prop="roleId">
          <Input v-model="addFormData.roleId"></Input>
        </FormItem>
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="addFormData.roleName"></Input>
        </FormItem>
        <FormItem label="角色描述" prop="description">
          <Input v-model="addFormData.description"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="editModalFlag" title="编辑角色" @on-ok="saveEditData" style="text-align: center">
      <Form ref="editModalRef" :model="editFormData" :label-width="80">
        <FormItem label="权限名称" prop="name">
          <Input v-model="editFormData.name" disabled></Input>
        </FormItem>
        <FormItem label="权限描述" prop="description">
          <Input v-model="editFormData.description"></Input>
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
          roleName: '',

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
            title: '角色ID',
            key: 'roleId',
            align: 'center'

          },
          {
            title: '角色名称',
            key: 'roleName',
            align: 'center'

          },
          {
            title: '角色描述',
            key: 'description',
            align: 'center'

          },
          {
            title: '创建时间',
            key: 'createTime',
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
                        content: '确定删除: ' + params.row.roleName,
                        onOk: () => {
                          this.delete(params.row.roleId)
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
      getRoleList () {
        axios('GET',
          api.system.role.role,
          Object.assign({pageSize: this.page.pageSize, pageNo: this.page.current}, this.searchForm),
          (data) => {
            this.tableData = data.list
            this.page.total = data.total
          })
      },
      // 翻页相关方法
      changePage (current) {
        this.page.current = current
        this.getRoleList()
      },
      // 切换分页
      handlePageSize (value) {
        this.page.pageSize = value
        this.getRoleList()
      },
      //新增用户
      showAddModal () {
        this.addModalFlag = true
      },
      saveAddData () {
        axios('POST',
          api.system.role.role,
          this.addFormData,
          (data) => {
            this.getRoleList()
          })
      },
      //编辑用户
      showEditModal (row) {
        this.editFormData = row
        this.editModalFlag = true
      },
      saveEditData () {
        axios('PUT',
          api.system.role.role,
          this.editFormData,
          (data) => {
            this.getRoleList()
          })
      },
      delete (name) {

        axios('DELETE',
          api.system.role.role,
          {roleId: name},
          (data) => {
            this.getRoleList()
          })
      }

    },
    watch: {
      searchForm: {
        handler: function(newValue, oldValue){
          this.page.current = 1
          this.getRoleList()
        },
        // 跟踪字典的变化, 不管有多深都会触发
        deep: true
      }
    },
    mounted () {
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
