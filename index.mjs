import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
dotenv.config();

const accessToken = process.env.OPENAPI_ACCESS_TOKEN;
const userAgent = process.env.OPENAPI_USER_AGENT;

async function getOpenApiCustomers() {
  const per_page = 2;
  const page = 1;

  try {
    const response = await axios.get(
      `https://open.shopline.io/v1/customers?per_page=${per_page}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          // 'User-Agent': userAgent,
        },
      }
    );

    // ✅ 寫入 JSON 檔案
    createJSON(response.data, '/json/customers.json');

    console.log('✅ 成功取得會員資料，已寫入 /json/customers.json');
  } catch (error) {
    console.error('❌ 錯誤：', error.response?.data || error.message);
  }
}

async function getOpenApiOrders() {
  const per_page = 1;
  const page = 2;

  try {
    const response = await axios.get(
      `https://open.shopline.io/v1/orders?per_page=${per_page}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'User-Agent': userAgent,
        },
      }
    );

    // ✅ 寫入 JSON 檔案
    createJSON(response.data, '/json/orders.json');

    console.log('✅ 成功取得訂單資料，已寫入 /json/orders.json');
  } catch (error) {
    console.error('❌ 錯誤：', error.response?.data || error.message);
  }
}

// 寫入 JSON
function createJSON(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ 成功寫入 ${filename}`);
}

getOpenApiCustomers();
// getOpenApiOrders();
