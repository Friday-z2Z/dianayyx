import tinycolor from 'tinycolor2'
import easingFunctions from '@/libs/easingFunctions'
import { deleteFromList } from '@/utils/deleteFromList'
import { getRandom } from '@/utils/getRandom'

let TARGET = null

// 爆炸碎片类
class ExplosiveDebris {
    constructor(opt) {
        this.firework = opt.firework
        this.x = opt.x
        this.y = opt.y
        this.color = Math.random() >= 0.3 ? opt.color : Math.random() >= 0.5 ? tinycolor.random().toHexString() : '#fff'
        this.radius = opt.radius || 2
        this.angle = getRandom(0, 2 * Math.PI)
        this.speed = opt.speed || getRandom(0.1, 4)
        this.vx = Math.cos(this.angle) * this.speed
        this.vy = Math.sin(this.angle) * this.speed
        this.g = opt.g || 0.98
        this.time = getRandom(0.5, 1)
        this.startTime = 0
        // 痕迹碎片数量
        this.debrisCount = opt.debrisCount || 3
        // 是否要进行二次爆炸
        this.secondBurst = opt.secondBurst || false
    }

    start() {
        this.startTime = Date.now()
    }

    update() {
        const duration = (Date.now() - this.startTime) / 1000
        const vy = this.vy - this.g * duration
        this.x += this.vx
        this.y += vy
        const progress = duration / this.time
        let opacity = progress > 0.7 ? 1 - 1 * progress : 1
        if (opacity < 0) opacity = 0
        drawCircle({
            x: this.x,
            y: this.y,
            color: this.color,
            radius: this.radius,
            opacity: opacity
        })
        // 添加痕迹碎片
        if (this.debrisCount > 0 && Math.random() > 0.8) {
            this.debrisCount--
            this.firework.addDebris({
                x: this.x + getRandom(-2, 2),
                y: this.y + getRandom(-2, 2),
                color: this.color,
                radius: 0.5,
                g: 0.1
            })
        }
        return {
            x: this.x,
            y: this.y,
            isEnd: progress >= 1
        }
    }
}

// 爆炸器类
class Explosive {
    constructor(opt) {
        this.firework = opt.firework
        this.x = opt.x
        this.y = opt.y
        this.color = opt.color
        // 爆炸碎片列表
        this.debrisList = []
        // 爆炸碎片数量
        this.debrisNum = opt.debrisNum || getRandom(50, 400)
        // 是否要二次爆炸
        this.secondBurst = opt.secondBurst || this.debrisNum <= 200
        // 是否是第一次爆炸
        this.isFirstBurst = true
    }

    start(debrisNum, opt = {}) {
        const num = debrisNum || this.debrisNum
        opt.x = opt.x || this.x
        opt.y = opt.y || this.y
        opt.secondBurst = this.secondBurst && this.isFirstBurst
        for (let i = 0; i < num; i++) {
            const explosiveDebris = new ExplosiveDebris({
                firework: this.firework,
                color: this.color,
                ...opt
            })
            explosiveDebris.start()
            this.debrisList.push(explosiveDebris)
        }
        this.isFirstBurst = false
    }

    update() {
        const list = [...this.debrisList]
        list.forEach(debris => {
            const res = debris.update()
            if (res.isEnd) {
                deleteFromList(this.debrisList, debris)
                // 二次爆炸
                if (debris.secondBurst) {
                    this.start(5, {
                        x: res.x,
                        y: res.y,
                        speed: 1
                    })
                }
            }
        })
        return {
            isEnd: list.length <= 0
        }
    }
}

// 痕迹碎片类
class Debris {
    constructor(opt = {}) {
        // 颜色
        this.color = opt.color || '#fff'
        // 透明度
        this.opacity = getRandom(0.1, 0.5)
        // 半径
        this.radius = opt.radius || 1
        // 存在时间
        this.time = getRandom(0.5, 1)
        // 重力，px/s2
        this.g = opt.g || 0.98
        // 位置
        this.x = opt.x
        this.y = opt.y
        // 创建的时间
        this.startTime = 0
    }

    start() {
        this.startTime = Date.now()
    }

    update() {
        const duration = (Date.now() - this.startTime) / 1000
        this.y -= this.g * duration
        drawCircle({
            opacity: this.opacity,
            x: this.x,
            y: this.y,
            radius: this.radius,
            color: this.color
        })
        return {
            x: this.x,
            y: this.y,
            isEnd: duration > this.time
        }
    }
}

// 发射器类
class Launcher {
    constructor(opt = {}) {
        // 烟花实例
        this.firework = opt.firework
        // 颜色
        this.color = opt.color
        // 初始位置
        this.x = opt.x || TARGET.width * getRandom(0.2, 0.8)
        this.y = opt.y || 0
        // 目标位置
        this.ty = TARGET.height * getRandom(0.6, 0.8)
        // 半径
        this.radius = opt.radius || getRandom(2, 5)
        // 发射的持续时间
        this.duration = opt.duration || getRandom(2000, 3500)
        // 发射时的时间
        this.startTime = 0
    }

    start() {
        this.startTime = Date.now()
    }

    update() {
        const x = this.x
        let y = easingFunctions.easeOutCubic(
            Date.now() - this.startTime,
            this.y,
            this.ty - this.y,
            this.duration
        )
        y = Math.min(y, this.ty)
        // 透明度变小
        let opacity = 1 - 1 * (y / this.ty)
        if (opacity < 0) opacity = 0
        this.draw(x, y, opacity)
        // 添加痕迹碎片
        if (Math.random() > 0.7 && opacity >= 0.1) {
            this.firework.addDebris({
                x: x + getRandom(-2, 2), // x坐标添加一段随机量
                y
            })
        }
        return {
            x,
            y,
            isEnd: y >= this.ty // 返回true代表发射结束
        }
    }

    draw(x, y, opacity) {
        // 外圆，烟花的颜色
        drawCircle({
            opacity: opacity,
            x: x,
            y: y,
            radius: this.radius,
            color: this.color
        })
        // 内圆，白色
        drawCircle({
            opacity: opacity,
            x: x,
            y: y,
            radius: this.radius / 2,
            color: '#fff'
        })
    }
}

// 烟花类
class Firework {
    constructor(opt = {}) {
        TARGET = opt.target
        // 颜色
        this.color = opt.color || tinycolor.random().toHexString()
        // 发射器
        this.launcher = null
        // 爆炸器
        this.explosive = null
        // 烟花状态：waiting（等待发射）、launching（发射中）、bursting（爆炸中）、end（烟花结束）
        this.status = 'waiting'
        // 痕迹碎片列表
        this.debrisList = []
    }

    // 发射
    launch() {
        this.launcher = new Launcher({
            firework: this,
            color: this.color
        })
        this.launcher.start()
        this.status = 'launching'
    }

    // 爆炸
    burst({ x, y }) {
        this.explosive = new Explosive({
            firework: this,
            x,
            y,
            color: this.color
        })
        this.explosive.start()
    }

    // 更新
    update() {
        if (this.status === 'launching') {
            const res = this.launcher.update()
            if (res.isEnd) {
                this.status = 'bursting'
                this.burst(res)
            }
        } else if (this.status === 'bursting') {
            const res = this.explosive.update()
            if (res.isEnd) {
                this.status = 'end'
            }
        }
        // 更新痕迹碎片
        this.updateDebris()
    }

    // 添加痕迹碎片
    addDebris(opt = {}) {
        const debris = new Debris({
            ...opt,
            color: opt.color || this.color
        })
        debris.start()
        this.debrisList.push(debris)
    }

    // 更新痕迹碎片
    updateDebris() {
        const list = [...this.debrisList]
        list.forEach(debris => {
            const res = debris.update()
            if (res.isEnd) {
                deleteFromList(this.debrisList, debris)
            }
        })
    }

    isEnd() {
        return this.status === 'end'
    }
}

export {
    Firework
}

const drawCircle = ({ opacity = 1, x, y, radius, color }) => {
    const ctx = TARGET.getContext('2d')
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
}

