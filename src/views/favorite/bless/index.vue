<template>
    <div ref="textFireWorksContainer" class="bless linear">
        <canvas
            id="textFireWorksCanvas"
            ref="textFireWorksCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
        />
        <div
            id="textFireWorksDiv"
            ref="textFireWorksDiv"
        />
    </div>
</template>
<script>
import * as PIXI from 'pixi.js'

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer({
    // backgroundColor: 'pink',
    backgroundAlpha: 0, // 0:完全透明
    width: window.innerWidth,
    height: window.innerHeight
})
const particles = []
const fireworks = []

export default {
    name: 'Bless',
    data() {
        const width = window.innerWidth
        const height = window.innerHeight
        const lineGap = 30
        const fontSize = Math.ceil((width - 100) / 3)
        const yOffset = (height - (fontSize * 2 + 15)) / 3 - lineGap
        return {
            // 使画布遮瞒全屏
            canvasWidth: width,
            canvasHeight: height,
            // 文字大小，只要把文字放在之前思维导图的位置就可以了
            fontSize: fontSize,
            // 行距
            lineGap: lineGap,
            // 垂直偏移量，也就是顶端空出多少
            yOffset: yOffset,
            textPixels: []
        }
    },
    mounted() {
        this.startTextFireworks()
    },
    methods: {
        startTextFireworks() {
            // 添加PIXI画布
            this.$refs.textFireWorksDiv.appendChild(renderer.view)
            renderer.resize(this.canvasWidth, this.canvasHeight)

            this.initCanvas()
            this.initTextFireworks()
            requestAnimationFrame(this.fireWorksAnimate)
        },
        initCanvas() { // 初始化HTML5画布
            const canvas = this.$refs.textFireWorksCanvas
            const ctx = canvas.getContext('2d')

            // 写字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.font = `${this.fontSize}px "宋体"`
            ctx.fillStyle = '#fff'
            ctx.fillText('源源', this.canvasWidth / 2, 0)// 水平居中，顶端对齐
            ctx.fillText('新春快乐', this.canvasWidth / 2, this.fontSize + 15)// 写在下面，并且行距大一点

            // 获取画布位置
            const pix = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data; const gap = 6
            for (let h = 0; h < this.canvasHeight; h += gap) {
                for (let w = 0; w < this.canvasWidth; w += gap) {
                    // 当前像素块相对于画布的索引位置
                    const position = (this.canvasWidth * h + w) * 4
                    const r = pix[position]
                    const g = pix[position + 1]
                    const b = pix[position + 2]
                    if (r + g + b !== 0) {
                        this.textPixels.push({ x: w, y: h })
                    }
                }
            }
        },
        initTextFireworks() { // 初始化文字烟花
            this.shuffle(this.textPixels)
            const textures = PIXI.Texture.from('https://api.iconify.design/solar:heart-bold.svg?color=%23db4343')
            for (let i = 0, l = this.textPixels.length; i < l; i++) {
                this.createEmojiFirework(textures, this.textPixels[i], i)
            }
            // 清空像素，释放内存
            this.textPixels = []
        },
        shuffle(array) { // 打乱位置
            let currentIndex = array.length
            let temporaryValue
            let randomIndex
            while (currentIndex !== 0) {
                // 选择一个剩余的元素
                randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex -= 1
                temporaryValue = array[currentIndex]
                array[currentIndex] = array[randomIndex]
                array[randomIndex] = temporaryValue
            }

            return array
        },
        createEmojiFirework(text, pos, i) {
            setTimeout(() => {
                const size = 10; const firework = new PIXI.Sprite(text)
                firework.explodePosition = {
                    x: pos.x,
                    y: pos.y + this.yOffset
                }
                firework.position.x = Math.random() * this.canvasWidth
                firework.position.y = this.canvasHeight + Math.random() * 40
                firework.width = size
                firework.height = size
                firework.speed = 0.001 + Math.random() * 0.05
                firework.image = text
                fireworks.push(firework)
                stage.addChild(firework)
            }, i * 10)
        },
        fireWorksAnimate() {
            requestAnimationFrame(this.fireWorksAnimate)
            for (let i = 0, l = particles.length; i < l; i++) {
                particles[i].position.x += particles[i].speed.x
                particles[i].position.y += particles[i].speed.y
                particles[i].speed.y += 0.03
                particles[i].alpha -= 0.01
            }
            for (let i = 0; i < fireworks.length; i++) {
                fireworks[i].position.x += (fireworks[i].explodePosition.x - fireworks[i].position.x) * fireworks[i].speed
                fireworks[i].position.y += (fireworks[i].explodePosition.y - fireworks[i].position.y) * fireworks[i].speed
                if (!fireworks[i].exploded) {
                    if (Math.abs(fireworks[i].position.x - fireworks[i].explodePosition.x) +
          Math.abs(fireworks[i].position.y - fireworks[i].explodePosition.y) <
          100
                    ) {
                        fireworks[i].exploded = true
                        this.explodeFirework(fireworks[i])
                    }
                }
            }
            // 将对象渲染到其 WebGL 视图。
            renderer.render(stage)
        },
        explodeFirework(firework) {
            for (let i = 0; i < 10; i++) {
                const size = this.fontSize / 10 + (Math.random() * this.fontSize) / 10
                const particle = new PIXI.Sprite(firework.image)
                const angle = Math.random() * (2 * Math.PI)
                particle.speed = {
                    x: Math.cos(angle) * (2 + Math.random() * 10) * 0.4,
                    y: Math.sin(angle) * (2 + Math.random() * 10) * 0.4
                }
                particle.position.x = firework.position.x
                particle.position.y = firework.position.y
                particle.width = size
                particle.height = size
                particles.push(particle)
                stage.addChild(particle)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
