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
                <van-icon size="2em" :name="item.icon" />
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
                    backgroundColor: 'rgba(19, 206, 102, 0.3)',
                    icon: 'https://api.iconify.design/solar:confetti-minimalistic-bold-duotone.svg?color=%2313ce66'
                },
                {
                    name: '祝福',
                    path: '/bless',
                    color: 'rgba(105, 101, 234, 1)',
                    backgroundColor: 'rgba(105, 101, 234, 0.3)',
                    icon: 'https://api.iconify.design/solar:heart-bold.svg?color=%236965ea'
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
@use './index.scss';
</style>
