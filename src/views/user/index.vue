<template>

  <div class="app-container">
    <div>
      <el-col span="3">
        <el-button type="success" icon="el-icon-plus" redio @click="dialogFormVisibleOfAdd = true">添加用户</el-button>
      </el-col>
      <el-col span="8">
        <el-input clearable v-model="searchInfo" placeholder="根据名称进行模糊搜索（剩下的有时间再加吧(ToT)/~~~）" class="input-with-select" prefix-icon="el-icon-search" />
      </el-col>
      <el-col span="2">
        <el-button icon="el-icon-search" redio type="primary" @click="searchUser" />
      </el-col>
      <el-col v-if="!isAllUser" span="3">
        <el-button icon="el-icon-refresh-right" redio type="warning" @click="fetchData">显示全部</el-button>
      </el-col>
    </div>
    <div>
      <br>
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
          align="center"
          sortable
        />
        <el-table-column
          prop="account"
          label="账号"
          align="center"
        />
        <el-table-column
          prop="password"
          label="密码"
          align="center"
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
          align="center"
        />
        <el-table-column
          prop="phoneNumber"
          label="电话号码"
          align="center"
        />
        <el-table-column
          prop="information"
          label="简介"
          align="center"
        />
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编 辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteFun(scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="dialogFormVisibleOfAdd">
        <el-form ref="form" :model="addForm" label-width="150px" onsubmit="addUser()">
          <el-form-item label="账户类型" required>
            <template>
              <el-radio v-model="addForm.type" label="1">云工厂管理员</el-radio>
              <el-radio v-model="addForm.type" label="2">经销商</el-radio>
            </template>
          </el-form-item>

          <el-form-item label="账号" prop="account">
            <el-input v-model="addForm.account" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" placeholder="输入密码" style="width: 100%;" />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <!--        <el-form-item label="再次输入密码">
          <el-input v-model="addForm.passwordConfirm" placeholder="再次输入密码" style="width: 100%;" />
        </el-form-item>-->

          <el-form-item label="电话号码" prop="phoneNumber">
            <el-input v-model="addForm.phoneNumber" />
          </el-form-item>

          <el-form-item label="用户简介" prop="information">
            <el-input v-model="addForm.information" type="textarea" />
          </el-form-item>

          <el-form-item v-if="addForm.type === '1'" label="工厂名" prop="factoryName">
            <el-input v-model="addForm.factoryName" type="text" />
          </el-form-item>

          <el-form-item v-if="addForm.type === '1'" label="工厂简介" prop="factoryInfo">
            <el-input v-model="addForm.factoryInfo" type="textarea" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addUser">确定</el-button>
            <el-button @click="dialogFormVisibleOfAdd = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="editForm" label-width="150px" :rules="editFormRules" size="mini">
          <el-form-item label="用户ID">
            <el-input v-model="editForm.userId" disabled />
          </el-form-item>

          <el-form-item label="账号" prop="account" required>
            <el-input v-model="editForm.account" />
          </el-form-item>

          <el-form-item label="姓名" prop="name" required>
            <el-input v-model="editForm.name" />
          </el-form-item>

          <el-form-item label="密码" prop="password" required>
            <el-input v-model="editForm.password" placeholder="输入密码" style="width: 100%;" />
          </el-form-item>

          <!--        <el-form-item label="再次输入密码" prop="passwordConfirm">
          <el-input v-model="editForm.passwordConfirm" placeholder="再次输入密码" style="width: 100%;" />
        </el-form-item>-->

          <el-form-item label="电话号码" prop="phoneNumber" required>
            <el-input v-model="editForm.phoneNumber" />
          </el-form-item>

          <el-form-item label="简介" prop="information">
            <el-input v-model="editForm.information" type="textarea" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateUser">确定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
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
        type: null,
        passwordConfirm: null,
        name: null,
        phoneNumber: null,
        information: null
      },
      addForm: {
        account: null,
        password: null,
        passwordConfirm: null,
        type: null,
        name: null,
        phoneNumber: null,
        information: null,
        factoryName: null,
        factoryInfo: null
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, message: '不得小于3个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ],
        /*        passwordConfirm: [
          { required: true, message: '请再次输入密码', trigger: 'change' }
        ],*/
        phoneNumber: [
          { required: true, message: '请输入电话号码' }
        ],
        information: [
          { trigger: 'change' }
        ],
        factoryName: [
          { required: true, message: '请输入工厂名' }
        ],
        factoryInfo: [
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
    clear() {
      this.addForm = {
        userId: null,
        account: null,
        name: null,
        password: null,
        passwordConfirm: null,
        type: null,
        phoneNumber: null,
        information: null,
        factoryName: null,
        factoryInfo: null
      }
    },
    updateUser() {
      axios.get('user/updateUser?' +
          'userId=' + this.editForm.userId + '&' +
          'account=' + this.editForm.account + '&' +
          'type=' + this.editForm.type + '&' +
          'password=' + this.editForm.password + '&' +
          'name=' + this.editForm.name + '&' +
          'phoneNumber=' + this.editForm.phoneNumber + '&' +
          'information=' + this.editForm.information
      ).then(res => {
        this.dialogFormVisible = false
        this.fetchData()
        this.$message({ type: 'success', message: '修改成功！' })
      })
    },
    addUser() {
      this.dialogFormVisibleOfAdd = false
      axios.get('user/addUser?' +
          'account=' + this.addForm.account + '&' +
          'password=' + this.addForm.password + '&' +
          'type=' + this.addForm.type + '&' +
          'name=' + this.addForm.name + '&' +
          'phoneNumber=' + this.addForm.phoneNumber + '&' +
          'information=' + this.addForm.information + '&' +
          'factoryName=' + this.addForm.factoryName + '&' +
          'factoryInfo=' + this.addForm.factoryInfo
      ).then(res => {
        this.fetchData()
        this.$message({ type: 'success', message: '添加成功！' })
        this.clear()
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
