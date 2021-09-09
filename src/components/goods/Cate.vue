<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/hmoe' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-success" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="option">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分类区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <el-form
          ref="addCateFormRef"
          :model="addCateForm"
          :rules="addCateFormRules"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- :options 用来指定数据源 -->
            <!-- :props 用来指定配置对象 -->
            <el-cascader
              v-model="selectKeys"
              :options="parentsCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      addCateDialogVisible: false,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示将当前列定义为模板
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示将当前列定义为模板
          type: "template",
          //表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示将当前列定义为模板
          type: "template",
          //表示当前这一列使用模板名称
          template: "option",
        },
      ],
      //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: "",
        //   父级分类的ID
        cat_pid: 0,
        //   分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      //   添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //获取父级分类的数据列表
      parentsCateList: [],
      //   指定级联选择器的配置对象
      cascaderProps: {
        //选中值的属性
        value: "cat_id",
        //显示给用户的值
        label: "cat_name",
        //嵌套的属性
        children: "children",
        expandTrigger: "hover",
      },
      //   选中的父级分类的id数组
      selectKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！");
      }
      console.log(res.data);
      // 把数据列表，赋值给catelist
      this.catelist = res.data.result;
      // 为总数据条数赋值
      this.total = res.data.total;
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      this.getParentList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！");
      }
      this.parentsCateList = res.data;
      console.log(res.data);
    },
    // 选择项发生变化时触发函数
    parentCateChanged() {
      console.log(this.selectKeys);
      //   如果selectKeys数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];

        //    为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length;
        return;
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0;

        //    为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      console.log(this.addCateForm);
        this.$refs.addCateFormRef.validate(async valid=>{
            console.log(valid);
            if(!valid) return
            const {data:res} = await this.$http.post('categories',this.addCateForm)
            if (res.meta.status !== 201) {
                return this.$message.error("添加分类失败！");
            }
        this.$message.success("添加分类成功！");
        this.getCateList()
        this.addCateDialogVisible = false
        })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectKeys = [];
    },
  },
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>