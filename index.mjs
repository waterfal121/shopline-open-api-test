import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
dotenv.config();

const accessToken = process.env.OPENAPI_ACCESS_TOKEN;
const userAgent = process.env.OPENAPI_USER_AGENT;

async function getOpenApiCustomers() {
  const per_page = 2; // 每頁取得的會員數量
  const page = 1; // 頁碼

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

    const customers = response.data?.items || [];
    console.log(`✅ 成功取得`, response.data.items.length, `筆會員資料`);

    // ✅ 寫入 JSON 檔案
    createJSON(response.data, './json/customers.json');
    console.log('✅ 成功將資料寫入 ./json/customers.json');
  } catch (error) {
    console.error('❌ 錯誤：', error.response?.data || error.message);
  }
}

async function getOpenApiOrders() {
  const per_page = 2; // 每頁取得的訂單數量
  const page = 1; // 頁碼

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

    const orders = response.data?.items || [];
    console.log(`✅ 成功取得`, response.data.items.length, `筆訂單資料`);

    // ✅ 寫入 JSON 檔案
    createJSON(response.data, './json/orders.json');
    console.log('✅ 成功將資料寫入 ./json/orders.json');
  } catch (error) {
    console.error('❌ 錯誤：', error.response?.data || error.message);
  }
}

// 取得 10000 筆會員資料
// 這裡使用分頁方式，每次取得 500 筆 (因為 per_page 最大值為 999)
async function getAllCustomers(limit = 10000, perPage = 500) {
  let page = 1;
  let totalFetched = 0;
  const allCustomers = [];

  while (totalFetched < limit) {
    try {
      const response = await axios.get(
        `https://open.shopline.io/v1/customers?per_page=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            // 'User-Agent': userAgent,
          },
        }
      );

      const customers = response.data?.items || [];
      if (customers.length === 0) break; // 若撈不到資料，代表到底了

      allCustomers.push(...customers);
      totalFetched += customers.length;
      console.log(
        `📦 Page ${page}：已取得 ${customers.length} 筆，累積 ${totalFetched} 筆`
      );
      page++;
    } catch (error) {
      console.error(
        `❌ 第 ${page} 頁錯誤：`,
        error.response?.data || error.message
      );
      break;
    }
  }

  // ✨ 寫入 JSON
  createJSON(allCustomers, './json/customers-full.json');
  console.log(`✅ 已完成，總共寫入 ${allCustomers.length} 筆會員資料`);
}

// 寫入 JSON
function createJSON(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ 成功寫入 ${filename}`);
}

// getOpenApiCustomers();
// getOpenApiOrders();
getAllCustomers();
