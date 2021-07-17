<template>
  <div class="dashboard-container">
    <el-alert
      title="静态界面"
      type="info"
      description="你不会以为动态的吧,xs"
      close-text="知道了"
      show-icon
    />
    <br>
    <div class="block">
      <el-timeline>
        <el-timeline-item timestamp="今天" placement="top">
          <el-card>
            <h3>添加用户、工厂、设备模块</h3>
            <p>ChengDX 提交于 刚刚</p>
          </el-card>
        </el-timeline-item>

        <el-timeline-item timestamp="7/16" placement="top">
          <el-card>
            <h3>后端基本完成</h3>
            <p>ChengDX 提交于 昨天</p>
          </el-card>
        </el-timeline-item>

        <el-timeline-item timestamp="7/15" placement="top">
          <el-card>
            <h3>启动</h3>
            <p>ChengDX 提交于 两天前</p>
          </el-card>
        </el-timeline-item>

      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.loadData()
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
