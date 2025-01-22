<template>
    <div class="firework hidden">
        <van-icon
            class="emitter"
            size="4em"
            name="https://api.iconify.design/twemoji:firecracker.svg?color=%23f4be49"
            @click="handleFire"
        />
        <van-icon
            v-if="fireworkList.length <= 0"
            class="tip"
            size="1.5em"
            name="https://api.iconify.design/tabler:hand-finger-left.svg?color=%23f4be49"
        />
        <canvas ref="firework" />
        <div class="bless">
            <span class="author">{{ author }}</span>祝<span class="target">{{ target }}:</span>新年快乐!
            <div>{{ bless }}</div>
        </div>
    </div>
</template>
<script>
import { deleteFromList } from '@/utils/deleteFromList'
import { Firework } from './firework'
import { getRandom } from '@/utils/getRandom'

export default {
    name: 'Firework',
    data() {
        return {
            fireworkList: [],
            author: '',
            defaultAuthor: '章孝焐',
            target: '大家',
            blessList: [
                '蛇年吉祥, 心想事成!',
                '蛇舞新春, 福满乾坤!',
                '蛇年行大运!',
                '旧岁辞, 灵蛇至, 新章启, 福满溢!',
                '蛇年笑语盈门庭, 家和业兴岁月宁!',
                '祥蛇献瑞, 君步新程!',
                '蛇年翩至, 你事业腾飞!'
            ],
            bless: ''
        }
    },
    mounted() {
        const { author = '' } = this.$route.query
        this.author = author || this.defaultAuthor
        this.initFirework()
    },
    methods: {
        initFirework() {
            const canvas = this.$refs.firework
            const width = window.innerWidth
            const height = window.innerHeight
            canvas.width = width
            canvas.height = height

            canvas.style.width = width + 'px'
            canvas.style.height = height + 'px'

            const ctx = canvas.getContext('2d')

            // 动画循环
            const draw = () => {
                // 使用半透明清空画布，形成拖尾效果
                ctx.fillStyle = 'rgba(0,0,0,0.3)'
                ctx.fillRect(0, 0, width, height)

                ctx.save()

                // 修改坐标系
                ctx.translate(0, height)
                ctx.scale(1, -1)

                const list = [...this.fireworkList]
                list.forEach(firework => {
                    firework.update()
                    if (firework.isEnd()) {
                        deleteFromList(this.fireworkList, firework)
                    }
                })

                ctx.restore()

                requestAnimationFrame(draw)
            }
            draw()
        },
        // 烟花颜色列表
        createFireworkColor() {
            const colorList = [
                '#ff0043',
                '#14fc56',
                '#1e7fff',
                '#e60aff',
                '#ffbf36',
                '#ffffff'
            ]
            return colorList[Math.floor(Math.random() * colorList.length)]
        },
        handleFire() {
            const firework = new Firework({
                target: this.$refs.firework,
                color: this.createFireworkColor()
            })
            this.fireworkList.push(firework)
            firework.launch()
            this.bless = this.blessList[Math.floor(getRandom(0, this.blessList.length - 1))]
        }
    }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
