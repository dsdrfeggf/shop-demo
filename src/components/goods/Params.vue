<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/hmoe' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addCateDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i" closable @close="handleClose(i,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editCateData(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteCateData(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addCateData"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index" closable @close="handleClose(i,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editCateData(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteCateData(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeForm"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateData">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCloseForm"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCateData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      catelist: [],
      // 级联选择库的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择框双向绑定到的数组
      selectedCateKeys: [],
      //被激活页签的名称，会根据用户的点击而改变
      activeName: "many",
      //   动态属性的数据
      manyTableData: [],
      //   静态属性的数据
      onlyTableData: [],
      //   控制添加对话框的显示与隐藏
      addCateDialogVisible: false,
      //   控制修改对话框的显示与隐藏
      editCateDialogVisible: false,
      //   添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      //   添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      //   修改的表单数据对象
      editForm: {},
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
    },
    //级联选择框选中项变化，会触发这个函数
    async handleChange() {
      //如果数组长度不等于3，则证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        //清空数组
        this.selectedCateKeys = [];
        // 当不是三级分类时，将表格数据也进行清空
        this.manyTableData = []
        this.onlyTableData = []
        return;
      }

      // 如果数组长度等于3，则选中的是三级分类
      console.log(this.selectedCateKeys);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取属性失败");
      }

      //   在赋值到表格数据之前先将tag信息变为数组并循环遍历出来
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

        // 在数组中添加相关属性，让每一个添加tag都是独特的，避免所有tag联动
        item.inputVisible = false
        item.inputValue = ''
      });
      console.log(res.data);
      //判断用户点击的是动态参数还是静态参数，并显示相对应的数据
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //tab页签的点击事件处理函数
    handleTabClick() {
      this.handleChange();
    },
    // 重置表单
    closeForm() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加数据
    addCateData() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.addCateDialogVisible = false;
        this.getCateList();
      });
    },
    // 编辑属性
    async editCateData(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取属性失败");
      }
      this.editForm = res.data;
      this.editCateDialogVisible = true;
    },
    editCloseForm() {
      this.$refs.editFormRef.resetFields();
    },
    updateCateData() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取属性失败");
        }
        this.$message.success("修改成功！");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },
    deleteCloseForm() {
      this.$refs.deleteFormRef.resetFields();
    },
    async deleteCateData(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功！");
      this.getCateList();
    },
    //文本框失去焦点或按下回车键都会触发
    async handleInputConfirm(row){
      // 如果用户输入的文本去掉空格后长度为0，则输入的文本不合法
      if(row.inputValue.trim().length === 0){
        // 清空用户输入的文本，关闭输入框并直接return，不做任何处理
        row.inputValue = ''
        row.inputVisible = false
        return 
      }
      // 否则用户输入的文本为合法的，需要进行处理
      row.attr_vals.push(row.inputValue.trim())
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })


      if (res.meta.status !== 200) {
          return this.$message.error("添加标签失败");
        }
        this.$message.success("添加标签成功！");
        this.getCateList();
        row.inputValue=''
        row.inputVisible = false
    },
    showInput(row){
      row.inputVisible = true
      // $nextTick 方法的作用，当页面上的元素被重新渲染之后，才会执行指定的回调函数
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除对应的参数可选项
    async handleClose(i,row){
      console.log(123);
      row.attr_vals.splice(i,1)
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })


      if (res.meta.status !== 200) {
          return this.$message.error("删除标签失败");
        }
        this.$message.success("删除标签成功！");
        this.getCateList();
    }
  },
  computed: {
    //如果按钮需要被禁用，则返回true,否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      } else {
        return;
      }
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin: 5px;
}
.el-input{
  width: 120px;
}
</style>