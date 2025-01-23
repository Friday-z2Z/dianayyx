<template>
    <div class="firework hidden">
        <div v-if="!showGame" class="packet-container height-auto hidden">
            <div class="packet-box">
                <van-icon
                    class="packet"
                    size="5em"
                    name="https://api.iconify.design/mingcute:red-packet-fill.svg?color=%23ff4e4c"
                    @click="handleShowGame"
                />
                <div>接收<span class="target">{{ who }}</span>的祝福</div>
            </div>
        </div>
        <template v-else>
            <van-icon
                class="emitter"
                size="5em"
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
                <span class="who target">{{ who }}</span>祝<span class="to target">{{ to }}:</span>2025新年快乐!
                <div>{{ bless }}</div>
            </div>
        </template>
        <audio ref="music" src="../../../assets/music/bg-new-year.mp3" autoplay loop />
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
            showGame: false,
            fireworkList: [],
            who: '',
            defaultWho: '章孝焐',
            to: '',
            defaultTo: '源源',
            blessList: [
                '蛇年吉祥, 心想事成!',
                '蛇舞新春, 福满乾坤!',
                '蛇年行大运!',
                '旧岁辞, 灵蛇至, 新章启, 福满溢!',
                '蛇年笑语盈门庭, 家和业兴岁月宁!',
                '祥蛇献瑞, 君步新程!',
                '蛇年翩至, 你事业腾飞!',
                '蛇年吉祥，福禄双全!',
                '福星高照，蛇岁平安!',
                '灵蛇贺岁，岁岁平安!',
                '金蛇迎春，笑口常开!',
                '灵蛇灵动迎新岁，智慧与福共缠绵!',
                '蛇年蜿蜒新征途，智慧如蛇步步赢!'
            ],
            bless: ''
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.showGame = from.path.indexOf('/home') > -1
        })
    },
    watch: {
        showGame(val) {
            if (val) {
                this.$nextTick(() => {
                    this.initFirework()
                    this.handleFire()
                })
            }
        }
    },
    mounted() {
        const { who = '', to = '' } = this.$route.query
        this.who = who || this.defaultWho
        this.to = to || this.defaultTo
    },
    methods: {
        handleShowGame() {
            this.$refs.music.play()
            this.showGame = true
        },
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
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
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
                '#ff7875',
                '#f5222d',
                '#ff9c6e',
                '#fa541c',
                '#ffc069',
                '#fa8c16',
                '#ffd666',
                '#faad14',
                '#fff566',
                '#fadb14',
                '#d3f261',
                '#a0d911',
                '#95de64',
                '#52c41a',
                '#5cdbd3',
                '#13c2c2',
                '#69b1ff',
                '#1677ff',
                '#85a5ff',
                '#2f54eb',
                '#b37feb',
                '#722ed1',
                '#ff85c0',
                '#eb2f96'
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
