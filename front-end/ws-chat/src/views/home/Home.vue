<template>
  <el-container>
    <el-aside width="200px">
      <el-row>
        <el-col :span="24">
          <div class="grid-content contact_search">
            <el-input
             size="small"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="input_search">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <div>
        <el-row>
          <el-col :span="24">
            <div class="grid-content contact_list">
              <el-badge is-dot class="item">
  <el-button class="share-button" icon="el-icon-share" type="primary"></el-button>
</el-badge>
            </div>
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
    return {
      input_search:''
    };
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
.contact_search {
  background: #eeebe9;
}
.contact_list{
  background: #e8e7e7;
}
</style>

