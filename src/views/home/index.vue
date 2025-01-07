<template>
    <div class="home hidden linear">
        <div class="container scroll">
            <div
                v-for="(item, index) in favorites"
                :key="index"
                class="item"
                :style="{ color: item.color, backgroundColor: item.backgroundColor }"
                @click="favoriteClick(item)"
            >
                <svg-icon icon-class="solar-bell" class="icon" />
                <span class="name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Home',
    data() {
        return {
            favorites: [
                {
                    name: '欢乐周末',
                    path: '/weekends',
                    color: 'rgba(19, 206, 102, 1)',
                    backgroundColor: 'rgba(19, 206, 102, 0.3)'
                },
                {
                    name: '祝福',
                    path: '/bless',
                    color: 'rgba(105, 101, 234, 1)',
                    backgroundColor: 'rgba(105, 101, 234, 0.3)'
                }
            ]
        }
    },
    methods: {
        favoriteClick(item) {
            this.$router.push(item.path)
        }
    }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
