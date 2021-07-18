<template>
  <div class="app-container">
    <el-col span="3">
      <el-button type="success" icon="el-icon-plus" redio @click="dialogFormVisibleOfAdd = true">添加类型</el-button>
    </el-col>

    <el-table
      :data="typeList"
      border
      style="width: 100%"
      fit
      highlight-current-row
    >
      <el-table-column
        prop="equipmentTypeId"
        label="设备类型ID"
        align="center"
        width="80px"
      />
      <el-table-column
        prop="name"
        label="设备类型名称"
        align="center"
      />
      <el-table-column label="操作" align="center" min-width="250px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">修 改</el-button>
          <el-button slot="reference" type="danger" icon="el-icon-delete" @click="deleteFun(scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisibleOfAdd">
      <el-form ref="form" :model="addForm" label-width="150px">

        <el-form-item label="设备类型名">
          <el-input v-model="addForm.name" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addType">确定</el-button>
          <el-button @click="dialogFormVisibleOfAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="editForm" label-width="150px">
        <el-form-item label="设备类型ID">
          <el-input v-model="editForm.equipmentTypeId" disabled />
        </el-form-item>

        <el-form-item label="设备类型名">
          <el-input v-model="editForm.name" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateType">确定</el-button>
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
      typeList: [{
        equipmentTypeId: null,
        name: null
      }],
      deleteInfo: {
        result: null
      },
      editForm: {
        equipmentTypeId: null,
        name: null
      },
      addForm: {
        name: null
      },
      dialogFormVisible: false,
      dialogFormVisibleOfAdd: false,
      isAllType: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      axios.get('/equipmentType/equipmentTypeList').then(response => {
        this.typeList = response.data
        this.listLoading = false
        this.isAlltype = true
      })
    },
    handleEdit(row) {
      this.editForm = {
        equipmentTypeId: row.equipmentTypeId,
        name: row.name
      }
      this.dialogFormVisible = true
    },
    updateType() {
      this.dialogFormVisible = false
      axios.get('/equipmentType/updateType?name=' + this.editForm.name + '&id=' + this.editForm.equipmentTypeId)
        .then(res => {
          if (res.data.result === 1) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
          this.fetchData()
        })
    },
    addType() {
      this.dialogFormVisibleOfAdd = false
      axios.get('/equipmentType/addType?name=' + this.addForm.name)
        .then(res => {
          if (res.data.result === 1) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
          this.fetchData()
        })
    },
    deleteFun(row) {
      axios.get('equipmentType/deleteById?id=' + row.equipmentTypeId)
        .then(res => {
          if (res.data.result === 1) {
            this.$message({ type: 'success', message: '删除成功!' })
          } else {
            this.$message({ type: 'error', message: res.data.message })
          }
          this.fetchData()
        })
    }
  }
}
</script>
