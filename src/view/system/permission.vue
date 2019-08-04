<template>
  <div class="search">
    <Card>
      <Row class="operation">

        <Tooltip content="添加子菜单或者按钮权限" placement="right-end">
          <Button @click="showAddMenuModal" type="primary" icon="md-add" class="btn-class">添加子节点</Button>
        </Tooltip>
        <Button @click="showAddRootMenuModal" icon="md-add" class="btn-class">添加一级菜单</Button>
        <Button @click="batchDelete" icon="md-trash" class="btn-class">批量删除</Button>
        <Dropdown @on-click="handleDropdown">
          <Button class="btn-class">
            更多操作
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新</DropdownItem>
            <DropdownItem name="expandOne">收合所有</DropdownItem>
            <DropdownItem name="expandTwo">仅展开一级</DropdownItem>
            <DropdownItem name="expandThree">仅展开两级</DropdownItem>
            <DropdownItem name="expandAll">展开所有</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <i-switch v-model="strict" size="large" style="margin-left:5px">
          <span slot="open">级联</span>
          <span slot="close">单选</span>
        </i-switch>
      </Row>
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="6">
          <Alert show-icon>
            当前选择编辑：
            <span class="select-title">{{menuForm.title}}</span>
            <a class="select-clear" v-if="menuForm.id" @click="cancelEdit">取消选择</a>
          </Alert>
          <Input v-model="searchKey" suffix="ios-search" @on-change="search" placeholder="输入菜单名搜索" clearable/>
          <div class="tree-bar" :style="{maxHeight: maxHeight}">
            <Tree ref="tree" :data="treeData" show-checkbox :render="renderContent" @on-check-change="changeSelect" :check-strictly="!strict"></Tree>
          </div>
          <Spin size="large" fix v-if="loading"></Spin>
        </Col>
        <Col span="9" style="margin-left:10px">
          <Form ref="menuForm" :model="menuForm" :label-width="100" :rules="menuFormValidate">
            <FormItem label="类型" prop="type">
              <div v-show="menuForm.type==0">
                <Icon type="ios-list-box-outline" size="16" style="margin:0 5px 3px 0;"></Icon>
                <span>菜单</span>
              </div>
              <div v-show="menuForm.type==1">
                <Icon type="md-radio-button-on" size="16" style="margin:0 5px 3px 0;"></Icon>
                <span>权限</span>
              </div>
            </FormItem>
            <FormItem label="名称" prop="title">
              <Input v-model="menuForm.title" placeholder="菜单显示的名称"/>
            </FormItem>
            <FormItem label="路由英文名" prop="name" v-if="menuForm.type==0">
                  <Input v-model="menuForm.name" placeholder="前端Router中的name属性, 需要唯一"/>
            </FormItem>
            <FormItem label="权限标识" prop="name" v-if="menuForm.type==1">
              <Input v-model="menuForm.name" placeholder="权限表示, 需要唯一"/>
            </FormItem>
            <FormItem label="路径" prop="path" v-if="menuForm.type==0">
              <Input v-model="menuForm.path" placeholder="菜单对应的请求路径(完整路径需要加上父级路径)"/>
            </FormItem>
            <FormItem label="图标" prop="icon" v-if="menuForm.type==-1||menuForm.type==0">
              <Input v-model="menuForm.icon"></Input>
            </FormItem>
            <FormItem label="前端组件" prop="component" v-if="menuForm.type==0">
              <Input v-model="menuForm.component"/>
            </FormItem>
            <FormItem label="描述" prop="description">
              <Input v-model="menuForm.description"/>
            </FormItem>
            <Form-item>
              <Button @click="submitEdit" :loading="submitLoading" type="primary" icon="ios-create-outline">保存</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <Modal draggable :title="modalTitle" v-model="menuModalVisible" :mask-closable="false" :width="500" style="text-align: center">

      <Form ref="menuFormAdd" :model="menuFormAdd" :label-width="100" :rules="menuFormValidate">
        <FormItem label="上级节点:" v-if="showParent" style="text-align: left">
          <div>
            <span>{{parentTitle}}</span>
          </div>
        </FormItem>
        <FormItem label="类型" prop="type" style="text-align: left">
          <div v-show="menuFormAdd.type===0">
            <Icon type="ios-list-box-outline" size="16" style="margin:0 5px 3px 0;"></Icon>
            <span>菜单</span>
          </div>
          <div v-show="menuFormAdd.type===1">
            <Icon type="md-radio-button-on" size="16" style="margin:0 5px 3px 0;"></Icon>
            <span>操作按钮</span>
          </div>
        </FormItem>
        <FormItem label="名称" prop="title" v-if="menuFormAdd.type===0">
          <Input v-model="menuFormAdd.title" placeholder="菜单显示的名称, 比如: 用户管理"/>
        </FormItem>
        <FormItem label="名称" prop="title" v-if="menuFormAdd.type===1">
          <Tooltip placement="right" content="操作按钮名称不得重复">
            <Input v-model="menuFormAdd.title" style="width:368px"/>
          </Tooltip>
        </FormItem>
        <FormItem label="路径" prop="path" v-if="menuFormAdd.type===0">
          <Input v-model="menuFormAdd.path" placeholder="菜单对应的请求路径(完整路径需要加上父级路径)"/>
        </FormItem>
        <FormItem label="路由英文名" prop="name" v-if="menuFormAdd.type===0">
          <Tooltip placement="right" content="需唯一">
            <Input v-model="menuFormAdd.name" style="width:368px"/>
          </Tooltip>
        </FormItem>
        <FormItem label="权限英文名" prop="name" v-if="menuFormAdd.type===1">
          <Tooltip placement="right" content="冒号分割的小写字母">
            <Input v-model="menuFormAdd.name" style="width:368px"/>
          </Tooltip>
        </FormItem>
        <FormItem label="图标" prop="icon" v-if="menuFormAdd.type===0">
          <Input v-model="menuFormAdd.icon"></Input>
        </FormItem>
        <FormItem label="前端组件" prop="component" v-if="menuFormAdd.type==0">
          <Input v-model="menuFormAdd.component"/>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="menuFormAdd.description"/>
        </FormItem>

      </Form>

      <div slot="footer" style="text-align: center">
        <Button type="text" @click="cancelAdd">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
      </div>

    </Modal>
  </div>
</template>


<script>
  import axios from '@/libs/axios_new'
  import api from '@/api/index'

  export default {

    data () {
      return {
        loading: false,
        strict: true,
        maxHeight: "500px",
        expandLevel: 1,
        menuModalVisible: false,
        iconModalVisible: false,
        selectList: [],
        selectCount: 0,
        showParent: false,
        searchKey: "",
        parentTitle: "",
        editTitle: "",
        modalTitle: "",
        menuForm: {
          id: "",
          title: "",
          name: "",
          icon: "",
          path: "",
          component: "",
          parentId: "",
          buttonType: "",
          type: 0,
          sortOrder: 0,
          level: null,
        },
        menuFormAdd: {},
        menuFormValidate: {
          title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
          name: [
            { type: 'string', pattern: /^[a-z:]+$/, required: true, message: "路由英文名不能为空, 并且为冒号分割的小写字母", trigger: "blur" }
          ],
          icon: [{ required: true, message: "图标不能为空", trigger: "click" }],
          path: [{ required: true, message: "路径不能为空", trigger: "blur" }],
          component: [
            { required: true, message: "前端组件不能为空", trigger: "blur" }
          ]
        },
        submitLoading: false,
        treeData: [],
        dictPermissions: []
      }
    },
    methods: {
      renderContent(h, { root, node, data }) {
        let icon = "";
        if (data.level == 0) {
          icon = "ios-navigate";
        } else if (data.level == 1) {
          icon = "md-list-box";
        } else if (data.level == 2) {
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
                this.selectTree(data);
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
              h(
                "span",
                {
                  class: {
                    "ivu-tree-title": true,
                    "ivu-tree-title-selected": data.id == this.menuForm.id
                  }
                },
                data.title
              )
            ])
          ]
        );
      },
      handleDropdown(name) {
        if (name == "expandOne") {
          this.expandLevel = 1;
          this.getAllList();
        } else if (name == "expandTwo") {
          this.expandLevel = 2;
          this.getAllList();
        } else if (name == "expandThree") {
          this.expandLevel = 3;
          this.getAllList();
        }
        if (name == "expandAll") {
          this.expandLevel = 4;
          this.getAllList();
        } else if (name == "refresh") {
          this.getAllList();
        }
      },
      getAllPermission() {
        axios('GET',
          api.system.permission.all,
          {},
          (data) => {
              this.treeData = data
          })
      },
      //选中节点事件, 前面打钩, 可以级联或者单选
      changeSelect(selectedArray, selectedItem) {
        this.selectCount = selectedArray.length;
        this.selectList = selectedArray;
      },
      search() {
        if (this.searchKey) {
          this.loading = true;
          searchPermission({ title: this.searchKey }).then(res => {
            this.loading = false;
            if (res.success) {
              this.data = res.result;
            }
          });
        } else {
          this.getAllList();
        }
      },
      //点击节点事件
      selectTree(v) {
        if (v && v.id != this.menuForm.id) {
          //这里采用了深拷贝, 如果直接赋值的话, 当点击已经选中的节点的时候, 这个节点会消失, 不知道为啥.
          this.menuForm = JSON.parse(JSON.stringify(v))
        } else {
          this.cancelEdit();
        }
      },
      cancelEdit() {
        let data = this.$refs.tree.getSelectedNodes()[0];
        if (data) {
          data.selected = false;
        }
        this.$refs.menuForm.resetFields();
        this.menuForm.id = "";
        delete this.menuForm.id;
      },
      cancelAdd() {
        this.menuModalVisible = false;
      },
      submitEdit() {
        this.$refs.menuForm.validate(valid => {
          if (valid) {
            if (!this.menuForm.id) {
              this.$Message.warning("请先点击选择要修改的菜单节点");
              return;
            }
            this.submitLoading = true;
            axios('PUT',
              api.system.permission.permission,
              this.menuForm,
              (data) => {
                this.submitLoading = false
                this.getAllPermission()
                this.cancelEdit();
                this.$Message.success('修改成功')
              })
          }
        });
      },
      submitAdd() {
        this.$refs.menuFormAdd.validate(valid => {
          if (valid) {
            this.submitLoading = true;
            if (this.menuFormAdd.type == 1) {
              this.menuFormAdd.icon = "";
              this.menuFormAdd.component = "";
            }

            axios('POST',
              api.system.permission.permission,
              this.menuFormAdd,
              (data) => {
                this.getAllPermission()
                this.submitLoading = false
                this.menuModalVisible = false
                this.$Message.success('添加成功')
                this.getAllPermission()
              })

          }
        });
      },
      showAddMenuModal() {
        if (this.menuForm.id == "" || this.menuForm.id == null) {
          this.$Message.warning("请先点击选择一个菜单权限节点");
          return;
        }
        this.parentTitle = this.menuForm.title;
        this.modalTitle = "添加子节点";
        this.showParent = true;
        let type = 0;
        if (this.menuForm.level === 1) {
          type = 1;
        } else if (this.menuForm.level === 2) {
          this.$Modal.warning({
            title: "抱歉，不能添加啦",
            content: "仅支持2级菜单目录"
          });
          return;
        }
        let component = "";
        this.menuFormAdd = {
          icon: "",
          type: type,
          parentId: this.menuForm.id,
          level: Number(this.menuForm.level) + 1,
        };
        this.menuModalVisible = true;
      },
      showAddRootMenuModal() {
        this.modalTitle = "添加一级菜单";
        this.showParent = false;

        this.menuFormAdd = {
          icon: "",
          type: 0,
          level: 0,
          component: 'Main'
        };

        this.menuModalVisible = true;
      },
      batchDelete() {
        if (this.selectCount <= 0) {
          this.$Message.warning("您还未勾选要删除的数据");
          return;
        }
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
          onOk: () => {
            let ids = [];
            this.selectList.forEach(function(e) {
              ids.push(e.id)
            });

            axios('DELETE',
              api.system.permission.permission,
              ids,
              (data) => {
                this.$Message.success("删除成功");
                this.getAllPermission()
              })
          }
        });
      }

    },
    watch: {
    },
    mounted () {
      this.getAllPermission()
    }
  }
</script>


<style lang="less" scoped>
  .search {
    .operation {
      margin-bottom: 2vh;
    }
    .select-count {
      font-size: 13px;
      font-weight: 600;
      color: #40a9ff;
    }
    .select-title {
      font-size: 12px;
      font-weight: 600;
      color: #40a9ff;
    }
    .select-clear {
      margin-left: 10px;
    }
    .page {
      margin-top: 2vh;
    }
    .drop-down {
      font-size: 13px;
      margin-left: 5px;
    }
  }

  .btn-class {
    margin-right: 5px;
  }

  .ivu-tree {
    .ivu-tree-empty {
      margin-top: 10px;
    }
  }

  .tree-bar {
    overflow: auto;
    margin-top: 5px;
  }

  .tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
  }
</style>
