<template>
  <div class="app-container">
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
          <el-button
            type="success"
            icon="el-icon-check"
            @click="handleBid(scope.row.orderId)"
          >投标</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="150px">
        <el-input v-model="form.orderId" disabled />
        <el-input v-model="form.price"  oninput="value=value.replace(/[^0-9.]/g,'')"  placeholder="请输入投标价格" />
        <el-button type="primary" @click="bid">确定</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
export default {

  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
      dialogFormVisible: false,
      form: {
        price: null,
        orderId: null
      }
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
    handleBid(orderId) {
      this.dialogFormVisible = true
      this.form.orderId = orderId
    },
    bid() {
      axios.get('/order/facBid?id=' + this.form.orderId + '&userId=' + Cookies.get('userId') + '&price=' + this.form.price).then(res => {
        this.fetchData()
        this.$message({ type: 'success', message: '已投标' })
      })
    },
    fetchData() {
      this.listLoading = true
      axios.get('/order/choosebleOrderList').then(response => {
        this.orderList = response.data
        this.listLoading = false
        this.isAllOrder = true
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
