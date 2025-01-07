import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const svgFiles = require.context('./svg', true, /\.svg$/)
const iconList = svgFiles.keys().map(item => svgFiles(item))

export default {
    getNameList() {
        return iconList.map(item => item.default.id.replace('icon-', ''))
    }
}

