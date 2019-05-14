<template>
  <el-container>
    <el-aside width="200px">
      <el-row>
        <el-col :span="24">
          <div class="grid-content contacts_search">1</div>
        </el-col>
      </el-row>
      <div>
        <el-row>
          <el-col :span="24">
            <div class="grid-content">2</div>
          </el-col>
        </el-row>
      </div>
    </el-aside>
    <el-main>
      聊天内容
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background: #e6e6e6;
}
.el-main {
  color: #f5f5f5;
}
.grid-content {
  border-radius: 4px;
  min-height: 56px;
  padding:10px;
  
}
.contacts_search {
  background: #eeebe9;
}
</style>

