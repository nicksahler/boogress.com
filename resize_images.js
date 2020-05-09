const sharp = require('sharp')
const images = require('./assets/config.json')
const Path = require('path')
const fs = require('fs')


const sizes = images.sizes

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file)
      fs.lstatSync(curPath).isDirectory() ?
        deleteFolderRecursive(curPath) :
        fs.unlinkSync(curPath)
    })
    fs.rmdirSync(path)
  }
}

async function resize() {
  deleteFolderRecursive('./assets/thumbs', { recursive: true })
  fs.mkdirSync('assets/thumbs')

  for (let img of images.img_list ) {
    let input = sharp(`assets/images/${img}`)
    let [name, ext] = img.split( '.' )

    for (let size of sizes) {
      let result = await input.resize(size).toFile( `assets/thumbs/${name}-${size}.${ext}`)
      console.log(result)
    }
  }
}

resize()