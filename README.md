# wtf


## Install

```bash
$ yarn
```

```bash
$ yarn dev
$ yarn build
```

## Options

### 实时编译产物

开发过程中我们需要实时编译产物，以便进行调试、验证：

```bash
# 执行 dev 命令，开启实时编译
$ yarn dev
```

一旦源码或配置文件发生变化，产物将会实时增量编译到输出目录。

### 在项目中调试

在测试项目中，使用 `npm link` 命令将该项目链接到测试项目中进行调试、验证：

```bash
$ cd allrivers-test
$ sudo npm link ../allrivers .
```

### 构建及发布

```bash
# 发布一个 patch 版本
$ npm version patch -m "build: release %s"
```

```bash
# NPM 会自动执行 prepublishOnly 脚本然后完成发布
$ npm publish
```

## LICENSE

MIT
