<template>
  <fs-page class="page-suite-buy">
    <template #header>
      <div class="title">套餐购买</div>
    </template>
    <div class="suite-buy-content">
      <a-row :gutter="12">
        <a-col v-for="item of products" :key="item.id" class="mb-10" :xs="12" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
          <product-info product="item"></product-info>
        </a-col>
      </a-row>
    </div>
  </fs-page>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import * as api from "./api";
import ProductInfo from "/@/views/certd/suite/product-info.vue";

const products = ref([]);

async function loadSuites() {
  products.value = await api.ProductList();
}

loadSuites();
</script>

<style lang="less">
.page-suite-buy {
  .title {
    background-color: #fff;
  }
  background: #f0f2f5;
  .suite-buy-content {
    padding: 20px;

    .duration-list {
      display: flex;
      .duration-item {
        width: 50px;
        border: 1px solid #cdcdcd;
        text-align: center;
        padding: 2px;
        margin: 2px;
        cursor: pointer;

        &:hover {
          border-color: #1890ff;
        }
        &.active {
          border-color: #a6fba3;
          background-color: #c1eafb;
        }
      }
    }

    .hr {
      border-top: 1px solid #cdcdcd;
      margin-top: 5px;
      padding-top: 5px;
    }

    .price-text {
      align-items: baseline;
      font-family: "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    .prices {
      display: flex;
      justify-content: left;
      margin-top: 20px;
      .price-item {
        border: 1px solid #c6c6c6;
        background-color: #f8ebda;
        padding: 10px;
        text-align: center;
        cursor: pointer;
        width: 100px;
        &:hover {
          border-color: #38a0fb;
        }
        &.active {
          border-color: #1890ff;
        }
        margin-right: 10px;
      }
    }
  }
}
</style>
