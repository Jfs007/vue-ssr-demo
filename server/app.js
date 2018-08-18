const express = require('express');
const path = require('path');
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer')
const setUpDevServer = require('../build/setup-dev-server');
const Api = require('./routers');
const resolve = fname => path.resolve(__dirname, fname);
const app = express();
const isProd = process.env.NODE_ENV === 'production'
// 静态资源

app.use(express.static(resolve('../dist')));
/// api 测试接口
app.use('/api', Api);

function createRenderer(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
   
    // 
    runInNewContext: false
  }))
}


const templateHtmlPath = resolve('../src/index.template.html');

let renderer = null;
let readyPromise = null;
if (isProd) {
  //
  const template = fs.readFileSync(templateHtmlPath, 'utf-8')
  const bundle = require('../dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('../dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  });
}else {
  readyPromise = setUpDevServer(
    app,
    templateHtmlPath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}



function render(req, res) {
  let url = req.url;
  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      console.log(err, 'err')
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
    }
  }
  let context = {
    url,
    title: 'ssr demo'
  };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
  })
}


app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 8083
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})








