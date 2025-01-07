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
                    name: 'Weekends',
                    path: '/weekends',
                    color: 'rgba(19, 206, 102, 1)',
                    backgroundColor: 'rgba(19, 206, 102, 0.3)'
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
