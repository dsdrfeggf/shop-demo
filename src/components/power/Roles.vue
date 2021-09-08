<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hmoe' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="getRoleList">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['border-bottom', i1 === 0 ? 'border-top' : '', 'center']"
              v-for="(item1, i1) in scope.row.children"
              :key="i1"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRightById(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'border-top', 'center']"
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="warning"
                      @close="deleteRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      closable
                      @close="deleteRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="setUserRole(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="showSetUserRole" width="50%" @close="resetDiglog">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox node-key="id"
      default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetUserRole = false">取 消</el-button>
        <el-button type="primary" @click="updateUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: {},
      showSetUserRole: false,
      rightsList: [],
      //   树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys:[],
      //当前即将分配权限的角色id
      roleid:''
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {

    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取信息失败");
      }
      this.roleList = res.data;
    },

    async deleteRightById(role, rightid) {
      const result = await this.$confirm(
        "此操作将永久删除用户的该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.info("取消了删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      );

      role.children = res.data;
    },

    async setUserRole(role) {
      this.roleid = role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限信息失败！");
      }
      this.rightsList = res.data;
    //   递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)
      this.showSetUserRole = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node,arr){
        // 如果当前node节点不包含children属性，则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        
            console.log(node);
        node.children.forEach(item => {
            this.getLeafKeys(item,arr)
        });
    },
    // 关闭对话框时清空用户的权限数组
    resetDiglog(){
        this.defKeys=[]
    },
    // 更新用户权限
    async updateUserRole(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),

      ]

      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleid}/rights`,{rids:idStr})
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.showSetUserRole = false
    }
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>