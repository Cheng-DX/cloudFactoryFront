<template>
  <div class="app-container">

    <el-col span="3">
      <el-button type="success" icon="el-icon-plus" redio @click="dialogFormVisibleOfAdd = true">添加设备</el-button>
    </el-col>
    <el-col span="3">
      <el-button type="success" icon="el-icon-plus" redio @click="handleLease">租用设备</el-button>
    </el-col>
    <el-table
      :data="equipmentList"
      border
      style="width: 100%"
      fit
      highlight-current-row
    >
      <el-table-column
        prop="equipmentId"
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
      <el-table-column prop="equipmentStatus" label="设备状态" sortable align="center">
        <template scope="scope">
          <el-tag v-if="scope.row.equipmentStatus === 0" type="danger"> 已关机 </el-tag>
          <el-tag v-if="scope.row.equipmentStatus === 1" type=""> 空闲中 </el-tag>
          <el-tag v-if="scope.row.equipmentStatus === 2" type="success">  生产中 </el-tag>
          <el-tag v-if="scope.row.equipmentStatus === 3" type="warning">  已报废 </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="leaseStatus" label="租用状态" align="center" width="100px">
        <template scope="scope">
          <el-tag v-if="scope.row.leaseStatus === 0" type="success"> 工厂设备 </el-tag>
          <el-tag v-if="scope.row.leaseStatus === 1" type=""> 租用中 </el-tag>
          <el-tag v-if="scope.row.leaseStatus === 2" type="warning">  未被租用 </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.equipmentStatus === 0" type="primary" icon="el-icon-edit" @click="switchStatus(scope.row)">远程开机</el-button>
          <el-button v-if="scope.row.equipmentStatus === 1" type="primary" icon="el-icon-edit" @click="switchStatus(scope.row)">远程关机</el-button>
          <el-button v-if="scope.row.leaseStatus === 0" type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">修 改</el-button>
          <el-button v-if="scope.row.leaseStatus === 0" type="success" @click="handleCapacity(scope.row.equipmentId)">配置产能</el-button>
          <el-button v-if="scope.row.leaseStatus === 0" slot="reference" type="danger" icon="el-icon-delete" @click="deleteFun(scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="visibleOfLeasable">
      <el-table
        :data="leasableList"
        border
        style="width: 100%"
        fit
        highlight-current-row
      >
        <el-table-column
          prop="equipmentId"
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
        <el-table-column prop="leaseStatus" label="租用状态" align="center" width="100px">
          <template scope="scope">
            <el-tag v-if="scope.row.leaseStatus === 0" type="success"> 工厂设备 </el-tag>
            <el-tag v-if="scope.row.leaseStatus === 1" type=""> 已被租用 </el-tag>
            <el-tag v-if="scope.row.leaseStatus === 2" type="warning">  未被租用 </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="80px" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-plus" @click="leaseEquipment(scope.row)">租用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisibleOfAdd">
      <el-form ref="form" :model="addForm" label-width="150px">
        <el-form-item label="设备名称" required>
          <el-input v-model="addForm.name" />
        </el-form-item>

        <el-form-item label="设备类型" required>
          <template>
            <el-select v-model="addForm.typeName" placeholder="请选择">
              <el-option
                v-for="item in equipmentTypeList"
                :key="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="设备规格">
          <el-input v-model="addForm.specification" />
        </el-form-item>

        <el-form-item label="设备描述">
          <el-input v-model="addForm.information" type="textarea" />
        </el-form-item>

        <el-form-item label="所属用户">
          <el-input v-model="addForm.userId" disabled />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addEquipment">确定</el-button>
          <el-button @click="clear">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="editForm" label-width="150px">
        <el-form-item label="设备ID">
          <el-input v-model="editForm.equipmentId" disabled />
        </el-form-item>

        <el-form-item label="设备名称">
          <el-input v-model="editForm.name" />
        </el-form-item>

        <el-form-item label="设备类型">
          <template>
            <el-select v-model="editForm.typeName" placeholder="请选择" disabled>
              <el-option
                v-for="item in equipmentTypeList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="设备规格">
          <el-input v-model="editForm.specification" />
        </el-form-item>

        <el-form-item label="设备描述">
          <el-input v-model="editForm.information" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateEquipment">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
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
      equipmentList: [{
        equipmentId: null,
        specification: null,
        name: null,
        typeName: null,
        information: null,
        equipmentStatus: null,
        leaseStatus: null
      }],
      leasableList: [{
        equipmentId: null,
        specification: null,
        name: null,
        typeName: null,
        information: null,
        equipmentStatus: null,
        leaseStatus: null
      }],
      equipmentTypeList: [{
        equipmentTypeId: null,
        name: null
      }],
      deleteInfo: {
        result: null
      },
      editForm: {
        equipmentId: null,
        specification: null,
        name: null,
        typeName: null,
        information: null,
        equipmentStatus: null,
        leaseStatus: null
      },
      addCapacityForm: {

      },
      addForm: {
        specification: null,
        name: null,
        typeName: null,
        information: null,
        userId: Cookies.get('userId')
      },
      dialogFormVisible: false,
      dialogFormVisibleOfAdd: false,
      searchInfo: null,
      searchByWhat: '',
      isAllEquipment: true,
      visibleOfLeasable: false,
      addCapacityVisible: false
    }
  },
  created() {
    this.fetchData()
    this.getTypeList()
  },
  methods: {
    getTypeList() {
      this.listLoading = true
      axios.get('/equipmentType/equipmentTypeList').then(response => {
        this.equipmentTypeList = response.data
        this.listLoading = false
      })
    },
    fetchData() {
      this.listLoading = true
      axios.get('/equipment/facEquipmentList?id=' + this.addForm.userId).then(response => {
        this.equipmentList = response.data
        this.listLoading = false
        this.isAllEquipment = true
      })
    },
    leaseEquipment(row) {
      axios.get('/equipment/leaseEquipment?id=' + row.equipmentId + '&userId=' + Cookies.get('userId'))
        .then(res => {
          this.$message.success('已租用')
        })
      this.fetchData()
      this.fetchLeasable()
    },
    handleLease() {
      this.fetchLeasable()
      this.visibleOfLeasable = true
    },
    handleCapacity() {
    },
    fetchLeasable() {
      axios.get('/equipment/leasableEquipmentList').then(response => {
        this.leasableList = response.data
      })
    },
    clear() {
      this.dialogFormVisibleOfAdd = false
      this.addForm.specification = null
      this.addForm.name = null
      this.addForm.typeName = null
      this.addForm.information = null
      this.addForm.userId = 1
    },
    fillEdit(row) {
      this.editForm = {
        equipmentId: row.equipmentId,
        specification: row.specification,
        name: row.name,
        typeName: row.typeName,
        information: row.information,
        equipmentStatus: row.equipmentStatus,
        leaseStatus: row.leaseStatus
      }
    },
    handleEdit(row) {
      this.fillEdit(row)
      this.dialogFormVisible = true
    },
    switchStatus(row) {
      this.fillEdit(row)
      if (this.editForm.equipmentStatus === 1) {
        this.editForm.equipmentStatus = 0
      } else {
        this.editForm.equipmentStatus = 1
      }
      this.updateEquipment()
    },
    updateEquipment() {
      this.dialogFormVisible = false
      axios.get('equipment/updateEquipment?' +
          'equipmentId=' + this.editForm.equipmentId + '&' +
          'specification=' + this.editForm.specification + '&' +
          'name=' + this.editForm.name + '&' +
          'typeName=' + this.editForm.typeName + '&' +
          'equipmentStatus=' + this.editForm.equipmentStatus + '&' +
          'leaseStatus=' + this.editForm.leaseStatus + '&' +
          'information=' + this.editForm.information
      ).then(res => {
        this.dialogFormVisible = false
        this.fetchData()
        this.$message({ type: 'success', message: '修改成功！' })
      })
    },
    addEquipment() {
      axios.get('equipment/addEquipment?' +
          'name=' + this.addForm.name + '&' +
          'specification=' + this.addForm.specification + '&' +
          'information=' + this.addForm.name + '&' +
          'typeName=' + this.addForm.typeName + '&' +
          'ownerId=' + this.addForm.userId
      ).then(res => {
        this.dialogFormVisibleOfAdd = false
        this.fetchData()
        this.$message({ type: 'success', message: '添加成功！' })
      })
    },
    deleteFun(row) {
      axios.get('equipment/deleteById?id=' + row.equipmentId)
        .then(res => {
          this.fetchData()
          if (res.data.result === 1) {
            this.$message({ type: 'success', message: '删除成功!' })
          } else {
            this.$message({ type: 'success', message: res.data.message })
          }
        })
    }
  }
}
</script>
