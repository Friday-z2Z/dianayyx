<template>
    <div :class="['el-empty', { 'el-empty-auto': auto }]">
        <div v-if="imageSize && imageSize !== '0px'" class="el-empty__image">
            <svg-icon icon-class="solar-empty" :style="{ 'font-size': typeof imageSize === 'number' ? (imageSize + 'px') : imageSize }" />
        </div>
        <div class="el-empty__description">
            <p>{{ description }}</p>
        </div>
        <div v-if="$slots.default" class="el-empty__extra">
            <slot />
        </div>
    </div>
</template>
<script>
export default {
    name: 'ElEmpty',
    props: {
        description: {
            type: String,
            default: '暂无内容'
        },
        imageSize: {
            type: String | Number,
            default: '48px'
        },
        auto: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {}
}
</script>
<style lang="scss" scoped>
.el-empty {
    padding: 100px 0;
    line-height: normal;
    &-auto {
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .el-empty__description {
        margin: 0;
    }
    .el-empty__image + .el-empty__description {
        margin-top: 20px;
    }
    .el-empty__extra {
        margin-top: 20px;
    }
}
</style>
