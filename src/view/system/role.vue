<template>
  <div>

    <Card>

      <Form class="search-form" ref="searchForm" :model="searchForm" inline :label-width="80">
        <FormItem prop="name" label="角色名称">
          <Input v-model="searchForm.roleName" />
        </FormItem>
        <FormItem >
          <Button type="primary" @click="getRoleList" style="margin-right: 10px">查询</Button>
          <Button type="success" @click="showAddModal">添加角色</Button>
        </FormItem>
      </Form>

        <Table size="small" ref="selection" border :columns="columns":data="tableData" ></Table>

      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="page.total" :current="page.current" :page-size="page.pageSize" :page-size-opts="page.sizeOpts" show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>

    </Card>

    <Modal v-model="addModalFlag" title="新增角色" @on-ok="saveAddModalData" style="text-align: center">
      <Form ref="addModalRef" :model="addModalData" :rules="validateRules" :label-width="80">
        <FormItem label="角色ID" prop="roleId">
          <Input v-model="addModalData.roleId"></Input>
        </FormItem>
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="addModalData.roleName"></Input>
        </FormItem>
        <FormItem label="角色描述" prop="description">
          <Input v-model="addModalData.description"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelAddModal">取消</Button>
        <Button @click="saveAddModalData" type="info">提交</Button>
      </div>
    </Modal>
    <Modal v-model="editModalFlag" title="编辑角色" @on-ok="saveEditData" style="text-align: center">
      <Form ref="editModalRef" :model="editFormData" :label-width="80">
        <FormItem label="权限名称" prop="name">
          <Input v-model="editFormData.roleId" disabled></Input>
        </FormItem>
        <FormItem label="权限名称" prop="name">
          <Input v-model="editFormData.roleName"></Input>
        </FormItem>
        <FormItem label="权限描述" prop="description">
          <Input v-model="editFormData.description"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 菜单权限 -->
    <Modal :title="editPermData.title" v-model="editPermData.modalFlag" :mask-closable="false" @on-ok="saveEditPermData">
      <Tree  ref="permTree" :data="editPermData.permData" :render="renderContent" show-checkbox multiple :check-strictly="true"></Tree>
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

              let editPermBtn = h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showEditPermModal(params.row)
                    }
                  }
                },
                '权限'
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
                editBtn, editPermBtn, deleteBtn
              ])
            }
          }
        ],
        tableData: [],
        // 增删改查
        addModalFlag: false,
        editModalFlag: false,
        addModalData: {},
        validateRules: {
          roleId: [
            { type: 'string', pattern: /^[A-Z]+$/, required: true, message: '用户ID不能为空, 并且只能使用大写字母', trigger: 'blur' }
          ],
          roleName: [
            {type: 'string', required: true, message: '角色名称不能为空', trigger: 'blur' },
          ]
        },
        editFormData: {},
        //编辑角色权限相关信息
        editPermData: {
          permData: [],
          title: '',
          modalFlag: false,
          currentRoleId: 0,

        }
      }
    },
    methods: {
      // 获取角色列表
      getRoleList () {
        axios('GET',
          api.system.role.role,
          Object.assign({pageSize: this.page.pageSize, pageNo: this.page.current}, this.searchForm),
          (data) => {
            this.tableData = data.list
            this.page.total = data.total
          })
      },
      //获取权限列表
      getAllPermission() {
        axios('GET',
          api.system.permission.all,
          {},
          (data) => {

            this.editPermData.permData = data
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
      //新增角色弹窗
      showAddModal () {
        this.addModalFlag = true
      },
      saveAddModalData () {
        //iview的modal中的form不能实现检验不通过不能点击确定, 所以需要自己实现modal的footer来完成校验
        this.$refs.addModalRef.validate((valid) => {
          if (valid) {
            axios('POST',
              api.system.role.role,
              this.addModalData,
              (data) => {
                this.getRoleList()
              })
          } else {
            this.$Message.error('表单校验失败')
          }
        })

      },
      cancelAddModal(){
        this.addModalFlag = false
      },
      //编辑角色
      showEditModal (row) {
        this.editFormData = row
        this.editModalFlag = true
      },
      saveEditData () {
        axios('PUT',
          api.system.role.role,
          this.editFormData,
          (data) => {
            this.$Message.success('修改成功')
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
      },
      showEditPermModal(row) {
        this.editPermData.currentRoleId = row.id;
        this.editPermData.title = "分配 " + row.roleName + " 的菜单权限";
        // 匹配勾选
        let rolePerms = row.permissions;
        // 递归判断子节点
        this.checkPermTree(this.editPermData.permData, rolePerms);
        this.editPermData.modalFlag = true;
      },
      // 递归判断子节点
      checkPermTree(permData, rolePerms) {
        let that = this;
        permData.forEach(function(p) {
          p.checked = that.hasPerm(p, rolePerms);

          if (p.children && p.children.length > 0) {
            that.checkPermTree(p.children, rolePerms);
          }
        });
      },
      // 判断角色拥有的权限节点勾选
      hasPerm(p, rolePerms) {
        let flag = false;
        for (let i = 0; i < rolePerms.length; i++) {
          if (p.id === rolePerms[i]) {
            flag = true;
            break;
          }
        }
        return flag;

      },
      saveEditPermData () {
        let checkedNodes =  this.$refs.permTree.getCheckedNodes()
        let ids = []
        for (let i = 0; i < checkedNodes.length; i++) {
          ids.push(checkedNodes[i].id)
        }
        axios('PUT',
          api.system.role.permission,
          {id: this.editPermData.currentRoleId, permissions: ids},
          (data) => {
            this.$Message.success('修改成功')
            this.getRoleList()
          })
      },
      renderContent(h, { root, node, data }) {
        let icon = "";
        if (data.level === 0) {
          icon = "ios-navigate";
        } else if (data.level === 1) {
          icon = "md-list-box";
        } else if (data.level === 2) {
          icon = "md-radio-button-on";
        } else {
          icon = "md-radio-button-off";
        }
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              cursor: "pointer"
            },
            on: {
              click: () => {
                data.checked = !data.checked;
              }
            }
          },
          [
            h("span", [
              h("Icon", {
                props: {
                  type: icon,
                  size: "16"
                },
                style: {
                  "margin-right": "8px",
                  "margin-bottom": "3px"
                }
              }),
              h("span", { class: "ivu-tree-title" }, data.title)
            ])
          ]
        );
      },

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
      this.getAllPermission()
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
