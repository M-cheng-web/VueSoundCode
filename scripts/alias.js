const path = require('path')

// path.resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径
// 自右向左拼接,如果是 path.resolve(__dirname, '/a') 那么返回 /a
// __dirname是当前文件路径, '../'意思是向上一个目录 然后在上一个目录中找到 p代表的目录
const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}
