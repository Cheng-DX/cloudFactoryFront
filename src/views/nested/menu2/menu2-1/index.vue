<template>
  <div class="app-container">

    <el-col span="3">
      <el-button type="success" icon="el-icon-plus" redio @click="dialogFormVisibleOfAdd = true">添加产品</el-button>
    </el-col>
    <el-col span="8">
      <el-input v-model="searchInfo" placeholder="根据名称进行模糊搜索（人麻了）" clearable class="input-with-select" prefix-icon="el-icon-search" />
    </el-col>
    <el-col span="2">
      <el-button icon="el-icon-search" redio type="primary" @click="searchProduct" />
    </el-col>
    <el-col v-if="!isAllProduct" span="3">
      <el-button icon="el-icon-refresh-right" redio type="warning" @click="fetchData">显示全部</el-button>
    </el-col>

    <el-table
      :data="productList"
      border
      style="width: 100%"
      fit
      highlight-current-row
    >
      <el-table-column
        prop="productId"
        label="产品ID"
        align="center"
        width="80px"
      />
      <el-table-column
        prop="name"
        label="产品名称"
        align="center"
      />
      <el-table-column prop="typeName" label="产品类型" align="center">
        <template scope="scope">
          <el-tag type="success" effect="dark"> {{ scope.row.typeName }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="specification"
        label="产品规格"
        align="center"
      />
      <el-table-column
        prop="information"
        label="产品描述"
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
        <el-form-item label="产品名称">
          <el-input v-model="addForm.name" />
        </el-form-item>

        <el-form-item label="产品类型">
          <template>
            <el-select v-model="addForm.typeName" placeholder="请选择">
              <el-option
                v-for="item in productTypeList"
                :key="item.name"
                :value="item.name"
                :label="item.name"
              />
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="产品规格">
          <el-input v-model="addForm.specification" />
        </el-form-item>

        <el-form-item label="产品描述">
          <el-input v-model="addForm.information" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addProduct">确定</el-button>
          <el-button @click="dialogFormVisibleOfAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="editForm" label-width="150px">

        <el-form-item label="产品ID">
          <el-input v-model="editForm.productId" disabled />
        </el-form-item>

        <el-form-item label="产品名称">
          <el-input v-model="editForm.name" />
        </el-form-item>

        <el-form-item label="产品类型">
          <template>
            <el-select v-model="editForm.typeName" placeholder="请选择" disabled>
              <el-option
                v-for="item in productTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="产品规格">
          <el-input v-model="editForm.specification" />
        </el-form-item>

        <el-form-item label="产品描述">
          <el-input v-model="editForm.information" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateProduct">确定</el-button>
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
      productList: [{
        productId: null,
        specification: null,
        name: null,
        typeName: null,
        information: null
      }],
      deleteInfo: {
        result: null
      },
      editForm: {
        productId: null,
        specification: null,
        name: null,
        typeName: null,
        information: null
      },
      addForm: {
        specification: null,
        name: null,
        typeName: null,
        information: null
      },
      productTypeList: [{
        id: null,
        name: null
      }],
      dialogFormVisible: false,
      dialogFormVisibleOfAdd: false,
      searchInfo: null,
      searchByWhat: '',
      isAllProduct: true
    }
  },
  created() {
    this.fetchData()
    this.getTypeList()
  },
  methods: {
    clear() {
      this.dialogFormVisibleOfAdd = false
      this.addForm.specification = null
      this.addForm.name = null
      this.addForm.typeName = null
      this.addForm.information = null
    },
    getTypeList() {
      this.listLoading = true
      axios.get('/productType/productTypeList').then(response => {
        this.productTypeList = response.data
        this.listLoading = false
      })
    },
    fetchData() {
      this.listLoading = true
      axios.get('/product/productList').then(response => {
        this.productList = response.data
        this.listLoading = false
        this.isAllProduct = true
      })
    },
    handleEdit(row) {
      this.editForm = {
        productId: row.productId,
        specification: row.specification,
        name: row.name,
        typeName: row.typeName,
        information: row.information
      }
      this.dialogFormVisible = true
    },
    updateProduct() {
      this.dialogFormVisible = false
      axios.get('product/updateProduct?' +
          'productId=' + this.editForm.productId + '&' +
          'specification=' + this.editForm.specification + '&' +
          'name=' + this.editForm.name + '&' +
          'info=' + this.editForm.information
      ).then(res => {
        this.fetchData()
        this.$message({ type: 'success', message: '修改成功！' })
      })
    },
    addProduct() {
      this.dialogFormVisibleOfAdd = false
      axios.get('product/addProduct?' +
          'info=' + this.addForm.information + '&' +
          'specification=' + this.addForm.specification + '&' +
          'name=' + this.addForm.name + '&' +
          'typeName=' + this.addForm.typeName
      ).then(res => {
        this.fetchData()
        this.$message({ type: 'success', message: '添加成功！' })
        this.clear()
      })
    },
    deleteFun(row) {
      axios.get('product/deleteById?id=' + row.productId)
        .then(res => {
          this.fetchData()
          if (res.data.result === 1) {
            this.$message({ type: 'success', message: '删除成功!' })
          } else {
            this.$message({ type: 'success', message: res.data.message })
          }
        })
    },
    searchProduct() {
      axios.get('product/searchProduct?data=' + this.searchInfo)
        .then(res => {
          this.productList = res.data
          this.isAllProduct = false
        })
    }
  }
}
</script>

