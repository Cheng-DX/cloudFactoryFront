<template>
  <div class="app-container">
    <el-col span="2">
      <el-button icon="el-icon-plus" redio type="success" @click="dialogFormVisibleOfAdd = true">新建订单</el-button>
    </el-col>
    <el-table
      :data="orderList"
      style="width: 100%"
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">

            <el-form-item label="订单ID">
              <span>{{ props.row.orderId }}</span>
            </el-form-item>

            <el-form-item label="产品名称">
              <span>{{ props.row.productName }}</span>
            </el-form-item>

            <el-form-item label="订购数量">
              <span>{{ props.row.mount }}</span>
            </el-form-item>

            <el-form-item label="交付日期">
              <el-date-picker
                v-model="props.row.deliverTime"
                type="datetime"
                placeholder="加载失败"
                disabled
              />
            </el-form-item>

            <el-form-item label="投标截止日期">
              <el-date-picker
                v-model="props.row.deadline"
                type="datetime"
                placeholder="加载失败"
                disabled
              />
            </el-form-item>
            <el-form-item label="收货人联系方式">
              <span>{{ props.row.phoneNumber }}</span>
            </el-form-item>
            <el-form-item label="省/市/自治区">
              <span>{{ props.row.province }}</span>
            </el-form-item>
            <el-form-item label="市">
              <span>{{ props.row.city }}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{ props.row.street }}</span>
            </el-form-item>
          </el-form>

        </template>
      </el-table-column>

      <el-table-column
        prop="orderId"
        label="订单ID"
        align="center"
      />
      <el-table-column
        prop="productName"
        label="产品名称"
        align="center"
      />
      <el-table-column
        prop="mount"
        label="订购数量"
        align="center"
      />
      <el-table-column
        prop="deliverTime"
        label="交付日期"
        align="center"
        min-width="130px"
      >
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.deliverTime"
            type="datetime"
            placeholder="加载失败"
            disabled
          />
        </template>
      </el-table-column>

      <el-table-column prop="type" label="订单状态" align="center">
        <!--0：已保存
            1：已发布
            2：投标结束
            3：生产中
            4：已发货
            5：订单结束
            success/info/warning/danger-->
        <template scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success" effect="dark"> 已保存 </el-tag>
          <el-tag v-if="scope.row.status === 1" type="warning" effect="dark"> 已发布 </el-tag>
          <el-tag v-if="scope.row.status === 2" type="success" effect="dark"> 投标结束 </el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning" effect="dark"> 生产中 </el-tag>
          <el-tag v-if="scope.row.status === 4" type="success" effect="dark"> 已发货 </el-tag>
          <el-tag v-if="scope.row.status === 5" type="danger" effect="dark"> 订单结束 </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="160px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编 辑</el-button>
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 5"
            type="danger"
            icon="el-icon-error"
            @click="deleteOrderById(scope.row)"
          >删 除</el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="success"
            icon="el-icon-upload2"
            @click="switchStatus(scope.row,1)"
          >发 布</el-button>
          <el-button
            v-if="scope.row.status === 1"
            type="primary"
            icon="el-icon-s-data"
            @click="checkBidInfo(scope.row)"
          >投标详情</el-button>
          <el-button
            v-if="scope.row.status === 4"
            type="success"
            icon="el-icon-check"
            @click="switchStatus(scope.row,5)"
          >确认收货</el-button>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="editForm" label-width="150px">
        <el-form-item label="订单ID">
          <el-input v-model="editForm.orderId" disabled />
        </el-form-item>

        <el-form-item label="产品名称">
          <template>
            <el-select v-model="editForm.productName" placeholder="请选择" disabled>
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="订购数量">
          <el-input v-model="editForm.mount" type="number" />
        </el-form-item>

        <el-form-item label="投标截止时间">
          <el-date-picker
            v-model="editForm.deadline"
            disabled
            type="datetime"
          />
        </el-form-item>
        <el-form-item label="交付日期">
          <el-date-picker
            v-model="editForm.deliverTime"
            type="datetime"
            disabled
          />
        </el-form-item>
        <el-form-item label="送货地址-省">
          <el-input v-model="editForm.province" />
        </el-form-item>
        <el-form-item label="送货地址-市">
          <el-input v-model="editForm.city" />

        </el-form-item><el-form-item label="送货地址-详细地址">
          <el-input v-model="editForm.street" />
        </el-form-item>
        <el-form-item label="收货人联系方式">
          <el-input v-model="editForm.phoneNumber" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateOrder">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="bidInfoVisible" title="投标详情" align="center">
      <el-alert
        title="Attention"
        type="info"
        description="仅会显示开启状态工厂的投标信息"
        close-text="知道了"
        show-icon
      />
      <br>
      <el-table
        :data="bidList"
        border
        style="width: 100%"
        fit
        highlight-current-row
      >
        <el-table-column prop="bidId" label="投标id" align="center" />
        <el-table-column
          prop="factoryName"
          label="投标工厂"
          min-width="150px"
          align="center"
        />
        <el-table-column
          prop="ownerName"
          label="工厂负责人"
          min-width="150px"
          align="center"
        />
        <el-table-column
          prop="phoneNumber"
          label="联系方式"
          align="center"
        />
        <el-table-column
          prop="price"
          label="投标价格"
          align="center"
        />
        <el-table-column label="选标" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-circle-check" @click="chooseBid(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisibleOfAdd">
      <el-form ref="form" :model="addForm" label-width="150px">
        <el-form-item label="选择产品">
          <template>
            <el-select v-model="addForm.productName" placeholder="请选择">
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="收货人联系方式">
          <el-input v-model="addForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="订购数量">
          <el-input v-model="addForm.mount" type="number" />
        </el-form-item>
        <el-form-item label="投标截止时间">
          <el-date-picker
            v-model="addForm.deadline"
            type="datetime"
            value-format="yyyy/MM/dd hh:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="交付日期">
          <el-date-picker
            v-model="addForm.deliverTime"
            type="datetime"
            value-format="yyyy/MM/dd hh:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-form-item label="送货地址-省">
          <el-input v-model="addForm.province" />
        </el-form-item>
        <el-form-item label="送货地址-市">
          <el-input v-model="addForm.city" />

        </el-form-item><el-form-item label="送货地址-详细地址">
          <el-input v-model="addForm.street" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addOrder">确定</el-button>
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
      productList: [{
        id: null,
        name: null
      }],
      bidList: [{
        bidId: null,
        factoryName: null,
        ownerName: null,
        phoneNumber: null,
        price: null
      }
      ],
      orderList: [{
        orderId: null,
        productName: null,
        mount: null,
        deliverTime: null,
        deadline: null,
        phoneNumber: null,
        status: null,
        province: null,
        city: null,
        street: null
      }],
      deleteInfo: {
        result: null
      },
      addForm: {
        productName: null,
        mount: null,
        deliverTime: null,
        deadline: null,
        phoneNumber: null,
        province: null,
        city: null,
        street: null,
        ownerId: 30
      },
      editForm: {
        orderId: null,
        productName: null,
        mount: null,
        deliverTime: null,
        deadline: null,
        phoneNumber: null,
        province: null,
        city: null,
        status: null,
        street: null
      },
      dialogFormVisible: false,
      dialogFormVisibleOfAdd: false,
      bidInfoVisible: false,
      searchInfo: null,
      searchByWhat: '',
      isAllOrder: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.fetchData()
    this.getProductList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    addOrder() {
      axios.get('order/addOrder?' +
          'productName=' + this.addForm.productName + '&' +
          'mount=' + this.addForm.mount + '&' +
          'deliverTime=' + this.addForm.deliverTime + '&' +
          'province=' + this.addForm.province + '&' +
          'deadline=' + this.addForm.deadline + '&' +
          'phoneNumber=' + this.addForm.phoneNumber + '&' +
          'city=' + this.addForm.city + '&' +
          'ownerId=' + this.addForm.ownerId + '&' +
          'street=' + this.addForm.street
      ).then(res => {
        this.dialogFormVisibleOfAdd = false
        this.fetchData()
        this.$message({ type: 'success', message: '添加成功！' })
        this.clear()
      })
    },
    chooseBid(row) {
      axios.get('/order/chooseBid?id=' + row.bidId).then(res => {
        this.fanSiLe(row.bidId)
        this.bidInfoVisible = false
        this.fetchData()
        this.$message({ type: 'success', message: '选标成功！已中标工厂将尽快为您安排生产' })
      })
    },
    fanSiLe(bidId) {
      axios.get('order/xs?bidId=' + bidId).then(res => {
      })
    },
    checkBidInfo(row) {
      this.listLoading = true
      axios.get('/order/bidList?orderId=' + row.orderId).then(response => {
        this.bidList = response.data
        this.listLoading = false
        this.bidInfoVisible = true
      })
    },
    switchStatus(row, status) {
      axios.get('/order/switchStatus?id=' + row.orderId + '&&status=' + status).then(response => {
        if (status === 1) {
          this.$message({ type: 'success', message: '发布成功!' })
        } else if (status === 2) {
          this.$message({ type: 'success', message: '投标结束!' })
        } else if (status === 3) {
          this.$message({ type: 'success', message: '生产开始！' })
        } else if (status === 4) {
          this.$message({ type: 'success', message: '发货成功!' })
        } else if (status === 5) {
          this.$message({ type: 'success', message: '订单结束' })
        }
        this.fetchData()
      })
    },
    getProductList() {
      axios.get('/product/productList2').then(res => {
        this.productList = res.data
      })
    },
    fetchData() {
      this.listLoading = true
      axios.get('/order/orderList').then(response => {
        this.orderList = response.data
        this.listLoading = false
        this.isAllOrder = true
      })
    },
    handleEdit(row) {
      this.editForm = {
        orderId: row.orderId,
        productName: row.productName,
        mount: row.mount,
        deliverTime: row.deliverTime,
        deadline: row.deadline,
        phoneNumber: row.phoneNumber,
        province: row.province,
        city: row.city,
        street: row.street
      }
      this.dialogFormVisible = true
    },
    updateOrder() {
      this.dialogFormVisible = false
      axios.get('order/updateOrder?' +
          'orderId=' + this.editForm.orderId + '&' +
          'productName=' + this.editForm.productName + '&' +
          'mount=' + this.editForm.mount + '&' +
          'deliverTime=' + this.editForm.deliverTime + '&' +
          'province=' + this.editForm.province + '&' +
          'deadline=' + this.editForm.deadline + '&' +
          'phoneNumber=' + this.editForm.phoneNumber + '&' +
          'city=' + this.editForm.city + '&' +
          'street=' + this.editForm.street
      ).then(res => {
        this.dialogFormVisibled = false
        this.fetchData()
        this.$message({ type: 'success', message: '修改成功！' })
      })
    },
    deleteOrderById(row) {
      axios.get('/order/deleteById?id=' + row.orderId)
        .then(res => {
          this.fetchData()
          if (res.data.result === 1) {
            this.$message({ type: 'success', message: '删除成功!' })
          } else {
            this.$message({ type: 'error', message: res.data.message })
          }
        })
    }

  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 170px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 80%;
}
</style>
