<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/hmoe' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="saveChangeEvent(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改角色" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="danger"
                icon="el-icon-share"
                size="mini" @click="updateUserRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetFrom"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="ruleFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="提示" :visible.sync="updateDialogVisible" width="50%" @close="resetUpdateForm">
      <el-form
        :model="updateForm" 
        :rules="updateFormRules"
        ref="updateFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="updateForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配用户角色的对话框 -->
    <el-dialog title="提示" :visible.sync="showUpdateUser" width="50%" @close="updateUserCloseEvent">
      <div>
        <p>用户名:{{userInfo.username}}</p> 
        <p>角色:{{userInfo.role_name}}</p>
        <p>
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUpdateUser = false">取 消</el-button>
        <el-button type="primary" @click="saveUserRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value) == true) {
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    var checkPhone = (rule, value, cb) => {
      const regPhone =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regPhone.test(value) == true) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        //查询参数
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userlist: [], //用户列表
      total: 0, //用户总数
      addDialogVisible: false,
      updateDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      updateForm:{},//修改用户时暂存数据
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度需要在3-10位之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度需要在6-15位之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      updateFormRules:{
          email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      showUpdateUser:false,
      // 需要被分配角色的用户信息
      userInfo:{},
      roleList:{},
      // 已选中的角色id值
      selectedRoleId:{}
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return res.$message.error("获取用户列表失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async saveChangeEvent(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        this.$message.error("修改状态失败");
      }
      this.$message.success("修改状态成功");
    },
    //点击按钮，添加新用户
    addUser() {
      // 获取整个表单的校验结果，全部合法为valid为true
      this.$refs.ruleFormRef.validate(async (valid) => {
        //如果校验结果为false，则取消请求
        if (!valid) {
          return;
        }
        // 为true则发送请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
      });
      this.addDialogVisible = false;
      this.getUserList();
    },
    // 重置添加用户表单
    resetFrom() {
      this.$refs.ruleFormRef.resetFields();
    },
    // 获取对应id的用户信息
    async showEditDialog(id) {
      const {data:res} = await this.$http.get('users/'+id)//获取对应id的用户信息
      console.log(res);
      if(res.meta.status!==200){
          this.$message.error('获取用户信息失败');
      }
      this.updateForm = res.data
      this.updateDialogVisible = true;
    },
    // 重置修改用户表单
    resetUpdateForm(){
        this.$refs.updateFormRef.resetFields();
    },
    updateUser(){
        this.$refs.updateFormRef.validate(async (valid)=>{
            if(!valid){
                return
            }
          const {data:res} = await this.$http.put('users/'+this.updateForm.id,{
              email:this.updateForm.email,
              mobile:this.updateForm.mobile,
          })
          if(res.meta.status!==200){
              this.$message.error('修改用户信息失败');
          }
          this.getUserList()
          this.updateDialogVisible = false;
          this.$message.success('修改用户信息成功！');
        })
    },
    async deleteUserById(id){
        const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(result !== 'confirm'){
            this.$message.error('取消了删除操作');
        }
           const {data:res} = await this.$http.delete('users/'+id)
           if(res.meta.status!==200){
               return this.$message.error('删除失败')
           }
           this.$message.success('完成了删除操作');
            this.getUserList()
            console.log(id,result);
    },
    async updateUserRole(userInfo){
      // 将需要分配角色的用户信息添加到data当中
      this.userInfo = userInfo

      // 在展示对话框之前，获取所有的角色列表
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('获取角色列表失败！')
      }

      // 将获取的角色列表保存到data中
      this.roleList = res.data
      this.showUpdateUser = true
    },
    async saveUserRole(){
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status!==200){
        return this.$message.error('更新用户角色失败！')
      }
      this.$message.success('更新用户角色成功！')
      this.getUserList()
      this.showUpdateUser = false
    },
    updateUserCloseEvent(){
      this.selectedRoleId = '',
      this.userInfo = {}
    }
  },
};
</script>

<style>
</style>