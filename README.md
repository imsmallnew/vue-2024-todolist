## Demo URL:
https://imsmallnew.github.io/vue-2024-todolist/#/

## SignUpPage
API有錯誤時會顯示在對應欄位底下, 左上角提示會判斷如果有紅字則無法按下註冊
![image](https://github.com/user-attachments/assets/e5569e44-95b0-448f-bc2f-a209e35b67fb)

密碼欄位用watch判斷前後密碼是否一樣

![image](https://github.com/user-attachments/assets/8810f10b-be02-43c2-a19f-8b2d83a42eb9)

註冊成功2秒後自動轉至登入頁

![image](https://github.com/user-attachments/assets/b5fbb6a5-a144-4309-869a-9842ea7a409b)

如註冊成功轉頁會從store中取得帳號密碼帶入欄位

![image](https://github.com/user-attachments/assets/e42d7ce3-5cdc-41d6-8cf8-1669f401bc90)

## LoginPage
API有錯誤時會顯示在對應欄位底下, 左上角提示會判斷如果有紅字則無法按下註冊
![image](https://github.com/user-attachments/assets/0460e142-688d-47ef-bc00-3e4b607a2539)


## TodoList
登入成功切換會有loading效果等待todolist取得清單
![image](https://github.com/user-attachments/assets/03968f64-02f2-4ebd-aadc-057bb1d333f1)

當待辦清單為空時顯示預設文字: [目前尚無待辦事項], 空白待辦事項無法送出新增
![image](https://github.com/user-attachments/assets/43f1e58a-1623-4c44-982d-2a5c83cdc9f7)

新增成功會有提示, 頁籤可切換顯示項目, 顯示待完成事項, 與目前完成進度條
![image](https://github.com/user-attachments/assets/54e89d30-bf97-4574-83e8-505e135783d8)

編輯/複製/刪除 待辦清單

![image](https://github.com/user-attachments/assets/75960696-dd7d-4aa8-81c5-ba33c729a028)

若新增項目已在清單中則提示無法新增
![image](https://github.com/user-attachments/assets/23dd3c84-a927-4f1c-9a6e-9a4e00e25d7a)

使用 AlertModal.vue 來編輯 更新/刪除項目

![image](https://github.com/user-attachments/assets/bb347ec5-6122-4235-99bc-376892f9ea53)
![image](https://github.com/user-attachments/assets/db2b2388-21a1-4951-9e17-2e6efcb313aa)

完成所有事項會有恭喜提示
![image](https://github.com/user-attachments/assets/6a93f797-e05f-4546-a217-35f14b14a707)

在登出狀態跳至todoslit會顯示[請先登入]

https://imsmallnew.github.io/vue-2024-todolist/#/TodoList
![image](https://github.com/user-attachments/assets/90b2667e-1aac-4cf1-b520-e45b8de839f0)

若進入到未設定的網頁則會顯示404並在2秒轉至登入頁

https://imsmallnew.github.io/vue-2024-todolist/#/helloworld
![image](https://github.com/user-attachments/assets/250475c3-8cfe-41a7-90fb-488c9544a2cd)

## 專案架構

![image](https://github.com/user-attachments/assets/f69805f2-8782-49fb-8811-eab9a5dedf89)

