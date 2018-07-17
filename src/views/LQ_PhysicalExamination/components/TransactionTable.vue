<template>
  <el-table :data="list" style="width: 100%;" height="255" border fit highlight-current-row>
    <el-table-column label="姓名" align="center" prop="patientName">
    </el-table-column>
    <el-table-column label="特别关心标签"  align="center">
      <template slot-scope="scope">
        <el-tag> {{scope.row.gzTag}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="性别" prop="patientSex" align="center" >
    </el-table-column>
    <el-table-column label="年龄" prop="patientAge" align="center" >
    </el-table-column>
    <el-table-column prop="icdName" label="套餐" align="center"  show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.mealName}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="档案" align="center"  >
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="$emit('getInfo',scope)">档案</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    getInfo(id) {

    }
  }
};
</script>
