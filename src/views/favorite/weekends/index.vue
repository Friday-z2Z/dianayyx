<template>
    <div class="weekends linear">
        <h1>周末一起出去呀</h1>
        <span>
            <van-button ref="refuse" type="danger" class="button refuse" @click="handleRefuse">拒绝</van-button>
            <van-button type="primary" class="button" @click="handleConfirm">同意</van-button>
        </span>
    </div>
</template>

<script>
export default {
    name: 'Weekends',
    data() {
        return {
            textArr: [
                '你怎么能拒绝呀，心好痛',
                '真的不想一起出去嘛？',
                '你是不是点错了呀？',
                '再好好想想~',
                '真的要这么残忍吗？',
                '应该还会有更好的选择吧，emmmmm',
                '一起出去很愉快的呀',
                '不公平，绝对不公平！',
                '你超级漂亮可爱的呀',
                '我想一定是有什么隐情',
                '是我做的不够好吗？',
                '我错了，还是选同意吧，呜呜呜'
            ]
        }
    },
    methods: {
        handleRefuse() {
            const index = Math.floor(Math.random() * 11)
            this.$dialog.confirm({
                message: this.textArr[index],
                confirmButtonText: '不去',
                cancelButtonText: '我点错了'
            }).then(() => {
                this.handleRefuse()
            }).catch(() => {
                this.$toast.success('Nice!')
            })
        },
        handleConfirm() {
            this.$dialog.alert({
                message: '那就愉快的决定啦！'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
