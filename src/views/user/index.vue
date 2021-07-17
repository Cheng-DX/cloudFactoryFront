<template>

  <div class="app-container">
    <!--    <div>-->
    <!--      <el-steps :active="1">-->
    <!--        <el-step title="步骤 1"></el-step>-->
    <!--        <el-step title="步骤 2"></el-step>-->
    <!--        <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>-->
    <!--      </el-steps>-->
    <!--    </div>-->
    <el-col span=3>
      <el-button type="success" icon="el-icon-plus" redio @click="dialogFormVisibleOfAdd = true">添加用户</el-button>
    </el-col>
    <el-col span=6>
      <el-input v-model="searchInfo" placeholder="搜索" class="input-with-select" prefix-icon="el-icon-search" />
    </el-col>
    <el-col span=2>
      <el-button icon="el-icon-search" redio type="primary" @click="searchUser" />
    </el-col>
    <el-col span=3 v-if="!isAllUser" >
      <el-button  icon="el-icon-refresh-right" redio type="warning" @click="fetchData">显示全部</el-button>
    </el-col>

    <el-table
      :data="userList"
      border
      style="width: 100%"
      height="620px"
      fit
      highlight-current-row
    >
      <el-table-column
        prop="userId"
        label="用户ID"
        align = "center"
        sortable
      />
      <el-table-column
        prop="account"
        label="账号"
        align = "center"
      />
      <el-table-column
        prop="password"
        label="密码"
        align = "center"
      />
      <el-table-column prop="type" label="用户类型" sortable align="center">
        <template scope="scope">
          <el-tag v-if="scope.row.type === 0" type="success"> 超级管理员 </el-tag>
          <el-tag v-if="scope.row.type === 1" type=""> 云工厂管理员 </el-tag>
          <el-tag v-if="scope.row.type === 2" type="danger">  经销商 </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名称"
        align = "center"
      />
      <el-table-column
        prop="phoneNumber"
        label="电话号码"
        align = "center"
      />
      <el-table-column
        prop="information"
        label="简介"
        align = "center"
      />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编 辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteFun(scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisibleOfAdd">
      <el-form ref="form" :model="addForm" label-width="150px">
        <el-form-item label="用户ID">
          <el-input v-model="addForm.userId" />
        </el-form-item>

        <el-form-item label="账户类型">
          <el-input v-model="addForm.type" contenteditable="false" />
        </el-form-item>

        <el-form-item label="账号">
          <el-input v-model="addForm.account" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="addForm.password" placeholder="输入密码" style="width: 100%;" />
        </el-form-item>

        <el-form-item label="再次输入密码">
          <el-input v-model="addForm.passwordConfirm" placeholder="再次输入密码" style="width: 100%;" />
        </el-form-item>

        <el-form-item label="电话号码">
          <el-input v-model="addForm.phoneNumber" />
        </el-form-item>

        <el-form-item label="简介">
          <el-input v-model="addForm.information" type="area" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addUser">确定</el-button>
          <el-button @click="dialogFormVisibleOfAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="editForm" label-width="150px">
        <el-form-item label="用户ID">
          <el-input v-model="editForm.userId" />
        </el-form-item>

        <el-form-item label="账户类型">
          <el-input v-model="editForm.type" contenteditable="false" />
        </el-form-item>

        <el-form-item label="账号">
          <el-input v-model="editForm.account" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="editForm.password" placeholder="输入密码" style="width: 100%;" />
        </el-form-item>

        <el-form-item label="再次输入密码">
          <el-input v-model="editForm.passwordConfirm" placeholder="再次输入密码" style="width: 100%;" />
        </el-form-item>

        <el-form-item label="电话号码">
          <el-input v-model="editForm.phoneNumber" />
        </el-form-item>

        <el-form-item label="简介">
          <el-input v-model="editForm.information" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateUser">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      userList: [{
        userId: null,
        account: null,
        type: null,
        password: null,
        name: null,
        phoneNumber: null,
        information: null
      }],
      deleteInfo: {
        result: null
      },
      editForm: {
        userId: null,
        account: null,
        password: null,
        passwordConfirm: null,
        type: null,
        name: null,
        phoneNumber: null,
        information: null
      },
      addForm: {
        userId: null,
        account: null,
        password: null,
        passwordConfirm: null,
        type: null,
        name: null,
        phoneNumber: null,
        information: null
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, message: '不得小于3个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        passwordConfirm: [
          { required: true, message: '请再次输入密码', trigger: 'change' }
        ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'change' }
        ],
        information: [
          { trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      dialogFormVisibleOfAdd: false,
      searchInfo: null,
      searchByWhat: '',
      isAllUser: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      axios.get('/user/userList').then(response => {
        this.userList = response.data
        this.listLoading = false
        this.isAllUser = true
      })
    },
    handleEdit(row) {
      this.editForm = {
        userId: row.userId,
        account: row.account,
        name: row.name,
        password: row.password,
        passwordConfirm: row.password,
        type: row.type,
        phoneNumber: row.phoneNumber,
        information: row.information
      }
      this.dialogFormVisible = true
    },
    updateUser() {
      this.dialogFormVisible = false
      this.$axios({
        method: 'post',
        url: 'user/updateUser',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          userId: this.editForm.userId,
          account: this.editForm.account,
          password: this.editForm.password,
          type: this.editForm.type,
          name: this.editForm.name,
          phoneNumber: this.editForm.phoneNumber,
          information: this.editForm.information
        }
      }).then(res => {
        console.log(res)
      })
    },
    addUser() {
      this.dialogFormVisibleOfAdd = false
      this.$axios({
        method: 'post',
        url: 'user/addUser',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          userId: this.addForm.userId,
          account: this.addForm.account,
          password: this.addForm.password,
          type: this.addForm.type,
          name: this.addForm.name,
          phoneNumber: this.addForm.phoneNumber,
          information: this.addForm.information
        }
      }).then(res => {
        this.fetchData()
        this.$message({ type: 'success', message: '添加成功!' })
      })
    },
    deleteFun(row) {
      axios.get('user/deleteById?id=' + row.userId)
        .then(res => {
          this.fetchData()
          if (res.data.result === 1) {
            this.$message({ type: 'success', message: '删除成功!' })
          } else {
            this.$message({ type: 'error', message: res.data.message })
          }
        })
    },
    searchUser() {
      axios.get('user/searchUser?data=' + this.searchInfo)
        .then(res => {
          this.userList = res.data
          this.isAllUser = false
        })
    }
  }
}
</script>
