<template>
  <div class="app-container">
    <el-col span="6">
      <el-input v-model="searchInfo" placeholder="搜索" class="input-with-select" prefix-icon="el-icon-search" />
    </el-col>
    <el-col span="2">
      <el-button icon="el-icon-search" redio type="primary" @click="searchFactory" />
    </el-col>
    <el-col v-if="!isAllFactory" span="3">
      <el-button icon="el-icon-refresh-right" redio type="warning" @click="fetchData">显示全部</el-button>
    </el-col>

    <el-table
      :data="factoryList"
      border
      style="width: 100%"
      height="620px"
      fit
      highlight-current-row
    >
      <el-table-column
        prop="factoryId"
        label="工厂ID"
        align="center"
        sortable
      />
      <el-table-column
        prop="factoryName"
        label="工厂名称"
        align="center"
      />
      <el-table-column
        prop="information"
        label="工厂简介"
        align="center"
      />
      <el-table-column
        prop="ownerName"
        label="负责人"
      />
      <el-table-column
        prop="phoneNumber"
        label="联系方式"
      />
      <el-table-column
        prop="account"
        label="登陆账号"
      />
      <el-table-column prop="type" label="工厂状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success"> 正常 </el-tag>
          <el-tag v-if="scope.row.status === 1" type="warning"> 关停 </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-s-tools" @click="handleEdit(scope.row)">编 辑</el-button>
          <el-button v-if="scope.row.status === 1" type="success" icon="el-icon-success" @click="switchStatus(scope.row)">开 启</el-button>
          <el-button v-if="scope.row.status === 0" type="danger" icon="el-icon-error" @click="switchStatus(scope.row)">关 停</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="editForm" label-width="150px">
        <el-form-item label="工厂ID">
          <el-input v-model="editForm.factoryId" />
        </el-form-item>

        <el-form-item label="工厂名">
          <el-input v-model="editForm.factoryName" contenteditable="false" />
        </el-form-item>

        <el-form-item label="简介">
          <el-input v-model="editForm.information" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateFactory">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {

  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      factoryList: [{
        factoryId: null,
        factoryName: null,
        information: null,
        ownerName: null,
        phoneNumber: null,
        account: null,
        status: null
      }],
      deleteInfo: {
        result: null
      },
      editForm: {
        factoryId: null,
        factoryName: null,
        information: null,
        phoneNumber: null
      },
      dialogFormVisible: false,
      searchInfo: null,
      searchByWhat: '',
      isAllFactory: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    fetchData() {
      this.listLoading = true
      axios.get('/factory/factoryList').then(response => {
        this.factoryList = response.data
        this.listLoading = false
        this.isAllFactory = true
      })
    },
    handleEdit(row) {
      this.editForm = {
        factoryId: row.factoryId,
        factoryName: row.factoryName,
        information: row.information,
        phoneNumber: row.phoneNumber
      }
      this.dialogFormVisible = true
    },
    updateFactory() {
      this.dialogFormVisible = false
    },
    switchStatus(row) {
      if (row.status === 1) {
        row.status = 0
      } else {
        row.status = 1
      }
      axios.get('/factory/switchStatus?id=' + row.factoryId).then(response => {
        this.fetchData()
      })
    },
    searchFactory() {
      axios.get('/factory/searchFactory?data=' + this.searchInfo)
        .then(res => {
          this.factoryList = res.data
          this.isAllFactory = false
        })
    }

  }
}
</script>

