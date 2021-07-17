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
        prop="typeId"
        label="设备ID"
        align="center"
        width="80px"
      />
      <el-table-column
        prop="name"
        label="设备名称"
        align="center"
      />
      <el-table-column prop="typeName" label="设备类型" align="center">
        <template scope="scope">
          <el-tag type="success" effect="dark"> {{ scope.row.typeName }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="specification"
        label="设备规格"
        align="center"
      />
      <el-table-column
        prop="information"
        label="设备描述"
        align="center"
      />
      <el-table-column prop="typeStatus" label="设备状态" sortable align="center">
        <template scope="scope">
          <el-tag v-if="scope.row.typeStatus === 0" type="danger"> 已关机 </el-tag>
          <el-tag v-if="scope.row.typeStatus === 1" type=""> 空闲中 </el-tag>
          <el-tag v-if="scope.row.typeStatus === 2" type="success">  生产中 </el-tag>
          <el-tag v-if="scope.row.typeStatus === 3" type="warning">  已报废 </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="leaseStatus" label="租用状态" align="center" width="100px">
        <template scope="scope">
          <el-tag v-if="scope.row.leaseStatus === 0" type="success"> 工厂设备 </el-tag>
          <el-tag v-if="scope.row.leaseStatus === 1" type=""> 已被租用 </el-tag>
          <el-tag v-if="scope.row.leaseStatus === 2" type="warning">  未被租用 </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="250px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.typeStatus === 0" type="primary" icon="el-icon-edit" @click="updatetype(scope.row)">远程开机</el-button>
          <el-button v-if="scope.row.typeStatus === 1" type="primary" icon="el-icon-edit" @click="updatetype(scope.row)">远程关机</el-button>
          <el-button type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">修 改</el-button>
          <el-button slot="reference" type="danger" icon="el-icon-delete" @click="deleteFun(scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisibleOfAdd">
      <el-form ref="form" :model="addForm" label-width="150px">
        <el-form-item label="设备名称">
          <el-input v-model="addForm.name" />
        </el-form-item>

        <el-form-item label="设备类型">
          <el-input v-model="addForm.typeName" />
        </el-form-item>

        <el-form-item label="设备规格">
          <el-input v-model="addForm.specification" />
        </el-form-item>

        <el-form-item label="设备描述">
          <el-input v-model="addForm.information" type="textarea" />
        </el-form-item>

        <el-form-item label="所属用户">
          <el-input v-model="addForm.userId" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addtype">确定</el-button>
          <el-button @click="dialogFormVisibleOfAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="editForm" label-width="150px">
        <el-form-item label="设备ID">
          <el-input v-model="editForm.typeId" />
        </el-form-item>

        <el-form-item label="设备名称">
          <el-input v-model="editForm.name" />
        </el-form-item>

        <el-form-item label="设备类型">
          <el-input v-model="editForm.typeName" />
        </el-form-item>

        <el-form-item label="设备规格">
          <el-input v-model="editForm.specification" />
        </el-form-item>

        <el-form-item label="设备描述">
          <el-input v-model="editForm.information" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updatetype">确定</el-button>
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
        typeId: null,
        specification: null,
        name: null,
        typeName: null,
        information: null,
        typeStatus: null,
        leaseStatus: null
      }],
      deleteInfo: {
        result: null
      },
      editForm: {
        typeId: null,
        specification: null,
        name: null,
        typeName: null,
        information: null,
        typeStatus: null,
        leaseStatus: null
      },
      addForm: {
        specification: null,
        name: null,
        typeName: null,
        information: null,
        userId: null
      },
      dialogFormVisible: false,
      dialogFormVisibleOfAdd: false,
      searchInfo: null,
      searchByWhat: '',
      isAlltype: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      axios.get('/type/typeList').then(response => {
        this.typeList = response.data
        this.listLoading = false
        this.isAlltype = true
      })
    },
    handleEdit(row) {
      this.editForm = {
        typeId: row.typeId,
        specification: row.specification,
        name: row.name,
        typeName: row.typeName,
        information: row.information,
        typeStatus: row.typeStatus,
        leaseStatus: row.leaseStatus
      }
      this.dialogFormVisible = true
    },
    updatetype() {
      this.dialogFormVisible = false
      this.$axios({
        method: 'post',
        url: 'type/updatetype',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          typeId: this.editForm.typeId,
          specification: this.editForm.specification,
          name: this.editForm.name,
          typeName: this.editForm.typeName,
          information: this.editForm.information,
          typeStatus: this.editForm.typeStatus,
          leaseStatus: this.editForm.leaseStatus
        }
      }).then(res => {
        console.log(res)
      })
    },
    addtype() {
      this.dialogFormVisibleOfAdd = false
      this.$axios({
        method: 'post',
        url: 'type/addtype',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          typeId: this.addForm.typeId,
          specification: this.addForm.specification,
          name: this.addForm.name,
          typeName: this.addForm.typeName,
          information: this.addForm.information,
          typeStatus: this.addForm.typeStatus,
          leaseStatus: this.addForm.leaseStatus,
          userId: this.addForm.userId
        }
      }).then(res => {
        this.fetchData()
        this.$message({ type: 'success', message: '添加成功!' })
      })
    },
    deleteFun(row) {
      axios.get('type/deleteById?id=' + row.typeId)
          .then(res => {
            this.fetchData()
            if (res.data.result === 1) {
              this.$message({ type: 'success', message: '删除成功!' })
            } else {
              this.$message({ type: 'error', message: res.data.message })
            }
          })
    },
    searchtype() {
      axios.get('type/searchtype?data=' + this.searchInfo)
          .then(res => {
            this.typeList = res.data
            this.isAlltype = false
          })
    }
  }
}
</script>
