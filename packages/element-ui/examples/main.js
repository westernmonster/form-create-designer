import { createApp } from "vue";
import naive from "naive-ui";
// Naive UI 样式会自动导入，但如果需要手动导入可以使用：
// import 'naive-ui/es/style/index.css';
import formCreate from "@form-create/naive-ui";
import App from "./App.vue";
import FcDesigner from "../src/index";

const app = createApp(App);

app.use(naive);
app.use(formCreate);
app.use(FcDesigner);

app.mount("#app");
