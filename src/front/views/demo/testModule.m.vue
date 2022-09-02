<template>
    <article class="test-module__wrap">
        <div class="test-module__title">hello <span class="test-module__content">{{text}}</span>  🌛</div>
        <widget-comp></widget-comp>
        <p v-if="!!age" class="test-module__age">im {{age}} months old ! 👶🏻</p>
        <el-button @click="sayAge">say</el-button>
    </article>
</template>
<script>
import widgetComp from "../../components/widgetComp.vue";

export default {
    components: {
        widgetComp
    },
    data() {
        return {
            text: "world",
            age: 0
        }
    },
    methods: {
        sayAge() {
            this.age = 3;
        }
    },
}
</script>
<style scoped lang="scss">
.test-module__wrap {
    text-align: center;
    .test-module__title {
        margin-top: 280px;
        text-align: center;
        font-size: 28px;
        color: #017dfc;
        font-family: "PingFang SC";
        .test-module__content {
            color: pink;
            font-weight: normal;
        }
    }
    .test-module__age{
        font-size: 16px;
        color: coral;
        text-align: center;
    }
}

</style>